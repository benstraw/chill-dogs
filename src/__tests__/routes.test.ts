import { describe, expect, it } from 'vitest';

import { ROUTES } from '../data/routes';
import { calmingCollectorBody, comfortCollectorBody } from '../data/collector-bodies';

describe('route constants', () => {
  it('uses canonical calming alternatives route', () => {
    expect(ROUTES.calmingAlternatives).toBe('/calming/best-thundershirt-alternatives/');
  });

  it('uses canonical puppy crates route', () => {
    expect(ROUTES.comfortPuppyCrates).toBe('/comforting/best-puppy-crates/');
  });

  it('uses canonical anxiety crates route', () => {
    expect(ROUTES.comfortAnxietyCrates).toBe('/comforting/best-anxiety-dog-crates/');
  });

  it('uses canonical travel crates route', () => {
    expect(ROUTES.comfortTravelCrates).toBe('/comforting/best-travel-crates-for-road-trips/');
  });

  it('keeps calming collector links aligned to canonical route', () => {
    const alternativesCard = calmingCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Best ThunderShirt Alternatives for Dogs'
    );
    const carAnxietyCard = calmingCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Car Anxiety for Dogs'
    );

    expect(alternativesCard?.href).toBe(ROUTES.calmingAlternatives);
    expect(alternativesCard?.dataToPage).toBe(ROUTES.calmingAlternatives);
    expect(carAnxietyCard?.href).toBe(ROUTES.calmingCar);
    expect(carAnxietyCard?.dataToPage).toBe(ROUTES.calmingCar);
  });

  it('keeps comfort collector puppy crate link aligned to canonical route', () => {
    const puppyCratesCard = comfortCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Best Puppy Crates'
    );
    const anxietyCratesCard = comfortCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Best Dog Crates for Anxiety'
    );
    const travelCratesCard = comfortCollectorBody.sections[0].cards.find(
      (card) => card.title === 'Best Travel Crates for Road Trips'
    );

    expect(puppyCratesCard?.href).toBe(ROUTES.comfortPuppyCrates);
    expect(puppyCratesCard?.dataToPage).toBe(ROUTES.comfortPuppyCrates);
    expect(anxietyCratesCard?.href).toBe(ROUTES.comfortAnxietyCrates);
    expect(anxietyCratesCard?.dataToPage).toBe(ROUTES.comfortAnxietyCrates);
    expect(travelCratesCard?.href).toBe(ROUTES.comfortTravelCrates);
    expect(travelCratesCard?.dataToPage).toBe(ROUTES.comfortTravelCrates);
  });
});
