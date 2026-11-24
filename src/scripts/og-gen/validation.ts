import { existsSync } from 'node:fs';
import path from 'node:path';

import type { SitemapPage } from '../../data/content-sitemap';

const HERO_NAME_MAX_LENGTH = 48;
const IMAGE_EXTENSION = /\.(?:avif|gif|jpe?g|png|webp)(?:$|[._?])/i;

function isDirectImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && IMAGE_EXTENSION.test(url.pathname);
  } catch {
    return false;
  }
}

/**
 * Most product images are merchant CDN URLs, but a product we photographed
 * ourselves is served straight out of `public/`. Accept a site-root-relative
 * path as long as the file is actually there — the generator reads it off disk
 * rather than fetching it. See `loadCachedImageDataUri` in cache.ts.
 */
function isLocalPublicImagePath(value: string): boolean {
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('..')) {
    return false;
  }
  if (!IMAGE_EXTENSION.test(value)) {
    return false;
  }

  return existsSync(path.join(process.cwd(), 'public', value.replace(/^\//, '')));
}

export function validateHeroProductPage(page: SitemapPage): string[] {
  const errors: string[] = [];
  const hero = page.heroProduct;

  if (!hero) {
    return errors;
  }

  if (!hero.image || !(isDirectImageUrl(hero.image) || isLocalPublicImagePath(hero.image))) {
    errors.push(
      `${page.href}: heroProduct.image must be a direct image URL or a path to a file in public/`,
    );
  }

  if (!hero.badge?.trim()) {
    errors.push(`${page.href}: heroProduct.badge is required`);
  }

  if (!hero.name?.trim()) {
    errors.push(`${page.href}: heroProduct.name is required`);
  } else if (hero.name.length > HERO_NAME_MAX_LENGTH) {
    errors.push(`${page.href}: heroProduct.name must be ${HERO_NAME_MAX_LENGTH} characters or fewer`);
  }

  return errors;
}

export function validateHeroProductPages(pages: SitemapPage[]): void {
  const errors = pages.flatMap((page) => validateHeroProductPage(page));

  if (errors.length > 0) {
    throw new Error(`Invalid heroProduct metadata:\n${errors.join('\n')}`);
  }
}

