/**
 * Check that all ASIN-linked products on the site are still valid on Amazon.
 * Hits amazon.com/dp/{ASIN} directly — no API key required.
 *
 * Usage:
 *   bun run check:asins            — check all ASINs
 *   bun run check:asins -- --quiet — only print issues, not OK lines
 */

import { productCatalogItems } from '../src/data/product-catalog';

// --- CLI args ---
const args = process.argv.slice(2);
const quiet = args.includes('--quiet');

// --- Deduplicate products by ASIN ---
const byAsin = new Map<string, { name: string; pillar: string }>();
for (const item of productCatalogItems) {
  if (item.asin && !byAsin.has(item.asin)) {
    byAsin.set(item.asin, { name: item.name, pillar: item.pillar });
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

// --- Run checks ---
const issues: Result[] = [];
let checked = 0;

for (const [asin, { name, pillar }] of byAsin) {
  const url = `https://www.amazon.com/dp/${asin}`;
  let result: Result;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let res: Response;
    try {
      res = await fetch(url, { headers: HEADERS, signal: controller.signal });
    } finally {
      clearTimeout(timer);
    }

    const html = await res.text();
    const { status, detail } = classify(res.status, html, res.url);
    result = { asin, name, pillar, status, detail };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    result = { asin, name, pillar, status: 'FETCH ERROR', detail: msg.slice(0, 60) };
  }

  checked++;

  const isIssue = result.status !== 'OK';
  if (isIssue) issues.push(result);

  if (!quiet || isIssue) {
    const icon = isIssue ? '✗' : '✓';
    const detail = result.detail ? `  ${result.detail}` : '';
    console.log(
      `${icon}  ${pad(asin, COL_ASIN)} ${pad(name, COL_NAME)} ${pad(pillar, COL_PILLAR)} ${result.status}${detail}`,
    );
  }

  if (checked < total) {
    await new Promise((r) => setTimeout(r, DELAY_MS));
  }
}

// --- Summary ---
console.log(`\n${total} checked — ${issues.length} issue${issues.length === 1 ? '' : 's'}`);

if (issues.length > 0) {
  console.log('\nIssues:');
  for (const r of issues) {
    const detail = r.detail ? `  (${r.detail})` : '';
    console.log(`  ${pad(r.asin, COL_ASIN)} ${pad(r.name, COL_NAME)} ${r.status}${detail}`);
  }
}

process.exit(issues.length > 0 ? 1 : 0);
