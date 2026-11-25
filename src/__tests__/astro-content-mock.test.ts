/**
 * The astro:content mock feeds every unit test that builds the sitemap, related links
 * or homepage feed. If it silently dropped articles, those tests would pass over too
 * little data, so this pins it to the files on disk.
 */
import { readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { getCollection, loadArticleEntries } from './../__mocks__/astro-content';

const articleFiles = readdirSync(path.resolve(__dirname, '../content/articles')).filter((f) => /\.mdx?$/.test(f));

describe('astro:content mock', () => {
  it('loads one entry per article file', async () => {
    expect(articleFiles.length).toBeGreaterThan(0);
    const entries = await getCollection('articles');
    expect(entries.map((e) => e.id).sort()).toEqual(articleFiles.map((f) => f.replace(/\.mdx?$/, '')).sort());
  });

  it('parses the fields the sitemap depends on', () => {
    for (const entry of loadArticleEntries()) {
      expect(entry.data.title, entry.id).toEqual(expect.any(String));
      expect(entry.data.canonicalPath, entry.id).toMatch(/^\/[a-z0-9-/]+\/$/);
      expect(Number.isNaN(entry.data.pubDate.valueOf()), `${entry.id}: bad pubDate`).toBe(false);
    }
  });

  it('applies a getCollection filter like Astro does', async () => {
    const calming = await getCollection('articles', (e) => e.data.canonicalPath.startsWith('/calming/'));
    expect(calming.length).toBeGreaterThan(0);
    expect(calming.every((e) => e.data.canonicalPath.startsWith('/calming/'))).toBe(true);
  });
});
