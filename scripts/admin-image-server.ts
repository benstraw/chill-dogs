/**
 * Local companion server for `/admin/images/`.
 *
 * Run it alongside `bun run dev`:
 *
 *   bun run admin:serve      # this server, on 127.0.0.1:4322
 *   bun run dev              # the site, on localhost:4321
 *
 * The admin image browser probes `/health` on load. When this is running, its Save
 * button writes `src/data/product-galleries.ts`; when it is not — production, where the
 * admin pages sit behind Basic Auth on a static build with no repo to write to — the
 * page falls back to copying a paste-ready snippet.
 *
 * Why a separate process rather than an Astro API route: the site is `output: 'static'`
 * with no adapter, so an on-demand endpoint would fail `astro build`. Keeping the writer
 * outside the site means the static build stays a static build.
 *
 * This is a development tool with write access to the repository. It binds to loopback
 * only, requires a localhost `Origin`, and validates every field before writing:
 * `productId` must be a real catalog product, and every image URL must be https on a
 * known merchant CDN. Do not expose it beyond the machine you are working on.
 */

import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { writeFileSync } from 'node:fs';
import path from 'node:path';

import { productCatalogItems } from '../src/data/product-catalog';
import { productGalleries } from '../src/data/product-galleries';
import { isAllowedImageHost } from '../src/utils/merchant-images';

const HOST = '127.0.0.1';
const PORT = 4322;
const GALLERY_FILE = path.join(process.cwd(), 'src/data/product-galleries.ts');

/** Dev origins allowed to talk to this server. Loopback only, by design. */
const ALLOWED_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

interface GalleryImage {
  src: string;
  alt: string;
}

const FILE_HEADER = `/**
 * Curated multi-image galleries, keyed by product id.
 *
 * WRITTEN BY A TOOL. \`bun run admin:serve\` rewrites this file wholesale when you save
 * a selection in \`/admin/images/\`. Hand edits survive (the writer reformats from the
 * parsed data, it does not append), but the formatting is normalised on every save.
 *
 * Why a separate file rather than \`images: [...]\` inside each product record: a machine
 * can regenerate one whole file deterministically, but patching a TypeScript object
 * literal in place is fragile and risks corrupting hand-written editorial copy. Product
 * records stay hand-authored; galleries live here.
 *
 * This is curated data, not fetched data. The admin browser proposes candidates from the
 * Amazon cache, but nothing lands here without someone picking it — provider metadata
 * must never auto-overwrite images (see CLAUDE.md).
 *
 * Read this through \`getProductImages()\` in \`src/data/products/images.ts\`, never directly:
 * a record-level \`images\` override wins over this store, and single-image products need
 * the fallback to \`image\`.
 */

import type { ProductImage } from './products/types';

export const productGalleries: Readonly<Record<string, readonly ProductImage[]>> = {
`;

/** Single-quoted TS string literal. */
function quote(value: string): string {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

/**
 * Regenerate the whole file from the in-memory map.
 *
 * Wholesale rather than in-place editing: reformatting from parsed data is deterministic
 * and cannot corrupt a neighbouring product's entry, which a regex patch could.
 */
function writeGalleries(galleries: Map<string, GalleryImage[]>): void {
  const body = [...galleries.entries()]
    .filter(([, images]) => images.length > 0)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([productId, images]) => {
      const rows = images
        .map((image) => `    { src: ${quote(image.src)}, alt: ${quote(image.alt)} },`)
        .join('\n');
      return `  ${quote(productId)}: [\n${rows}\n  ],`;
    })
    .join('\n');

  writeFileSync(GALLERY_FILE, `${FILE_HEADER}${body}\n};\n`, 'utf8');
}

const validProductIds = new Set(productCatalogItems.map((product) => product.id));

