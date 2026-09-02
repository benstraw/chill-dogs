/**
 * Self-hosted share images for `/shop/<id>/` product pages.
 *
 * og:image must be on chill-dogs.com. `scripts/apply-first-page-image-og.mjs` refuses
 * any other origin and `site-smoke.test.ts` fails the build on one, and hotlinking
 * Amazon's CDN for share cards is unreliable anyway — Pinterest and Facebook fetch these
 * server-side.
 *
 * There is no per-product OG card yet: `src/scripts/generate-og-images.mjs` walks
 * `src/pages/**\/*.astro` and never sees the dynamic `[product].astro` route, so no
 * `/og/shop-<id>.jpg` exists. Until one does, reuse the already-generated card for the
 * first guide that features the product — relevant, real, and on-domain — and fall back
 * to the site default.
 *
 * Build-time only. This reads `public/og/`, so never import it from a client `<script>`.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';

import { buildProductPageMap } from './product-page-map';
import { resolveAutoOgImagePath } from '@utils/og';

const DEFAULT_SHARE_IMAGE = '/og-default.jpg';

function firstExistingCard(hrefs: readonly string[]): string {
  for (const href of hrefs) {
    const candidate = resolveAutoOgImagePath({ pathname: href });
    if (candidate && existsSync(path.join(process.cwd(), 'public', candidate))) {
      return candidate;
    }
  }

  return DEFAULT_SHARE_IMAGE;
}

let cached: Map<string, string> | undefined;

/** Product id → share image path. Computed once; the `public/og/` set is static per build. */
export function productShareImages(): Map<string, string> {
  if (cached) return cached;

  const pageMap = buildProductPageMap();
  cached = new Map(
    Object.entries(pageMap).map(([productId, refs]) => [
      productId,
      firstExistingCard(refs.map((ref) => ref.href)),
    ])
  );

  return cached;
}

export function productShareImage(productId: string): string {
  return productShareImages().get(productId) ?? DEFAULT_SHARE_IMAGE;
}

const PIN_DIR = 'pins';

/**
 * The generated 1000×1500 Pinterest pin for a product, when one has been rendered.
 *
 * `PinterestSave` declares `width="1000" height="1500"` on its image — it was built for
 * a 2:3 pin. Handing it the raw square Amazon photo made every pin a bare catalogue shot
 * with no title or branding, in a ratio Pinterest crops. `bun run pins:gen` renders the
 * real thing into `public/pins/`; until a product has one, callers fall back to the
 * product photo so the button still works.
 *
 * Build-time only — reads `public/pins/`. Never import from a client `<script>`.
 */
export function productPinImage(productId: string): string | null {
  const candidate = `/${PIN_DIR}/${productId}.jpg`;
  return existsSync(path.join(process.cwd(), 'public', PIN_DIR, `${productId}.jpg`))
    ? candidate
    : null;
}
