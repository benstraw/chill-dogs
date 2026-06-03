import { describe, expect, it } from 'vitest';

import { productCatalogItems, type ProductCatalogItem } from '../data/product-catalog';
import { getAmazonOfferEntries, getOffers, getPrimaryOffer, getRequiredPrimaryOffer } from '../data/products/offers';
import type { AffiliateOffer, ProviderMetadata } from '../data/products/types';

describe('multi-merchant product offers', () => {
  it('gives every catalog product at least one offer', () => {
    for (const product of productCatalogItems) {
      expect(getOffers(product), `${product.id} has no offers`).not.toHaveLength(0);
    }
  });

  it('keeps the Amazon affiliate tag on every Amazon offer', () => {
    for (const product of productCatalogItems) {
      for (const offer of getOffers(product)) {
        if (offer.merchant === 'amazon') {
          expect(offer.url, `${product.id} missing Amazon tag`).toContain('tag=chill-dogs-20');
        }
      }
    }
  });

  it('keeps Chewy product IDs optional while requiring a Chewy URL shape when present', () => {
    for (const product of productCatalogItems) {
      for (const offer of getOffers(product)) {
        if (offer.merchant === 'chewy') {
          expect(() => new URL(offer.url)).not.toThrow();
          const { hostname } = new URL(offer.url);
          expect(hostname.endsWith('chewy.com') || hostname.endsWith('chewy.sjv.io')).toBe(true);
        }
      }
    }
  });

  it('prefers Amazon when a product has Amazon and Chewy offers', () => {
    const offers: AffiliateOffer[] = [
      { merchant: 'chewy', url: 'https://www.chewy.com/example/dp/123', status: 'active' },
      {
        merchant: 'amazon',
        asin: 'B000TEST',
        merchantProductId: 'B000TEST',
        url: 'https://www.amazon.com/dp/B000TEST/?tag=chill-dogs-20',
        status: 'active',
      },
    ];

    const product = {
      id: 'dual-offer-product',
      name: 'Dual Offer Product',
      bestFor: 'Testing offer order',
      bullets: ['One'],
      offers,
    };

    expect(getPrimaryOffer(product)?.merchant).toBe('amazon');
  });

  it('supports Chewy-only products without ASINs or Amazon URLs', () => {
    const product = {
      id: 'chewy-only-product',
      name: 'Chewy Only Product',
      bestFor: 'Testing Chewy-only offers',
      bullets: ['One', 'Two', 'Three'],
      offers: [
        {
          merchant: 'chewy' as const,
          url: 'https://www.chewy.com/example/dp/123',
          canonicalUrl: 'https://www.chewy.com/example/dp/123',
          status: 'active' as const,
        },
      ],
    };

    expect(getOffers(product)).toHaveLength(1);
    expect(getPrimaryOffer(product)?.merchant).toBe('chewy');
    expect(getRequiredPrimaryOffer(product).url).toBe('https://www.chewy.com/example/dp/123');
    expect(getAmazonOfferEntries([product])).toEqual([]);
  });

  it('returns the same Amazon ASIN set as the legacy catalog fields', () => {
    const legacyAsins = [
      ...new Set(productCatalogItems.map((product) => product.asin).filter((asin): asin is string => Boolean(asin))),
    ].sort((a, b) => a.localeCompare(b));
    const offerAsins = getAmazonOfferEntries(productCatalogItems).map((entry) => entry.asin);

    expect(offerAsins).toEqual(legacyAsins);
  });

  it('tracks which products have Chewy offers', () => {
    const withChewy = productCatalogItems.filter(
      (product) => getOffers(product).some((offer) => offer.merchant === 'chewy'),
    );

    expect(withChewy.length).toBeGreaterThanOrEqual(1);
    for (const product of withChewy) {
      const chewyOffer = getOffers(product).find((o) => o.merchant === 'chewy');
      expect(() => new URL(chewyOffer!.url)).not.toThrow();
    }
  });

  it('keeps rendered/search/admin editorial fields canonical instead of provider metadata sourced', () => {
    const providerMetadata: ProviderMetadata = {
      fetchedAt: '2026-05-28T00:00:00.000Z',
      provider: 'fixture',
      title: 'Provider Title Should Not Render',
      imageUrl: 'https://example.com/provider-image.jpg',
    };
    const product: ProductCatalogItem = {
      id: 'editorial-guardrail',
      name: 'Canonical Editorial Name',
      pillar: 'cooling',
      category: 'cooling-mats',
      asin: 'B000EDIT',
      amazonUrl: 'https://www.amazon.com/dp/B000EDIT/?tag=chill-dogs-20',
      offers: [
        {
          merchant: 'amazon',
          asin: 'B000EDIT',
          merchantProductId: 'B000EDIT',
          url: 'https://www.amazon.com/dp/B000EDIT/?tag=chill-dogs-20',
        },
      ],
      bullets: ['Canonical bullet'],
      bestFor: 'Canonical best-for copy',
      image: { src: 'https://example.com/canonical.jpg', alt: 'Canonical alt' },
      source: 'src/data/products-offers.test.ts',
    };

    const searchLikeItem = {
      name: product.name,
      bestFor: product.bestFor,
      bullets: product.bullets.join(' '),
      image: product.image,
    };
    const adminLikeItem = {
      name: product.name,
      bestFor: product.bestFor,
      image: product.image,
    };

    expect(searchLikeItem.name).toBe('Canonical Editorial Name');
    expect(searchLikeItem.bullets).toBe('Canonical bullet');
    expect(searchLikeItem.image?.src).toBe('https://example.com/canonical.jpg');
    expect(adminLikeItem.name).not.toBe(providerMetadata.title);
    expect(adminLikeItem.image?.src).not.toBe(providerMetadata.imageUrl);
  });
});
