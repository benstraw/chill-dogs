/**
 * Layout checks for generated product pins, run by `bun run pins:gen` on every pin it
 * renders (only when pins are made, never in the normal test run).
 *
 * The pin is rendered a second time with `embedFont: false`, so satori writes each word
 * as a <text> element with its position and width instead of glyph paths. That makes
 * two checks cheap: no word inside the corner where Pinterest draws its own buttons, and
 * no word pushed below the footer's normal place (a clipped footer).
 */
import { PIN_HEIGHT, PINTEREST_BUTTON_ZONE } from './pin-template';

/** Lowest baseline any word may have: the footer tagline's, when nothing pushes it down. */
export const PIN_FOOTER_LOWEST_BASELINE = PIN_HEIGHT - 30;

export interface PinWord {
  text: string;
  /** Right edge, x + width. */
  right: number;
  /** Baseline y. */
  baseline: number;
}

/** One entry per <text> satori emitted (it writes one per word). */
export function pinWords(svg: string): PinWord[] {
  return [...svg.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/g)].map((m) => {
    const num = (name: string) => Number(m[1].match(new RegExp(`\\s${name}="([\\d.]+)"`))?.[1] ?? 0);
    return { text: m[2].trim(), right: num('x') + num('width'), baseline: num('y') };
  });
}

/** Problems with a rendered pin's layout, as readable messages; empty when it is fine. */
export function pinLayoutProblems(svg: string): string[] {
  const words = pinWords(svg).filter((w) => w.text);
  const problems: string[] = [];
  const covered = words.filter((w) => w.right > PINTEREST_BUTTON_ZONE.left && w.baseline > PINTEREST_BUTTON_ZONE.top);
  if (covered.length) {
    problems.push(`text under Pinterest's corner buttons: ${covered.map((w) => `"${w.text}"`).join(', ')}`);
  }
  // The footer tagline sits 35px above the bottom edge when everything fits. Any word
  // lower than that means the content pushed the footer down and clipped it.
  const pushed = words.filter((w) => w.baseline > PIN_FOOTER_LOWEST_BASELINE);
  if (pushed.length) {
    problems.push(`footer pushed down or off the pin: ${pushed.map((w) => `"${w.text}"`).join(', ')}`);
  }
  return problems;
}
