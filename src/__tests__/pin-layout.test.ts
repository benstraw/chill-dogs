import { describe, expect, it } from 'vitest';

import { PIN_BULLET_MAX, pinLayoutProblems, pinWords, shortenPinBullet } from '../scripts/og-gen/pin-layout';

// Hand-written stand-ins for satori's `embedFont: false` output: one <text> per word.
const word = (text: string, x: number, width: number, y: number) =>
  `<text x="${x}" y="${y}" width="${width}" height="40" font-size="34" fill="#fff">${text}</text>`;

describe('pin layout check (run by pins:gen)', () => {
  it('reads each word with its right edge and baseline', () => {
    expect(pinWords(`<svg>${word('details', 509, 114, 1290)}</svg>`)).toEqual([
      { text: 'details', right: 623, baseline: 1290 },
    ]);
  });

  it('passes a pin whose button sits clear of the corner', () => {
    const svg = `<svg>${word('See', 380, 60, 1290)}${word('details', 509, 114, 1290)}${word('Chill', 400, 90, 1433)}</svg>`;
    expect(pinLayoutProblems(svg)).toEqual([]);
  });

  it("flags a word under Pinterest's corner buttons (the old footer pill)", () => {
    const svg = `<svg>${word('See', 700, 60, 1426)}${word('details', 790, 114, 1426)}</svg>`;
    expect(pinLayoutProblems(svg)).toEqual([`text under Pinterest's corner buttons: "details"`]);
  });

  it('passes a footer tagline in its normal place', () => {
    expect(pinLayoutProblems(`<svg>${word('COMFORTABLE', 400, 200, 1465)}</svg>`)).toEqual([]);
  });

  it('flags a footer pushed down by long copy, even while still on the pin', () => {
    const svg = `<svg>${word('COMFORTABLE', 400, 200, 1496)}</svg>`;
    expect(pinLayoutProblems(svg)).toEqual(['footer pushed down or off the pin: "COMFORTABLE"']);
  });

  it('flags text pushed off the bottom of the pin', () => {
    expect(pinLayoutProblems(`<svg>${word('COMFORTABLE', 400, 200, 1530)}</svg>`)).toHaveLength(1);
  });
});

describe('shortenPinBullet', () => {
  it('keeps a bullet that fits, as written', () => {
    expect(shortenPinBullet('Real-time escape alerts and geofence zones')).toBe('Real-time escape alerts and geofence zones');
  });

  it('ends a long bullet at a clause break, with no ellipsis', () => {
    expect(
      shortenPinBullet('Versatile design allows you to wear it on your front or back, providing maximum convenience for owners on long hikes'),
    ).toBe('Versatile design allows you to wear it on your front or back');
  });

  it('prefers a dash or sentence break over a comma inside a list', () => {
    expect(
      shortenPinBullet('Sleeping-bag style packs down to near water-bottle size — fits in any bag, suitcase, or car door pocket'),
    ).toBe('Sleeping-bag style packs down to near water-bottle size');
  });

  it('otherwise ends on a whole word, never mid-word, and drops a dangling joiner', () => {
    const out = shortenPinBullet(
      'Durable buckles and sturdy straps make it ready for any adventure ensuring reliable support for heavier dogs every single day',
    );
    expect(out).toBe('Durable buckles and sturdy straps make it ready for any adventure ensuring reliable support…');
    expect(out.length).toBeLessThanOrEqual(PIN_BULLET_MAX);
  });

  it('never leaves a partial word before the ellipsis', () => {
    const long = 'Pressure activated cooling gel pad that recharges automatically between naps without any water electricity refrigeration';
    const out = shortenPinBullet(long);
    const lastWord = out.replace(/…$/, '').split(' ').pop()!;
    expect(long.split(' ')).toContain(lastWord);
  });
});
