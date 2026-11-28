import type { ImageMetadata } from 'astro';
import type { PageType } from '@utils/types';
import { ogCtaFor } from '../config/og-cta.mjs';

interface OgHeadlineOptions {
  title?: string;
  seoTitle?: string;
  ogHeadline?: string;
}

interface OgCtaOptions {
  pathname?: string;
  pageType?: PageType;
  isArticle?: boolean;
  ogCta?: string;
}

interface AutoOgOptions {
  pathname: string;
}

export type OgImageInput = string | ImageMetadata | null | undefined;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

export function clampOgText(text: string, maxChars: number): string {
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= maxChars) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxChars - 1);
  const safeBoundary = truncated.lastIndexOf(' ');
  const safeSlice = safeBoundary >= Math.floor(maxChars * 0.6)
    ? truncated.slice(0, safeBoundary)
    : truncated;

  return `${safeSlice.trimEnd()}…`;
}

export function deriveOgHeadline({ title, seoTitle, ogHeadline }: OgHeadlineOptions): string {
  const base = ogHeadline || seoTitle || title || 'Chill-Dogs';
  const cleaned = normalizeWhitespace(base)
    .replace(/\s*\|\s*Chill-?Dogs\s*$/i, '')
    .replace(/^Chill-?Dogs\s*[—|-]\s*/i, '');

  return clampOgText(cleaned || 'Chill-Dogs', 88);
}

/** The share-image button for a page, or '' for none. Rules live in `src/config/og-cta.mjs`. */
export function deriveOgCta(options: OgCtaOptions): string {
  return ogCtaFor(options);
}

export function ogSlugFromPathname(pathname: string): string {
  const cleanPath = pathname
    .trim()
    .replace(/\/+$/, '')
    .replace(/^\//, '');

  if (!cleanPath) {
    return 'home';
  }

  return cleanPath.replace(/\//g, '-');
}

export function isAutoOgEligible({ pathname }: AutoOgOptions): boolean {
  if (pathname === '/404/' || pathname === '/404') {
    return false;
  }

  if (pathname === '/privacy-policy/' || pathname === '/terms/') {
    return false;
  }

  if (pathname.startsWith('/admin/')) {
    return false;
  }

  if (pathname.includes('/v/')) {
    return false;
  }

  return true;
}

export function resolveAutoOgImagePath(options: AutoOgOptions): string | null {
  if (!isAutoOgEligible(options)) {
    return null;
  }

  return `/og/${ogSlugFromPathname(options.pathname)}.jpg`;
}

export function resolveProvidedOgImagePath(ogImage: OgImageInput): string | null {
  if (!ogImage) {
    return null;
  }

  return typeof ogImage === 'string' ? ogImage : ogImage.src;
}
