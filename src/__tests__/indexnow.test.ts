import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  buildSubmissionUrls,
  collectChangedPageUrls,
  isProductionVercelEnv,
  mapPageFileToUrl,
  normalizeOrigin,
} from '../../scripts/indexnow-lib.mjs';
import { runIndexNow } from '../../scripts/indexnow-submit.mjs';

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
    expect(mapPageFileToUrl('src/pages/admin/sitemap.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/privacy-policy.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/terms.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/subscribe/thanks.astro')).toBeNull();
    expect(mapPageFileToUrl('src/pages/subscribe/confirmed.astro')).toBeNull();
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

describe('indexnow-submit', () => {
  const quiet = () => {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    return vi.spyOn(console, 'warn').mockImplementation(() => {});
  };
  let distDir: string;
  beforeEach(() => {
    distDir = mkdtempSync(path.join(tmpdir(), 'indexnow-'));
  });
  afterEach(() => {
    vi.restoreAllMocks();
    rmSync(distDir, { recursive: true, force: true });
  });
  const prodEnv = () => ({ VERCEL_ENV: 'production', INDEXNOW_KEY: 'k3y', INDEXNOW_DIST_DIR: distDir });

  it('never fails the build when IndexNow is down', async () => {
    const warn = quiet();
    const fetchImpl = vi.fn(async () => {
      throw new Error('ECONNRESET');
    });

    await expect(runIndexNow({ env: prodEnv(), fetchImpl })).resolves.toBe('failed');
    expect(fetchImpl).toHaveBeenCalledOnce();
    expect(warn.mock.calls.flat().join(' ')).toContain('ECONNRESET');
  });

  it('treats an HTTP error the same way', async () => {
    quiet();
    const fetchImpl = vi.fn(async () => new Response('busy', { status: 503, statusText: 'Service Unavailable' }));
    await expect(runIndexNow({ env: prodEnv(), fetchImpl })).resolves.toBe('failed');
  });

  it('submits the sitemap with the key file in production', async () => {
    quiet();
    const fetchImpl = vi.fn(async (_url: string | URL | Request, _init?: RequestInit) => new Response('', { status: 200 }));
    await expect(runIndexNow({ env: prodEnv(), fetchImpl })).resolves.toBe('submitted');

    const body = JSON.parse(String(fetchImpl.mock.calls[0][1]?.body));
    expect(body).toMatchObject({ key: 'k3y', keyLocation: 'https://www.chill-dogs.com/k3y.txt' });
    expect(body.urlList).toContain('https://www.chill-dogs.com/sitemap-index.xml');
    expect(readFileSync(path.join(distDir, 'k3y.txt'), 'utf8')).toBe('k3y\n');
  });

  it('skips outside production and without a key, without calling out', async () => {
    quiet();
    const fetchImpl = vi.fn();
    await expect(runIndexNow({ env: { VERCEL_ENV: 'preview', INDEXNOW_KEY: 'k' }, fetchImpl })).resolves.toBe('skipped');
    await expect(runIndexNow({ env: { VERCEL_ENV: 'production' }, fetchImpl })).resolves.toBe('skipped');
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it('does not call out on a dry run', async () => {
    quiet();
    const fetchImpl = vi.fn();
    await expect(runIndexNow({ env: { ...prodEnv(), INDEXNOW_DRY_RUN: 'true' }, fetchImpl })).resolves.toBe('dry-run');
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
