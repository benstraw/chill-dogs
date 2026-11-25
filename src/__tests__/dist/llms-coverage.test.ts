/**
 * llms.txt / XML sitemap alignment.
 *
 * llms.txt must list every page the XML sitemap exposes that is actually
 * indexable — no hand-curated subset, no stale omissions. The only permitted
 * gap is a sitemap URL whose built HTML carries a `noindex` robots directive.
 *
 * Requires a completed build in dist/ — run `bun run build` before this test.
 * These checks run as part of the full test suite via `bun run test`.
 */

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

import { distRoot, isNoindex as htmlIsNoindex, readDist } from '../helpers/dist';

function readSitemapUrls(): string[] {
  const files = readdirSync(distRoot).filter((name) => /^sitemap-\d+\.xml$/.test(name));
  if (files.length === 0) throw new Error('No dist/sitemap-*.xml found. Run `bun run build` first.');
  return files.flatMap((file) => Array.from(readDist(file).matchAll(/<loc>([^<]+)<\/loc>/g), (m) => m[1]));
}

function readLlmsUrls(): string[] {
  return Array.from(readDist('llms.txt').matchAll(/^- \[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gm), (m) => m[1]);
}

const toPathname = (url: string) => new URL(url).pathname;

/** Built HTML per sitemap route, read once. A sitemap URL with no built page is a failure. */
const htmlByPath = new Map<string, string>();
function pageHtml(pathname: string): string {
  let html = htmlByPath.get(pathname);
  if (html === undefined) {
    const rel = path.join(pathname, 'index.html');
    if (!existsSync(path.join(distRoot, rel))) throw new Error(`Sitemap lists ${pathname} but dist${rel} does not exist.`);
    html = readDist(rel);
    htmlByPath.set(pathname, html);
  }
  return html;
}

const isNoindex = (pathname: string) => htmlIsNoindex(pageHtml(pathname));

let sitemapPaths: string[];
let llmsPaths: string[];

beforeAll(() => {
  sitemapPaths = readSitemapUrls().map(toPathname).sort();
  llmsPaths = readLlmsUrls().map(toPathname).sort();
});

describe('llms.txt sitemap coverage', () => {
  it('emits a non-trivial index', () => {
    expect(llmsPaths.length).toBeGreaterThan(40);
  });

  it('lists every indexable page in the XML sitemap', () => {
    const indexable = sitemapPaths.filter((pathname) => !isNoindex(pathname));
    const missing = indexable.filter((pathname) => !llmsPaths.includes(pathname));

    expect(missing).toEqual([]);
  });

  it('lists no page that is absent from the XML sitemap', () => {
    const extra = llmsPaths.filter((pathname) => !sitemapPaths.includes(pathname));

    expect(extra).toEqual([]);
  });

  it('lists no noindex page', () => {
    const noindexed = llmsPaths.filter((pathname) => isNoindex(pathname));

    expect(noindexed).toEqual([]);
  });

  it('lists every article collector', () => {
    const articlePaths = sitemapPaths.filter((pathname) =>
      /"@type"\s*:\s*"(Article|BlogPosting)"/.test(pageHtml(pathname))
    );

    expect(articlePaths.length).toBeGreaterThan(0);
    expect(articlePaths.filter((pathname) => !llmsPaths.includes(pathname))).toEqual([]);
  });

  it('does not repeat a URL', () => {
    expect(new Set(llmsPaths).size).toBe(llmsPaths.length);
  });
});
