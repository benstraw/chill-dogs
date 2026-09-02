import { describe, expect, it } from 'vitest';

import {
  buildLlmsMarkdown,
  dedupeAndRankLinks,
  normalizePath,
  rankLlmsLink,
  sectionForPath,
  shouldExcludePath,
  toAbsoluteUrl,
} from '../utils/llms';
import { EXCLUDED_DISCOVERY_FRAGMENTS } from '../data/discovery-exclusions';

describe('llms utilities', () => {
  it('excludes non-indexable paths', () => {
    expect(shouldExcludePath('/404/')).toBe(true);
    expect(shouldExcludePath('/admin/sitemap/')).toBe(true);
    expect(shouldExcludePath('/cooling/v/a/')).toBe(true);
    expect(shouldExcludePath('/cooling/page/3/')).toBe(true);
    expect(shouldExcludePath('/cooling/cooling-mats/')).toBe(false);
  });

  it('excludes every path the XML sitemap excludes', () => {
    for (const fragment of EXCLUDED_DISCOVERY_FRAGMENTS) {
      expect(shouldExcludePath(`${fragment}example/`)).toBe(true);
    }
  });

  it('keeps indexable informer pages that the XML sitemap keeps', () => {
    expect(shouldExcludePath('/affiliate-disclosure/')).toBe(false);
    expect(shouldExcludePath('/shelter-dog-charities/')).toBe(false);
    expect(shouldExcludePath('/shop/')).toBe(false);
    expect(shouldExcludePath('/articles/')).toBe(false);
  });

  it('groups routes by section mapping', () => {
    expect(sectionForPath('/cooling/cooling-mats/')).toBe('Cooling Guides');
    expect(sectionForPath('/calming/car-anxiety-for-dogs/')).toBe('Calming Guides');
    expect(sectionForPath('/comforting/best-calming-dog-beds/')).toBe('Comfort & Rest Guides');
    expect(sectionForPath('/gear/best-dog-gps-trackers/')).toBe('Gear & Tracking Guides');
    expect(sectionForPath('/safety/rattlesnake-safety-for-dogs/')).toBe('Safety Guides');
    expect(sectionForPath('/travel/dog-road-trip-gear/')).toBe('Travel Guides');
    expect(sectionForPath('/about/')).toBe('About');
    expect(sectionForPath('/contact/')).toBe('About');
    expect(sectionForPath('/affiliate-disclosure/')).toBe('About');
    expect(sectionForPath('/shop/')).toBe('Core Pages');
    expect(sectionForPath('/unknown/path/')).toBe('Core Pages');
  });

  it('ranks section collectors and converters above supporting articles', () => {
    const sectionCollector = rankLlmsLink({
      title: 'Cooling Relief',
      path: '/cooling/',
      pageKind: 'section-collector',
    });
    const converter = rankLlmsLink({
      title: 'Cooling Mats',
      path: '/cooling/cooling-mats/',
      pageKind: 'converter',
    });
    const article = rankLlmsLink({
      title: 'How Hot Is Too Hot',
      path: '/cooling/how-hot-is-too-hot-for-dogs/',
      pageKind: 'article-collector',
    });
    const informer = rankLlmsLink({
      title: 'About',
      path: '/about/',
      pageKind: 'informer',
    });

    expect(sectionCollector).toBeGreaterThan(converter);
    expect(converter).toBeGreaterThan(article);
    expect(article).toBeGreaterThan(informer);
  });

  it('lets an explicit priority override the page kind', () => {
    expect(
      rankLlmsLink({
        title: 'Best Cooling Products',
        path: '/cooling/best-cooling-products-for-dogs/',
        pageKind: 'converter',
        explicitPriority: 935,
      })
    ).toBe(935);
  });

  it('keeps home first regardless of page kind', () => {
    expect(rankLlmsLink({ title: 'Home', path: '/', pageKind: 'attractor' })).toBe(1000);
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

  it('emits every link when no maxLinks cap is supplied', () => {
    const links = Array.from({ length: 60 }, (_, index) => ({
      title: `Page ${index}`,
      path: `/cooling/page-${index}-guide/`,
    }));

    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test',
      baseUrl: 'https://www.chill-dogs.com/',
      links,
    });

    expect(markdown.split('\n').filter((line) => line.startsWith('- ['))).toHaveLength(60);
  });

  it('emits a section for every pillar', () => {
    const markdown = buildLlmsMarkdown({
      siteName: 'Chill-Dogs',
      description: 'Test',
      baseUrl: 'https://www.chill-dogs.com/',
      links: [
        { title: 'Home', path: '/' },
        { title: 'Cooling', path: '/cooling/' },
        { title: 'Calming', path: '/calming/' },
        { title: 'Comfort', path: '/comforting/' },
        { title: 'Gear', path: '/gear/' },
        { title: 'Safety', path: '/safety/what-to-do-if-your-dog-runs-away/' },
        { title: 'Travel', path: '/travel/dog-road-trip-gear/' },
        { title: 'About', path: '/about/' },
      ],
    });

    for (const section of [
      'Core Pages',
      'Cooling Guides',
      'Calming Guides',
      'Comfort & Rest Guides',
      'Gear & Tracking Guides',
      'Safety Guides',
      'Travel Guides',
      'About',
    ]) {
      expect(markdown).toContain(`## ${section}`);
    }
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
