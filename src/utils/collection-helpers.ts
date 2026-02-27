import { getCollection } from 'astro:content';
import type { Category } from './types';

export async function getPostsForCategory(category: Category) {
  const posts = await getCollection('posts', ({ data }) => {
    return data.category === category && !data.draft;
  });

  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

export async function getAllPosts() {
  const posts = await getCollection('posts', ({ data }) => !data.draft);

  return posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime()
  );
}

export function getSlugFromId(id: string): string {
  // id comes as "category/slug.md" or "category/slug" — extract just the slug part
  const parts = id.split('/');
  const last = parts[parts.length - 1];
  return last ? last.replace(/\.md$/, '') : id;
}

export function getCategoryFromId(id: string): string {
  const parts = id.split('/');
  return parts[0] || '';
}
