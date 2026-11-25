/**
 * Redirects for retired or alias URLs, used by astro.config.mjs (dev, preview and the
 * static redirect stubs). Production serves the same rules from vercel.json; the two
 * must match, and docs/system-definition.yaml lists them all. Enforced by
 * src/__tests__/product-slugs.test.ts and system-definition.test.ts.
 *
 * Kept here, not inline in astro.config.mjs, so tests can read the rules without
 * importing the whole Astro config (about 1 s per test file).
 */
export const redirects: Record<string, string | { status: 301 | 302 | 307 | 308; destination: string }> = {
  '/join': {
    status: 302,
    destination: 'https://www.chill-dogs.com/subscribe/?utm_source=postcard&utm_medium=print&utm_campaign=offline_flyer',
  },
  '/travel/rhys-road-trip-chill-kit/': '/travel/dog-road-trip-gear/',
  // Merged into the single flea/tick converter; natural products now live there,
  // marked with the plant-based treatment. Live for weeks, so this must be a 301.
  '/safety/best-natural-flea-and-tick-products-for-dogs/': '/safety/best-flea-and-tick-products-for-dogs/',
  // Retired per #370 — no direct replacement, so this sends prior visitors to the
  // kits section where the remaining five multi-tool kits still live.
  '/shop/sztopfocus-11-piece-grooming-kit/': '/safety/dog-bath-tools/#bath-kits',
  // Retired per #375 (and the April exclusion of both INVENHO beds in #138); these
  // were only ever featured on the orthopedic beds converter.
  '/shop/invenho-orthopedic-couch-bed/': '/comforting/best-orthopedic-dog-beds/',
  '/shop/bedsure-comfyfleece-orthopedic/': '/comforting/best-orthopedic-dog-beds/',
  '/shop/invenho-orthopedic-bed/': '/comforting/best-orthopedic-dog-beds/',
  '/shop/cwawz-orthopedic-bolster/': '/comforting/best-orthopedic-dog-beds/',
  // Retired per #395 — the Carolina Pet Comfy Cup was on the orthopedic beds converter.
  '/shop/carolina-pet-bolster-lg/': '/comforting/best-orthopedic-dog-beds/',
  // The page dropped "for flea season" from its name — it's just Dog Bath Tools now.
  // Live for weeks under the old slug, so this must be a real 301.
  '/safety/dog-bath-tools-for-flea-season/': '/safety/dog-bath-tools/',
  // Wrong URLs in the sent "The Day Rhys Ran Off" newsletter (2026-04-29). These
  // paths never existed; the redirects make the links in inboxes and the public
  // Buttondown archive land on the right pages.
  '/comforting/best-gps-trackers-for-dogs/': '/gear/best-dog-gps-trackers/',
  '/comforting/what-to-do-if-your-dog-runs-away/': '/safety/what-to-do-if-your-dog-runs-away/',
  '/comforting/fi-series-3-dog-collar-review/': '/gear/fi-dog-collar-review/',
  '/comforting/garmin-dog-tracking-systems/': '/gear/garmin-dog-tracking-collars/',
  '/comforting/apple-airtag-for-dogs/': '/gear/airtag-for-dogs/',
  // Duplicate /shop/ page for the OHMO bowl (B0C9TX38RZ). The car-cooling card now
  // shares the hydration record's page (shopPageId in src/data/cooling-products.ts).
  '/shop/ohmo-spill-proof-bowl/': '/shop/ohmo-spill-proof-dog-bowl/',
};
