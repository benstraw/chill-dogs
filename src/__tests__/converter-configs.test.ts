/**
 * Invariants over every data-driven converter config. These replace hard-coded
 * per-page product-id lists, which had to be edited with every product swap and still
 * missed the bug that matters: a page whose ItemList schema advertises products the
 * page does not show, or a product id that no longer exists.
 */
import { describe, expect, it } from 'vitest';

import { calmingConverterPages } from '../data/calming-converter-pages';
import { fleaTickConverterPages } from '../data/flea-tick-converter-pages';
import { productCatalogItems } from '../data/product-catalog';
import { relaxationConverterPages } from '../data/relaxation-converter-pages';

type Block = { kind: string; productIds?: ReadonlyArray<string | { id: string }> };
type Config = { blocks: ReadonlyArray<Block>; itemListSchema?: { productIds: readonly string[] } };

const configs: Array<[string, Config]> = [
  ...Object.entries(calmingConverterPages),
  ...Object.entries(relaxationConverterPages),
  ...Object.entries(fleaTickConverterPages),
] as Array<[string, Config]>;

const catalogIds = new Set(productCatalogItems.map((product) => product.id));
const sectionIds = (config: Config) =>
  config.blocks
    .filter((block) => block.kind === 'product_section')
    .flatMap((block) => block.productIds ?? [])
    .map((ref) => (typeof ref === 'string' ? ref : ref.id));

describe('converter configs', () => {
  it('covers the converter pages', () => {
    expect(configs.length).toBeGreaterThan(10);
  });

  it.each(configs)('%s: shows only catalog products, each once', (_slug, config) => {
    const ids = sectionIds(config);
    expect(ids.length).toBeGreaterThan(0);
    expect(ids.filter((id) => !catalogIds.has(id)), 'unknown product ids').toEqual([]);
    expect(ids.filter((id, i) => ids.indexOf(id) !== i), 'duplicate product ids').toEqual([]);
  });

  it.each(configs.filter(([, config]) => config.itemListSchema))(
    '%s: ItemList schema lists exactly the products the page shows',
    (_slug, config) => {
      expect([...config.itemListSchema!.productIds].sort()).toEqual(sectionIds(config).sort());
    }
  );
});
