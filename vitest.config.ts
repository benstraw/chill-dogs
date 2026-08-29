import { defineConfig } from 'vitest/config';

const alias = (path: string) => new URL(path, import.meta.url).pathname;

export default defineConfig({
  resolve: {
    alias: {
      'astro:content': alias('./src/__mocks__/astro-content.ts'),
      '@components': alias('./src/components'),
      '@data': alias('./src/data'),
      '@layouts': alias('./src/layouts'),
      '@scripts': alias('./src/scripts'),
      '@styles': alias('./src/styles'),
      '@utils': alias('./src/utils'),
    },
  },
  test: {
    environment: 'happy-dom',
    // The default 5s is too tight once ~30 happy-dom suites run in parallel:
    // slower machines blow it on CPU contention alone, not on real slowness.
    testTimeout: 30_000,
    hookTimeout: 30_000,
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/scripts/**', 'src/data/**'],
      reporter: ['text', 'json-summary'],
    },
  },
});
