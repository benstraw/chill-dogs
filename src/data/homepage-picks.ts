import { productCatalogItems, type ProductCatalogItem } from './product-catalog';

/**
 * Product picks surfaced on the homepage theme sections. IDs must exist in the
 * unified product catalog; `getHomepagePicks` throws on unknown ids so a renamed
 * product fails tests instead of silently dropping a pick.
 *
 * Seeded from the products already blessed as `heroProduct` in content-sitemap.ts.
 */
const HOMEPAGE_PICK_IDS: Record<ProductCatalogItem['pillar'], string[]> = {
  cooling: ['green-pet-shop-cooling-pad', 'ruffwear-swamp-cooler'],
  calming: ['thundershirt-classic', 'awoo-paradise-lick-mat'],
  comfort: ['bedstill-donut-calming-bed'],
  gear: ['fi-series-3-plus'],
};

export function getHomepagePicks(pillar: ProductCatalogItem['pillar']): ProductCatalogItem[] {
  return HOMEPAGE_PICK_IDS[pillar].map((id) => {
    const item = productCatalogItems.find((candidate) => candidate.id === id);
    if (!item) {
      throw new Error(`Homepage pick "${id}" (${pillar}) not found in product catalog`);
    }
    return item;
  });
}
