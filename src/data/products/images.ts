/**
 * One place to ask "what images does this product have?".
 *
 * Three sources, in precedence order:
 *   1. `product.images` — a hand-authored override on the product record. Wins, so a
 *      human decision is never silently replaced by the admin tool's output.
 *   2. `productGalleries[product.id]` — the curated store written by `/admin/images/`.
 *      This is where multi-image galleries normally live.
 *   3. `product.image` — the single primary image every product already has.
 *
 * Always returns an array (empty only when a product has no image at all), so callers
 * can pass the result straight to `ProductImageFrame`.
 */

import { productGalleries } from '../product-galleries';
import type { ProductImage } from './types';

interface ImageBearingProduct {
  readonly id: string;
  readonly image?: ProductImage;
  readonly images?: readonly ProductImage[];
}

export function getProductImages(product: ImageBearingProduct): readonly ProductImage[] {
  if (product.images && product.images.length > 0) {
    return product.images;
  }

  const curated = productGalleries[product.id];
  if (curated && curated.length > 0) {
    return curated;
  }

  return product.image ? [product.image] : [];
}

/** True when a product has enough images for `ProductImageFrame` to show its thumbnail strip. */
export function hasGallery(product: ImageBearingProduct): boolean {
  return getProductImages(product).length >= 2;
}

/**
 * Distinct alt text per image.
 *
 * A gallery whose every image reads "K&H Cool Bed III" tells a screen reader nothing
 * about which one is showing, and gives search engines five identical strings. The
 * first image keeps the clean product name; the rest are numbered.
 */
export function defaultGalleryAlt(productName: string, index: number): string {
  return index === 0 ? productName : `${productName} — view ${index + 1}`;
}
