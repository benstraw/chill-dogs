import type { ProductCategory } from './cooling-products';
import { ROUTES } from './routes';

export type CoolingConverterCategory = Exclude<ProductCategory, 'bonus'>;

export interface CoolingConverterPageConfig {
  category: CoolingConverterCategory;
  pageSlug: string;
  columns: 2 | 3;
  secondaryCta?: { label: string; href: string };
  faqHeading?: string;
  linkStripHeading?: string;
}

export const coolingConverterPageConfigs: Record<string, CoolingConverterPageConfig> = {
  'cooling-mats': {
    category: 'cooling-mats',
    pageSlug: 'cooling-mats',
    columns: 3,
  },
  'cooling-bandanas': {
    category: 'cooling-bandanas',
    pageSlug: 'cooling-bandanas',
    columns: 2,
  },
  'cooling-vests': {
    category: 'cooling-vests',
    pageSlug: 'cooling-vests',
    columns: 3,
  },
  'freezable-dog-toys': {
    category: 'freezable-dog-toys',
    pageSlug: 'freezable-dog-toys',
    columns: 2,
  },
  'car-cooling-for-dogs': {
    category: 'car-cooling',
    pageSlug: 'car-cooling-for-dogs',
    columns: 2,
    secondaryCta: { label: 'Full Road Trip Guide', href: ROUTES.roadTrip },
    faqHeading: 'Car Cooling FAQ',
    linkStripHeading: 'More Cooling Guides',
  },
};

export function getCoolingConverterPageConfig(pageSlug: string): CoolingConverterPageConfig {
  const config = coolingConverterPageConfigs[pageSlug];
  if (!config) {
    throw new Error(`Missing cooling converter page config for slug: ${pageSlug}`);
  }

  return config;
}
