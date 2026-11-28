import { createHash } from 'node:crypto';

export const DAY = 86_400_000;
export const CAPS = { amazon: 25, impact: 10 } as const;
export type Integration = keyof typeof CAPS;
export type Verdict = 'available' | 'unavailable' | 'unknown' | 'identity-mismatch' | 'integration-failure' | 'missing-item';
export interface Observation {
  listing: string;
  at: string;
  source: 'cache' | 'live';
  provider: string;
  verdict: Verdict;
  detail: string;
  title?: string;
  stock?: string;
  newerModel?: string;
  identityVerified?: boolean;
}
export interface Listing {
  key: string;
  merchant: 'amazon' | 'chewy' | 'aorkuler';
  id: string;
  url: string;
  canonicalUrl?: string;
  owners: { productId: string; variantId?: string }[];
  itemId?: string;
  catalogId?: string;
  itemEndpoint?: 'Item' | 'Items';
  cacheAt?: string;
  cacheAgeDays?: number;
  providerCheckedAt?: string;
  latestObservation?: Observation;
  cached?: Observation;
}
export interface InventoryProduct {
  id: string;
  name: string;
  source: string;
  pages: string[];
  prominent: boolean;
  listings: string[];
  reviewedAt?: string;
  retired?: { destination?: string; valid: boolean };
}
export interface Finding {
  id: string;
  productId: string;
  name: string;
  listing?: string;
  pages: string[];
  priority: number;
  evidence: string;
  at: string;
  action: string;
  fingerprint: string;
  routine?: boolean;
}
export interface FindingHistory {
  fingerprint: string;
  firstSeen: string;
  lastSeen: string;
  resolvedAt?: string;
  acknowledgedAt?: string;
  acknowledgedFingerprint?: string;
  checkedText?: string;
  acknowledgments?: { at: string; fingerprint: string; text: string; cycle?: string }[];
}
export interface Ledger {
  week: string;
  integration: Integration;
  run: string;
  reserved: number;
  used: number;
  at: string;
}
export interface State {
  version: 1;
  observations: Observation[];
  reviews: Record<string, string>;
  findings: Record<string, FindingHistory>;
  ledgers: Ledger[];
  issueGenerated?: string;
  humanNotes?: string[];
}
export interface Coverage {
  total: number;
  checked: number;
  skipped: number;
  unknown: number;
  failed: number;
  budgetLimited: number;
  unconfigured: number;
  status: string;
  detail: string;
}
export interface Report {
  version: 1;
  generatedAt: string;
  mode: string;
  inventory: InventoryProduct[];
  listings: Listing[];
  unusedCaches: string[];
  findings: Finding[];
  queue: Finding[];
  coverage: Record<string, Coverage>;
  integrationStatus: Record<string, string>;
  requestAccounting: Ledger[];
  errors: string[];
}
export const emptyState = (): State => ({ version: 1, observations: [], reviews: {}, findings: {}, ledgers: [] });
export const fingerprint = (value: unknown): string => createHash('sha256').update(JSON.stringify(value)).digest('hex').slice(0, 16);
export function isoWeek(at: string): string {
  const date = new Date(at);
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
  const year = date.getUTCFullYear();
  const week = Math.ceil(((date.getTime() - Date.UTC(year, 0, 1)) / DAY + 1) / 7);
  return `${year}-W${String(week).padStart(2, '0')}`;
}
export function reserve(state: State, integration: Integration, run: string, at: string): Ledger | undefined {
  const week = isoWeek(at);
  const spent = state.ledgers.filter((entry) => entry.week === week && entry.integration === integration)
    .reduce((sum, entry) => sum + entry.reserved, 0);
  if (spent >= CAPS[integration]) return;
  const entry = { week, integration, run, reserved: CAPS[integration] - spent, used: 0, at };
  state.ledgers.push(entry);
  return entry;
}
/** Call only after every request has returned; crashes retain the original lease. */
export function settleReservation(ledger: Ledger): void {
  ledger.reserved = ledger.used;
}
export function lastObservation(state: State, key: string): Observation | undefined {
  return state.observations.filter((o) => o.listing === key).sort((a, b) => b.at.localeCompare(a.at))[0];
}
export function listingProblem(state: State, key: string): Observation | undefined {
  const observations = state.observations.filter((o) => o.listing === key).sort((a, b) => b.at.localeCompare(a.at));
  const identity = observations.find((o) => o.identityVerified || o.verdict === 'identity-mismatch');
  const stock = observations.find((o) => ['available', 'unavailable'].includes(o.verdict));
  const endpoint = observations.find((o) => o.identityVerified || o.verdict === 'missing-item');
  return identity?.verdict === 'identity-mismatch' ? identity : stock?.verdict === 'unavailable' ? stock : endpoint?.verdict === 'missing-item' ? endpoint : undefined;
}
export function seedCaches(state: State, listings: Listing[]): void {
  for (const listing of listings) {
    if (listing.cached && !state.observations.some((o) => o.listing === listing.key && o.at === listing.cached!.at)) {
      state.observations.push(listing.cached);
    }
  }
}
export function selectListings(listings: Listing[], state: State, at: string, limit: number): Listing[] {
  const eligible = listings.filter((listing) => {
    const last = lastObservation(state, listing.key);
    return !last || Date.parse(at) - Date.parse(last.at) >= 7 * DAY;
  }).sort((a, b) => (lastObservation(state, a.key)?.at ?? '').localeCompare(lastObservation(state, b.key)?.at ?? '') || a.key.localeCompare(b.key));
  const isProblem = (l: Listing) => Boolean(listingProblem(state, l.key));
  const followups = eligible.filter(isProblem).slice(0, Math.min(5, limit));
  const rotation = eligible.filter((l) => !isProblem(l));
  return [...followups, ...rotation.slice(0, limit - followups.length)];
}
export function makeFinding(input: Omit<Finding, 'fingerprint'>): Finding {
  return { ...input, fingerprint: fingerprint([input.evidence, input.action, input.pages]) };
}
export function reconcile(report: Report, state: State, previousBody = ''): void {
  const at = report.generatedAt;
  if (state.issueGenerated && previousBody.includes('<!-- product-maintenance:start -->')) {
    const section = previousBody.split('<!-- product-maintenance:start -->')[1]?.split('<!-- product-maintenance:end -->')[0] ?? '';
    const known = new Set(state.issueGenerated.split('\n'));
    const notes = section.split('\n').filter((line) => line.trim() && !known.has(line) && !/^\s*- \[[ xX]\].*<!-- maintenance:/.test(line));
    state.humanNotes = [...new Set([...(state.humanNotes ?? []), ...notes])];
  }
  // Only generated task markers are acknowledgments. A checked task is not proof
  // that a concrete problem disappeared.
  for (const match of previousBody.matchAll(/^- \[[xX]\] (.+) <!-- maintenance:([^: ]+):([a-f0-9]+)(?::([0-9]+))? -->\s*$/gm)) {
    const [, text, id, hash, markerCycle] = match;
    const cycle = markerCycle ?? '0';
    const history = state.findings[id];
    if (!history || history.acknowledgments?.some((ack) => ack.fingerprint === hash && (ack.cycle ?? '0') === cycle)) continue;
    if (!history.acknowledgments && history.acknowledgedFingerprint === hash && cycle === '0') continue;
    history.acknowledgedAt = at;
    history.acknowledgedFingerprint = hash;
    history.checkedText = text;
    history.acknowledgments ??= [];
    history.acknowledgments.push({ at, fingerprint: hash, text, cycle });
    const finding = report.findings.find((f) => f.id === id);
    if (finding?.routine && finding.fingerprint === hash) state.reviews[finding.productId] = at;
  }
  report.inventory.forEach((product) => { product.reviewedAt = state.reviews[product.id]; });
  report.findings = report.findings.filter((finding) => !finding.routine || !state.reviews[finding.productId] || Date.parse(at) - Date.parse(state.reviews[finding.productId]) > 90 * DAY);
  const present = new Set(report.findings.map((f) => f.id));
  for (const [id, history] of Object.entries(state.findings)) {
    if (!present.has(id) && !history.resolvedAt) history.resolvedAt = at;
  }
  for (const finding of report.findings) {
    const old = state.findings[finding.id];
    state.findings[finding.id] = { ...old, firstSeen: old?.firstSeen ?? at, lastSeen: at, fingerprint: finding.fingerprint, resolvedAt: undefined };
  }
  const products = new Map(report.inventory.map((p) => [p.id, p]));
  report.findings.sort((a, b) => {
    const ap = products.get(a.productId), bp = products.get(b.productId);
    return a.priority - b.priority || Number(bp?.prominent ?? false) - Number(ap?.prominent ?? false)
      || (bp?.pages.length ?? 0) - (ap?.pages.length ?? 0)
      || (ap?.reviewedAt ?? '').localeCompare(bp?.reviewedAt ?? '') || a.productId.localeCompare(b.productId) || a.id.localeCompare(b.id);
  });
  report.queue = report.findings.filter((f) => {
    const history = state.findings[f.id];
    return history.acknowledgedFingerprint !== f.fingerprint || !history.acknowledgedAt || Date.parse(at) - Date.parse(history.acknowledgedAt) >= 14 * DAY;
  }).slice(0, 5);
}
