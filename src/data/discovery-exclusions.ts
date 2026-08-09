/**
 * Path fragments that keep a route out of every public discovery surface.
 *
 * Consumed by the XML sitemap filter (`astro.config.mjs`) and by `llms.txt`
 * (`src/pages/llms.txt.ts`) so the two surfaces cannot drift apart. Anything
 * added here disappears from both at once.
 */
export const EXCLUDED_DISCOVERY_FRAGMENTS = [
  '/draft',
  '/v/',
  '/admin/',
  '/content-sitemap/',
  '/privacy-policy/',
  '/terms/',
  '/subscribe/',
] as const;

export function isExcludedFromDiscovery(pathOrUrl: string): boolean {
  return EXCLUDED_DISCOVERY_FRAGMENTS.some((fragment) => pathOrUrl.includes(fragment));
}
