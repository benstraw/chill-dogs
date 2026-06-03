import type { APIRoute } from 'astro';
import { productCatalogItems } from '@data/product-catalog';
import { buildProductPageMap } from '@data/product-page-map';
import { ROUTES } from '@data/routes';
import { getCompleteSitemapPages } from '@data/sitemap-inventory';

export const GET: APIRoute = async () => {
  const pages = await getCompleteSitemapPages();

  // Invert productPageMap → pageHref: productName[]
  const pageProductNames: Record<string, string[]> = {};
  for (const [productId, refs] of Object.entries(buildProductPageMap())) {
    const product = productCatalogItems.find((p) => p.id === productId);
    if (!product) continue;
    for (const ref of refs) {
      (pageProductNames[ref.href] ??= []).push(product.name);
    }
  }

  const pageItems = pages
    .filter((p) => !p.noindex)
    .map((p) => ({
      type: 'page' as const,
      title: p.baseTitle,
      description: p.preview.description,
      pageType: p.pageType,
      href: p.href,
      topics: p.topics ?? [],
      productNames: pageProductNames[p.href] ?? [],
    }));

  const productItems = productCatalogItems.map((p) => ({
    type: 'product' as const,
    id: p.id,
    name: p.name,
    pillar: p.pillar,
    category: p.category,
    bestFor: p.bestFor,
    bullets: p.bullets.join(' '),
    image: p.image,
    href: `${ROUTES.shop}?q=${encodeURIComponent(p.name)}`,
  }));

  return new Response(JSON.stringify([...pageItems, ...productItems]), {
    headers: { 'Content-Type': 'application/json' },
  });
};
