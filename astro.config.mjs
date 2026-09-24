import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

import { isExcludedFromDiscovery } from './src/data/discovery-exclusions.ts';
import { noindexProductPaths } from './src/data/product-indexing.ts';

// A noindex page has no business in the sitemap: submitting a URL while telling
// crawlers not to index it is an error in Search Console, not a warning.
const NOINDEX_PATHS = noindexProductPaths();

export default defineConfig({
  site: 'https://www.chill-dogs.com',
  trailingSlash: 'ignore',
  redirects: {
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
    // The page dropped "for flea season" from its name — it's just Dog Bath Tools now.
    // Live for weeks under the old slug, so this must be a real 301.
    '/safety/dog-bath-tools-for-flea-season/': '/safety/dog-bath-tools/',
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !isExcludedFromDiscovery(page) && !NOINDEX_PATHS.has(new URL(page).pathname),
      serialize: (item) => {
        if (item.url === 'https://www.chill-dogs.com/') {
          item.priority = 1.0;
        } else if (
          item.url.includes('/cooling/') ||
          item.url.includes('/calming/')
        ) {
          item.priority = 0.9;
        } else {
          item.priority = 0.6;
        }
        return item;
      },
    }),
    robotsTxt(),
  ],
  build: {
    assets: '_assets',
    inlineStylesheets: 'always',
  },
});
