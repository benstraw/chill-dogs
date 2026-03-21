import { describe, expect, it } from 'vitest';

import { getCoolingConverterPageConfig } from '../data/cooling-converter-pages';

describe('cooling converter page config', () => {
  it('returns the expected config for car cooling route', () => {
    const config = getCoolingConverterPageConfig('car-cooling-for-dogs');

    expect(config.category).toBe('car-cooling');
    expect(config.pageSlug).toBe('car-cooling-for-dogs');
    expect(config.columns).toBe(2);
    expect(config.faqHeading).toBe('Car Cooling FAQ');
    expect(config.secondaryCta?.href).toBe('/travel/dog-road-trip-gear/');
  });

  it('throws for unknown slugs', () => {
    expect(() => getCoolingConverterPageConfig('unknown-slug')).toThrow(
      'Missing cooling converter page config for slug: unknown-slug'
    );
  });
});
