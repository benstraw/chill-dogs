import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parse } from 'yaml';
import { spawnSync } from 'node:child_process';
import { addReviewFindings, assembleListings, editorialPlacements, mapChewyCache } from '../scripts/maintenance/inventory';
import { CAPS, DAY, emptyState, isoWeek, lastObservation, makeFinding, reconcile, reserve, seedCaches, selectListings, type Finding, type Listing, type Report } from '../scripts/maintenance/model';
import { amazonObservation, checkAmazon, checkChewy, chewyDestination, chewyObservation, RequestBroker, RequestError, stockVerdict, trackingBase, type Fetcher } from '../scripts/maintenance/providers';
import { GitHubHistory, trustedRun, validateState } from '../scripts/maintenance/github';
import { renderHtml, renderIssue } from '../scripts/maintenance/report';
import { reportFailed, runMaintenance } from '../scripts/maintenance/run';
import type { ProductCatalogItem } from '../data/product-catalog';
import { main } from '../../scripts/product-maintenance';

const at = '2026-11-23T13:00:00.000Z';
const listing = (id = 'B00027466A'): Listing => ({ key: `amazon:${id}`, merchant: 'amazon', id, url: `https://www.amazon.com/dp/${id}`, owners: [{ productId: 'dog-bed' }] });
const amazonPayload = (id = 'B00027466A', stock: unknown = 'In Stock') => ({ product_results: { asin: id, title: 'Dog bed', availability: stock } });
const chewy: Listing = { key: 'chewy:dog-bed', merchant: 'chewy', id: 'https://www.chewy.com/dp/191279', canonicalUrl: 'https://www.chewy.com/dog-bed/dp/191279', url: 'https://chewy.sjv.io/c/7067825/3054490/32975?u=https%3A%2F%2Fwww.chewy.com%2Fdog-bed%2Fdp%2F191279', owners: [{ productId: 'dog-bed' }], itemId: 'product_24727_306301', catalogId: '24727' };
const chewyPayload = () => ({ Id: chewy.itemId, CatalogId: '24727', CatalogItemId: '306301', Name: 'Dog bed', Url: chewy.url, StockAvailability: 'InStock' });
const env = { IMPACT_ACCOUNT_SID: 'fixture-sid', IMPACT_AUTH_TOKEN: 'fixture-token', CHEWY_IMPACT_CAMPAIGN_ID: '32975', CHEWY_IMPACT_AD_ID: '3054490', CHEWY_IMPACT_CATALOG_ID: '24727' };
const finding = (id = 'review-dog-bed', routine = true): Finding => makeFinding({ id, productId: 'dog-bed', name: 'Dog bed', pages: ['/article/'], at, priority: routine ? 5 : 2, evidence: 'Evidence', action: 'Review it', routine });
const report = (findings: Finding[] = []): Report => ({ version: 1, generatedAt: at, mode: 'offline', inventory: [{ id: 'dog-bed', name: 'Dog bed', source: 'fixture', pages: ['/article/'], prominent: false, listings: [listing().key] }], listings: [listing()], findings, queue: [], unusedCaches: [], coverage: {}, integrationStatus: {}, requestAccounting: [], errors: [] });
const json = (payload: unknown, status = 200) => new Response(JSON.stringify(payload), { status });
const broker = (state = emptyState(), integration: 'amazon' | 'impact' = 'amazon', fetchImpl: Fetcher = vi.fn(async () => json(amazonPayload()))) => new RequestBroker(reserve(state, integration, 'run', at)!, fetchImpl, () => at);
const cleanup: string[] = [];
afterEach(() => { for (const dir of cleanup.splice(0)) rmSync(dir, { recursive: true, force: true }); vi.restoreAllMocks(); });

