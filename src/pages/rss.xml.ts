import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';

export async function GET(context: APIContext) {
  const articles = await getCollection('articles');
  const sorted = articles.sort((a, b) =>
    b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  );
  return rss({
    title: 'Chill Dogs',
    description: 'Gear, guides, and picks for keeping your dog cool, calm, and comfortable.',
    site: context.site ?? 'https://www.chill-dogs.com',
    items: sorted.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      link: a.data.canonicalPath,
      pubDate: a.data.pubDate,
    })),
  });
}
