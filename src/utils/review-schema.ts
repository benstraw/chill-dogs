/**
 * `Review` JSON-LD for hands-on product reviews.
 *
 * Google only honours a rating in `Review` markup when the same rating is visible
 * on the page. Keeping the schema behind this helper means a page passes its
 * rating once and hands the identical number to `ReviewRating.astro`, so the two
 * cannot drift apart.
 *
 * See docs/ai/engineering/seo-and-schema.md.
 */

const SITE_URL = 'https://www.chill-dogs.com';

const AUTHOR = {
  '@type': 'Person',
  name: 'Benjamin Strawbridge',
  url: 'https://www.benstrawbridge.com/',
} as const;

const PUBLISHER = {
  '@type': 'Organization',
  name: 'Chill-Dogs',
  logo: { '@type': 'ImageObject', url: `${SITE_URL}/og/og-default.png` },
} as const;

export interface ReviewSchemaInput {
  /** The review article's own headline. */
  name: string;
  description: string;
  /** Absolute path of the review, e.g. `/gear/thing-review/`. */
  path: string;
  /** Rating out of `bestRating`. Must match what the page renders. */
  rating: number;
  bestRating?: number;
  worstRating?: number;
  datePublished: string;
  /** The thing being reviewed, not the article. */
  product: {
    name: string;
    brand?: string;
    image?: string;
    /** Buy URL. Omitted entirely when there is no offer to point at. */
    offerUrl?: string;
    price?: string;
    priceCurrency?: string;
  };
}

export function buildReviewSchema(input: ReviewSchemaInput) {
  const {
    name,
    description,
    path,
    rating,
    bestRating = 5,
    worstRating = 1,
    datePublished,
    product,
  } = input;

  const itemReviewed: Record<string, unknown> = {
    '@type': 'Product',
    name: product.name,
  };

  if (product.brand) {
    itemReviewed.brand = { '@type': 'Brand', name: product.brand };
  }
  if (product.image) {
    itemReviewed.image = product.image.startsWith('http')
      ? product.image
      : `${SITE_URL}${product.image}`;
  }
  if (product.offerUrl) {
    itemReviewed.offers = {
      '@type': 'Offer',
      url: product.offerUrl,
      ...(product.price ? { price: product.price } : {}),
      priceCurrency: product.priceCurrency ?? 'USD',
      availability: 'https://schema.org/InStock',
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    name,
    description,
    url: `${SITE_URL}${path}`,
    datePublished,
    author: AUTHOR,
    publisher: PUBLISHER,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: rating,
      bestRating,
      worstRating,
    },
    itemReviewed,
  };
}
