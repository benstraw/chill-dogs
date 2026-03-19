import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PAGE_TYPE_CTA } from '../config/og-cta.mjs';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const projectRoot = process.cwd();
const pagesDir = path.join(projectRoot, 'src', 'pages');
const outDir = path.join(projectRoot, 'public', 'og');
const logoPath = path.join(projectRoot, 'public', 'images', 'chill-dogs-logo-padded.png');

const logoDataUri = existsSync(logoPath)
  ? `data:image/png;base64,${readFileSync(logoPath).toString('base64')}`
  : null;

const EXCLUDED_STATIC_ROUTES = new Set([
  '/404/',
  '/content-sitemap/',
  '/privacy-policy/',
  '/terms/',
]);

const INFORMER_ROUTES = new Set([
  '/about/',
  '/contact/',
  '/affiliate-disclosure/',
  '/privacy-policy/',
  '/terms/',
]);

// Per-route overrides for headline and CTA (keyed by pathname)
const ROUTE_OVERRIDES = {
  '/': {
    ogHeadline: 'Cooling, Calming & Comforting Products for Dogs',
    ogCta: 'See the Products',
  },
};

const THEME_BY_PREFIX = [
  { prefix: '/cooling/', theme: 'cooling' },
  { prefix: '/calming/', theme: 'calming' },
  { prefix: '/comforting/', theme: 'comfort' },
];

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, ' ').trim();
}

function clampText(text, maxChars) {
  const normalized = normalizeWhitespace(text);
  if (normalized.length <= maxChars) {
    return normalized;
  }

  const truncated = normalized.slice(0, maxChars - 1);
  const safeBoundary = truncated.lastIndexOf(' ');
  const safeSlice = safeBoundary >= Math.floor(maxChars * 0.6)
    ? truncated.slice(0, safeBoundary)
    : truncated;
  return `${safeSlice.trimEnd()}…`;
}

function deriveHeadline({ title, seoTitle, ogHeadline }) {
  const raw = ogHeadline || seoTitle || title || 'Chill-Dogs';
  return clampText(
    normalizeWhitespace(raw)
      .replace(/\s*\|\s*Chill-?Dogs\s*$/i, '')
      .replace(/^Chill-?Dogs\s*[—|-]\s*/i, ''),
    86,
  );
}

function deriveCta({ pageType, ogCta }) {
  if (ogCta) {
    return clampText(ogCta, 44);
  }

  return PAGE_TYPE_CTA[pageType] || PAGE_TYPE_CTA.collector;
}

function slugFromPathname(pathname) {
  const clean = pathname.replace(/^\//, '').replace(/\/+$/, '');
  return clean ? clean.replace(/\//g, '-') : 'home';
}

function inferTheme(pathname, explicitTheme) {
  if (explicitTheme === 'cooling' || explicitTheme === 'calming' || explicitTheme === 'comfort') {
    return explicitTheme;
  }

  const match = THEME_BY_PREFIX.find((item) => pathname.startsWith(item.prefix));
  return match ? match.theme : 'neutral';
}

function inferPageType(pathname) {
  if (INFORMER_ROUTES.has(pathname)) {
    return 'informer';
  }

  if (pathname === '/') {
    return 'attractor';
  }

  if (pathname === '/cooling/' || pathname === '/calming/' || pathname === '/comforting/') {
    return 'collector';
  }

  if (
    pathname === '/cooling/how-hot-is-too-hot-for-dogs/' ||
    pathname === '/cooling/keep-dog-cool-in-car/' ||
    pathname.startsWith('/travel/')
  ) {
    return 'collector';
  }

  if (
    pathname.startsWith('/cooling/') ||
    pathname.startsWith('/calming/') ||
    pathname.startsWith('/comforting/')
  ) {
    return 'converter';
  }

  return 'collector';
}

function titleFromPathname(pathname) {
  if (pathname === '/') {
    return 'Chill-Dogs: Cooling & Calming Picks for Dogs';
  }

  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const segment = clean.split('/').pop() || 'Chill-Dogs';
  return segment
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeXml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxCharsPerLine, maxLines) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const next = currentLine ? `${currentLine} ${word}` : word;
    if (next.length <= maxCharsPerLine) {
      currentLine = next;
      continue;
    }

    if (currentLine) {
      lines.push(currentLine);
      if (lines.length >= maxLines) {
        return lines;
      }
    }

    currentLine = word;
  }

  if (currentLine && lines.length < maxLines) {
    lines.push(currentLine);
  }

  if (lines.length === maxLines) {
    lines[maxLines - 1] = clampText(lines[maxLines - 1], maxCharsPerLine);
  }

  return lines;
}

