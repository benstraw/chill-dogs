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

/** Longest bullet a pin shows; longer ones are shortened by `shortenPinBullet`. */
export const PIN_BULLET_MAX = 92;

/** Words a shortened bullet must not end on. */
const DANGLING = new Set(['and', 'or', 'with', 'for', 'to', 'the', 'a', 'an', 'of', 'in', 'on', 'at', 'by', 'from', 'so', 'but', 'that', 'while']);

/**
 * Shortens a product bullet for a pin without cutting a word in half.
 * 1. A bullet that fits is kept as written.
 * 2. Otherwise it ends at a clause break, with no ellipsis: a complete phrase. A strong
 *    break (sentence end, semicolon, colon, dash) wins over a comma, and the phrase
 *    must fill at least 40% of the space.
 * 3. Failing that, it ends at the last whole word, minus any dangling joiner such as
 *    "and" or "with", followed by an ellipsis.
 */
export function shortenPinBullet(text: string, max = PIN_BULLET_MAX): string {
  const bullet = text.trim().replace(/\s+/g, ' ');
  if (bullet.length <= max) return bullet;

  // A clause break must leave a real phrase: at least 40% of the space.
  const head = bullet.slice(0, max);
  const minEnd = Math.round(max * 0.4);
  const lastBreak = (re: RegExp) =>
    [...head.matchAll(re)].map((m) => m.index ?? 0).filter((i) => i >= minEnd).pop();
  // Strong breaks (sentence end, semicolon, colon, dash) beat a comma, which may sit
  // inside a list ("fits in any bag, suitcase…").
  const clauseEnd = lastBreak(/[.;:]\s|\s[—–-]\s/g) ?? lastBreak(/,\s/g);
  if (clauseEnd !== undefined) return trimDangling(bullet.slice(0, clauseEnd));

  const words = bullet.slice(0, max - 1).split(' ');
  if (bullet[max - 1] !== ' ') words.pop(); // drop the word the limit cut through
  return `${trimDangling(words.join(' '))}…`;
}

function trimDangling(text: string): string {
  const words = text.replace(/[\s,;:—–-]+$/, '').split(' ');
  while (words.length > 1 && DANGLING.has(words[words.length - 1].toLowerCase())) words.pop();
  return words.join(' ').replace(/[\s,;:—–-]+$/, '');
}
