/**
 * Shared reader for the built site (dist/), used only by the dist test tier
 * (src/__tests__/dist/). Freshness is checked once per run by dist/global-setup.ts;
 * this module only reads.
 *
 * Everything here is string scanning on purpose: parsing 350 pages with a DOM costs
 * seconds, and the site-wide checks only need tags and attributes. Use a DOM for
 * page-specific behavior tests, on the one page they need.
 */

import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

export const projectRoot = path.resolve(__dirname, '../../..');
export const distRoot = path.join(projectRoot, 'dist');

/** The canonical origin the build bakes into canonical, og:image and sitemap URLs. */
export const SITE_ORIGIN = (process.env.PUBLIC_SITE_URL ?? 'https://www.chill-dogs.com').replace(/\/$/, '');

/**
 * Below this many HTML files, dist/ is not a real build (a partial or interrupted
 * one), and site-wide sweeps would pass vacuously over too few pages.
 */
export const MIN_BUILT_PAGES = 200;

export interface BuiltPage {
  /** Path relative to dist/, e.g. `cooling/index.html`. */
  rel: string;
  html: string;
}

function walk(dir: string, out: string[]) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
}

let cache: BuiltPage[] | undefined;

/** Every built HTML page, read once per test file and sorted by path. */
export function builtPages(): BuiltPage[] {
  if (!cache) {
    const files: string[] = [];
    walk(distRoot, files);
    cache = files
      .sort()
      .map((file) => ({ rel: path.relative(distRoot, file), html: readFileSync(file, 'utf8') }));
  }
  return cache;
}

export function readDist(rel: string): string {
  return readFileSync(path.join(distRoot, rel), 'utf8');
}

/** `cooling/index.html` → `/cooling/`; `404.html` → `/404.html`. */
export function routeOf(rel: string): string {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

const ANCHOR = /<a\b[^>]*>/g;
const LD_JSON = /<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi;
const ROBOTS = /<meta\b[^>]*name=["']robots["'][^>]*>/i;
const REFRESH = /http-equiv=['"]refresh['"]/i;

export function anchors(html: string): string[] {
  return html.match(ANCHOR) ?? [];
}

/** Attribute value from a single start tag. Attribute names must be literal-safe. */
export function attr(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`));
  return m ? (m[1] ?? m[2]) : undefined;
}

/** `<meta property|name="key" content="...">`, in either attribute order. */
export function metaContent(html: string, key: string): string | undefined {
  const re = new RegExp(`<meta\\b[^>]*(?:property|name)=["']${key.replace(/[.:]/g, '\\$&')}["'][^>]*>`, 'i');
  const tag = html.match(re)?.[0];
  return tag ? attr(tag, 'content') : undefined;
}

/** Raw text of every JSON-LD block, unparsed. */
export function jsonLdBlocks(html: string): string[] {
  return Array.from(html.matchAll(LD_JSON), (m) => m[1]);
}

/** True only when the robots meta tag says noindex — not when the word appears in copy. */
export function isNoindex(html: string): boolean {
  const tag = html.match(ROBOTS)?.[0];
  return Boolean(tag && /noindex/i.test(attr(tag, 'content') ?? ''));
}

/** Astro's generated redirect stub pages carry no real content. */
export function isRedirectStub(html: string): boolean {
  return REFRESH.test(html);
}

/** Decode the handful of entities Astro emits in attribute values. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(Number(dec)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}
