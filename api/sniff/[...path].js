/**
 * Vercel Edge Function: PostHog first-party reverse proxy
 *
 * PostHog is initialized with api_host: '/api/sniff', so all event ingestion
 * (POST /api/sniff/e/, POST /api/sniff/flags/, etc.) and config requests
 * (GET /api/sniff/array/...) are sent directly to this edge function.
 *
 * Requests to /api/** on Vercel bypass the static CDN layer and are always
 * handled by compute, which is why this works for POST requests whereas a
 * plain vercel.json CDN rewrite to an external host would return 405.
 *
 * Static JS assets (GET /api/sniff/static/*) are intercepted before reaching
 * this function via the vercel.json CDN rewrite to us-assets.i.posthog.com.
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
