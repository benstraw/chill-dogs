import { getCollection, type CollectionEntry } from 'astro:content';

import { createSitemapPage, staticSitemapSections, type SitemapPage, type SitemapSection } from './content-sitemap';

export async function getArticleSitemapSection(): Promise<SitemapSection> {
  const articleEntries = await getCollection('articles');
  const articlePages = [...articleEntries]
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((entry: CollectionEntry<'articles'>) =>
      createSitemapPage({
        baseTitle: entry.data.title,
        ogTitle: entry.data.ogTitle,
        description: entry.data.description,
        ogImage: entry.data.ogImage,
        href: entry.data.canonicalPath,
        pageType: 'collector',
        collectorSubtype: 'article',
        topics: entry.data.topics,
        pinnedRelated: entry.data.pinnedRelated,
        excludeRelated: entry.data.excludeRelated,
      })
    );

  return {
    title: 'Articles (from collection)',
    description: 'Article collectors auto-discovered from the MDX content collection — sorted by publish date.',
    pages: articlePages,
  };
}

export async function getCompleteSitemapSections(): Promise<SitemapSection[]> {
  const articlesSection = await getArticleSitemapSection();
  return [staticSitemapSections[0], articlesSection, ...staticSitemapSections.slice(1)];
}

export async function getCompleteSitemapPages(): Promise<SitemapPage[]> {
  const sections = await getCompleteSitemapSections();
  return sections.flatMap((section) => section.pages);
}
