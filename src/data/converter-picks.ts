/**
 * Data for `ConverterPicks`, the module that shows a converter's top picks inside an
 * article. Each adapter reads one converter's own data, so an article never holds a
 * copied list of product ids, and reuses that converter's own headings, so placing
 * the module adds no new copy.
 *
 * Relaxation-config converters: `getConverterSectionPicks` in relaxation-converter-pages.ts.
 * GPS trackers converter: `getTrackerTypePicks` below.
 */
import type { AffiliateOffer, ProductVariantGroup } from './products/types';
import { getTrackersByType, trackerConverterTitle, type TrackerType } from './tracking-products';

/** The fields the lean pick card (`RelaxationProductCard`) reads. */
export interface PickProduct {
  id: string;
  name: string;
  category: string;
  bullets: string[];
  asin?: string;
  amazonUrl?: string;
  offers?: AffiliateOffer[];
  variantGroup?: ProductVariantGroup;
  image?: { src: string; alt: string };
}

export interface ConverterPicksData {
  /** Heading over the picks: copy that already exists on the converter. */
  heading: string;
  /** The converter's title, for the "See all" link. */
  converterTitle: string;
  products: PickProduct[];
}

/** The GPS converter's sections, in page order. */
export const TRACKER_TYPE_ORDER: readonly TrackerType[] = ['cellular', 'off-grid', 'bluetooth'];

/**
 * The first tracker of each type, in the GPS converter's section order: one
 * cellular, one off-grid and one Bluetooth pick, so a reader sees one option per
 * environment.
 */
export function getTrackerTypePicks(): ConverterPicksData {
  const products = TRACKER_TYPE_ORDER.map((type) => {
    const first = getTrackersByType(type)[0];
    if (!first) throw new Error(`GPS converter has no ${type} tracker`);
    return { ...first, category: first.type };
  });
  return { heading: trackerConverterTitle, converterTitle: trackerConverterTitle, products };
}
