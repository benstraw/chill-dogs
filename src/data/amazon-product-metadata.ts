import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

interface AmazonProductResponse {
  product_results?: {
    title?: string;
    thumbnail?: string;
    thumbnails?: string[];
    rating?: number;
    reviews?: number;
    price?: string;
  };
  item_specifications?: {
    product_dimensions?: string;
    special_feature?: string;
    material?: string;
  };
}

export interface AmazonProductMetadata {
  asin: string;
  title: string;
  image?: {
    src: string;
    alt: string;
  };
  rating?: number;
  reviews?: number;
  price?: string;
  dimensions?: string;
  specialFeature?: string;
  material?: string;
}

const metadataCache = new Map<string, AmazonProductMetadata>();

export function buildAmazonAffiliateUrl(asin: string): string {
  return `https://www.amazon.com/dp/${asin}/?tag=chill-dogs-20`;
}

export function getAmazonProductMetadata(asin: string): AmazonProductMetadata {
  const cached = metadataCache.get(asin);
  if (cached) {
    return cached;
  }

  const filePath = resolve(process.cwd(), 'src', 'data', 'amazon-products', `${asin}.json`);
  const raw = readFileSync(filePath, 'utf8');
  const data = JSON.parse(raw) as AmazonProductResponse;
  const product = data.product_results ?? {};
  const title = product.title?.trim();

  if (!title) {
    throw new Error(`Missing fetched Amazon title for ASIN ${asin}`);
  }

  const imageSrc = product.thumbnails?.[0] ?? product.thumbnail;
  const metadata: AmazonProductMetadata = {
    asin,
    title,
    image: imageSrc ? { src: imageSrc, alt: title } : undefined,
    rating: product.rating,
    reviews: product.reviews,
    price: product.price,
    dimensions: data.item_specifications?.product_dimensions,
    specialFeature: data.item_specifications?.special_feature,
    material: data.item_specifications?.material,
  };

  metadataCache.set(asin, metadata);
  return metadata;
}
