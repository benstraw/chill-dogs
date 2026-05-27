import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { productCatalogItems } from '../data/product-catalog';
import { ROUTES } from '../data/routes';
import { GET as getSearchIndex } from '../pages/search-index.json';

describe('search index — product data shape', () => {
  it('every product has the fields the search index requires', () => {
    for (const p of productCatalogItems) {
      expect(typeof p.name, `${p.id} missing name`).toBe('string');
      expect(p.name.length, `${p.id} empty name`).toBeGreaterThan(0);
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

  it('routes product search entries internally to the shop converter', async () => {
    const response = await getSearchIndex({} as never);
    const items = await response.json();
    const productItems = items.filter((item: { type: string }) => item.type === 'product');

    expect(productItems.length).toBe(productCatalogItems.length);

    for (const item of productItems) {
      const catalogItem = productCatalogItems.find((product) => product.id === item.id);
      expect(catalogItem, `${item.id} missing from product catalog`).toBeTruthy();
      expect(item.href).toBe(`${ROUTES.shop}?q=${encodeURIComponent(item.name)}`);
      expect(item.href.startsWith(ROUTES.shop)).toBe(true);
      expect(item.href).not.toContain('amazon.');
      expect(item).not.toHaveProperty('amazonUrl');
    }
  });

  it('keeps search-specific UI on article terminology and docs on collector terminology', () => {
    const projectRoot = path.resolve(__dirname, '../..');
    const searchPage = readFileSync(path.join(projectRoot, 'src/pages/search.astro'), 'utf8');
    const searchDoc = readFileSync(path.join(projectRoot, 'docs/ai/engineering/search.md'), 'utf8');

    expect(searchPage).toContain('Articles');
    expect(searchPage).not.toContain('Hubs');
    expect(searchDoc).toContain('Collectors');
    expect(searchDoc).not.toContain('Hubs');
  });

  it('documents and renders collector search UI states', () => {
    const projectRoot = path.resolve(__dirname, '../..');
    const searchPage = readFileSync(path.join(projectRoot, 'src/pages/search.astro'), 'utf8');
    const searchDoc = readFileSync(path.join(projectRoot, 'docs/ai/engineering/search.md'), 'utf8');

    expect(searchPage).toContain('Loading search...');
    expect(searchPage).toContain('View in shop');
    expect(searchPage).toContain('Compare picks');
    expect(searchDoc).toContain('Suggested paths');
    expect(searchDoc).toContain('State handling');
  });
});
