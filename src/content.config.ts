import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const productSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  image: z.string().optional(),
  priceNote: z.string().optional(),
  affiliateUrl: z.string().optional(),
  tag: z.enum(['best-overall', 'budget', 'premium']).optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/data/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['gift-guides', 'blog']),
    date: z.coerce.date(),
    pageType: z.enum(['converter', 'collector', 'attractor', 'informer']),
    heroImage: z.string().optional(),
    ogImage: z.string().optional(),
    products: z.array(productSchema).default([]),
    draft: z.boolean().default(false),
    relatedSlugs: z.array(z.string()).default([]),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
    ogHeadline: z.string().optional(),
    ogCta: z.string().optional(),
    ogTheme: z.enum(['cooling', 'calming', 'neutral']).optional(),
  }),
});

export const collections = { posts };
