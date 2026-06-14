import { describe, expect, it, vi } from 'vitest';

const mockStaticSitemapSections = vi.hoisted(() => {
  const page = (
    href: string,
    title: string,
    pageType: 'converter' | 'collector',
    options: {
      collectorSubtype?: 'article' | 'section';
      pubDate?: string;
      lastUpdated?: string;
      heroProduct?: boolean;
      image?: string;
    } = {}
  ) => ({
    href,
    baseTitle: title,
    pageType,
    collectorSubtype: options.collectorSubtype,
    pubDate: options.pubDate ? new Date(options.pubDate) : undefined,
    lastUpdated: options.lastUpdated ? new Date(options.lastUpdated) : undefined,
    heroProduct: options.heroProduct === false
      ? undefined
      : {
          image: 'https://example.com/product.jpg',
          badge: 'Top Pick',
          name: title,
        },
    preview: {
      title,
      description: `${title} preview`,
      image: options.image ?? `/og/${href.replace(/^\/|\/$/g, '').replace(/\//g, '-')}.jpg`,
    },
  });

  return [
    {
      title: 'Mock sitemap',
      description: 'Mock sitemap pages for homepage tests.',
      pages: [
        page('/gear/airtag-for-dogs/', 'AirTag for Dogs', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-12',
        }),
        page('/travel/how-to-fly-with-a-dog/', 'How to Fly With a Dog', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-11',
          image: '/_assets/custom-og.jpg',
        }),
        page('/gear/fi-dog-collar-review/', 'Fi Dog Collar Review', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-10',
        }),
        page('/safety/what-to-do-if-your-dog-runs-away/', 'What to Do If Your Dog Runs Away', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-09',
        }),
        page('/cooling/how-hot-is-too-hot-for-dogs/', 'How Hot Is Too Hot for Dogs', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-08',
        }),
        page('/gear/garmin-dog-tracking-collars/', 'Garmin Dog Tracking Collars', 'collector', {
          collectorSubtype: 'article',
          pubDate: '2026-06-07',
        }),
        page('/cooling/not-an-article/', 'Not an Article', 'collector', {
          collectorSubtype: 'section',
          pubDate: '2026-06-06',
        }),
        page('/cooling/updated-pick/', 'Updated Pick', 'converter', {
          pubDate: '2026-01-01',
          lastUpdated: '2026-06-10',
        }),
        page('/calming/latest-published-pick/', 'Latest Published Pick', 'converter', {
          pubDate: '2026-06-01',
        }),
        page('/comforting/dated-pick-01/', 'Dated Pick 01', 'converter', {
          pubDate: '2026-05-20',
        }),
        page('/comforting/dated-pick-02/', 'Dated Pick 02', 'converter', {
          pubDate: '2026-05-19',
        }),
        page('/comforting/dated-pick-03/', 'Dated Pick 03', 'converter', {
          pubDate: '2026-05-18',
        }),
        page('/comforting/dated-pick-04/', 'Dated Pick 04', 'converter', {
          pubDate: '2026-05-17',
        }),
        page('/comforting/dated-pick-05/', 'Dated Pick 05', 'converter', {
          pubDate: '2026-05-16',
        }),
        page('/comforting/dated-pick-06/', 'Dated Pick 06', 'converter', {
          pubDate: '2026-05-15',
        }),
        page('/comforting/dated-pick-07/', 'Dated Pick 07', 'converter', {
          pubDate: '2026-05-14',
        }),
        page('/comforting/dated-pick-08/', 'Dated Pick 08', 'converter', {
          pubDate: '2026-05-13',
        }),
        page('/comforting/dated-pick-09/', 'Dated Pick 09', 'converter', {
          pubDate: '2026-05-12',
        }),
        page('/comforting/dated-pick-10/', 'Dated Pick 10', 'converter', {
          pubDate: '2026-05-11',
        }),
        page('/comforting/dated-pick-11/', 'Dated Pick 11', 'converter', {
          pubDate: '2026-05-10',
        }),
        page('/comforting/dated-pick-12/', 'Dated Pick 12', 'converter', {
          pubDate: '2026-05-09',
        }),
        page('/comforting/dated-pick-13/', 'Dated Pick 13', 'converter', {
          pubDate: '2026-05-08',
        }),
        page('/gear/older-overflow-pick/', 'Older Overflow Pick', 'converter', {
          pubDate: '2026-01-01',
        }),
        page('/gear/undated-pick/', 'Undated Pick', 'converter', {
          heroProduct: false,
        }),
      ],
    },
  ];
});

vi.mock('@data/content-sitemap', () => ({
  staticSitemapSections: mockStaticSitemapSections,
}));

