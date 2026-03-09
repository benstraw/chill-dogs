import { describe, expect, it } from 'vitest';

import { ROUTES } from '../data/routes';
import { calmingCollectorBody } from '../data/collector-bodies';

describe('route constants', () => {
  it('uses canonical calming alternatives route', () => {
    expect(ROUTES.calmingAlternatives).toBe('/calming/best-thundershirt-alternatives/');
  });

  it('keeps calming collector links aligned to canonical route', () => {
    const alternativesCard = calmingCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Best ThunderShirt Alternatives for Dogs'
    );

    expect(alternativesCard?.href).toBe(ROUTES.calmingAlternatives);
    expect(alternativesCard?.dataToPage).toBe(ROUTES.calmingAlternatives);
  });
});
