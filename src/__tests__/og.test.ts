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

  it('falls back to chill-dogs when no headline props given', () => {
    expect(deriveOgHeadline({})).toBe('chill-dogs');
  });

  it('clamps long text at word boundary with ellipsis', () => {
    const longText = 'This is a very long headline that should be truncated cleanly at a safe word boundary';
    const clamped = clampOgText(longText, 36);

    expect(clamped.endsWith('…')).toBe(true);
    expect(clamped.length).toBeLessThanOrEqual(36);
  });

  it('returns text verbatim when exactly at maxChars', () => {
    const text = 'A'.repeat(88);
    expect(clampOgText(text, 88)).toBe(text);
  });

  it('hard-truncates when no word boundary exists', () => {
    const longWord = 'A'.repeat(100);
    const clamped = clampOgText(longWord, 50);
    expect(clamped.endsWith('…')).toBe(true);
    expect(clamped.length).toBeLessThanOrEqual(50);
  });

  it('maps CTA defaults by page type and supports override', () => {
    expect(deriveOgCta({ pageType: 'converter' })).toBe('Shop Top Picks Now');
    expect(deriveOgCta({ pageType: 'collector' })).toBe('See Top Product Picks');
    expect(deriveOgCta({ pageType: 'collector', ogCta: 'Use this custom CTA' })).toBe('Use this custom CTA');
    expect(deriveOgCta({})).toBe('See Top Product Picks');
  });

  it('creates predictable route slugs', () => {
    expect(ogSlugFromPathname('/')).toBe('home');
    expect(ogSlugFromPathname('/cooling/cooling-mats/')).toBe('cooling-cooling-mats');
    expect(ogSlugFromPathname('/calming')).toBe('calming');
  });

  it('marks eligible routes and excludes variants, noindex, and 404', () => {
    expect(isAutoOgEligible({ pathname: '/cooling/cooling-mats/' })).toBe(true);
    expect(isAutoOgEligible({ pathname: '/cooling/v/a/' })).toBe(false);
    expect(isAutoOgEligible({ pathname: '/about/', noindex: true })).toBe(false);
    expect(isAutoOgEligible({ pathname: '/404' })).toBe(false);

    expect(resolveAutoOgImagePath({ pathname: '/cooling/cooling-mats/' })).toBe('/og/cooling-cooling-mats.png');
    expect(resolveAutoOgImagePath({ pathname: '/cooling/v/a/' })).toBeNull();
    expect(resolveAutoOgImagePath({ pathname: '/about/', noindex: true })).toBeNull();
  });
});
