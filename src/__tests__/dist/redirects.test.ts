/**
 * Every redirect lands on a page that exists. A redirect to a retired page is a
 * redirect chain into a 404: the old URL's search equity goes nowhere.
 */
import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { SITE_ORIGIN, distRoot, readDist } from '../helpers/dist';
import { vercelRedirects } from '../helpers/redirects';

/** Same-site destination → built file, or null for an off-site destination. */
function builtTarget(destination: string): { file: string; hash: string } | null {
  const url = new URL(destination, `${SITE_ORIGIN}/`);
  if (url.origin !== SITE_ORIGIN) return null;
  return { file: path.join(url.pathname, 'index.html'), hash: url.hash.slice(1) };
}

describe('redirect destinations', () => {
  const redirects = [...vercelRedirects()];

  it('has redirects to check', () => {
    expect(redirects.length).toBeGreaterThan(0);
  });

  it('every same-site destination is a built page, and its #anchor exists', () => {
    const broken: string[] = [];
    for (const [source, { destination }] of redirects) {
      const target = builtTarget(destination);
      if (!target) continue;
      if (!existsSync(path.join(distRoot, target.file))) {
        broken.push(`${source} → ${destination}: no built page`);
      } else if (target.hash && !new RegExp(`\\sid="${target.hash}"`).test(readDist(target.file))) {
        broken.push(`${source} → ${destination}: no element with id="${target.hash}"`);
      }
    }
    expect(broken).toEqual([]);
  });

  it('never redirects to another redirect', () => {
    const sources = new Set(redirects.map(([source]) => source));
    const chains = redirects
      .filter(([, { destination }]) => sources.has(new URL(destination, `${SITE_ORIGIN}/`).pathname.replace(/\/$/, '')))
      .map(([source, { destination }]) => `${source} → ${destination}`);
    expect(chains).toEqual([]);
  });
});
