/**
 * Which product detail pages belong on public discovery surfaces.
 *
 * Deliberately alias-free: `astro.config.mjs` imports this to filter the XML
 * sitemap, and config is evaluated before the `@` path aliases it declares
 * exist.
 *
 * The XML sitemap previously honoured only `EXCLUDED_DISCOVERY_FRAGMENTS`, so
 * `noindex` pages were still submitted — contradictory signals that Search
 * Console reports as an error. llms.txt already filtered on `noindex`; this
 * closes the gap between the two surfaces.
 */
import { productCatalogItems } from './product-catalog';
import { shopProductRoute } from './routes';
import { isIndexableProduct } from '../utils/product-meta';

export function noindexProductPaths(): ReadonlySet<string> {
  return new Set(
    productCatalogItems
      .filter((product) => !isIndexableProduct(product))
      .map((product) => shopProductRoute(product.id))
  );
}
