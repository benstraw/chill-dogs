import { readdir, readFile, stat, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { productCatalogItems } from '../data/product-catalog';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..', '..');

export const DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS = 90;
export const AMAZON_CACHE_DIR = join(PROJECT_ROOT, 'src', 'data', 'amazon-products');
export const AMAZON_CACHE_MANIFEST_PATH = join(AMAZON_CACHE_DIR, '_index.json');

export type AmazonCacheProvider = 'serpapi' | 'searchapi' | 'unknown';

export interface AmazonCacheManifestEntry {
  fetchedAt: string;
  provider: AmazonCacheProvider;
  title?: string;
  imageUrl?: string;
}

export type AmazonCacheManifest = Record<string, AmazonCacheManifestEntry>;

export interface NormalizedAmazonPayload {
  title?: string;
  imageUrl?: string;
  provider: AmazonCacheProvider;
}

export interface CatalogAsinEntry {
  asin: string;
  name: string;
  pillar: string;
}

export interface AmazonCacheReportItem {
  asin: string;
  name?: string;
  pillar?: string;
  file?: string;
  detail?: string;
}

export interface AmazonCacheStaleItem extends AmazonCacheReportItem {
  fetchedAt: string;
  ageDays: number;
}

export interface AmazonCacheDriftItem extends AmazonCacheReportItem {
  field: 'title' | 'imageUrl';
  manifestValue?: string;
  cacheValue?: string;
}

export interface AmazonCacheReport {
  generatedAt: string;
  thresholdDays: number;
  catalogAsinCount: number;
  cacheFileCount: number;
  missingRawCache: AmazonCacheReportItem[];
  missingManifestEntries: AmazonCacheReportItem[];
  staleEntries: AmazonCacheStaleItem[];
  malformedCachePayloads: AmazonCacheReportItem[];
  driftedEntries: AmazonCacheDriftItem[];
  extraCacheFiles: AmazonCacheReportItem[];
}

interface BuildAmazonCacheReportOptions {
  thresholdDays?: number;
  now?: Date;
  cacheDir?: string;
  manifestPath?: string;
  catalogItems?: CatalogAsinEntry[];
}

interface BackfillAmazonCacheManifestOptions {
  cacheDir?: string;
  manifestPath?: string;
}

interface UpdateAmazonCacheManifestEntryOptions {
  asin: string;
  payload: unknown;
  provider: AmazonCacheProvider;
  fetchedAt?: Date;
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

function imageFromArray(value: unknown): string | undefined {
  if (!Array.isArray(value)) return undefined;

  for (const item of value) {
    if (typeof item === 'string') return cleanString(item);
    const record = asRecord(item);
    const image = firstString(record?.link, record?.url, record?.image, record?.large, record?.thumbnail);
    if (image) return image;
  }

  return undefined;
}

export function normalizeAmazonPayload(payload: unknown): NormalizedAmazonPayload {
  const root = asRecord(payload);
  const product = asRecord(root?.product);
  const productResults = asRecord(root?.product_results);

  return {
    title: firstString(product?.title, productResults?.title),
    imageUrl: firstString(
      product?.main_image,
      productResults?.thumbnail,
      productResults?.image,
      imageFromArray(product?.images),
      imageFromArray(productResults?.images),
    ),
    provider: inferAmazonPayloadProvider(payload),
  };
}

export function inferAmazonPayloadProvider(payload: unknown): AmazonCacheProvider {
  const root = asRecord(payload);
  const metadata = asRecord(root?.search_metadata);
  const haystack = [
    metadata?.json_endpoint,
    metadata?.raw_html_file,
    metadata?.html_url,
    metadata?.json_url,
    metadata?.request_url,
  ]
    .map((value) => (typeof value === 'string' ? value.toLowerCase() : ''))
    .join(' ');

  if (haystack.includes('serpapi.com')) return 'serpapi';
  if (haystack.includes('searchapi.io')) return 'searchapi';
  return 'unknown';
}

export function isCacheEntryStale(
  entry: AmazonCacheManifestEntry,
  thresholdDays = DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS,
  now = new Date(),
): boolean {
  return getCacheEntryAgeDays(entry, now) > thresholdDays;
}

export function getCacheEntryAgeDays(entry: AmazonCacheManifestEntry, now = new Date()): number {
  const fetchedAt = new Date(entry.fetchedAt);
  const fetchedAtMs = fetchedAt.getTime();
  if (Number.isNaN(fetchedAtMs)) return Number.POSITIVE_INFINITY;

  const ageMs = now.getTime() - fetchedAtMs;
  return Math.max(0, Math.floor(ageMs / 86_400_000));
}

export function getCatalogAsinEntries(items = productCatalogItems): CatalogAsinEntry[] {
  const byAsin = new Map<string, CatalogAsinEntry>();

  for (const item of items) {
    if (item.asin && !byAsin.has(item.asin)) {
      byAsin.set(item.asin, {
        asin: item.asin,
        name: item.name,
        pillar: item.pillar,
      });
    }
  }

  return [...byAsin.values()].sort((a, b) => a.asin.localeCompare(b.asin));
}

export function sortAmazonCacheManifest(manifest: AmazonCacheManifest): AmazonCacheManifest {
  return Object.fromEntries(Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)));
}

export async function readAmazonCacheManifest(
  manifestPath = AMAZON_CACHE_MANIFEST_PATH,
): Promise<AmazonCacheManifest> {
  try {
    const raw = await readFile(manifestPath, 'utf8');
    return JSON.parse(raw) as AmazonCacheManifest;
  } catch (err) {
    if (asRecord(err)?.code === 'ENOENT') return {};
    throw err;
  }
}

