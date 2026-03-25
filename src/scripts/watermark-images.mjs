import { mkdirSync, readdirSync, existsSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const projectRoot = process.cwd();
const sourceDir = path.join(projectRoot, 'src', 'images');
const watermarkedDir = path.join(sourceDir, 'watermarked');
const watermarkPath = path.join(projectRoot, 'public', 'images', 'chill-dogs-watermark.png');

if (!existsSync(watermarkPath)) {
  console.error(`Watermark image not found: ${watermarkPath}`);
  process.exit(1);
}

function findImages(dir, results = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (fullPath !== watermarkedDir) findImages(fullPath, results);
    } else if (/\.(jpe?g|png)$/i.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function buildWatermark(width, opacity) {
  const { data, info } = await sharp(watermarkPath)
    .resize(width)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Reduce alpha channel (every 4th byte) to target opacity
  for (let i = 3; i < data.length; i += 4) {
    data[i] = Math.round(data[i] * opacity);
  }

  return sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png()
    .toBuffer();
}

async function applyWatermark(sourcePath) {
  // Auto-rotate based on EXIF orientation, then work with corrected pixel dimensions
  const rotatedBuffer = await sharp(sourcePath).rotate().toBuffer();
  const metadata = await sharp(rotatedBuffer).metadata();

  const watermarkWidth = Math.round(metadata.width * 0.1);
  const watermark = await buildWatermark(watermarkWidth, 0.7);
  const wmMeta = await sharp(watermark).metadata();

  const padding = 20;
  const left = metadata.width - wmMeta.width - padding;
  const top = metadata.height - wmMeta.height - padding;

  const relativePath = path.relative(sourceDir, sourcePath);
  const outPath = path.join(watermarkedDir, relativePath);
  mkdirSync(path.dirname(outPath), { recursive: true });

  await sharp(rotatedBuffer)
    .composite([{ input: watermark, left, top, blend: 'over' }])
    .toFile(outPath);

  console.log(`  watermarked: ${relativePath}`);
}

const images = findImages(sourceDir);

if (images.length === 0) {
  console.log('watermark-images: no source images found, skipping.');
} else {
  console.log(`watermark-images: processing ${images.length} image(s)...`);
  await Promise.all(images.map(applyWatermark));
  console.log('watermark-images: done.');
}
