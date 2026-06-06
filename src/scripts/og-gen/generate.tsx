import { existsSync, mkdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import sharp from 'sharp';
import { staticSitemapSections, type SitemapPage } from '../../data/content-sitemap';
import {
  cacheKey,
  copyCachedOutputToPublic,
  ensureCacheDirs,
  getCachedImageDataUri,
  writeOutputWithCache,
} from './cache';
import { loadOgFonts } from './fonts';
import { ProductOgTemplate } from './template';
import { outputFilenameFromHref, resolveOgSummary } from './text';
import { resolveOgTheme } from './themes';
import { validateHeroProductPages } from './validation';

const TEMPLATE_VERSION = 'hero-product-og-v1';
const outDir = path.join(process.cwd(), 'public', 'og');
const logoPath = path.join(process.cwd(), 'public', 'images', 'paw-logo.png');

interface CliOptions {
  force: boolean;
  pages?: Set<string>;
}

interface GenerateStats {
  generated: number;
  cached: number;
  failed: number;
  skipped: number;
}

function parseCliOptions(argv: string[]): CliOptions {
  const pagesArg = argv.find((arg) => arg.startsWith('--pages='));
  const pages = pagesArg
    ? new Set(
        pagesArg
          .replace('--pages=', '')
          .split(',')
          .map((page) => page.trim())
          .filter(Boolean)
      )
    : undefined;

  return {
    force: argv.includes('--force'),
    pages,
  };
}

function stripSiteSuffix(title: string): string {
  return title
    .replace(/\s*\|\s*Chill-?Dogs\s*$/i, '')
    .replace(/^Chill-?Dogs\s*[—|-]\s*/i, '')
    .trim();
}

function getProductOgPages(options: CliOptions): SitemapPage[] {
  const pages = staticSitemapSections
    .flatMap((section) => section.pages)
    .filter((page) => page.heroProduct);

  if (!options.pages) {
    return pages;
  }

  return pages.filter((page) => options.pages?.has(page.href) || options.pages?.has(page.href.replace(/^\/|\/$/g, '')));
}

function imageDataUriFromFile(filePath: string, mimeType: string): string | null {
  if (!existsSync(filePath)) {
    return null;
  }

  return `data:${mimeType};base64,${readFileSync(filePath).toString('base64')}`;
}

export function productOgCacheKey(page: SitemapPage): string {
  const theme = resolveOgTheme(page);
  const summary = resolveOgSummary({
    ogSummary: page.ogSummary,
    description: page.preview.description,
  });

  return cacheKey({
    templateVersion: TEMPLATE_VERSION,
    href: page.href,
    title: stripSiteSuffix(page.preview.title),
    summary,
    section: theme.key,
    heroProduct: page.heroProduct,
  });
}

export function getProductOgHrefs(): string[] {
  return staticSitemapSections
    .flatMap((section) => section.pages)
    .filter((page) => page.heroProduct)
    .map((page) => page.href);
}

async function generateProductOgImages(options: CliOptions): Promise<GenerateStats> {
  ensureCacheDirs();
  mkdirSync(outDir, { recursive: true });

  const fonts = loadOgFonts();
  const logoDataUri = imageDataUriFromFile(logoPath, 'image/png');
  const pages = getProductOgPages(options);
  validateHeroProductPages(pages);

  const stats: GenerateStats = { generated: 0, cached: 0, failed: 0, skipped: 0 };

  for (const page of pages) {
    if (!page.heroProduct) {
      stats.skipped += 1;
      continue;
    }

    const key = productOgCacheKey(page);
    const targetPath = path.join(outDir, outputFilenameFromHref(page.href));

    if (!options.force && copyCachedOutputToPublic(key, targetPath)) {
      console.log(`[og:product] cached ${page.href}`);
      stats.cached += 1;
      continue;
    }

    try {
      const theme = resolveOgTheme(page);
      const summary = resolveOgSummary({
        ogSummary: page.ogSummary,
        description: page.preview.description,
      });
      const heroImageDataUri = await getCachedImageDataUri(page.heroProduct.image);
      const svg = await satori(
        ProductOgTemplate({
          title: stripSiteSuffix(page.preview.title),
          summary,
          heroProduct: page.heroProduct,
          heroImageDataUri,
          logoDataUri,
          theme,
          year: new Date().getFullYear(),
        }),
        {
          width: 1200,
          height: 630,
          fonts,
        }
      );
      const jpegBuffer = await sharp(Buffer.from(svg)).jpeg({ quality: 90, mozjpeg: true }).toBuffer();
      writeOutputWithCache(key, targetPath, jpegBuffer);
      console.log(`[og:product] generated ${page.href}`);
      stats.generated += 1;
    } catch (error) {
      console.error(`[og:product] failed ${page.href}: ${error instanceof Error ? error.message : String(error)}`);
      stats.failed += 1;
    }
  }

  console.log(
    `[og:product] ${stats.generated} generated, ${stats.cached} cached, ${stats.skipped} skipped, ${stats.failed} failed`
  );

  if (stats.failed > 0) {
    throw new Error(`[og:product] ${stats.failed} image(s) failed`);
  }

  return stats;
}

if (import.meta.main) {
  await generateProductOgImages(parseCliOptions(process.argv.slice(2)));
}