function renderOgSvg({ headline, cta, theme }) {
  const themes = {
    cooling: {
      bg1: '#E4EFF5',
      bg2: '#A8C8D8',
      ink: '#173746',
      accent: '#1C4A5E',
      pillBg: '#1C4A5E',
      pillInk: '#FFFFFF',
      blobA: '#4A8BAA',
      blobB: '#A8C8D8',
    },
    calming: {
      bg1: '#EBF2EB',
      bg2: '#AEBFAA',
      ink: '#243528',
      accent: '#2F5B3D',
      pillBg: '#2F5B3D',
      pillInk: '#FFFFFF',
      blobA: '#4A7A5A',
      blobB: '#AEBFAA',
    },
    comfort: {
      bg1: '#F7EDEB',
      bg2: '#C9AAAE',
      ink: '#3D2226',
      accent: '#8C4A52',
      pillBg: '#7A3840',
      pillInk: '#FFFFFF',
      blobA: '#A06068',
      blobB: '#C9AAAE',
    },
    neutral: {
      bg1: '#F0F0F0',
      bg2: '#B8B8B8',
      ink: '#222222',
      accent: '#555555',
      pillBg: '#333333',
      pillInk: '#FFFFFF',
      blobA: '#888888',
      blobB: '#C4C4C4',
    },
  };

  const t = themes[theme] || themes.neutral;
  const headlineLines = wrapText(escapeXml(headline), 26, 3);
  const lineHeight = 76;
  const headlineY = 255;

  const headlineSvg = headlineLines
    .map((line, index) => `<tspan x="80" y="${headlineY + index * lineHeight}">${line}</tspan>`)
    .join('');

  const logoEl = logoDataUri
    ? `<image href="${logoDataUri}" x="92" y="52" width="64" height="64" />`
    : '';

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(headline)}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${t.bg1}" />
      <stop offset="100%" stop-color="${t.bg2}" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="url(#bg)" />

  <!-- Decorative blobs -->
  <circle cx="1060" cy="100" r="200" fill="${t.blobA}" opacity="0.14" />
  <circle cx="1130" cy="580" r="260" fill="${t.blobB}" opacity="0.18" />
  <circle cx="200" cy="580" r="140" fill="${t.blobA}" opacity="0.08" />

  <!-- Header card (frosted) -->
  <rect x="80" y="42" width="460" height="88" rx="14" fill="white" opacity="0.38" />

  <!-- Header bar: logo + wordmark -->
  ${logoEl}
  <text x="168" y="96" font-size="32" font-family="'Nunito', Arial, sans-serif" fill="${t.ink}" font-weight="800" letter-spacing="0.5">
    Chill-Dogs
  </text>

  <!-- Divider line -->
  <line x1="80" y1="144" x2="540" y2="144" stroke="${t.accent}" stroke-width="2" opacity="0.3" />

  <!-- Headline -->
  <text x="80" y="${headlineY}" font-size="66" font-family="'Nunito', Arial, sans-serif" fill="${t.ink}" font-weight="800" letter-spacing="-0.5">
    ${headlineSvg}
  </text>

  <!-- CTA pill -->
  <rect x="80" y="470" width="520" height="76" rx="38" ry="38" fill="${t.pillBg}" />
  <text x="340" y="519" text-anchor="middle" font-size="32" font-family="'Inter', Arial, sans-serif" fill="${t.pillInk}" font-weight="700" letter-spacing="0.2">
    ${escapeXml(clampText(cta, 42))}
  </text>
</svg>`;
}

function parseFrontmatter(filePath) {
  const raw = readFileSync(filePath, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return {};
  }

  const result = {};
  const lines = match[1].split('\n');

  for (const line of lines) {
    const pair = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!pair) {
      continue;
    }

    const key = pair[1];
    let value = pair[2].trim();

    if (!value || value === '[]') {
      continue;
    }

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (value === 'true') {
      result[key] = true;
    } else if (value === 'false') {
      result[key] = false;
    } else {
      result[key] = value;
    }
  }

  return result;
}

function walkFiles(dir, include) {
  const out = [];
  if (!existsSync(dir)) {
    return out;
  }

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkFiles(fullPath, include));
    } else if (include(fullPath)) {
      out.push(fullPath);
    }
  }

  return out;
}

function pathnameFromAstroFile(filePath) {
  const relativePath = path.relative(pagesDir, filePath).replace(/\\/g, '/');
  const withoutExt = relativePath.replace(/\.astro$/, '');

  if (withoutExt.includes('[')) {
    return null;
  }

  if (withoutExt === 'index') {
    return '/';
  }

  const routePath = withoutExt.endsWith('/index')
    ? withoutExt.slice(0, -('/index'.length))
    : withoutExt;

  const normalized = routePath ? `/${routePath}/` : '/';

  if (EXCLUDED_STATIC_ROUTES.has(normalized)) {
    return null;
  }

  if (normalized.startsWith('/admin/')) {
    return null;
  }

  return normalized;
}

function buildStaticRouteRecords() {
  const astroFiles = walkFiles(pagesDir, (filePath) => filePath.endsWith('.astro'));
  const records = [];

  for (const astroFile of astroFiles) {
    const pathname = pathnameFromAstroFile(astroFile);
    if (!pathname || pathname.includes('/v/')) {
      continue;
    }

    records.push({
      pathname,
      title: titleFromPathname(pathname),
      pageType: inferPageType(pathname),
      ogTheme: inferTheme(pathname),
      ...ROUTE_OVERRIDES[pathname],
    });
  }

  return records;
}

function dedupeByPathname(records) {
  const seen = new Set();
  const out = [];

  for (const record of records) {
    if (seen.has(record.pathname)) {
      continue;
    }
    seen.add(record.pathname);
    out.push(record);
  }

  return out;
}

async function generateOgImages() {
  mkdirSync(outDir, { recursive: true });

  const records = dedupeByPathname(buildStaticRouteRecords());

  for (const record of records) {
    const headline = deriveHeadline(record);
    const cta = deriveCta(record);
    const svg = renderOgSvg({
      headline,
      cta,
      theme: inferTheme(record.pathname, record.ogTheme),
    });

    const targetPath = path.join(outDir, `${slugFromPathname(record.pathname)}.jpg`);
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });
    const pngData = resvg.render();
    const jpegBuffer = await sharp(pngData.asPng()).jpeg({ quality: 85, mozjpeg: true }).toBuffer();
    writeFileSync(targetPath, jpegBuffer);
  }

  console.log(`[og] generated ${records.length} per-page OG images in public/og`);
}

generateOgImages();
