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

/**
 * Records that this product was genuinely used, not just researched.
 *
 * Presence of this field is what licenses first-hand copy ("we tested",
 * "in our testing") for a product; without it, copy stays research-based.
 * See docs/ai/writing/product-copy-rules.md.
 */
export interface HandsOnReview {
  /** When the product was first used, as `YYYY-MM` or `YYYY-MM-DD`. */
  readonly since: string;
  /** What was actually done with it — the substantiation behind the claim. */
  readonly note: string;
}

export interface ProductEditorialFields {
  readonly id: string;
  readonly name: string;
  readonly bullets: readonly string[];
  readonly image?: ProductImage;
  readonly signalNote?: string;
  readonly subscriptionNote?: string;
  readonly note?: string;
  /** Set only when the product was actually handled. See `HandsOnReview`. */
  readonly handsOn?: HandsOnReview;
}

export interface OfferBackedProduct extends ProductEditorialFields {
  readonly asin?: string;
  readonly amazonUrl?: string;
  readonly offers?: readonly AffiliateOffer[];
}
