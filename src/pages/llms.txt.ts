import type { APIContext } from 'astro';
import { buildLlmsMarkdown, normalizePath, type LlmsLink, type LlmsPageKind } from '@utils/llms';
import type { SitemapPage } from '@data/content-sitemap';
import { isExcludedFromDiscovery } from '@data/discovery-exclusions';
import { ROUTES } from '@data/routes';
import { getCompleteSitemapPages } from '@data/sitemap-inventory';

export const prerender = true;

const SITE_NAME = 'Chill-Dogs';
const SITE_DESCRIPTION = 'Curated cooling and calming product guides for dogs, focused on practical picks and clear routes to high-intent recommendations.';
const INTRO = 'This is a complete index of every indexable, publicly discoverable page on the site, grouped by section and ordered so section landing pages and product guides come before supporting articles.';

/**
 * Ordering nudges for the highest-intent pages. These only move a page within
 * its section — they never decide whether a page appears. Coverage comes from
 * the sitemap inventory, so a new page is listed the moment it is registered.
 */
const PRIORITY_OVERRIDES: Record<string, number> = {
  [ROUTES.home]: 1000,
  [ROUTES.shop]: 930,
  [ROUTES.articles]: 920,
  [ROUTES.coolingTop]: 935,
  [ROUTES.calmingTop]: 935,
  [ROUTES.trackingTop]: 935,
  [ROUTES.roadTrip]: 935,
};

function pageKindFor(page: SitemapPage): LlmsPageKind {
  if (page.pageType === 'collector') {
    return page.collectorSubtype === 'article' ? 'article-collector' : 'section-collector';
  }

  return page.pageType;
}

/**
 * A page belongs in llms.txt on exactly the terms it belongs in the XML
 * sitemap: registered in the inventory, indexable, and not sitting behind one
 * of the shared discovery exclusions.
 */
function isPublicAndIndexable(page: SitemapPage): boolean {
  return !page.noindex && !isExcludedFromDiscovery(normalizePath(page.href));
}

function toLlmsLink(page: SitemapPage): LlmsLink {
  return {
    title: page.baseTitle,
    path: page.href,
    description: page.preview.description,
    pageKind: pageKindFor(page),
    explicitPriority: PRIORITY_OVERRIDES[normalizePath(page.href)],
  };
}

function resolveBaseUrl(context: APIContext): string {
  const envUrl = import.meta.env.PUBLIC_SITE_URL;
  if (envUrl) {
    return envUrl.endsWith('/') ? envUrl : `${envUrl}/`;
  }

  if (context.site) {
    return context.site.href;
  }

  throw new Error('Missing site URL. Set PUBLIC_SITE_URL or Astro site config.');
}

export async function GET(context: APIContext): Promise<Response> {
  const baseUrl = resolveBaseUrl(context);
  const pages = await getCompleteSitemapPages();
  const links = pages.filter(isPublicAndIndexable).map(toLlmsLink);

  const body = buildLlmsMarkdown({
    siteName: SITE_NAME,
    description: SITE_DESCRIPTION,
    shortParagraph: INTRO,
    baseUrl,
    links,
  });

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
