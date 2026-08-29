import { calmingProducts } from './calming-products';
import { coolingProducts } from './cooling-products';
import { emergencyProducts } from './emergency-products';
import { fleaTickProducts } from './flea-tick-products';
import { getOffers } from './products/offers';
import type { AffiliateOffer } from './products/types';
import { relaxationProducts } from './relaxation-products';
import { accessoryProducts, trackerProducts } from './tracking-products';

export interface ProductCatalogItem {
  id: string;
  name: string;
  pillar: 'cooling' | 'calming' | 'comfort' | 'gear' | 'safety';
  category: string;
  asin?: string;
  amazonUrl?: string;
  offers: AffiliateOffer[];
  secondaryUrl?: string;
  secondaryLabel?: string;
  bullets: string[];
  image?: { src: string; alt: string };
  images?: readonly { src: string; alt: string }[];
  signalNote?: string;
  subscriptionNote?: string;
  note?: string;
  source: string;
}

export const productCatalogItems: ProductCatalogItem[] = [
  ...coolingProducts.map((product) => ({
    ...product,
    pillar: 'cooling' as const,
    category: product.category,
    offers: getOffers(product),
    bullets: [...product.bullets],
    source: 'src/data/cooling-products.ts',
  })),
  ...calmingProducts.map((product) => ({
    ...product,
    pillar: 'calming' as const,
    category: product.category,
    offers: getOffers(product),
    bullets: [...product.bullets],
    source: 'src/data/calming-products.ts',
  })),
  ...relaxationProducts.map((product) => ({
    ...product,
    pillar: 'comfort' as const,
    category: product.category,
    offers: getOffers(product),
    bullets: [...product.bullets],
    source: 'src/data/relaxation-products.ts',
  })),
  ...trackerProducts.map((product) => ({
    id: product.id,
    name: product.name,
    pillar: 'gear' as const,
    category: product.type,
    asin: product.asin,
    amazonUrl: product.amazonUrl,
    offers: getOffers(product),
    secondaryUrl: product.secondaryUrl,
    secondaryLabel: product.secondaryLabel,
    bullets: [...product.bullets],
    image: product.image,
    signalNote: product.signalNote,
    subscriptionNote: product.subscriptionNote,
    source: 'src/data/tracking-products.ts',
  })),
  ...accessoryProducts.map((product) => ({
    id: product.id,
    name: product.name,
    pillar: 'gear' as const,
    category: 'accessories',
    asin: product.asin,
    amazonUrl: product.amazonUrl,
    offers: getOffers(product),
    bullets: [product.note],
    image: product.image,
    note: product.note,
    source: 'src/data/tracking-products.ts',
  })),
  ...emergencyProducts.map((product) => ({
    id: product.id,
    name: product.name,
    pillar: 'gear' as const,
    category: product.category,
    asin: product.asin,
    amazonUrl: product.amazonUrl,
    offers: getOffers(product),
    bullets: [...product.bullets],
    bestFor: product.bestFor,
    image: product.image,
    sizingNote: product.sizingNote,
    howItHelps: product.howItHelps,
    considerIf: product.caution,
    whyItWorks: product.useCase,
    source: 'src/data/emergency-products.ts',
  })),
  ...fleaTickProducts.map((product) => ({
    id: product.id,
    name: product.name,
    pillar: 'safety' as const,
    category: product.category,
    asin: product.asin,
    amazonUrl: product.amazonUrl,
    offers: getOffers(product),
    bullets: [...product.bullets],
    image: product.image,
    note: product.howItWorks,
    source: 'src/data/flea-tick-products.ts',
  })),
];
