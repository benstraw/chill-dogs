import { describe, expect, it } from 'vitest';

import type { SitemapPage, SitemapSection, SitemapTopic } from '../data/content-sitemap';
import { ROUTES } from '../data/routes';
import { getCompleteSitemapSections } from '../data/sitemap-inventory';
import { getRelatedPages, toLinkStripItems, toRelatedGuideCards } from '../utils/related-pages';

function createPage(input: {
  href: string;
  title?: string;
  pageType?: SitemapPage['pageType'];
  collectorSubtype?: SitemapPage['collectorSubtype'];
  topics?: SitemapTopic[];
  pinnedRelated?: string[];
  excludeRelated?: string[];
  relatedLabel?: string;
  noindex?: boolean;
}): SitemapPage {
  const title = input.title ?? input.href;

  return {
    href: input.href,
    baseTitle: title,
    pageType: input.pageType ?? 'converter',
    collectorSubtype: input.collectorSubtype,
    topics: input.topics,
    pinnedRelated: input.pinnedRelated,
    excludeRelated: input.excludeRelated,
    relatedLabel: input.relatedLabel,
    noindex: input.noindex,
    preview: {
      title,
      description: `${title} description`,
      image: '/og-default.jpg',
    },
  };
}

function createSection(title: string, pages: SitemapPage[]): SitemapSection {
  return {
    title,
    description: `${title} description`,
    pages,
  };
}

