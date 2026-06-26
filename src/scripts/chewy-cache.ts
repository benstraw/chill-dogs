import { mkdir, readFile, readdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');

export const DEFAULT_CHEWY_CACHE_THRESHOLD_DAYS = 90;
export const CHEWY_CACHE_DIR = join(PROJECT_ROOT, 'src', 'data', 'chewy-products');
export const CHEWY_CACHE_MANIFEST_PATH = join(CHEWY_CACHE_DIR, '_index.json');

export type ChewyCacheProvider = 'impact' | 'unknown';

export interface NormalizedChewyCatalogItem {
  catalogItemId: string;
  name?: string;
  description?: string;
  url?: string;
  imageUrl?: string;
  additionalImageUrls?: string[];
  currentPrice?: string;
  stockAvailability?: string;
  gtin?: string;
  mpn?: string;
  category?: string;
  provider: ChewyCacheProvider;
}

export interface ChewyCacheManifestEntry extends NormalizedChewyCatalogItem {
  fetchedAt: string;
}

export type ChewyCacheManifest = Record<string, ChewyCacheManifestEntry>;

interface WriteChewyCatalogItemCacheOptions {
  payload: unknown;
  provider?: ChewyCacheProvider;
  fetchedAt?: Date;
  cacheDir?: string;
  manifestPath?: string;
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
}

function cleanString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    const clean = cleanString(value);
    if (clean) return clean;
  }
  return undefined;
}

function stringArray(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;

  const strings = value
    .map((item) => cleanString(item))
    .filter((item): item is string => Boolean(item));
  return strings.length > 0 ? strings : undefined;
}

export function normalizeChewyCatalogItem(
  payload: unknown,
  provider: ChewyCacheProvider = 'impact',
): NormalizedChewyCatalogItem {
  const item = asRecord(payload);
  const catalogItemId = firstString(item?.CatalogItemId, item?.Id);

  if (!catalogItemId) {
    throw new Error('Chewy catalog item is missing CatalogItemId or Id.');
  }

  return {
    catalogItemId,
    name: cleanString(item?.Name),
    description: cleanString(item?.Description),
    url: cleanString(item?.Url),
    imageUrl: cleanString(item?.ImageUrl),
    additionalImageUrls: stringArray(item?.AdditionalImageUrls),
    currentPrice: cleanString(item?.CurrentPrice),
    stockAvailability: cleanString(item?.StockAvailability),
    gtin: cleanString(item?.Gtin),
    mpn: cleanString(item?.Mpn),
    category: firstString(item?.Category, item?.OriginalFormatCategory, item?.SubCategory),
    provider,
  };
}

export function getChewyCacheEntryAgeDays(entry: Pick<ChewyCacheManifestEntry, 'fetchedAt'>, now = new Date()): number {
  const fetchedAt = new Date(entry.fetchedAt);
  const fetchedAtMs = fetchedAt.getTime();
  if (Number.isNaN(fetchedAtMs)) return Number.POSITIVE_INFINITY;

  const ageMs = now.getTime() - fetchedAtMs;
  return Math.max(0, Math.floor(ageMs / 86_400_000));
}

export function isChewyCacheEntryStale(
  entry: Pick<ChewyCacheManifestEntry, 'fetchedAt'>,
  thresholdDays = DEFAULT_CHEWY_CACHE_THRESHOLD_DAYS,
  now = new Date(),
): boolean {
  return getChewyCacheEntryAgeDays(entry, now) > thresholdDays;
}

export async function readChewyCacheManifest(
  manifestPath = CHEWY_CACHE_MANIFEST_PATH,
): Promise<ChewyCacheManifest> {
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw) as ChewyCacheManifest;
  } catch (err) {
    if (asRecord(err)?.code === 'ENOENT') return {};
    throw err;
  }
}

export async function writeChewyCacheManifest(
  manifest: ChewyCacheManifest,
  manifestPath = CHEWY_CACHE_MANIFEST_PATH,
): Promise<void> {
  const sorted = Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
  await mkdir(dirname(manifestPath), { recursive: true });
  await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
}

export async function writeChewyCatalogItemCache({
  payload,
  provider = 'impact',
  fetchedAt = new Date(),
  cacheDir = CHEWY_CACHE_DIR,
  manifestPath = CHEWY_CACHE_MANIFEST_PATH,
}: WriteChewyCatalogItemCacheOptions): Promise<ChewyCacheManifestEntry> {
  const normalized = normalizeChewyCatalogItem(payload, provider);
  const manifest = await readChewyCacheManifest(manifestPath);
  const entry: ChewyCacheManifestEntry = {
    fetchedAt: fetchedAt.toISOString(),
    ...normalized,
  };

  await mkdir(cacheDir, { recursive: true });
  await writeFile(join(cacheDir, `${toSafeCacheFileStem(normalized.catalogItemId)}.json`), `${JSON.stringify(payload, null, 2)}\n`);
  manifest[normalized.catalogItemId] = entry;
  await writeChewyCacheManifest(manifest, manifestPath);
  return entry;
}

export async function deleteChewyCatalogItemCache(
  catalogItemId: string,
  cacheDir = CHEWY_CACHE_DIR,
  manifestPath = CHEWY_CACHE_MANIFEST_PATH,
): Promise<boolean> {
  const cleanCatalogItemId = catalogItemId.trim();
  if (!cleanCatalogItemId) {
    throw new Error('Chewy catalog item ID is required.');
  }

  const manifest = await readChewyCacheManifest(manifestPath);
  const hadManifestEntry = Object.hasOwn(manifest, cleanCatalogItemId);
  delete manifest[cleanCatalogItemId];
  await writeChewyCacheManifest(manifest, manifestPath);

  const deletedRawFile = await unlinkIfExists(join(cacheDir, `${toSafeCacheFileStem(cleanCatalogItemId)}.json`));
  return hadManifestEntry || deletedRawFile;
}

export async function clearChewyCatalogCache(
  cacheDir = CHEWY_CACHE_DIR,
  manifestPath = CHEWY_CACHE_MANIFEST_PATH,
): Promise<number> {
  const itemIds = await listChewyCacheItemIds(cacheDir);

  for (const itemId of itemIds) {
    await unlinkIfExists(join(cacheDir, `${toSafeCacheFileStem(itemId)}.json`));
  }

  await writeChewyCacheManifest({}, manifestPath);
  return itemIds.length;
}

export async function listChewyCacheItemIds(cacheDir = CHEWY_CACHE_DIR): Promise<string[]> {
  try {
    const files = await readdir(cacheDir);
    return files
      .filter((file) => file.endsWith('.json') && file !== '_index.json')
      .map((file) => file.replace(/\.json$/, ''))
      .sort((a, b) => a.localeCompare(b));
  } catch (err) {
    if (asRecord(err)?.code === 'ENOENT') return [];
    throw err;
  }
}

export function toSafeCacheFileStem(value: string): string {
  return value.trim().replace(/[^a-zA-Z0-9._-]/g, '_');
}

async function unlinkIfExists(path: string): Promise<boolean> {
  try {
    await unlink(path);
    return true;
  } catch (err) {
    if (asRecord(err)?.code === 'ENOENT') return false;
    throw err;
  }
}
