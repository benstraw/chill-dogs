interface BreadcrumbItem {
  '@type': 'ListItem';
  position: number;
  name: string;
  item: string;
}

const SEGMENT_LABELS: Record<string, string> = {
  'gift-guides': 'Gift Guides',
  'privacy-policy': 'Privacy Policy',
  'affiliate-disclosure': 'Affiliate Disclosure',
  'content-sitemap': 'Content Sitemap',
};

function toTitleCase(value: string): string {
  return value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function segmentLabel(segment: string): string {
  return SEGMENT_LABELS[segment] || toTitleCase(segment);
}

export function buildBreadcrumbSchema(pathname: string, siteUrl: string): Record<string, unknown> | null {
  const cleanPath = pathname
    .trim()
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!cleanPath) {
    return null;
  }

  const segments = cleanPath.split('/');
  const items: BreadcrumbItem[] = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Home',
      item: new URL('/', siteUrl).href,
    },
  ];

  for (let index = 0; index < segments.length; index += 1) {
    const path = `/${segments.slice(0, index + 1).join('/')}/`;
    items.push({
      '@type': 'ListItem',
      position: index + 2,
      name: segmentLabel(segments[index]),
      item: new URL(path, siteUrl).href,
    });
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items,
  };
}

