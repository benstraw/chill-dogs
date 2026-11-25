/**
 * Runs once before the dist test tier. Fails the whole tier, loudly, when dist/ is
 * missing, partial, or built from different inputs than the working tree.
 *
 * Set ALLOW_STALE_DIST=1 to skip only the freshness check (for example while
 * iterating on a test against a build you know is close enough).
 *
 * Set BUILD_IF_STALE=1 (as `bun run test:smoke` does) to run `bun run build` first
 * when dist/ is missing or stale, and reuse it when it is current: a fresh build
 * costs ~20 s, so it only happens when the inputs actually changed.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { computeBuildStamp, stampPath } from '../../../scripts/build-stamp.mjs';
import { MIN_BUILT_PAGES, distRoot, projectRoot } from '../helpers/dist';

function countHtml(dir: string): number {
  let n = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) n += countHtml(path.join(dir, entry.name));
    else if (entry.name.endsWith('.html')) n++;
  }
  return n;
}

function isFresh(): boolean {
  return (
    existsSync(path.join(distRoot, 'index.html')) &&
    existsSync(stampPath) &&
    readFileSync(stampPath, 'utf8').trim() === computeBuildStamp()
  );
}

export default function setup() {
  if (process.env.BUILD_IF_STALE === '1' && !isFresh()) {
    console.log('[dist tests] dist/ is missing or stale; running `bun run build`...');
    execFileSync('bun', ['run', 'build'], {
      cwd: projectRoot,
      stdio: 'inherit',
      env: { ...process.env, INDEXNOW_DRY_RUN: 'true' },
    });
  }

  if (!existsSync(path.join(distRoot, 'index.html'))) {
    throw new Error('dist/ is missing. Run `bun run build` before the dist test tier (or use `bun run test`).');
  }

  const pages = countHtml(distRoot);
  if (pages < MIN_BUILT_PAGES) {
    throw new Error(
      `dist/ has only ${pages} HTML pages (expected at least ${MIN_BUILT_PAGES}). It looks partial: rebuild with \`bun run build\`.`,
    );
  }

  if (process.env.ALLOW_STALE_DIST === '1') return;

  if (!existsSync(stampPath)) {
    throw new Error(
      'dist/ has no build stamp (.cache/dist-build-stamp), so its freshness is unknown. Rebuild with `bun run build`, or set ALLOW_STALE_DIST=1.',
    );
  }
  const built = readFileSync(stampPath, 'utf8').trim();
  const current = computeBuildStamp();
  if (built !== current) {
    throw new Error(
      'dist/ is stale: src/, public/ or the build config changed since it was built. Rebuild with `bun run build`, or set ALLOW_STALE_DIST=1.',
    );
  }
}
