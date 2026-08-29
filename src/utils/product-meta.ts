/**
 * Titles, descriptions, and the indexing gate for `/shop/<id>/` detail pages.
 *
 * These pages are generated for all 214 catalog products, so their meta cannot be
 * hand-written. `src/__tests__/seo-meta.test.ts` enforces og:title 40–65 chars and
 * og:description 100–165 chars on every indexable page, which means a single product
 * with an awkward name can fail the whole build. Everything here is deterministic and
 * covered by `src/__tests__/product-meta.test.ts` over the entire catalog, so a new
 * product fails a fast unit test rather than a dist-scanning one.
 *
 * Length is measured **after HTML escaping**, because that test reads the raw attribute
 * value out of the built HTML. "K&H Cool Bed III" is 16 characters of source and 20 in
 * an attribute — 35 catalog names are affected, so ignoring this silently overshoots.
 */

import { clampOgText } from './og';

const OG_TITLE_MIN = 40;
const OG_TITLE_MAX = 65;
const OG_DESC_MIN = 100;
const OG_DESC_MAX = 165;

/** Minimum editorial copy before a product page is worth putting in the index. */
const MIN_BULLETS = 2;
const MIN_BULLET_CHARS = 120;

export interface ProductMetaSource {
  readonly id: string;
  readonly name: string;
  readonly pillar: string;
  readonly category: string;
  readonly bullets: readonly string[];
}

const PILLAR_LABELS: Record<string, string> = {
  cooling: 'Cooling',
  calming: 'Calming',
  comfort: 'Comfort',
  gear: 'Gear',
  safety: 'Safety',
};

/**
 * Readable category phrases. Slugs like `off-grid` or `bath-tool` title-case into
 * something unreadable ("Off Grid", "Bath Tool"), so the ones that need help are named.
 */
const CATEGORY_LABELS: Record<string, string> = {
  'car-cooling': 'Car Cooling',
  'cooling-bandanas': 'Cooling Bandanas',
  'cooling-mats': 'Cooling Mats',
  'cooling-vests': 'Cooling Vests',
  'freezable-dog-toys': 'Freezable Toys',
  hydration: 'Dog Hydration',
  'anxiety-wraps': 'Anxiety Wraps',
  'calming-treats': 'Calming Treats',
  'lick-mats': 'Lick Mats',
  'snuffle-mats': 'Snuffle Mats',
  'calming-beds': 'Calming Beds',
  carriers: 'Dog Carriers',
  crates: 'Dog Crates',
  'orthopedic-beds': 'Orthopedic Beds',
  'travel-bags': 'Travel Bags',
  'travel-beds': 'Travel Beds',
  accessories: 'Tracker Accessories',
  bluetooth: 'Bluetooth Trackers',
  carry: 'Carry Gear',
  cellular: 'GPS Trackers',
  'first-aid': 'First Aid',
  muzzle: 'Dog Muzzles',
  'off-grid': 'Off-Grid Trackers',
  prevention: 'Prevention Gear',
  stretcher: 'Dog Stretchers',
  'warmth-control': 'Warmth and Control',
  'bath-tool': 'Bath Tools',
  'grooming-tool': 'Grooming Tools',
  'natural-chew': 'Natural Chews',
  'natural-collar': 'Natural Collars',
  'natural-shampoo': 'Natural Shampoo',
  'natural-spray': 'Natural Sprays',
  'natural-tag': 'Natural Tags',
  'tick-remover': 'Tick Removers',
};

export function pillarLabel(pillar: string): string {
  return PILLAR_LABELS[pillar] ?? 'Dog Gear';
}

export function categoryLabel(category: string): string {
  return (
    CATEGORY_LABELS[category] ??
    category
      .split('-')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ')
  );
}

/**
 * Length of a string once Astro has escaped it into an HTML attribute value.
 * Mirrors Astro's escaping: `&`, `<`, `>`, `"`, `'`.
 */
export function htmlAttrLength(value: string): number {
  const escaped = value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  return escaped.length;
}

/**
 * Trim to fit a budget expressed in *escaped* characters.
 *
 * `clampOgText` counts source characters, so a name full of `&` would still overflow
 * the attribute. Shrink the budget by the escaping overhead and let clampOgText do the
 * word-boundary work.
 */
function clampToAttrLength(text: string, maxAttrChars: number): string {
  if (htmlAttrLength(text) <= maxAttrChars) return text;

  let budget = maxAttrChars;
  let result = clampOgText(text, budget);

  // Each pass removes at least one character, so this terminates.
  while (htmlAttrLength(result) > maxAttrChars && budget > 1) {
    budget -= htmlAttrLength(result) - maxAttrChars;
    result = clampOgText(text, Math.max(1, budget));
  }

  return result;
}

/**
 * og:title — 40–65 escaped characters.
 *
 * Starts from the product name and appends qualifiers only while they fit, stopping as
 * soon as the minimum is met. Long names get clamped instead; short ones ("Fi Mini",
 * 7 chars) pick up enough context to clear 40.
 */
