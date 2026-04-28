import { describe, expect, it } from 'vitest';

import { calmingProducts } from '../data/calming-products';
import { coolingProducts } from '../data/cooling-products';
import { productCatalogItems } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { relaxationProducts } from '../data/relaxation-products';
import { accessoryProducts, trackerProducts } from '../data/tracking-products';

describe('admin product catalog data', () => {
  it('includes every product from every product data file', () => {
    const sourceProducts = [
      ...coolingProducts,
      ...calmingProducts,
      ...relaxationProducts,
      ...trackerProducts,
      ...accessoryProducts,
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
      expect(product.pillar).toMatch(/^(cooling|calming|comfort|gear)$/);
      expect(product.category).toBeTruthy();
      expect(product.amazonUrl).toContain('tag=chill-dogs-20');
      expect(product.bullets.length).toBeGreaterThan(0);
      expect(product.bestFor).toBeTruthy();
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
  });

  it('tracks the featured travel bed on both the road trip article and travel-bed converter', () => {
    const pageMap = buildProductPageMap();

    expect(pageMap['onetigris-travel-dog-bed']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: '/travel/dog-road-trip-gear/' }),
        expect.objectContaining({ href: '/comforting/best-dog-travel-beds/' }),
      ])
    );
  });
});
