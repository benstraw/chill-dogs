/**
 * The admin image browser's URL handling.
 *
 * The bug this guards against shipped: appending `._SL500_` to a URL that already had a
 * modifier group produced `..._AC_SL1500_._SL500_.jpg`, which Amazon does not serve.
 * 86% of the local cache carries a modifier, so almost every image the tool offered was
 * a dead link — invisible because the three products seeded by hand were among the 14%
 * that were bare.
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  GALLERY_SIZE_MODIFIER,
  isAllowedImageHost,
  isSameMerchantImage,
  normalizeMerchantImageUrl,
} from '../utils/merchant-images';

const AMAZON = 'https://m.media-amazon.com/images/I';

describe('normalizeMerchantImageUrl', () => {
  it('adds the size modifier to a bare URL', () => {
    expect(normalizeMerchantImageUrl(`${AMAZON}/71n1Mod8sRL.jpg`)).toBe(
      `${AMAZON}/71n1Mod8sRL._SL500_.jpg`
    );
  });

  it('replaces an existing modifier group instead of chaining a second one', () => {
    const result = normalizeMerchantImageUrl(`${AMAZON}/81IWGNpchBL._AC_SL1500_.jpg`);

    expect(result).toBe(`${AMAZON}/81IWGNpchBL._SL500_.jpg`);
    expect(result).not.toContain('_AC_SL1500_._SL500_');
  });

  it('collapses a multi-part modifier chain to one group', () => {
    expect(
      normalizeMerchantImageUrl(`${AMAZON}/71bgbXfa7lL._AC_SY300_SX300_QL70_FMwebp_.jpg`)
    ).toBe(`${AMAZON}/71bgbXfa7lL._SL500_.jpg`);
  });

  it('is idempotent — normalising twice changes nothing', () => {
    const once = normalizeMerchantImageUrl(`${AMAZON}/81IWGNpchBL._AC_SL1500_.jpg`);
    expect(normalizeMerchantImageUrl(once)).toBe(once);
  });

  it('keeps base ids containing + and - intact', () => {
    expect(normalizeMerchantImageUrl(`${AMAZON}/71Om+cKd5XL.jpg`)).toBe(
      `${AMAZON}/71Om+cKd5XL._SL500_.jpg`
    );
    expect(normalizeMerchantImageUrl(`${AMAZON}/81FsAd-FaNS._AC_SL1500_.jpg`)).toBe(
      `${AMAZON}/81FsAd-FaNS._SL500_.jpg`
    );
  });

  it('leaves Chewy URLs alone', () => {
    const chewy =
      'https://image.chewy.com/catalog/general/images/moe/0696a596-5006-7f7d-8000-3095cbc414f4._AC_SS1800_V1_.jpg';
    expect(normalizeMerchantImageUrl(chewy)).toBe(chewy);
  });

  it('passes through anything it cannot parse', () => {
    expect(normalizeMerchantImageUrl('not a url')).toBe('not a url');
    expect(normalizeMerchantImageUrl('')).toBe('');
  });

  it('honours a custom modifier', () => {
    expect(normalizeMerchantImageUrl(`${AMAZON}/71n1Mod8sRL._AC_SL1500_.jpg`, '_SL1000_')).toBe(
      `${AMAZON}/71n1Mod8sRL._SL1000_.jpg`
    );
  });
});

describe('isSameMerchantImage', () => {
  it('matches a raw cache URL against its normalised tray form', () => {
    expect(
      isSameMerchantImage(`${AMAZON}/81IWGNpchBL._AC_SL1500_.jpg`, `${AMAZON}/81IWGNpchBL._SL500_.jpg`)
    ).toBe(true);
  });

  it('does not match different photos', () => {
    expect(
      isSameMerchantImage(`${AMAZON}/81IWGNpchBL._SL500_.jpg`, `${AMAZON}/71n1Mod8sRL._SL500_.jpg`)
    ).toBe(false);
  });
});

describe('isAllowedImageHost', () => {
  it('accepts the merchant CDNs actually in use', () => {
    expect(isAllowedImageHost(`${AMAZON}/71n1Mod8sRL.jpg`)).toBe(true);
    expect(isAllowedImageHost('https://image.chewy.com/catalog/x.jpg')).toBe(true);
  });

  it('rejects other hosts and non-https', () => {
    expect(isAllowedImageHost('https://evil.example.com/x.jpg')).toBe(false);
    expect(isAllowedImageHost('http://m.media-amazon.com/images/I/x.jpg')).toBe(false);
    expect(isAllowedImageHost('javascript:alert(1)')).toBe(false);
    expect(isAllowedImageHost('')).toBe(false);
  });
});

describe('against the real Amazon cache', () => {
  const cacheDir = path.join(process.cwd(), 'src/data/amazon-products');

  function cachedImageUrls(): string[] {
    const urls: string[] = [];
    for (const file of readdirSync(cacheDir)) {
      if (!file.endsWith('.json') || file.includes('_index')) continue;
      const data = JSON.parse(readFileSync(path.join(cacheDir, file), 'utf8'));

      // Two provider shapes are cached: SearchAPI nests {link}, SerpAPI gives raw URLs.
      const searchApi = data?.product?.images;
      if (Array.isArray(searchApi)) {
        urls.push(...searchApi.map((image: { link: string }) => image.link).filter(Boolean));
        continue;
      }
      const serpApi = data?.product_results?.thumbnails;
      if (Array.isArray(serpApi)) urls.push(...serpApi.filter(Boolean));
    }
    return urls;
  }

  it('normalises every cached image to exactly one modifier group', () => {
    const urls = cachedImageUrls();
    expect(urls.length).toBeGreaterThan(1000);

    const chained = urls
      .map((url) => normalizeMerchantImageUrl(url))
      .filter((url) => {
        const filename = url.split('/').pop() ?? '';
        // base + one modifier group + extension = exactly 3 dot-separated parts.
        return filename.split('.').length !== 3;
      });

    expect(chained.slice(0, 10)).toEqual([]);
  });

  it('produces the size modifier the gallery store expects', () => {
    const sample = cachedImageUrls().slice(0, 200);
    const wrongSize = sample
      .map((url) => normalizeMerchantImageUrl(url))
      .filter((url) => !url.includes(`.${GALLERY_SIZE_MODIFIER}.`));

    expect(wrongSize).toEqual([]);
  });
});
