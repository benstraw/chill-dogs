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

import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  PRODUCT_SECTION_TITLE,
  isProductDetailPage,
  staticSitemapSections,
  type SitemapPage,
} from '../data/content-sitemap';
import { productCatalogItems } from '../data/product-catalog';
import { buildProductPageMap } from '../data/product-page-map';
import { shopProductRoute } from '../data/routes';
import { getHomepageConverters } from '../utils/homepage-articles';
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
  it('is linked from the /shop/ browse page', () => {
    // This asserts the built HTML, not the data behind it. An earlier version of this
    // test compared page ids against catalog ids, which is tautological — it passed
    // while all 214 pages were orphaned, reachable only from the XML sitemap and the
    // noindex admin sitemap. A bulk page set with no internal links is what search
    // engines treat as doorway pages.
    const shopHtml = path.join(process.cwd(), 'dist/shop/index.html');
    if (!existsSync(shopHtml)) {
      throw new Error('No dist/shop/index.html found. Run `bun run build` first.');
    }

    const html = readFileSync(shopHtml, 'utf8');
    const linked = new Set(
      Array.from(html.matchAll(/href="(\/shop\/[a-z0-9][a-z0-9-]*\/)"/g)).map((match) => match[1])
    );

    const unlinked = productCatalogItems
      .map((product) => shopProductRoute(product.id))
      .filter((href) => !linked.has(href));

    expect(unlinked).toEqual([]);
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

describe('product pages stay out of guide surfaces', () => {
  it('keeps them off the homepage Compare picks list', () => {
    // getHomepageConverters() takes every `converter` in the inventory. Registering 214
    // product pages as converters put an individual product on the homepage next to
    // "Best Cooling Mats for Dogs"; by sheer count they would crowd it out entirely.
    const leaked = getHomepageConverters(50)
      .filter((converter) => /^\/shop\/[a-z0-9-]+\/$/.test(converter.href))
      .map((converter) => `${converter.href} (${converter.title})`);

    expect(leaked).toEqual([]);
  });

  it('identifies detail pages without matching the browse page itself', () => {
    const detail = productPages[0]!;
    expect(isProductDetailPage(detail)).toBe(true);

    const browse = staticSitemapSections
      .flatMap((section) => section.pages)
      .find((page) => page.href === '/shop/');
    expect(browse && isProductDetailPage(browse)).toBe(false);
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
