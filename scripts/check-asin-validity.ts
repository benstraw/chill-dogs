/**
 * Check that all ASIN-linked products on the site are still valid on Amazon.
 * Hits amazon.com/dp/{ASIN} directly — no API key required.
 *
 * Usage:
 *   bun run check:asins            — check all ASINs
 *   bun run check:asins -- --quiet — only print issues, not OK lines
 */

import { productCatalogItems } from '../src/data/product-catalog';
import { getAllAmazonOfferEntries } from '../src/data/products/offers';

// --- CLI args ---
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');

// --- Deduplicate products by ASIN ---
const byAsin = new Map<string, { name: string; pillar: string }>();
for (const item of getAllAmazonOfferEntries(productCatalogItems)) {
  if (!byAsin.has(item.asin)) {
    byAsin.set(item.asin, { name: item.name, pillar: item.pillar ?? '' });
  }
}

const total = byAsin.size;
console.log(`Checking ${total} ASINs against amazon.com...\n`);

// --- Request headers that mimic a real browser ---
const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const TIMEOUT_MS = 15_000;
const DELAY_MS = 800;

// Amazon throttles unauthenticated traffic from shared CI runner IPs, so a 503
// or a CAPTCHA wall says nothing about the product. Those get retried, and a
// global budget keeps a fully-throttled run from burning the job timeout:
// 175 ASINs x 800ms is ~2.5min of baseline pacing, and the cap adds at most 5.
const RETRY_BACKOFF_MS = [3_000, 8_000];
const RETRY_BUDGET_MS = 300_000;

type Status = 'OK' | 'UNAVAILABLE' | 'REMOVED' | 'RATE LIMITED' | `ERROR ${number}` | 'UNKNOWN' | 'FETCH ERROR';

interface Result {
  asin: string;
  name: string;
  pillar: string;
  status: Status;
  detail?: string;
}

function classify(responseStatus: number, html: string, finalUrl: string): { status: Status; detail?: string } {
  if (responseStatus === 404) return { status: 'REMOVED', detail: '404' };
  if (responseStatus === 429 || responseStatus === 503) return { status: 'RATE LIMITED', detail: `HTTP ${responseStatus}` };
  if (responseStatus !== 200) return { status: `ERROR ${responseStatus}` };

  // Redirected away from /dp/ — product no longer has its own page
  if (!finalUrl.includes('/dp/')) {
    return { status: 'REMOVED', detail: 'redirected off product page' };
  }

  const lower = html.toLowerCase();

  // Unavailable — product page exists but item can't be bought
  if (lower.includes('currently unavailable') || lower.includes('this item is not available')) {
    return { status: 'UNAVAILABLE' };
  }

  // Amazon "page not found" / error pages
  if (
    lower.includes("isn't available") ||
    lower.includes('page not found') ||
    lower.includes('looking for something?') ||
    lower.includes('dogs of amazon')
  ) {
    return { status: 'REMOVED', detail: 'error page' };
  }

  // Product title present — definitive OK signal
  if (html.includes('id="productTitle"') || html.includes("id='productTitle'")) {
    return { status: 'OK' };
  }

  // CAPTCHA or bot-detection wall — couldn't assess
  if (lower.includes('captcha') || lower.includes('robot check')) {
    return { status: 'UNKNOWN', detail: 'CAPTCHA / bot check' };
  }

  return { status: 'UNKNOWN', detail: 'no product title found in page' };
}

// --- Column widths ---
const COL_ASIN = 12;
const COL_NAME = 46;
const COL_PILLAR = 9;

function pad(s: string, len: number): string {
  return s.length >= len ? s.slice(0, len - 1) + '…' : s.padEnd(len);
}

// A status that reflects Amazon refusing to answer, not a verdict on the
// product. Reporting these as dead links is what makes the check cry wolf.
const INCONCLUSIVE: ReadonlySet<Status> = new Set<Status>(['RATE LIMITED', 'UNKNOWN', 'FETCH ERROR']);

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function checkOnce(asin: string, name: string, pillar: string): Promise<Result> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(`https://www.amazon.com/dp/${asin}`, { headers: HEADERS, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    const html = await res.text();
    const { status, detail } = classify(res.status, html, res.url);
    return { asin, name, pillar, status, detail };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { asin, name, pillar, status: 'FETCH ERROR', detail: msg.slice(0, 60) };
  }
}

// --- Run checks ---
const dead: Result[] = [];
const inconclusive: Result[] = [];
let checked = 0;
let retryMsSpent = 0;

for (const [asin, { name, pillar }] of byAsin) {
  let result = await checkOnce(asin, name, pillar);

  for (const backoff of RETRY_BACKOFF_MS) {
    if (!INCONCLUSIVE.has(result.status)) break;
    if (retryMsSpent + backoff > RETRY_BUDGET_MS) break;
    retryMsSpent += backoff;
    await sleep(backoff);
    result = await checkOnce(asin, name, pillar);
  }

  checked++;

  const isInconclusive = INCONCLUSIVE.has(result.status);
  const isDead = result.status !== 'OK' && !isInconclusive;
  if (isDead) dead.push(result);
  if (isInconclusive) inconclusive.push(result);

  if (!quiet || isDead || isInconclusive) {
    const icon = isDead ? '✗' : isInconclusive ? '?' : '✓';
    const detail = result.detail ? `  ${result.detail}` : '';
    console.log(
      `${icon}  ${pad(asin, COL_ASIN)} ${pad(name, COL_NAME)} ${pad(pillar, COL_PILLAR)} ${result.status}${detail}`,
    );
  }

  if (checked < total) await sleep(DELAY_MS);
}

// --- Summary ---
// A run that could not see Amazon is not a passing run: it learned nothing.
// Past this share of inconclusive results, treat the check itself as broken
// rather than quietly reporting the products it did manage to reach as fine.
const INCONCLUSIVE_FAIL_RATIO = 0.25;
const blind = inconclusive.length > total * INCONCLUSIVE_FAIL_RATIO;

const links = `${dead.length} dead link${dead.length === 1 ? '' : 's'}`;
console.log(`\n${total} checked — ${links}, ${inconclusive.length} inconclusive`);

function list(label: string, results: Result[]) {
  if (results.length === 0) return;
  console.log(`\n${label}:`);
  for (const r of results) {
    const detail = r.detail ? `  (${r.detail})` : '';
    console.log(`  ${pad(r.asin, COL_ASIN)} ${pad(r.name, COL_NAME)} ${r.status}${detail}`);
  }
}

list('Dead links — product is gone or unbuyable', dead);
list('Inconclusive — Amazon would not answer, product status unknown', inconclusive);

if (blind) {
  console.log(
    `\nCheck is unreliable: ${inconclusive.length}/${total} inconclusive after retries.` +
      '\nAmazon is likely throttling this runner rather than these products being dead.',
  );
}

process.exit(dead.length > 0 || blind ? 1 : 0);
