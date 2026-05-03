import { describe, expect, it } from 'vitest';

import {
  coolingProducts,
  categoryMeta,
  type ProductCategory,
} from '../data/cooling-products';

describe('cooling product data integrity', () => {
  it('every product amazonUrl contains the affiliate tag', () => {
    for (const product of coolingProducts) {
      expect(product.amazonUrl).toContain('tag=chill-dogs-20');
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
