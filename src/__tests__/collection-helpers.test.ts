import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCollection } from 'astro:content';
import { getSlugFromId, getCategoryFromId, getPostsForCategory, getAllPosts } from '../utils/collection-helpers';

const mockPosts = [
  {
    id: 'blog/summer-tips',
    data: { category: 'blog', draft: false, date: new Date('2024-06-01') },
  },
  {
    id: 'gift-guides/best-toys',
    data: { category: 'gift-guides', draft: false, date: new Date('2024-03-15') },
  },
  {
    id: 'blog/draft-post',
    data: { category: 'blog', draft: true, date: new Date('2024-07-01') },
  },
  {
    id: 'blog/older-post',
    data: { category: 'blog', draft: false, date: new Date('2023-01-01') },
  },
];

describe('getSlugFromId', () => {
  it('strips the category prefix and .md extension', () => {
    expect(getSlugFromId('blog/summer-tips.md')).toBe('summer-tips');
  });

  it('strips the category prefix without extension', () => {
    expect(getSlugFromId('gift-guides/best-toys')).toBe('best-toys');
  });

  it('returns the original value when there is no slash', () => {
    expect(getSlugFromId('no-slash')).toBe('no-slash');
  });

  it('handles deeply nested paths, returning only the last segment', () => {
    expect(getSlugFromId('a/b/c/slug.md')).toBe('slug');
  });

  it('handles empty string gracefully', () => {
    expect(getSlugFromId('')).toBe('');
  });
});

describe('getCategoryFromId', () => {
  it('extracts the category from a standard id', () => {
    expect(getCategoryFromId('blog/summer-tips.md')).toBe('blog');
  });

  it('extracts gift-guides category', () => {
    expect(getCategoryFromId('gift-guides/best-toys')).toBe('gift-guides');
  });

  it('returns the full string when there is no slash', () => {
    expect(getCategoryFromId('no-slash')).toBe('no-slash');
  });

  it('returns empty string for an empty input', () => {
    expect(getCategoryFromId('')).toBe('');
  });
});

describe('getPostsForCategory', () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockImplementation(async (_name: string, filter?: Function) => {
      return filter ? mockPosts.filter(filter as any) : mockPosts;
    });
  });

  it('returns only non-draft posts for the requested category', async () => {
    const result = await getPostsForCategory('blog');
    expect(result.every((p) => p.data.category === 'blog')).toBe(true);
    expect(result.every((p) => !p.data.draft)).toBe(true);
  });

  it('sorts posts by date descending (newest first)', async () => {
    const result = await getPostsForCategory('blog');
    const dates = result.map((p) => new Date(p.data.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });

  it('excludes draft posts', async () => {
    const result = await getPostsForCategory('blog');
    expect(result.find((p) => p.id === 'blog/draft-post')).toBeUndefined();
  });
});

describe('getAllPosts', () => {
  beforeEach(() => {
    vi.mocked(getCollection).mockImplementation(async (_name: string, filter?: Function) => {
      return filter ? mockPosts.filter(filter as any) : mockPosts;
    });
  });

  it('returns posts from all categories', async () => {
    const result = await getAllPosts();
    const categories = new Set(result.map((p) => p.data.category));
    expect(categories.has('blog')).toBe(true);
    expect(categories.has('gift-guides')).toBe(true);
  });

  it('excludes draft posts', async () => {
    const result = await getAllPosts();
    expect(result.find((p) => p.id === 'blog/draft-post')).toBeUndefined();
  });

  it('sorts posts by date descending', async () => {
    const result = await getAllPosts();
    const dates = result.map((p) => new Date(p.data.date).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});
