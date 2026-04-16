import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const sitemapPath = path.join(distRoot, 'content-sitemap', 'index.html');
const siteOrigin = 'https://www.chill-dogs.com';

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalizePagePath(href) {
  return href === '/' ? '/index.html' : `${href.replace(/\/$/, '')}/index.html`;
}

function pageFilePath(href) {
  return path.join(distRoot, normalizePagePath(href).replace(/^\//, ''));
}

function extractMetaContent(html, pattern) {
  return html.match(pattern)?.[1] ?? null;
}

function toSitemapImageSrc(imageUrl) {
  try {
    const url = new URL(imageUrl, siteOrigin);
    if (url.origin !== siteOrigin) {
      return imageUrl;
    }

    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return imageUrl;
  }
}

function replaceTagContent(tag, nextContent) {
  return tag.replace(/>([\s\S]*?)</, `>${nextContent}<`);
}

function replaceAttribute(tag, attribute, nextValue) {
  const pattern = new RegExp(`\\b${attribute}\\s*=\\s*(['"])[\\s\\S]*?\\1`, 'i');
  if (pattern.test(tag)) {
    return tag.replace(pattern, `${attribute}="${nextValue}"`);
  }

  return tag.replace(/\/?>$/, ` ${attribute}="${nextValue}"$&`);
}

function updateRow(rowHtml, metadata) {
  let nextRow = rowHtml;

  nextRow = nextRow.replace(/<a\b[^>]*data-share-title[^>]*>[\s\S]*?<\/a>/i, (tag) =>
    replaceTagContent(tag, metadata.title)
  );
  nextRow = nextRow.replace(/<p\b[^>]*data-share-description[^>]*>[\s\S]*?<\/p>/i, (tag) =>
    replaceTagContent(tag, metadata.description)
  );
  nextRow = nextRow.replace(/<img\b[^>]*data-share-image[^>]*>/i, (tag) =>
    replaceAttribute(tag, 'src', metadata.image)
  );

  return nextRow;
}

function extractShareMetadata(pageHtml) {
  const title = extractMetaContent(pageHtml, /<meta\b[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i)
    ?? extractMetaContent(pageHtml, /<meta\b[^>]*name=["']twitter:title["'][^>]*content=["']([^"']*)["']/i)
    ?? extractMetaContent(pageHtml, /<title>([^<]*)<\/title>/i);
  const description = extractMetaContent(pageHtml, /<meta\b[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i)
    ?? extractMetaContent(pageHtml, /<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const image = extractMetaContent(pageHtml, /<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i)
    ?? extractMetaContent(pageHtml, /<meta\b[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i);

  if (!title || !description || !image) {
    return null;
  }

  return {
    title,
    description,
    image: toSitemapImageSrc(image),
  };
}

function main() {
  if (!existsSync(sitemapPath)) {
    console.log('[content-sitemap] skipped share preview rewrite: content sitemap not found');
    return;
  }

  const sitemapHtml = readFileSync(sitemapPath, 'utf8');
  const hrefs = Array.from(sitemapHtml.matchAll(/data-share-preview-row[^>]*data-href="([^"]+)"/g), (match) => match[1]);
  let updatedCount = 0;
  let nextHtml = sitemapHtml;

  for (const href of hrefs) {
    const targetPath = pageFilePath(href);
    if (!existsSync(targetPath)) {
      continue;
    }

    const pageHtml = readFileSync(targetPath, 'utf8');
    const metadata = extractShareMetadata(pageHtml);
    if (!metadata) {
      continue;
    }

    const rowPattern = new RegExp(
      `(<li\\b[^>]*data-share-preview-row[^>]*data-href="${escapeRegExp(href)}"[^>]*>[\\s\\S]*?<\\/li>)`,
      'i'
    );
    const rowMatch = nextHtml.match(rowPattern);
    if (!rowMatch) {
      continue;
    }

    const updatedRow = updateRow(rowMatch[1], metadata);
    if (updatedRow === rowMatch[1]) {
      continue;
    }

    nextHtml = nextHtml.replace(rowPattern, updatedRow);
    updatedCount += 1;
  }

  if (nextHtml !== sitemapHtml) {
    writeFileSync(sitemapPath, nextHtml, 'utf8');
  }

  console.log(`[content-sitemap] updated share preview rows from built page metadata on ${updatedCount} page(s)`);
}

main();