export function productOgTitle(product: ProductMetaSource, distinguisher?: string): string {
  const base = distinguisher ? `${product.name} (${distinguisher})` : product.name;
  const name = clampToAttrLength(base, OG_TITLE_MAX);

  const qualifiers = [
    ` — ${categoryLabel(product.category)}`,
    ' for Dogs',
    ' | Chill-Dogs',
  ];

  let title = name;
  for (const qualifier of qualifiers) {
    if (htmlAttrLength(title) >= OG_TITLE_MIN && htmlAttrLength(title + qualifier) > OG_TITLE_MAX) {
      break;
    }
    if (htmlAttrLength(title + qualifier) <= OG_TITLE_MAX) {
      title += qualifier;
    }
  }

  // Nothing fit and the name is still short — pad with the pillar rather than ship a
  // title under the floor. Only reachable for very short names with long category labels.
  if (htmlAttrLength(title) < OG_TITLE_MIN) {
    const padding = ` — ${pillarLabel(product.pillar)} Gear for Dogs | Chill-Dogs`;
    title = clampToAttrLength(name + padding, OG_TITLE_MAX);
  }

  return title;
}

/**
 * Titles for a whole catalog, with duplicates resolved.
 *
 * Two different products can carry the same `name` — `compact-dog-first-aid-travel-pack`
 * and `dog-first-aid-essential-pack` are both "Rubyloo Dog First Aid Kit". Identical
 * og:titles make two of our own pages compete for the same result, so the colliding ones
 * get a distinguishing phrase built from the words their ids do not share with the name.
 *
 * Titles are resolved together rather than per product because a collision is a property
 * of the set, not of either product on its own.
 */
export function productOgTitleMap(
  products: readonly ProductMetaSource[]
): Map<string, string> {
  const titles = new Map<string, string>();
  const byTitle = new Map<string, ProductMetaSource[]>();

  for (const product of products) {
    const title = productOgTitle(product);
    titles.set(product.id, title);
    byTitle.set(title, [...(byTitle.get(title) ?? []), product]);
  }

  for (const [, colliding] of byTitle) {
    if (colliding.length < 2) continue;

    for (const product of colliding) {
      titles.set(product.id, productOgTitle(product, distinguisherFor(product)));
    }
  }

  return titles;
}

/** Words in the id that the name does not already say, e.g. "Compact Travel Pack". */
function distinguisherFor(product: ProductMetaSource): string {
  const nameWords = new Set(product.name.toLowerCase().match(/[a-z0-9]+/g) ?? []);
  const extra = product.id
    .split('-')
    .filter((word) => !nameWords.has(word))
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  // Every word of the id is already in the name — fall back to the id itself so the
  // titles still differ rather than silently staying identical.
  return extra.length > 0 ? extra.join(' ') : product.id;
}

/**
 * og:description — 100–165 escaped characters.
 *
 * Built from the product's own bullets so each page describes its own product. Thin
 * products get a factual tail rather than an invented claim; wording follows the
 * content guardrails (researched / compared / curated, never "vet-approved").
 */
export function productOgDescription(product: ProductMetaSource): string {
  const bullets = product.bullets.map((bullet) => bullet.trim()).filter(Boolean);

  const sentences = bullets.map((bullet) => (/[.!?]$/.test(bullet) ? bullet : `${bullet}.`));

  // Prefer as many whole sentences as fit. Clamping the joined string instead would end
  // most descriptions mid-word ("fill once and it stays…"), which reads worse in a search
  // result than simply stopping a sentence early.
  let description = '';
  for (const sentence of sentences) {
    const candidate = description ? `${description} ${sentence}` : sentence;
    if (htmlAttrLength(candidate) > OG_DESC_MAX) break;
    description = candidate;
  }

  // No single sentence fit — fall back to the joined text and let the clamp handle it.
  if (!description) {
    description = sentences.join(' ');
  }

  if (htmlAttrLength(description) < OG_DESC_MIN) {
    const tail =
      ` ${product.name} is one of the ${categoryLabel(product.category).toLowerCase()}` +
      ` picks we researched and compared for ${pillarLabel(product.pillar).toLowerCase()}.`;
    description = `${description}${tail}`.trim();
  }

  // Still short (a product with almost no copy at all) — these are the ones the gate
  // below sends to noindex anyway, but the string must stay valid regardless.
  if (htmlAttrLength(description) < OG_DESC_MIN) {
    description =
      `${description} Compare current pricing and availability before you buy.`.trim();
  }

  return clampToAttrLength(description, OG_DESC_MAX);
}

/**
 * Whether a product page is worth indexing.
 *
 * 214 near-empty pages would read to Google as thin content and can drag down the whole
 * set, so products below this bar still build — direct Pinterest links and internal
 * navigation keep working — but carry `noindex`. `noindex` also exempts them from the
 * meta-length and llms.txt coverage tests, so this doubles as the escape hatch for
 * products whose copy is not written yet. Fill the copy in and the page joins the index.
 */
export function isIndexableProduct(product: ProductMetaSource): boolean {
  const bullets = product.bullets.map((bullet) => bullet.trim()).filter(Boolean);
  return bullets.length >= MIN_BULLETS && bullets.join(' ').length >= MIN_BULLET_CHARS;
}

export const PRODUCT_META_LIMITS = {
  OG_TITLE_MIN,
  OG_TITLE_MAX,
  OG_DESC_MIN,
  OG_DESC_MAX,
  MIN_BULLETS,
  MIN_BULLET_CHARS,
} as const;
