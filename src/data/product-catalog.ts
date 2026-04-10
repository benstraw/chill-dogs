import { calmingProducts } from './calming-products';
import { coolingProducts } from './cooling-products';
import { relaxationProducts } from './relaxation-products';
import { accessoryProducts, trackerProducts } from './tracking-products';

export interface ProductCatalogItem {
  id: string;
  name: string;
  pillar: 'cooling' | 'calming' | 'comfort' | 'gear';
  category: string;
  asin?: string;
  amazonUrl: string;
  secondaryUrl?: string;
  secondaryLabel?: string;
  bullets: string[];
  bestFor: string;
  image?: { src: string; alt: string };
  coolingMethod?: string;
  sizingNote?: string;
  howItHelps?: string;
  whyItWorks?: string;
  considerIf?: string;
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
    bullets: [...product.bullets],
    source: 'src/data/cooling-products.ts',
  })),
  ...calmingProducts.map((product) => ({
    ...product,
    pillar: 'calming' as const,
    category: product.category,
    bullets: [...product.bullets],
    source: 'src/data/calming-products.ts',
  })),
  ...relaxationProducts.map((product) => ({
    ...product,
    pillar: 'comfort' as const,
    category: product.category,
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
    secondaryUrl: product.secondaryUrl,
    secondaryLabel: product.secondaryLabel,
    bullets: [...product.bullets],
    bestFor: product.best_for,
    image: product.image,
    whyItWorks: product.use_case,
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
    bullets: [product.note],
    bestFor: product.note,
    image: product.image,
    note: product.note,
    source: 'src/data/tracking-products.ts',
  })),
];
