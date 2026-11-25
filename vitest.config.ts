import { defineConfig } from 'vitest/config';

const alias = (path: string) => new URL(path, import.meta.url).pathname;

/**
 * Two tiers (see docs/ai/engineering/build-and-test-commands.md):
 *
 *   unit  `bun run test:unit`  — no dist/, no network, no git. Runs anywhere, fast.
 *   dist  `bun run test:dist`  — reads the built site. Its global setup fails the tier
 *                                loudly when dist/ is missing, partial, or stale.
 *
 * `vitest run` (CI, `bun run test`) runs both. Tests default to the `node`
 * environment; the few that need a DOM opt in with `// @vitest-environment happy-dom`.
 * Booting happy-dom in every file used to cost more than all the test bodies combined.
 */
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
    environment: 'node',
    // A slow test should show up as a failure, not hide under a generous timeout.
    testTimeout: 10_000,
    hookTimeout: 10_000,
    coverage: {
      provider: 'v8',
      include: ['src/utils/**', 'src/scripts/**', 'src/data/**', 'src/lib/**', 'scripts/**/*.{ts,mjs}'],
      reporter: ['text', 'json-summary'],
      // Floor, 1-2 points under the measured level (2026-11-25: 56.4 / 53.8 / 69.0 / 57.0)
      // so refactors do not trip it but a real drop does. Raise it as coverage grows.
      thresholds: { statements: 55, branches: 52, functions: 67, lines: 55 },
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/__tests__/**/*.test.ts'],
          exclude: ['src/__tests__/dist/**'],
          setupFiles: ['src/__tests__/setup/hermetic.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'dist',
          include: ['src/__tests__/dist/**/*.test.ts'],
          globalSetup: ['src/__tests__/dist/global-setup.ts'],
        },
      },
    ],
  },
});
