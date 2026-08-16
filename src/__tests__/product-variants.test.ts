import { describe, expect, it } from 'vitest';

import { fleaTickProducts } from '../data/flea-tick-products';
import { productCatalogItems } from '../data/product-catalog';
import {
  getAllAmazonOfferEntries,
  getAmazonOfferEntries,
  getDefaultVariant,
  getOffers,
  getVariantOffers,
  getVariants,
} from '../data/products/offers';
import type { ProductVariantGroup } from '../data/products/types';

const variantProducts = productCatalogItems.filter((product) => product.variantGroup);

describe('product variant groups', () => {
  it('ships at least one product with variants', () => {
    expect(variantProducts.length).toBeGreaterThan(0);
  });

  it('gives every variant a unique id and a non-empty label', () => {
    for (const product of variantProducts) {
      const variants = product.variantGroup!.variants;
      const ids = variants.map((variant) => variant.id);

      expect(new Set(ids).size, `${product.id} has duplicate variant ids`).toBe(ids.length);
      for (const variant of variants) {
        expect(variant.label.trim(), `${product.id}/${variant.id} label`).not.toBe('');
      }
    }
  });

  it('resolves every defaultVariantId to a real variant', () => {
    for (const product of variantProducts) {
      const group = product.variantGroup!;
      const match = group.variants.find((variant) => variant.id === group.defaultVariantId);

      expect(match, `${product.id} defaultVariantId ${group.defaultVariantId} does not resolve`).toBeDefined();
      expect(getDefaultVariant(product)?.id).toBe(group.defaultVariantId);
    }
  });

  it('gives every selectable variant at least one active offer', () => {
    for (const product of variantProducts) {
      for (const variant of getVariants(product)) {
        expect(getVariantOffers(variant).length, `${product.id}/${variant.id} has no offer`).toBeGreaterThan(0);
      }
    }
  });

  it('keeps the affiliate tag and merchant URL shape on every variant offer', () => {
    for (const product of variantProducts) {
      for (const variant of getVariants(product)) {
        for (const offer of getVariantOffers(variant)) {
          expect(() => new URL(offer.url)).not.toThrow();

          if (offer.merchant === 'amazon') {
            expect(offer.url, `${product.id}/${variant.id} missing Amazon tag`).toContain('tag=chill-dogs-20');
            expect(offer.asin, `${product.id}/${variant.id} ASIN shape`).toMatch(/^[A-Z0-9]{10}$/);
          } else {
            const { hostname } = new URL(offer.url);
            expect(hostname.endsWith('chewy.com') || hostname.endsWith('chewy.sjv.io')).toBe(true);
          }
        }
      }
    }
  });

  it('makes the default variant agree with the product-level offers', () => {
    for (const product of variantProducts) {
      const defaultOffers = getVariantOffers(getDefaultVariant(product)!);
      const productOffers = getOffers(product);

      expect(productOffers.map((offer) => offer.url), `${product.id} default variant drift`).toEqual(
        defaultOffers.map((offer) => offer.url),
      );
    }
  });
});

