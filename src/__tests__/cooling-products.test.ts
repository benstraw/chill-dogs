import { describe, expect, it } from 'vitest';

import {
  coolingProducts,
  categoryMeta,
  type ProductCategory,
} from '../data/cooling-products';

describe('cooling product data integrity', () => {
  it('every product amazonUrl contains the affiliate tag', () => {
    const withAmazon = coolingProducts.filter((product) => product.amazonUrl);
    expect(withAmazon.length, 'no Amazon URLs to check').toBeGreaterThan(0);
    for (const product of withAmazon) {
      expect(product.amazonUrl, product.id).toContain('tag=chill-dogs-20');
    }
  });

  it('every category has complete meta with FAQs', () => {
    const categories: ProductCategory[] = [
      'cooling-mats',
      'cooling-bandanas',
      'cooling-vests',
      'freezable-dog-toys',
      'car-cooling',
    ];

    for (const cat of categories) {
      const meta = categoryMeta[cat];
      expect(meta.title).toBeTruthy();
      expect(meta.heroHeadline).toBeTruthy();
      expect(meta.introCopy).toBeTruthy();
      expect(meta.faqs.length).toBeGreaterThan(0);
    }
  });
});