describe('durable request allowances', () => {
  it.each([['2027-01-01', '2026-W53'], ['2026-11-23', '2026-W48'], ['2026-11-29T23:59:59Z', '2026-W48'], ['2026-11-30T00:00:00Z', '2026-W49']])('uses UTC ISO weeks: %s', (date, week) => expect(isoWeek(date)).toBe(week));
  it.each(['amazon', 'impact'] as const)('retains %s reservations after a crash and rerun', (name) => {
    const state = emptyState(); const lease = reserve(state, name, 'first-run', at)!;
    expect(lease.reserved).toBe(CAPS[name]); lease.used = 1;
    const reloaded = validateState(JSON.parse(JSON.stringify(state)));
    expect(reserve(reloaded, name, 'retry-run', at)).toBeUndefined();
    expect(reserve(reloaded, name, 'next-week', '2026-11-30T00:00:00Z')?.reserved).toBe(CAPS[name]);
  });
  it.each(['amazon', 'impact'] as const)('counts retries and stops at the %s cap', async (name) => {
    const fetcher = vi.fn(async () => json({}, 503)); const b = broker(emptyState(), name, fetcher);
    for (let i = 0; i < 30; i++) await b.json(name, new URL('https://example.test')).catch(() => {});
    expect(fetcher).toHaveBeenCalledTimes(CAPS[name]); expect(b.ledger.used).toBe(CAPS[name]);
  });
  it('does not carry a lease across a UTC week boundary', async () => {
    const state = emptyState(), fetcher = vi.fn();
    const b = new RequestBroker(reserve(state, 'amazon', 'run', at)!, fetcher, () => '2026-11-30T00:00:00Z');
    await expect(b.json('serpapi', new URL('https://example.test'))).rejects.toMatchObject({ kind: 'budget' }); expect(fetcher).not.toHaveBeenCalled();
  });
  it.each([429, 402, 401, 403])('stops a provider on HTTP %s', async (status) => {
    const fetcher = vi.fn(async () => json({}, status)); const b = broker(emptyState(), 'amazon', fetcher);
    await b.json('serpapi', new URL('https://example.test')).catch(() => {});
    await b.json('serpapi', new URL('https://example.test')).catch(() => {});
    expect(fetcher).toHaveBeenCalledTimes(1);
  });
  it('counts fallback requests in the same Amazon allowance', async () => {
    const state = emptyState(); const fetcher = vi.fn(async (url: string | URL) => new URL(url).hostname === 'serpapi.com' ? json({ error: 'quota exceeded' }) : json(amazonPayload(new URL(url).searchParams.get('asin')!)));
    const b = broker(state, 'amazon', fetcher);
    const listings = Array.from({ length: 40 }, (_, i) => listing(`B${String(i).padStart(9, '0')}`));
    const result = await checkAmazon(listings, state, b, { SERP_API_KEY: 'secret', SEARCHAPI_KEY: 'secret' }, at, async () => {});
    expect(fetcher).toHaveBeenCalledTimes(25); expect(result.budgetLimited).toBeGreaterThan(0);
    expect(fetcher.mock.calls.filter(([url]) => new URL(url).hostname === 'serpapi.com')).toHaveLength(1);
    expect(JSON.stringify(state)).not.toContain('api_key'); expect(JSON.stringify(state)).not.toContain('secret');
  });
  it('limits followup HTTP attempts, including retries, to five Amazon slots', async () => {
    const state = emptyState(); const items = Array.from({ length: 40 }, (_, i) => listing(`B${String(i).padStart(9, '0')}`));
    for (const item of items.slice(0, 10)) state.observations.push(amazonObservation(amazonPayload(item.id, 'Out of stock'), item, '2026-01-01T00:00:00Z', 'serpapi'));
    const problemIds = new Set(items.slice(0, 10).map((l) => l.id));
    const fetcher = vi.fn(async (url: string | URL) => problemIds.has(new URL(url).searchParams.get('asin')!) ? json({}, 503) : json(amazonPayload(new URL(url).searchParams.get('asin')!)));
    const b = broker(state, 'amazon', fetcher);
    await checkAmazon(items, state, b, { SERP_API_KEY: 'fixture' }, at, async () => {});
    expect(fetcher.mock.calls.filter(([url]) => problemIds.has(new URL(url).searchParams.get('asin')!))).toHaveLength(5);
    expect(fetcher).toHaveBeenCalledTimes(25);
  });
  it('retains primary authentication failures when fallback succeeds', async () => {
    const state = emptyState(); const fetcher = vi.fn(async (url: string | URL) => new URL(url).hostname === 'serpapi.com' ? json({}, 401) : json(amazonPayload()));
    const c = await checkAmazon([listing()], state, broker(state, 'amazon', fetcher), { SERP_API_KEY: 'fixture', SEARCHAPI_KEY: 'fixture' }, at, async () => {});
    expect(c.status).toBe('integration failure'); expect(state.observations[0].verdict).toBe('available'); expect(c.detail).toContain('auth');
  });
  it('retries timeouts once and supplies a 15 second abort signal without logging URLs', async () => {
    const fetcher = vi.fn<Fetcher>(async () => { throw new Error('https://bad.test?api_key=secret'); }); const b = broker(emptyState(), 'amazon', fetcher);
    await expect(b.json('serpapi', new URL('https://example.test'))).rejects.toThrow('serpapi: transient');
    expect(fetcher).toHaveBeenCalledTimes(2); expect(fetcher.mock.calls[0][1]).toMatchObject({ signal: expect.any(AbortSignal), redirect: 'error' });
  });
  it.each([{ error: 'invalid API key' }, { errors: ['unknown schema'] }])('handles HTTP 200 provider errors', async (payload) => {
    const b = broker(emptyState(), 'amazon', vi.fn(async () => json(payload)));
    await expect(b.json('serpapi', new URL('https://example.test'))).rejects.toBeInstanceOf(RequestError);
  });
  it('fails closed on corrupt ledgers', () => {
    expect(() => validateState({})).toThrow();
    const s = emptyState(); const l = reserve(s, 'amazon', 'run', at)!; l.reserved = 26;
    expect(() => validateState(s)).toThrow('exceeds'); l.reserved = Number.NaN;
    expect(() => validateState(s)).toThrow('Invalid budget');
    const invalid = emptyState(); reserve(invalid, 'amazon', 'run', at);
    (invalid.ledgers[0] as unknown as { integration: unknown }).integration = ['amazon'];
    expect(() => validateState(invalid)).toThrow('Invalid budget');
  });
});

