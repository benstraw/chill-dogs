/**
 * Report Amazon cache freshness, coverage, and drift without making network calls.
 *
 * Usage:
 *   bun run check:amazon
 *   bun run check:amazon -- --days 120
 *   bun run check:amazon -- --fail-on-stale
 */

import {
  DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS,
  buildAmazonCacheReport,
  type AmazonCacheDriftItem,
  type AmazonCacheReportItem,
  type AmazonCacheStaleItem,
} from '../src/scripts/amazon-cache-freshness';

const args = process.argv.slice(2);

function getArg(flag: string): string | undefined {
  const idx = args.indexOf(flag);
  return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined;
}

const thresholdDays = Number(getArg('--days') ?? DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS);
const failOnStale = args.includes('--fail-on-stale');

if (!Number.isFinite(thresholdDays) || thresholdDays < 0) {
  console.error(`Invalid --days value "${getArg('--days')}". Use a non-negative number.`);
  process.exit(1);
}

function label(item: AmazonCacheReportItem): string {
  const name = item.name ? ` ${item.name}` : '';
  const pillar = item.pillar ? ` [${item.pillar}]` : '';
  const detail = item.detail ? ` — ${item.detail}` : '';
  return `${item.asin}${pillar}${name}${detail}`;
}

function printItems(title: string, items: AmazonCacheReportItem[]) {
  if (items.length === 0) return;
  console.log(`\n${title} (${items.length})`);
  for (const item of items) {
    console.log(`  - ${label(item)}`);
  }
}

function printStaleItems(items: AmazonCacheStaleItem[]) {
  if (items.length === 0) return;
  console.log(`\nStale manifest entries (${items.length})`);
  for (const item of items) {
    console.log(`  - ${label(item)} — fetched ${item.fetchedAt}, ${item.ageDays} days old`);
  }
}

function printDriftItems(items: AmazonCacheDriftItem[]) {
  if (items.length === 0) return;
  console.log(`\nManifest/raw drift (${items.length})`);
  for (const item of items) {
    console.log(`  - ${label(item)} — ${item.field} changed`);
  }
}

try {
  const report = await buildAmazonCacheReport({ thresholdDays });
  const warningCount =
    report.missingRawCache.length +
    report.missingManifestEntries.length +
    report.staleEntries.length +
    report.malformedCachePayloads.length +
    report.driftedEntries.length +
    report.extraCacheFiles.length;

  console.log(`Amazon cache freshness report (${report.generatedAt})`);
  console.log(`Catalog ASINs: ${report.catalogAsinCount}`);
  console.log(`Cache files: ${report.cacheFileCount}`);
  console.log(`Stale threshold: ${report.thresholdDays} days`);

  printItems('Missing raw cache files', report.missingRawCache);
  printItems('Missing manifest entries', report.missingManifestEntries);
  printStaleItems(report.staleEntries);
  printItems('Malformed raw cache payloads', report.malformedCachePayloads);
  printDriftItems(report.driftedEntries);
  printItems('Extra cache files not referenced by catalog', report.extraCacheFiles);

  if (warningCount === 0) {
    console.log('\nNo Amazon cache freshness warnings.');
  } else {
    console.log(`\n${warningCount} warning${warningCount === 1 ? '' : 's'} found.`);
  }

  if (failOnStale && report.staleEntries.length > 0) {
    process.exit(1);
  }
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Amazon freshness check failed: ${message}`);
  process.exit(1);
}
