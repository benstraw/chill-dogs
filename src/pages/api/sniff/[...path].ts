/**
 * Astro API Route (Vercel Edge): PostHog first-party reverse proxy
 *
 * PostHog is initialized with api_host: '/api/sniff', so all event ingestion
 * (POST /api/sniff/e/, POST /api/sniff/flags/, etc.) and config/asset requests
 * are routed here. The Vercel adapter deploys this as a Vercel Edge Function via
 * Build Output API v3 — which is required when @astrojs/vercel is used, since that
 * adapter does not include project-root api/ directory files in the build output.
 *
 * Static JS assets (/api/sniff/static/*) are routed to us-assets.i.posthog.com;
 * all other requests go to us.i.posthog.com.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const config = {
  runtime: 'edge',
};

export const ALL: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  // Strip /api/sniff prefix to recover the PostHog-relative path
  const path = url.pathname.replace(/^\/api\/sniff\/?/, '').replace(/^\//, '');

  const isStatic = path.startsWith('static/');
  const baseUrl = isStatic
    ? 'https://us-assets.i.posthog.com'
    : 'https://us.i.posthog.com';
  const targetUrl = `${baseUrl}/${path}${url.search}`;

  const headers = new Headers(request.headers);
  headers.set('host', isStatic ? 'us-assets.i.posthog.com' : 'us.i.posthog.com');

  const hasBody =
    !['GET', 'HEAD', 'OPTIONS', 'TRACE'].includes(request.method) && request.body != null;
  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body: hasBody ? request.body : null,
  });

  // Strip hop-by-hop headers that must not be forwarded through a proxy.
  const responseHeaders = new Headers(response.headers);
  ['transfer-encoding', 'connection', 'keep-alive'].forEach((h) => responseHeaders.delete(h));

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: responseHeaders,
  });
};
