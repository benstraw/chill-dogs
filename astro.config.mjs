import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

import { isExcludedFromDiscovery } from './src/data/discovery-exclusions.ts';

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
  },
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !isExcludedFromDiscovery(page),
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
