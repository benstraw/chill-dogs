import type { Allowlist } from '../helpers/ratchet';

/**
 * Ratchet allowlists for content-guardrails.test.ts: violations that shipped before the
 * rule was enforced. Remove entries as they are fixed; never add new ones.
 */

export const VET_LANGUAGE_ALLOWLIST: Allowlist = {
  'src/utils/product-meta.ts :: vet-approved': 'Quoted in a comment listing the banned phrases.',
};

/** Literal internal hrefs that predate the rule. Fix by importing from ROUTES. */
export const HARDCODED_ROUTE_ALLOWLIST: Allowlist = {
  'src/content/articles/comforting-how-much-do-dogs-sleep.mdx :: /comforting/best-calming-dog-beds/': 'pre-existing',
  'src/content/articles/comforting-how-much-do-dogs-sleep.mdx :: /comforting/best-orthopedic-dog-beds/': 'pre-existing',
  'src/content/articles/cooling-keep-dog-cool-in-car.mdx :: /cooling/cooling-bandanas/': 'pre-existing',
  'src/content/articles/cooling-keep-dog-cool-in-car.mdx :: /cooling/cooling-vests/': 'pre-existing',
  'src/content/articles/cooling-keep-dog-cool-in-car.mdx :: /travel/dog-road-trip-gear/': 'pre-existing',
  'src/content/articles/safety-what-to-do-if-your-dog-runs-away.mdx :: /gear/best-dog-gps-trackers/': 'pre-existing',
  'src/content/articles/safety-what-to-do-if-your-dog-runs-away.mdx :: /gear/fi-dog-collar-review/': 'pre-existing',
  'src/content/articles/safety-what-to-do-if-your-dog-runs-away.mdx :: /gear/garmin-dog-tracking-collars/': 'pre-existing',
  'src/content/articles/safety-what-to-do-if-your-dog-runs-away.mdx :: /travel/rhys-ran-away-cerro-san-luis-obispo/': 'pre-existing',
  'src/content/articles/travel-dog-friendly-airlines.mdx :: /travel/dog-road-trip-gear/': 'pre-existing',
  'src/content/articles/travel-dog-friendly-airlines.mdx :: /travel/how-to-fly-with-a-dog/': 'pre-existing',
  'src/content/articles/travel-dog-road-trip-gear.mdx :: /calming/car-anxiety-for-dogs/': 'pre-existing',
  'src/content/articles/travel-dog-road-trip-gear.mdx :: /cooling/car-cooling-for-dogs/': 'pre-existing',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: /calming/best-calming-products-for-anxious-dogs/': 'pre-existing',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: /calming/best-thundershirt-alternatives/': 'pre-existing',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: /calming/car-anxiety-for-dogs/': 'pre-existing',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: /comforting/best-airline-approved-dog-carriers/': 'pre-existing',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: /comforting/best-dog-travel-bags-for-flying/': 'pre-existing',
  'src/content/articles/travel-rhys-ran-away-cerro-san-luis-obispo.mdx :: /gear/airtag-for-dogs/': 'pre-existing',
  'src/content/articles/travel-rhys-ran-away-cerro-san-luis-obispo.mdx :: /gear/best-dog-gps-trackers/': 'pre-existing',
  'src/content/articles/travel-rhys-ran-away-cerro-san-luis-obispo.mdx :: /gear/fi-dog-collar-review/': 'pre-existing',
  'src/content/articles/travel-rhys-ran-away-cerro-san-luis-obispo.mdx :: /gear/garmin-dog-tracking-collars/': 'pre-existing',
  'src/content/articles/travel-rhys-ran-away-cerro-san-luis-obispo.mdx :: /safety/what-to-do-if-your-dog-runs-away/': 'pre-existing',
  'src/data/calming-converter-pages.ts :: /calming/best-calming-products-for-anxious-dogs/': 'pre-existing',
  'src/data/calming-converter-pages.ts :: /calming/best-thundershirt-alternatives/': 'pre-existing',
  'src/data/calming-converter-pages.ts :: /gear/best-dog-gps-trackers/': 'pre-existing',
  'src/data/product-page-map.ts :: /calming/crate-training-for-dogs/': 'pre-existing',
  'src/data/product-page-map.ts :: /cooling/keep-dog-cool-in-car/': 'pre-existing',
  'src/data/product-page-map.ts :: /gear/best-dog-gps-trackers/': 'pre-existing',
  'src/data/product-page-map.ts :: /gear/fi-dog-collar-review/': 'pre-existing',
  'src/data/product-page-map.ts :: /gear/garmin-dog-tracking-collars/': 'pre-existing',
  'src/data/product-page-map.ts :: /travel/dog-road-trip-gear/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /calming/best-calming-products-for-anxious-dogs/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /calming/best-thundershirt-alternatives/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /cooling/cooling-bandanas/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /cooling/cooling-mats/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /cooling/cooling-vests/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /cooling/freezable-dog-toys/': 'pre-existing',
  'src/pages/cooling/best-cooling-products-for-dogs.astro :: /travel/dog-road-trip-gear/': 'pre-existing',
};

/** "hub" in code and docs. ROUTES keys by name; other uses by file. */
export const HUB_TOKEN_ALLOWLIST: Allowlist = {
  coolingHub: 'ROUTES key for a pillar collector; renaming touches every caller.',
  calmingHub: 'ROUTES key for a pillar collector; renaming touches every caller.',
  comfortHub: 'ROUTES key for a pillar collector; renaming touches every caller.',
  gearHub: 'ROUTES key for a pillar collector; renaming touches every caller.',
  'src/content/articles/travel-how-to-fly-with-a-dog.mdx :: hubs': 'Airline hubs (airports), not page-type naming.',
  'src/styles/utilities.css :: hub': 'Legacy .hub-* CSS classes on collector pages.',
  'docs/engineering/architecture.md :: hub': '"collector hub grids" wording in the grid notes.',
};

/** Pages that render product images beside affiliate links without the card primitives. */
export const CARD_PRIMITIVE_ALLOWLIST: Allowlist = {
  'src/pages/gear/airtag-for-dogs.astro': 'Hand-rolled product frames from before the primitives existed.',
  'src/pages/gear/fi-dog-collar-review.astro': 'Hand-rolled product frames from before the primitives existed.',
  'src/pages/shelter-dog-charities.astro': 'Charity logos beside Amazon wishlist links, not product cards; review.',
};
