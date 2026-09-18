/**
 * Normalising merchant image URLs.
 *
 * Amazon serves a given photo from one base id with an optional **single** modifier
 * group appended before the extension:
 *
 *   https://m.media-amazon.com/images/I/71n1Mod8sRL.jpg            ← no modifier
 *   https://m.media-amazon.com/images/I/81IWGNpchBL._AC_SL1500_.jpg ← one modifier group
 *
 * The admin browser used to reach for a fixed size by appending its own group:
 * `raw.replace(/\.jpg$/i, '._SL500_.jpg')`. On a bare URL that works. On a URL that
 * already carries a group it produces `..._AC_SL1500_._SL500_.jpg`, which chains two
 * groups and is not a URL Amazon serves. 1578 of the 1844 images in the local cache
 * (86%) already carry a group, so nearly every image the tool offered was broken — the
 * three products seeded by hand happened to be among the 266 bare ones, which is why it
 * looked like it worked.
 *
 * The fix is to *replace* the modifier group rather than append to it.
 *
 * Chewy URLs use a different scheme and are passed through untouched — they are already
 * served at a usable size and rewriting them is guesswork.
 */

/** The size modifier used for stored gallery images. */
export const GALLERY_SIZE_MODIFIER = '_SL500_';

const AMAZON_IMAGE_HOSTS = new Set([
  'm.media-amazon.com',
  'images-na.ssl-images-amazon.com',
]);

const CHEWY_IMAGE_HOSTS = new Set(['image.chewy.com', 'img.chewy.com']);

/** Hosts a gallery image is allowed to come from. */
export function isAllowedImageHost(url: string): boolean {
  try {
    const { protocol, hostname } = new URL(url);
    return (
      protocol === 'https:' && (AMAZON_IMAGE_HOSTS.has(hostname) || CHEWY_IMAGE_HOSTS.has(hostname))
    );
  } catch {
    return false;
  }
}

/**
 * Rewrite an Amazon image URL to a single, known size modifier.
 *
 * Splits `<base>[.<modifier group>...].<ext>` and rebuilds with exactly one group, so
 * the result is valid whether the input was bare or already sized. Non-Amazon URLs and
 * anything unparseable come back unchanged.
 */
export function normalizeMerchantImageUrl(
  rawUrl: string,
  modifier: string = GALLERY_SIZE_MODIFIER
): string {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return rawUrl;
  }

  if (!AMAZON_IMAGE_HOSTS.has(parsed.hostname)) {
    return rawUrl;
  }

  // Amazon paths look like /images/I/<file>. Only the last segment carries modifiers.
  const segments = parsed.pathname.split('/');
  const filename = segments.pop();
  if (!filename) return rawUrl;

  const match = filename.match(/^([^.]+)((?:\.[^.]+)*)\.(jpg|jpeg|png|webp)$/i);
  if (!match) return rawUrl;

  const [, base, , extension] = match;
  segments.push(`${base}.${modifier}.${extension.toLowerCase()}`);
  parsed.pathname = segments.join('/');

  return parsed.toString();
}

/**
 * Whether two merchant image URLs point at the same underlying photo.
 *
 * The admin tray holds normalised URLs while the cache grid holds raw ones, so identity
 * has to be judged on the base id rather than the full string. The old code compared by
 * string-splicing `._SL500_` in and out, which missed every already-modified URL.
 */
export function isSameMerchantImage(a: string, b: string): boolean {
  return normalizeMerchantImageUrl(a) === normalizeMerchantImageUrl(b);
}
