import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { normalizeIdSegment, SIGNUP_PLACEMENTS, signupId } from '../utils/email-signup';

describe('signupId', () => {
  it('names the placement and the page, so every form is told apart', () => {
    expect(signupId('article_inline', '/lifestyle/how-to-spend-time-with-dogs-without-owning-one/')).toBe(
      'email-signup-article-inline-lifestyle-how-to-spend-time-with-dogs-without-owning-one',
    );
    expect(signupId('footer', '/')).toBe('email-signup-footer-root');
    expect(signupId('subscribe_page', '/subscribe/')).toBe('email-signup-subscribe-page-subscribe');
  });

  it('gives the same page different ids per placement', () => {
    const ids = SIGNUP_PLACEMENTS.map((placement) => signupId(placement, '/calming/x/'));
    expect(new Set(ids).size).toBe(SIGNUP_PLACEMENTS.length);
  });

  it('normalizes empty and odd input', () => {
    expect(normalizeIdSegment('')).toBe('root');
    expect(normalizeIdSegment('/A b/C/')).toBe('a-b-c');
  });
});

describe('EmailSignup usages', () => {
  const root = path.resolve(__dirname, '../..');

  function sourceFiles(dir: string, out: string[] = []): string[] {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== '__tests__') sourceFiles(full, out);
      } else if (/\.(astro|mdx)$/.test(entry.name) && !full.endsWith('EmailSignup.astro')) out.push(full);
    }
    return out;
  }

  const usages = sourceFiles(path.join(root, 'src'))
    .map((file) => ({ file: path.relative(root, file), src: readFileSync(file, 'utf8') }))
    .filter(({ src }) => src.includes('<EmailSignup'));

  it('finds the signup forms', () => {
    expect(usages.map((u) => u.file)).toEqual(
      expect.arrayContaining(['src/components/Footer.astro', 'src/pages/index.astro', 'src/pages/subscribe/index.astro']),
    );
  });

  it('every usage passes an explicit, valid placement', () => {
    for (const { file, src } of usages) {
      const tags = [...src.matchAll(/<EmailSignup\b[\s\S]*?\/>/g)].map((m) => m[0]);
      expect(tags.length, file).toBeGreaterThan(0);
      for (const tag of tags) {
        const placement = tag.match(/placement="([^"]+)"/)?.[1];
        expect(SIGNUP_PLACEMENTS, `${file}: ${tag.slice(0, 80)}`).toContain(placement);
      }
    }
  });

  it('the subscribe page is labeled as itself, not as the homepage', () => {
    const subscribe = usages.find((u) => u.file === 'src/pages/subscribe/index.astro');
    expect(subscribe?.src).toMatch(/placement="subscribe_page"/);
  });
});
