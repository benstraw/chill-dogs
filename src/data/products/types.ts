export type MerchantId = 'amazon' | 'chewy';

export type OfferStatus = 'active' | 'candidate' | 'unavailable';

interface AffiliateOfferBase {
  merchant: MerchantId;
  url: string;
  label?: string;
  canonicalUrl?: string;
  merchantProductId?: string;
  status?: OfferStatus;
  addedAt?: string;
}

export interface AmazonOffer extends AffiliateOfferBase {
  merchant: 'amazon';
  asin: string;
}

export interface ChewyOffer extends AffiliateOfferBase {
  merchant: 'chewy';
}

export type AffiliateOffer = AmazonOffer | ChewyOffer;

export interface ProviderMetadata {
  readonly fetchedAt: string;
  readonly provider: string;
  readonly title?: string;
  readonly imageUrl?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductEditorialFields {
  readonly id: string;
  readonly name: string;
  readonly bullets: readonly string[];
  readonly image?: ProductImage;
  readonly signalNote?: string;
  readonly subscriptionNote?: string;
  readonly note?: string;
}

export interface OfferBackedProduct extends ProductEditorialFields {
  readonly asin?: string;
  readonly amazonUrl?: string;
  readonly offers?: readonly AffiliateOffer[];
}
