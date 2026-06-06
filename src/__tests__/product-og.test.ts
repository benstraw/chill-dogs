import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

import { staticSitemapSections, type SitemapPage } from '../data/content-sitemap';
import { cacheKey, copyCachedOutputToPublic, writeOutputWithCache } from '../scripts/og-gen/cache';
import { getProductOgHrefs, productOgCacheKey } from '../scripts/og-gen/generate';
import { outputFilenameFromHref, resolveOgSummary, splitOgTitle } from '../scripts/og-gen/text';
import { validateHeroProductPage } from '../scripts/og-gen/validation';
import { buildGeneralOgRecords } from '../scripts/generate-og-images.mjs';

const touchedKeys: string[] = [];
const touchedDirs: string[] = [];

function pagesByHref(): Map<string, SitemapPage> {
  return new Map(staticSitemapSections.flatMap((section) => section.pages).map((page) => [page.href, page]));
}

function page(overrides: Partial<SitemapPage>): SitemapPage {
  return {
    href: '/test/page/',
    baseTitle: 'Test Page',
    pageType: 'converter',
    preview: {
      title: 'Test Page | Chill-Dogs',
      description: 'A short page description for testing.',
      image: '/og/test-page.jpg',
    },
    ...overrides,
  };
}

afterEach(() => {
  for (const key of touchedKeys.splice(0)) {
    rmSync(path.join(process.cwd(), '.cache', 'og-gen', 'outputs', `${key}.jpg`), { force: true });
  }

  for (const dir of touchedDirs.splice(0)) {
    rmSync(dir, { force: true, recursive: true });
  }
});

describe('product-style OG images', () => {
  it('selects product-style routes by heroProduct presence', () => {
    const sitemapProductHrefs = staticSitemapSections
      .flatMap((section) => section.pages)
      .filter((item) => item.heroProduct)
      .map((item) => item.href);

    expect(getProductOgHrefs()).toEqual(sitemapProductHrefs);
    expect(getProductOgHrefs()).toContain('/cooling/cooling-mats/');
    expect(getProductOgHrefs()).toContain('/calming/best-calming-products-for-anxious-dogs/');
    expect(getProductOgHrefs()).toContain('/comforting/best-calming-dog-beds/');
  });

  it('keeps browse/search-oriented shop on the general OG path', () => {
    const pages = pagesByHref();
    const shopPage = pages.get('/shop/');
    const generalRecords = buildGeneralOgRecords().map((record) => record.pathname);

    expect(shopPage?.heroProduct).toBeUndefined();
    expect(getProductOgHrefs()).not.toContain('/shop/');
    expect(generalRecords).toContain('/shop/');
  });

  it('gives Garmin and AirTag product-style OG metadata', () => {
    const pages = pagesByHref();

    expect(pages.get('/gear/garmin-dog-tracking-collars/')?.heroProduct).toMatchObject({
      badge: 'Best Off-Grid System',
      name: 'Garmin Alpha TT 25 + 300i',
    });
    expect(pages.get('/gear/airtag-for-dogs/')?.heroProduct).toMatchObject({
      badge: 'Bluetooth Backup',
      name: 'Apple AirTag 2nd Gen',
    });
    expect(getProductOgHrefs()).toContain('/gear/garmin-dog-tracking-collars/');
    expect(getProductOgHrefs()).toContain('/gear/airtag-for-dogs/');
  });

  it('keeps product-style routes out of the general generator records', () => {
    const generalRecords = buildGeneralOgRecords().map((record) => record.pathname);

    expect(generalRecords).not.toContain('/gear/garmin-dog-tracking-collars/');
    expect(generalRecords).not.toContain('/gear/airtag-for-dogs/');
    expect(generalRecords).not.toContain('/cooling/cooling-mats/');
    expect(generalRecords).toContain('/shop/');
  });

  it('derives route output filenames from canonical hrefs', () => {
    expect(outputFilenameFromHref('/')).toBe('home.jpg');
    expect(outputFilenameFromHref('/gear/garmin-dog-tracking-collars/')).toBe(
      'gear-garmin-dog-tracking-collars.jpg'
    );
  });

  it('falls back to a compact first-sentence summary', () => {
    expect(
      resolveOgSummary({
        description:
          'Compare the top picks: one, two, and three. Extra detail belongs later and should not lead the card.',
      })
    ).toBe('Compare the top picks');
    expect(
      resolveOgSummary({
        description: 'Keep dogs cooler in the car — with shade, airflow, hydration, and planning.',
      })
    ).toBe('Keep dogs cooler in the car');
    expect(
      resolveOgSummary({
        ogSummary: '  Custom summary\nwith tidy spacing. ',
        description: 'Unused fallback.',
      })
    ).toBe('Custom summary with tidy spacing.');
  });

  it('splits titles on editorial delimiters without losing punctuation', () => {
    expect(splitOgTitle('Best Cooling Mats: Easy Summer Relief')).toEqual({
      before: 'Best Cooling Mats:',
      after: 'Easy Summer Relief',
    });
    expect(splitOgTitle('AirTag for Dogs — When It Helps')).toEqual({
      before: 'AirTag for Dogs',
      after: '— When It Helps',
    });
    expect(splitOgTitle('Best Dog GPS Trackers')).toEqual({ before: 'Best Dog GPS Trackers' });
  });

  it('keeps cache keys stable and copies cached output to a public target', () => {
    const key = cacheKey({ route: '/gear/airtag-for-dogs/', version: 'test-v1' });
    const targetDir = mkdtempSync(path.join(tmpdir(), 'chill-og-target-'));
    const targetPath = path.join(targetDir, 'airtag.jpg');
    const jpegBuffer = Buffer.from('fake-jpeg-bytes');
    touchedKeys.push(key);
    touchedDirs.push(targetDir);

    expect(cacheKey({ route: '/gear/airtag-for-dogs/', version: 'test-v1' })).toBe(key);
    writeOutputWithCache(key, targetPath, jpegBuffer);
    writeFileSync(targetPath, 'stale');

    expect(copyCachedOutputToPublic(key, targetPath)).toBe(true);
    expect(readFileSync(targetPath)).toEqual(jpegBuffer);
  });

  it('includes hero product fields in the rendered output cache key', () => {
    const pages = pagesByHref();
    const garminPage = pages.get('/gear/garmin-dog-tracking-collars/');

    expect(garminPage).toBeDefined();
    if (!garminPage?.heroProduct) return;

    expect(productOgCacheKey(garminPage)).toBe(productOgCacheKey(garminPage));
    expect(
      productOgCacheKey({
        ...garminPage,
        heroProduct: { ...garminPage.heroProduct, badge: 'Alternate Badge' },
      })
    ).not.toBe(productOgCacheKey(garminPage));
  });

  it('validates only provided hero product metadata', () => {
    expect(validateHeroProductPage(page({ heroProduct: undefined }))).toEqual([]);
    expect(
      validateHeroProductPage(
        page({
          heroProduct: {
            image: 'https://example.com/product',
            badge: '',
            name: 'A'.repeat(49),
          },
        })
      )
    ).toEqual([
      '/test/page/: heroProduct.image must be a direct image URL',
      '/test/page/: heroProduct.badge is required',
      '/test/page/: heroProduct.name must be 48 characters or fewer',
    ]);
    expect(
      validateHeroProductPage(
        page({
          heroProduct: {
            image: 'https://example.com/product.jpg?width=800',
            badge: 'Best Pick',
            name: 'Short Product Name',
          },
        })
      )
    ).toEqual([]);
  });
});
