import { describe, expect, it } from 'vitest';

import { pillarThemes, resolvePillarThemeFromPath } from '../data/pillar-themes';

describe('pillar themes', () => {
  it('resolves pillar root paths', () => {
    expect(resolvePillarThemeFromPath('/cooling/')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming/')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting/')?.key).toBe('comfort');
    expect(resolvePillarThemeFromPath('/gear/')?.key).toBe('gear');
  });

  it('resolves nested pillar paths', () => {
    expect(resolvePillarThemeFromPath('/cooling/cooling-mats/')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming/cbd-for-dogs/')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting/best-anxiety-dog-crates/')?.key).toBe('comfort');
    expect(resolvePillarThemeFromPath('/gear/best-dog-gps-trackers/')?.key).toBe('gear');
  });

  it('resolves travel and safety paths to the gear pillar', () => {
    expect(resolvePillarThemeFromPath('/travel/dog-road-trip-gear/')?.key).toBe('gear');
    expect(resolvePillarThemeFromPath('/safety/what-to-do-if-your-dog-runs-away/')?.key).toBe('gear');
  });

  it('normalizes paths without trailing slashes', () => {
    expect(resolvePillarThemeFromPath('/cooling/cooling-mats')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting')?.key).toBe('comfort');
  });

  it('does not resolve unrelated paths', () => {
    expect(resolvePillarThemeFromPath('/')).toBeUndefined();
    expect(resolvePillarThemeFromPath('/shop/')).toBeUndefined();
    expect(resolvePillarThemeFromPath('/articles/')).toBeUndefined();
  });

  it('keeps comfort on dusty rose instead of sky blue or terracotta', () => {
    expect(pillarThemes.comfort.accent).toBe('hsl(345, 38%, 38%)');
    expect(pillarThemes.comfort.link).toBe('#8c4a52');
  });

  it('keeps gear on violet instead of grey', () => {
    expect(pillarThemes.gear.accent).toBe('hsl(262, 45%, 38%)');
    expect(pillarThemes.gear.link).toBe('#5b3d8c');
  });
});
