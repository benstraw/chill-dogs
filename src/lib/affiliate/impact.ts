export interface ImpactClientOptions {
  accountSid?: string;
  authToken?: string;
  env?: NodeJS.ProcessEnv;
  fetchImpl?: ImpactFetch;
}

export interface ChewyImpactTrackingOptions {
  campaignId: string;
  adId: string;
}

export interface ImpactProgram {
  CampaignId?: string;
  CampaignName?: string;
  AdvertiserName?: string;
  TrackingLink?: string;
  AllowsDeeplinking?: string;
  DeeplinkDomains?: string[];
}

export interface ImpactCatalog {
  Id?: string;
  Name?: string;
  CampaignId?: string;
  CampaignName?: string;
  NumberOfItems?: string;
  DateLastUpdated?: string;
  ItemsUri?: string;
}

export type ImpactCatalogItem = Record<string, unknown>;
export type ImpactFetch = (input: string | URL, init?: RequestInit) => Promise<Response>;

const IMPACT_API_BASE_URL = 'https://api.impact.com';

function mediaPartnerPath(accountSid: string, path: string): string {
  return `/Mediapartners/${encodeURIComponent(accountSid)}${path}`;
}

export function hasImpactTrackingConfig(env: NodeJS.ProcessEnv = process.env): boolean {
  return Boolean(
    cleanConfigValue(env.IMPACT_ACCOUNT_SID) &&
      cleanConfigValue(env.IMPACT_AUTH_TOKEN) &&
      cleanConfigValue(env.CHEWY_IMPACT_CAMPAIGN_ID) &&
      cleanConfigValue(env.CHEWY_IMPACT_AD_ID),
  );
}

export function getChewyImpactTrackingConfig(env: NodeJS.ProcessEnv = process.env): ChewyImpactTrackingOptions {
  return {
    campaignId: requiredEnv(env, 'CHEWY_IMPACT_CAMPAIGN_ID'),
    adId: requiredEnv(env, 'CHEWY_IMPACT_AD_ID'),
  };
}

export async function getChewyTrackingLinkFromImpact(
  options: ChewyImpactTrackingOptions,
  clientOptions: ImpactClientOptions = {},
): Promise<string> {
  const campaignId = requiredOption(options.campaignId, 'campaignId');
  const adId = requiredOption(options.adId, 'adId');
  const accountSid = getAccountSid(clientOptions);

  // The tracking-link route is keyed by ad ID; campaignId stays required so callers
  // cannot accidentally generate Chewy links without tying the ad to a known program.
  requiredOption(campaignId, 'campaignId');

  const response = await impactGetJson<{ TrackingLink?: unknown }>(
    mediaPartnerPath(accountSid, `/Ads/${encodeURIComponent(adId)}/TrackingLink`),
    clientOptions,
  );
  const trackingLink = cleanString(response.TrackingLink);

  if (!trackingLink) {
    throw new Error(`Impact ad ${adId} did not return a TrackingLink.`);
  }

  return trackingLink;
}

export async function verifyChewyTrackingBase(
  baseUrl: string,
  clientOptions: ImpactClientOptions = {},
): Promise<boolean> {
  const officialTrackingLink = await getChewyTrackingLinkFromImpact(
    getChewyImpactTrackingConfig(clientOptions.env),
    clientOptions,
  );

  return normalizeComparableUrl(baseUrl) === normalizeComparableUrl(officialTrackingLink);
}

export async function listJoinedPrograms(clientOptions: ImpactClientOptions = {}): Promise<ImpactProgram[]> {
  const accountSid = getAccountSid(clientOptions);
  const response = await impactGetJson<{ Campaigns?: unknown }>(
    mediaPartnerPath(accountSid, '/Campaigns'),
    clientOptions,
  );

  return asArray(response.Campaigns) as ImpactProgram[];
}

export async function retrieveChewyProgram(
  options: { campaignId: string },
  clientOptions: ImpactClientOptions = {},
): Promise<ImpactProgram> {
  const accountSid = getAccountSid(clientOptions);
  const campaignId = requiredOption(options.campaignId, 'campaignId');

  return impactGetJson<ImpactProgram>(
    mediaPartnerPath(accountSid, `/Campaigns/${encodeURIComponent(campaignId)}`),
    clientOptions,
  );
}

export async function listChewyCatalogs(
  options: { campaignId?: string } = {},
  clientOptions: ImpactClientOptions = {},
): Promise<ImpactCatalog[]> {
  const accountSid = getAccountSid(clientOptions);
  const url = buildImpactUrl(mediaPartnerPath(accountSid, '/Catalogs'));
  const campaignId = options.campaignId?.trim();
  if (campaignId) url.searchParams.set('CampaignId', campaignId);

  const response = await impactGetJson<{ Catalogs?: unknown }>(url, clientOptions);
  return asArray(response.Catalogs) as ImpactCatalog[];
}

