import { defineConfig } from 'vitest/config';
export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/scripts/**'],
      reporter: ['text', 'json-summary'],
    },
  },
});
