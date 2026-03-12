const PAGES_PREFIX = 'src/pages/';

export function isProductionVercelEnv(env = process.env) {
  return String(env.VERCEL_ENV || '').toLowerCase() === 'production';
}

export function normalizeOrigin(origin) {
  const value = (origin || 'https://www.chill-dogs.com').trim();
  return value.endsWith('/') ? value.slice(0, -1) : value;
}

export function mapPageFileToUrl(filePath, origin = 'https://www.chill-dogs.com') {
  if (!filePath || !filePath.startsWith(PAGES_PREFIX)) return null;
  if (!filePath.endsWith('.astro')) return null;

  const routePath = filePath.slice(PAGES_PREFIX.length, -'.astro'.length);

  if (!routePath || routePath.includes('[') || routePath.includes(']')) return null;
  if (routePath === 'content-sitemap') return null;
  if (routePath.startsWith('admin/')) return null;
  if (routePath === '404') return null;
  if (routePath.includes('/v/')) return null;

  let pathname;
  if (routePath === 'index') {
    pathname = '/';
  } else if (routePath.endsWith('/index')) {
    pathname = `/${routePath.slice(0, -'/index'.length)}/`;
  } else {
    pathname = `/${routePath}/`;
  }

  const siteOrigin = normalizeOrigin(origin);
  return `${siteOrigin}${pathname}`;
}

export function collectChangedPageUrls(changedFiles, origin = 'https://www.chill-dogs.com') {
  const urls = new Set();
  for (const filePath of changedFiles || []) {
    const mapped = mapPageFileToUrl(filePath, origin);
    if (mapped) urls.add(mapped);
  }
  return Array.from(urls).sort();
}

export function buildSubmissionUrls({ changedPageUrls, sitemapUrl }) {
  if (Array.isArray(changedPageUrls) && changedPageUrls.length > 0) {
    return { mode: 'changed_urls', urlList: changedPageUrls };
  }
  return { mode: 'sitemap_fallback', urlList: [sitemapUrl] };
}
