/** Pure parsing helpers for newsletter-sync.ts, importable without its API calls. */

/** chill-dogs.com paths linked in a Markdown body, UTMs stripped, de-duplicated in order. */
export function linkedPaths(body = ''): string[] {
  const seen = new Set<string>();
  for (const m of body.matchAll(/https?:\/\/(?:www\.)?chill-dogs\.com(\/[^\s)"'>]*)/g)) {
    seen.add(m[1].split(/[?#]/)[0]);
  }
  return [...seen];
}

/** Distinct utm_source values in a body. */
export function utmSources(body = ''): string[] {
  return [...new Set([...body.matchAll(/utm_source=([\w-]+)/g)].map((m) => m[1]))];
}
