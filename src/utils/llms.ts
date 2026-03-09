export interface LlmsLink {
  title: string;
  path: string;
  description?: string;
  explicitPriority?: number;
}

interface RankedLlmsLink extends LlmsLink {
  priority: number;
}

const SECTION_RULES: Array<{ prefix: string; section: string }> = [
  { prefix: '/cooling/', section: 'Cooling Guides' },
  { prefix: '/calming/', section: 'Calming Guides' },
  { prefix: '/travel/', section: 'Travel Guides' },
  { prefix: '/about/', section: 'About' },
  { prefix: '/contact/', section: 'About' },
];

const EXCLUDED_EXACT_PATHS = new Set([
  '/404/',
  '/content-sitemap/',
  '/privacy-policy/',
  '/terms/',
  '/affiliate-disclosure/',
]);

export function normalizePath(path: string): string {
  if (!path.startsWith('/')) {
    return `/${path}`;
  }

  return path.endsWith('/') ? path : `${path}/`;
}

export function shouldExcludePath(path: string): boolean {
  const normalized = normalizePath(path);

  if (EXCLUDED_EXACT_PATHS.has(normalized)) {
    return true;
  }

  if (normalized.includes('/v/')) {
    return true;
  }

  if (/\/page\/\d+\/?$/i.test(normalized)) {
    return true;
  }

  return false;
}

export function sectionForPath(path: string): string {
  const normalized = normalizePath(path);
  const match = SECTION_RULES.find((rule) => normalized.startsWith(rule.prefix));
  return match ? match.section : 'Core Pages';
}

export function rankLlmsLink(link: LlmsLink): number {
  if (typeof link.explicitPriority === 'number') {
    return link.explicitPriority;
  }

  const path = normalizePath(link.path);

  if (path === '/') {
    return 1000;
  }

  if (path === '/cooling/' || path === '/calming/') {
    return 950;
  }

  if (path.startsWith('/cooling/') || path.startsWith('/calming/')) {
    return 900;
  }

  if (path.startsWith('/travel/')) {
    return 880;
  }

  if (path === '/about/' || path === '/contact/') {
    return 500;
  }

  return 400;
}

export function dedupeAndRankLinks(links: LlmsLink[]): RankedLlmsLink[] {
  const byPath = new Map<string, RankedLlmsLink>();

  for (const link of links) {
    const path = normalizePath(link.path);
    if (shouldExcludePath(path)) {
      continue;
    }

    const ranked: RankedLlmsLink = {
      ...link,
      path,
      priority: rankLlmsLink({ ...link, path }),
    };

    const existing = byPath.get(path);
    if (!existing || ranked.priority > existing.priority) {
      byPath.set(path, ranked);
    }
  }

  return Array.from(byPath.values()).sort((a, b) => b.priority - a.priority || a.path.localeCompare(b.path));
}

export function toAbsoluteUrl(baseUrl: string, path: string): string {
  return new URL(normalizePath(path), baseUrl).href;
}

function linkLine(baseUrl: string, link: LlmsLink): string {
  const absolute = toAbsoluteUrl(baseUrl, link.path);
  if (!link.description) {
    return `- [${link.title}](${absolute})`;
  }

  return `- [${link.title}](${absolute}): ${link.description}`;
}

export function buildLlmsMarkdown(options: {
  siteName: string;
  description: string;
  shortParagraph?: string;
  baseUrl: string;
  links: LlmsLink[];
  maxLinks?: number;
}): string {
  const {
    siteName,
    description,
    shortParagraph,
    baseUrl,
    links,
    maxLinks = 40,
  } = options;

  const selected = dedupeAndRankLinks(links).slice(0, maxLinks);
  const grouped = new Map<string, LlmsLink[]>();

  for (const link of selected) {
    const section = sectionForPath(link.path);
    const sectionLinks = grouped.get(section) || [];
    sectionLinks.push(link);
    grouped.set(section, sectionLinks);
  }

  const sectionOrder = [
    'Core Pages',
    'Cooling Guides',
    'Calming Guides',
    'Travel Guides',
    'About',
  ];

  const lines: string[] = [
    `# ${siteName}`,
    '',
    `> ${description}`,
    '',
  ];

  if (shortParagraph) {
    lines.push(shortParagraph, '');
  }

  for (const section of sectionOrder) {
    const items = grouped.get(section);
    if (!items || items.length === 0) {
      continue;
    }

    lines.push(`## ${section}`);
    for (const link of items) {
      lines.push(linkLine(baseUrl, link));
    }
    lines.push('');
  }

  return `${lines.join('\n').trim()}\n`;
}
