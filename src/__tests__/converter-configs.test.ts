/**
 * Invariants over every data-driven converter config. These replace hard-coded
 * per-page product-id lists, which had to be edited with every product swap and still
 * missed the bug that matters: a page whose ItemList schema advertises products the
 * page does not show, or a product id that no longer exists.
 */
import { describe, expect, it } from 'vitest';

import { buildCalmingItemListSchema, calmingConverterPages, getCalmingConverterPageConfig } from '../data/calming-converter-pages';
import { coolingConverterPageConfigs, getCoolingConverterPageConfig } from '../data/cooling-converter-pages';
import { buildFleaTickItemListSchema, fleaTickConverterPages } from '../data/flea-tick-converter-pages';
import { productCatalogItems } from '../data/product-catalog';
import {
  buildRelaxationItemListSchema,
  getRelaxationConverterPageConfig,
  relaxationConverterPages,
} from '../data/relaxation-converter-pages';
import { getCompleteSitemapPages } from '../data/sitemap-inventory';

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

describe('converter config lookups', () => {
  // Replaces per-page pins (cooling- and calming-converter-pages.test.ts) with rules
  // that hold for every config.
  const lookups = [
    ['cooling', coolingConverterPageConfigs, getCoolingConverterPageConfig],
    ['calming', calmingConverterPages, getCalmingConverterPageConfig],
    ['relaxation', relaxationConverterPages, getRelaxationConverterPageConfig],
  ] as const;

  it.each(lookups)('%s: every config answers to its own slug, and unknown slugs throw', (name, map, get) => {
    const slugs = Object.keys(map);
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) expect((get as (s: string) => { pageSlug: string })(slug).pageSlug).toBe(slug);
    expect(() => (get as (s: string) => unknown)('no-such-slug')).toThrow(`Missing ${name} converter page config for slug: no-such-slug`);
  });

  it('points every internal hero secondary CTA at a registered page', async () => {
    const registered = new Set((await getCompleteSitemapPages()).map((page) => page.href));
    const ctas = [
      ...Object.entries(coolingConverterPageConfigs).map(([slug, c]) => [slug, c.secondaryCta?.href] as const),
      ...[calmingConverterPages, relaxationConverterPages, fleaTickConverterPages].flatMap((map) =>
        Object.entries(map).map(([slug, c]) => [slug, (c as { hero: { secondaryCta?: { href: string } } }).hero.secondaryCta?.href] as const)
      ),
    ].filter(([, href]) => href?.startsWith('/'));
    expect(ctas.length).toBeGreaterThan(5);
    expect(ctas.filter(([, href]) => !registered.has(href!.split('#')[0])).map(([slug, href]) => `${slug} → ${href}`)).toEqual([]);
  });

  it('builds ItemList schema whose count matches its products', () => {
    const builders = [
      ...Object.values(calmingConverterPages).map((c) => [c.itemListSchema, buildCalmingItemListSchema] as const),
      ...Object.values(relaxationConverterPages).map((c) => [c.itemListSchema, buildRelaxationItemListSchema] as const),
      ...Object.values(fleaTickConverterPages).map((c) => [c.itemListSchema, buildFleaTickItemListSchema] as const),
    ].filter(([schema]) => schema);
    expect(builders.length).toBeGreaterThan(10);
    for (const [config, build] of builders) {
      const schema = (build as (c: unknown) => { '@type': string; numberOfItems: number; itemListElement: unknown[] })(config);
      expect(schema['@type']).toBe('ItemList');
      expect(schema.numberOfItems).toBe(config!.productIds.length);
      expect(schema.itemListElement).toHaveLength(schema.numberOfItems);
    }
  });
});
