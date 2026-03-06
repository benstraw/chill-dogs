/**
 * Vercel Edge Function: PostHog first-party reverse proxy
 *
 * PostHog is initialized with api_host: '/api/sniff', so all event ingestion
 * (POST /api/sniff/e/, POST /api/sniff/flags/, etc.) and config/asset requests
 * are sent directly to this edge function, bypassing Vercel's CDN layer.
 *
 * Static JS assets (/api/sniff/static/*) are routed to us-assets.i.posthog.com;
 * all other requests go to us.i.posthog.com.
 */
export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const url = new URL(req.url);
  // Strip /api/sniff prefix to recover the PostHog-relative path
  const path = url.pathname.replace(/^\/api\/sniff\/?/, '');

  const isStatic = path.startsWith('static/');
  const baseUrl = isStatic
    ? 'https://us-assets.i.posthog.com'
    : 'https://us.i.posthog.com';
  const targetUrl = `${baseUrl}/${path}${url.search}`;

  const headers = new Headers(req.headers);
  headers.set('host', isStatic ? 'us-assets.i.posthog.com' : 'us.i.posthog.com');

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
