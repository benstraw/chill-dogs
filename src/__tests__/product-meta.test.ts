/**
 * Product page meta must be in range for every product, not just today's catalog.
 *
 * `dist/site-sweep.test.ts` scans `dist/` and enforces og:title 40–65 and og:description
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
    // docs/writing/medical-and-vet-claim-guardrails.md — generated copy must not
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

  it('applies the copy bar to concrete boundary cases', () => {
    // Fixed fixtures at the thresholds, not a re-implementation of the rule: a wrong
    // threshold or a dropped trim() changes these answers.
    const { MIN_BULLETS, MIN_BULLET_CHARS } = LIMITS;
    const product = (bullets: string[]) => ({ id: 'fixture', name: 'Fixture', pillar: 'cooling', category: 'mat', bullets });
    const enough = (n: number) => Array.from({ length: n }, () => 'x'.repeat(Math.ceil(MIN_BULLET_CHARS / n) + 1));

    expect(meetsProductCopyBar(product(enough(MIN_BULLETS)))).toBe(true);
    expect(meetsProductCopyBar(product(enough(MIN_BULLETS).slice(1))), 'one bullet short').toBe(false);
    expect(meetsProductCopyBar(product([...enough(MIN_BULLETS).slice(1), '   '])), 'blank bullets do not count').toBe(false);

    // Exactly at the character floor passes; one character under fails.
    const atFloor = Array.from({ length: MIN_BULLETS }, () => 'y');
    const joinedLength = (bullets: string[]) => bullets.join(' ').length;
    atFloor[0] += 'y'.repeat(MIN_BULLET_CHARS - joinedLength(atFloor));
    expect(joinedLength(atFloor)).toBe(MIN_BULLET_CHARS);
    expect(meetsProductCopyBar(product(atFloor))).toBe(true);
    expect(meetsProductCopyBar(product([atFloor[0].slice(1), ...atFloor.slice(1)]))).toBe(false);
  });
});

describe('the indexing switch', () => {
  it('never indexes a product below the copy bar, and indexes exactly the rest when on', () => {
    // Holds whichever way the switch is set, without branching on it.
    for (const product of productCatalogItems) {
      expect(isIndexableProduct(product), product.id).toBe(PRODUCT_PAGES_INDEXABLE && meetsProductCopyBar(product));
    }
    // The copy bar still has real opinions, ready for when the switch is turned on.
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
