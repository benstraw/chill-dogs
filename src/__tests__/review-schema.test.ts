import { describe, expect, it } from 'vitest';

import { buildReviewSchema, type ReviewSchemaInput } from '../utils/review-schema';

const base: ReviewSchemaInput = {
  name: 'Thing Review',
  description: 'A review.',
  path: '/gear/thing-review/',
  rating: 4.5,
  datePublished: '2026-11-07',
  product: { name: 'Thing' },
};

describe('buildReviewSchema', () => {
  it('emits the fields Google requires for a Review rich result', () => {
    const schema = buildReviewSchema(base);
    expect(schema).toMatchObject({
      '@type': 'Review',
      url: 'https://www.chill-dogs.com/gear/thing-review/',
      datePublished: '2026-11-07',
      author: { '@type': 'Person', name: expect.any(String) },
      reviewRating: { '@type': 'Rating', ratingValue: 4.5, bestRating: 5, worstRating: 1 },
      itemReviewed: { '@type': 'Product', name: 'Thing' },
    });
  });

  it('omits optional product fields that were not given', () => {
    const { itemReviewed, ...rest } = buildReviewSchema(base);
    expect(itemReviewed).toEqual({ '@type': 'Product', name: 'Thing' });
    expect(rest).not.toHaveProperty('dateModified');
  });

  it('adds brand, absolute image and offer when given', () => {
    const { itemReviewed, dateModified } = buildReviewSchema({
      ...base,
      dateModified: '2026-11-20',
      product: { name: 'Thing', brand: 'Acme', image: '/images/thing.jpg', offerUrl: 'https://example.com/buy', price: '19.99' },
    });
    expect(dateModified).toBe('2026-11-20');
    expect(itemReviewed).toMatchObject({
      brand: { '@type': 'Brand', name: 'Acme' },
      image: 'https://www.chill-dogs.com/images/thing.jpg',
      offers: { '@type': 'Offer', url: 'https://example.com/buy', price: '19.99', priceCurrency: 'USD' },
    });
  });

  it('keeps an absolute image URL as is and omits a missing price', () => {
    const { itemReviewed } = buildReviewSchema({
      ...base,
      product: { name: 'Thing', image: 'https://cdn.example.com/t.jpg', offerUrl: 'https://example.com/buy' },
    });
    expect(itemReviewed.image).toBe('https://cdn.example.com/t.jpg');
    expect(itemReviewed.offers).not.toHaveProperty('price');
  });
});
