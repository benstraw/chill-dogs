import { merchants } from './merchants';
import type { AffiliateOffer, AmazonOffer, MerchantId, OfferBackedProduct } from './types';

export interface AmazonOfferEntry {
  asin: string;
  name: string;
  pillar?: string;
  productId: string;
  url: string;
}

type OfferSourceProduct = Pick<OfferBackedProduct, 'id' | 'name' | 'asin' | 'amazonUrl' | 'offers'> & {
  pillar?: string;
};

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

export function getOffers(product: OfferSourceProduct): AffiliateOffer[] {
  const explicitOffers = product.offers ? [...product.offers] : [];
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
