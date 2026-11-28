import { DAY, isoWeek, lastObservation, listingProblem, selectListings, type Coverage, type Ledger, type Listing, type Observation, type State } from './model';

export type Fetcher = (input: string | URL, init?: RequestInit) => Promise<Response>;
export const record = (value: unknown): Record<string, any> => value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, any> : {};
const string = (value: unknown): string | undefined => typeof value === 'string' && value.trim() ? value.trim() : undefined;
export function chewyDestination(value: string): string | undefined {
  try {
    let url = new URL(value);
    if (url.hostname === 'chewy.sjv.io') url = new URL(url.searchParams.get('u') ?? '');
    if (!['www.chewy.com', 'chewy.com'].includes(url.hostname) || url.protocol !== 'https:') return;
    const id = url.pathname.match(/\/dp\/(\d+)/)?.[1];
    // Only a canonical storefront identity, never an Impact catalog-item ID.
    return id ? `https://www.chewy.com/dp/${id}` : undefined;
  } catch { return; }
}
export function trackingBase(value: string): string | undefined {
  try {
    const url = new URL(value);
    const path = url.pathname.replace(/\/$/, '');
    return url.protocol === 'https:' && url.hostname === 'chewy.sjv.io' && /^\/c\/\d+\/\d+\/\d+$/.test(path) ? `${url.origin}${path}` : undefined;
  } catch { return; }
}
export function stockVerdict(value: unknown): 'available' | 'unavailable' | 'unknown' {
  if (value === true) return 'available';
  if (value === false) return 'unavailable';
  if (typeof value !== 'string') return 'unknown';
  const text = value.toLowerCase().replace(/[^a-z]/g, '');
  if (['outofstock', 'currentlyunavailable', 'unavailable', 'notavailable', 'discontinued'].includes(text)) return 'unavailable';
  if (['instock', 'available', 'instockordernow', 'limitedstock'].includes(text)) return 'available';
  return 'unknown';
}
export function amazonObservation(payload: unknown, listing: Listing, at: string, provider: string, source: 'cache' | 'live' = 'live'): Observation {
  const root = record(payload), product = record(root.product_results ?? root.product);
  const base: Observation = { listing: listing.key, at, provider, source, verdict: 'unknown', detail: 'Stock not supplied or not recognized.' };
  if (root.captcha || root.challenge || /captcha|robot check/i.test(String(product.title ?? ''))) return { ...base, verdict: 'integration-failure', detail: 'Provider returned a challenge instead of recognizable product data.' };
  const status = record(root.search_metadata).status;
  if (root.error || root.errors || status !== undefined && !/^success$/i.test(String(status))) return { ...base, verdict: 'integration-failure', detail: 'Provider did not report a successful result.' };
  if (!string(product.title) || !string(product.asin)) return { ...base, verdict: 'integration-failure', detail: 'Unrecognized product schema or missing returned identity.' };
  if (product.asin !== listing.id) return { ...base, verdict: 'identity-mismatch', detail: `Returned ASIN ${String(product.asin).replace(/[^A-Z0-9]/g, '').slice(0, 10)} differs from requested ASIN.` };
  const stock = product.availability ?? record(product.buybox).availability ?? record(root.buybox).availability ?? product.stock ?? product.in_stock;
  const stockValue = typeof stock === 'object' ? record(stock).raw ?? record(stock).status ?? record(stock).text : stock;
  const newer = record(root.newer_model ?? product.newer_model);
  const newAsin = string(newer.asin);
  return { ...base, identityVerified: true, title: string(product.title), verdict: stockVerdict(stockValue), stock: typeof stockValue === 'boolean' ? String(stockValue) : string(stockValue),
    newerModel: newAsin && /^[A-Z0-9]{10}$/.test(newAsin) ? newAsin : undefined,
    detail: stockVerdict(stockValue) === 'unknown' ? base.detail : 'Recognized product and explicit provider availability.' };
}
export function chewyObservation(payload: unknown, listing: Listing, at: string, source: 'cache' | 'live' = 'live'): Observation {
  const item = record(payload);
  const base: Observation = { listing: listing.key, at, source, provider: 'impact', verdict: 'unknown', detail: 'Impact-reported availability not supplied or not recognized.' };
  if (!string(item.Name) || !string(item.Id) || !string(item.Url)) return { ...base, verdict: 'integration-failure', detail: 'Unrecognized Impact item schema.' };
  if (item.Id !== listing.itemId || String(item.CatalogId) !== listing.catalogId || chewyDestination(item.Url) !== chewyDestination(listing.canonicalUrl ?? listing.url)) {
    return { ...base, verdict: 'identity-mismatch', detail: 'Impact item identity, catalog, or decoded destination differs from the canonical offer.' };
  }
  return { ...base, identityVerified: true, title: string(item.Name), stock: string(item.StockAvailability), verdict: stockVerdict(item.StockAvailability), detail: 'Impact-reported availability; feed data is not a real-time storefront guarantee.' };
}

