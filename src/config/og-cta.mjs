/**
 * The button line on generated share (OG) images.
 *
 * A page's button says what the visitor will find there: a guide for articles,
 * picks for converters and pillar landing pages, and no button at all for utility
 * pages (search, subscribe, thanks) where any promise would be false.
 */

export const PAGE_TYPE_CTA = {
  converter: 'Shop Top Picks Now',
  collector: 'See Top Product Picks',
  attractor: 'Get the Best Picks Fast',
  informer: 'Read Full Details',
};

/** MDX articles: they are guides first; their product picks sit inside the story. */
export const ARTICLE_CTA = 'Read the Guide';

/** Pillar landing pages: they route to the pillar's converters. */
export const PILLAR_CTA = {
  '/cooling/': 'Browse Cooling Picks',
  '/calming/': 'Browse Calming Picks',
  '/comforting/': 'Browse Comfort Picks',
  '/gear/': 'Browse Gear Picks',
  '/travel/': 'Browse Travel Guides',
  '/safety/': 'Browse Safety Guides',
};

/** Pages with nothing to promise: the share image shows the headline only. */
export const NO_CTA_ROUTES = new Set([
  '/articles/',
  '/search/',
  '/shelter-dog-charities/',
  '/shop/',
  '/subscribe/',
  '/subscribe/confirmed/',
  '/subscribe/thanks/',
]);

function clamp(text, maxChars) {
  const normalized = text.replace(/\s+/g, ' ').trim();
  if (normalized.length <= maxChars) return normalized;
  const cut = normalized.slice(0, maxChars - 1);
  const space = cut.lastIndexOf(' ');
  return `${(space >= Math.floor(maxChars * 0.6) ? cut.slice(0, space) : cut).trimEnd()}…`;
}

/**
 * The button text for one page, or '' for no button.
 * An explicit `ogCta` (article frontmatter or a route override) always wins.
 */
export function ogCtaFor({ pathname = '', pageType, isArticle = false, ogCta } = {}) {
  if (ogCta) return clamp(ogCta, 44);
  if (NO_CTA_ROUTES.has(pathname)) return '';
  if (isArticle) return ARTICLE_CTA;
  if (PILLAR_CTA[pathname]) return PILLAR_CTA[pathname];
  return PAGE_TYPE_CTA[pageType] || PAGE_TYPE_CTA.collector;
}
