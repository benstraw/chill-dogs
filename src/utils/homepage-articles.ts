import type { CollectionEntry } from 'astro:content';
import type { ImageMetadata } from 'astro';
import { resolveAutoOgImagePath, resolveProvidedOgImagePath } from './og';
import { staticSitemapSections } from '@data/content-sitemap';

export type HomepageArticleColor = 'cool' | 'calm' | 'comfort' | 'gear';

export interface HomepageArticleCard {
  title: string;
  description: string;
  href: string;
  image: string | ImageMetadata;
  label: string;
  color: HomepageArticleColor;
  pubDate: Date;
}

export interface HomepageArticleFeed {
  featuredArticles: HomepageArticleCard[];
  moreArticles: HomepageArticleCard[];
  latestGuides: HomepageArticleCard[];
}

const ARTICLE_THEME_BY_PREFIX: Array<{
  prefix: string;
  label: string;
  color: HomepageArticleColor;
}> = [
  { prefix: '/cooling/', label: 'Cooling', color: 'cool' },
  { prefix: '/calming/', label: 'Calming', color: 'calm' },
  { prefix: '/comforting/', label: 'Comfort', color: 'comfort' },
  { prefix: '/travel/', label: 'Travel', color: 'gear' },
  { prefix: '/safety/', label: 'Safety', color: 'gear' },
  { prefix: '/gear/', label: 'Gear', color: 'gear' },
];

export function resolveHomepageArticleTheme(canonicalPath: string): Pick<HomepageArticleCard, 'label' | 'color'> {
  const match = ARTICLE_THEME_BY_PREFIX.find(({ prefix }) => canonicalPath.startsWith(prefix));

  if (!match) {
    return { label: 'Guide', color: 'gear' };
  }

  return { label: match.label, color: match.color };
}

export function mapHomepageArticle(entry: CollectionEntry<'articles'>): HomepageArticleCard {
  const theme = resolveHomepageArticleTheme(entry.data.canonicalPath);

  return {
    title: entry.data.title,
    description: entry.data.description,
    href: entry.data.canonicalPath,
    image: resolveProvidedOgImagePath(entry.data.ogImage)
      ?? resolveAutoOgImagePath({ pathname: entry.data.canonicalPath })
      ?? '/og-default.jpg',
    label: theme.label,
    color: theme.color,
    pubDate: entry.data.pubDate,
  };
}

export interface HomepageConverterCard {
  href: string;
  title: string;
  description: string;
  label: string;
  color: HomepageArticleColor;
}

const HOMEPAGE_PINNED_CONVERTERS = ['/calming/best-lick-mats-for-dogs/'];

export function getHomepageConverters(limit = 15): HomepageConverterCard[] {
  const converters = staticSitemapSections
    .flatMap((s) => s.pages)
    .filter((p) => p.pageType === 'converter')
    .reverse();
  const pinnedConverters = HOMEPAGE_PINNED_CONVERTERS
    .map((href) => converters.find((converter) => converter.href === href))
    .filter((converter): converter is (typeof converters)[number] => Boolean(converter));

  return [
    ...pinnedConverters,
    ...converters.filter((converter) => !HOMEPAGE_PINNED_CONVERTERS.includes(converter.href)),
  ]
    .slice(0, limit)
    .map((p) => ({
      href: p.href,
      title: p.baseTitle,
      description: p.preview.description,
      ...resolveHomepageArticleTheme(p.href),
    }));
}

export function buildHomepageArticleFeed(
  entries: CollectionEntry<'articles'>[],
  featuredCount = 3
): HomepageArticleFeed {
  const sortedArticles = entries
    .slice()
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map(mapHomepageArticle);

  return {
    featuredArticles: sortedArticles.slice(0, featuredCount),
    moreArticles: sortedArticles.slice(featuredCount),
    latestGuides: sortedArticles,
  };
}