describe('merchant observations', () => {
  it.each([undefined, {}, { availability: 'Captcha' }, { availability: 'Delivery next week' }])('never treats an ambiguous Amazon result as unavailable: %j', (value) => {
    const payload = value === undefined ? {} : { product_results: { asin: listing().id, title: 'Dog bed', ...value } };
    expect(amazonObservation(payload, listing(), at, 'serpapi').verdict).not.toBe('unavailable');
  });
  it('validates returned identity rather than the request parameters', () => {
    expect(amazonObservation({ ...amazonPayload(), search_metadata: { status: 'Processing' } }, listing(), at, 'serpapi').verdict).toBe('integration-failure');
    expect(amazonObservation({ ...amazonPayload('B999999999'), search_parameters: { asin: listing().id } }, listing(), at, 'serpapi').verdict).toBe('identity-mismatch');
    expect(amazonObservation(amazonPayload(undefined, 'Currently unavailable'), listing(), at, 'serpapi').verdict).toBe('unavailable');
    expect(amazonObservation({ ...amazonPayload(), newer_model: { asin: 'B999999999' } }, listing(), at, 'serpapi').newerModel).toBe('B999999999');
  });
  it.each([['InStock', 'available'], ['OutOfStock', 'unavailable'], ['Backorder', 'unknown'], [true, 'available'], [false, 'unavailable'], [{}, 'unknown']])('normalizes stock %j', (stock, expected) => expect(stockVerdict(stock)).toBe(expected));
  it('maps actual Impact IDs by decoded canonical destination, never by title or /dp/ number', () => {
    const target = { ...chewy, itemId: undefined }; const item = { ...chewyPayload(), Uri: '/Mediapartners/fixture/Catalogs/24727/Item/product_24727_306301' };
    mapChewyCache(target, [item], { '306301': { fetchedAt: at } });
    expect(target.itemId).toBe('product_24727_306301'); expect(target.itemId).not.toContain('191279'); expect(target.cached?.source).toBe('cache');
    expect(target.itemEndpoint).toBe('Item');
    const badUri = { ...chewy, itemId: undefined }; mapChewyCache(badUri, [{ ...item, Uri: '/Mediapartners/fixture/Catalogs/111/Item/product_24727_306301' }], {}); expect(badUri.itemId).toBeUndefined();
    const unmapped = { ...chewy, itemId: undefined }; mapChewyCache(unmapped, [{ ...item, Url: 'https://www.chewy.com/other/dp/111111' }], {}); expect(unmapped.itemId).toBeUndefined();
    const ambiguous = { ...chewy, itemId: undefined }; mapChewyCache(ambiguous, [item, item], {}); expect(ambiguous.itemId).toBeUndefined();
    expect(chewyDestination('not a url')).toBeUndefined(); expect(chewyDestination('https://other.com/dp/191279')).toBeUndefined();
  });
  it('separates stock, schema failures, and identity mismatches for Chewy', () => {
    expect(chewyObservation(chewyPayload(), chewy, at)).toMatchObject({ verdict: 'available', stock: 'InStock' });
    expect(chewyObservation({}, chewy, at).verdict).toBe('integration-failure');
    expect(chewyObservation({ ...chewyPayload(), Id: '191279' }, chewy, at).verdict).toBe('identity-mismatch');
    expect(chewyObservation({ ...chewyPayload(), StockAvailability: undefined }, chewy, at).verdict).toBe('unknown');
  });
  it('requires real Impact credentials even with a cached tracking base or proxy', async () => {
    const fetcher = vi.fn(); const c = await checkChewy([chewy], emptyState(), broker(emptyState(), 'impact', fetcher), { HTTPS_PROXY: 'proxy', CHEWY_IMPACT_BASE_URL: chewy.url }, at, true, async () => {});
    expect(c.status).toBe('not configured'); expect(fetcher).not.toHaveBeenCalled();
  });
  it('authenticates program, compares tracking base, then verifies a referenced item', async () => {
    const fetcher = vi.fn(async (_url: string | URL, init?: RequestInit) => {
      expect((init?.headers as any).Authorization).toBe(`Basic ${Buffer.from('fixture-sid:fixture-token').toString('base64')}`);
      const path = new URL(_url).pathname;
      return json(path.endsWith('/Campaigns/32975') ? { CampaignId: '32975', CampaignName: 'Chewy' } : path.endsWith('/TrackingLink') ? { TrackingLink: 'https://chewy.sjv.io/c/7067825/3054490/32975' } : chewyPayload());
    });
    const state = emptyState(); const b = broker(state, 'impact', fetcher);
    const c = await checkChewy([{ ...chewy, itemEndpoint: 'Item' }], state, b, env, at, true, async () => {});
    expect(c.status).toBe('checked'); expect(c.checked).toBe(1); expect(b.ledger.used).toBe(3);
    expect(String(fetcher.mock.calls[2][0])).toContain('/Item/product_24727_306301');
  });
  it.each(['auth', 'wrong-program', 'wrong-partner', 'wrong-ad', 'schema'])('reports Chewy verification failure: %s', async (failure) => {
    const fetcher = vi.fn(async (url: string | URL) => {
      if (failure === 'auth') return json({}, 401);
      if (new URL(url).pathname.includes('/Campaigns/')) return json({ CampaignId: '32975', CampaignName: failure === 'wrong-program' ? 'Other' : 'Chewy' });
      return json({ TrackingLink: failure === 'wrong-partner' ? 'https://chewy.sjv.io/c/999/3054490/32975' : failure === 'wrong-ad' ? 'https://chewy.sjv.io/c/7067825/1/32975' : undefined });
    });
    const c = await checkChewy([chewy], emptyState(), broker(emptyState(), 'impact', fetcher), env, at, true, async () => {});
    expect(c.status).toBe('integration failure'); expect(c.checked).toBe(0);
  });
  it('caps weekly Impact coverage including verification, transient retries, and 404 item responses', async () => {
    const state = emptyState(); let n = 0;
    const fetcher = vi.fn(async () => { n++; return n === 1 ? json({ CampaignId: '32975', AdvertiserName: 'Chewy' }) : n === 2 ? json({ TrackingLink: trackingBase(chewy.url) }) : n % 2 ? json({}, 503) : json({}, 404); });
    const items = Array.from({ length: 12 }, (_, i) => ({ ...chewy, key: `chewy:${i}` }));
    const c = await checkChewy(items, state, broker(state, 'impact', fetcher), env, at, false, async () => {});
    expect(fetcher).toHaveBeenCalledTimes(10); expect(c.budgetLimited).toBeGreaterThan(0); expect(state.observations.every((o) => o.verdict === 'missing-item')).toBe(true);
  });
});

