/**
 * Builds a map of product ID → pages where the product appears.
 * Used by the admin product catalog and the shop browse page.
 */

import { coolingProducts, categoryMeta } from './cooling-products';
import { calmingProducts } from './calming-products';
import { relaxationProducts } from './relaxation-products';
import { accessoryProducts, trackerProducts } from './tracking-products';
import { coolingConverterPageConfigs } from './cooling-converter-pages';
import { calmingConverterPages } from './calming-converter-pages';
import { relaxationConverterPages } from './relaxation-converter-pages';

export interface PageRef {
  label: string;
  href: string;
}

type ProductPageMap = Record<string, PageRef[]>;

function cleanCoolingTitle(raw: string): string {
  return raw.replace(/\s*\(\d{4}\)\s*$/, '');
}

function addRef(map: ProductPageMap, productId: string, ref: PageRef) {
  if (!map[productId]) map[productId] = [];
  if (!map[productId].some((r) => r.href === ref.href)) {
    map[productId].push(ref);
  }
}

export function buildProductPageMap(): ProductPageMap {
  const map: ProductPageMap = {};

  for (const p of coolingProducts) map[p.id] = [];
  for (const p of calmingProducts) map[p.id] = [];
  for (const p of relaxationProducts) map[p.id] = [];
  for (const p of trackerProducts) map[p.id] = [];
  for (const p of accessoryProducts) map[p.id] = [];

  for (const [slug, config] of Object.entries(coolingConverterPageConfigs)) {
    const href = `/cooling/${slug}/`;
    const label = cleanCoolingTitle(categoryMeta[config.category].title);
    const products = coolingProducts.filter((p) => p.category === config.category);
    for (const p of products) {
      addRef(map, p.id, { label, href });
    }
  }

  for (const [slug, config] of Object.entries(calmingConverterPages)) {
    const href = `/calming/${slug}/`;
    const label = config.title;
    for (const block of config.blocks) {
      if (block.kind === 'product_section') {
        for (const id of block.productIds) {
          addRef(map, id, { label, href });
        }
      }
      if (block.kind === 'quick_picks') {
        for (const item of block.items) {
          addRef(map, item.productId, { label, href });
        }
      }
    }
  }

  for (const [slug, config] of Object.entries(relaxationConverterPages)) {
    const href = `/comforting/${slug}/`;
    const label = config.hero.title;
    for (const block of config.blocks) {
      if (block.kind === 'product_section') {
        for (const ref of block.productIds) {
          const id = typeof ref === 'string' ? ref : ref.id;
          addRef(map, id, { label, href });
        }
      }
      if (block.kind === 'quick_picks') {
        for (const item of block.items) {
          addRef(map, item.productId, { label, href });
        }
      }
    }
  }

  // Keep in sync with src/components/modules/RoadTripProducts.astro
  const roadTripRef: PageRef = { label: 'Dog Road Trip Gear', href: '/travel/dog-road-trip-gear/' };
  const roadTripProductIds = [
    'enovoe-car-window-shades',
    'onlynew-portable-fan',
    'ohmo-spill-proof-bowl',
    'thundershirt-classic',
    'greenies-calming-chews',
    'lukito-licking-mat',
    'onetigris-travel-dog-bed',
  ];
  for (const id of roadTripProductIds) {
    addRef(map, id, roadTripRef);
  }

  // Keep in sync with src/components/modules/CarCoolingArticleProducts.astro
  const keepCoolInCarRef: PageRef = {
    label: 'How to Keep a Dog Cool in a Car',
    href: '/cooling/keep-dog-cool-in-car/',
  };
  for (const p of coolingProducts.filter((p) => p.category === 'car-cooling')) {
    addRef(map, p.id, keepCoolInCarRef);
  }

  // Inline AffiliateLink in src/content/articles/calming-crate-training-for-dogs.mdx
  addRef(map, 'kindtail-pawd-collapsible-crate', {
    label: 'How to Crate Train Your Dog',
    href: '/calming/crate-training-for-dogs/',
  });

  const trackerComparisonRef: PageRef = { label: 'Best Dog GPS Trackers', href: '/gear/best-dog-gps-trackers/' };
  for (const p of trackerProducts) {
    addRef(map, p.id, trackerComparisonRef);
  }

  const garminTrackingRef: PageRef = { label: 'Garmin Dog Tracking Collars', href: '/gear/garmin-dog-tracking-collars/' };
  for (const p of trackerProducts.filter((product) => product.type === 'off-grid')) {
    addRef(map, p.id, garminTrackingRef);
  }

  const fiReviewRef: PageRef = { label: 'Fi Dog Collar Review', href: '/gear/fi-dog-collar-review/' };
  addRef(map, 'fi-series-3-plus', fiReviewRef);
  addRef(map, 'stunt-puppy-fi-collar', fiReviewRef);

  return map;
}