vi.mock('@data/sitemap-inventory', () => ({
  getCompleteSitemapPages: async () => mockStaticSitemapSections.flatMap((section) => section.pages),
}));

import {
  getHomepageArticleFeed,
  getHomepageConverters,
  isHomepageArticle,
  mapHomepageArticle,
  resolveHomepageArticleTheme,
} from '../utils/homepage-articles';

describe('homepage article feed', () => {
  it('derives homepage themes from article route prefixes', () => {
    expect(resolveHomepageArticleTheme('/cooling/how-hot-is-too-hot-for-dogs/')).toEqual({
      label: 'Cooling',
      color: 'cool',
    });
    expect(resolveHomepageArticleTheme('/travel/how-to-fly-with-a-dog/')).toEqual({
      label: 'Travel',
      color: 'gear',
    });
    expect(resolveHomepageArticleTheme('/something-else/')).toEqual({
      label: 'Guide',
      color: 'gear',
    });
  });

  it('includes static and content-style article collectors in homepage guide order', async () => {
    const feed = await getHomepageArticleFeed();

    expect(feed.featuredArticles.map((article) => article.href)).toEqual([
      '/gear/airtag-for-dogs/',
      '/travel/how-to-fly-with-a-dog/',
      '/gear/fi-dog-collar-review/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
      '/gear/garmin-dog-tracking-collars/',
    ]);
    expect(feed.moreArticles).toEqual([]);
    expect(feed.latestGuides.map((article) => article.href)).toEqual([
      '/gear/airtag-for-dogs/',
      '/travel/how-to-fly-with-a-dog/',
      '/gear/fi-dog-collar-review/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
      '/gear/garmin-dog-tracking-collars/',
    ]);
    expect(feed.featuredArticles[0]?.image).toBe('/og/gear-airtag-for-dogs.jpg');
    expect(feed.featuredArticles[1]?.image).toBe('/_assets/custom-og.jpg');
  });

  it('maps a sitemap article into homepage card data', () => {
    const article = mapHomepageArticle({
      href: '/comforting/how-much-do-dogs-sleep/',
      baseTitle: 'How Much Do Dogs Sleep',
      pageType: 'collector',
      collectorSubtype: 'article',
      pubDate: new Date('2026-03-24'),
      preview: {
        title: 'How Much Do Dogs Sleep',
        description: 'Sleep article preview',
        image: '/og/comforting-how-much-do-dogs-sleep.jpg',
      },
    });

    expect(article).toMatchObject({
      title: 'How Much Do Dogs Sleep',
      href: '/comforting/how-much-do-dogs-sleep/',
      label: 'Comfort',
      color: 'comfort',
      image: '/og/comforting-how-much-do-dogs-sleep.jpg',
    });
  });

  it('recognizes only article collectors with publish dates as homepage guide candidates', () => {
    expect(isHomepageArticle(mockStaticSitemapSections[0].pages[0]!)).toBe(true);
    expect(isHomepageArticle(mockStaticSitemapSections[0].pages[6]!)).toBe(false);
    expect(isHomepageArticle(mockStaticSitemapSections[0].pages[7]!)).toBe(false);
  });

  it('sorts homepage converters by latest date and caps the default list at 15 cards', () => {
    const converters = getHomepageConverters();

    expect(converters).toHaveLength(15);
    expect(converters.map((converter) => converter.href)).toEqual([
      '/cooling/updated-pick/',
      '/calming/latest-published-pick/',
      '/comforting/dated-pick-01/',
      '/comforting/dated-pick-02/',
      '/comforting/dated-pick-03/',
      '/comforting/dated-pick-04/',
      '/comforting/dated-pick-05/',
      '/comforting/dated-pick-06/',
      '/comforting/dated-pick-07/',
      '/comforting/dated-pick-08/',
      '/comforting/dated-pick-09/',
      '/comforting/dated-pick-10/',
      '/comforting/dated-pick-11/',
      '/comforting/dated-pick-12/',
      '/comforting/dated-pick-13/',
    ]);
    expect(converters[0]?.lastUpdated).toEqual(new Date('2026-06-10'));
    expect(converters[0]?.pubDate).toEqual(new Date('2026-01-01'));
    expect(converters[0]?.image).toBe('/og/cooling-updated-pick.jpg');
    expect(converters.map((converter) => converter.href)).not.toContain('/gear/older-overflow-pick/');
  });

  it('places undated converters last when the limit allows them', () => {
    const converters = getHomepageConverters(20);

    expect(converters).toHaveLength(17);
    expect(converters.at(-2)?.href).toBe('/gear/older-overflow-pick/');
    expect(converters.at(-1)?.href).toBe('/gear/undated-pick/');
    expect(converters.at(-1)?.image).toBeUndefined();
  });
});
