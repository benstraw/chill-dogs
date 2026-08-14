/**
 * Builds a map of product ID → pages where the product appears.
 * Used by the admin product catalog and the shop browse page.
 */

import { coolingProducts, categoryMeta } from './cooling-products';
import { calmingProducts } from './calming-products';
import { emergencyProducts } from './emergency-products';
import { fleaTickProducts } from './flea-tick-products';
import { relaxationProducts } from './relaxation-products';
import { accessoryProducts, trackerProducts } from './tracking-products';
import { coolingConverterPageConfigs } from './cooling-converter-pages';
import { calmingConverterPages } from './calming-converter-pages';
import { relaxationConverterPages } from './relaxation-converter-pages';
import { fleaTickConverterPages } from './flea-tick-converter-pages';
import { ROUTES } from './routes';

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
  for (const p of emergencyProducts) map[p.id] = [];
  for (const p of fleaTickProducts) map[p.id] = [];

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

  const snakeBiteKitRef: PageRef = {
    label: 'Snake-Bite Emergency Kit for Dogs',
    href: ROUTES.dogSnakeBiteEmergencyKit,
  };
  for (const p of emergencyProducts) {
    addRef(map, p.id, snakeBiteKitRef);
  }

  // Every flea/tick converter reads its lineup off its own page config. Category
  // filters cannot express these pages: records are deliberately shared across them
  // (the grooming and tick tools appear on three), so a filter would either miss a
  // page or claim a product appears somewhere it does not.
  const fleaTickPageRefs: Record<string, PageRef> = {
    'best-natural-flea-and-tick-products-for-dogs': {
      label: 'Best Natural Flea and Tick Products for Dogs',
      href: ROUTES.naturalFleaTickProducts,
    },
    'best-flea-and-tick-products-for-dogs': {
      label: 'Best Flea and Tick Products for Dogs',
      href: ROUTES.fleaTickProducts,
    },
    'dog-bath-tools-for-flea-season': {
      label: 'Dog Bath Tools',
      href: ROUTES.fleaSeasonBathTools,
    },
  };

  for (const [slug, config] of Object.entries(fleaTickConverterPages)) {
    const ref = fleaTickPageRefs[slug];
    if (!ref) {
      throw new Error(`Missing product-page-map entry for flea/tick converter: ${slug}`);
    }

    for (const block of config.blocks) {
      if (block.kind === 'product_section') {
        for (const id of block.productIds) {
          addRef(map, id, ref);
        }
      }
    }
  }

  // Inline AffiliateLink in src/content/articles/safety-natural-flea-and-tick-prevention-for-dogs.mdx
  addRef(map, 'rinseroo-original', {
    label: 'Natural Flea and Tick Prevention for Dogs',
    href: ROUTES.naturalFleaTickPrevention,
  });

  return map;
}