export async function writeAmazonCacheManifest(
  manifest: AmazonCacheManifest,
  manifestPath = AMAZON_CACHE_MANIFEST_PATH,
): Promise<void> {
  const sorted = sortAmazonCacheManifest(manifest);
  await writeFile(manifestPath, `${JSON.stringify(sorted, null, 2)}\n`);
}

export async function updateAmazonCacheManifestEntry({
  asin,
  payload,
  provider,
  fetchedAt = new Date(),
  manifestPath = AMAZON_CACHE_MANIFEST_PATH,
}: UpdateAmazonCacheManifestEntryOptions): Promise<AmazonCacheManifestEntry> {
  const manifest = await readAmazonCacheManifest(manifestPath);
  const normalized = normalizeAmazonPayload(payload);
  const entry: AmazonCacheManifestEntry = {
    fetchedAt: fetchedAt.toISOString(),
    provider,
    title: normalized.title,
    imageUrl: normalized.imageUrl,
  };

  manifest[asin] = entry;
  await writeAmazonCacheManifest(manifest, manifestPath);
  return entry;
}

export async function listAmazonCacheAsins(cacheDir = AMAZON_CACHE_DIR): Promise<string[]> {
  const files = await readdir(cacheDir);
  return files
    .filter((file) => file.endsWith('.json') && file !== '_index.json')
    .map((file) => file.replace(/\.json$/, ''))
    .sort((a, b) => a.localeCompare(b));
}

async function readCachePayload(cacheDir: string, asin: string): Promise<unknown> {
  const raw = await readFile(join(cacheDir, `${asin}.json`), 'utf8');
  return JSON.parse(raw);
}

export async function buildAmazonCacheReport({
  thresholdDays = DEFAULT_AMAZON_CACHE_THRESHOLD_DAYS,
  now = new Date(),
  cacheDir = AMAZON_CACHE_DIR,
  manifestPath = AMAZON_CACHE_MANIFEST_PATH,
  catalogItems,
}: BuildAmazonCacheReportOptions = {}): Promise<AmazonCacheReport> {
  const catalogAsins = getCatalogAsinEntries(catalogItems);
  const catalogAsinSet = new Set(catalogAsins.map((item) => item.asin));
  const cacheAsins = await listAmazonCacheAsins(cacheDir);
  const cacheAsinSet = new Set(cacheAsins);
  const manifest = await readAmazonCacheManifest(manifestPath);

  const report: AmazonCacheReport = {
    generatedAt: now.toISOString(),
    thresholdDays,
    catalogAsinCount: catalogAsins.length,
    cacheFileCount: cacheAsins.length,
    missingRawCache: [],
    missingManifestEntries: [],
    staleEntries: [],
    malformedCachePayloads: [],
    driftedEntries: [],
    extraCacheFiles: cacheAsins
      .filter((asin) => !catalogAsinSet.has(asin))
      .map((asin) => ({ asin, file: join(cacheDir, `${asin}.json`) })),
  };

  for (const item of catalogAsins) {
    const cacheExists = cacheAsinSet.has(item.asin);
    const manifestEntry = manifest[item.asin];

    if (!cacheExists) {
      report.missingRawCache.push(item);
    }

    if (!manifestEntry) {
      report.missingManifestEntries.push(item);
    } else if (isCacheEntryStale(manifestEntry, thresholdDays, now)) {
      report.staleEntries.push({
        ...item,
        fetchedAt: manifestEntry.fetchedAt,
        ageDays: getCacheEntryAgeDays(manifestEntry, now),
      });
    }

    if (!cacheExists) continue;

    try {
      const payload = await readCachePayload(cacheDir, item.asin);
      const normalized = normalizeAmazonPayload(payload);

      if (manifestEntry?.title && normalized.title && manifestEntry.title !== normalized.title) {
        report.driftedEntries.push({
          ...item,
          field: 'title',
          manifestValue: manifestEntry.title,
          cacheValue: normalized.title,
        });
      }

      if (manifestEntry?.imageUrl && normalized.imageUrl && manifestEntry.imageUrl !== normalized.imageUrl) {
        report.driftedEntries.push({
          ...item,
          field: 'imageUrl',
          manifestValue: manifestEntry.imageUrl,
          cacheValue: normalized.imageUrl,
        });
      }
    } catch (err) {
      report.malformedCachePayloads.push({
        ...item,
        file: join(cacheDir, `${item.asin}.json`),
        detail: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return report;
}

export async function backfillAmazonCacheManifest({
  cacheDir = AMAZON_CACHE_DIR,
  manifestPath = AMAZON_CACHE_MANIFEST_PATH,
}: BackfillAmazonCacheManifestOptions = {}): Promise<AmazonCacheManifest> {
  const cacheAsins = await listAmazonCacheAsins(cacheDir);
  const manifest: AmazonCacheManifest = {};

  for (const asin of cacheAsins) {
    const filePath = join(cacheDir, `${asin}.json`);
    const [payload, fileStat] = await Promise.all([readCachePayload(cacheDir, asin), stat(filePath)]);
    const normalized = normalizeAmazonPayload(payload);

    manifest[asin] = {
      fetchedAt: fileStat.mtime.toISOString(),
      provider: normalized.provider,
      title: normalized.title,
      imageUrl: normalized.imageUrl,
    };
  }

  await writeAmazonCacheManifest(manifest, manifestPath);
  return sortAmazonCacheManifest(manifest);
}
