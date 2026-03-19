/**
 * SEO meta tag length enforcement.
 *
 * Rules (based on search engine display limits):
 *   og:title       40–65 chars
 *   og:description 100–165 chars
 *
 * Requires a completed build in dist/ — run `bun run build` before this test.
 * These checks run as part of the full test suite via `bun run test`.
 */

import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

const distRoot = path.join(process.cwd(), 'dist');

const TITLE_MIN = 40;
const TITLE_MAX = 65;
const DESC_MIN = 100;
const DESC_MAX = 165;

interface PageMeta {
  route: string;
  title: string;
  description: string;
}

function walkHtml(dir: string): string[] {
  const out: string[] = [];
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkHtml(full));
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

function collectMeta(): PageMeta[] {
  const files = walkHtml(distRoot);
  const results: PageMeta[] = [];

  for (const file of files) {
    const html = readFileSync(file, 'utf8');
    if (html.includes('noindex')) continue;

    const route = file.replace(distRoot, '').replace('/index.html', '/').replace('.html', '/');
    const title = html.match(/<meta property="og:title" content="([^"]+)"/)?.[1] ?? '';
    const description = html.match(/<meta property="og:description" content="([^"]+)"/)?.[1] ?? '';

    results.push({ route, title, description });
  }

  return results.sort((a, b) => a.route.localeCompare(b.route));
}

describe('SEO meta tag lengths', () => {
  const pages = collectMeta();

  it('dist/ contains indexable pages to check', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it(`og:title is ${TITLE_MIN}–${TITLE_MAX} chars on all indexable pages`, () => {
    const violations = pages.filter(
      (p) => p.title.length < TITLE_MIN || p.title.length > TITLE_MAX
    );

    if (violations.length > 0) {
      const report = violations
        .map((p) => `  ${p.title.length} chars [${p.title.length < TITLE_MIN ? 'SHORT' : 'LONG '}]  ${p.route}\n    "${p.title}"`)
        .join('\n');
      expect.fail(`${violations.length} og:title violation(s):\n${report}`);
    }
  });

  it(`og:description is ${DESC_MIN}–${DESC_MAX} chars on all indexable pages`, () => {
    const violations = pages.filter(
      (p) => p.description.length < DESC_MIN || p.description.length > DESC_MAX
    );

    if (violations.length > 0) {
      const report = violations
        .map((p) => `  ${p.description.length} chars [${p.description.length < DESC_MIN ? 'SHORT' : 'LONG '}]  ${p.route}\n    "${p.description}"`)
        .join('\n');
      expect.fail(`${violations.length} og:description violation(s):\n${report}`);
    }
  });
});
