import { CAPS, emptyState, isoWeek, type Report, type State } from './model';
import { renderHtml, renderIssue } from './report';
import type { Fetcher } from './providers';

export const HISTORY_BRANCH = 'maintenance-data';
export interface Issue { number: number; body: string | null; state: string; updated_at: string }
export function validateState(value: unknown): State {
  const s = value as State;
  if (!s || s.version !== 1 || !Array.isArray(s.observations) || !Array.isArray(s.ledgers) || !s.reviews || !s.findings || typeof s.reviews !== 'object' || typeof s.findings !== 'object' || Array.isArray(s.reviews) || Array.isArray(s.findings)) throw new Error('Invalid maintenance state; external requests disabled.');
  if (Object.values(s.reviews).some((date) => !Number.isFinite(Date.parse(date))) || Object.values(s.findings).some((h) => !h || !/^[a-f0-9]{16}$/.test(h.fingerprint) || !Number.isFinite(Date.parse(h.firstSeen)) || !Number.isFinite(Date.parse(h.lastSeen)))) throw new Error('Invalid review or finding history.');
  for (const l of s.ledgers) {
    if (typeof l.integration !== 'string' || !Object.hasOwn(CAPS, l.integration) || !Number.isInteger(l.reserved) || !Number.isInteger(l.used) || l.reserved < 0 || l.used < 0 || l.used > l.reserved || typeof l.week !== 'string' || !/^\d{4}-W\d{2}$/.test(l.week) || typeof l.run !== 'string' || !l.run || typeof l.at !== 'string' || !Number.isFinite(Date.parse(l.at)) || isoWeek(l.at) !== l.week) throw new Error('Invalid budget ledger; external requests disabled.');
    const total = s.ledgers.filter((other) => other.integration === l.integration && other.week === l.week).reduce((n, other) => n + other.reserved, 0);
    if (total > CAPS[l.integration]) throw new Error('Budget ledger exceeds weekly cap.');
  }
  if (s.observations.some((o) => !o.listing || !Number.isFinite(Date.parse(o.at)) || !['live', 'cache'].includes(o.source) || !['available', 'unavailable', 'unknown', 'identity-mismatch', 'integration-failure', 'missing-item'].includes(o.verdict))) throw new Error('Invalid observation history.');
  return s;
}
export class GitHubHistory {
  head?: string;
  tree?: string;
  constructor(private repo: string, private token: string, private fetchImpl: Fetcher = fetch) {
    if (!/^[\w.-]+\/[\w.-]+$/.test(repo) || !token) throw new Error('Missing GitHub repository or token.');
  }
  private async api(path: string, method = 'GET', body?: unknown, allowMissing = false): Promise<any> {
    const response = await this.fetchImpl(`https://api.github.com/repos/${this.repo}/${path}`, { method, headers: { Authorization: `Bearer ${this.token}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }, ...(body ? { body: JSON.stringify(body) } : {}), signal: AbortSignal.timeout(15_000) });
    if (allowMissing && response.status === 404) return undefined;
    if (!response.ok) throw new Error(`GitHub maintenance ${method} failed (HTTP ${response.status}); no response body retained.`);
    return response.status === 204 ? undefined : response.json();
  }
  async load(): Promise<State> {
    const ref = await this.api(`git/ref/heads/${HISTORY_BRANCH}`, 'GET', undefined, true);
    if (!ref) return emptyState();
    this.head = ref.object.sha;
    const commit = await this.api(`git/commits/${this.head}`);
    this.tree = commit.tree.sha;
    const file = await this.api(`contents/state.json?ref=${this.head}`);
    if (file.encoding !== 'base64' || typeof file.content !== 'string') throw new Error('Unreadable maintenance state.');
    return validateState(JSON.parse(Buffer.from(file.content, 'base64').toString('utf8')));
  }
  async save(state: State, files: Record<string, string> = {}): Promise<void> {
    validateState(state);
    // An orphan branch has no site source. Its very first commit disables Vercel
    // builds, before the ref exists; subsequent writes retain that setting.
    const contents = { 'state.json': `${JSON.stringify(state, null, 2)}\n`, 'vercel.json': '{"git":{"deploymentEnabled":false}}\n', 'README.md': '# Product maintenance history\n\nGenerated observations and reports only. No site source, credentials, or production deployments.\n', ...files };
    if (Object.keys(files).some((path) => !/^(?:reports\/[a-zA-Z0-9_.-]+\/(?:report\.json|inventory\.html)|latest\/(?:report\.json|inventory\.html))$/.test(path))) throw new Error('Maintenance writes are restricted to reports.');
    const entries = [];
    for (const [path, content] of Object.entries(contents)) {
      const blob = await this.api('git/blobs', 'POST', { content, encoding: 'utf-8' });
      entries.push({ path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const tree = await this.api('git/trees', 'POST', { ...(this.tree ? { base_tree: this.tree } : {}), tree: entries });
    const commit = await this.api('git/commits', 'POST', { message: 'Record product maintenance state', tree: tree.sha, parents: this.head ? [this.head] : [] });
    if (this.head) await this.api(`git/refs/heads/${HISTORY_BRANCH}`, 'PATCH', { sha: commit.sha, force: false });
    else await this.api('git/refs', 'POST', { ref: `refs/heads/${HISTORY_BRANCH}`, sha: commit.sha });
    const ref = await this.api(`git/ref/heads/${HISTORY_BRANCH}`);
    if (ref.object.sha !== commit.sha) throw new Error('History changed concurrently; external requests disabled.');
    this.head = commit.sha; this.tree = tree.sha;
  }
  async issue(): Promise<Issue | undefined> {
    const matches: Issue[] = [];
    for (let page = 1; ; page++) {
      const issues = await this.api(`issues?labels=merchant-check&state=all&per_page=100&page=${page}`);
      matches.push(...issues.filter((issue: any) => !issue.pull_request));
      if (issues.length < 100) break;
    }
    if (matches.length > 1) throw new Error('Multiple merchant-check issues exist; reconcile them before publishing.');
    return matches[0];
  }
  async publish(report: Report, state: State, old?: Issue): Promise<void> {
    const key = report.generatedAt.replace(/[^a-zA-Z0-9-]/g, '-');
    const files = { 'report.json': `${JSON.stringify(report, null, 2)}\n`, 'inventory.html': renderHtml(report, state) };
    const latest = await this.issue();
    const paths = Object.fromEntries(Object.entries(files).flatMap(([name, content]) => [[`reports/${key}/${name}`, content], [`latest/${name}`, content]]));
    if (latest?.updated_at !== old?.updated_at) {
      await this.save(state, paths);
      throw new Error('Tracking issue changed during maintenance; reports saved, issue left intact. Rerun offline to reconcile.');
    }
    const body = renderIssue(report, state, latest?.body ?? '', `https://github.com/${this.repo}/blob/${HISTORY_BRANCH}/reports/${key}`, process.env.GITHUB_RUN_ID ? `https://github.com/${this.repo}/actions/runs/${process.env.GITHUB_RUN_ID}` : undefined);
    await this.save(state, paths);
    if (latest) {
      if (latest.body !== body || latest.state !== 'open') await this.api(`issues/${latest.number}`, 'PATCH', { body, state: 'open', assignees: ['benstraw'] });
    } else {
      const label = await this.api('labels/merchant-check', 'GET', undefined, true);
      if (!label) await this.api('labels', 'POST', { name: 'merchant-check', color: 'B60205', description: 'Weekly product maintenance review queue' });
      await this.api('issues', 'POST', { title: 'Weekly product maintenance', body, labels: ['merchant-check'], assignees: ['benstraw'] });
    }
  }
}
export function trustedRun(env: NodeJS.ProcessEnv): boolean {
  return env.GITHUB_ACTIONS === 'true' && ['schedule', 'workflow_dispatch'].includes(env.GITHUB_EVENT_NAME ?? '') && env.GITHUB_REF === `refs/heads/${env.MAINTENANCE_DEFAULT_BRANCH || 'main'}`;
}
