/**
 * Vercel Edge Function: PostHog first-party reverse proxy via /sniff/*
 *
 * Vercel's static CDN only handles GET/HEAD, so POST event calls from
 * PostHog (e.g. /sniff/e/, /sniff/decide/) would return 405 if handled
 * by a plain vercel.json rewrite alone. Routing through this edge function
 * ensures all HTTP methods are proxied to us.i.posthog.com.
 *
 * Static JS assets (/sniff/static/*) continue to use a direct CDN rewrite
 * in vercel.json since those are always GET requests.
 */
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  // Strip /api/sniff prefix to recover the PostHog-relative path
  const path = url.pathname.replace(/^\/api\/sniff\/?/, '');
  const targetUrl = `https://us.i.posthog.com/${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set('host', 'us.i.posthog.com');

  const hasBody = req.body != null && req.method !== 'GET' && req.method !== 'HEAD';
  const response = await fetch(targetUrl, {
    method: req.method,
    headers,
    body: hasBody ? req.body : null,
  });

  // Forward the upstream response, stripping hop-by-hop headers that must
  // not be forwarded through a proxy (transfer-encoding, connection, etc.).
  const responseHeaders = new Headers(response.headers);
  ['transfer-encoding', 'connection', 'keep-alive'].forEach((h) => responseHeaders.delete(h));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
}
