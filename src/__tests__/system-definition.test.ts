/**
 * docs/system-definition.yaml is a source of truth (CLAUDE.md): it must list every
 * registered page and every redirect. Nothing checked that, and it had drifted to 2 of
 * 10 redirects.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { parse } from 'yaml';

import { getCompleteSitemapPages } from '../data/sitemap-inventory';
import { astroRedirects } from './helpers/redirects';

const system = parse(readFileSync(path.resolve(__dirname, '../../docs/system-definition.yaml'), 'utf8')).site_system as {
  page_inventory: Array<{ name: string; routes?: string[] }>;
  redirects: Array<{ from: string; to: string; status: number }>;
};

const strip = (p: string) => (p.length > 1 ? p.replace(/\/$/, '') : p);

describe('docs/system-definition.yaml', () => {
  it('lists every registered page under some page_inventory routes entry', async () => {
    const listed = new Set(system.page_inventory.flatMap((entry) => entry.routes ?? []));
    const pages = (await getCompleteSitemapPages())
      .map((page) => page.href)
      // Generated product pages are covered by the single "/shop/<product-id>/" entry.
      .filter((href) => !/^\/shop\/[^/]+\/$/.test(href));
    expect(pages.length).toBeGreaterThan(40);
    expect(pages.filter((href) => !listed.has(href)), 'add these routes to page_inventory').toEqual([]);
  });

  it('lists exactly the redirects in src/data/redirects.ts', () => {
    const documented = Object.fromEntries(system.redirects.map((r) => [strip(r.from), `${r.status} ${r.to}`]));
    const configured = Object.fromEntries([...astroRedirects()].map(([from, r]) => [from, `${r.status} ${r.destination}`]));
    expect(documented, 'keep the redirects section in sync with vercel.json / src/data/redirects.ts').toEqual(configured);
  });
});
