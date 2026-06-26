export interface ChewyAffiliateOptions {
  articleSlug?: string;
  placement?: string;
  campaign?: string;
}

const CHEWY_HOST = 'www.chewy.com';
const STRIPPED_DESTINATION_PARAMS = new Set([
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
]);

export function normalizeChewyProductUrl(chewyProductUrl: string): string {
  if (!chewyProductUrl.trim()) {
    throw new Error('Chewy product URL is required.');
  }

  let url: URL;
  try {
    url = new URL(chewyProductUrl);
  } catch {
    throw new Error(`Invalid Chewy product URL: ${chewyProductUrl}`);
  }

  if (url.protocol !== 'https:' || url.hostname !== CHEWY_HOST) {
    throw new Error('Chewy product URL must use https://www.chewy.com/.');
  }

  if (!url.pathname || url.pathname === '/') {
    throw new Error('Chewy product URL must include a product path.');
  }

  for (const param of STRIPPED_DESTINATION_PARAMS) {
    url.searchParams.delete(param);
  }

  url.hash = '';
  return url.toString();
}

export function createChewyAffiliateLinkWithBase(
  impactTrackingLink: string,
  chewyProductUrl: string,
  options: ChewyAffiliateOptions = {},
): string {
  if (!impactTrackingLink.trim()) {
    throw new Error('Chewy Impact tracking base URL is required.');
  }

  let trackingUrl: URL;
  try {
    trackingUrl = new URL(impactTrackingLink);
  } catch {
    throw new Error(`Invalid Chewy Impact tracking base URL: ${impactTrackingLink}`);
  }

  const destinationUrl = normalizeChewyProductUrl(chewyProductUrl);
  trackingUrl.searchParams.set('u', destinationUrl);
  setOptionalParam(trackingUrl, 'subId1', options.articleSlug);
  setOptionalParam(trackingUrl, 'subId2', options.placement);
  setOptionalParam(trackingUrl, 'subId3', options.campaign);

  return trackingUrl.toString();
}

export function createChewyAffiliateLink(
  chewyProductUrl: string,
  options: ChewyAffiliateOptions = {},
): string {
  const baseUrl = process.env.CHEWY_IMPACT_BASE_URL?.trim();
  if (!baseUrl) {
    throw new Error('Missing CHEWY_IMPACT_BASE_URL. Set it or use the async Impact resolver in the CLI.');
  }

  return createChewyAffiliateLinkWithBase(baseUrl, chewyProductUrl, options);
}

function setOptionalParam(url: URL, key: string, value?: string): void {
  const cleanValue = value?.trim();
  if (cleanValue) {
    url.searchParams.set(key, cleanValue);
  }
}
