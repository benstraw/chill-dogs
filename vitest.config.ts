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
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/scripts/**', 'src/data/**'],
      reporter: ['text', 'json-summary'],
    },
  },
});
