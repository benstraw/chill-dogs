import { describe, expect, it } from 'vitest';

import { pinLayoutProblems, pinWords } from '../scripts/og-gen/pin-layout';

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

  it('flags text pushed off the bottom of the pin', () => {
    const svg = `<svg>${word('COMFORTABLE', 400, 200, 1530)}</svg>`;
    expect(pinLayoutProblems(svg)).toEqual(['text below the bottom of the pin: "COMFORTABLE"']);
  });
});
