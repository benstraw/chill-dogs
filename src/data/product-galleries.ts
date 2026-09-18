/**
 * Curated multi-image galleries, keyed by product id.
 *
 * WRITTEN BY A TOOL. `bun run admin:serve` rewrites this file wholesale when you save
 * a selection in `/admin/images/`. Hand edits survive (the writer reformats from the
 * parsed data, it does not append), but the formatting is normalised on every save.
 *
 * Why a separate file rather than `images: [...]` inside each product record: a machine
 * can regenerate one whole file deterministically, but patching a TypeScript object
 * literal in place is fragile and risks corrupting hand-written editorial copy. Product
 * records stay hand-authored; galleries live here.
 *
 * This is curated data, not fetched data. The admin browser proposes candidates from the
 * Amazon cache, but nothing lands here without someone picking it — provider metadata
 * must never auto-overwrite images (see CLAUDE.md).
 *
 * Read this through `getProductImages()` in `src/data/products/images.ts`, never directly:
 * a record-level `images` override wins over this store, and single-image products need
 * the fallback to `image`.
 */

import type { ProductImage } from './products/types';

export const productGalleries: Readonly<Record<string, readonly ProductImage[]>> = {
  'arf-pets-self-cooling-mat': [
    { src: 'https://m.media-amazon.com/images/I/71JPOml6KrL._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat' },
    { src: 'https://m.media-amazon.com/images/I/71hO1uOTPfL._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 2' },
    { src: 'https://m.media-amazon.com/images/I/81ytzUB53tS._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 3' },
    { src: 'https://m.media-amazon.com/images/I/91eq0jE6WRS._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 4' },
    { src: 'https://m.media-amazon.com/images/I/81FsAd-FaNS._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 5' },
    { src: 'https://m.media-amazon.com/images/I/61rvG3bjROS._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 6' },
    { src: 'https://m.media-amazon.com/images/I/51oIzHyEYvS._SL500_.jpg', alt: 'Arf Pets Self Cooling Mat — view 7' },
  ],
  'green-pet-shop-cooling-pad': [
    { src: 'https://m.media-amazon.com/images/I/71n1Mod8sRL._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad' },
    { src: 'https://m.media-amazon.com/images/I/71MXHIDpUBL._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad — view 2' },
    { src: 'https://m.media-amazon.com/images/I/71Om+cKd5XL._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad — view 3' },
    { src: 'https://m.media-amazon.com/images/I/81cKDlNKZ+L._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad — view 4' },
    { src: 'https://m.media-amazon.com/images/I/71D6hq8Mn6L._SL500_.jpg', alt: 'The Green Pet Shop Cooling Pet Pad — view 5' },
  ],
  'kh-cool-bed-iii': [
    { src: 'https://m.media-amazon.com/images/I/61xAcMN3KJL._SL500_.jpg', alt: 'K&H Cool Bed III' },
    { src: 'https://m.media-amazon.com/images/I/71nHNL9TV8L._SL500_.jpg', alt: 'K&H Cool Bed III — view 2' },
    { src: 'https://m.media-amazon.com/images/I/81PwNbMhfDL._SL500_.jpg', alt: 'K&H Cool Bed III — view 3' },
    { src: 'https://m.media-amazon.com/images/I/81x+gAB1lwL._SL500_.jpg', alt: 'K&H Cool Bed III — view 4' },
    { src: 'https://m.media-amazon.com/images/I/91On6DUWqTL._SL500_.jpg', alt: 'K&H Cool Bed III — view 5' },
    { src: 'https://m.media-amazon.com/images/I/81a9tab1fkS._SL500_.jpg', alt: 'K&H Cool Bed III — view 6' },
    { src: 'https://m.media-amazon.com/images/I/81adXGHA5cL._SL500_.jpg', alt: 'K&H Cool Bed III — view 7' },
    { src: 'https://m.media-amazon.com/images/I/81LImFJUBwS._SL500_.jpg', alt: 'K&H Cool Bed III — view 8' },
  ],
};
