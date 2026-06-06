import { describe, expect, it, vi } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

const mockStaticSitemapSections = vi.hoisted(() => {
  const converter = (
    href: string,
    title: string,
    pubDate?: string,
    lastUpdated?: string,
    heroProduct = true
  ) => ({
    href,
    baseTitle: title,
    description: `${title} description`,
    pageType: 'converter',
    pubDate: pubDate ? new Date(pubDate) : undefined,
    lastUpdated: lastUpdated ? new Date(lastUpdated) : undefined,
    heroProduct: heroProduct
      ? {
          image: 'https://example.com/product.jpg',
          badge: 'Top Pick',
          name: title,
        }
      : undefined,
    preview: {
      title,
      description: `${title} preview`,
      image: `/og/${href.replace(/^\/|\/$/g, '').replace(/\//g, '-')}.jpg`,
    },
  });

  return [
    {
      title: 'Mock sitemap',
      description: 'Mock sitemap pages for homepage converter tests.',
      pages: [
        converter('/cooling/updated-pick/', 'Updated Pick', '2026-01-01', '2026-06-10'),
        converter('/calming/latest-published-pick/', 'Latest Published Pick', '2026-06-01'),
        converter('/comforting/dated-pick-01/', 'Dated Pick 01', '2026-05-20'),
        converter('/comforting/dated-pick-02/', 'Dated Pick 02', '2026-05-19'),
        converter('/comforting/dated-pick-03/', 'Dated Pick 03', '2026-05-18'),
        converter('/comforting/dated-pick-04/', 'Dated Pick 04', '2026-05-17'),
        converter('/comforting/dated-pick-05/', 'Dated Pick 05', '2026-05-16'),
        converter('/comforting/dated-pick-06/', 'Dated Pick 06', '2026-05-15'),
        converter('/comforting/dated-pick-07/', 'Dated Pick 07', '2026-05-14'),
        converter('/comforting/dated-pick-08/', 'Dated Pick 08', '2026-05-13'),
        converter('/comforting/dated-pick-09/', 'Dated Pick 09', '2026-05-12'),
        converter('/comforting/dated-pick-10/', 'Dated Pick 10', '2026-05-11'),
        converter('/comforting/dated-pick-11/', 'Dated Pick 11', '2026-05-10'),
        converter('/comforting/dated-pick-12/', 'Dated Pick 12', '2026-05-09'),
        converter('/comforting/dated-pick-13/', 'Dated Pick 13', '2026-05-08'),
        converter('/gear/older-overflow-pick/', 'Older Overflow Pick', '2026-01-01'),
        converter('/gear/undated-pick/', 'Undated Pick', undefined, undefined, false),
        {
          href: '/cooling/not-a-converter/',
          baseTitle: 'Not a Converter',
          pageType: 'collector',
          preview: {
            title: 'Not a Converter',
            description: 'This page should not appear in Browse Picks.',
            image: '/og-default.jpg',
          },
        },
      ],
    },
  ];
});

vi.mock('@data/content-sitemap', () => ({
  staticSitemapSections: mockStaticSitemapSections,
}));

import {
  buildHomepageArticleFeed,
  getHomepageConverters,
  mapHomepageArticle,
  resolveHomepageArticleTheme,
} from '../utils/homepage-articles';

function createArticle(
  canonicalPath: string,
  pubDate: string,
  ogImage?: ImageMetadata
): CollectionEntry<'articles'> {
  return {
    id: canonicalPath,
    slug: canonicalPath,
    body: '',
    collection: 'articles',
    data: {
      title: canonicalPath,
      description: `${canonicalPath} description`,
      pubDate: new Date(pubDate),
      canonicalPath,
      ogImage,
    },
  } as CollectionEntry<'articles'>;
}

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

  it('maps images and sorts newest articles to the top', () => {
    const explicitImage = {
      src: '/_assets/custom-og.jpg',
      width: 1200,
      height: 630,
      format: 'jpg',
    } as ImageMetadata;

    const feed = buildHomepageArticleFeed([
      createArticle('/calming/dog-fireworks-anxiety-checklist/', '2026-05-12'),
      createArticle('/cooling/how-hot-is-too-hot-for-dogs/', '2026-03-10'),
      createArticle('/travel/how-to-fly-with-a-dog/', '2026-04-10', explicitImage),
      createArticle('/calming/crate-training-for-dogs/', '2026-04-09'),
      createArticle('/safety/what-to-do-if-your-dog-runs-away/', '2026-04-03'),
      createArticle('/comforting/how-much-do-dogs-sleep/', '2026-03-24'),
      createArticle('/cooling/keep-dog-cool-in-car/', '2026-03-20'),
    ]);

    expect(feed.featuredArticles.map((article) => article.href)).toEqual([
      '/calming/dog-fireworks-anxiety-checklist/',
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/comforting/how-much-do-dogs-sleep/',
      '/cooling/keep-dog-cool-in-car/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);
    expect(feed.moreArticles).toEqual([]);
    expect(feed.latestGuides.map((article) => article.href)).toEqual([
      '/calming/dog-fireworks-anxiety-checklist/',
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/comforting/how-much-do-dogs-sleep/',
      '/cooling/keep-dog-cool-in-car/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);

    expect(feed.featuredArticles[0]?.image).toBe('/og/calming-dog-fireworks-anxiety-checklist.jpg');
    expect(feed.featuredArticles[1]?.image).toBe('/_assets/custom-og.jpg');
    expect(feed.featuredArticles[3]?.image).toBe('/og/safety-what-to-do-if-your-dog-runs-away.jpg');
    expect(feed.featuredArticles[6]?.image).toBe('/og/cooling-how-hot-is-too-hot-for-dogs.jpg');
  });

  it('maps a single article into homepage card data', () => {
    const article = mapHomepageArticle(
      createArticle('/comforting/how-much-do-dogs-sleep/', '2026-03-24')
    );

    expect(article).toMatchObject({
      title: '/comforting/how-much-do-dogs-sleep/',
      href: '/comforting/how-much-do-dogs-sleep/',
      label: 'Comfort',
      color: 'comfort',
      image: '/og/comforting-how-much-do-dogs-sleep.jpg',
    });
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

  it('filters non-converters and places undated converters last when the limit allows them', () => {
    const converters = getHomepageConverters(20);

    expect(converters).toHaveLength(17);
    expect(converters.map((converter) => converter.href)).not.toContain('/cooling/not-a-converter/');
    expect(converters.at(-2)?.href).toBe('/gear/older-overflow-pick/');
    expect(converters.at(-1)?.href).toBe('/gear/undated-pick/');
    expect(converters.at(-1)?.image).toBeUndefined();
  });
});
