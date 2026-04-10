/**
 * Builds a map of product ID → pages where the product appears.
 * Used by the admin product catalog to show page references.
 */

import { coolingProducts, type ProductCategory } from './cooling-products';
import { calmingProducts } from './calming-products';
import { relaxationProducts } from './relaxation-products';
import { accessoryProducts, trackerProducts } from './tracking-products';
import { coolingConverterPageConfigs } from './cooling-converter-pages';
import { calmingConverterPages } from './calming-converter-pages';
import { relaxationConverterPages } from './relaxation-converter-pages';

interface PageRef {
  label: string;
  href: string;
}

type ProductPageMap = Record<string, PageRef[]>;

function addRef(map: ProductPageMap, productId: string, ref: PageRef) {
  if (!map[productId]) map[productId] = [];
  // Avoid duplicate hrefs
  if (!map[productId].some((r) => r.href === ref.href)) {
    map[productId].push(ref);
  }
}

export function buildProductPageMap(): ProductPageMap {
  const map: ProductPageMap = {};

  // Initialize all product IDs
  for (const p of coolingProducts) map[p.id] = [];
  for (const p of calmingProducts) map[p.id] = [];
  for (const p of relaxationProducts) map[p.id] = [];
  for (const p of trackerProducts) map[p.id] = [];
  for (const p of accessoryProducts) map[p.id] = [];

  // Cooling converter pages: each config maps a category to a page
  for (const [slug, config] of Object.entries(coolingConverterPageConfigs)) {
    const href = `/cooling/${slug}/`;
    const products = coolingProducts.filter((p) => p.category === config.category);
    for (const p of products) {
      addRef(map, p.id, { label: slug, href });
    }
  }

  // Cooling pillar page: shows all cooling products
  const coolingPillarRef: PageRef = { label: 'best-cooling-products-for-dogs', href: '/cooling/best-cooling-products-for-dogs/' };
  for (const p of coolingProducts) {
    addRef(map, p.id, coolingPillarRef);
  }

  // Calming converter pages: blocks contain explicit product IDs
  for (const [slug, config] of Object.entries(calmingConverterPages)) {
    const href = `/calming/${slug}/`;
    for (const block of config.blocks) {
      if (block.kind === 'product_section') {
        for (const id of block.productIds) {
          addRef(map, id, { label: slug, href });
        }
      }
      if (block.kind === 'quick_picks') {
        for (const item of block.items) {
          addRef(map, item.productId, { label: slug, href });
        }
      }
    }
  }

  // Relaxation converter pages: blocks contain explicit product IDs
  for (const [slug, config] of Object.entries(relaxationConverterPages)) {
    const href = `/comforting/${slug}/`;
    for (const block of config.blocks) {
      if (block.kind === 'product_section') {
        for (const id of block.productIds) {
          addRef(map, id, { label: slug, href });
        }
      }
      if (block.kind === 'quick_picks') {
        for (const item of block.items) {
          addRef(map, item.productId, { label: slug, href });
        }
      }
    }
  }

  // Road trip page: manually mapped based on the imports in that file
  const roadTripRef: PageRef = { label: 'dog-road-trip-gear', href: '/travel/dog-road-trip-gear/' };
  // car-cooling (all 4)
  for (const p of coolingProducts.filter((p) => p.category === 'car-cooling')) {
    addRef(map, p.id, roadTripRef);
  }
  // cooling-mats (first 2)
  const coolingMats = coolingProducts.filter((p) => p.category === 'cooling-mats');
  for (const p of coolingMats.slice(0, 2)) {
    addRef(map, p.id, roadTripRef);
  }
  // cooling-vests (first 2)
  const coolingVests = coolingProducts.filter((p) => p.category === 'cooling-vests');
  for (const p of coolingVests.slice(0, 2)) {
    addRef(map, p.id, roadTripRef);
  }
  // calming: anxiety-wraps (all), calming-treats (first 3), lick-mats (all)
  for (const p of calmingProducts.filter((p) => p.category === 'anxiety-wraps')) {
    addRef(map, p.id, roadTripRef);
  }
  const calmingTreats = calmingProducts.filter((p) => p.category === 'calming-treats');
  for (const p of calmingTreats.slice(0, 3)) {
    addRef(map, p.id, roadTripRef);
  }
  for (const p of calmingProducts.filter((p) => p.category === 'lick-mats')) {
    addRef(map, p.id, roadTripRef);
  }

  const trackerComparisonRef: PageRef = { label: 'best-dog-gps-trackers', href: '/gear/best-dog-gps-trackers/' };
  for (const p of trackerProducts) {
    addRef(map, p.id, trackerComparisonRef);
  }

  const fiReviewRef: PageRef = { label: 'fi-dog-collar-review', href: '/gear/fi-dog-collar-review/' };
  addRef(map, 'fi-series-3-plus', fiReviewRef);
  addRef(map, 'stunt-puppy-fi-collar', fiReviewRef);

  return map;
}
