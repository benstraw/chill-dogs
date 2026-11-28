/**
 * Photo share cards: a page's own photo, cropped to 1200×630, with the page title
 * in a translucent rounded box so the card still says what the page is (#339).
 *
 * Pure SVG building lives here so it can be unit-tested; `composePhotoCard` does
 * the image work with Resvg + sharp, the same stack as `src/scripts/generate-og-images.mjs`.
 */

export const PHOTO_CARD_WIDTH = 1200;
export const PHOTO_CARD_HEIGHT = 630;

const TITLE_FONT_SIZE = 54;
const TITLE_LINE_HEIGHT = 64;
const TITLE_MAX_LINES = 3;
const TITLE_MAX_CHARS_PER_LINE = 34;
const BOX_MARGIN = 48;
const BOX_PADDING_X = 40;
const BOX_PADDING_Y = 30;

const ACCENT_BY_PREFIX = [
  ['/cooling/', '#1C4A5E'],
  ['/calming/', '#2F5B3D'],
  ['/comforting/', '#7A3840'],
  ['/gear/', '#5B3D8C'],
  ['/travel/', '#5B3D8C'],
  ['/safety/', '#5B3D8C'],
];

export function photoCardAccent(pathname) {
  return ACCENT_BY_PREFIX.find(([prefix]) => pathname.startsWith(prefix))?.[1] ?? '#333333';
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** Drops a trailing "| Chill-Dogs" and leading "Chill-Dogs —", as generated cards do. */
export function photoCardHeadline(title) {
  return title
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\s*\|\s*Chill-?Dogs\s*$/i, '')
    .replace(/^Chill-?Dogs\s*[—|-]\s*/i, '');
}

/**
 * Wraps on whole words into at most `maxLines` lines. If the title doesn't fit,
 * the last line ends on a whole word plus "…" — never in the middle of a word.
 */
export function wrapTitle(title, maxChars = TITLE_MAX_CHARS_PER_LINE, maxLines = TITLE_MAX_LINES) {
  const words = title.split(' ').filter(Boolean);
  const lines = [];
  let current = '';
  let index = 0;

  for (; index < words.length; index += 1) {
    const word = words[index];
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars || !current) {
      current = next;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines) break;
  }

  if (lines.length < maxLines) {
    if (current) lines.push(current);
    return lines;
  }

  // Ran out of lines with words left over: end the last line on a whole word + "…".
  const lastWords = lines[maxLines - 1].split(' ');
  while (lastWords.length > 1 && `${lastWords.join(' ')}…`.length > maxChars) lastWords.pop();
  lines[maxLines - 1] = `${lastWords.join(' ').replace(/[,:;—–-]+$/, '')}…`;
  return lines;
}

/** The overlay drawn on top of the cropped photo, as an SVG string. */
export function buildPhotoCardSvg({ headline, accent = '#333333', logoDataUri = null }) {
  const lines = wrapTitle(headline);
  const longest = Math.max(...lines.map((line) => line.length), 1);
  const textWidth = Math.ceil(longest * TITLE_FONT_SIZE * 0.56);
  const boxWidth = Math.min(PHOTO_CARD_WIDTH - BOX_MARGIN * 2, Math.max(520, textWidth + BOX_PADDING_X * 2));
  const boxHeight = lines.length * TITLE_LINE_HEIGHT + BOX_PADDING_Y * 2 - (TITLE_LINE_HEIGHT - TITLE_FONT_SIZE);
  const boxX = BOX_MARGIN;
  const boxY = PHOTO_CARD_HEIGHT - BOX_MARGIN - boxHeight;
  const firstBaseline = boxY + BOX_PADDING_Y + TITLE_FONT_SIZE - 8;

  const tspans = lines
    .map((line, i) => `<tspan x="${boxX + BOX_PADDING_X}" y="${firstBaseline + i * TITLE_LINE_HEIGHT}">${escapeXml(line)}</tspan>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PHOTO_CARD_WIDTH}" height="${PHOTO_CARD_HEIGHT}" viewBox="0 0 ${PHOTO_CARD_WIDTH} ${PHOTO_CARD_HEIGHT}">
  <defs>
    <linearGradient id="shade" x1="0" x2="0" y1="0" y2="1">
      <stop offset="45%" stop-color="#000" stop-opacity="0" />
      <stop offset="100%" stop-color="#000" stop-opacity="0.35" />
    </linearGradient>
  </defs>
  <rect width="${PHOTO_CARD_WIDTH}" height="${PHOTO_CARD_HEIGHT}" fill="url(#shade)" />
  <rect x="${BOX_MARGIN}" y="40" width="${logoDataUri ? 238 : 220}" height="64" rx="32" fill="#FFFFFF" opacity="0.88" />
  ${logoDataUri
    ? `<image href="${logoDataUri}" x="${BOX_MARGIN + 14}" y="46" width="52" height="52" />`
    : `<circle cx="${BOX_MARGIN + 34}" cy="72" r="10" fill="${accent}" />`}
  <text x="${BOX_MARGIN + (logoDataUri ? 72 : 56)}" y="83" font-size="30" font-family="'Nunito', 'Inter', Arial, sans-serif" font-weight="800" fill="#1e2326">Chill-Dogs</text>
  <rect x="${boxX}" y="${boxY}" width="${boxWidth}" height="${boxHeight}" rx="20" fill="#0f1417" opacity="0.6" />
  <rect x="${boxX}" y="${boxY}" width="8" height="${boxHeight}" rx="4" fill="${accent}" />
  <text font-size="${TITLE_FONT_SIZE}" font-family="'Nunito', 'Inter', Arial, sans-serif" font-weight="800" fill="#FFFFFF" letter-spacing="-0.5">${tspans}</text>
</svg>`;
}

/** Crops `photo` (any format sharp reads) to 1200×630 and draws the title over it; returns a JPEG. */
export async function composePhotoCard(photo, { headline, accent, logoDataUri = null }) {
  const [{ default: sharp }, { Resvg }] = await Promise.all([import('sharp'), import('@resvg/resvg-js')]);
  const overlay = new Resvg(buildPhotoCardSvg({ headline, accent, logoDataUri }), {
    fitTo: { mode: 'width', value: PHOTO_CARD_WIDTH },
  }).render().asPng();

  return sharp(photo)
    .resize(PHOTO_CARD_WIDTH, PHOTO_CARD_HEIGHT, { fit: 'cover', position: 'attention' })
    .composite([{ input: overlay }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toBuffer();
}
