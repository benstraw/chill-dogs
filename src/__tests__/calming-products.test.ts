import { describe, expect, it } from 'vitest';

import { calmingProducts } from '../data/calming-products';

describe('calming product data integrity', () => {
  it('every product amazonUrl contains the affiliate tag', () => {
    for (const product of calmingProducts) {
      if (product.amazonUrl) {
        expect(product.amazonUrl).toContain('tag=chill-dogs-20');
      }
    }
  });

  it('every product has populated bullet copy', () => {
    for (const product of calmingProducts) {
      expect(product.bullets.length).toBeGreaterThan(0);
      for (const bullet of product.bullets) {
        expect(bullet).toBeTruthy();
      }
    }
  });

  it('does not duplicate ASINs across calming product records', () => {
    const asins = calmingProducts
      .map((product) => product.asin)
      .filter((asin): asin is string => Boolean(asin));

    expect(new Set(asins).size).toBe(asins.length);
  });
});
