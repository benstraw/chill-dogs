/**
 * Product page meta must be in range for every product, not just today's catalog.
 *
 * `seo-meta.test.ts` scans `dist/` and enforces og:title 40–65 and og:description
 * 100–165. With 214 generated `/shop/` pages, one awkward product name would fail that
 * test with no indication of which product or why. These checks run the same limits
 * against the composer directly, so the failure names the product and shows the string.
 */

import { describe, expect, it } from 'vitest';

import { productCatalogItems } from '../data/product-catalog';
import { PRODUCT_PAGES_INDEXABLE } from '../utils/product-meta';
import {
  PRODUCT_META_LIMITS as LIMITS,
  categoryLabel,
  htmlAttrLength,
  isIndexableProduct,
  meetsProductCopyBar,
  productOgDescription,
  productOgTitle,
  productOgTitleMap,
} from '../utils/product-meta';

const indexable = productCatalogItems.filter(meetsProductCopyBar);

describe('og:title for every indexable product', () => {
  it('has products to check', () => {
    expect(indexable.length).toBeGreaterThan(100);
  });

  it(`is ${LIMITS.OG_TITLE_MIN}–${LIMITS.OG_TITLE_MAX} escaped chars`, () => {
    const violations = indexable
      .map((product) => ({ product, title: productOgTitle(product) }))
      .filter(({ title }) => {
        const length = htmlAttrLength(title);
        return length < LIMITS.OG_TITLE_MIN || length > LIMITS.OG_TITLE_MAX;
      })
      .map(({ product, title }) => `${product.id} (${htmlAttrLength(title)}): ${title}`);

    expect(violations).toEqual([]);
  });

  it('always contains the product name, or a prefix of it', () => {
    // The title may clamp a long name, but it must never describe a different product.
    const violations = indexable
      .filter((product) => {
        const title = productOgTitle(product);
        const stem = product.name.slice(0, 12);
        return !title.startsWith(stem);
      })
      .map((product) => `${product.id}: ${productOgTitle(product)}`);

    expect(violations).toEqual([]);
  });

  it('is unique per product, so no two pages compete for the same result', () => {
    // Resolved as a set: two products genuinely share the name "Rubyloo Dog First Aid
    // Kit", and productOgTitleMap is what pulls them apart.
    const resolved = productOgTitleMap(indexable);
    const byTitle = new Map<string, string[]>();
    for (const product of indexable) {
      const title = resolved.get(product.id)!;
      byTitle.set(title, [...(byTitle.get(title) ?? []), product.id]);
    }

    const collisions = [...byTitle.entries()]
      .filter(([, ids]) => ids.length > 1)
      .map(([title, ids]) => `${title} <- ${ids.join(', ')}`);

    expect(collisions).toEqual([]);
  });
});

describe('og:description for every indexable product', () => {
  it(`is ${LIMITS.OG_DESC_MIN}–${LIMITS.OG_DESC_MAX} escaped chars`, () => {
    const violations = indexable
      .map((product) => ({ product, description: productOgDescription(product) }))
      .filter(({ description }) => {
        const length = htmlAttrLength(description);
        return length < LIMITS.OG_DESC_MIN || length > LIMITS.OG_DESC_MAX;
      })
      .map(
        ({ product, description }) =>
          `${product.id} (${htmlAttrLength(description)}): ${description}`
      );

    expect(violations).toEqual([]);
  });

  it('avoids the medical claim wording the content guardrails ban', () => {
    // docs/ai/writing/medical-and-vet-claim-guardrails.md — generated copy must not
    // reintroduce claims that hand-written copy is held away from.
    const banned = /vet[-\s]?(approved|recommended|endorsed)|clinically proven|\bcures?\b/i;
    const violations = productCatalogItems
      .map((product) => ({ id: product.id, description: productOgDescription(product) }))
      .filter(({ description }) => banned.test(description))
      .map(({ id, description }) => `${id}: ${description}`);

    expect(violations).toEqual([]);
  });
});

describe('indexing gate', () => {
  it('indexes the substantial majority and gates only genuinely thin products', () => {
    const gated = productCatalogItems.filter((product) => !meetsProductCopyBar(product));

    // A guard against the gate silently swallowing the catalog after a data refactor.
    expect(gated.length).toBeLessThan(productCatalogItems.length * 0.2);
    expect(indexable.length).toBeGreaterThan(productCatalogItems.length * 0.8);
  });

  it('gates exactly the products that fall under the copy bar', () => {
    for (const product of productCatalogItems) {
      const bullets = product.bullets.map((bullet) => bullet.trim()).filter(Boolean);
      const expected =
        bullets.length >= LIMITS.MIN_BULLETS &&
        bullets.join(' ').length >= LIMITS.MIN_BULLET_CHARS;

      expect(meetsProductCopyBar(product), product.id).toBe(expected);
    }
  });
});

describe('the indexing switch', () => {
  it('keeps every product page out of the index while it is off', () => {
    // ~200 generated pages on a site of ~65 is the shape that draws site-wide
    // quality demotion, so they ship noindex and are switched on deliberately.
    if (PRODUCT_PAGES_INDEXABLE) {
      expect(productCatalogItems.some(isIndexableProduct)).toBe(true);
      return;
    }

    expect(productCatalogItems.every((product) => !isIndexableProduct(product))).toBe(true);
    // The copy bar still has real opinions, ready for when it is turned on.
    expect(productCatalogItems.some(meetsProductCopyBar)).toBe(true);
  });
});

describe('helpers', () => {
  it('counts escaped length, not source length', () => {
    expect(htmlAttrLength('K&H Cool Bed III')).toBe(20);
    expect(htmlAttrLength("Internet's Best")).toBe(19);
    expect(htmlAttrLength('plain text')).toBe(10);
  });

  it('gives every catalog category a readable label', () => {
    const categories = [...new Set(productCatalogItems.map((product) => product.category))];
    // Lowercase joining words ("Warmth and Control") are correct title case, so only
    // flag a leading lowercase word — the signature of a raw, unmapped slug.
    const unreadable = categories.filter((category) => /^[a-z]/.test(categoryLabel(category)));

    expect(unreadable, 'add these to CATEGORY_LABELS').toEqual([]);
  });
});
