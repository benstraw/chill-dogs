import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const CACHE_DIR = path.join(process.cwd(), '.cache', 'og-gen');
const OUTPUT_CACHE_DIR = path.join(CACHE_DIR, 'outputs');
const IMAGE_CACHE_DIR = path.join(CACHE_DIR, 'images');

export function cacheKey(inputs: object): string {
  return createHash('sha256')
    .update(JSON.stringify(inputs))
    .digest('hex')
    .slice(0, 16);
}

export function ensureCacheDirs(): void {
  mkdirSync(OUTPUT_CACHE_DIR, { recursive: true });
  mkdirSync(IMAGE_CACHE_DIR, { recursive: true });
}

export function copyCachedOutputToPublic(key: string, targetPath: string): boolean {
  const cachedPath = path.join(OUTPUT_CACHE_DIR, `${key}.jpg`);
  if (!existsSync(cachedPath)) {
    return false;
  }

  mkdirSync(path.dirname(targetPath), { recursive: true });
  copyFileSync(cachedPath, targetPath);
  return true;
}

export function writeOutputWithCache(key: string, targetPath: string, jpegBuffer: Buffer): void {
  mkdirSync(path.dirname(targetPath), { recursive: true });
  ensureCacheDirs();
  writeFileSync(targetPath, jpegBuffer);
  writeFileSync(path.join(OUTPUT_CACHE_DIR, `${key}.jpg`), jpegBuffer);
}

function imageCacheBase(url: string): string {
  return path.join(IMAGE_CACHE_DIR, createHash('md5').update(url).digest('hex'));
}

function inferMimeType(url: string, responseType?: string | null): string {
  if (responseType?.startsWith('image/')) {
    return responseType.split(';')[0];
  }

  const pathname = new URL(url).pathname.toLowerCase();
  if (pathname.includes('.png')) return 'image/png';
  if (pathname.includes('.webp')) return 'image/webp';
  if (pathname.includes('.gif')) return 'image/gif';
  return 'image/jpeg';
}

async function dataUriForSatori(bytes: Buffer, mimeType: string): Promise<string | null> {
  try {
    const pngBytes = await sharp(bytes).png().toBuffer();
    return `data:image/png;base64,${pngBytes.toString('base64')}`;
  } catch (error) {
    if (mimeType === 'image/jpeg' || mimeType === 'image/png') {
      return `data:${mimeType};base64,${bytes.toString('base64')}`;
    }

    console.warn(`[og] failed to normalize hero image: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}

export async function getCachedImageDataUri(url: string): Promise<string | null> {
  ensureCacheDirs();
  const base = imageCacheBase(url);
  const imagePath = `${base}.bin`;
  const mimePath = `${base}.mime`;

  try {
    if (existsSync(imagePath) && existsSync(mimePath)) {
      return dataUriForSatori(readFileSync(imagePath), readFileSync(mimePath, 'utf8'));
    }

    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[og] failed to fetch hero image ${url}: ${response.status}`);
      return null;
    }

    const mimeType = inferMimeType(url, response.headers.get('content-type'));
    const bytes = Buffer.from(await response.arrayBuffer());
    writeFileSync(imagePath, bytes);
    writeFileSync(mimePath, mimeType);

    return dataUriForSatori(bytes, mimeType);
  } catch (error) {
    console.warn(`[og] failed to load hero image ${url}: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
