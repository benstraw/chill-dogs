import type { APIRoute } from 'astro';
import { productCatalogItems } from '@data/product-catalog';
import { getCompleteSitemapPages } from '@data/sitemap-inventory';

export const GET: APIRoute = async () => {
  const pages = await getCompleteSitemapPages();

  const pageItems = pages
    .filter((p) => !p.noindex)
    .map((p) => ({
      type: 'page' as const,
      title: p.baseTitle,
      description: p.preview.description,
      pageType: p.pageType,
      href: p.href,
      topics: p.topics ?? [],
    }));

  const productItems = productCatalogItems.map((p) => ({
    type: 'product' as const,
    name: p.name,
    pillar: p.pillar,
    category: p.category,
    bestFor: p.bestFor,
    bullets: p.bullets.join(' '),
    amazonUrl: p.amazonUrl,
  }));

  return new Response(JSON.stringify([...pageItems, ...productItems]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
