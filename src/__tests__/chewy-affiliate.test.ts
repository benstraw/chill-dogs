import { mkdtemp, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createChewyAffiliateLink,
  createChewyAffiliateLinkWithBase,
} from '../lib/affiliate/chewy';
import { getChewyTrackingLinkFromImpact } from '../lib/affiliate/impact';
import {
  clearChewyCatalogCache,
  deleteChewyCatalogItemCache,
  writeChewyCatalogItemCache,
} from '../scripts/chewy-cache';
import { generateChewyAffiliateUrl, generateChewyCsv } from '../../scripts/chewy-link';

const originalEnv = { ...process.env };

beforeEach(() => {
  process.env = { ...originalEnv };
});

afterEach(() => {
  process.env = { ...originalEnv };
  vi.restoreAllMocks();
});

describe('Chewy affiliate link generation', () => {
  it('generates an affiliate link for a valid Chewy product URL', () => {
    process.env.CHEWY_IMPACT_BASE_URL = 'https://chewy.sjv.io/c/123/456/789';

    const link = createChewyAffiliateLink('https://www.chewy.com/example-product/dp/123456', {
      articleSlug: 'best-cooling-products',
      placement: 'product-card',
      campaign: 'summer',
    });

    const url = new URL(link);
    expect(url.origin + url.pathname).toBe('https://chewy.sjv.io/c/123/456/789');
    expect(url.searchParams.get('u')).toBe('https://www.chewy.com/example-product/dp/123456');
    expect(url.searchParams.get('subId1')).toBe('best-cooling-products');
    expect(url.searchParams.get('subId2')).toBe('product-card');
    expect(url.searchParams.get('subId3')).toBe('summer');
  });

  it('rejects non-Chewy URLs', () => {
    process.env.CHEWY_IMPACT_BASE_URL = 'https://chewy.sjv.io/c/123/456/789';

    expect(() => createChewyAffiliateLink('https://example.com/example-product/dp/123456')).toThrow(
      'https://www.chewy.com',
    );
  });

  it('rejects malformed URLs', () => {
    process.env.CHEWY_IMPACT_BASE_URL = 'https://chewy.sjv.io/c/123/456/789';

    expect(() => createChewyAffiliateLink('not a url')).toThrow('Invalid Chewy product URL');
  });

  it('strips UTM params from the Chewy destination URL', () => {
    const link = createChewyAffiliateLinkWithBase(
      'https://chewy.sjv.io/c/123/456/789',
      'https://www.chewy.com/example-product/dp/123456?utm_source=x&utm_medium=y&utm_campaign=z&utm_content=a&utm_term=b',
    );

    expect(new URL(link).searchParams.get('u')).toBe('https://www.chewy.com/example-product/dp/123456');
  });

  it('preserves useful Chewy params and existing Impact tracking params', () => {
    const link = createChewyAffiliateLinkWithBase(
      'https://chewy.sjv.io/c/123/456/789?irclickid=existing',
      'https://www.chewy.com/example-product/dp/123456?size=large&color=blue&utm_source=x',
    );
    const url = new URL(link);

    expect(url.searchParams.get('irclickid')).toBe('existing');
    expect(url.searchParams.get('u')).toBe(
      'https://www.chewy.com/example-product/dp/123456?size=large&color=blue',
    );
  });

  it('adds subId values only when provided', () => {
    const link = createChewyAffiliateLinkWithBase(
      'https://chewy.sjv.io/c/123/456/789',
      'https://www.chewy.com/example-product/dp/123456',
      { articleSlug: 'article', placement: '', campaign: undefined },
    );
    const url = new URL(link);

    expect(url.searchParams.get('subId1')).toBe('article');
    expect(url.searchParams.has('subId2')).toBe(false);
    expect(url.searchParams.has('subId3')).toBe(false);
  });

  it('throws a clear error when cached tracking base config is missing', () => {
    delete process.env.CHEWY_IMPACT_BASE_URL;

    expect(() => createChewyAffiliateLink('https://www.chewy.com/example-product/dp/123456')).toThrow(
      'Missing CHEWY_IMPACT_BASE_URL',
    );
  });

  it('does not double encode the Chewy destination URL', () => {
    const link = createChewyAffiliateLinkWithBase(
      'https://chewy.sjv.io/c/123/456/789',
      'https://www.chewy.com/example-product/dp/123456?size=large',
    );

    expect(link).toContain('u=https%3A%2F%2Fwww.chewy.com%2Fexample-product%2Fdp%2F123456%3Fsize%3Dlarge');
    expect(link).not.toContain('%253A%252F%252F');
    expect(new URL(link).searchParams.get('u')).toBe(
      'https://www.chewy.com/example-product/dp/123456?size=large',
    );
  });

  it('prefers retrieved Impact tracking links over cached env values', async () => {
    process.env.IMPACT_ACCOUNT_SID = 'sid';
    process.env.IMPACT_AUTH_TOKEN = 'token';
    process.env.CHEWY_IMPACT_CAMPAIGN_ID = 'campaign';
    process.env.CHEWY_IMPACT_AD_ID = 'ad';
    process.env.CHEWY_IMPACT_BASE_URL = 'https://cached.example/link';
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Response.json({ TrackingLink: 'https://official.example/track?existing=1' })),
    );

    const link = await generateChewyAffiliateUrl({
      chewyProductUrl: 'https://www.chewy.com/example-product/dp/123456',
    });

    const url = new URL(link);
    expect(url.origin + url.pathname).toBe('https://official.example/track');
    expect(url.searchParams.get('existing')).toBe('1');
  });
});

