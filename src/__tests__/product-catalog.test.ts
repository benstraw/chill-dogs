import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { calmingProducts } from '../data/calming-products';
import { categoryMeta, coolingProducts } from '../data/cooling-products';
import { emergencyProducts } from '../data/emergency-products';
import { fleaTickProducts } from '../data/flea-tick-products';
import { productCatalogItems } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { relaxationProducts } from '../data/relaxation-products';
import { accessoryProducts, trackerProducts } from '../data/tracking-products';

/**
 * ASINs that two catalog records share today. Ratchet: entries may be removed, never
 * added. B0C9TX38RZ is the OHMO bowl, listed as `ohmo-spill-proof-bowl` (car-cooling)
 * and `ohmo-spill-proof-dog-bowl` (hydration): two near-duplicate /shop/ pages.
 */
const KNOWN_DUPLICATE_ASINS = new Set(['B0C9TX38RZ']);

describe('admin product catalog data', () => {
  it('gives every ASIN a valid shape and one catalog record', () => {
    // An invariant over the whole catalog instead of a hard-coded list of 27 ASINs,
    // which had to be edited with every kit change and checked nothing about the rest.
    const asins = productCatalogItems.map((product) => product.asin).filter((asin): asin is string => Boolean(asin));
    expect(asins.length).toBeGreaterThan(100);
    expect(asins.filter((asin) => !/^[A-Z0-9]{10}$/.test(asin))).toEqual([]);

    const seen = new Map<string, string>();
    const duplicates: string[] = [];
    for (const product of productCatalogItems) {
      if (!product.asin) continue;
      const first = seen.get(product.asin);
      if (first && !KNOWN_DUPLICATE_ASINS.has(product.asin)) duplicates.push(`${product.asin}: ${first} and ${product.id}`);
      seen.set(product.asin, first ?? product.id);
    }
    expect(duplicates, 'one product, two /shop/ pages: merge the records (an id rename needs redirects)').toEqual([]);
  });

  it('includes every product from every product data file', () => {
    const sourceProducts = [
      ...coolingProducts,
      ...calmingProducts,
      ...relaxationProducts,
      ...trackerProducts,
      ...accessoryProducts,
      ...emergencyProducts,
      ...fleaTickProducts,
    ];
    const catalogIds = new Set(productCatalogItems.map((product) => product.id));

    expect(productCatalogItems).toHaveLength(sourceProducts.length);
    expect(sourceProducts.filter((product) => !catalogIds.has(product.id)).map((product) => product.id)).toEqual([]);
  });

  it('imports every *-products.ts data file into the catalog', () => {
    // The list above mirrors the catalog's own imports, so a new product file left out of
    // both would pass it. This reads the directory instead. A file that only re-exports
    // an imported one (comfort-products.ts aliases relaxation-products.ts) counts.
    const dataDir = path.resolve(__dirname, '../data');
    const catalogSource = readFileSync(path.join(dataDir, 'product-catalog.ts'), 'utf8');
    const imported = new Set(Array.from(catalogSource.matchAll(/from '\.\/([\w-]+-products)'/g), (m) => m[1]));
    expect(imported.size).toBeGreaterThan(0);

    const missing = readdirSync(dataDir)
      .filter((file) => file.endsWith('-products.ts'))
      .map((file) => file.replace(/\.ts$/, ''))
      .filter((name) => {
        if (imported.has(name)) return false;
        const reExportOf = readFileSync(path.join(dataDir, `${name}.ts`), 'utf8').match(/^export \{[\s\S]*?\} from '\.\/([\w-]+)';\s*$/);
        return !(reExportOf && imported.has(reExportOf[1]));
      });
    expect(missing, 'import these in src/data/product-catalog.ts').toEqual([]);
  });

  it('normalizes all products for admin display', () => {
    expect(productCatalogItems.length).toBeGreaterThan(100);
    expect(productCatalogItems.filter((product) => product.amazonUrl).length).toBeGreaterThan(0);
    for (const product of productCatalogItems) {
      expect(product.id).toBeTruthy();
      expect(product.name).toBeTruthy();
      expect(product.pillar).toMatch(/^(cooling|calming|comfort|gear|safety)$/);
      expect(product.category).toBeTruthy();
      if (product.amazonUrl) {
        expect(product.amazonUrl).toContain('tag=chill-dogs-20');
      }
      expect(product.offers.length).toBeGreaterThan(0);
      expect(product.bullets.length).toBeGreaterThan(0);
      expect(product.source).toMatch(/^src\/data\/.+\.ts$/);
    }
  });

  it('tracks gear products in the page map', () => {
    const pageMap = buildProductPageMap();

    expect(pageMap['halo-collar-5']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/gear/best-dog-gps-trackers/' }),
      ])
    );
    expect(pageMap['garmin-alpha-300i-handheld']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/gear/best-dog-gps-trackers/' }),
        expect.objectContaining({ href: '/gear/garmin-dog-tracking-collars/' }),
      ])
    );
    expect(pageMap['fi-series-3-plus']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/gear/best-dog-gps-trackers/' }),
        expect.objectContaining({ href: '/gear/fi-dog-collar-review/' }),
      ])
    );
    expect(pageMap['stunt-puppy-fi-collar']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/gear/fi-dog-collar-review/' }),
      ])
    );
    expect(pageMap['fido-pro-airlift-rescue-sling']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/gear/dog-snake-bite-emergency-kit/' }),
      ])
    );
    expect(pageMap['vectra-3d-xl-95-plus']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/safety/best-flea-and-tick-products-for-dogs/' }),
      ])
    );
    expect(pageMap['wondercide-spray-lemongrass-32oz']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/safety/best-flea-and-tick-products-for-dogs/' }),
      ])
    );
    expect(pageMap['rinseroo-original']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/safety/dog-bath-tools/' }),
      ])
    );
  });

  it('gives every cooling category full page meta with FAQs', () => {
    // Every category a product uses, not a hand-kept list of five.
    const categories = [...new Set(coolingProducts.map((product) => product.category))];
    expect(categories.length).toBeGreaterThan(0);
    for (const category of categories) {
      const meta = categoryMeta[category];
      expect(meta, `${category} has no categoryMeta`).toBeDefined();
      expect(meta.title && meta.heroHeadline && meta.introCopy, category).toBeTruthy();
      expect(meta.faqs.length, category).toBeGreaterThan(0);
    }
  });

  it('gives every product non-blank bullets', () => {
    const blank = productCatalogItems.filter((product) => product.bullets.some((bullet) => !bullet.trim()));
    expect(blank.map((product) => product.id)).toEqual([]);
  });
});