/** Returns an error string, or null when the payload is safe to write. */
function validate(payload: unknown): string | null {
  if (typeof payload !== 'object' || payload === null) return 'body must be an object';

  const { productId, images } = payload as { productId?: unknown; images?: unknown };

  if (typeof productId !== 'string' || !validProductIds.has(productId)) {
    return `unknown productId: ${String(productId)}`;
  }
  if (!Array.isArray(images)) return 'images must be an array';
  if (images.length > 24) return 'refusing more than 24 images for one product';

  for (const image of images) {
    if (typeof image?.src !== 'string' || typeof image?.alt !== 'string') {
      return 'each image needs a string src and alt';
    }
    if (!isAllowedImageHost(image.src)) {
      return `image host not allowed: ${image.src.slice(0, 80)}`;
    }
    if (image.alt.length > 300) return 'alt text is implausibly long';
  }

  return null;
}

// Seeded from the committed file so a save for one product does not drop the others.
const galleries = new Map<string, GalleryImage[]>(
  Object.entries(productGalleries).map(([id, images]) => [
    id,
    images.map((image) => ({ src: image.src, alt: image.alt })),
  ])
);

function corsHeaders(origin: string | null): Record<string, string> {
  if (!origin || !ALLOWED_ORIGIN.test(origin)) return {};
  return {
    'access-control-allow-origin': origin,
    'access-control-allow-methods': 'GET, POST, OPTIONS',
    'access-control-allow-headers': 'content-type',
  };
}

function send(
  response: ServerResponse,
  status: number,
  body: string,
  headers: Record<string, string>
): void {
  response.writeHead(status, { 'content-type': 'text/plain; charset=utf-8', ...headers });
  response.end(body);
}

function sendJson(
  response: ServerResponse,
  status: number,
  body: unknown,
  headers: Record<string, string>
): void {
  response.writeHead(status, { 'content-type': 'application/json', ...headers });
  response.end(JSON.stringify(body));
}

function readBody(request: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = '';
    request.on('data', (chunk) => {
      data += chunk;
      // Nothing legitimate approaches this; stop reading rather than buffer forever.
      if (data.length > 1_000_000) reject(new Error('body too large'));
    });
    request.on('end', () => resolve(data));
    request.on('error', reject);
  });
}

// node:http rather than Bun.serve: it needs no extra type package, and Bun runs it
// natively. The server is small enough that the nicer API is not worth a dependency.
const server = createServer(async (request, response) => {
  const origin = request.headers.origin ?? null;
  const cors = corsHeaders(origin);
  const url = new URL(request.url ?? '/', `http://${HOST}:${PORT}`);

  if (request.method === 'OPTIONS') {
    response.writeHead(204, cors);
    response.end();
    return;
  }

  if (url.pathname === '/health') {
    sendJson(response, 200, { ok: true, products: validProductIds.size }, cors);
    return;
  }

  if (url.pathname === '/gallery' && request.method === 'POST') {
    // A browser without an allowed Origin gets no CORS headers, but a non-browser client
    // ignores those — so check the origin itself before writing anything.
    if (origin && !ALLOWED_ORIGIN.test(origin)) {
      send(response, 403, 'origin not allowed', {});
      return;
    }

    let payload: unknown;
    try {
      payload = JSON.parse(await readBody(request));
    } catch {
      send(response, 400, 'invalid JSON', cors);
      return;
    }

    const error = validate(payload);
    if (error) {
      send(response, 400, error, cors);
      return;
    }

    const { productId, images } = payload as { productId: string; images: GalleryImage[] };

    // A single remaining image is not a gallery — store nothing and let
    // getProductImages() fall back to the product record's own `image`.
    if (images.length < 2) {
      galleries.delete(productId);
    } else {
      galleries.set(productId, images);
    }

    writeGalleries(galleries);
    console.log(`[admin] ${productId}: ${images.length} image(s) → src/data/product-galleries.ts`);

    sendJson(response, 200, { ok: true, productId, count: images.length }, cors);
    return;
  }

  send(response, 404, 'not found', cors);
});

server.listen(PORT, HOST, () => {
  console.log(`[admin] gallery writer listening on http://${HOST}:${PORT}`);
  console.log('[admin] open http://localhost:4321/admin/images/ with `bun run dev` running');
});
