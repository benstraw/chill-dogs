import { execSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  buildSubmissionUrls,
  collectChangedPageUrls,
  isProductionVercelEnv,
  normalizeOrigin,
} from './indexnow-lib.mjs';

function toBool(input) {
  return ['1', 'true', 'yes', 'on'].includes(String(input || '').toLowerCase());
}

function getChangedFiles(previousSha, currentSha) {
  if (!previousSha || !currentSha) return null;
  try {
    const output = execSync(`git diff --name-only ${previousSha} ${currentSha}`, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
  } catch (err) {
    console.warn('[IndexNow] Unable to compute git diff; falling back to sitemap submission.');
    console.warn(`[IndexNow] Diff error: ${err instanceof Error ? err.message : String(err)}`);
    return null;
  }
}

async function ensureKeyFile({ key, distDir }) {
  await mkdir(distDir, { recursive: true });
  const target = path.join(distDir, `${key}.txt`);
  await writeFile(target, `${key}\n`, 'utf8');
  console.log(`[IndexNow] Wrote key file to ${target}`);
}

async function submitIndexNow({ endpoint, payload, dryRun }) {
  if (dryRun) {
    console.log('[IndexNow] Dry run enabled. Payload:');
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    throw new Error(`IndexNow request failed (${response.status} ${response.statusText}): ${body}`);
  }

  console.log(`[IndexNow] Submitted successfully (${response.status}).`);
}

async function main() {
  if (!isProductionVercelEnv(process.env)) {
    console.log('[IndexNow] Skipping: VERCEL_ENV is not production.');
    return;
  }

  const key = (process.env.INDEXNOW_KEY || '').trim();
  if (!key) {
    console.log('[IndexNow] Skipping: INDEXNOW_KEY is not set.');
    return;
  }

  const siteOrigin = normalizeOrigin(process.env.INDEXNOW_SITE_ORIGIN || 'https://chill-dogs.com');
  const endpoint = (process.env.INDEXNOW_ENDPOINT || 'https://api.indexnow.org/indexnow').trim();
  const dryRun = toBool(process.env.INDEXNOW_DRY_RUN);
  const distDir = process.env.INDEXNOW_DIST_DIR || 'dist';

  await ensureKeyFile({ key, distDir });
  console.log(`[IndexNow] Key file URL: ${siteOrigin}/${key}.txt`);

  const previousSha = (process.env.VERCEL_GIT_PREVIOUS_SHA || '').trim();
  const currentSha = (process.env.VERCEL_GIT_COMMIT_SHA || '').trim();

  const changedFiles = getChangedFiles(previousSha, currentSha);
  const changedPageUrls = changedFiles ? collectChangedPageUrls(changedFiles, siteOrigin) : [];
  const sitemapUrl = `${siteOrigin}/sitemap-index.xml`;
  const selection = buildSubmissionUrls({ changedPageUrls, sitemapUrl });

  const payload = {
    host: siteOrigin.replace(/^https?:\/\//, ''),
    key,
    keyLocation: `${siteOrigin}/${key}.txt`,
    urlList: selection.urlList,
  };

  console.log(`[IndexNow] Submission mode: ${selection.mode}`);
  console.log(`[IndexNow] URL count: ${selection.urlList.length}`);

  await submitIndexNow({ endpoint, payload, dryRun });
}

main().catch((err) => {
  console.error(`[IndexNow] Failed: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
