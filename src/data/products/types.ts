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

/**
 * The dimension a product's variants vary along. One axis per product — a
 * product that varies along two (size and scent) is out of scope for now.
 */
export interface ProductVariantAxis {
  /** Stable key: 'dog-size', 'pack-count', 'scent', 'color'. */
  readonly id: string;
  /** Selector heading, e.g. "Size". */
  readonly label: string;
  /** Optional line under the heading, e.g. "Measure back length before ordering". */
  readonly hint?: string;
}

/**
 * One buyable option of a product. Each variant is its own merchant listing, so
 * it carries its own offers — a different ASIN, and possibly a different
 * merchant mix from the default.
 */
export interface ProductVariant {
  /** Unique within the product, e.g. 'x-small'. */
  readonly id: string;
  /** Selector chip text. Keep it short — it has to fit a card at 390px. */
  readonly label: string;
  /** Fuller wording for the accessible name, e.g. "X-Small, 12 inch back length". */
  readonly longLabel?: string;
  readonly offers: readonly AffiliateOffer[];
  /** Only when the variant genuinely looks different — colorways. */
  readonly image?: ProductImage;
  /** Variant-specific caution shown while this option is selected. */
  readonly note?: string;
  readonly status?: OfferStatus;
}

export interface ProductVariantGroup {
  readonly axis: ProductVariantAxis;
  readonly defaultVariantId: string;
  readonly variants: readonly ProductVariant[];
}

export interface OfferBackedProduct extends ProductEditorialFields {
  readonly asin?: string;
  readonly amazonUrl?: string;
  /**
   * The offers for the *default* variant. Variant offers live on
   * `variantGroup.variants[].offers` and deliberately never land here — every
   * product card renders this array directly, so widening it would grow a
   * button per variant on every card on the site.
   */
  readonly offers?: readonly AffiliateOffer[];
  readonly variantGroup?: ProductVariantGroup;
}