describe('variants stay out of the product-level offer array', () => {
  /**
   * Every product card renders `getOffers(product)` straight into a button
   * stack. If variant offers ever leaked into it, each card would grow a button
   * per variant.
   */
  it('does not grow the offer list when a product gains a variant group', () => {
    const base = {
      id: 'variant-test-product',
      name: 'Variant Test Product',
      asin: 'B000TEST01',
      amazonUrl: 'https://www.amazon.com/dp/B000TEST01/?tag=chill-dogs-20',
    };

    const variantGroup: ProductVariantGroup = {
      axis: { id: 'dog-size', label: 'Size' },
      defaultVariantId: 'small',
      variants: [
        {
          id: 'small',
          label: 'Small',
          offers: [
            {
              merchant: 'amazon',
              asin: 'B000TEST01',
              merchantProductId: 'B000TEST01',
              url: 'https://www.amazon.com/dp/B000TEST01/?tag=chill-dogs-20',
              status: 'active',
            },
          ],
        },
        {
          id: 'large',
          label: 'Large',
          offers: [
            {
              merchant: 'amazon',
              asin: 'B000TEST02',
              url: 'https://www.amazon.com/dp/B000TEST02/?tag=chill-dogs-20',
              status: 'active',
            },
          ],
        },
      ],
    };

    expect(getOffers({ ...base, variantGroup })).toEqual(getOffers(base));
    expect(getOffers({ ...base, variantGroup })).toHaveLength(1);
  });

  it('falls back to the default variant when a product declares no offers', () => {
    const offers = getOffers({
      id: 'offerless',
      name: 'Offerless',
      variantGroup: {
        axis: { id: 'pack-count', label: 'Pack' },
        defaultVariantId: 'two',
        variants: [
          {
            id: 'two',
            label: '2-pack',
            offers: [
              {
                merchant: 'amazon',
                asin: 'B000TEST03',
                url: 'https://www.amazon.com/dp/B000TEST03/?tag=chill-dogs-20',
                status: 'active',
              },
            ],
          },
        ],
      },
    });

    expect(offers).toHaveLength(1);
    expect(offers[0].merchant).toBe('amazon');
  });

  it('drops unavailable variants from the selectable set', () => {
    const variants = getVariants({
      variantGroup: {
        axis: { id: 'color', label: 'Color' },
        defaultVariantId: 'blue',
        variants: [
          { id: 'blue', label: 'Blue', offers: [] },
          { id: 'red', label: 'Red', offers: [], status: 'unavailable' },
        ],
      },
    });

    expect(variants.map((variant) => variant.id)).toEqual(['blue']);
  });
});

describe('ASIN enumeration for the merchant-data scripts', () => {
  it('returns every primary ASIN plus every variant ASIN', () => {
    const primary = getAmazonOfferEntries(productCatalogItems).map((entry) => entry.asin);
    const all = getAllAmazonOfferEntries(productCatalogItems).map((entry) => entry.asin);

    for (const asin of primary) {
      expect(all, `${asin} dropped from the full ASIN set`).toContain(asin);
    }
    expect(all.length).toBeGreaterThan(primary.length);
  });

  it('deduplicates and stays sorted', () => {
    const all = getAllAmazonOfferEntries(productCatalogItems).map((entry) => entry.asin);

    expect(new Set(all).size).toBe(all.length);
    expect(all).toEqual([...all].sort((a, b) => a.localeCompare(b)));
  });

  it('labels a variant entry with the variant it belongs to', () => {
    const entry = getAllAmazonOfferEntries(productCatalogItems).find(
      (candidate) => candidate.asin === 'B0BY9C72VY',
    );

    expect(entry?.name).toBe('Tuff Pupper Fast-Drying Dog Bathrobe — XX-Large');
    expect(entry?.productId).toBe('tuff-pupper-drying-bathrobe');
  });
});

describe('Tuff Pupper bathrobe reference variant group', () => {
  const product = fleaTickProducts.find((entry) => entry.id === 'tuff-pupper-drying-bathrobe');

  it('carries all eight sizes Amazon lists', () => {
    expect(product?.variantGroup?.axis.id).toBe('dog-size');
    expect(product?.variantGroup?.variants.map((variant) => variant.label)).toEqual([
      'X-Small',
      'Small',
      'Medium',
      'Large',
      'X-Large',
      'XX-Large',
      'XXX-Large',
      'Giant',
    ]);
  });

  it('keeps Large as the default so the legacy ASIN fields still describe the card', () => {
    expect(product?.variantGroup?.defaultVariantId).toBe('large');
    expect(product?.asin).toBe('B0BY9GBMXX');
    expect(getDefaultVariant(product!)?.offers[0]?.merchant === 'amazon' && getDefaultVariant(product!)!.offers[0]).toMatchObject(
      { asin: 'B0BY9GBMXX' },
    );
  });

  it('exposes every size ASIN to the merchant-data scripts', () => {
    const all = new Set(getAllAmazonOfferEntries(productCatalogItems).map((entry) => entry.asin));

    for (const asin of [
      'B0BY9C5HFB',
      'B0BY9CT5FF',
      'B0BY9CZMBJ',
      'B0BY9GBMXX',
      'B0BY9F964J',
      'B0BY9C72VY',
      'B0BY9HHQ48',
      'B0CK4LFD8S',
    ]) {
      expect(all, `${asin} is not reachable by check:asins`).toContain(asin);
    }
  });
});
