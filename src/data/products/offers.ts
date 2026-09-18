import { merchants } from './merchants';
import type {
  AffiliateOffer,
  AmazonOffer,
  MerchantId,
  OfferBackedProduct,
  ProductVariant,
} from './types';

export interface AmazonOfferEntry {
  asin: string;
  name: string;
  pillar?: string;
  productId: string;
  url: string;
}

type OfferSourceProduct = Pick<
  OfferBackedProduct,
  'id' | 'name' | 'asin' | 'amazonUrl' | 'offers' | 'variantGroup'
> & {
  pillar?: string;
};

type VariantSourceProduct = Pick<OfferBackedProduct, 'variantGroup'>;

export function buildAmazonOffer(product: { asin?: string; amazonUrl?: string }): AmazonOffer | undefined {
  if (!product.asin || !product.amazonUrl) return undefined;

  return {
    merchant: 'amazon',
    asin: product.asin,
    merchantProductId: product.asin,
    url: product.amazonUrl,
    status: 'active',
  };
}

/**
 * The variant a product shows before the buyer touches the selector. Its offers
 * are what `getOffers` returns, so this is the variant every card, schema entry
 * and catalog row describes.
 */
export function getDefaultVariant(product: VariantSourceProduct): ProductVariant | undefined {
  const group = product.variantGroup;
  if (!group) return undefined;

  return (
    group.variants.find((variant) => variant.id === group.defaultVariantId) ?? group.variants[0]
  );
}

/** Every selectable variant, unavailable ones dropped. */
export function getVariants(product: VariantSourceProduct): ProductVariant[] {
  if (!product.variantGroup) return [];

  return product.variantGroup.variants.filter((variant) => variant.status !== 'unavailable');
}

/** One variant's offers, ordered and filtered the same way `getOffers` orders a product's. */
export function getVariantOffers(variant: ProductVariant): AffiliateOffer[] {
  return [...variant.offers]
    .filter((offer) => offer.status !== 'unavailable')
    .sort((a, b) => merchants[a.merchant].displayOrder - merchants[b.merchant].displayOrder);
}

export function getOffers(product: OfferSourceProduct): AffiliateOffer[] {
  const explicitOffers = product.offers
    ? [...product.offers]
    : [...(getDefaultVariant(product)?.offers ?? [])];
  const hasAmazon = explicitOffers.some((offer) => offer.merchant === 'amazon');
  const derivedAmazon = hasAmazon ? undefined : buildAmazonOffer(product);
  const offers = derivedAmazon ? [...explicitOffers, derivedAmazon] : explicitOffers;

  return offers
    .filter((offer) => offer.status !== 'unavailable')
    .sort((a, b) => merchants[a.merchant].displayOrder - merchants[b.merchant].displayOrder);
}

export function getOffer(product: OfferSourceProduct, merchant: MerchantId): AffiliateOffer | undefined {
  return getOffers(product).find((offer) => offer.merchant === merchant);
}

export function getPrimaryOffer(product: OfferSourceProduct): AffiliateOffer | undefined {
  return getOffers(product)[0];
}

export function getRequiredPrimaryOffer(product: OfferSourceProduct, context = product.id): AffiliateOffer {
  const offer = getPrimaryOffer(product);
  if (!offer) {
    throw new Error(`Missing affiliate offer for ${context}`);
  }
  return offer;
}

/**
 * One Amazon ASIN per product — the primary offer only.
 *
 * This deliberately ignores variants so it keeps matching the legacy
 * `product.asin` field one-for-one. Use `getAllAmazonOfferEntries` when you
 * need every ASIN the catalog can send a buyer to.
 */
export function getAmazonOfferEntries<T extends OfferSourceProduct>(
  catalog: readonly T[],
): AmazonOfferEntry[] {
  const byAsin = new Map<string, AmazonOfferEntry>();

  for (const product of catalog) {
    const amazonOffer = getOffer(product, 'amazon');
    if (!amazonOffer || amazonOffer.merchant !== 'amazon' || byAsin.has(amazonOffer.asin)) continue;

    byAsin.set(amazonOffer.asin, {
      asin: amazonOffer.asin,
      name: product.name,
      pillar: product.pillar,
      productId: product.id,
      url: amazonOffer.url,
    });
  }

  return [...byAsin.values()].sort((a, b) => a.asin.localeCompare(b.asin));
}

/**
 * Every Amazon ASIN in the catalog, primary offers plus every variant's.
 *
 * The ASIN-checking and cache scripts use this so a variant ASIN is validated
 * and cached like any other. Without it, variant ASINs go unchecked and their
 * cache files get reported as unreferenced extras.
 */
export function getAllAmazonOfferEntries<T extends OfferSourceProduct>(
  catalog: readonly T[],
): AmazonOfferEntry[] {
  const byAsin = new Map<string, AmazonOfferEntry>(
    getAmazonOfferEntries(catalog).map((entry) => [entry.asin, entry]),
  );

  for (const product of catalog) {
    for (const variant of getVariants(product)) {
      const amazonOffer = getVariantOffers(variant).find((offer) => offer.merchant === 'amazon');
      if (!amazonOffer || amazonOffer.merchant !== 'amazon' || byAsin.has(amazonOffer.asin)) continue;

      byAsin.set(amazonOffer.asin, {
        asin: amazonOffer.asin,
        name: `${product.name} — ${variant.label}`,
        pillar: product.pillar,
        productId: product.id,
        url: amazonOffer.url,
      });
    }
  }

  return [...byAsin.values()].sort((a, b) => a.asin.localeCompare(b.asin));
}
