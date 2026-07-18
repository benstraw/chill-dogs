import { describe, expect, it } from 'vitest';

import { getHomepagePicks } from '../data/homepage-picks';

describe('homepage picks', () => {
  it('resolves every configured pick against the product catalog', () => {
    for (const pillar of ['cooling', 'calming', 'comfort', 'gear'] as const) {
      const picks = getHomepagePicks(pillar);

      expect(picks.length).toBeGreaterThan(0);
      expect(picks.length).toBeLessThanOrEqual(2);
      for (const pick of picks) {
        expect(pick.pillar).toBe(pillar);
        expect(pick.offers.length).toBeGreaterThan(0);
        expect(pick.name).toBeTruthy();
      }
    }
  });

  it('includes an Amazon offer for every pick so the homepage fires amazon_outbound_click', () => {
    for (const pillar of ['cooling', 'calming', 'comfort', 'gear'] as const) {
      for (const pick of getHomepagePicks(pillar)) {
        expect(pick.offers.some((offer) => offer.merchant === 'amazon')).toBe(true);
      }
    }
  });
});
