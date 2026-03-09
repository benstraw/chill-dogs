import { describe, expect, it } from 'vitest';

import { buildBreadcrumbSchema } from '../utils/breadcrumbs';

describe('buildBreadcrumbSchema', () => {
  const siteUrl = 'https://chill-dogs.com';

  it('returns null for homepage', () => {
    expect(buildBreadcrumbSchema('/', siteUrl)).toBeNull();
  });

  it('builds breadcrumb list for nested routes', () => {
    const schema = buildBreadcrumbSchema('/cooling/cooling-mats/', siteUrl) as {
      '@type': string;
      itemListElement: Array<{ name: string; item: string; position: number }>;
    };

    expect(schema['@type']).toBe('BreadcrumbList');
    expect(schema.itemListElement).toEqual([
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://chill-dogs.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Cooling',
        item: 'https://chill-dogs.com/cooling/',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Cooling Mats',
        item: 'https://chill-dogs.com/cooling/cooling-mats/',
      },
    ]);
  });

  it('uses special labels for known route segments', () => {
    const schema = buildBreadcrumbSchema('/affiliate-disclosure/', siteUrl) as {
      itemListElement: Array<{ name: string }>;
    };

    expect(schema.itemListElement[1].name).toBe('Affiliate Disclosure');
  });
});
