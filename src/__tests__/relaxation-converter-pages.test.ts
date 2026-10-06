import { describe, expect, it } from 'vitest';

import {
  buildRelaxationItemListSchema,
  getRelaxationConverterPageConfig,
  resolveRelaxationDisplayProducts,
} from '../data/relaxation-converter-pages';
import { chewyOrthopedicBedIds } from '../data/chewy-orthopedic-beds';
import { getAllAmazonOfferEntries, getOffers, getVariants } from '../data/products/offers';
import { getRelaxationProductsByCategory, relaxationProducts } from '../data/relaxation-products';

describe('relaxation converter page config', () => {
  it('returns puppy crates converter config with crate training route', () => {
    const config = getRelaxationConverterPageConfig('best-puppy-crates');

    expect(config.pageSlug).toBe('best-puppy-crates');
    expect(config.hero.secondaryCta?.href).toBe('/calming/crate-training-for-dogs/');
    expect(config.itemListSchema?.productIds).toEqual([
      'kindtail-pawd-collapsible-crate',
      'midwest-icrate-puppy',
      'midwest-life-stages-puppy-crate',
      'petmate-training-retreat-kennel',
      'internets-best-small-wire-crate',
    ]);
  });

  it('returns anxiety crates converter config with safety framing', () => {
    const config = getRelaxationConverterPageConfig('best-anxiety-dog-crates');

    expect(config.pageSlug).toBe('best-anxiety-dog-crates');
    expect(config.hero.secondaryCta?.href).toBe('/calming/crate-training-for-dogs/');
    expect(config.itemListSchema?.productIds).toEqual([
      'midwest-life-stages-crate',
      'petmate-sky-kennel',
      'impact-high-anxiety-crate',
    ]);
    expect(config.blocks.some((block) => (
      block.kind === 'prose' &&
      block.heading === 'Safety First: A Crate Is Not a Separation Anxiety Cure'
    ))).toBe(true);
  });

  it('returns travel crates converter config with road trip product logic', () => {
    const config = getRelaxationConverterPageConfig('best-travel-crates-for-road-trips');

    expect(config.pageSlug).toBe('best-travel-crates-for-road-trips');
    expect(config.hero.secondaryCta?.href).toBe('/travel/dog-road-trip-gear/');
    expect(config.itemListSchema?.productIds).toEqual([
      'petsafe-happy-ride-travel-crate',
      'petmate-sky-kennel',
      'elitefield-three-door-soft-crate',
      'lesure-soft-collapsible-crate',
      'collapsible-hard-sided-travel-crate',
      'zomisia-collapsible-steel-crate',
    ]);
    expect(config.blocks.some((block) => (
      block.kind === 'prose' &&
      block.heading === 'Hard-Sided vs Soft Folding Travel Crates'
    ))).toBe(true);
  });

  it('returns airline crates converter config with rigid travel product logic', () => {
    const config = getRelaxationConverterPageConfig('best-airline-crates-for-flying-with-your-dog');

    expect(config.pageSlug).toBe('best-airline-crates-for-flying-with-your-dog');
    expect(config.hero.secondaryCta?.href).toBe('/calming/crate-training-for-dogs/');
    expect(config.itemListSchema?.productIds).toEqual([
      'petmate-sky-kennel',
      'sportpet-airline-compliant-kennel',
      'amazon-basics-hard-sided-carrier',
      'petmate-two-door-kennel',
    ]);
  });

  it('resolves plain product refs to canonical display products', () => {
    const [product] = resolveRelaxationDisplayProducts(['petmate-sky-kennel']);

    expect(product.id).toBe('petmate-sky-kennel');
    expect(product.bullets).toEqual([
      'Enclosed plastic shell reduces visual stimulation compared to open wire crates',
      '360-degree ventilation and tie-down holes support travel use',
      'Includes travel-prep accessories such as live-animal stickers, cup, ID stickers, and absorbent pad',
    ]);
  });

  it('supports hiding and appending product bullets per page', () => {
    const [product] = resolveRelaxationDisplayProducts([
      {
        id: 'petmate-sky-kennel',
        hideBullets: [0],
        appendBullets: ['Verify airline-specific hardware and size rules before flying.'],
      },
    ]);

    expect(product.bullets).toEqual([
      '360-degree ventilation and tie-down holes support travel use',
      'Includes travel-prep accessories such as live-animal stickers, cup, ID stickers, and absorbent pad',
      'Verify airline-specific hardware and size rules before flying.',
    ]);
  });

  it('supports full bullet replacement per page', () => {
    const [product] = resolveRelaxationDisplayProducts([
      {
        id: 'petmate-sky-kennel',
        bullets: ['Rigid kennel shape fits airline-style flight prep better than soft or collapsible travel crates.'],
      },
    ]);

    expect(product.bullets).toEqual([
      'Rigid kennel shape fits airline-style flight prep better than soft or collapsible travel crates.',
    ]);
  });

  it('hides the wire-comparison bullet on the airline crates page only', () => {
    const config = getRelaxationConverterPageConfig('best-airline-crates-for-flying-with-your-dog');
    const airlineBlock = config.blocks.find(
      (block) => block.kind === 'product_section' && block.id === 'airline-crates'
    );

    expect(airlineBlock?.kind).toBe('product_section');

    const resolved = resolveRelaxationDisplayProducts(
      airlineBlock?.kind === 'product_section' ? airlineBlock.productIds : []
    );
    const petmate = resolved.find((product) => product.id === 'petmate-sky-kennel');
    const [canonicalPetmate] = resolveRelaxationDisplayProducts(['petmate-sky-kennel']);

    expect(petmate?.bullets).not.toContain(
      'Enclosed plastic shell reduces visual stimulation compared to open wire crates'
    );
    expect(canonicalPetmate.bullets).toContain(
      'Enclosed plastic shell reduces visual stimulation compared to open wire crates'
    );
  });

  it('returns furniture crates converter config with decorative indoor product logic', () => {
    const config = getRelaxationConverterPageConfig('best-furniture-dog-crates');

    expect(config.pageSlug).toBe('best-furniture-dog-crates');
    expect(config.hero.secondaryCta?.href).toBe('/comforting/');
    expect(config.itemListSchema?.productIds).toEqual([
      'amazon-basics-furniture-style-crate',
      'dwanton-dog-crate-furniture',
      'rehomerance-dog-crate-furniture',
      'feandrea-furniture-crate',
      'internets-best-decorative-kennel',
      'lyromix-dog-crate-furniture',
      'ironck-small-furniture-crate',
      'easycom-foldable-dog-crate-furniture',
      'rotating-bowl-furniture-crate',
      'ironck-extra-large-dog-crate-furniture',
      'bifanuo-dog-crate-furniture',
      'charging-station-furniture-crate',
      'saksun-furniture-crate',
      'rovibek-double-dog-crate-furniture',
      'hugcoz-double-furniture-dog-crate',
      'pawhut-furniture-dog-crate-double',
      'oranland-heavy-duty-furniture-crate',
    ]);
  });

  it('returns heavy-duty crates converter config with reinforced containment product logic', () => {
    const config = getRelaxationConverterPageConfig('best-heavy-duty-dog-crates');

    expect(config.pageSlug).toBe('best-heavy-duty-dog-crates');
    expect(config.hero.secondaryCta?.href).toBe('/comforting/best-anxiety-dog-crates/');
    expect(config.itemListSchema?.productIds).toEqual([
      'impact-high-anxiety-crate',
      'oranland-heavy-duty-dog-crate',
      'kokotangs-heavy-duty-dog-crate',
      'gardner-pet-heavy-duty-crate',
      'xxl-heavy-duty-dog-crate',
      'hiwokk-large-dog-crate',
      'hzuaneri-furniture-dog-crate',
      'rexwelten-furniture-dog-crate',
      'petrova-furniture-dog-crate',
    ]);
  });

  it('builds item list schema for puppy crates', () => {
    const config = getRelaxationConverterPageConfig('best-puppy-crates');
    const schema = buildRelaxationItemListSchema(config.itemListSchema!);

    expect(schema['@type']).toBe('ItemList');
    expect(schema.numberOfItems).toBe(5);
  });

  it('keeps puppy crate products in the crates category', () => {
    const productIds = getRelaxationProductsByCategory('crates').map((product) => product.id);

    expect(productIds).toEqual(expect.arrayContaining([
      'kindtail-pawd-collapsible-crate',
      'midwest-icrate-puppy',
      'midwest-life-stages-puppy-crate',
      'midwest-icrate',
      'midwest-life-stages-crate',
      'petmate-training-retreat-kennel',
      'internets-best-small-wire-crate',
      'petmate-sky-kennel',
      'impact-high-anxiety-crate',
      'petsafe-happy-ride-travel-crate',
      'elitefield-three-door-soft-crate',
      'lesure-soft-collapsible-crate',
      'collapsible-hard-sided-travel-crate',
      'zomisia-collapsible-steel-crate',
      'sportpet-airline-compliant-kennel',
      'amazon-basics-hard-sided-carrier',
      'petmate-two-door-kennel',
      'amazon-basics-furniture-style-crate',
      'dwanton-dog-crate-furniture',
      'rehomerance-dog-crate-furniture',
      'internets-best-decorative-kennel',
      'lyromix-dog-crate-furniture',
      'easycom-foldable-dog-crate-furniture',
      'rotating-bowl-furniture-crate',
      'ironck-extra-large-dog-crate-furniture',
      'bifanuo-dog-crate-furniture',
      'charging-station-furniture-crate',
      'oranland-heavy-duty-furniture-crate',
      'hzuaneri-furniture-dog-crate',
      'rexwelten-furniture-dog-crate',
      'petrova-furniture-dog-crate',
      'rovibek-double-dog-crate-furniture',
      'hugcoz-double-furniture-dog-crate',
      'pawhut-furniture-dog-crate-double',
      'oranland-heavy-duty-dog-crate',
      'kokotangs-heavy-duty-dog-crate',
      'gardner-pet-heavy-duty-crate',
      'xxl-heavy-duty-dog-crate',
      'hiwokk-large-dog-crate',
    ]));
  });

  it('returns travel beds converter config with travel-specific product logic', () => {
    const config = getRelaxationConverterPageConfig('best-dog-travel-beds');

    expect(config.pageSlug).toBe('best-dog-travel-beds');
    expect(config.hero.secondaryCta?.href).toBe('/travel/dog-road-trip-gear/');
    expect(config.itemListSchema?.productIds).toEqual([
      'chuckit-travel-bed',
      'coleman-roll-up-travel-bed',
      'furhaven-outdoor-travel-dog-bed',
      'kindtail-nomad-nap-mat',
      'onetigris-travel-dog-bed',
      'kurgo-loft-wander-bed',
      'bingpet-outdoor-travel-bed',
      'yofang-extra-large-travel-bed',
    ]);
    expect(config.blocks.some((block) => (
      block.kind === 'note' &&
      block.heading === 'Important Flight Note'
    ))).toBe(true);
  });

  it('returns chew-resistant beds converter config with toughness-specific product logic', () => {
    const config = getRelaxationConverterPageConfig('best-chew-resistant-dog-beds');

    expect(config.pageSlug).toBe('best-chew-resistant-dog-beds');
    expect(config.title).toBe('Best Chew-Proof Dog Beds');
    expect(config.hero.secondaryCta?.href).toBe('/comforting/');
    expect(config.itemListSchema?.productIds).toEqual([
      'k9-ballistics-armored-crate-bed',
      'k9-ballistics-elevated-cooling-bed',
      'fxw-titannest-elevated-bed',
      'veehoo-chewproof-elevated-bed',
      'k9-ballistics-ripstop-oval-bolster-bed',
    ]);
    expect(config.hero.disclaimer).toBe('As an Amazon Associate, we earn from qualifying purchases.');
  });

  it('returns orthopedic beds converter config as one ungrouped bed list', () => {
    const config = getRelaxationConverterPageConfig('best-orthopedic-dog-beds');

    expect(config.pageSlug).toBe('best-orthopedic-dog-beds');
    // #375 dropped both hero buttons from this page.
    expect(config.hero.primaryCta).toBeUndefined();
    expect(config.hero.secondaryCta).toBeUndefined();
    expect(config.itemListSchema?.productIds).toHaveLength(29);
    expect(config.hero.disclaimer).toBe('As an Amazon Associate and a Chewy Affiliate, we earn from qualifying purchases.');
    // #387: two sections, Flat Beds then Bolster Beds; together they cover every bed once.
    const sections = config.blocks.filter((block) => block.kind === 'product_section');
    expect(sections.map((section) => section.id)).toEqual(['flat-beds', 'bolster-beds']);
    const sectionIds = sections.flatMap((section) =>
      section.kind === 'product_section'
        ? section.productIds.map((ref) => (typeof ref === 'string' ? ref : ref.id))
        : [],
    );
    expect(sectionIds).toEqual(config.itemListSchema?.productIds);
    expect(new Set(sectionIds).size).toBe(29);
    expect(config.toc?.map((entry) => entry.anchor)).toEqual([
      'what-to-look-for',
      'flat-beds',
      'bolster-beds',
      'faq',
    ]);
  });

  it('keeps orthopedic bed products in the orthopedic-beds category', () => {
    const productIds = getRelaxationProductsByCategory('orthopedic-beds').map((product) => product.id);

    expect(productIds).toEqual(expect.arrayContaining([
      'rainmr-memory-foam-bed',
      'eheyciga-xl-memory-foam-couch',
      'noah-paw-denim-orthopedic-bed',
      'cozy-kiss-xl-bolster-bed',
      'anti-anxiety-orthopedic-bed',
      'carolina-pet-bolster-lg',
      'dog-bed-wont-go-flat-crate-bed',
      'nupida-xl-crate-bed',
      'veehoo-xxl-memory-foam-bed',
      'noah-paw-giant-orthopedic-bed',
      'zomisia-orthopedic-bed',
      'ohgeni-orthopedic-bed',
    ]));
  });

  describe('Chewy orthopedic beds (#380, #381)', () => {
    const chewyIds = [
      ...chewyOrthopedicBedIds.sofa,
      ...chewyOrthopedicBedIds.foam,
      ...chewyOrthopedicBedIds.crate,
    ];
    const chewyBeds = chewyIds.map((id) => {
      const product = relaxationProducts.find((p) => p.id === id);
      if (!product) throw new Error(`missing Chewy bed ${id}`);
      return product;
    });

    it('adds all 17 beds from the two issues, once each', () => {
      expect(chewyIds).toHaveLength(17);
      expect(new Set(chewyIds).size).toBe(17);
    });

    it('lists every Chewy bed across the flat and bolster sections', () => {
      const config = getRelaxationConverterPageConfig('best-orthopedic-dog-beds');
      const sections = config.blocks.filter((block) => block.kind === 'product_section');
      const ids = sections.flatMap((section) =>
        section.kind === 'product_section'
          ? section.productIds.map((ref) => (typeof ref === 'string' ? ref : ref.id))
          : [],
      );
      expect(ids).toHaveLength(29);
      for (const id of chewyIds) expect(ids).toContain(id);
      expect(sections[0].kind === 'product_section' ? sections[0].positionOffset : -1).toBe(0);
    });

    it('is Chewy-only: a Chewy primary offer and no Amazon data', () => {
      for (const bed of chewyBeds) {
        expect(bed.category).toBe('orthopedic-beds');
        expect(bed.asin, bed.id).toBeUndefined();
        expect(bed.amazonUrl, bed.id).toBeUndefined();
        const offers = getOffers(bed);
        expect(offers.map((offer) => offer.merchant), bed.id).toEqual(['chewy']);
        expect(offers[0].canonicalUrl, bed.id).toMatch(/^https:\/\/www\.chewy\.com\/.+\/dp\/\d+$/);
        expect(new URL(offers[0].url).hostname, bed.id).toBe('chewy.sjv.io');
        expect(offers[0].merchantProductId, bed.id).toBe(offers[0].canonicalUrl!.match(/\/dp\/(\d+)/)![1]);
      }
      expect(getAllAmazonOfferEntries(chewyBeds)).toEqual([]);
    });

    it('gives each bed hand-written copy and an allowed Chewy image', () => {
      for (const bed of chewyBeds) {
        expect(bed.bullets.length, bed.id).toBeGreaterThanOrEqual(2);
        expect(bed.image?.src, bed.id).toMatch(/^https:\/\/image\.chewy\.com\//);
        expect(bed.image?.alt, bed.id).toBe(bed.name);
        expect(bed.name, bed.id).not.toMatch(/vet-(approved|recommended)/i);
        expect(bed.bullets.join(' '), bed.id).not.toMatch(/vet-(approved|recommended)/i);
      }
    });

    it('mirrors the default variant in product.offers and keeps every size distinct', () => {
      const withPicker = chewyBeds.filter((bed) => bed.variantGroup);
      expect(withPicker.length).toBeGreaterThanOrEqual(10);

      for (const bed of withPicker) {
        const group = bed.variantGroup!;
        const variants = getVariants({ variantGroup: group });
        expect(group.axis.id, bed.id).toBe('dog-size');
        expect(variants.length, bed.id).toBeGreaterThanOrEqual(2);
        expect(new Set(variants.map((v) => v.id)).size, bed.id).toBe(variants.length);
        expect(new Set(variants.map((v) => v.label)).size, bed.id).toBe(variants.length);

        const fallback = variants.find((v) => v.id === group.defaultVariantId);
        expect(fallback, `${bed.id} default variant`).toBeTruthy();
        const defaultOffer = getOffers({ ...bed, offers: fallback!.offers as never })[0];
        expect(defaultOffer.url, bed.id).toBe(getOffers(bed)[0].url);

        const productIds = variants.map((v) => v.offers[0].merchantProductId);
        expect(new Set(productIds).size, `${bed.id} duplicate Chewy listing`).toBe(variants.length);
        for (const variant of variants) {
          expect(variant.offers.map((offer) => offer.merchant), `${bed.id}/${variant.id}`).toEqual(['chewy']);
        }
      }
    });

    it('keeps the listing the issue linked as the default size', () => {
      const issueListings: Record<string, string> = {
        'eheyciga-waterproof-sofa-bed': '3816406',
        'eheyciga-high-back-sofa-bed': '3816182',
        'noah-paw-velvet-orthopedic-bed': '1971958',
        'noah-paw-denim-collection-bed': '1971414',
        'carolina-pet-berber-bolster-bed': '1384590',
        'veehoo-elevated-memory-foam-bed': '3276798',
        'zomisia-fluffy-egg-foam-bed': '4371206',
        'kylinsure-orthopedic-pillow-bed': '3763614',
        'berenlefe-oversized-lounge-bed': '4177406',
        'timberdog-ruffrest-travel-bed': '1506782',
        'laifug-orthopedic-memory-foam-bed': '907414',
        'furhaven-cable-corduroy-couch-bed': '3305502',
        'kylinsure-all-around-bolster-bed': '4529006',
        'comfort-expression-waterproof-foam-bed': '1886782',
        'three-dog-ez-wash-softshell-bolster-bed': '255891',
        'snoozer-cozy-cave-orthopedic-bed': '1098158',
        'furhaven-embossed-velvet-sofa-bed': '3305926',
      };

      for (const bed of chewyBeds) {
        expect(getOffers(bed)[0].merchantProductId, bed.id).toBe(issueListings[bed.id]);
      }
    });
  });

  it('keeps travel bed products in the travel-beds category', () => {
    const productIds = getRelaxationProductsByCategory('travel-beds').map((product) => product.id);

    expect(productIds).toEqual(expect.arrayContaining([
      'furhaven-outdoor-travel-dog-bed',
      'chuckit-travel-bed',
      'coleman-roll-up-travel-bed',
      'kindtail-nomad-nap-mat',
      'onetigris-travel-dog-bed',
      'kurgo-loft-wander-bed',
      'yofang-extra-large-travel-bed',
      'bingpet-outdoor-travel-bed',
    ]));
  });

  it('keeps chew-resistant bed products in the chew-resistant-beds category', () => {
    const productIds = getRelaxationProductsByCategory('chew-resistant-beds').map((product) => product.id);

    expect(productIds).toEqual(expect.arrayContaining([
      'k9-ballistics-armored-crate-bed',
      'fxw-titannest-elevated-bed',
      'veehoo-chewproof-elevated-bed',
      'k9-ballistics-ripstop-oval-bolster-bed',
    ]));
  });

  it('borrows the K9 Ballistics elevated cooling bed onto the chew-proof page without refiling it', () => {
    const [product] = resolveRelaxationDisplayProducts(['k9-ballistics-elevated-cooling-bed']);

    expect(product.name).toBe('K9 Ballistics Chew Proof Elevated Cooling Bed');
    expect(product.category).toBe('cooling-mats');
    expect(product.amazonUrl).toContain('tag=chill-dogs-20');
  });

  it('keeps the bed converters on the current block kinds only', () => {
    const allowed = new Set(['prose', 'product_section', 'decision_columns', 'note']);

    for (const slug of ['best-orthopedic-dog-beds', 'best-chew-resistant-dog-beds', 'best-dog-travel-beds']) {
      const config = getRelaxationConverterPageConfig(slug);
      for (const block of config.blocks) {
        expect(allowed.has(block.kind)).toBe(true);
      }
      for (const heading of config.toc ?? []) {
        expect(heading.anchor).not.toMatch(/quick-picks|comparison-table/);
      }
      expect(config.hero.primaryCta?.href).not.toBe('#quick-picks');
    }
  });

  it('carries the reviewed OneTigris copy on the travel beds page only', () => {
    const config = getRelaxationConverterPageConfig('best-dog-travel-beds');
    const section = config.blocks.find((block) => block.kind === 'product_section');
    if (section?.kind !== 'product_section') throw new Error('missing travel bed section');

    const products = resolveRelaxationDisplayProducts(section.productIds);
    const onetigris = products.find((product) => product.id === 'onetigris-travel-dog-bed');

    expect(onetigris?.bullets).toContain('Portable design makes it convenient to keep in the car');
    expect(getRelaxationProductsByCategory('travel-beds').find((p) => p.id === 'onetigris-travel-dog-bed')?.bullets)
      .not.toContain('Portable design makes it convenient to keep in the car');
  });

  it('throws for unknown slugs', () => {
    expect(() => getRelaxationConverterPageConfig('missing-slug')).toThrow(
      'Missing relaxation converter page config for slug: missing-slug'
    );
  });
});
