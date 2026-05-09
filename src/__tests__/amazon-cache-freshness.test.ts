import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  backfillAmazonCacheManifest,
  buildAmazonCacheReport,
  isCacheEntryStale,
  normalizeAmazonPayload,
  writeAmazonCacheManifest,
  type AmazonCacheManifest,
  type CatalogAsinEntry,
} from '../scripts/amazon-cache-freshness';

async function makeTempCacheDir(): Promise<string> {
  return mkdtemp(join(tmpdir(), 'amazon-cache-freshness-'));
}

async function writeJson(path: string, value: unknown): Promise<void> {
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}

describe('amazon-cache-freshness', () => {
  it('normalizes SerpAPI-style product payloads', () => {
    const normalized = normalizeAmazonPayload({
      search_metadata: {
        json_endpoint: 'https://serpapi.com/searches/example.json',
      },
      product: {
        title: '  Cooling Pad  ',
        main_image: 'https://example.com/pad.jpg',
      },
    });

    expect(normalized).toEqual({
      title: 'Cooling Pad',
      imageUrl: 'https://example.com/pad.jpg',
      provider: 'serpapi',
    });
  });

  it('normalizes SearchAPI-style product_results payloads', () => {
    const normalized = normalizeAmazonPayload({
      search_metadata: {
        html_url: 'https://www.searchapi.io/api/v1/searches/example.html',
      },
      product_results: {
        title: 'GPS Collar',
        thumbnail: 'https://example.com/collar.jpg',
      },
    });

    expect(normalized).toEqual({
      title: 'GPS Collar',
      imageUrl: 'https://example.com/collar.jpg',
      provider: 'searchapi',
    });
  });

  it('detects stale manifest entries by age in days', () => {
    expect(
      isCacheEntryStale(
        { fetchedAt: '2026-01-01T00:00:00.000Z', provider: 'serpapi' },
        90,
        new Date('2026-04-02T00:00:00.000Z'),
      ),
    ).toBe(true);

    expect(
      isCacheEntryStale(
        { fetchedAt: '2026-01-01T00:00:00.000Z', provider: 'serpapi' },
        90,
        new Date('2026-03-31T00:00:00.000Z'),
      ),
    ).toBe(false);
  });

  it('reports missing, stale, malformed, drifted, and extra cache entries', async () => {
    const cacheDir = await makeTempCacheDir();
    const manifestPath = join(cacheDir, '_index.json');
    const catalogItems: CatalogAsinEntry[] = [
      { asin: 'A1', name: 'Cached stale product', pillar: 'cooling' },
      { asin: 'A2', name: 'Missing manifest product', pillar: 'calming' },
      { asin: 'A3', name: 'Missing raw cache product', pillar: 'comfort' },
      { asin: 'A4', name: 'Malformed cache product', pillar: 'gear' },
    ];

    await writeJson(join(cacheDir, 'A1.json'), {
      product: {
        title: 'Current cached title',
        main_image: 'https://example.com/current.jpg',
      },
    });
    await writeJson(join(cacheDir, 'A2.json'), {
      product_results: {
        title: 'No manifest yet',
        thumbnail: 'https://example.com/a2.jpg',
      },
    });
    await writeFile(join(cacheDir, 'A4.json'), '{bad json');
    await writeJson(join(cacheDir, 'EXTRA.json'), {
      product: {
        title: 'Old removed product',
        main_image: 'https://example.com/extra.jpg',
      },
    });

    const manifest: AmazonCacheManifest = {
      A1: {
        fetchedAt: '2026-01-01T00:00:00.000Z',
        provider: 'serpapi',
        title: 'Manifest title',
        imageUrl: 'https://example.com/manifest.jpg',
      },
      A3: {
        fetchedAt: '2026-04-01T00:00:00.000Z',
        provider: 'searchapi',
        title: 'Missing raw',
      },
      A4: {
        fetchedAt: '2026-04-01T00:00:00.000Z',
        provider: 'unknown',
      },
    };
    await writeAmazonCacheManifest(manifest, manifestPath);

    const report = await buildAmazonCacheReport({
      cacheDir,
      manifestPath,
      catalogItems,
      thresholdDays: 90,
      now: new Date('2026-05-06T00:00:00.000Z'),
    });

    expect(report.missingRawCache.map((item) => item.asin)).toEqual(['A3']);
    expect(report.missingManifestEntries.map((item) => item.asin)).toEqual(['A2']);
    expect(report.staleEntries.map((item) => item.asin)).toEqual(['A1']);
    expect(report.malformedCachePayloads.map((item) => item.asin)).toEqual(['A4']);
    expect(report.driftedEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ asin: 'A1', field: 'title' }),
        expect.objectContaining({ asin: 'A1', field: 'imageUrl' }),
      ]),
    );
    expect(report.extraCacheFiles.map((item) => item.asin)).toEqual(['EXTRA']);
  });

  it('backfills a sorted manifest from existing cache files', async () => {
    const cacheDir = await makeTempCacheDir();
    const manifestPath = join(cacheDir, '_index.json');

    await mkdir(cacheDir, { recursive: true });
    await writeJson(join(cacheDir, 'B2.json'), {
      search_metadata: { json_endpoint: 'https://serpapi.com/searches/b2.json' },
      product: { title: 'Second', main_image: 'https://example.com/b2.jpg' },
    });
    await writeJson(join(cacheDir, 'A1.json'), {
      search_metadata: { html_url: 'https://www.searchapi.io/api/v1/searches/a1.html' },
      product_results: { title: 'First', thumbnail: 'https://example.com/a1.jpg' },
    });

    const manifest = await backfillAmazonCacheManifest({ cacheDir, manifestPath });
    const rawManifest = await readFile(manifestPath, 'utf8');

    expect(Object.keys(manifest)).toEqual(['A1', 'B2']);
    expect(rawManifest.indexOf('"A1"')).toBeLessThan(rawManifest.indexOf('"B2"'));
    expect(manifest.A1).toMatchObject({
      provider: 'searchapi',
      title: 'First',
      imageUrl: 'https://example.com/a1.jpg',
    });
    expect(manifest.B2).toMatchObject({
      provider: 'serpapi',
      title: 'Second',
      imageUrl: 'https://example.com/b2.jpg',
    });
  });
});
