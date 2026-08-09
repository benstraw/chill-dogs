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

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const distRoot = path.join(process.cwd(), 'dist');

function readSitemapUrls(): string[] {
  const files = readdirSync(distRoot).filter(
    (name) => /^sitemap-\d+\.xml$/.test(name)
  );

  if (files.length === 0) {
    throw new Error('No dist/sitemap-*.xml found. Run `bun run build` first.');
  }

  return files.flatMap((file) => {
    const xml = readFileSync(path.join(distRoot, file), 'utf8');
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
  });
}

function readLlmsUrls(): string[] {
  const llmsPath = path.join(distRoot, 'llms.txt');

  if (!existsSync(llmsPath)) {
    throw new Error('No dist/llms.txt found. Run `bun run build` first.');
  }

  const body = readFileSync(llmsPath, 'utf8');
  return Array.from(body.matchAll(/^- \[[^\]]*\]\((https?:\/\/[^)\s]+)\)/gm)).map(
    (match) => match[1]
  );
}

function toPathname(url: string): string {
  return new URL(url).pathname;
}

/** True when the built page for this route asks robots not to index it. */
function isNoindex(pathname: string): boolean {
  const htmlPath = path.join(distRoot, pathname, 'index.html');

  if (!existsSync(htmlPath)) {
    return false;
  }

  const html = readFileSync(htmlPath, 'utf8');
  const robots = html.match(/<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);
  return Boolean(robots && /noindex/i.test(robots[1]));
}

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
    const articlePaths = sitemapPaths.filter((pathname) => {
      const htmlPath = path.join(distRoot, pathname, 'index.html');
      if (!existsSync(htmlPath)) return false;
      return /"@type"\s*:\s*"(Article|BlogPosting)"/.test(readFileSync(htmlPath, 'utf8'));
    });

    expect(articlePaths.length).toBeGreaterThan(0);
    expect(articlePaths.filter((pathname) => !llmsPaths.includes(pathname))).toEqual([]);
  });

  it('does not repeat a URL', () => {
    expect(new Set(llmsPaths).size).toBe(llmsPaths.length);
  });
});
