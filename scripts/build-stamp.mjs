#!/usr/bin/env node
/**
 * Build stamp: a content hash of everything that shapes dist/, written at the end of
 * `bun run build` and re-checked by the dist test tier before it reads dist/.
 *
 * Without it, tests that read dist/ run against whatever build is lying around: one
 * from another branch, or from before the edit under test. That gives false passes
 * and false failures. A content hash (not mtimes, which every checkout resets) makes
 * "stale" mean exactly "the inputs changed since this dist/ was built".
 *
 *   node scripts/build-stamp.mjs          # write .cache/dist-build-stamp
 *
 * The stamp lives in .cache/ (gitignored), not dist/, so it is never deployed.
 */

import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const stampPath = join(repoRoot, '.cache', 'dist-build-stamp');

/** Inputs that change what the build emits. Tests and generated files are excluded. */
const INPUT_DIRS = ['src', 'public'];
const INPUT_FILES = [
  'astro.config.mjs',
  'package.json',
  'scripts/apply-first-page-image-og.mjs',
  'scripts/apply-sitemap-share-preview.mjs',
];
const EXCLUDED_PREFIXES = [
  'src/__tests__/',
  'src/__mocks__/',
  // Written by prebuild steps from other inputs; hashing them adds cost, not signal.
  'src/images/watermarked/',
  'public/og/',
  'public/pins/',
];

function walk(dir, out) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    const rel = relative(repoRoot, full);
    if (EXCLUDED_PREFIXES.some((prefix) => `${rel}/`.startsWith(prefix) || rel.startsWith(prefix))) continue;
    if (entry.isDirectory()) walk(full, out);
    else if (entry.isFile()) out.push(rel);
  }
}

export function computeBuildStamp() {
  const files = [...INPUT_FILES];
  for (const dir of INPUT_DIRS) walk(join(repoRoot, dir), files);
  files.sort();

  const hash = createHash('sha1');
  for (const rel of files) {
    hash.update(rel);
    hash.update('\0');
    hash.update(readFileSync(join(repoRoot, rel)));
    hash.update('\0');
  }
  return hash.digest('hex');
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  mkdirSync(dirname(stampPath), { recursive: true });
  writeFileSync(stampPath, `${computeBuildStamp()}\n`);
  console.log(`[build-stamp] wrote ${relative(repoRoot, stampPath)}`);
}
