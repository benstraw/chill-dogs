/**
 * Fetch Chewy product metadata from Impact catalogs.
 *
 * Data written by this script is diagnostic only. Canonical product copy,
 * image choices, and merchant offers must still be edited manually.
 */

import {
  listJoinedPrograms,
  listChewyCatalogItems,
  listChewyCatalogs,
  retrieveChewyCatalogItem,
  searchChewyCatalogItems,
  cleanConfigValue,
} from '../src/lib/affiliate/impact';
import {
  clearChewyCatalogCache,
  DEFAULT_CHEWY_CACHE_THRESHOLD_DAYS,
  deleteChewyCatalogItemCache,
  isChewyCacheEntryStale,
  normalizeChewyCatalogItem,
  readChewyCacheManifest,
  writeChewyCatalogItemCache,
} from '../src/scripts/chewy-cache';

const args = process.argv.slice(2);

if (args.includes('--help')) {
  printHelp();
  process.exit(0);
}

const catalogId = cleanConfigValue(getArg('--catalog-id')) ?? cleanConfigValue(process.env.CHEWY_IMPACT_CATALOG_ID);
const campaignId = cleanConfigValue(getArg('--campaign-id')) ?? cleanConfigValue(process.env.CHEWY_IMPACT_CAMPAIGN_ID);
const searchKeyword = getArg('--search');
const itemId = getArg('--item-id');
const deleteCacheItemId = getArg('--delete-cache');
const clearCache = args.includes('--clear-cache');
const force = args.includes('--force');
const stale = args.includes('--stale');
const noCache = args.includes('--no-cache');
const staleDays = Number(getArg('--days') ?? DEFAULT_CHEWY_CACHE_THRESHOLD_DAYS);

if (!Number.isFinite(staleDays) || staleDays < 0) {
  console.error(`Invalid --days value "${getArg('--days')}". Use a non-negative number.`);
  process.exit(1);
}

try {
  if (deleteCacheItemId) {
    const deleted = await deleteChewyCatalogItemCache(deleteCacheItemId);
    console.log(
      deleted
        ? `Deleted Chewy cache entry: ${deleteCacheItemId}`
        : `No Chewy cache entry found for: ${deleteCacheItemId}`,
    );
  } else if (clearCache) {
    const deletedCount = await clearChewyCatalogCache();
    console.log(`Cleared ${deletedCount} Chewy cache file(s) and reset _index.json.`);
  } else {
    const items = await fetchRequestedItems();
    const manifest = noCache ? {} : await readChewyCacheManifest();
    let cached = 0;
    let skipped = 0;

    for (const item of items) {
      const normalized = normalizeChewyCatalogItem(item);
      const label = `${normalized.catalogItemId} (${normalized.name ?? 'unknown'})`;

      if (noCache) {
        console.log(`Found: ${label}`);
        continue;
      }

      const existing = manifest[normalized.catalogItemId];
      const isFresh = existing && !isChewyCacheEntryStale(existing, staleDays);

      if (!force && isFresh && !stale) {
        skipped++;
        console.log(`Cached: ${label}`);
        continue;
      }

      if (!force && stale && isFresh) {
        skipped++;
        console.log(`Fresh: ${label}`);
        continue;
      }

      await writeChewyCatalogItemCache({ payload: item });
      cached++;
      console.log(`Cached ${cached}: ${label}`);
    }

    if (noCache) {
      console.log(`\nDone. Found: ${items.length}, Cached: 0 (--no-cache)`);
    } else {
      console.log(`\nDone. Cached: ${cached}, Skipped: ${skipped}, Seen: ${items.length}`);
    }
  }
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
}

async function fetchRequestedItems(): Promise<Record<string, unknown>[]> {
  if (searchKeyword !== undefined) {
    const items = await searchChewyCatalogItems({ keyword: searchKeyword, pageSize: 100, page: 1 });
    return items;
  }

  if (itemId) {
    if (!catalogId) {
      throw new Error('Missing --catalog-id or CHEWY_IMPACT_CATALOG_ID for --item-id.');
    }
    return [await retrieveChewyCatalogItem({ catalogId, itemId })];
  }

  if (catalogId) {
    return listChewyCatalogItems({ catalogId });
  }

  if (!campaignId) {
    const programs = await listJoinedPrograms();
    if (programs.length === 0) {
      throw new Error('No joined Impact programs found for this token.');
    }

    console.log('Available Impact programs:');
    for (const program of programs) {
      console.log(
        `- ${program.CampaignId ?? 'unknown'}: ${program.CampaignName ?? 'Unnamed'} (${program.AdvertiserName ?? 'unknown advertiser'})`,
      );
    }
    console.log('\nChoose the Chewy program and set CHEWY_IMPACT_CAMPAIGN_ID or pass --campaign-id.');
    process.exit(0);
  }

  const catalogs = await listChewyCatalogs({ campaignId });
  if (catalogs.length === 0) {
    throw new Error(`No Chewy Impact catalogs found for campaign ${campaignId}. Pass --catalog-id if you already know it.`);
  }

  console.log('Available Impact catalogs:');
  for (const catalog of catalogs) {
    console.log(`- ${catalog.Id ?? 'unknown'}: ${catalog.Name ?? 'Unnamed'} (${catalog.NumberOfItems ?? '?'} items)`);
  }
  console.log('\nChoose a catalog with --catalog-id or set CHEWY_IMPACT_CATALOG_ID.');
  process.exit(0);
}

function getArg(flag: string): string | undefined {
  const index = args.indexOf(flag);
  return index !== -1 && index + 1 < args.length ? args[index + 1] : undefined;
}

function printHelp(): void {
  console.log(`
Usage:
  bun run fetch:chewy -- --catalog-id <catalog-id>
  bun run fetch:chewy -- --catalog-id <catalog-id> --item-id <item-id>
  bun run fetch:chewy -- --campaign-id <campaign-id>
  bun run fetch:chewy -- --search "cooling mat"
  bun run fetch:chewy -- --search "cooling mat" --no-cache
  bun run fetch:chewy -- --delete-cache <item-id>
  bun run fetch:chewy -- --clear-cache
  bun run fetch:chewy -- --stale --days 90

Environment variables:
  IMPACT_ACCOUNT_SID
  IMPACT_AUTH_TOKEN
  CHEWY_IMPACT_CAMPAIGN_ID
  CHEWY_IMPACT_CATALOG_ID
`);
}
