import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { PAGE_TYPE_CTA } from '../config/og-cta.mjs';
import { Resvg } from '@resvg/resvg-js';

const projectRoot = process.cwd();
const pagesDir = path.join(projectRoot, 'src', 'pages');
const postsDir = path.join(projectRoot, 'src', 'data', 'posts');
const outDir = path.join(projectRoot, 'public', 'og');

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

const THEME_BY_PREFIX = [
  { prefix: '/cooling/', theme: 'cooling' },
  { prefix: '/calming/', theme: 'calming' },
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
  const raw = ogHeadline || seoTitle || title || 'Chill Dogs';
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
  if (explicitTheme === 'cooling' || explicitTheme === 'calming') {
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

  if (pathname === '/cooling/' || pathname === '/calming/' || pathname === '/blog/' || pathname === '/gift-guides/') {
    return 'collector';
  }

  if (pathname === '/cooling/how-hot-is-too-hot-for-dogs/' || pathname.startsWith('/travel/')) {
    return 'collector';
  }

  if (pathname.startsWith('/cooling/') || pathname.startsWith('/calming/')) {
    return 'converter';
  }

  return 'collector';
}

function titleFromPathname(pathname) {
  if (pathname === '/') {
    return 'Chill-Dogs: Cooling & Calming Picks for Dogs';
  }

  const clean = pathname.replace(/^\//, '').replace(/\/$/, '');
  const segment = clean.split('/').pop() || 'chill-dogs';
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
      bg1: '#D8EDF5',
      bg2: '#90C4D9',
      ink: '#173746',
      accent: '#1C4A5E',
      pillBg: '#173746',
      pillInk: '#FFFFFF',
    },
    calming: {
      bg1: '#E6EFE6',
      bg2: '#9FB89B',
      ink: '#243528',
      accent: '#2F5B3D',
      pillBg: '#2F5B3D',
      pillInk: '#FFFFFF',
    },
    neutral: {
      bg1: '#F4EEE2',
      bg2: '#E1D2B8',
      ink: '#2D2D2D',
      accent: '#8C5A45',
      pillBg: '#2D2D2D',
      pillInk: '#FFFFFF',
    },
  };

  const selected = themes[theme] || themes.neutral;
  const headlineLines = wrapText(escapeXml(headline), 30, 3);
  const lineHeight = 76;
  const headlineY = 235;

  const headlineSvg = headlineLines
    .map((line, index) => `<tspan x="72" y="${headlineY + (index * lineHeight)}">${line}</tspan>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630" role="img" aria-label="${escapeXml(headline)}">
  <defs>
    <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${selected.bg1}" />
      <stop offset="100%" stop-color="${selected.bg2}" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)" />
  <circle cx="1080" cy="120" r="180" fill="${selected.accent}" opacity="0.16" />
  <circle cx="1120" cy="560" r="240" fill="${selected.accent}" opacity="0.14" />

  <text x="72" y="98" font-size="34" font-family="'Nunito', Arial, sans-serif" fill="${selected.accent}" font-weight="700" letter-spacing="0.4">
    Chill-Dogs
  </text>

  <text x="72" y="${headlineY}" font-size="66" font-family="'Nunito', Arial, sans-serif" fill="${selected.ink}" font-weight="800">
    ${headlineSvg}
  </text>

  <rect x="72" y="500" width="520" height="78" rx="39" ry="39" fill="${selected.pillBg}" />
  <text x="332" y="550" text-anchor="middle" font-size="34" font-family="'Inter', Arial, sans-serif" fill="${selected.pillInk}" font-weight="700">
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
    });
  }

  return records;
}

function buildPostRouteRecords() {
  const postFiles = walkFiles(postsDir, (filePath) => filePath.endsWith('.md'));
  const records = [];

  for (const postFile of postFiles) {
    const relativePath = path.relative(postsDir, postFile).replace(/\\/g, '/');
    const segments = relativePath.split('/');
    if (segments.length < 2) {
      continue;
    }

    const category = segments[0];
    const slug = segments[segments.length - 1].replace(/\.md$/, '');
    const fm = parseFrontmatter(postFile);

    if (fm.draft === true) {
      continue;
    }

    records.push({
      pathname: `/${category}/${slug}/`,
      title: fm.title || titleFromPathname(`/${category}/${slug}/`),
      seoTitle: fm.seoTitle,
      ogHeadline: fm.ogHeadline,
      ogCta: fm.ogCta,
      pageType: fm.pageType || 'collector',
      ogTheme: inferTheme(`/${category}/${slug}/`, fm.ogTheme),
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

function generateOgImages() {
  mkdirSync(outDir, { recursive: true });

  const records = dedupeByPathname([
    ...buildStaticRouteRecords(),
    ...buildPostRouteRecords(),
  ]);

  for (const record of records) {
    const headline = deriveHeadline(record);
    const cta = deriveCta(record);
    const svg = renderOgSvg({
      headline,
      cta,
      theme: inferTheme(record.pathname, record.ogTheme),
    });

    const targetPath = path.join(outDir, `${slugFromPathname(record.pathname)}.png`);
    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });
    const pngData = resvg.render();
    writeFileSync(targetPath, pngData.asPng());
  }

  console.log(`[og] generated ${records.length} per-page OG images in public/og`);
}

generateOgImages();
