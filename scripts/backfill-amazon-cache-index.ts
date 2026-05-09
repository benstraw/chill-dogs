/**
 * Backfill src/data/amazon-products/_index.json from existing raw cache files.
 * Does not fetch network data or alter raw provider payloads.
 *
 * Usage:
 *   bun run scripts/backfill-amazon-cache-index.ts
 */

import { backfillAmazonCacheManifest } from '../src/scripts/amazon-cache-freshness';

try {
  const manifest = await backfillAmazonCacheManifest();
  console.log(`Backfilled Amazon cache manifest with ${Object.keys(manifest).length} entries.`);
  console.log('Wrote src/data/amazon-products/_index.json');
} catch (err) {
  const message = err instanceof Error ? err.message : String(err);
  console.error(`Amazon cache manifest backfill failed: ${message}`);
  process.exit(1);
}
