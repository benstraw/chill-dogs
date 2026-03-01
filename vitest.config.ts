import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      // Redirect Astro virtual modules to lightweight stubs for unit testing
      'astro:content': path.join(__dirname, 'src/__mocks__/astro-content.ts'),
    },
  },
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/scripts/**'],
      reporter: ['text', 'json-summary'],
    },
  },
});
