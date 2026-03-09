import { describe, expect, it } from 'vitest';

import {
  buildCalmingItemListSchema,
  getCalmingConverterPageConfig,
} from '../data/calming-converter-pages';

describe('calming converter page config', () => {
  it('returns config for thundershirt alternatives with compare anchor CTA', () => {
    const config = getCalmingConverterPageConfig('best-thundershirt-alternatives');

    expect(config.pageSlug).toBe('best-thundershirt-alternatives');
    expect(config.hero.primaryCta.href).toBe('#compare');
    expect(config.hero.secondaryCta?.href).toBe('/calming/best-calming-products-for-anxious-dogs/');
  });

  it('builds item list schema for calming pillar', () => {
    const config = getCalmingConverterPageConfig('best-calming-products-for-anxious-dogs');
    const schema = buildCalmingItemListSchema(config.itemListSchema!);

    expect(schema['@type']).toBe('ItemList');
    expect(schema.numberOfItems).toBe(8);
  });

  it('throws for unknown slugs', () => {
    expect(() => getCalmingConverterPageConfig('missing-slug')).toThrow(
      'Missing calming converter page config for slug: missing-slug'
    );
  });
});
