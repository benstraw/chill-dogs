import { describe, expect, it } from 'vitest';

import { calmingProducts } from '../data/calming-products';
import { coolingProducts } from '../data/cooling-products';
import { emergencyProducts } from '../data/emergency-products';
import { fleaTickProducts } from '../data/flea-tick-products';
import { productCatalogItems } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { relaxationProducts } from '../data/relaxation-products';
import { accessoryProducts, trackerProducts } from '../data/tracking-products';

describe('admin product catalog data', () => {
  it('keeps snake-bite kit product ASINs unique and current', () => {
    const emergencyAsins = emergencyProducts.map((product) => product.asin).filter(Boolean);
    const addedAsins = [
      'B0GFMQT8YJ',
      'B0GH76XGKZ',
      'B0GRV66Y6X',
      'B0GJD28NRT',
      'B07GVSG62X',
      'B0F6YL3LT1',
      'B0FD8KWS9L',
      'B07WRPCLYR',
      'B097PLDD92',
      'B09FKVQQVH',
      'B08ZFVZPHM',
      'B0B1W6VLKW',
      'B0B1W5R11Y',
      'B0F2CBR1T1',
      'B0CLV3YJDX',
      'B0C3CDQGJQ',
      'B0CRWLL6C1',
      'B0FY6TVDHQ',
      'B0GHHDV7Y9',
      'B0GXF114LP',
      'B0GTR1575S',
      'B0F1ZFMVXG',
      'B0DCQDXSS5',
      'B077Z3LNX9',
      'B00TI8GSE2',
      'B0BWSQWXPC',
      'B0G4W14R1Y',
    ];

    expect(new Set(emergencyAsins).size).toBe(emergencyAsins.length);
    expect(emergencyAsins).toEqual(expect.arrayContaining(addedAsins));
    expect(emergencyAsins).not.toEqual(expect.arrayContaining(['B00074W3RW', 'B08TW84CR1', 'B08D66HCXW']));
    expect(emergencyProducts.filter((product) => product.category === 'stretcher')).toHaveLength(4);
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
    const catalogIds = productCatalogItems.map((product) => product.id);

    expect(productCatalogItems).toHaveLength(sourceProducts.length);

    for (const product of sourceProducts) {
      expect(catalogIds).toContain(product.id);
    }
  });

  it('normalizes all products for admin display', () => {
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
        expect.objectContaining({ href: '/safety/dog-bath-tools-for-flea-season/' }),
      ])
    );
  });
});
