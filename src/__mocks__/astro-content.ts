import { vi } from 'vitest';

// Stub for the Astro virtual module `astro:content`.
// Tests that need a specific return value should override this with vi.mocked().
export const getCollection = vi.fn();
export const render = vi.fn();
