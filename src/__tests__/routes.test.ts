import { describe, expect, it } from 'vitest';

import { ROUTES } from '../data/routes';
import { sectionCollectorDefinitions } from '../data/section-collectors';

describe('route constants', () => {
  it('uses canonical calming alternatives route', () => {
    expect(ROUTES.calmingAlternatives).toBe('/calming/best-thundershirt-alternatives/');
  });

  it('uses canonical fireworks calm room route', () => {
    expect(ROUTES.calmingFireworksRoom).toBe(
      '/calming/how-to-prepare-a-calm-room-for-fireworks-night/'
    );
  });

  it('uses canonical lick mat converter route', () => {
    expect(ROUTES.calmingLickMats).toBe('/calming/best-lick-mats-for-dogs/');
  });

  it('uses canonical fireworks checklist route', () => {
    expect(ROUTES.calmingFireworksChecklist).toBe(
      '/calming/dog-fireworks-anxiety-checklist/'
    );
  });

  it('uses canonical fireworks event article route', () => {
    expect(ROUTES.calmingFireworksEvent).toBe(
      '/calming/should-you-take-your-dog-to-fireworks/'
    );
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

  it('uses canonical airline, furniture, and heavy-duty crate routes', () => {
    expect(ROUTES.comfortAirlineCrates).toBe('/comforting/best-airline-crates-for-flying-with-your-dog/');
    expect(ROUTES.comfortFurnitureCrates).toBe('/comforting/best-furniture-dog-crates/');
    expect(ROUTES.comfortHeavyDutyCrates).toBe('/comforting/best-heavy-duty-dog-crates/');
  });

  it('keeps calming collector definition aligned to canonical routes', () => {
    const calming = sectionCollectorDefinitions.calming;

    expect(calming.href).toBe(ROUTES.calmingHub);
    expect(calming.hero.primaryCta.href).toBe(ROUTES.calmingTop);
    expect(calming.hero.secondaryCta.href).toBe(ROUTES.calmingAlternatives);
    expect(calming.converterPriority).toEqual(
      expect.arrayContaining([
        ROUTES.calmingAlternatives,
        ROUTES.calmingLickMats,
        ROUTES.calmingCar,
      ])
    );
  });

  it('keeps comfort collector definition aligned to canonical routes', () => {
    const comfort = sectionCollectorDefinitions.comfort;

    expect(comfort.href).toBe(ROUTES.comfortHub);
    expect(comfort.hero.primaryCta.href).toBe(ROUTES.comfortCalmingBeds);
    expect(comfort.hero.secondaryCta.href).toBe(ROUTES.comfortOrthopedicBeds);
    expect(comfort.converterPriority).toEqual(
      expect.arrayContaining([
        ROUTES.comfortPuppyCrates,
        ROUTES.comfortAnxietyCrates,
        ROUTES.comfortTravelCrates,
        ROUTES.comfortAirlineCrates,
        ROUTES.comfortFurnitureCrates,
        ROUTES.comfortHeavyDutyCrates,
      ])
    );
  });
});
