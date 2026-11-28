import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { collectInventory, addReviewFindings } from './inventory';
import { GitHubHistory, trustedRun } from './github';
import { DAY, emptyState, lastObservation, reconcile, reserve, seedCaches, settleReservation, type Report, type State } from './model';
import { checkAmazon, checkChewy, coverage, RequestBroker, type Fetcher } from './providers';
import { renderHtml } from './report';

export interface RunOptions {
  root: string;
  output: string;
  mode: 'offline' | 'all' | 'chewy-smoke';
  publish?: boolean;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: Fetcher;
  at?: string;
}
export function writeReport(output: string, report: Report, state: State): void {
  mkdirSync(output, { recursive: true });
  writeFileSync(resolve(output, 'report.json'), `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(resolve(output, 'inventory.html'), renderHtml(report, state));
}
export async function runMaintenance(options: RunOptions): Promise<Report> {
  const env = options.env ?? process.env, at = options.at ?? new Date().toISOString();
  const report: Report = { version: 1, generatedAt: at, mode: options.mode, inventory: [], listings: [], unusedCaches: [], findings: [], queue: [], coverage: {}, integrationStatus: {}, requestAccounting: [], errors: [] };
  let state = emptyState(), history: GitHubHistory | undefined, previousIssue;
  try { Object.assign(report, collectInventory(options.root, at)); }
  catch (error) { report.errors.push(`Offline inventory failed: ${error instanceof Error ? error.message : 'unknown error'}`); }
  const live = options.mode !== 'offline';
  if (live || options.publish) {
    if (!trustedRun(env)) report.errors.push('GitHub writes and live maintenance require a trusted default-branch scheduled or manual Actions run.');
    else {
      try {
        history = new GitHubHistory(env.GITHUB_REPOSITORY!, env.GITHUB_TOKEN!, options.fetchImpl);
        state = await history.load();
        previousIssue = await history.issue();
      } catch { history = undefined; report.errors.push('History or tracking issue could not be read safely; external requests disabled.'); }
    }
  }
  seedCaches(state, report.listings);
  for (const merchant of ['amazon', 'chewy', 'aorkuler']) report.coverage[merchant] = coverage(report.listings.filter((l) => l.merchant === merchant).length);
  report.coverage.aorkuler.detail = 'Manual editorial review; no automatic storefront requests.';
  if (options.publish) {
    if (!env.SERP_API_KEY?.trim() && !env.SERPAPI_KEY?.trim() && !env.SEARCHAPI_KEY?.trim()) report.coverage.amazon = { ...coverage(report.coverage.amazon.total, 'not configured', 'Set SERP_API_KEY and/or SEARCHAPI_KEY in Actions secrets.'), unconfigured: report.coverage.amazon.total, skipped: 0 };
    const missing = ['IMPACT_ACCOUNT_SID', 'IMPACT_AUTH_TOKEN', 'CHEWY_IMPACT_CAMPAIGN_ID', 'CHEWY_IMPACT_AD_ID', 'CHEWY_IMPACT_CATALOG_ID'].filter((key) => !env[key]?.trim());
    if (missing.length) report.coverage.chewy = { ...coverage(report.coverage.chewy.total, 'not configured', `Missing configuration: ${missing.join(', ')}.`), unconfigured: report.coverage.chewy.total, skipped: 0 };
  }
  if (live && history && !report.errors.length) {
    const enabled = options.mode === 'chewy-smoke' ? ['impact'] as const : ['amazon', 'impact'] as const;
    for (const integration of enabled) {
      const name = integration === 'impact' ? 'chewy' : 'amazon';
      const listings = report.listings.filter((l) => l.merchant === name);
      const configured = integration === 'amazon' ? Boolean(env.SERP_API_KEY?.trim() || env.SERPAPI_KEY?.trim() || env.SEARCHAPI_KEY?.trim()) : ['IMPACT_ACCOUNT_SID', 'IMPACT_AUTH_TOKEN', 'CHEWY_IMPACT_CAMPAIGN_ID', 'CHEWY_IMPACT_AD_ID', 'CHEWY_IMPACT_CATALOG_ID'].every((key) => env[key]?.trim());
      let ledger = configured ? reserve(state, integration, `${env.GITHUB_RUN_ID}-${env.GITHUB_RUN_ATTEMPT}`, at) : undefined;
      if (configured && !ledger) {
        report.coverage[name] = { ...coverage(listings.length, 'budget limited', 'Weekly allowance already reserved. Interrupted runs retain their reservation.'), budgetLimited: listings.length, skipped: 0 };
        continue;
      }
      try {
        // The complete allowance is committed BEFORE handing a broker to any
        // integration. Lost/unused slots are not refunded after interruption.
        if (ledger) await history.save(state);
      } catch {
        report.errors.push(`Could not durably reserve ${integration} budget; all remaining external requests disabled.`);
        break;
      }
      ledger ??= { week: '', integration, run: '', at, reserved: 0, used: 0 };
      const broker = new RequestBroker(ledger, options.fetchImpl);
      try {
        const save = () => history!.save(state);
        report.coverage[name] = integration === 'amazon' ? await checkAmazon(listings, state, broker, env, at, save) : await checkChewy(listings, state, broker, env, at, options.mode === 'chewy-smoke', save);
        // Only a completed integration can release unused slots. If this save
        // fails, stop; the durable ref determines the allowance on the next run.
        settleReservation(ledger);
        await save();
      } catch {
        report.errors.push(`${integration} maintenance machinery failed; remaining external requests disabled.`);
        break;
      }
    }
  }
  if (live && !history) for (const name of ['amazon', 'chewy']) {
    report.coverage[name].status = 'offline only'; report.coverage[name].detail = 'No safe durable reservation available; no external requests made.';
  }
  addReviewFindings(report, state);
  reconcile(report, state, previousIssue?.body ?? '');
  for (const listing of report.listings) {
    listing.latestObservation = lastObservation(state, listing.key);
    listing.providerCheckedAt = state.observations.filter((o) => o.listing === listing.key && o.source === 'live').sort((a, b) => b.at.localeCompare(a.at))[0]?.at;
    listing.cacheAgeDays = listing.cacheAt ? Math.max(0, Math.floor((Date.parse(at) - Date.parse(listing.cacheAt)) / DAY)) : undefined;
  }
  report.requestAccounting = state.ledgers;
  report.integrationStatus = Object.fromEntries(Object.entries(report.coverage).map(([name, c]) => [name, c.status]));
  writeReport(options.output, report, state);
  if (history && options.publish) {
    try { await history.publish(report, state, previousIssue); }
    catch { report.errors.push('Reports saved locally, but durable report or tracking-issue publication failed.'); writeReport(options.output, report, state); }
  }
  return report;
}
export function reportFailed(report: Report): boolean {
  return !!report.errors.length || report.findings.some((f) => f.priority === 1) || Object.values(report.coverage).some((c) => c.status === 'integration failure');
}
