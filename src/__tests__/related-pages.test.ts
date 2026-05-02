import { describe, expect, it } from 'vitest';

import type { SitemapPage, SitemapSection, SitemapTopic } from '../data/content-sitemap';
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
  noindex?: boolean;
}): SitemapPage {
  const title = input.title ?? input.href;

  return {
    href: input.href,
    pageType: input.pageType ?? 'converter',
    collectorSubtype: input.collectorSubtype,
    topics: input.topics,
    pinnedRelated: input.pinnedRelated,
    excludeRelated: input.excludeRelated,
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
      }),
    ];

    expect(toLinkStripItems(pages)).toEqual([
      {
        label: 'Best Dog Cooling Mats',
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
});
