export type PageType = 'converter' | 'collector' | 'attractor' | 'informer';

export type Category = 'gift-guides' | 'luxury-gear' | 'blog';

export interface Product {
  name: string;
  description?: string;
  image?: string;
  priceNote?: string;
  affiliateUrl?: string;
  tag?: 'best-overall' | 'budget' | 'premium';
  pros?: string[];
  cons?: string[];
}
