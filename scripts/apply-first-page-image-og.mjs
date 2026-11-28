/**
 * Post-build: photo share cards.
 *
 * 1. A page can choose its share photo by marking one `<img data-og-hero>` in `<main>`.
 *    Only marked images count: the first image on a landing page is usually a listing
 *    thumbnail, a logo or a badge, and it shared as the page's preview (#339).
 * 2. Any page whose share image is then a local photo (a marked hero, or an article's
 *    `ogImage` frontmatter) gets a composed card: that photo with the page title in a
 *    translucent box, written to `dist/og/photo/<slug>.jpg`. Generated `/og/` cards
 *    already carry their title and are left alone.
 */
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { composePhotoCard, photoCardAccent, photoCardHeadline } from './og-photo-card.mjs';

const distRoot = path.resolve('dist');
const siteOrigin = 'https://www.chill-dogs.com';
const PHOTO_EXTENSIONS = /\.(jpe?g|png|webp|avif)$/i;
const logoPath = path.resolve('public/images/chill-dogs-logo-padded.png');

function walkHtmlFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...walkHtmlFiles(full));
      continue;
    }
    if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function toAbsoluteImageUrl(src) {
  try {
    return new URL(src, siteOrigin).href;
  } catch (error) {
    console.warn(`[og] skipped invalid image URL "${src}": ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

function replaceMetaContent(html, matcher, contentValue) {
  if (!matcher.test(html)) {
    return html;
  }

  return html.replace(/<meta\b[^>]*>/gi, (tag) => {
    if (!matcher.test(tag)) {
      return tag;
    }

    const contentPattern = /\bcontent\s*=\s*(['"])[\s\S]*?\1/i;
    if (contentPattern.test(tag)) {
      return tag.replace(
        contentPattern,
        `content="${contentValue}"`
      );
    }

    return tag.replace(/\/?>$/, ` content="${contentValue}"$&`);
  });
}

const OG_IMAGE = /\bproperty\s*=\s*(['"])og:image\1/i;
const TWITTER_IMAGE = /\bname\s*=\s*(['"])twitter:image\1/i;

function setShareImage(html, url) {
  return replaceMetaContent(replaceMetaContent(html, OG_IMAGE, url), TWITTER_IMAGE, url);
}

function srcOf(tag) {
  const match = tag.match(/\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

/** The `src` of the first `<img data-og-hero>` in `mainHtml`, or null. Unmarked images never count. */
export function extractFirstImageSrc(mainHtml) {
  const imageTags = mainHtml.match(/<img\b[^>]*>/gi) ?? [];

  for (const tag of imageTags) {
    if (/\bdata-og-image-skip\b/i.test(tag)) continue;
    if (!/\bdata-og-hero\b/i.test(tag)) continue;
    const src = srcOf(tag);
    if (src) return src;
  }

  return null;
}

/** Points og:image and twitter:image at the page's marked hero photo, if it has one on this site. */
export function applyFirstImageOg(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0];
  if (!main) return html;

  const srcValue = extractFirstImageSrc(main);
  if (!srcValue || srcValue.startsWith('data:')) return html;

  const ogImage = toAbsoluteImageUrl(srcValue);
  if (!ogImage) return html;
  if (!ogImage.startsWith(`${siteOrigin}/`)) return html;

  return setShareImage(html, ogImage);
}

function decodeEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function metaContent(html, matcher) {
  const tag = (html.match(/<meta\b[^>]*>/gi) ?? []).find((candidate) => matcher.test(candidate));
  const content = tag?.match(/\bcontent\s*=\s*(?:"([^"]*)"|'([^']*)')/i);
  return content ? decodeEntities(content[1] ?? content[2] ?? '') : null;
}

/**
 * The site path of a photo that needs a composed card, or null: the share image must be
 * on this site, a raster photo, and not already a generated `/og/` card.
 */
export function photoNeedingCard(html) {
  const current = metaContent(html, OG_IMAGE);
  if (!current) return null;
  let url;
  try {
    url = new URL(current, siteOrigin);
  } catch {
    return null;
  }
  if (url.origin !== siteOrigin) return null;
  if (url.pathname.startsWith('/og/') || url.pathname === '/og-default.jpg') return null;
  if (!PHOTO_EXTENSIONS.test(url.pathname)) return null;
  return url.pathname;
}

export function photoCardSlug(pagePath) {
  const clean = pagePath.replace(/^\/+|\/+$/g, '');
  return clean ? clean.replace(/\//g, '-') : 'home';
}

function pagePathOf(filePath) {
  const rel = path.relative(distRoot, filePath).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/index\.html$/, '').replace(/\.html$/, '')}`;
}

async function main() {
  const htmlFiles = walkHtmlFiles(distRoot);
  let swapped = 0;
  let composed = 0;
  const logoDataUri = existsSync(logoPath)
    ? `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`
    : null;

  for (const filePath of htmlFiles) {
    const original = readFileSync(filePath, 'utf8');
    let html = applyFirstImageOg(original);
    if (html !== original) swapped += 1;

    const photoPath = photoNeedingCard(html);
    if (photoPath) {
      const photoFile = path.join(distRoot, decodeURIComponent(photoPath).replace(/^\//, ''));
      const title = metaContent(html, /\bproperty\s*=\s*(['"])og:title\1/i);
      if (existsSync(photoFile) && title) {
        const pagePath = pagePathOf(filePath);
        const cardPath = `/og/photo/${photoCardSlug(pagePath)}.jpg`;
        const card = await composePhotoCard(readFileSync(photoFile), {
          headline: photoCardHeadline(title),
          accent: photoCardAccent(pagePath),
          logoDataUri,
        });
        mkdirSync(path.join(distRoot, 'og', 'photo'), { recursive: true });
        writeFileSync(path.join(distRoot, cardPath.replace(/^\//, '')), card);
        html = setShareImage(html, `${siteOrigin}${cardPath}`);
        composed += 1;
      } else {
        console.warn(`[og] ${pagePathOf(filePath)}: share photo ${photoPath} not found in dist/; left as is`);
      }
    }

    if (html !== original) writeFileSync(filePath, html, 'utf8');
  }

  console.log(`[og] share photo from a marked hero on ${swapped} page(s); composed ${composed} titled photo card(s)`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
