import type { SitemapPage } from '../../data/content-sitemap';

const HERO_NAME_MAX_LENGTH = 48;

function isDirectImageUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return /^https?:$/.test(url.protocol) && /\.(?:avif|gif|jpe?g|png|webp)(?:$|[._?])/i.test(url.pathname);
  } catch {
    return false;
  }
}

export function validateHeroProductPage(page: SitemapPage): string[] {
  const errors: string[] = [];
  const hero = page.heroProduct;

  if (!hero) {
    return errors;
  }

  if (!hero.image || !isDirectImageUrl(hero.image)) {
    errors.push(`${page.href}: heroProduct.image must be a direct image URL`);
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

