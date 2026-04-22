import { defineCollection, z } from 'astro:content';

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
    }),
});

export const collections = { articles };
