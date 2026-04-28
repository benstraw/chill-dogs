import { describe, expect, it } from 'vitest';

import {
  buildRelaxationItemListSchema,
  getRelaxationConverterPageConfig,
  resolveRelaxationDisplayProducts,
} from '../data/relaxation-converter-pages';
import { getRelaxationProductsByCategory } from '../data/relaxation-products';

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
    expect(config.hero.secondaryCta?.href).toBe('/comforting/');
    expect(config.itemListSchema?.productIds).toEqual([
      'k9-ballistics-armored-crate-bed',
      'k9-ballistics-elevated-cooling-bed',
      'fxw-titannest-elevated-bed',
      'veehoo-chewproof-elevated-bed',
      'k9-ballistics-ripstop-oval-bolster-bed',
      'k9-ballistics-rectangle-pillow-bed',
      'vivifying-chew-resistant-crate-pad',
      'sytopia-orthopedic-chew-resistant-bed',
      'sytopia-elevated-chew-resistant-bed',
      'brands1231-chew-resistant-crate-mat',
    ]);
    expect(config.blocks.some((block) => (
      block.kind === 'comparison_table' &&
      block.heading === 'Chew-Resistant Bed Comparison Table'
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

  it('supports full bullet replacement and copy overrides per page', () => {
    const [product] = resolveRelaxationDisplayProducts([
      {
        id: 'petmate-sky-kennel',
        bullets: ['Rigid kennel shape fits airline-style flight prep better than soft or collapsible travel crates.'],
        bestFor: 'Flight prep when you want a hard-sided kennel with strong airline-travel familiarity',
        considerIf: 'You want a rigid kennel for flight prep rather than a soft or collapsible travel crate',
      },
    ]);

    expect(product.bullets).toEqual([
      'Rigid kennel shape fits airline-style flight prep better than soft or collapsible travel crates.',
    ]);
    expect(product.bestFor).toBe(
      'Flight prep when you want a hard-sided kennel with strong airline-travel familiarity'
    );
    expect(product.considerIf).toBe(
      'You want a rigid kennel for flight prep rather than a soft or collapsible travel crate'
    );
    expect(product.whyItWorks).toBe(
      'The plastic shell creates a quieter, more contained environment while still allowing ventilation from all sides'
    );
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
      'internets-best-decorative-kennel',
      'lyromix-dog-crate-furniture',
      'easycom-foldable-dog-crate-furniture',
      'rotating-bowl-furniture-crate',
      'ironck-extra-large-dog-crate-furniture',
      'bifanuo-dog-crate-furniture',
      'charging-station-furniture-crate',
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
      'oranland-heavy-duty-dog-crate',
      'kokotangs-heavy-duty-dog-crate',
      'gardner-pet-heavy-duty-crate',
      'xxl-heavy-duty-dog-crate',
      'hiwokk-large-dog-crate',
    ]));
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
      'k9-ballistics-rectangle-pillow-bed',
      'vivifying-chew-resistant-crate-pad',
      'sytopia-orthopedic-chew-resistant-bed',
      'sytopia-elevated-chew-resistant-bed',
      'brands1231-chew-resistant-crate-mat',
    ]));
  });

  it('throws for unknown slugs', () => {
    expect(() => getRelaxationConverterPageConfig('missing-slug')).toThrow(
      'Missing relaxation converter page config for slug: missing-slug'
    );
  });
});
