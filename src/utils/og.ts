import type { PageType } from '@utils/types';
import { PAGE_TYPE_CTA as OG_PAGE_TYPE_CTA } from '../config/og-cta.mjs';

interface OgHeadlineOptions {
  title?: string;
  seoTitle?: string;
  ogHeadline?: string;
}

interface OgCtaOptions {
  pageType?: PageType;
  ogCta?: string;
}

interface AutoOgOptions {
  pathname: string;
  noindex?: boolean;
}

const PAGE_TYPE_CTA: Record<PageType, string> = OG_PAGE_TYPE_CTA;

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
  const base = ogHeadline || seoTitle || title || 'chill-dogs';
  const cleaned = normalizeWhitespace(base)
    .replace(/\s*\|\s*Chill-?Dogs\s*$/i, '')
    .replace(/^Chill-?Dogs\s*[—|-]\s*/i, '');

  return clampOgText(cleaned || 'chill-dogs', 88);
}

export function deriveOgCta({ pageType, ogCta }: OgCtaOptions): string {
  if (ogCta) {
    return clampOgText(ogCta, 44);
  }

  const resolvedType = pageType || 'collector';
  return PAGE_TYPE_CTA[resolvedType];
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

export function isAutoOgEligible({ pathname, noindex = false }: AutoOgOptions): boolean {
  if (noindex) {
    return false;
  }

  if (pathname === '/404/' || pathname === '/404') {
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

  return `/og/${ogSlugFromPathname(options.pathname)}.png`;
}
