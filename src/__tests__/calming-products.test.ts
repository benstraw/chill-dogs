import { describe, expect, it } from 'vitest';

import { calmingProducts } from '../data/calming-products';

describe('calming product data integrity', () => {
  it('every product amazonUrl contains the affiliate tag', () => {
    for (const product of calmingProducts) {
      expect(product.amazonUrl).toContain('tag=chill-dogs-20');
    }
  });

  it('every product has populated display fields', () => {
    for (const product of calmingProducts) {
      expect(product.bullets).toHaveLength(3);
      expect(product.bestFor).toBeTruthy();
      expect(product.howItHelps).toBeTruthy();
      expect(product.considerIf).toBeTruthy();
    }
  });
});
