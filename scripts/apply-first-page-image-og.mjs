import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const distRoot = path.resolve('dist');
const siteOrigin = 'https://www.chill-dogs.com';

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

function extractFirstImageSrc(mainHtml) {
  const match = mainHtml.match(/<img\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  return match?.[1] ?? match?.[2] ?? match?.[3] ?? null;
}

function applyFirstImageOg(html) {
  const main = html.match(/<main[\s\S]*?<\/main>/i)?.[0];
  if (!main) return html;

  const srcValue = extractFirstImageSrc(main);
  if (!srcValue || srcValue.startsWith('data:')) return html;

  const ogImage = toAbsoluteImageUrl(srcValue);
  if (!ogImage) return html;
  if (!ogImage.startsWith(`${siteOrigin}/`)) return html;

  return replaceMetaContent(
    replaceMetaContent(
      html,
      /\bproperty\s*=\s*(['"])og:image\1/i,
      ogImage
    ),
    /\bname\s*=\s*(['"])twitter:image\1/i,
    ogImage
  );
}

function main() {
  const htmlFiles = walkHtmlFiles(distRoot);
  let updatedCount = 0;

  for (const filePath of htmlFiles) {
    const html = readFileSync(filePath, 'utf8');
    const updated = applyFirstImageOg(html);
    if (updated === html) continue;
    writeFileSync(filePath, updated, 'utf8');
    updatedCount += 1;
  }

  console.log(`[og] updated og:image + twitter:image from first page image on ${updatedCount} page(s)`);
}

main();
