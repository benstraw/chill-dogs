/**
 * Product detail pages as built: reachability from /shop/, the converter contract on
 * the rendered page, and keeping noindex product URLs out of the XML sitemap.
 * Registry-level checks (no dist/ needed) stay in ../product-pages.test.ts and
 * ../product-slugs.test.ts.
 */

import { readdirSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { productCatalogItems } from '../../data/product-catalog';
import { noindexProductPaths } from '../../data/product-indexing';
import { shopProductRoute } from '../../data/routes';
import { SITE_ORIGIN, distRoot, readDist } from '../helpers/dist';

describe('product pages are reachable', () => {
  it('is linked from the /shop/ browse page', () => {
    // This asserts the built HTML, not the data behind it. An earlier version of this
    // test compared page ids against catalog ids, which is tautological — it passed
    // while all 214 pages were orphaned, reachable only from the XML sitemap and the
    // noindex admin sitemap. A bulk page set with no internal links is what search
    // engines treat as doorway pages.
    const html = readDist('shop/index.html');
    const linked = new Set(
      Array.from(html.matchAll(/href="(\/shop\/[a-z0-9][a-z0-9-]*\/)"/g)).map((match) => match[1])
    );

    const unlinked = productCatalogItems
      .map((product) => shopProductRoute(product.id))
      .filter((href) => !linked.has(href));

    expect(unlinked).toEqual([]);
  });

});

describe('converter contract on the built page', () => {
  const sample = ['kh-cool-bed-iii', 'thundershirt-classic', 'fi-series-3-plus'];

  function articleHtml(productId: string): string {
    const html = readDist(`shop/${productId}/index.html`);
    return /<article class="product-detail"[\s\S]*?<\/article>/.exec(html)?.[0] ?? '';
  }

  it('puts the affiliate disclosure before the CTA', () => {
    // Converter checklist: "Disclosure appears before product CTAs". The first version
    // of this page rendered it four sections below the CTA on all 214 pages.
    for (const productId of sample) {
      const article = articleHtml(productId);
      const disclosure = article.indexOf('class="disc');
      const cta = article.indexOf('data-affiliate="true"');

      expect(disclosure, `${productId}: no disclosure`).toBeGreaterThan(-1);
      expect(cta, `${productId}: no affiliate CTA`).toBeGreaterThan(-1);
      expect(disclosure, `${productId}: disclosure must precede the CTA`).toBeLessThan(cta);
    }
  });

  it('keeps one affiliate CTA block, with no share action competing beside it', () => {
    for (const productId of sample) {
      const article = articleHtml(productId);
      const cta = article.indexOf('data-affiliate="true"');
      const pinterest = article.indexOf('pinterest_save_click');

      // Pinterest is a share action, not a conversion. It belongs below the fold, after
      // the CTA has had its chance.
      if (pinterest > -1) {
        expect(pinterest, `${productId}: Pinterest save must sit after the CTA`).toBeGreaterThan(cta);
      }
    }
  });

  it('offers related guides from the product\'s own pillar', () => {
    // currentHref used to be ROUTES.shop, so every product got the same four links under
    // a heading naming its pillar — "More Cooling Guides" linking to fireworks.
    const cooling = articleHtml('kh-cool-bed-iii');
    const strip = /<nav class="ils[\s\S]*?<\/nav>/.exec(cooling)?.[0] ?? '';
    const links = Array.from(strip.matchAll(/href="([^"]+)"/g)).map((match) => match[1]);

    expect(links.length).toBeGreaterThan(0);
    expect(links.some((href) => href.startsWith('/cooling/'))).toBe(true);
  });

  it('never offers another product page as a related guide', () => {
    for (const productId of sample) {
      const strip = /<nav class="ils[\s\S]*?<\/nav>/.exec(articleHtml(productId))?.[0] ?? '';
      expect(
        Array.from(strip.matchAll(/href="(\/shop\/[a-z0-9-]+\/)"/g)).map((m) => m[1]),
        `${productId}: related guides should be guides`
      ).toEqual([]);
    }
  });
});

describe('noindex pages stay off the sitemap', () => {
  it('never submits a product URL that carries noindex', () => {
    // Submitting a URL while telling crawlers not to index it is an error in
    // Search Console, not a warning. llms.txt always filtered on noindex; the
    // XML sitemap did not, so all 214 product pages were being submitted
    // including the 19 thin ones.
    // Every sitemap shard, not only sitemap-0.xml: the index splits past 45k URLs.
    const submitted = readdirSync(distRoot)
      .filter((name) => /^sitemap-\d+\.xml$/.test(name))
      .flatMap((name) => [...readDist(name).matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]));
    expect(submitted.length).toBeGreaterThan(0);

    const submittedProducts = submitted.filter((url) => /\/shop\/[^/]+\/$/.test(url));
    const noindexProducts = [...noindexProductPaths()];

    for (const routePath of noindexProducts) {
      expect(submitted).not.toContain(`${SITE_ORIGIN}${routePath}`);
    }

    // While the switch is off that is the whole catalog; the browse page stays.
    expect(submittedProducts).toEqual([]);
    expect(submitted).toContain(`${SITE_ORIGIN}/shop/`);
  });
});
