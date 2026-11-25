/**
 * Both redirect surfaces, parsed and normalized: vercel.json (production) and
 * src/data/redirects.ts, which astro.config.mjs uses (dev, preview, and the static redirect stubs).
 * A retired public URL needs the same rule in both.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';

import { redirects as astroRedirectConfig } from '../../data/redirects';

export interface Redirect {
  destination: string;
  status: number;
}

const root = path.resolve(__dirname, '../../..');
const strip = (source: string) => (source.length > 1 ? source.replace(/\/$/, '') : source);

/** Keyed by source path without a trailing slash. */
export function vercelRedirects(): Map<string, Redirect> {
  const config = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8')) as {
    redirects?: Array<{ source: string; destination: string; statusCode?: number; permanent?: boolean }>;
  };
  const map = new Map<string, Redirect>();
  for (const r of config.redirects ?? []) {
    const status = r.statusCode ?? (r.permanent === false ? 307 : 308);
    map.set(strip(r.source), { destination: r.destination, status });
  }
  return map;
}

/** Keyed by source path without a trailing slash. Astro's static default is 301. */
export function astroRedirects(): Map<string, Redirect> {
  const map = new Map<string, Redirect>();
  for (const [source, value] of Object.entries(astroRedirectConfig)) {
    map.set(strip(source), typeof value === 'string' ? { destination: value, status: 301 } : value);
  }
  return map;
}

/** Raw vercel.json sources, to check both slash forms are present. */
export function vercelSources(): string[] {
  const config = JSON.parse(readFileSync(path.join(root, 'vercel.json'), 'utf8')) as { redirects?: Array<{ source: string }> };
  return (config.redirects ?? []).map((r) => r.source);
}
