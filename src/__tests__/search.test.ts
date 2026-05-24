import { describe, expect, it } from 'vitest';
import { productCatalogItems } from '../data/product-catalog';

describe('search index — product data shape', () => {
  it('every product has the fields the search index requires', () => {
    for (const p of productCatalogItems) {
      expect(typeof p.name, `${p.id} missing name`).toBe('string');
      expect(p.name.length, `${p.id} empty name`).toBeGreaterThan(0);
      expect(typeof p.amazonUrl, `${p.id} missing amazonUrl`).toBe('string');
      expect(p.amazonUrl.length, `${p.id} empty amazonUrl`).toBeGreaterThan(0);
      expect(typeof p.bestFor, `${p.id} missing bestFor`).toBe('string');
      expect(p.bestFor.length, `${p.id} empty bestFor`).toBeGreaterThan(0);
      expect(Array.isArray(p.bullets), `${p.id} bullets not array`).toBe(true);
      expect(p.bullets.length, `${p.id} empty bullets`).toBeGreaterThan(0);
    }
  });

  it('every product has a valid pillar', () => {
    const validPillars = new Set(['cooling', 'calming', 'comfort', 'gear']);
    for (const p of productCatalogItems) {
      expect(validPillars.has(p.pillar), `${p.id} invalid pillar: ${p.pillar}`).toBe(true);
    }
  });

  it('product count is non-zero', () => {
    expect(productCatalogItems.length).toBeGreaterThan(0);
  });
});
