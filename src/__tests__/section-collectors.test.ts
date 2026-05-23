import { describe, expect, it } from 'vitest';

import {
  buildSectionCollectorPageData,
  sectionCollectorDefinitions,
  type SectionCollectorDefinition,
} from '../data/section-collectors';
import { staticSitemapSections, type SitemapPage, type SitemapSection, type SitemapTopic } from '../data/content-sitemap';

function createPage(input: {
  href: string;
  title?: string;
  pageType?: SitemapPage['pageType'];
  collectorSubtype?: SitemapPage['collectorSubtype'];
  topics?: SitemapTopic[];
  noindex?: boolean;
}): SitemapPage {
  const title = input.title ?? input.href;

  return {
    href: input.href,
    baseTitle: title,
    pageType: input.pageType ?? 'converter',
    collectorSubtype: input.collectorSubtype,
    topics: input.topics,
    noindex: input.noindex,
    preview: {
      title: `${title} | Chill-Dogs`,
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

function pageHrefs(data: ReturnType<typeof buildSectionCollectorPageData>): string[] {
  return [
    data.body.start?.href,
    ...data.body.sections.flatMap((section) => section.cards.map((card) => card.href)),
  ].filter((href): href is string => Boolean(href));
}

function withoutPriority(definition: SectionCollectorDefinition): SectionCollectorDefinition {
  return {
    ...definition,
    startHref: undefined,
    converterPriority: [],
    articlePriority: [],
  };
}

describe('section collectors', () => {
  it('matches topic-relevant converters and article collectors only', () => {
    const data = buildSectionCollectorPageData(withoutPriority(sectionCollectorDefinitions.cooling), [
      createSection('Entry Points', [
        createPage({
          href: '/cooling/',
          pageType: 'collector',
          collectorSubtype: 'section',
          topics: ['cooling'],
        }),
        createPage({ href: '/', pageType: 'attractor', topics: ['cooling'] }),
      ]),
      createSection('Candidates', [
        createPage({ href: '/cooling/cooling-mats/', topics: ['cooling'] }),
        createPage({
          href: '/cooling/how-hot-is-too-hot-for-dogs/',
          pageType: 'collector',
          collectorSubtype: 'article',
          topics: ['heat-safety'],
        }),
        createPage({ href: '/legal/', pageType: 'informer', topics: ['cooling'] }),
        createPage({ href: '/hidden/', topics: ['cooling'], noindex: true }),
        createPage({ href: '/calming/best-calming-products-for-anxious-dogs/', topics: ['calming'] }),
      ]),
    ]);

    expect(data.inventoryPages.map((page) => page.href)).toEqual([
      '/cooling/cooling-mats/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);
  });

  it('allows a page with multiple topics to appear in multiple collectors', () => {
    const sections = [
      createSection('Candidates', [
        createPage({ href: '/travel/dog-road-trip-gear/', pageType: 'collector', collectorSubtype: 'article', topics: ['cooling', 'calming'] }),
      ]),
    ];
    const cooling = buildSectionCollectorPageData(withoutPriority(sectionCollectorDefinitions.cooling), sections);
    const calming = buildSectionCollectorPageData(withoutPriority(sectionCollectorDefinitions.calming), sections);

    expect(pageHrefs(cooling)).toContain('/travel/dog-road-trip-gear/');
    expect(pageHrefs(calming)).toContain('/travel/dog-road-trip-gear/');
  });

  it('keeps converters in priority order and then sitemap order', () => {
    const definition: SectionCollectorDefinition = {
      ...sectionCollectorDefinitions.cooling,
      startHref: undefined,
      converterPriority: ['/priority-second/', '/priority-first/'],
      articlePriority: [],
    };
    const data = buildSectionCollectorPageData(definition, [
      createSection('Candidates', [
        createPage({ href: '/sitemap-first/', topics: ['cooling'] }),
        createPage({ href: '/priority-first/', topics: ['cooling'] }),
        createPage({ href: '/priority-second/', topics: ['cooling'] }),
        createPage({ href: '/sitemap-second/', topics: ['cooling'] }),
      ]),
    ]);

    expect(data.converters.map((page) => page.href)).toEqual([
      '/priority-second/',
      '/priority-first/',
      '/sitemap-first/',
      '/sitemap-second/',
    ]);
  });

  it('groups pages by the first matching topic section without repeating cards', () => {
    const definition: SectionCollectorDefinition = {
      ...sectionCollectorDefinitions.cooling,
      startHref: undefined,
      topicSections: [
        {
          heading: 'Car Cooling',
          topics: ['car-cooling'],
        },
        {
          heading: 'Heat Safety',
          topics: ['heat-safety'],
        },
      ],
    };
    const data = buildSectionCollectorPageData(definition, [
      createSection('Candidates', [
        createPage({ href: '/cooling/car-cooling-for-dogs/', topics: ['car-cooling', 'heat-safety'] }),
        createPage({
          href: '/cooling/how-hot-is-too-hot-for-dogs/',
          pageType: 'collector',
          collectorSubtype: 'article',
          topics: ['heat-safety'],
        }),
      ]),
    ]);

    expect(data.body.sections.map((section) => ({
      heading: section.heading,
      hrefs: section.cards.map((card) => card.href),
    }))).toEqual([
      {
        heading: 'Car Cooling',
        hrefs: ['/cooling/car-cooling-for-dogs/'],
      },
      {
        heading: 'Heat Safety',
        hrefs: ['/cooling/how-hot-is-too-hot-for-dogs/'],
      },
    ]);
  });

  it('keeps converter cards before article cards inside a topic section', () => {
    const definition: SectionCollectorDefinition = {
      ...sectionCollectorDefinitions.cooling,
      startHref: undefined,
      topicSections: [
        {
          heading: 'Travel Cooling',
          topics: ['travel'],
        },
      ],
    };
    const data = buildSectionCollectorPageData(definition, [
      createSection('Articles (from collection)', [
        createPage({
          href: '/travel/dog-road-trip-gear/',
          pageType: 'collector',
          collectorSubtype: 'article',
          topics: ['cooling', 'travel'],
        }),
      ]),
      createSection('Converters', [
        createPage({ href: '/cooling/dog-travel-hydration/', topics: ['cooling', 'travel'] }),
      ]),
    ]);

    expect(data.body.sections[0]?.cards.map((card) => card.href)).toEqual([
      '/cooling/dog-travel-hydration/',
      '/travel/dog-road-trip-gear/',
    ]);
  });

  it('keeps discovered articles in article sitemap publish order', () => {
    const data = buildSectionCollectorPageData(withoutPriority(sectionCollectorDefinitions.cooling), [
      createSection('Articles (from collection)', [
        createPage({ href: '/newer/', pageType: 'collector', collectorSubtype: 'article', topics: ['cooling'] }),
        createPage({ href: '/older/', pageType: 'collector', collectorSubtype: 'article', topics: ['cooling'] }),
      ]),
      createSection('Static Articles', [
        createPage({ href: '/static/', pageType: 'collector', collectorSubtype: 'article', topics: ['cooling'] }),
      ]),
    ]);

    expect(data.articles.map((page) => page.href)).toEqual(['/newer/', '/older/', '/static/']);
  });

  it('keeps every indexable static converter on at least one section collector', () => {
    const converters = staticSitemapSections
      .flatMap((section) => section.pages)
      .filter((page) => page.pageType === 'converter' && !page.noindex);
    const collectorHrefs = new Set(
      Object.values(sectionCollectorDefinitions).flatMap((definition) =>
        buildSectionCollectorPageData(definition, staticSitemapSections).inventoryPages.map((page) => page.href)
      )
    );
    const missing = converters
      .map((page) => page.href)
      .filter((href) => !collectorHrefs.has(href));

    expect(missing).toEqual([]);
  });

  it('uses the generated inventory for CollectionPage schema hasPart entries', () => {
    const data = buildSectionCollectorPageData(sectionCollectorDefinitions.cooling, staticSitemapSections);
    const hasPart = data.schema.hasPart as Array<{ name: string; url: string }>;
    const schemaUrls = hasPart.map((part) => part.url);

    expect(schemaUrls).toContain('https://www.chill-dogs.com/cooling/best-cooling-products-for-dogs/');
    expect(schemaUrls).toContain('https://www.chill-dogs.com/cooling/dog-travel-hydration/');
  });
});
