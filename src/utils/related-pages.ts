import { getCompleteSitemapSections } from '@data/sitemap-inventory';
import { isProductDetailPage, type SitemapPage, type SitemapSection } from '@data/content-sitemap';

export interface RelatedPagesOptions {
  currentHref: string;
  limit?: number;
  sections?: SitemapSection[];
}

export interface LinkStripItem {
  label: string;
  href: string;
}

export interface RelatedGuideCard {
  href: string;
  title: string;
  description: string;
}

interface RankedPage {
  page: SitemapPage;
  pinnedIndex: number;
  topicOverlap: number;
  sameSection: number;
  pageTypeRank: number;
  tieBreaker: number;
}

const DEFAULT_RELATED_LIMIT = 4;

export async function getRelatedPages(options: RelatedPagesOptions): Promise<SitemapPage[]> {
  const limit = options.limit ?? DEFAULT_RELATED_LIMIT;
  const sections = options.sections ?? await getCompleteSitemapSections();
  const currentPage = sections.flatMap((section) => section.pages).find((page) => page.href === options.currentHref);

  if (!currentPage) {
    throw new Error(`Missing sitemap page for related links: ${options.currentHref}`);
  }

  const currentSection = sections.find((section) => section.pages.some((page) => page.href === currentPage.href));
  const excludedHrefs = new Set([currentPage.href, ...(currentPage.excludeRelated ?? [])]);
  const pinnedRelated = currentPage.pinnedRelated ?? [];
  const pinnedOrder = new Map(pinnedRelated.map((href, index) => [href, index]));
  const currentTopics = new Set(currentPage.topics ?? []);

  const rankedPages = sections
    .flatMap((section) =>
      section.pages.map((page): RankedPage => ({
        page,
        pinnedIndex: pinnedOrder.get(page.href) ?? Number.POSITIVE_INFINITY,
        topicOverlap: countTopicOverlap(currentTopics, page.topics),
        sameSection: section === currentSection ? 1 : 0,
        pageTypeRank: getPageTypeRank(page),
        tieBreaker: stableHash(`${currentPage.href}:${page.href}`),
      }))
    )
    .filter(({ page }) => isEligibleRelatedPage(page, excludedHrefs))
    .sort(compareRankedPages);

  return rankedPages.slice(0, limit).map(({ page }) => page);
}

export function toLinkStripItems(pages: SitemapPage[]): LinkStripItem[] {
  return pages.map((page) => ({
    label: page.relatedLabel ?? cleanPreviewTitle(page.preview.title),
    href: page.href,
  }));
}

export function toRelatedGuideCards(pages: SitemapPage[]): RelatedGuideCard[] {
  return pages.map((page) => ({
    href: page.href,
    title: cleanPreviewTitle(page.preview.title),
    description: page.preview.description,
  }));
}

function isEligibleRelatedPage(page: SitemapPage, excludedHrefs: Set<string>): boolean {
  if (excludedHrefs.has(page.href)) {
    return false;
  }

  if (page.noindex || page.pageType === 'attractor' || page.pageType === 'informer') {
    return false;
  }

  // Related strips offer guides. Product detail pages are converters too, so nothing
  // here excluded them — they simply lost on topic overlap, which is luck rather than
  // design with 214 of them in the inventory. Make it deliberate.
  if (isProductDetailPage(page)) {
    return false;
  }

  return true;
}

function countTopicOverlap(currentTopics: Set<string>, candidateTopics: string[] | undefined): number {
  if (currentTopics.size === 0 || !candidateTopics?.length) {
    return 0;
  }

  return candidateTopics.filter((topic) => currentTopics.has(topic)).length;
}

function getPageTypeRank(page: SitemapPage): number {
  if (page.pageType === 'converter') {
    return 3;
  }

  if (page.pageType === 'collector' && page.collectorSubtype === 'article') {
    return 2;
  }

  if (page.pageType === 'collector' && page.collectorSubtype === 'section') {
    return 1;
  }

  return 0;
}

function compareRankedPages(a: RankedPage, b: RankedPage): number {
  return compareAscending(a.pinnedIndex, b.pinnedIndex)
    || compareDescending(a.topicOverlap, b.topicOverlap)
    || compareDescending(a.sameSection, b.sameSection)
    || compareDescending(a.pageTypeRank, b.pageTypeRank)
    || compareAscending(a.tieBreaker, b.tieBreaker)
    || a.page.href.localeCompare(b.page.href);
}

function compareAscending(a: number, b: number): number {
  return a - b;
}

function compareDescending(a: number, b: number): number {
  return b - a;
}

function stableHash(value: string): number {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash;
}

function cleanPreviewTitle(title: string): string {
  return title.replace(/\s+\|\s+Chill-Dogs$/, '');
}
