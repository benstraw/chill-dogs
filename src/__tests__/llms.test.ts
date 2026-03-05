import { describe, expect, it } from 'vitest';

import {
  buildLlmsMarkdown,
  dedupeAndRankLinks,
  sectionForPath,
  shouldExcludePath,
  toAbsoluteUrl,
} from '../utils/llms';

describe('llms utilities', () => {
  it('excludes non-indexable paths', () => {
    expect(shouldExcludePath('/404/')).toBe(true);
    expect(shouldExcludePath('/content-sitemap/')).toBe(true);
    expect(shouldExcludePath('/cooling/v/a/')).toBe(true);
    expect(shouldExcludePath('/blog/page/3/')).toBe(true);
    expect(shouldExcludePath('/cooling/cooling-mats/')).toBe(false);
  });

  it('groups routes by section mapping', () => {
    expect(sectionForPath('/cooling/cooling-mats/')).toBe('Cooling Guides');
    expect(sectionForPath('/calming/car-anxiety-for-dogs/')).toBe('Calming Guides');
    expect(sectionForPath('/travel/rhys-road-trip-chill-kit/')).toBe('Travel Guides');
    expect(sectionForPath('/about/')).toBe('About');
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

  it('builds markdown with absolute links and grouped sections', () => {
    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test description',
      shortParagraph: 'Quick summary paragraph.',
      baseUrl: 'https://chill-dogs.com/',
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
    expect(markdown).toContain('- [Home](https://chill-dogs.com/): Main page');
    expect(markdown).toContain('- [Cooling Hub](https://chill-dogs.com/cooling/): Cooling index');
    expect(markdown).toContain('- [Contact](https://chill-dogs.com/contact/)');
  });

  it('resolves absolute URLs from base + path', () => {
    expect(toAbsoluteUrl('https://chill-dogs.com', '/cooling/')).toBe('https://chill-dogs.com/cooling/');
  });
});