describe('inventory, rotation, and human review', () => {
  it('keeps dated negative evidence through unknown results and resolves it only after positive evidence', () => {
    const state = emptyState(); const first = '2026-11-01T00:00:00.000Z', second = '2026-11-08T00:00:00.000Z';
    state.observations.push(amazonObservation(amazonPayload(undefined, 'Out of stock'), listing(), first, 'serpapi'));
    state.observations.push(amazonObservation(amazonPayload(undefined, 'Out of stock'), listing(), second, 'serpapi'));
    state.observations.push({ listing: listing().key, at, source: 'live', provider: 'serpapi', verdict: 'unknown', detail: 'timeout' });
    let r = report(); addReviewFindings(r, state); const problem = r.findings.find((f) => f.id.startsWith('listing-'))!;
    expect(problem.priority).toBe(2); expect(problem.at).toBe(second);
    state.observations.push(amazonObservation(amazonPayload(undefined, 'Not supplied'), listing(), '2026-11-24T00:00:00Z', 'serpapi'));
    r = report(); addReviewFindings(r, state); expect(r.findings.some((f) => f.id.startsWith('listing-'))).toBe(true);
    state.observations.push(amazonObservation(amazonPayload(), listing(), '2026-11-25T00:00:00Z', 'serpapi'));
    r = report(); addReviewFindings(r, state); expect(r.findings.some((f) => f.id.startsWith('listing-'))).toBe(false);
    state.observations.push(amazonObservation(amazonPayload('B999999999'), listing(), '2026-11-26T00:00:00Z', 'serpapi'));
    r = report(); addReviewFindings(r, state); expect(r.findings.some((f) => f.evidence.includes('identity-mismatch'))).toBe(true);
    state.observations.push(amazonObservation(amazonPayload(undefined, 'Not supplied'), listing(), '2026-11-27T00:00:00Z', 'serpapi'));
    r = report(); addReviewFindings(r, state); expect(r.findings.some((f) => f.id.startsWith('listing-'))).toBe(false);
  });
  it('retains every default and variant owner while deduplicating a shared ASIN', () => {
    const offer = { merchant: 'amazon' as const, asin: listing().id, url: listing().url };
    const products = [{ id: 'first', offers: [offer], variantGroup: { variants: [{ id: 'large', offers: [offer] }, { id: 'retired', status: 'unavailable', offers: [offer] }] } }, { id: 'second', offers: [offer] }] as unknown as ProductCatalogItem[];
    expect(assembleListings(products)).toHaveLength(1);
    expect(assembleListings(products)[0].owners).toEqual([{ productId: 'first', variantId: undefined }, { productId: 'first', variantId: 'large' }, { productId: 'second', variantId: undefined }]);
  });
  it('counts homepage and article cards, excluding browse/detail/admin/redirect pages and script data', () => {
    const html = `<a data-asin="${listing().id}" href="${listing().url}">Buy</a>`;
    const pages = [{ pathname: '/', html }, { pathname: '/article/', html }, { pathname: '/shop/dog-bed/', html }, { pathname: '/shop/', html }, { pathname: '/admin/products/', html }, { pathname: '/retired/', html: `<meta http-equiv="refresh">${html}` }, { pathname: '/empty/', html: `<script>${html}</script>` }];
    const placements = editorialPlacements(pages, [listing()], ['dog-bed']);
    expect(placements.get('dog-bed')).toEqual(['/', '/article/']);
  });
  it('seeds cache evidence at its original date, rotates old observations, and limits followups to five', () => {
    const state = emptyState(); const items = Array.from({ length: 40 }, (_, i) => listing(`B${String(i).padStart(9, '0')}`));
    items[0].cached = amazonObservation(amazonPayload(items[0].id), items[0], '2026-01-01T00:00:00Z', 'serpapi', 'cache');
    seedCaches(state, items); seedCaches(state, items); expect(state.observations).toHaveLength(1);
    for (const item of items.slice(10, 20)) state.observations.push({ ...amazonObservation(amazonPayload(item.id, 'Out of stock'), item, '2026-01-02T00:00:00Z', 'serpapi') });
    state.observations.push(amazonObservation(amazonPayload(items[1].id), items[1], at, 'serpapi'));
    const chosen = selectListings(items, state, at, 25);
    expect(chosen).toHaveLength(25); expect(chosen.filter((l) => lastObservation(state, l.key)?.verdict === 'unavailable')).toHaveLength(5); expect(chosen).not.toContain(items[1]);
    expect(state.observations[0].at).toBe('2026-01-01T00:00:00Z');
  });
  it('records routine checks, preserves checked tasks and human notes', () => {
    const state = emptyState(), first = report([finding()]); reconcile(first, state);
    const body = renderIssue(first, state, 'Human notes: keep this.', 'https://example.test/report');
    const next = report([finding()]);
    const edited = body.replace('- [ ]', '- [x]').replace('<!-- product-maintenance:end -->', 'Ben: compare the replacement model.\n<!-- product-maintenance:end -->');
    reconcile(next, state, edited);
    expect(state.reviews['dog-bed']).toBe(at); expect(next.queue).toHaveLength(0);
    const regenerated = renderIssue(next, state, edited, 'https://example.test/report');
    expect(regenerated).toContain('- [x]'); expect(regenerated).toContain('Human notes: keep this.'); expect(regenerated).toContain('Ben: compare the replacement model.');
  });
  it('acknowledges a concrete problem without resolving it, resurfaces after 14 days or changed evidence', () => {
    const state = emptyState(), f = finding('listing-dog-bed', false), first = report([f]); reconcile(first, state);
    const checked = renderIssue(first, state, '', 'https://example.test').replace('- [ ]', '- [x]');
    const next = report([f]); reconcile(next, state, checked); expect(next.queue).toHaveLength(0); expect(state.findings[f.id].resolvedAt).toBeUndefined();
    const changed = report([makeFinding({ ...f, evidence: 'New mismatch' })]); reconcile(changed, state, checked); expect(changed.queue).toHaveLength(1);
    const later = report([f]); later.generatedAt = new Date(Date.parse(at) + 14 * DAY).toISOString(); reconcile(later, state, checked); expect(later.queue).toHaveLength(1);
    const checkedAgain = renderIssue(later, state, checked, 'https://example.test').replace('- [ ]', '- [x]');
    reconcile(later, state, checkedAgain); expect(later.queue).toHaveLength(0); expect(state.findings[f.id].acknowledgments).toHaveLength(2);
    const resolved = report(); reconcile(resolved, state, checked); expect(state.findings[f.id].resolvedAt).toBe(at);
  });
  it('ranks deterministic problems ahead of exposure and caps the queue at five', () => {
    const r = report(Array.from({ length: 10 }, (_, i) => makeFinding({ ...finding(`review-${i}`), productId: `product-${i}`, priority: i === 9 ? 1 : 5 })));
    reconcile(r, emptyState()); expect(r.queue).toHaveLength(5); expect(r.queue[0].priority).toBe(1);
  });
  it('escapes reports and keeps cache, provider-check, and human-review dates separate', () => {
    const r = report([finding()]); r.inventory[0].name = '<script>alert(1)</script>'; const s = emptyState();
    s.observations.push(amazonObservation(amazonPayload(), listing(), at, 'serpapi'));
    const html = renderHtml(r, s); expect(html).toContain('&lt;script&gt;'); expect(html).toContain('Cache: not recorded'); expect(html).toContain(`Provider check: ${at}`); expect(html).toContain('Human review');
    expect(html).toContain('href="https://www.chill-dogs.com/article/"'); expect(html).toContain(`href="${listing().url}"`);
  });
});

