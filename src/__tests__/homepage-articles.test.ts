import { describe, expect, it } from 'vitest';
import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';

import {
  buildHomepageArticleFeed,
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
      createArticle('/cooling/how-hot-is-too-hot-for-dogs/', '2026-03-10'),
      createArticle('/travel/how-to-fly-with-a-dog/', '2026-04-10', explicitImage),
      createArticle('/calming/crate-training-for-dogs/', '2026-04-09'),
      createArticle('/safety/what-to-do-if-your-dog-runs-away/', '2026-04-03'),
    ]);

    expect(feed.featuredArticles.map((article) => article.href)).toEqual([
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
    ]);
    expect(feed.moreArticles.map((article) => article.href)).toEqual([
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);
    expect(feed.latestGuides.map((article) => article.href)).toEqual([
      '/travel/how-to-fly-with-a-dog/',
      '/calming/crate-training-for-dogs/',
      '/safety/what-to-do-if-your-dog-runs-away/',
      '/cooling/how-hot-is-too-hot-for-dogs/',
    ]);

    expect(feed.featuredArticles[0]?.image).toBe('/_assets/custom-og.jpg');
    expect(feed.moreArticles[0]?.image).toBe('/og/cooling-how-hot-is-too-hot-for-dogs.jpg');
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
});
