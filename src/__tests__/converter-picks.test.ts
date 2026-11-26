import { describe, expect, it } from 'vitest';

import { getTrackerTypePicks, TRACKER_TYPE_ORDER } from '../data/converter-picks';
import { getTrackersByType, trackerConverterTitle } from '../data/tracking-products';

describe('getTrackerTypePicks', () => {
  it('takes the first tracker of each type, in the GPS converter section order', () => {
    const picks = getTrackerTypePicks();
    expect(picks.products.map((p) => p.id)).toEqual(TRACKER_TYPE_ORDER.map((type) => getTrackersByType(type)[0].id));
    expect(picks.products.map((p) => p.category)).toEqual(['cellular', 'off-grid', 'bluetooth']);
  });

  it("reuses the converter's own title for the heading and the link, so the article adds no copy", () => {
    const picks = getTrackerTypePicks();
    expect(picks.heading).toBe(trackerConverterTitle);
    expect(picks.converterTitle).toBe(trackerConverterTitle);
  });

  it('gives every pick what the lean card needs: a name, three bullets and an image', () => {
    for (const product of getTrackerTypePicks().products) {
      expect(product.name).toBeTruthy();
      expect(product.bullets).toHaveLength(3);
      expect(product.image?.src).toMatch(/^https:\/\//);
    }
  });
});
