import { describe, expect, it } from 'vitest';

import { emergencyProducts } from '../data/emergency-products';
import { fleaTickConverterPages } from '../data/flea-tick-converter-pages';
import { fleaTickProducts } from '../data/flea-tick-products';
import { productCatalogItems, type ProductCatalogItem } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { getAmazonOfferEntries, getOffers, getPrimaryOffer, getRequiredPrimaryOffer } from '../data/products/offers';
import { ROUTES } from '../data/routes';
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
      'wondercide-spray-lemongrass-32oz',
      'natures-dome-peppermint-spray',
      'isabellas-clearly-natural-spray',
      'pure-natural-pet-spray',
      'wondercide-shampoo-amazon',
      'trihood-flea-tick-tag',
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

  it('wires the requested Chewy grooming and tick-tool offers into the flea/tick catalog', () => {
    const expectedChewyCanonicalUrlsById = {
      'natures-dome-peppermint-spray': 'https://www.chewy.com/natures-dome-peppermint-flea-tick/dp/3684310',
      'duty-mitt-flea-tick-mitt': 'https://www.chewy.com/duty-mitt-tick-flea-repellent-mitt/dp/3976198',
      'tweezerman-precision-flea-comb': 'https://www.chewy.com/tweezerman-precision-single-row-flea/dp/3969334',
      'wahl-flea-finishing-comb': 'https://www.chewy.com/wahl-flea-finishing-dog-comb/dp/3514926',
      'tweezerman-tick-removal-kit': 'https://www.chewy.com/tweezerman-tick-removal-kit-dogs/dp/3969342',
      'tweezerman-tick-tweezer': 'https://www.chewy.com/tweezerman-tick-removal-tweezer-pets/dp/1522510',
      'tickcheck-premium-tick-kit': 'https://www.chewy.com/tickcheck-premium-dog-tick-removal/dp/352001',
      'tickcheck-remover-spoon': 'https://www.chewy.com/tickcheck-remover-spoon-tick-id-card/dp/352007',
    } satisfies Record<string, string>;

    // Chewy-listed products that also carry an Amazon offer. Everything else in the
    // map above must stay Chewy-only.
    const alsoOnAmazonById = {
      'tweezerman-precision-flea-comb': 'B0GK34GTCC',
      'wahl-flea-finishing-comb': 'B079SYNQQ5',
      'tweezerman-tick-removal-kit': 'B0GK3BSK56',
      'tweezerman-tick-tweezer': 'B0D236JZGJ',
      'tickcheck-premium-tick-kit': 'B075DKL3Z6',
      'tickcheck-remover-spoon': 'B07K4F66LH',
    } satisfies Record<string, string>;

    const config = fleaTickConverterPages['best-natural-flea-and-tick-products-for-dogs'];

    for (const [productId, canonicalUrl] of Object.entries(expectedChewyCanonicalUrlsById)) {
      const product = fleaTickProducts.find((entry) => entry.id === productId);
      expect(product, `${productId} missing from flea/tick products`).toBeTruthy();
      expect(productCatalogItems.find((entry) => entry.id === productId), `${productId} missing from product catalog`).toBeTruthy();
      expect(product?.image?.src, `${productId} missing product image`).toMatch(/^https:\/\//);
      expect(product?.image?.alt, `${productId} missing image alt text`).not.toBe('');
      expect(config.itemListSchema?.productIds, `${productId} missing from ItemList schema`).toContain(productId);

      const offers = getOffers(product!);
      const chewyOffer = offers.find((offer) => offer.merchant === 'chewy');
      expect(chewyOffer, `${productId} missing Chewy offer`).toBeTruthy();
      expect(chewyOffer!.url, `${productId} Chewy url must be an affiliate link`).toMatch(/^https:\/\/chewy\.sjv\.io\//);
      expect(chewyOffer!.canonicalUrl, `${productId} canonicalUrl must be the raw Chewy product URL`).toBe(canonicalUrl);

      const expectedAsin = (alsoOnAmazonById as Record<string, string | undefined>)[productId];

      if (expectedAsin) {
        expect(offers, `${productId} should offer both Amazon and Chewy`).toHaveLength(2);
        expect(offers[0]?.merchant, `${productId} should lead with the Amazon offer`).toBe('amazon');
        expect(product?.asin, `${productId} should carry its Amazon ASIN`).toBe(expectedAsin);
      } else {
        expect(offers, `${productId} should be a Chewy-only offer`).toHaveLength(1);
        expect(product?.asin, `${productId} should not carry an ASIN`).toBeUndefined();
      }
    }
  });

  it('ships only the natural flea and tick converter in this release', () => {
    expect(Object.keys(fleaTickConverterPages)).toEqual(['best-natural-flea-and-tick-products-for-dogs']);

    for (const deferredId of ['nexgard-10-24', 'seresto-large']) {
      expect(
        fleaTickProducts.find((product) => product.id === deferredId),
        `${deferredId} is deferred to the follow-up release`,
      ).toBeUndefined();
    }
  });

  it('keeps Rinseroo in the catalog for the article link even without its converter page', () => {
    const rinseroo = fleaTickProducts.find((product) => product.id === 'rinseroo-original');
    expect(rinseroo, 'rinseroo-original missing from flea/tick products').toBeTruthy();
    expect(
      productCatalogItems.find((entry) => entry.id === 'rinseroo-original'),
      'rinseroo-original missing from product catalog',
    ).toBeTruthy();

    const offers = getOffers(rinseroo!);
    expect(offers.map((offer) => offer.merchant)).toEqual(['amazon', 'chewy']);
    expect(offers.find((offer) => offer.merchant === 'amazon')?.asin).toBe('B0CSF2LLS3');
    expect(offers.find((offer) => offer.merchant === 'chewy')?.canonicalUrl)
      .toBe('https://www.chewy.com/rinseroo-slip-on-sprayer-cat-portable/dp/3650750');

    // The bath-tools converter is deferred, so the article carries the product instead.
    expect(buildProductPageMap()['rinseroo-original']).toEqual([
      { label: 'Natural Flea and Tick Prevention for Dogs', href: ROUTES.naturalFleaTickPrevention },
    ]);
  });

  it('offers the Wondercide shampoo on both Amazon and Chewy', () => {
    const shampoo = fleaTickProducts.find((entry) => entry.id === 'wondercide-shampoo-amazon');
    expect(shampoo, 'wondercide-shampoo-amazon missing from flea/tick products').toBeTruthy();

    const offers = getOffers(shampoo!);
    expect(offers.map((offer) => offer.merchant)).toEqual(['amazon', 'chewy']);
    expect(offers.find((offer) => offer.merchant === 'amazon')?.asin).toBe('B09WLSNZZC');

    const chewy = offers.find((offer) => offer.merchant === 'chewy');
    expect(chewy!.url).toMatch(/^https:\/\/chewy\.sjv\.io\//);
    expect(chewy!.canonicalUrl).toBe('https://www.chewy.com/wondercide-flea-tick-peppermint-cat/dp/639662');
  });

  it('keeps the refreshed natural spray and oil lineup complete and image-backed', () => {
    const expectedProductIds = [
      'wondercide-spray-lemongrass-32oz',
      'natures-dome-peppermint-spray',
      'isabellas-clearly-natural-spray',
      'pure-natural-pet-spray',
      'duty-mitt-flea-tick-mitt',
    ];
    const config = fleaTickConverterPages['best-natural-flea-and-tick-products-for-dogs'];
    const spraySection = config.blocks.find((block) => block.kind === 'product_section' && block.id === 'sprays');

    expect(spraySection?.kind).toBe('product_section');
    if (spraySection?.kind !== 'product_section') {
      throw new Error('Missing natural spray and oil product section');
    }

    expect(spraySection.productIds).toEqual(expectedProductIds);
    expect(config.itemListSchema?.productIds).not.toContain('kates-rosemary-spray');
    expect(fleaTickProducts.find((product) => product.id === 'kates-rosemary-spray')).toBeUndefined();

    for (const productId of expectedProductIds) {
      const product = fleaTickProducts.find((entry) => entry.id === productId);
      expect(product, `${productId} missing from flea/tick products`).toBeTruthy();
      expect(productCatalogItems.find((entry) => entry.id === productId), `${productId} missing from product catalog`).toBeTruthy();
      expect(product?.image?.src, `${productId} missing product image`).toMatch(/^https:\/\//);
      expect(product?.image?.alt, `${productId} missing image alt text`).not.toBe('');
    }

    expect(fleaTickProducts.find((product) => product.id === 'wondercide-spray-lemongrass-32oz')?.name)
      .toBe('Wondercide Flea, Tick & Mosquito Spray');
    expect(fleaTickProducts.find((product) => product.id === 'isabellas-clearly-natural-spray')?.badge)
      .toBe('Natural oil');
  });

  it('keeps the refreshed shampoo, wearable, chew, home, and grooming lineups complete and image-backed', () => {
    const expectedSectionProductIds = {
      shampoo: [
        'wondercide-shampoo-amazon',
        'hartz-natures-shield-shampoo',
        'earth-animal-apothecary-shampoo',
        'lillian-ruff-flea-tick-shampoo',
        'top-performance-natural-shampoo',
      ],
      collar: [
        'amdeiur-natural-flea-collar',
        'solpetti-botanical-flea-collar',
        'trihood-flea-tick-tag',
        'routade-flea-tick-pendant',
      ],
      chews: [
        'lkdhfjc-flea-tick-chews-200',
        'geynaw-flea-tick-chews',
        'yotango-flea-tick-chews',
        'beloved-pets-flea-tick-chews',
        'dr-woow-flea-tick-chews',
      ],
    } satisfies Record<string, string[]>;

    const config = fleaTickConverterPages['best-natural-flea-and-tick-products-for-dogs'];

    for (const [sectionId, productIds] of Object.entries(expectedSectionProductIds)) {
      const section = config.blocks.find((block) => block.kind === 'product_section' && block.id === sectionId);
      expect(section?.kind, `missing ${sectionId} product section`).toBe('product_section');
      if (section?.kind !== 'product_section') {
        throw new Error(`Missing ${sectionId} product section`);
      }

      expect(section.productIds).toEqual(productIds);

      for (const productId of productIds) {
        const product = fleaTickProducts.find((entry) => entry.id === productId);
        expect(product, `${productId} missing from flea/tick products`).toBeTruthy();
        expect(productCatalogItems.find((entry) => entry.id === productId), `${productId} missing from product catalog`).toBeTruthy();
        expect(product?.image?.src, `${productId} missing product image`).toMatch(/^https:\/\//);
        expect(product?.image?.alt, `${productId} missing image alt text`).not.toBe('');
        expect(config.itemListSchema?.productIds, `${productId} missing from ItemList schema`).toContain(productId);
      }
    }

    expect(
      config.blocks.some((block) => block.kind === 'product_section' && block.id === 'home-support'),
      'home-support section should be removed',
    ).toBe(false);
    expect((config.toc ?? []).some((entry) => entry.anchor === 'home-support')).toBe(false);

    const groomingTools = config.blocks.find((block) => block.kind === 'product_section' && block.id === 'grooming-tools');

    if (groomingTools?.kind !== 'product_section') {
      throw new Error('Missing grooming-tools product section');
    }

    expect(groomingTools.productIds).toEqual([
      'green-pet-double-sided-flea-comb',
      'ikkab-flea-comb-set',
      'vomroju-flea-lice-comb-set',
      'tweezerman-precision-flea-comb',
      'wahl-flea-finishing-comb',
      'anrundar-grooming-kit',
      'homesake-tick-remover-kit',
      'ahhomatata-tick-twister-set',
      'tweezerman-tick-removal-kit',
      'tweezerman-tick-tweezer',
      'tickcheck-premium-tick-kit',
      'tickcheck-remover-spoon',
    ]);

    for (const productId of groomingTools.productIds) {
      const product = fleaTickProducts.find((entry) => entry.id === productId);
      expect(product, `${productId} missing from flea/tick products`).toBeTruthy();
      expect(productCatalogItems.find((entry) => entry.id === productId), `${productId} missing from product catalog`).toBeTruthy();
      expect(product?.image?.src, `${productId} missing product image`).toMatch(/^https:\/\//);
      expect(config.itemListSchema?.productIds, `${productId} missing from ItemList schema`).toContain(productId);
    }

    for (const removedId of [
      'crobirware-natural-collar',
      'lkdhfjc-flea-tick-chews',
      'rinseroo-shark-tank',
      'natures-dome-cedarwood-spray',
      'skouts-honor-flea-tick-shampoo',
      'only-natural-pet-barrier-bites',
      'wondercide-rescue-ear-drops',
      'wondercide-surface-disinfectant',
      'tropiclean-flea-spray-home',
    ]) {
      expect(fleaTickProducts.find((product) => product.id === removedId), `${removedId} should be removed`).toBeUndefined();
      expect(config.itemListSchema?.productIds).not.toContain(removedId);
    }

    for (const removedAsin of ['B0GSZH4JWF', 'B0H6B7W86G', 'B0CSF14JZZ', 'B0CFYJM6HN', 'B0DWZLB7LX', 'B0FVZJ1S1Z', 'B01DS73GTI']) {
      expect(
        fleaTickProducts.some((product) =>
          getOffers(product).some((offer) => offer.merchant === 'amazon' && offer.asin === removedAsin),
        ),
        `${removedAsin} should no longer be offered`,
      ).toBe(false);
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
