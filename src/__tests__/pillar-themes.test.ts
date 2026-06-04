import { describe, expect, it } from 'vitest';

import { pillarThemes, resolvePillarThemeFromPath } from '../data/pillar-themes';

describe('pillar themes', () => {
  it('resolves pillar root paths', () => {
    expect(resolvePillarThemeFromPath('/cooling/')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming/')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting/')?.key).toBe('comfort');
  });

  it('resolves nested pillar paths', () => {
    expect(resolvePillarThemeFromPath('/cooling/cooling-mats/')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming/cbd-for-dogs/')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting/best-anxiety-dog-crates/')?.key).toBe('comfort');
  });

  it('normalizes paths without trailing slashes', () => {
    expect(resolvePillarThemeFromPath('/cooling/cooling-mats')?.key).toBe('cooling');
    expect(resolvePillarThemeFromPath('/calming')?.key).toBe('calming');
    expect(resolvePillarThemeFromPath('/comforting')?.key).toBe('comfort');
  });

  it('does not resolve unrelated paths', () => {
    expect(resolvePillarThemeFromPath('/')).toBeUndefined();
    expect(resolvePillarThemeFromPath('/gear/best-dog-gps-trackers/')).toBeUndefined();
    expect(resolvePillarThemeFromPath('/shop/')).toBeUndefined();
  });

  it('keeps comfort on dusty rose instead of sky blue or terracotta', () => {
    expect(pillarThemes.comfort.accent).toBe('hsl(345, 38%, 38%)');
    expect(pillarThemes.comfort.link).toBe('#8c4a52');
  });
});
