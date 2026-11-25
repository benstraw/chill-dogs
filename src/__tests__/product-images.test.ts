/**
 * Curated galleries (written by /admin/images/ via admin:serve) and the precedence
 * getProductImages() applies. Galleries are keyed by product id, so a renamed or
 * retired product would leave an orphaned gallery that silently never renders.
 */
import { describe, expect, it } from 'vitest';

import { productCatalogItems } from '../data/product-catalog';
import { productGalleries } from '../data/product-galleries';
import { defaultGalleryAlt, getProductImages, hasGallery } from '../data/products/images';
import { isAllowedImageHost } from '../utils/merchant-images';

const catalogIds = new Set(productCatalogItems.map((product) => product.id));

describe('curated product galleries', () => {
  const entries = Object.entries(productGalleries);

  it('has galleries to check', () => {
    expect(entries.length).toBeGreaterThan(0);
  });

  it('keys every gallery by a current product id', () => {
    expect(entries.map(([id]) => id).filter((id) => !catalogIds.has(id)), 'orphaned galleries').toEqual([]);
  });

  it('uses only allowed merchant image hosts, with alt text, and no repeats', () => {
    for (const [id, images] of entries) {
      expect(images.length, id).toBeGreaterThan(1);
      expect(images.filter((image) => !isAllowedImageHost(image.src)).map((image) => image.src), id).toEqual([]);
      expect(images.every((image) => image.alt.trim().length > 0), `${id}: empty alt`).toBe(true);
      expect(new Set(images.map((image) => image.src)).size, `${id}: repeated image`).toBe(images.length);
    }
  });

  it('is what the catalog renders for those products', () => {
    for (const product of productCatalogItems.filter((p) => productGalleries[p.id] && !p.images?.length)) {
      expect(getProductImages(product)).toBe(productGalleries[product.id]);
      expect(hasGallery(product)).toBe(true);
    }
  });
});

describe('getProductImages precedence', () => {
  const image = { src: 'https://m.media-amazon.com/images/I/one._SL500_.jpg', alt: 'One' };
  const override = [{ src: 'https://m.media-amazon.com/images/I/over._SL500_.jpg', alt: 'Override' }];
  const galleryId = Object.keys(productGalleries)[0];

  it('prefers a record-level override over the curated store', () => {
    expect(getProductImages({ id: galleryId, image, images: override })).toBe(override);
  });

  it('uses the curated store when there is no override', () => {
    expect(getProductImages({ id: galleryId, image })).toBe(productGalleries[galleryId]);
    expect(getProductImages({ id: galleryId, image, images: [] })).toBe(productGalleries[galleryId]);
  });

  it('falls back to the single image, then to nothing', () => {
    expect(getProductImages({ id: 'no-gallery', image })).toEqual([image]);
    expect(getProductImages({ id: 'no-gallery' })).toEqual([]);
    expect(hasGallery({ id: 'no-gallery', image })).toBe(false);
  });

  it('numbers alt text after the first image', () => {
    expect(defaultGalleryAlt('K&H Cool Bed III', 0)).toBe('K&H Cool Bed III');
    expect(defaultGalleryAlt('K&H Cool Bed III', 2)).toBe('K&H Cool Bed III — view 3');
  });
});