describe('related pages', () => {
  it('excludes self, noindex pages, informer pages, and attractor pages', async () => {
    const sections = [
      createSection('Current', [
        createPage({ href: '/current/', topics: ['cooling'] }),
        createPage({ href: '/self-duplicate/', topics: ['cooling'], noindex: true }),
        createPage({ href: '/legal/', pageType: 'informer', topics: ['cooling'] }),
        createPage({ href: '/', pageType: 'attractor', topics: ['cooling'] }),
        createPage({ href: '/eligible/', topics: ['cooling'] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 10 });

    expect(related.map((page) => page.href)).toEqual(['/eligible/']);
  });

  it('ranks pinned related hrefs first in pinned order', async () => {
    const sections = [
      createSection('Current', [
        createPage({
          href: '/current/',
          topics: ['cooling'],
          pinnedRelated: ['/third/', '/first/'],
        }),
        createPage({ href: '/first/', topics: ['cooling'] }),
        createPage({ href: '/second/', topics: ['cooling'] }),
        createPage({ href: '/third/', topics: [] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 3 });

    expect(related.map((page) => page.href)).toEqual(['/third/', '/first/', '/second/']);
  });

  it('lets excludeRelated beat pinnedRelated', async () => {
    const sections = [
      createSection('Current', [
        createPage({
          href: '/current/',
          topics: ['cooling'],
          pinnedRelated: ['/excluded/', '/kept/'],
          excludeRelated: ['/excluded/'],
        }),
        createPage({ href: '/excluded/', topics: ['cooling'] }),
        createPage({ href: '/kept/', topics: ['cooling'] }),
        createPage({ href: '/fallback/', topics: ['cooling'] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 3 });

    expect(related.map((page) => page.href)).not.toContain('/excluded/');
    expect(related[0]?.href).toBe('/kept/');
  });

  it('ranks topic overlap ahead of same-section matches', async () => {
    const sections = [
      createSection('Current', [
        createPage({ href: '/current/', topics: ['cooling', 'travel'] }),
        createPage({ href: '/same-section/', topics: ['calming'] }),
      ]),
      createSection('Other', [
        createPage({ href: '/topic-match/', topics: ['cooling', 'travel'] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 2 });

    expect(related.map((page) => page.href)).toEqual(['/topic-match/', '/same-section/']);
  });

  it('falls back to same section and page type rank when topics are absent', async () => {
    const sections = [
      createSection('Current', [
        createPage({ href: '/current/' }),
        createPage({
          href: '/same-section-article/',
          pageType: 'collector',
          collectorSubtype: 'article',
        }),
      ]),
      createSection('Other', [
        createPage({ href: '/other-converter/' }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 2 });

    expect(related.map((page) => page.href)).toEqual(['/same-section-article/', '/other-converter/']);
  });

  it('uses deterministic ordering for repeated calls', async () => {
    const sections = [
      createSection('Current', [
        createPage({ href: '/current/' }),
        createPage({ href: '/a/' }),
        createPage({ href: '/b/' }),
        createPage({ href: '/c/' }),
        createPage({ href: '/d/' }),
      ]),
    ];

    const first = await getRelatedPages({ currentHref: '/current/', sections, limit: 4 });
    const second = await getRelatedPages({ currentHref: '/current/', sections, limit: 4 });

    expect(second.map((page) => page.href)).toEqual(first.map((page) => page.href));
  });

  it('can surface a newly registered sitemap page without caller edits', async () => {
    const sections = [
      createSection('Current', [
        createPage({ href: '/current/', topics: ['gps-tracking'] }),
      ]),
      createSection('New Section', [
        createPage({ href: '/newly-registered/', topics: ['gps-tracking'] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: '/current/', sections, limit: 1 });

    expect(related[0]?.href).toBe('/newly-registered/');
  });

  it('adapts sitemap pages for InternalLinkStrip and RelatedGuides props', () => {
    const pages = [
      createPage({
        href: '/cooling/cooling-mats/',
        title: 'Best Dog Cooling Mats | Chill-Dogs',
        relatedLabel: 'Cooling Mat Picks',
      }),
    ];

    expect(toLinkStripItems(pages)).toEqual([
      {
        label: 'Cooling Mat Picks',
        href: '/cooling/cooling-mats/',
      },
    ]);
    expect(toRelatedGuideCards(pages)).toEqual([
      {
        href: '/cooling/cooling-mats/',
        title: 'Best Dog Cooling Mats',
        description: 'Best Dog Cooling Mats | Chill-Dogs description',
      },
    ]);
  });

  it('keeps migrated static related hrefs in the complete sitemap and excludes self', async () => {
    const sections = [
      ...await getCompleteSitemapSections(),
      createSection('Articles', [
        createPage({ href: '/travel/rhys-ran-away-cerro-san-luis-obispo/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/safety/what-to-do-if-your-dog-runs-away/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/travel/dog-road-trip-gear/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/calming/crate-training-for-dogs/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/calming/how-to-prepare-a-calm-room-for-fireworks-night/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/calming/should-you-take-your-dog-to-fireworks/', pageType: 'collector', collectorSubtype: 'article' }),
        createPage({ href: '/travel/how-to-fly-with-a-dog/', pageType: 'collector', collectorSubtype: 'article' }),
      ]),
    ];
    const pages = sections.flatMap((section) => section.pages);
    const hrefs = new Set(pages.map((page) => page.href));
    const migratedHrefs = [
      '/gear/best-dog-gps-trackers/',
      '/gear/fi-dog-collar-review/',
      '/gear/garmin-dog-tracking-collars/',
      '/gear/airtag-for-dogs/',
      '/cooling/car-cooling-for-dogs/',
      '/cooling/cooling-mats/',
      '/cooling/cooling-bandanas/',
      '/cooling/cooling-vests/',
      '/cooling/freezable-dog-toys/',
      '/calming/best-calming-products-for-anxious-dogs/',
      '/calming/best-thundershirt-alternatives/',
      '/calming/car-anxiety-for-dogs/',
      '/calming/best-lick-mats-for-dogs/',
      '/comforting/best-calming-dog-beds/',
      '/comforting/best-orthopedic-dog-beds/',
      '/comforting/best-puppy-crates/',
      '/comforting/best-anxiety-dog-crates/',
      '/comforting/best-travel-crates-for-road-trips/',
      '/comforting/best-airline-crates-for-flying-with-your-dog/',
      '/comforting/best-airline-approved-dog-carriers/',
      '/comforting/best-dog-travel-bags-for-flying/',
      '/comforting/best-furniture-dog-crates/',
      '/comforting/best-heavy-duty-dog-crates/',
    ];

    for (const href of migratedHrefs) {
      const page = pages.find((candidate) => candidate.href === href);
      expect(page?.pinnedRelated?.length).toBeGreaterThan(0);

      const related = await getRelatedPages({ currentHref: href, sections, limit: page?.pinnedRelated?.length });
      expect(related.map((relatedPage) => relatedPage.href)).not.toContain(href);

      for (const relatedHref of page?.pinnedRelated ?? []) {
        expect(hrefs.has(relatedHref)).toBe(true);
      }
    }
  });

  it('resolves only hrefs that exist in the complete sitemap and never resolves self', async () => {
    const sections = await getCompleteSitemapSections();
    const pages = sections.flatMap((section) => section.pages);
    const hrefs = new Set(pages.map((page) => page.href));
    const indexablePages = pages.filter((page) => !page.noindex && page.pageType !== 'attractor' && page.pageType !== 'informer');

    for (const page of indexablePages) {
      const related = await getRelatedPages({ currentHref: page.href, sections, limit: 4 });

      for (const relatedPage of related) {
        expect(hrefs.has(relatedPage.href)).toBe(true);
        expect(relatedPage.href).not.toBe(page.href);
      }
    }
  });

  it('keeps the flea and tick cluster tightly related in the complete sitemap', async () => {
    const sections = [
      createSection('Safety', [
        createPage({
          href: ROUTES.fleaTickPillar,
          pageType: 'collector',
          collectorSubtype: 'article',
          topics: ['flea-tick', 'travel'],
          pinnedRelated: [
            ROUTES.fleaTickProducts,
            ROUTES.naturalFleaTickPrevention,
            ROUTES.fleaSeasonBathTools,
          ],
        }),
        createPage({ href: ROUTES.fleaTickProducts, topics: ['flea-tick', 'travel'] }),
        createPage({
          href: ROUTES.naturalFleaTickPrevention,
          pageType: 'collector',
          collectorSubtype: 'article',
          topics: ['flea-tick', 'travel'],
        }),
        createPage({ href: ROUTES.fleaSeasonBathTools, topics: ['flea-tick'] }),
      ]),
    ];

    const related = await getRelatedPages({ currentHref: ROUTES.fleaTickPillar, sections, limit: 4 });

    expect(related.map((page) => page.href)).toEqual(expect.arrayContaining([
      ROUTES.fleaTickProducts,
      ROUTES.naturalFleaTickPrevention,
      ROUTES.fleaSeasonBathTools,
    ]));
  });
});
