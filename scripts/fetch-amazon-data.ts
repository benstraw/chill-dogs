/**
 * Fetch Amazon product data (thumbnails, titles, etc.) via SerpAPI or SearchAPI.
 * Saves full JSON responses to src/data/amazon-products/{ASIN}.json
 *
 * Usage:
 *   bun run scripts/fetch-amazon-data.ts                          # all products, serpapi (default)
 *   bun run scripts/fetch-amazon-data.ts --provider searchapi     # all products, searchapi
 *   bun run scripts/fetch-amazon-data.ts --asin B0XXXXXX          # single ASIN
 *   bun run scripts/fetch-amazon-data.ts --force                  # re-fetch even if cached
 *   bun run scripts/fetch-amazon-data.ts --help
 */

import { coolingProducts } from '../src/data/cooling-products';
import { calmingProducts } from '../src/data/calming-products';
import { trackerProducts, accessoryProducts } from '../src/data/tracking-products';
import { writeFile, mkdir, access } from 'fs/promises';
import { join } from 'path';

// --- CLI args ---
const args = process.argv.slice(2);

if (args.includes('--help')) {
  console.log(`
Usage: bun run scripts/fetch-amazon-data.ts [options]

Options:
  --provider <serpapi|searchapi>   API provider (default: serpapi)
  --asin <ASIN>                   Fetch a single ASIN instead of all products
  --force                         Re-fetch even if cached JSON exists
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

if (provider !== 'serpapi' && provider !== 'searchapi') {
  console.error(`Unknown provider "${provider}". Use "serpapi" or "searchapi".`);
  process.exit(1);
}

// --- Provider config ---
interface ProviderConfig {
  name: string;
  envKey: string;
  buildUrl: (asin: string, apiKey: string) => string;
}

const providers: Record<string, ProviderConfig> = {
  serpapi: {
    name: 'SerpAPI',
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

// --- Output directory ---
const OUT_DIR = join(import.meta.dir, '..', 'src', 'data', 'amazon-products');
await mkdir(OUT_DIR, { recursive: true });

// --- Build product list ---
const allProducts = [
  ...coolingProducts.map((p) => ({ asin: p.asin, name: p.name })),
  ...calmingProducts.map((p) => ({ asin: p.asin, name: p.name })),
  ...trackerProducts.map((p) => ({ asin: p.asin, name: p.name })),
  ...accessoryProducts.map((p) => ({ asin: p.asin, name: p.name })),
];

const products = singleAsin
  ? allProducts.filter((p) => p.asin === singleAsin).length > 0
    ? allProducts.filter((p) => p.asin === singleAsin)
    : [{ asin: singleAsin, name: 'unknown' }]
  : allProducts;

// --- Check cache helper ---
async function isCached(asin: string): Promise<boolean> {
  try {
    await access(join(OUT_DIR, `${asin}.json`));
    return true;
  } catch {
    return false;
  }
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

  if (!force && (await isCached(product.asin))) {
    skipped++;
    console.log(`Cached: ${product.asin} (${product.name}) — skipping`);
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
