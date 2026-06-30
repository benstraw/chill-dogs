import { describe, expect, it } from 'vitest';

import { emergencyProducts } from '../data/emergency-products';
import { fleaTickProducts } from '../data/flea-tick-products';
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
      bullets: ['One'],
      offers,
    };

    expect(getPrimaryOffer(product)?.merchant).toBe('amazon');
  });

  it('supports Chewy-only products without ASINs or Amazon URLs', () => {
    const product = {
      id: 'chewy-only-product',
      name: 'Chewy Only Product',
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

  it('wires the requested snake-bite kit Chewy offers into the emergency catalog with affiliate URLs', () => {
    const expectedChewyCanonicalUrlsById = {
      'canine-canyon-rover-rescue-carry-harness': 'https://www.chewy.com/canine-canyon-rover-rescue-dog-carry/dp/2103910',
      'ruffwear-backtrak-evacuation-kit': 'https://www.chewy.com/ruffwear-backtrak-evacuation-kit-dog/dp/3588422',
      'non-stop-dogwear-dog-rescue-sling': 'https://www.chewy.com/non-stop-dogwear-dog-rescue-sling/dp/3598582',
      'adventure-dog-medical-kit-vet-in-a-box': 'https://www.chewy.com/adventure-medical-kits-adventure-dog/dp/250995',
      'adventure-medical-me-and-my-dog-kit': 'https://www.chewy.com/adventure-medical-kits-dog-series-me/dp/250997',
      'adventure-medical-trail-dog-kit': 'https://www.chewy.com/adventure-medical-kits-dog-series/dp/250999',
      'kurgo-50-piece-dog-first-aid-kit': 'https://www.chewy.com/kurgo-first-aid-kit-dogs-cats/dp/56782',
      'kurgo-rsg-first-aid-kit': 'https://www.chewy.com/kurgo-rsg-first-aid-kit-dogs/dp/207876',
      'mendota-products-large-slip-lead': 'https://www.chewy.com/mendota-products-large-slip-confetti/dp/144722',
      'water-woods-braided-rope-slip-dog-lead': 'https://www.chewy.com/water-woods-braided-rope-slip-dog/dp/650214',
    } satisfies Record<string, string>;

    for (const [productId, canonicalUrl] of Object.entries(expectedChewyCanonicalUrlsById)) {
      const product = emergencyProducts.find((entry) => entry.id === productId);
      expect(product, `${productId} missing from emergency products`).toBeTruthy();
      const chewyOffer = product && getOffers(product).find((offer) => offer.merchant === 'chewy');
      expect(chewyOffer, `${productId} missing Chewy offer`).toBeTruthy();
      expect(() => new URL(chewyOffer!.url), `${productId} Chewy url is not a valid URL`).not.toThrow();
      expect(chewyOffer!.url, `${productId} Chewy url must be an affiliate link, not a raw chewy.com URL`).toMatch(/^https:\/\/chewy\.sjv\.io\//);
      expect(chewyOffer!.canonicalUrl, `${productId} canonicalUrl must be the raw Chewy product URL`).toBe(canonicalUrl);
    }
  });

  it('wires flea-and-tick offers into the safety catalog with valid affiliate URLs', () => {
    const expectedOfferIds = [
      'nexgard-10-24',
      'bravecto-44-88',
      'frontline-plus-45-88',
      'seresto-large',
      'wondercide-spray-lemongrass',
      'wondercide-spot-on-medium',
      'wondercide-shampoo-peppermint',
      'rinseroo-original',
    ];

    for (const productId of expectedOfferIds) {
      const product = fleaTickProducts.find((entry) => entry.id === productId);
      expect(product, `${productId} missing from flea/tick products`).toBeTruthy();
      expect(getOffers(product!), `${productId} has no offers`).not.toHaveLength(0);

      for (const offer of getOffers(product!)) {
        expect(() => new URL(offer.url), `${productId} has invalid offer url`).not.toThrow();
        if (offer.merchant === 'amazon') {
          expect(offer.url).toContain('tag=chill-dogs-20');
        }
        if (offer.merchant === 'chewy') {
          expect(offer.url).toMatch(/^https:\/\/chewy\.sjv\.io\//);
          expect(offer.canonicalUrl).toContain('https://www.chewy.com/');
        }
      }
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
      image: { src: 'https://example.com/canonical.jpg', alt: 'Canonical alt' },
      source: 'src/data/products-offers.test.ts',
    };

    const searchLikeItem = {
      name: product.name,
      bullets: product.bullets,
      image: product.image,
    };
    const adminLikeItem = {
      name: product.name,
      bullets: product.bullets,
      image: product.image,
    };

    expect(searchLikeItem.name).toBe('Canonical Editorial Name');
    expect(searchLikeItem.bullets).toEqual(['Canonical bullet']);
    expect(searchLikeItem.image?.src).toBe('https://example.com/canonical.jpg');
    expect(adminLikeItem.name).not.toBe(providerMetadata.title);
    expect(adminLikeItem.bullets).toEqual(['Canonical bullet']);
    expect(adminLikeItem.image?.src).not.toBe(providerMetadata.imageUrl);
  });
});
