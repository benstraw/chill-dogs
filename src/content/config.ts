import { defineCollection, z } from 'astro:content';
import { TOPICS } from '../data/content-sitemap';

const articles = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      ogTitle: z.string().optional(),
      pubDate: z.date(),
      canonicalPath: z.string(),
      ogImage: image().optional(),
      topics: z.array(z.enum(TOPICS)).optional(),
      pinnedRelated: z.array(z.string()).optional(),
      excludeRelated: z.array(z.string()).optional(),
    }),
});

export const collections = { articles };
