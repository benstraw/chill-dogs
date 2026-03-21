import { describe, expect, it } from 'vitest';

import {
  buildLlmsMarkdown,
  dedupeAndRankLinks,
  normalizePath,
  sectionForPath,
  shouldExcludePath,
  toAbsoluteUrl,
} from '../utils/llms';

describe('llms utilities', () => {
  it('excludes non-indexable paths', () => {
    expect(shouldExcludePath('/404/')).toBe(true);
    expect(shouldExcludePath('/content-sitemap/')).toBe(true);
    expect(shouldExcludePath('/cooling/v/a/')).toBe(true);
    expect(shouldExcludePath('/cooling/page/3/')).toBe(true);
    expect(shouldExcludePath('/cooling/cooling-mats/')).toBe(false);
  });

  it('groups routes by section mapping', () => {
    expect(sectionForPath('/cooling/cooling-mats/')).toBe('Cooling Guides');
    expect(sectionForPath('/calming/car-anxiety-for-dogs/')).toBe('Calming Guides');
    expect(sectionForPath('/travel/dog-road-trip-gear/')).toBe('Travel Guides');
    expect(sectionForPath('/about/')).toBe('About');
    expect(sectionForPath('/contact/')).toBe('About');
    expect(sectionForPath('/unknown/path/')).toBe('Core Pages');
  });

  it('deduplicates by path and keeps highest priority version', () => {
    const ranked = dedupeAndRankLinks([
      { title: 'Low', path: '/cooling/', explicitPriority: 100 },
      { title: 'High', path: '/cooling/', explicitPriority: 999 },
      { title: 'Home', path: '/' },
    ]);

    expect(ranked.length).toBe(2);
    expect(ranked[0].path).toBe('/');
    expect(ranked[1].title).toBe('High');
  });

  it('drops excluded paths and normalizes before dedup', () => {
    const ranked = dedupeAndRankLinks([
      { title: 'Home', path: '/' },
      { title: 'Privacy', path: '/privacy-policy/' },
      { title: '404', path: '/404/' },
      { title: 'A', path: '/cooling' },
      { title: 'B', path: '/cooling/' },
    ]);
    expect(ranked).toHaveLength(2);
    expect(ranked.map((r) => r.path)).toContain('/');
    expect(ranked.map((r) => r.path)).toContain('/cooling/');
  });

  it('builds markdown with absolute links and grouped sections', () => {
    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test description',
      shortParagraph: 'Quick summary paragraph.',
      baseUrl: 'https://www.chill-dogs.com/',
      links: [
        { title: 'Home', path: '/', description: 'Main page', explicitPriority: 1000 },
        { title: 'Cooling Hub', path: '/cooling/', description: 'Cooling index' },
        { title: 'Contact', path: '/contact/' },
      ],
      maxLinks: 40,
    });

    expect(markdown).toContain('# Chill-Dogs');
    expect(markdown).toContain('> Test description');
    expect(markdown).toContain('## Core Pages');
    expect(markdown).toContain('## Cooling Guides');
    expect(markdown).toContain('## About');
    expect(markdown).toContain('- [Home](https://www.chill-dogs.com/): Main page');
    expect(markdown).toContain('- [Cooling Hub](https://www.chill-dogs.com/cooling/): Cooling index');
    expect(markdown).toContain('- [Contact](https://www.chill-dogs.com/contact/)');
  });

  it('respects maxLinks and omits paragraph when not supplied', () => {
    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test',
      baseUrl: 'https://www.chill-dogs.com/',
      links: [
        { title: 'Home', path: '/' },
        { title: 'Cooling', path: '/cooling/' },
        { title: 'Calming', path: '/calming/' },
        { title: 'About', path: '/about/' },
        { title: 'Contact', path: '/contact/' },
      ],
      maxLinks: 2,
    });

    const linkLines = markdown.split('\n').filter((l) => l.startsWith('- ['));
    expect(linkLines).toHaveLength(2);

    // No shortParagraph — next non-empty line after description should be a section heading
    const lines = markdown.split('\n');
    const descIdx = lines.findIndex((l) => l.startsWith('> '));
    const nextNonEmpty = lines.slice(descIdx + 1).find((l) => l.trim() !== '');
    expect(nextNonEmpty).toMatch(/^## /);
  });

  it('produces header and description only for empty links', () => {
    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test',
      baseUrl: 'https://www.chill-dogs.com/',
      links: [],
    });
    expect(markdown).toContain('# Chill-Dogs');
    expect(markdown).toContain('> Test');
    expect(markdown).not.toContain('## ');
  });

  it('resolves absolute URLs from base + path', () => {
    expect(toAbsoluteUrl('https://www.chill-dogs.com', '/cooling/')).toBe('https://www.chill-dogs.com/cooling/');
  });
});

describe('normalizePath', () => {
  it('adds leading slash when missing', () => {
    expect(normalizePath('cooling/')).toBe('/cooling/');
  });

  it('adds trailing slash when missing', () => {
    expect(normalizePath('/cooling')).toBe('/cooling/');
  });

  it('returns already normalized path unchanged', () => {
    expect(normalizePath('/cooling/')).toBe('/cooling/');
  });
});
