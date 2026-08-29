/**
 * Product detail pages: registration, reachability, and indexing.
 *
 * `/shop/<id>/` pages are generated, not hand-written, so nobody reviews them one by
 * one. These checks stand in for that review: every product has exactly one registered
 * page, none of them is an orphan, and the indexing gate is reflected in the registry
 * the XML sitemap and llms.txt are both built from.
 *
 * Section collectors deliberately do not carry these pages — `section-collectors.test.ts`
 * scopes its orphan check to the hand-authored converter guides. This file is the other
 * half of that bargain.
 */

import { describe, expect, it } from 'vitest';

import {
  PRODUCT_SECTION_TITLE,
  staticSitemapSections,
  type SitemapPage,
} from '../data/content-sitemap';
import { productCatalogItems } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { shopProductRoute } from '../data/routes';
import { isIndexableProduct } from '../utils/product-meta';

const productSection = staticSitemapSections.find(
  (section) => section.title === PRODUCT_SECTION_TITLE
);
const productPages: SitemapPage[] = productSection?.pages ?? [];

describe('product page registration', () => {
  it('registers a Products section', () => {
    expect(productSection).toBeDefined();
    expect(productPages.length).toBe(productCatalogItems.length);
  });

  it('registers exactly one page per catalog product, at its id route', () => {
    const registered = new Set(productPages.map((page) => page.href));
    const missing = productCatalogItems
      .map((product) => shopProductRoute(product.id))
      .filter((href) => !registered.has(href));

    expect(missing).toEqual([]);
    expect(registered.size).toBe(productCatalogItems.length);
  });

  it('registers them as converters — they exist to reach an offer', () => {
    const wrongType = productPages
      .filter((page) => page.pageType !== 'converter')
      .map((page) => `${page.href} is ${page.pageType}`);

    expect(wrongType).toEqual([]);
  });

  it('mirrors the indexing gate into the registry', () => {
    // The registry drives both the XML sitemap and llms.txt, so a mismatch here would
    // publish a page the page itself marks noindex.
    const mismatched = productCatalogItems
      .filter((product) => {
        const page = productPages.find(
          (candidate) => candidate.href === shopProductRoute(product.id)
        );
        return Boolean(page?.noindex) !== !isIndexableProduct(product);
      })
      .map((product) => product.id);

    expect(mismatched).toEqual([]);
  });
});

describe('product pages are reachable', () => {
  it('has no product page without a route into it', () => {
    // Every product is listed on the /shop/ browse hub, which is in the site nav, so
    // none of these is orphaned. This asserts the data behind that page covers them all.
    const browsable = new Set(productCatalogItems.map((product) => product.id));
    const unreachable = productPages
      .map((page) => page.href.replace('/shop/', '').replace(/\/$/, ''))
      .filter((id) => !browsable.has(id));

    expect(unreachable).toEqual([]);
  });

  it('links most products back to a guide that features them', () => {
    // `appearsOn` is what gives a detail page outbound internal links and what its share
    // image is derived from. A product on zero guides still builds, but a sharp rise here
    // means guides and the catalog have drifted apart.
    const pageMap = buildProductPageMap();
    const orphans = productCatalogItems.filter(
      (product) => (pageMap[product.id] ?? []).length === 0
    );

    expect(orphans.length).toBeLessThanOrEqual(5);
  });
});

describe('share images stay self-hosted', () => {
  it('never points a product preview at a merchant CDN', () => {
    // apply-first-page-image-og.mjs and site-smoke.test.ts both reject off-domain
    // og:image. Catch it here, where the failure names the product.
    const offDomain = productPages
      .filter((page) => /^https?:\/\//.test(page.preview.image))
      .map((page) => `${page.href} -> ${page.preview.image}`);

    expect(offDomain).toEqual([]);
  });
});
