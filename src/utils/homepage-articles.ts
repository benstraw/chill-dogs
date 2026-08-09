import { getCompleteSitemapPages } from '@data/sitemap-inventory';
import type { SitemapPage } from '@data/content-sitemap';
import { staticSitemapSections } from '@data/content-sitemap';

export type HomepageArticleColor = 'cool' | 'calm' | 'comfort' | 'gear';

export interface HomepageArticleCard {
  title: string;
  description: string;
  href: string;
  image: string;
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

export function isHomepageArticle(page: SitemapPage): boolean {
  return page.pageType === 'collector' && page.collectorSubtype === 'article' && !!page.pubDate;
}

export function mapHomepageArticle(page: SitemapPage): HomepageArticleCard {
  const theme = resolveHomepageArticleTheme(page.href);

  return {
    title: page.baseTitle,
    description: page.preview.description,
    href: page.href,
    image: page.preview.image,
    label: theme.label,
    color: theme.color,
    pubDate: page.pubDate!,
  };
}

export interface HomepageConverterCard {
  href: string;
  title: string;
  description: string;
  image?: string;
  label: string;
  color: HomepageArticleColor;
  pubDate?: Date;
  lastUpdated?: Date;
}

export function getHomepageConverters(limit = 15): HomepageConverterCard[] {
  return staticSitemapSections
    .flatMap((s) => s.pages)
    .filter((p) => p.pageType === 'converter')
    .sort((a, b) => {
      const aDate = a.lastUpdated ?? a.pubDate;
      const bDate = b.lastUpdated ?? b.pubDate;
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return bDate.valueOf() - aDate.valueOf();
    })
    .slice(0, limit)
    .map((p) => ({
      href: p.href,
      title: p.baseTitle,
      description: p.preview.description,
      image: p.heroProduct ? p.preview.image : undefined,
      pubDate: p.pubDate,
      lastUpdated: p.lastUpdated,
      ...resolveHomepageArticleTheme(p.href),
    }));
}

const HOMEPAGE_THEME_ORDER: HomepageArticleColor[] = ['cool', 'calm', 'comfort', 'gear'];

// Spelled out rather than built from HOMEPAGE_THEME_ORDER: the literal is
// checked against the union, so adding a colour fails to compile here instead
// of silently producing a bucket map with a missing key.
function emptyThemeBuckets<T>(): Record<HomepageArticleColor, T[]> {
  return { cool: [], calm: [], comfort: [], gear: [] };
}

export function groupHomepageArticlesByTheme(
  articles: HomepageArticleCard[]
): Record<HomepageArticleColor, HomepageArticleCard[]> {
  const buckets = emptyThemeBuckets<HomepageArticleCard>();
  for (const article of articles) {
    buckets[article.color].push(article);
  }
  return buckets;
}

export function groupHomepageConvertersByTheme(
  converters: HomepageConverterCard[]
): Record<HomepageArticleColor, HomepageConverterCard[]> {
  const buckets = emptyThemeBuckets<HomepageConverterCard>();
  for (const converter of converters) {
    buckets[converter.color].push(converter);
  }
  return buckets;
}

export async function getHomepageArticleFeed(
  featuredCount = Number.POSITIVE_INFINITY
): Promise<HomepageArticleFeed> {
  const sortedArticles = (await getCompleteSitemapPages())
    .filter(isHomepageArticle)
    .sort((a, b) => b.pubDate!.valueOf() - a.pubDate!.valueOf())
    .map(mapHomepageArticle);

  return {
    featuredArticles: sortedArticles.slice(0, featuredCount),
    moreArticles: sortedArticles.slice(featuredCount),
    latestGuides: sortedArticles,
  };
}
