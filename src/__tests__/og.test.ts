import { describe, expect, it } from 'vitest';

import {
  clampOgText,
  deriveOgCta,
  deriveOgHeadline,
  isAutoOgEligible,
  ogSlugFromPathname,
  resolveAutoOgImagePath,
} from '../utils/og';

describe('og utility functions', () => {
  it('derives headline with correct priority and strips site suffix', () => {
    expect(
      deriveOgHeadline({
        ogHeadline: 'Custom OG headline',
        seoTitle: 'SEO Title',
        title: 'Base Title',
      })
    ).toBe('Custom OG headline');

    expect(
      deriveOgHeadline({
        seoTitle: 'Best Cooling Mats | chill-dogs',
        title: 'Base Title',
      })
    ).toBe('Best Cooling Mats');

    expect(deriveOgHeadline({ title: 'chill-dogs — Car Cooling Picks' })).toBe('Car Cooling Picks');
  });

  it('clamps long text with ellipsis', () => {
    const longText = 'This is a very long headline that should be truncated cleanly at a safe word boundary';
    const clamped = clampOgText(longText, 36);

    expect(clamped.endsWith('…')).toBe(true);
    expect(clamped.length).toBeLessThanOrEqual(36);
  });

  it('maps CTA defaults by page type and supports override', () => {
    expect(deriveOgCta({ pageType: 'converter' })).toBe('Shop Top Picks Now');
    expect(deriveOgCta({ pageType: 'collector' })).toBe('See Top Product Picks');
    expect(deriveOgCta({ pageType: 'attractor' })).toBe('Get the Best Picks Fast');
    expect(deriveOgCta({ pageType: 'informer' })).toBe('Read Full Details');
    expect(deriveOgCta({ pageType: 'collector', ogCta: 'Use this custom CTA' })).toBe('Use this custom CTA');
  });

  it('creates predictable route slugs', () => {
    expect(ogSlugFromPathname('/')).toBe('home');
    expect(ogSlugFromPathname('/cooling/cooling-mats/')).toBe('cooling-cooling-mats');
    expect(ogSlugFromPathname('/calming')).toBe('calming');
  });

  it('marks eligible routes and resolves OG asset paths', () => {
    expect(isAutoOgEligible({ pathname: '/cooling/cooling-mats/' })).toBe(true);
    expect(isAutoOgEligible({ pathname: '/cooling/v/a/' })).toBe(false);
    expect(isAutoOgEligible({ pathname: '/about/', noindex: true })).toBe(false);

    expect(resolveAutoOgImagePath({ pathname: '/cooling/cooling-mats/' })).toBe('/og/cooling-cooling-mats.png');
    expect(resolveAutoOgImagePath({ pathname: '/cooling/v/a/' })).toBeNull();
  });
});
