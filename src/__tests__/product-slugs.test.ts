/**
 * Product ids are public URLs.
 *
 * Every catalog product is built at `/shop/<id>/`, so an id is not a private key —
 * it is an indexed URL that Pinterest pins and Google results point at. Renaming a
 * product's `name` is free. Renaming its `id` silently 404s a live URL.
 *
 * `src/data/product-url-history.ts` is the append-only record of every id ever
 * published. These tests make the hazard enforceable rather than advisory.
 */

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { productCatalogItems } from '../data/product-catalog';
import { PUBLISHED_PRODUCT_IDS } from '../data/product-url-history';

const root = process.cwd();
const vercelJson = readFileSync(path.join(root, 'vercel.json'), 'utf8');
const astroConfig = readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');

const currentIds = productCatalogItems.map((product) => product.id);
const currentIdSet = new Set(currentIds);

/** `/shop/<id>/` — the public URL an id owns. */
function shopPath(id: string): string {
  return `/shop/${id}/`;
}

/** True when both redirect surfaces carry a rule for this retired path. */
function hasRedirect(retiredPath: string): { vercel: boolean; astro: boolean } {
  const withoutTrailingSlash = retiredPath.replace(/\/$/, '');
  return {
    vercel: vercelJson.includes(retiredPath) || vercelJson.includes(withoutTrailingSlash),
    astro: astroConfig.includes(retiredPath) || astroConfig.includes(withoutTrailingSlash),
  };
}

describe('product ids are unique and URL-safe', () => {
  it('has no duplicate ids across the whole catalog', () => {
    const seen = new Map<string, number>();
    for (const id of currentIds) {
      seen.set(id, (seen.get(id) ?? 0) + 1);
    }

    const duplicates = [...seen.entries()].filter(([, count]) => count > 1).map(([id]) => id);
    expect(duplicates, 'two products cannot share one /shop/ URL').toEqual([]);
  });

  it('uses lowercase kebab-case ids that need no URL encoding', () => {
    const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    const invalid = currentIds.filter((id) => !pattern.test(id));

    expect(
      invalid,
      'ids become URL path segments — no uppercase, spaces, or punctuation'
    ).toEqual([]);
  });
});

describe('published product URLs stay reachable', () => {
  it('has a redirect for every retired id', () => {
    const retired = PUBLISHED_PRODUCT_IDS.filter((id) => !currentIdSet.has(id));

    const missing = retired
      .map((id) => ({ id, redirect: hasRedirect(shopPath(id)) }))
      .filter(({ redirect }) => !redirect.vercel || !redirect.astro)
      .map(({ id, redirect }) => {
        const gaps = [
          !redirect.vercel ? 'vercel.json' : null,
          !redirect.astro ? 'astro.config.mjs' : null,
        ].filter(Boolean);
        return `${shopPath(id)} was published but no longer builds — add a redirect in ${gaps.join(' and ')}`;
      });

    expect(missing).toEqual([]);
  });

  it('records every current id in the history file', () => {
    const known = new Set(PUBLISHED_PRODUCT_IDS);
    const unrecorded = currentIds.filter((id) => !known.has(id)).sort();

    // Printed as paste-ready lines so the fix is mechanical rather than a hunt.
    const hint =
      unrecorded.length > 0
        ? `Add to PUBLISHED_PRODUCT_IDS in src/data/product-url-history.ts:\n${unrecorded
            .map((id) => `  '${id}',`)
            .join('\n')}`
        : '';

    expect(unrecorded, hint).toEqual([]);
  });

  it('keeps the history file append-only and sorted', () => {
    const sorted = [...PUBLISHED_PRODUCT_IDS].sort();
    expect(
      [...PUBLISHED_PRODUCT_IDS],
      'keep PUBLISHED_PRODUCT_IDS sorted so appends produce clean diffs'
    ).toEqual(sorted);

    const duplicates = PUBLISHED_PRODUCT_IDS.filter(
      (id, index) => PUBLISHED_PRODUCT_IDS.indexOf(id) !== index
    );
    expect(duplicates).toEqual([]);
  });
});
