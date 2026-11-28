/**
 * The MDX paragraph fast pass (`scripts/lib/mdx-paragraph-check.ts`) may defer any file
 * to the full AST guard, but it must never accept a file the AST guard rejects:
 * content-guardrails.test.ts skips the parser for every file the fast pass accepts.
 *
 * This compares the two on every article. It lives in the dist tier, not the unit
 * tier, only because of cost: it runs the MDX compiler over all articles (~250 ms),
 * which is what the fast pass keeps out of `bun run test:unit`. It reads no dist/
 * files. CI and `bun run test` run it on every change, after the build has already
 * compiled every article.
 */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { hasSafeParagraphMarkup } from '../../../scripts/lib/mdx-paragraph-check';
import { mdxParagraphProblems } from '../../../scripts/lib/mdx-paragraphs';

describe('MDX paragraph fast pass vs the AST guard', () => {
  it('never accepts an article that the AST guard rejects', () => {
    const dir = path.resolve(__dirname, '../../content/articles');
    const files = readdirSync(dir).filter((file) => file.endsWith('.mdx'));
    expect(files.length).toBeGreaterThan(0);
    const drift = files.flatMap((file) => {
      const text = readFileSync(path.join(dir, file), 'utf8');
      if (!hasSafeParagraphMarkup(text)) return [];
      return mdxParagraphProblems(text).map((problem) => `${file}: ${problem}`);
    });
    expect(drift, 'hasSafeParagraphMarkup accepted these; tighten it so they defer to the AST guard').toEqual([]);
  });
});
