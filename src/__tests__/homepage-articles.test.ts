import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

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
    ]);

    expect(feed.featuredArticles.map((article) => article.href)).toEqual([
      '/calming/dog-fireworks-anxiety-checklist/',
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
    ]);
    expect(feed.moreArticles.map((article) => article.href)).toEqual([
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);
    expect(feed.latestGuides.map((article) => article.href)).toEqual([
      '/calming/dog-fireworks-anxiety-checklist/',
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);

    expect(feed.featuredArticles[0]?.image).toBe('/og/calming-dog-fireworks-anxiety-checklist.jpg');
    expect(feed.featuredArticles[1]?.image).toBe('/_assets/custom-og.jpg');
    expect(feed.moreArticles[0]?.image).toBe('/og/safety-what-to-do-if-your-dog-runs-away.jpg');
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

  it('includes the lick-mat converter in the default homepage browse picks', () => {
    const converters = getHomepageConverters();

    expect(converters.map((converter) => converter.href)).toContain('/calming/best-lick-mats-for-dogs/');
    expect(converters.filter((converter) => converter.href === '/calming/best-lick-mats-for-dogs/')).toHaveLength(1);
  });
});
