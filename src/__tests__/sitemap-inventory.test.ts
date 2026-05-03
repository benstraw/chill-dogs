import { describe, expect, it, vi } from 'vitest';

const articleEntries = [
  createArticle('/travel/dog-road-trip-gear/', 'Dog Road Trip Gear', '2026-03-31', {
    topics: ['travel', 'road-trips'],
    pinnedRelated: ['/cooling/car-cooling-for-dogs/'],
    excludeRelated: ['/privacy-policy/'],
    relatedLabel: 'Dog Road Trip Gear',
  }),
  createArticle('/travel/rhys-ran-away-cerro-san-luis-obispo/', 'The Day Rhys Ran Off', '2026-03-21'),
  createArticle('/travel/how-to-fly-with-a-dog/', 'How to Fly With a Dog', '2026-04-10'),
  createArticle('/cooling/how-hot-is-too-hot-for-dogs/', 'How Hot Is Too Hot for Dogs?', '2026-03-10'),
  createArticle('/cooling/keep-dog-cool-in-car/', 'How to Keep a Dog Cool in a Car', '2026-03-17'),
  createArticle('/safety/what-to-do-if-your-dog-runs-away/', 'What to Do If Your Dog Runs Away', '2026-04-03'),
  createArticle('/comforting/how-much-do-dogs-sleep/', 'How Much Do Dogs Sleep?', '2026-03-24'),
  createArticle('/calming/crate-training-for-dogs/', 'How to Crate Train Your Dog', '2026-04-09'),
  createArticle(
    '/calming/how-to-prepare-a-calm-room-for-fireworks-night/',
    'How to Prepare a Calm Room for Fireworks Night',
    '2026-04-12'
  ),
];

vi.mock('astro:content', () => ({
  getCollection: vi.fn(async () => articleEntries),
}));

import {
  getArticleSitemapSection,
  getCompleteSitemapPages,
  getCompleteSitemapSections,
} from '../data/sitemap-inventory';

function createArticle(
  canonicalPath: string,
  title: string,
  pubDate: string,
  metadata: {
    topics?: string[];
    pinnedRelated?: string[];
    excludeRelated?: string[];
    relatedLabel?: string;
  } = {}
) {
  return {
    id: canonicalPath,
    slug: canonicalPath,
    body: '',
    collection: 'articles',
    data: {
      title,
      description: `${title} description`,
      pubDate: new Date(pubDate),
      canonicalPath,
      ...metadata,
    },
  };
}

describe('sitemap inventory', () => {
  it('builds an article sitemap section from collection frontmatter', async () => {
    const section = await getArticleSitemapSection();

    expect(section.title).toBe('Articles (from collection)');
    expect(section.pages.map((page) => page.href)).toEqual([
      '/calming/how-to-prepare-a-calm-room-for-fireworks-night/',
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/travel/dog-road-trip-gear/',
      '/comforting/how-much-do-dogs-sleep/',
      '/travel/rhys-ran-away-cerro-san-luis-obispo/',
      '/cooling/keep-dog-cool-in-car/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);

    for (const page of section.pages) {
      expect(page.pageType).toBe('collector');
      expect(page.collectorSubtype).toBe('article');
      expect(page.href).toMatch(/^\//);
      expect(page.preview.title).toBeTruthy();
      expect(page.preview.description).toBeTruthy();
      expect(page.preview.image).toBeTruthy();
    }
  });

  it('includes all current article canonical paths in the complete sitemap', async () => {
    const pages = await getCompleteSitemapPages();
    const hrefs = pages.map((page) => page.href);

    expect(hrefs).toEqual(expect.arrayContaining(articleEntries.map((entry) => entry.data.canonicalPath)));
  });

  it('passes article related metadata from frontmatter into sitemap pages', async () => {
    const pages = await getCompleteSitemapPages();
    const roadTrip = pages.find((page) => page.href === '/travel/dog-road-trip-gear/');

    expect(roadTrip?.topics).toEqual(['travel', 'road-trips']);
    expect(roadTrip?.pinnedRelated).toEqual(['/cooling/car-cooling-for-dogs/']);
    expect(roadTrip?.excludeRelated).toEqual(['/privacy-policy/']);
    expect(roadTrip?.relatedLabel).toBe('Dog Road Trip Gear');
  });

  it('places article collectors after entry points and before remaining static sections', async () => {
    const sections = await getCompleteSitemapSections();

    expect(sections[0]?.title).toBe('Entry Points');
    expect(sections[1]?.title).toBe('Articles (from collection)');
    expect(sections[2]?.title).toBe('Cooling Converters');
  });

  it('does not emit duplicate hrefs in the complete sitemap', async () => {
    const pages = await getCompleteSitemapPages();
    const hrefs = pages.map((page) => page.href);
    const uniqueHrefs = new Set(hrefs);

    expect(uniqueHrefs.size).toBe(hrefs.length);
  });
});