export async function listChewyCatalogItems(
  options: { catalogId: string; query?: string },
  clientOptions: ImpactClientOptions = {},
): Promise<ImpactCatalogItem[]> {
  const accountSid = getAccountSid(clientOptions);
  const catalogId = requiredOption(options.catalogId, 'catalogId');
  const url = buildImpactUrl(
    mediaPartnerPath(accountSid, `/Catalogs/${encodeURIComponent(catalogId)}/Items`),
  );
  const query = options.query?.trim();
  if (query) url.searchParams.set('Query', query);

  const response = await impactGetJson<{ Items?: unknown }>(url, clientOptions);
  return asArray(response.Items) as ImpactCatalogItem[];
}

export async function retrieveChewyCatalogItem(
  options: { catalogId: string; itemId: string },
  clientOptions: ImpactClientOptions = {},
): Promise<ImpactCatalogItem> {
  const accountSid = getAccountSid(clientOptions);
  const catalogId = requiredOption(options.catalogId, 'catalogId');
  const itemId = requiredOption(options.itemId, 'itemId');

  return impactGetJson<ImpactCatalogItem>(
    mediaPartnerPath(accountSid, `/Catalogs/${encodeURIComponent(catalogId)}/Items/${encodeURIComponent(itemId)}`),
    clientOptions,
  );
}

export async function searchChewyCatalogItems(
  options: { keyword?: string; pageSize?: number; page?: number } = {},
  clientOptions: ImpactClientOptions = {},
): Promise<ImpactCatalogItem[]> {
  const accountSid = getAccountSid(clientOptions);
  const url = buildImpactUrl(mediaPartnerPath(accountSid, '/Catalogs/ItemSearch'));
  const keyword = options.keyword?.trim();
  if (keyword) url.searchParams.set('Keyword', keyword);
  if (options.pageSize) url.searchParams.set('PageSize', String(options.pageSize));
  if (options.page) url.searchParams.set('Page', String(options.page));

  const response = await impactGetJson<{ Items?: unknown }>(url, clientOptions);
  return asArray(response.Items) as ImpactCatalogItem[];
}

async function impactGetJson<T>(pathOrUrl: string | URL, clientOptions: ImpactClientOptions): Promise<T> {
  const fetchImpl = clientOptions.fetchImpl ?? fetch;
  const accountSid = getAccountSid(clientOptions);
  const authToken = getAuthToken(clientOptions);
  const url = typeof pathOrUrl === 'string' ? buildImpactUrl(pathOrUrl) : pathOrUrl;

  let response: Response;
  try {
    response = await fetchImpl(url, {
      headers: {
        Accept: 'application/json',
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      },
    });
  } catch (err) {
    throw new Error(`Impact API request failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  if (!response.ok) {
    const body = await safeResponseText(response);
    const scopeHint =
      response.status === 403
        ? ' Check that the token is a Partner/Media Partner token with read access for this resource.'
        : '';
    throw new Error(`Impact API request failed with HTTP ${response.status}${scopeHint}${body ? `: ${body}` : ''}`);
  }

  try {
    return (await response.json()) as T;
  } catch (err) {
    throw new Error(`Impact API returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
  }
}

function buildImpactUrl(path: string): URL {
  return new URL(path, IMPACT_API_BASE_URL);
}

function getAccountSid(options: ImpactClientOptions): string {
  return options.accountSid?.trim() || requiredEnv(options.env, 'IMPACT_ACCOUNT_SID');
}

function getAuthToken(options: ImpactClientOptions): string {
  return options.authToken?.trim() || requiredEnv(options.env, 'IMPACT_AUTH_TOKEN');
}

function requiredEnv(env: NodeJS.ProcessEnv = process.env, key: string): string {
  const value = cleanConfigValue(env[key]);
  if (!value) {
    throw new Error(`Missing ${key}.`);
  }
  return value;
}

function requiredOption(value: string | undefined, label: string): string {
  const cleanValue = value?.trim();
  if (!cleanValue) {
    throw new Error(`Missing Impact ${label}.`);
  }
  return cleanValue;
}

function cleanString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

export function cleanConfigValue(value: string | undefined): string | undefined {
  const cleanValue = value?.trim();
  if (!cleanValue || cleanValue === '...' || /^<[^>]+>$/.test(cleanValue)) return undefined;
  return cleanValue;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function normalizeComparableUrl(value: string): string {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Invalid Impact tracking base URL: ${value}`);
  }
  url.searchParams.sort();
  return url.toString();
}

async function safeResponseText(response: Response): Promise<string> {
  try {
    return (await response.text()).trim();
  } catch {
    return '';
  }
}