export class RequestError extends Error {
  constructor(public kind: 'budget' | 'quota' | 'auth' | 'missing' | 'transient' | 'schema' | 'http', public provider: string) {
    super(`${provider}: ${kind}`);
  }
}
export class RequestBroker {
  stopped = new Set<string>();
  maxUsed: number;
  constructor(public ledger: Ledger, private fetchImpl: Fetcher = fetch, private now: () => string = () => new Date().toISOString()) { this.maxUsed = ledger.reserved; }
  async json(provider: string, url: URL, headers: Record<string, string> = {}): Promise<unknown> {
    for (let attempt = 0; attempt < 2; attempt++) {
      if (this.stopped.has(provider)) throw new RequestError('quota', provider);
      if (this.ledger.used >= Math.min(this.ledger.reserved, this.maxUsed) || isoWeek(this.now()) !== this.ledger.week) throw new RequestError('budget', provider);
      this.ledger.used++;
      try {
        const response = await this.fetchImpl(url, { headers, signal: AbortSignal.timeout(15_000), redirect: 'error' });
        if (response.status === 429 || response.status === 402) throw new RequestError('quota', provider);
        if ([401, 403].includes(response.status)) throw new RequestError('auth', provider);
        if (response.status === 404) throw new RequestError('missing', provider);
        if (response.status >= 500 || response.status === 408) throw new RequestError('transient', provider);
        if (!response.ok) throw new RequestError('http', provider);
        let payload: unknown;
        try { payload = await response.json(); } catch { throw new RequestError('schema', provider); }
        const root = record(payload);
        if (root.error || root.errors) {
          const detail = JSON.stringify(root.error ?? root.errors);
          if (/quota|limit|credit|too many/i.test(detail)) throw new RequestError('quota', provider);
          if (/auth|api.?key|token|unauthorized/i.test(detail)) throw new RequestError('auth', provider);
          throw new RequestError('schema', provider);
        }
        return payload;
      } catch (error) {
        const safe = error instanceof RequestError ? error : new RequestError('transient', provider);
        if (safe.kind === 'quota' || safe.kind === 'auth') this.stopped.add(provider);
        if (safe.kind === 'transient' && attempt === 0) continue;
        throw safe;
      }
    }
    throw new RequestError('transient', provider);
  }
}
export const coverage = (total: number, status = 'offline', detail = 'No external requests requested.'): Coverage => ({ total, checked: 0, skipped: total, unknown: 0, failed: 0, budgetLimited: 0, unconfigured: 0, status, detail });
function observeFailure(error: unknown, listing: Listing, provider: string, at: string): Observation {
  const kind = error instanceof RequestError ? error.kind : 'schema';
  return { listing: listing.key, at, source: 'live', provider,
    verdict: kind === 'missing' ? 'missing-item' : ['auth', 'schema', 'http'].includes(kind) ? 'integration-failure' : 'unknown',
    detail: kind === 'missing' ? 'Item endpoint returned 404; mapping or feed may have changed. Storefront discontinuation is unproven.' : `${provider}: ${kind}; availability unknown.` };
}
function count(c: Coverage, observation: Observation) {
  c.skipped--; c.checked++;
  if (observation.verdict === 'unknown' || observation.verdict === 'missing-item') c.unknown++;
  if (observation.verdict === 'integration-failure') c.failed++;
}
export async function checkAmazon(listings: Listing[], state: State, broker: RequestBroker, env: NodeJS.ProcessEnv, at: string, save: () => Promise<void>): Promise<Coverage> {
  const c = coverage(listings.length, 'partial', 'Provider observations only; no product edits.');
  const providers = [{ name: 'serpapi', key: env.SERP_API_KEY ?? env.SERPAPI_KEY, endpoint: 'https://serpapi.com/search.json' }, { name: 'searchapi', key: env.SEARCHAPI_KEY, endpoint: 'https://www.searchapi.io/api/v1/search' }].filter((p) => p.key?.trim());
  if (!providers.length) return { ...c, status: 'not configured', unconfigured: listings.length, skipped: 0, detail: 'Set SERP_API_KEY and/or SEARCHAPI_KEY in Actions secrets.' };
  const eligible = listings.filter((l) => !lastObservation(state, l.key) || Date.parse(at) - Date.parse(lastObservation(state, l.key)!.at) >= 7 * DAY);
  const selected = selectListings(listings, state, at, Math.min(25, broker.ledger.reserved));
  const startUsed = broker.ledger.used;
  const integrationProblems = new Set<string>();
  const partialReasons = new Set<string>();
  for (const listing of selected) {
    const followup = Boolean(listingProblem(state, listing.key));
    broker.maxUsed = followup ? Math.min(broker.ledger.reserved, startUsed + 5) : broker.ledger.reserved;
    if (broker.ledger.used >= broker.maxUsed) { if (followup) continue; else break; }
    if (broker.ledger.used >= broker.ledger.reserved) break;
    const usedBeforeListing = broker.ledger.used;
    let observation: Observation | undefined;
    for (const provider of providers) {
      if (broker.ledger.used >= broker.maxUsed) break;
      if (broker.stopped.has(provider.name)) continue;
      const url = new URL(provider.endpoint);
      for (const [key, value] of Object.entries({ engine: 'amazon_product', asin: listing.id, amazon_domain: 'amazon.com', api_key: provider.key! })) url.searchParams.set(key, value);
      try {
        observation = amazonObservation(await broker.json(provider.name, url), listing, at, provider.name);
        if (observation.verdict !== 'integration-failure') break;
        integrationProblems.add(`${provider.name}: schema`);
      } catch (error) {
        observation = observeFailure(error, listing, provider.name, at);
        if (observation.verdict === 'integration-failure') integrationProblems.add(observation.detail);
        else partialReasons.add(error instanceof RequestError ? `${provider.name}: ${error.kind}` : `${provider.name}: unknown`);
      }
    }
    if (!observation) break;
    if (broker.ledger.used === usedBeforeListing) break;
    state.observations.push(observation); count(c, observation); await save();
  }
  c.budgetLimited = Math.max(0, eligible.length - c.checked);
  c.skipped -= c.budgetLimited;
  if (integrationProblems.size || partialReasons.size) c.detail += ` Integration evidence: ${[...integrationProblems, ...partialReasons].join('; ')}.`;
  c.status = c.failed || integrationProblems.size ? 'integration failure' : c.unknown || c.budgetLimited || partialReasons.size ? 'partial' : 'checked';
  return c;
}
export async function checkChewy(listings: Listing[], state: State, broker: RequestBroker, env: NodeJS.ProcessEnv, at: string, smoke: boolean, save: () => Promise<void>): Promise<Coverage> {
  const c = coverage(listings.length, 'partial', 'Impact-reported availability, not guaranteed storefront stock.');
  const required = ['IMPACT_ACCOUNT_SID', 'IMPACT_AUTH_TOKEN', 'CHEWY_IMPACT_CAMPAIGN_ID', 'CHEWY_IMPACT_AD_ID', 'CHEWY_IMPACT_CATALOG_ID'];
  const missing = required.filter((key) => !env[key]?.trim());
  if (missing.length) return { ...c, status: 'not configured', unconfigured: listings.length, skipped: 0, detail: `Missing configuration: ${missing.join(', ')}.` };
  const sid = env.IMPACT_ACCOUNT_SID!, catalog = env.CHEWY_IMPACT_CATALOG_ID!;
  const headers = { Accept: 'application/json', Authorization: `Basic ${Buffer.from(`${sid}:${env.IMPACT_AUTH_TOKEN}`).toString('base64')}` };
  const endpoint = (path: string) => new URL(`https://api.impact.com/Mediapartners/${encodeURIComponent(sid)}${path}`);
  try {
    const program = record(await broker.json('impact', endpoint(`/Campaigns/${encodeURIComponent(env.CHEWY_IMPACT_CAMPAIGN_ID!)}`), headers));
    if (String(program.CampaignId) !== env.CHEWY_IMPACT_CAMPAIGN_ID || !/\bchewy\b/i.test(`${program.CampaignName ?? ''} ${program.AdvertiserName ?? ''}`)) throw new RequestError('schema', 'impact');
    const ad = record(await broker.json('impact', endpoint(`/Ads/${encodeURIComponent(env.CHEWY_IMPACT_AD_ID!)}/TrackingLink`), headers));
    const base = trackingBase(ad.TrackingLink ?? '');
    const bases = new Set(listings.map((l) => trackingBase(l.url)));
    if (!base || bases.size !== 1 || !bases.has(base) || !base.endsWith(`/${env.CHEWY_IMPACT_AD_ID}/${env.CHEWY_IMPACT_CAMPAIGN_ID}`)) throw new RequestError('schema', 'impact');
  } catch (error) {
    const kind = error instanceof RequestError ? error.kind : 'schema';
    return { ...c, status: ['quota', 'budget', 'transient'].includes(kind) ? 'partial' : 'integration failure', detail: `Impact verification: ${kind}. Authenticated program and matching tracking base were not both verified.`, failed: ['quota', 'budget', 'transient'].includes(kind) ? 0 : 1 };
  }
  const mapped = listings.filter((l) => l.itemId && l.catalogId === catalog);
  const selected = smoke ? [...mapped].sort((a, b) => a.key.localeCompare(b.key)).slice(0, 1) : selectListings(mapped, state, at, 8);
  const startUsed = broker.ledger.used;
  if (smoke && !selected.length) return { ...c, status: 'integration failure', failed: 1, detail: 'No currently referenced cache-backed Impact item mapping exists for this catalog.' };
  for (const listing of selected) {
    const followup = !smoke && Boolean(listingProblem(state, listing.key));
    broker.maxUsed = followup ? Math.min(broker.ledger.reserved, startUsed + 5) : broker.ledger.reserved;
    if (broker.ledger.used >= broker.maxUsed) { if (followup) continue; else break; }
    if (broker.ledger.used >= broker.ledger.reserved) break;
    const usedBeforeListing = broker.ledger.used;
    let observation: Observation;
    try { observation = chewyObservation(await broker.json('impact', endpoint(`/Catalogs/${encodeURIComponent(catalog)}/${listing.itemEndpoint === 'Item' ? 'Item' : 'Items'}/${encodeURIComponent(listing.itemId!)}`), headers), listing, at); }
    catch (error) {
      if (broker.ledger.used === usedBeforeListing) break;
      observation = observeFailure(error, listing, 'impact', at);
    }
    state.observations.push(observation); count(c, observation); await save();
    if (broker.stopped.has('impact')) break;
  }
  c.budgetLimited = Math.max(0, selected.length - c.checked); c.skipped -= c.budgetLimited;
  c.unknown += listings.length - mapped.length;
  c.skipped -= listings.length - mapped.length;
  c.status = c.failed ? 'integration failure' : c.unknown || c.budgetLimited ? 'partial' : 'checked';
  if (smoke && (!c.checked || c.failed || state.observations.filter((o) => o.at === at && o.provider === 'impact').some((o) => o.verdict === 'identity-mismatch' || o.verdict === 'missing-item'))) {
    c.status = 'integration failure'; c.failed = Math.max(1, c.failed);
  }
  return c;
}