describe('workflow and failure isolation', () => {
  it('gates an existing report without network and validates CLI options', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'maintenance-cli-')); cleanup.push(dir);
    writeFileSync(join(dir, 'report.json'), JSON.stringify(report()));
    expect(await main(['--gate', '--output', dir])).toBe(0);
    writeFileSync(join(dir, 'report.json'), JSON.stringify(report([makeFinding({ ...finding(), priority: 1 })])));
    expect(await main(['--gate', '--output', dir])).toBe(1);
    await expect(main(['--bad'])).rejects.toThrow('Choose');
    await expect(main(['--offline', '--live'])).rejects.toThrow('Choose');
    await expect(main(['--output'])).rejects.toThrow('directory');
  });
  it('preserves a failed checker exit through the same Bash log pipeline used in Actions', () => {
    const dir = mkdtempSync(join(tmpdir(), 'maintenance-pipeline-')); cleanup.push(dir);
    const failed = spawnSync('bash', ['--noprofile', '--norc', '-e', '-o', 'pipefail', '-c', '{ printf "checker failed\\n"; exit 7; } 2>&1 | tee report.log'], { cwd: dir });
    expect(failed.status).toBe(7); expect(readFileSync(join(dir, 'report.log'), 'utf8')).toBe('checker failed\n');
  });
  it('keeps PR audits offline and uses explicit Bash pipefail behavior with independent publication and gate', () => {
    const workflow = parse(readFileSync('.github/workflows/integration-checks.yml', 'utf8'));
    expect(workflow.defaults.run.shell).toBe('bash');
    expect(workflow.concurrency).toEqual({ group: 'product-maintenance', 'cancel-in-progress': false });
    const steps = workflow.jobs.maintenance.steps;
    for (const id of ['build', 'offline', 'maintenance']) expect(steps.find((s: any) => s.id === id)['continue-on-error']).toBe(true);
    expect(steps.find((s: any) => s.name === 'Upload complete reports').if).toBe('always()');
    expect(steps.at(-1).if).toBe('always()'); expect(steps.at(-1).run).toContain('MAINTENANCE_RESULT');
    const ci = readFileSync('.github/workflows/ci.yml', 'utf8'); expect(ci).toContain('maintenance:offline'); expect(ci).not.toContain('IMPACT_AUTH_TOKEN');
    expect(trustedRun({ GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main', GITHUB_EVENT_NAME: 'schedule' })).toBe(true);
    expect(trustedRun({ GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/feature', GITHUB_EVENT_NAME: 'workflow_dispatch' })).toBe(false);
    expect(trustedRun({ GITHUB_ACTIONS: 'true', GITHUB_REF: 'refs/heads/main', GITHUB_EVENT_NAME: 'pull_request' })).toBe(false);
    expect(JSON.parse(readFileSync('vercel.json', 'utf8')).git.deploymentEnabled['maintenance-data']).toBe(false);
  });
  it('writes a complete failure report when inventory collection fails, without network', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'maintenance-')); cleanup.push(dir);
    const fetchImpl = vi.fn(); const r = await runMaintenance({ root: dir, output: join(dir, 'report'), mode: 'offline', fetchImpl, at });
    expect(reportFailed(r)).toBe(true); expect(fetchImpl).not.toHaveBeenCalled();
    expect(JSON.parse(readFileSync(join(dir, 'report/report.json'), 'utf8')).errors).toHaveLength(1);
    expect(readFileSync(join(dir, 'report/inventory.html'), 'utf8')).toContain('Offline inventory failed');
  });
});

// A tiny Git database models fast-forward ref updates. Two runners reading the
// same head cannot both commit a reservation; the loser never gets a broker.
function fakeGitHub() {
  let head: string | undefined, n = 0;
  const issues: any[] = [];
  let label = false;
  const blobs = new Map<string, any>(), trees = new Map<string, any>(), commits = new Map<string, any>();
  const fetcher = vi.fn(async (input: string | URL, init?: RequestInit) => {
    const url = new URL(input), path = url.pathname.split('/chill-dogs/')[1], body = init?.body ? JSON.parse(String(init.body)) : undefined;
    if (path === 'issues' && init?.method === 'POST') { issues.push({ ...body, number: 1, state: 'open', updated_at: String(++n) }); return json(issues[0]); }
    if (path === 'issues') return json(issues);
    if (path === 'issues/1' && init?.method === 'PATCH') { Object.assign(issues[0], body, { updated_at: String(++n) }); return json(issues[0]); }
    if (path === 'labels/merchant-check') return json({}, label ? 200 : 404);
    if (path === 'labels') { label = true; return json(body); }
    if (path === 'git/ref/heads/maintenance-data') return head ? json({ object: { sha: head } }) : json({}, 404);
    if (path.startsWith('git/commits/')) return json(commits.get(path.split('/').pop()!));
    if (path === 'contents/state.json') {
      const commit = commits.get(url.searchParams.get('ref')!);
      const tree = trees.get(commit.tree.sha);
      return json({ encoding: 'base64', content: Buffer.from(blobs.get(tree.find((e: any) => e.path === 'state.json').sha)).toString('base64') });
    }
    if (path === 'git/blobs') { const sha = `blob${++n}`; blobs.set(sha, body.content); return json({ sha }); }
    if (path === 'git/trees') { const sha = `tree${++n}`; trees.set(sha, body.tree); return json({ sha }); }
    if (path === 'git/commits') { const sha = `commit${++n}`; commits.set(sha, { ...body, tree: { sha: body.tree } }); return json({ sha }); }
    if (path === 'git/refs' || path === 'git/refs/heads/maintenance-data') {
      if (path === 'git/refs' ? !!head : commits.get(body.sha).parents[0] !== head) return json({}, 422);
      head = body.sha; return json({});
    }
    throw new Error(`Unexpected fixture route ${path}`);
  });
  return { fetcher, blobs, commits, issues };
}
describe('history branch write isolation', () => {
  it('publishes complete reports, maintains one issue, preserves human notes, and avoids unchanged issue writes', async () => {
    const fake = fakeGitHub(), client = new GitHubHistory('benstraw/chill-dogs', 'fixture', fake.fetcher);
    const state = await client.load(), r = report([finding()]); reconcile(r, state);
    await client.publish(r, state); expect(fake.issues).toHaveLength(1);
    expect(fake.issues[0].assignees).toEqual(['benstraw']); expect(fake.issues[0].labels).toContain('merchant-check');
    fake.issues[0].body += '\nBen: keep this note.';
    let old = await client.issue(); await client.publish(r, state, old);
    expect(fake.issues[0].body).toContain('Ben: keep this note.');
    const writesBefore = fake.fetcher.mock.calls.filter(([url, init]) => String(url).endsWith('/issues/1') && init?.method === 'PATCH').length;
    old = await client.issue(); await client.publish(r, state, old);
    expect(fake.fetcher.mock.calls.filter(([url, init]) => String(url).endsWith('/issues/1') && init?.method === 'PATCH')).toHaveLength(writesBefore);
    expect([...fake.blobs.values()].some((content) => content.includes('<!doctype html>'))).toBe(true);
    fake.issues[0].state = 'closed'; old = await client.issue(); await client.publish(r, state, old);
    expect(fake.issues[0].state).toBe('open'); expect(fake.issues).toHaveLength(1);
    expect(fake.fetcher.mock.calls.some(([url]) => String(url).includes('/comments'))).toBe(false);
  });
  it('saves reports but refuses to overwrite a concurrently edited issue', async () => {
    const fake = fakeGitHub(), client = new GitHubHistory('benstraw/chill-dogs', 'fixture', fake.fetcher);
    const state = await client.load(), r = report([finding()]); reconcile(r, state); await client.publish(r, state);
    const old = structuredClone(await client.issue()); fake.issues[0].updated_at = 'human-edit'; fake.issues[0].body += '\nConcurrent human note';
    await expect(client.publish(r, state, old)).rejects.toThrow('changed during'); expect(fake.issues[0].body).toContain('Concurrent human note');
  });
  it('rejects a concurrent bootstrap before either losing runner can spend a budget', async () => {
    const fake = fakeGitHub(), a = new GitHubHistory('benstraw/chill-dogs', 'fixture', fake.fetcher), b = new GitHubHistory('benstraw/chill-dogs', 'fixture', fake.fetcher);
    const sa = await a.load(), sb = await b.load(); reserve(sa, 'impact', 'a', at); reserve(sb, 'impact', 'b', at);
    await a.save(sa); await expect(b.save(sb)).rejects.toThrow('HTTP 422');
  });
  it('bootstraps an orphan nondeploying branch and rejects a concurrent reservation', async () => {
    const fake = fakeGitHub(); const first = new GitHubHistory('benstraw/chill-dogs', 'fixture-token', fake.fetcher);
    const initial = await first.load(); await first.save(initial);
    expect([...fake.commits.values()][0].parents).toEqual([]);
    expect([...fake.blobs.values()]).toContain('{"git":{"deploymentEnabled":false}}\n');
    const a = new GitHubHistory('benstraw/chill-dogs', 'fixture-token', fake.fetcher), b = new GitHubHistory('benstraw/chill-dogs', 'fixture-token', fake.fetcher);
    const sa = await a.load(), sb = await b.load(); reserve(sa, 'amazon', 'a', at); reserve(sb, 'amazon', 'b', at);
    await a.save(sa); await expect(b.save(sb)).rejects.toThrow('HTTP 422');
    const reload = new GitHubHistory('benstraw/chill-dogs', 'fixture-token', fake.fetcher);
    expect(reserve(await reload.load(), 'amazon', 'rerun', at)).toBeUndefined();
    await expect(a.save(sa, { 'src/data/product-catalog.ts': 'overwrite' })).rejects.toThrow('restricted');
    expect(fake.fetcher.mock.calls.some(([url]) => String(url).endsWith('/refs/heads/main'))).toBe(false);
  });
});