describe('Impact API helpers', () => {
  it('throws a clear error for failed Impact API requests', async () => {
    await expect(
      getChewyTrackingLinkFromImpact(
        { campaignId: 'campaign', adId: 'ad' },
        {
          accountSid: 'sid',
          authToken: 'token',
          fetchImpl: async () => new Response('Nope', { status: 500 }),
        },
      ),
    ).rejects.toThrow('HTTP 500');
  });

  it('throws a clear error for malformed Impact tracking responses', async () => {
    await expect(
      getChewyTrackingLinkFromImpact(
        { campaignId: 'campaign', adId: 'ad' },
        {
          accountSid: 'sid',
          authToken: 'token',
          fetchImpl: async () => Response.json({}),
        },
      ),
    ).rejects.toThrow('did not return a TrackingLink');
  });

  it('uses the Impact token UI Mediapartners path casing', async () => {
    let requestedUrl = '';

    await getChewyTrackingLinkFromImpact(
      { campaignId: 'campaign', adId: 'ad' },
      {
        accountSid: 'sid',
        authToken: 'token',
        fetchImpl: async (input) => {
          requestedUrl = input.toString();
          return Response.json({ TrackingLink: 'https://official.example/track' });
        },
      },
    );

    expect(requestedUrl).toContain('/Mediapartners/sid/Ads/ad/TrackingLink');
  });
});

describe('Chewy catalog cache', () => {
  it('normalizes catalog items and updates the manifest', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'chewy-cache-'));
    const cacheDir = join(dir, 'cache');
    const manifestPath = join(cacheDir, '_index.json');

    const entry = await writeChewyCatalogItemCache({
      cacheDir,
      manifestPath,
      fetchedAt: new Date('2026-06-01T00:00:00.000Z'),
      payload: {
        Id: 'catalog/123',
        CatalogItemId: 'chewy-123',
        Name: 'Cooling Mat',
        Description: 'A cool mat.',
        Url: 'https://chewy.sjv.io/product',
        ImageUrl: 'https://img.example/main.jpg',
        AdditionalImageUrls: ['https://img.example/2.jpg'],
        CurrentPrice: '19.99',
        StockAvailability: 'InStock',
        Gtin: '000123',
        Mpn: 'MPN123',
        Category: 'Dog Supplies',
      },
    });

    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
    expect(entry).toMatchObject({
      catalogItemId: 'chewy-123',
      name: 'Cooling Mat',
      imageUrl: 'https://img.example/main.jpg',
      currentPrice: '19.99',
      stockAvailability: 'InStock',
      provider: 'impact',
    });
    expect(manifest['chewy-123'].additionalImageUrls).toEqual(['https://img.example/2.jpg']);
    expect(await readFile(join(cacheDir, 'chewy-123.json'), 'utf8')).toContain('Cooling Mat');
  });

  it('deletes one cached catalog item and updates the manifest', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'chewy-cache-'));
    const cacheDir = join(dir, 'cache');
    const manifestPath = join(cacheDir, '_index.json');

    await writeChewyCatalogItemCache({
      cacheDir,
      manifestPath,
      payload: { CatalogItemId: 'chewy-123', Name: 'Cooling Mat' },
    });
    const deleted = await deleteChewyCatalogItemCache('chewy-123', cacheDir, manifestPath);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

    expect(deleted).toBe(true);
    expect(manifest['chewy-123']).toBeUndefined();
    await expect(readFile(join(cacheDir, 'chewy-123.json'), 'utf8')).rejects.toThrow();
  });

  it('clears cached catalog items and leaves an empty manifest', async () => {
    const dir = await mkdtemp(join(tmpdir(), 'chewy-cache-'));
    const cacheDir = join(dir, 'cache');
    const manifestPath = join(cacheDir, '_index.json');

    await writeChewyCatalogItemCache({
      cacheDir,
      manifestPath,
      payload: { CatalogItemId: 'chewy-123', Name: 'Cooling Mat' },
    });
    await writeChewyCatalogItemCache({
      cacheDir,
      manifestPath,
      payload: { CatalogItemId: 'chewy-456', Name: 'Cooling Pad' },
    });

    const deletedCount = await clearChewyCatalogCache(cacheDir, manifestPath);
    const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

    expect(deletedCount).toBe(2);
    expect(manifest).toEqual({});
    await expect(readFile(join(cacheDir, 'chewy-123.json'), 'utf8')).rejects.toThrow();
    await expect(readFile(join(cacheDir, 'chewy-456.json'), 'utf8')).rejects.toThrow();
  });
});

describe('Chewy CSV generation', () => {
  it('generates affiliate URLs for CSV rows', async () => {
    process.env.CHEWY_IMPACT_BASE_URL = 'https://chewy.sjv.io/c/123/456/789';

    const csv = await generateChewyCsv(
      'name,chewy_url,article_slug,placement\nCooling Mat,https://www.chewy.com/example-product/dp/123456,best-cooling-products,card\n',
    );

    expect(csv).toContain('name,chewy_url,article_slug,placement,affiliate_url');
    expect(csv).toContain('Cooling Mat');
    expect(csv).toContain('subId1=best-cooling-products');
    expect(csv).toContain('subId2=card');
  });
});
