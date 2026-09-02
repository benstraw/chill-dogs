/** @jsxRuntime automatic */
/** @jsxImportSource satori/jsx */

/**
 * Generates a Pinterest pin per `/shop/<id>/` product page.
 *
 *   bun run pins:gen                  # only products missing a pin
 *   bun run pins:gen --force          # re-render everything
 *   bun run pins:gen --placeholder    # skip the network; use a local stand-in photo
 *   bun run pins:gen --only kh-cool-bed-iii,fi-mini
 *
 * Output: `public/pins/<product-id>.jpg` at 1000×1500, which `PinterestSave` on the
 * detail page hands to Pinterest instead of the raw Amazon photo.
 *
 * Product photos are fetched from the merchant CDN and cached under `.cache/og-gen/`,
 * exactly as the OG pipeline does. That means **this needs network access** — it will
 * not run in a sandboxed agent container, where every Amazon request is refused. Run it
 * locally, or in the integration-checks workflow. `--placeholder` swaps in a local stand-in
 * photo so the whole layout can be reviewed offline — an empty frame would hide how the
 * composition actually reads.
 */

import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import sharp from 'sharp';

import { productCatalogItems, type ProductCatalogItem } from '../data/product-catalog';
import { getProductImages } from '../data/products/images';
import { categoryLabel } from '../utils/product-meta';
import { getCachedImageDataUri } from './og-gen/cache';
import { loadOgFonts } from './og-gen/fonts';
import { OG_THEMES, type OgTheme } from './og-gen/themes';
import { PIN_HEIGHT, PIN_WIDTH, ProductPinTemplate } from './og-gen/pin-template';

const OUT_DIR = path.join(process.cwd(), 'public', 'pins');
const LOGO_PATH = path.join(process.cwd(), 'public', 'images', 'chill-dogs-logo-padded.png');
/** Obviously-not-the-product stand-in, so a placeholder pin is never mistaken for a real one. */
const PLACEHOLDER_PHOTO = path.join(process.cwd(), 'public', 'images', 'hero-dog.png');

/** Product pillars map onto the four OG themes; `safety` shares the gear palette. */
const THEME_BY_PILLAR: Record<string, OgTheme> = {
  cooling: OG_THEMES.cooling,
  calming: OG_THEMES.calming,
  comfort: OG_THEMES.comfort,
  gear: OG_THEMES.gear,
  safety: OG_THEMES.gear,
};

interface CliOptions {
  force: boolean;
  placeholder: boolean;
  only: Set<string> | null;
}

function parseArgs(argv: string[]): CliOptions {
  const onlyIndex = argv.indexOf('--only');
  const only =
    onlyIndex > -1 && argv[onlyIndex + 1]
      ? new Set(argv[onlyIndex + 1].split(',').map((value) => value.trim()).filter(Boolean))
      : null;

  return {
    force: argv.includes('--force'),
    placeholder: argv.includes('--placeholder'),
    only,
  };
}

function imageDataUriFromFile(filePath: string, mimeType: string): string | null {
  if (!existsSync(filePath)) return null;
  return `data:${mimeType};base64,${readFileSync(filePath).toString('base64')}`;
}

/**
 * Pin copy is shorter than page copy. A pin is read at thumbnail size, so a 200-character
 * bullet becomes an unreadable grey block — trim to a phrase and drop what will not fit.
 */
function pinBullets(product: ProductCatalogItem): string[] {
  return product.bullets
    .map((bullet) => bullet.trim())
    .filter(Boolean)
    .map((bullet) => (bullet.length > 92 ? `${bullet.slice(0, 89).trimEnd()}…` : bullet))
    .slice(0, 3);
}

async function renderPin(
  product: ProductCatalogItem,
  options: CliOptions,
  fonts: Awaited<ReturnType<typeof loadOgFonts>>,
  logoDataUri: string | null
): Promise<'generated' | 'skipped' | 'failed'> {
  const targetPath = path.join(OUT_DIR, `${product.id}.jpg`);
  if (!options.force && existsSync(targetPath)) return 'skipped';

  try {
    const primary = getProductImages(product)[0];
    const productImageDataUri = options.placeholder
      ? imageDataUriFromFile(PLACEHOLDER_PHOTO, 'image/png')
      : primary
        ? await getCachedImageDataUri(primary.src)
        : null;

    if (!options.placeholder && !productImageDataUri) {
      // A pin whose whole point is the product photo is not worth shipping without one.
      console.warn(`[pins] no usable photo for ${product.id} — skipped`);
      return 'failed';
    }

    const svg = await satori(
      ProductPinTemplate({
        name: product.name,
        category: categoryLabel(product.category),
        bullets: pinBullets(product),
        productImageDataUri,
        logoDataUri,
        theme: THEME_BY_PILLAR[product.pillar] ?? OG_THEMES.gear,
      }),
      { width: PIN_WIDTH, height: PIN_HEIGHT, fonts }
    );

    // Resvg rasterises the SVG (satori emits SVG; sharp cannot rasterise foreignObject-free
    // SVG text reliably), then sharp encodes the JPEG.
    const png = new Resvg(svg, { fitTo: { mode: 'width', value: PIN_WIDTH } }).render().asPng();
    const jpeg = await sharp(png).jpeg({ quality: 88, mozjpeg: true }).toBuffer();

    writeFileSync(targetPath, jpeg);
    return 'generated';
  } catch (error) {
    console.error(
      `[pins] failed ${product.id}: ${error instanceof Error ? error.message : String(error)}`
    );
    return 'failed';
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  mkdirSync(OUT_DIR, { recursive: true });

  const fonts = loadOgFonts();
  const logoDataUri = imageDataUriFromFile(LOGO_PATH, 'image/png');

  const products = productCatalogItems.filter(
    (product) => !options.only || options.only.has(product.id)
  );

  if (options.only && products.length === 0) {
    console.error(`[pins] no catalog product matched --only ${[...options.only].join(',')}`);
    process.exitCode = 1;
    return;
  }

  const stats = { generated: 0, skipped: 0, failed: 0 };
  for (const product of products) {
    stats[await renderPin(product, options, fonts, logoDataUri)] += 1;
  }

  console.log(
    `[pins] ${stats.generated} generated, ${stats.skipped} already present, ${stats.failed} failed ` +
      `→ public/pins/ (${readdirSync(OUT_DIR).length} total)`
  );

  if (options.placeholder) {
    console.log('[pins] placeholder mode: photos are a stand-in. Re-run without it for real pins.');
  }
}

await main();
