import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://www.chill-dogs.com',
  trailingSlash: 'ignore',
  redirects: {
    '/travel/rhys-road-trip-chill-kit/': '/travel/dog-road-trip-gear/',
    '/travel/rhys-road-trip-chill-kit': '/travel/dog-road-trip-gear/',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft') && !page.includes('/v/') && !page.includes('/admin/'),
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
