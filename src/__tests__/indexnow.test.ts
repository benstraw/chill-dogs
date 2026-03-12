import { describe, expect, it } from 'vitest';
import {
  buildSubmissionUrls,
  collectChangedPageUrls,
  isProductionVercelEnv,
  mapPageFileToUrl,
  normalizeOrigin,
} from '../../scripts/indexnow-lib.mjs';

describe('indexnow-lib', () => {
  it('detects production Vercel environment', () => {
    expect(isProductionVercelEnv({ VERCEL_ENV: 'production' })).toBe(true);
    expect(isProductionVercelEnv({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isProductionVercelEnv({})).toBe(false);
  });

  it('normalizes origin by trimming trailing slash', () => {
    expect(normalizeOrigin('https://www.chill-dogs.com/')).toBe('https://www.chill-dogs.com');
    expect(normalizeOrigin('https://www.chill-dogs.com')).toBe('https://www.chill-dogs.com');
  });

  it('maps Astro page files to public URLs', () => {
    expect(mapPageFileToUrl('src/pages/index.astro')).toBe('https://www.chill-dogs.com/');
    expect(mapPageFileToUrl('src/pages/calming/index.astro')).toBe('https://www.chill-dogs.com/calming/');
    expect(mapPageFileToUrl('src/pages/calming/best-calming-products-for-anxious-dogs.astro'))
      .toBe('https://www.chill-dogs.com/calming/best-calming-products-for-anxious-dogs/');
  });

  it('excludes non-indexable page files', () => {
    expect(mapPageFileToUrl('src/pages/admin/products.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/content-sitemap.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/calming/v/[variant].astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/llms.txt.ts')).toBeNull();
  });

  it('collects deduped sorted URLs from changed files', () => {
    const urls = collectChangedPageUrls([
      'src/pages/calming/index.astro',
      'src/pages/calming/index.astro',
      'src/pages/admin/products.astro',
      'src/pages/cooling/index.astro',
    ]);

    expect(urls).toEqual([
      'https://www.chill-dogs.com/calming/',
      'https://www.chill-dogs.com/cooling/',
    ]);
  });

  it('selects changed URLs payload when available', () => {
    const result = buildSubmissionUrls({
      changedPageUrls: ['https://www.chill-dogs.com/calming/'],
      sitemapUrl: 'https://www.chill-dogs.com/sitemap-index.xml',
    });

    expect(result).toEqual({
      mode: 'changed_urls',
      urlList: ['https://www.chill-dogs.com/calming/'],
    });
  });

  it('falls back to sitemap payload when no changed URLs', () => {
    const result = buildSubmissionUrls({
      changedPageUrls: [],
      sitemapUrl: 'https://www.chill-dogs.com/sitemap-index.xml',
    });

    expect(result).toEqual({
      mode: 'sitemap_fallback',
      urlList: ['https://www.chill-dogs.com/sitemap-index.xml'],
    });
  });
});
