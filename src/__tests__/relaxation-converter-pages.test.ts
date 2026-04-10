import { describe, expect, it } from 'vitest';

import {
  buildRelaxationItemListSchema,
  getRelaxationConverterPageConfig,
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
    ]);
    expect(config.blocks.some((block) => (
      block.kind === 'prose' &&
      block.heading === 'Hard-Sided vs Soft Folding Travel Crates'
    ))).toBe(true);
  });

  it('builds item list schema for puppy crates', () => {
    const config = getRelaxationConverterPageConfig('best-puppy-crates');
    const schema = buildRelaxationItemListSchema(config.itemListSchema!);

    expect(schema['@type']).toBe('ItemList');
    expect(schema.numberOfItems).toBe(4);
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
      'petmate-sky-kennel',
      'impact-high-anxiety-crate',
      'petsafe-happy-ride-travel-crate',
      'elitefield-three-door-soft-crate',
      'lesure-soft-collapsible-crate',
    ]));
  });

  it('throws for unknown slugs', () => {
    expect(() => getRelaxationConverterPageConfig('missing-slug')).toThrow(
      'Missing relaxation converter page config for slug: missing-slug'
    );
  });
});
