/**
 * Fetch Amazon product data (thumbnails, titles, etc.) via SerpAPI or SearchAPI.
 * Saves full JSON responses to src/data/amazon-products/{ASIN}.json
 *
 * Usage:
 *   bun run scripts/fetch-amazon-data.ts                          # all products, serpapi (default)
 *   bun run scripts/fetch-amazon-data.ts --provider searchapi     # all products, searchapi
 *   bun run scripts/fetch-amazon-data.ts --asin B0XXXXXX          # single ASIN
 *   bun run scripts/fetch-amazon-data.ts --force                  # re-fetch even if cached
 *   bun run scripts/fetch-amazon-data.ts --stale                  # fetch missing/stale manifest entries
 *   bun run scripts/fetch-amazon-data.ts --help
 */

import { productCatalogItems } from '../src/data/product-catalog';
import { getAmazonOfferEntries } from '../src/data/products/offers';
import {
  DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS,
  isCacheEntryStale,
  readAmazonCacheManifest,
  updateAmazonCacheManifestEntry,
  type AmazonCacheProvider,
} from '../src/scripts/amazon-cache-freshness';
import { writeFile, mkdir, access } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// --- CLI args ---
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
Usage: bun run scripts/fetch-amazon-data.ts [options]

Options:
  --provider <serpapi|searchapi>   API provider (default: serpapi)
  --asin <ASIN>                   Fetch a single ASIN instead of all products
  --force                         Re-fetch even if cached JSON exists
  --stale                         Fetch products with missing or stale manifest entries
  --days <number>                 Staleness threshold for --stale (default: 90)
  --help                          Show this help message

Environment variables:
  SERP_API_KEY     API key for SerpAPI (serpapi.com)
  SEARCHAPI_KEY    API key for SearchAPI (searchapi.io)
`);
  process.exit(0);
}

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const provider = (getArg('--provider') ?? 'serpapi') as 'serpapi' | 'searchapi';
const singleAsin = getArg('--asin');
const force = args.includes('--force');
const stale = args.includes('--stale');
const staleDays = Number(getArg('--days') ?? DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS);

if (provider !== 'serpapi' && provider !== 'searchapi') {
  console.error(`Unknown provider "${provider}". Use "serpapi" or "searchapi".`);
  process.exit(1);
}

if (!Number.isFinite(staleDays) || staleDays < 0) {
  console.error(`Invalid --days value "${getArg('--days')}". Use a non-negative number.`);
  process.exit(1);
}

// --- Provider config ---
interface ProviderConfig {
  name: string;
  key: AmazonCacheProvider;
  envKey: string;
  buildUrl: (asin: string, apiKey: string) => string;
}

const providers: Record<string, ProviderConfig> = {
  serpapi: {
    name: 'SerpAPI',
    key: 'serpapi',
    envKey: 'SERP_API_KEY',
    buildUrl: (asin, apiKey) => {
      const url = new URL('https://serpapi.com/search');
      url.searchParams.set('engine', 'amazon_product');
      url.searchParams.set('asin', asin);
      url.searchParams.set('api_key', apiKey);
      return url.toString();
    },
  },
  searchapi: {
    name: 'SearchAPI',
    key: 'searchapi',
    envKey: 'SEARCHAPI_KEY',
    buildUrl: (asin, apiKey) => {
      const url = new URL('https://www.searchapi.io/api/v1/search');
      url.searchParams.set('engine', 'amazon_product');
      url.searchParams.set('asin', asin);
      url.searchParams.set('api_key', apiKey);
      return url.toString();
    },
  },
};

const config = providers[provider];
const API_KEY = process.env[config.envKey]?.trim();
if (!API_KEY) {
  console.error(`Missing ${config.envKey} in environment. Set it in .env`);
  process.exit(1);
}

console.log(`Using provider: ${config.name}`);
if (stale) {
  console.log(`Stale mode: fetching missing or >${staleDays}-day-old cache entries`);
}

// --- Output directory ---
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data', 'amazon-products');
await mkdir(OUT_DIR, { recursive: true });

// --- Build product list ---
const allProducts = getAmazonOfferEntries(productCatalogItems).map((p) => ({ asin: p.asin, name: p.name }));

const selectedProducts = singleAsin
  ? allProducts.filter((p) => p.asin === singleAsin).length > 0
    ? allProducts.filter((p) => p.asin === singleAsin)
    : [{ asin: singleAsin, name: 'unknown' }]
  : allProducts;

function dedupeProductsByAsin(productList: Array<{ asin?: string; name: string }>) {
  const seen = new Set<string>();
  const deduped: Array<{ asin?: string; name: string }> = [];

  for (const product of productList) {
    if (!product.asin) {
      deduped.push(product);
      continue;
    }

    if (seen.has(product.asin)) continue;
    seen.add(product.asin);
    deduped.push(product);
  }

  return deduped;
}

const products = dedupeProductsByAsin(selectedProducts);

// --- Check cache helper ---
async function isCached(asin: string): Promise<boolean> {
  try {
    await access(join(OUT_DIR, `${asin}.json`));
    return true;
  } catch {
    return false;
  }
}

const manifest = await readAmazonCacheManifest();

async function describeCacheSkip(asin: string): Promise<string | null> {
  if (!(await isCached(asin))) return null;

  const manifestEntry = manifest[asin];
  if (!manifestEntry) {
    return stale ? null : 'cached raw JSON; manifest entry missing';
  }

  if (isCacheEntryStale(manifestEntry, staleDays)) {
    return stale ? null : `cached raw JSON; manifest stale from ${manifestEntry.fetchedAt}`;
  }

  return `cached raw JSON; manifest fresh from ${manifestEntry.fetchedAt}`;
}

// --- Fetch ---
let fetched = 0;
let skipped = 0;
let errors = 0;

for (const product of products) {
  if (!product.asin) {
    console.log(`Skipping ${product.name} — no ASIN`);
    continue;
  }

  const cacheSkipReason = !force ? await describeCacheSkip(product.asin) : null;
  if (cacheSkipReason) {
    skipped++;
    console.log(`Cached: ${product.asin} (${product.name}) — skipping (${cacheSkipReason})`);
    continue;
  }

  const url = config.buildUrl(product.asin, API_KEY);

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`HTTP ${res.status} for ${product.asin} (${product.name})`);
      errors++;
      continue;
    }

    const data = await res.json();
    const outPath = join(OUT_DIR, `${product.asin}.json`);
    await writeFile(outPath, JSON.stringify(data, null, 2));
    await updateAmazonCacheManifestEntry({
      asin: product.asin,
      payload: data,
      provider: config.key,
    });

    fetched++;
    console.log(`Fetched ${fetched}: ${product.asin} (${product.name}) ✓`);
  } catch (err) {
    console.error(`Error fetching ${product.asin}: ${err}`);
    errors++;
  }

  // Small delay between requests
  await new Promise((r) => setTimeout(r, 500));
}

console.log(
  `\nDone. Fetched: ${fetched}, Skipped (cached): ${skipped}, Errors: ${errors}`,
);
console.log(`Used ${fetched} ${config.name} searches this run.`);
