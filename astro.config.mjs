import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import robotsTxt from 'astro-robots-txt';

export default defineConfig({
  site: 'https://chill-dogs.com',
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/draft') && !page.includes('/v/'),
      serialize: (item) => {
        if (item.url === 'https://chill-dogs.com/') {
          item.priority = 1.0;
        } else if (
          item.url.includes('/cooling/') ||
          item.url.includes('/calming/')
        ) {
          item.priority = 0.9;
        } else if (
          item.url.includes('/gift-guides/') ||
          item.url.includes('/party-ideas/') ||
          item.url.includes('/luxury-gear/')
        ) {
          item.priority = 0.8;
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
  },
});
