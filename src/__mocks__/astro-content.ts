/**
 * Test stand-in for `astro:content` (aliased in vitest.config.ts).
 *
 * It loads the REAL article frontmatter from src/content/articles/*.mdx, so unit tests
 * that build the complete sitemap, related links or homepage feed see the 17+ real
 * articles. It used to return [], which meant every "complete sitemap" unit test ran
 * with no articles at all, and tests hand-stubbed article pages that drifted.
 *
 * Fidelity limits, on purpose: no schema validation (astro check and the build do
 * that), `ogImage` stays the raw frontmatter string instead of image metadata, and
 * `body` is the MDX source after the frontmatter. Tests that need specific fixtures
 * still use `vi.mock('astro:content', ...)` locally.
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';

const ARTICLES_DIR = path.resolve(__dirname, '../content/articles');

export interface MockArticleEntry {
  id: string;
  slug: string;
  collection: 'articles';
  body: string;
  data: Record<string, unknown> & { pubDate: Date; canonicalPath: string; title: string };
}

let cache: MockArticleEntry[] | undefined;

export function loadArticleEntries(): MockArticleEntry[] {
  if (cache) return cache;
  cache = readdirSync(ARTICLES_DIR)
    .filter((file) => file.endsWith('.mdx') || file.endsWith('.md'))
    .sort()
    .map((file) => {
      const source = readFileSync(path.join(ARTICLES_DIR, file), 'utf8');
      const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
      if (!match) throw new Error(`astro-content mock: ${file} has no frontmatter`);
      const data = parse(match[1]) as MockArticleEntry['data'];
      // YAML gives the date as a string; Astro's z.date() gives a Date at UTC midnight.
      data.pubDate = new Date(data.pubDate as unknown as string);
      const id = file.replace(/\.mdx?$/, '');
      return { id, slug: id, collection: 'articles' as const, body: source.slice(match[0].length), data };
    });
  return cache;
}

export async function getCollection(
  collection: string,
  filter?: (entry: MockArticleEntry) => unknown
): Promise<MockArticleEntry[]> {
  if (collection !== 'articles') return [];
  const entries = loadArticleEntries();
  return filter ? entries.filter(filter) : [...entries];
}

export type CollectionEntry<_C extends string = string> = MockArticleEntry;
