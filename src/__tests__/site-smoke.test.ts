import { beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../..');
const distRoot = path.join(projectRoot, 'dist');

function collectHtmlFiles(dir: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function buildSite() {
  execFileSync('bun', ['run', 'build'], {
    cwd: projectRoot,
    stdio: 'pipe',
  });
}

function readBuiltPage(relativePath: string): Document {
  const html = readFileSync(path.join(distRoot, relativePath), 'utf8')
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '')
    .replace(/<script\b[^>]*src="[^"]*"[^>]*><\/script>/g, '');
  return new DOMParser().parseFromString(html, 'text/html');
}

function readBuiltAsset(relativePath: string): string {
  return readFileSync(path.join(distRoot, relativePath), 'utf8');
}

function readArticlePublishOrder(): string[] {
  const articlesRoot = path.join(projectRoot, 'src', 'content', 'articles');

  return readdirSync(articlesRoot)
    .filter((entry) => entry.endsWith('.mdx'))
    .map((entry) => {
      const contents = readFileSync(path.join(articlesRoot, entry), 'utf8');
      const pubDate = contents.match(/^pubDate:\s*([0-9-]+)/m)?.[1];
      const canonicalPath = contents.match(/^canonicalPath:\s*'([^']+)'/m)?.[1];

      if (!pubDate || !canonicalPath) {
        throw new Error(`Missing pubDate or canonicalPath in ${entry}`);
      }

      return {
        canonicalPath,
        pubDate: new Date(pubDate),
      };
    })
    .sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf())
    .map((article) => article.canonicalPath);
}

function firstMainImageAbsolute(doc: Document): string | null {
  const image = doc.querySelector<HTMLImageElement>('main img');
  const src = image?.getAttribute('src');
  if (!src) return null;
  if (src.startsWith('data:')) return null;
  if (src.startsWith('//')) return `https:${src}`;
  return new URL(src, 'https://www.chill-dogs.com').href;
}

function getAffiliateLinks(doc: Document): HTMLAnchorElement[] {
  return Array.from(
    doc.querySelectorAll<HTMLAnchorElement>('a[data-affiliate="true"][data-track="affiliate_outbound_click"]')
  );
}

function expectTrackedAffiliateLink(link: HTMLAnchorElement) {
  expect(relTokens(link)).toEqual(['noopener', 'noreferrer', 'sponsored']);
  expect(link.getAttribute('target')).toBe('_blank');

  if (link.getAttribute('data-merchant') === 'amazon') {
    expect(link.getAttribute('data-track-also')).toBe('amazon_outbound_click');
    expect(link.href).toContain('tag=chill-dogs-20');
  } else {
    expect(link.getAttribute('data-track-also')).toBeNull();
  }
}

function relTokens(link: HTMLAnchorElement): string[] {
  return (link.getAttribute('rel') || '')
    .split(/\s+/)
    .filter(Boolean)
    .sort();
}

/** Returns true for Astro-generated redirect stub pages (no real content). */
function isRedirectStub(html: string): boolean {
  return /http-equiv=['"]refresh['"]/i.test(html);
}

describe('site smoke tests', () => {
  beforeAll(() => {
    buildSite();
  }, 30_000);

  it('renders the homepage with both primary navigation CTAs', () => {
    const doc = readBuiltPage('index.html');

    const coolingCta = doc.querySelector<HTMLAnchorElement>('a[data-track="hero_click_cooling"]');
    const calmingCta = doc.querySelector<HTMLAnchorElement>('a[data-track="hero_click_calming"]');
    const canonical = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    expect(coolingCta?.getAttribute('href')).toBe('/cooling/');
    expect(calmingCta?.getAttribute('href')).toBe('/calming/');
    expect(canonical?.getAttribute('href')).toBe('https://www.chill-dogs.com/');
  });

  it('links the homepage into crate training and road trip crate paths', () => {
    const doc = readBuiltPage('index.html');

    const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>('a')).map((link) =>
      link.getAttribute('href')
    );

    expect(links).toContain('/calming/crate-training-for-dogs/');
    expect(links).toContain('/comforting/best-travel-crates-for-road-trips/');
    expect(links).toContain('/calming/best-lick-mats-for-dogs/');
  });

  it('renders dynamic section collector inventories for articles and converters', () => {
    const coolingDoc = readBuiltPage(path.join('cooling', 'index.html'));
    const calmingDoc = readBuiltPage(path.join('calming', 'index.html'));
    const comfortDoc = readBuiltPage(path.join('comforting', 'index.html'));
    const getLinks = (doc: Document) =>
      Array.from(doc.querySelectorAll<HTMLAnchorElement>('a')).map((link) => link.getAttribute('href'));
    const getHeadings = (doc: Document) =>
      Array.from(doc.querySelectorAll<HTMLHeadingElement>('.section-heading')).map((heading) => heading.textContent);
    const coolingGuideCards = Array.from(coolingDoc.querySelectorAll<HTMLAnchorElement>('.cat-card--guide'));
    const coolingConverterCards = Array.from(coolingDoc.querySelectorAll<HTMLAnchorElement>('.cat-card--converter'));

    expect(getLinks(coolingDoc)).toEqual(expect.arrayContaining([
      '/cooling/dog-travel-hydration/',
      '/travel/dog-road-trip-gear/',
    ]));
    expect(getLinks(calmingDoc)).toEqual(expect.arrayContaining([
      '/calming/cbd-for-dogs/',
      '/gear/best-dog-gps-trackers/',
    ]));
    expect(getLinks(comfortDoc)).toEqual(expect.arrayContaining([
      '/comforting/best-airline-approved-dog-carriers/',
      '/travel/how-to-fly-with-a-dog/',
    ]));
    expect(getHeadings(coolingDoc)).toEqual(expect.arrayContaining(['Car Cooling & Travel Hydration', 'Wearable Cooling']));
    expect(getHeadings(calmingDoc)).toEqual(expect.arrayContaining(['Car Anxiety & Travel Stress', 'Escape Risk & Tracking']));
    expect(getHeadings(comfortDoc)).toEqual(expect.arrayContaining(['Calming & Orthopedic Beds', 'Flying, Carriers & Travel Prep']));
    expect(coolingGuideCards.length).toBeGreaterThan(0);
    expect(coolingGuideCards[0]?.querySelector('.cat-card-badge')?.textContent).toBe('Guide');
    expect(coolingGuideCards[0]?.querySelector('img')?.getAttribute('src')).toBeTruthy();
    expect(coolingConverterCards[0]?.querySelector('img')).toBeNull();
  });

  it('renders derived InternalLinkStrip links on migrated pages', () => {
    const cases = [
      {
        page: path.join('cooling', 'keep-dog-cool-in-car', 'index.html'),
        expected: ['/cooling/car-cooling-for-dogs/', '/cooling/cooling-mats/', '/cooling/dog-travel-hydration/', '/travel/dog-road-trip-gear/'],
      },
      {
        page: path.join('travel', 'how-to-fly-with-a-dog', 'index.html'),
        expected: [
          '/comforting/best-airline-approved-dog-carriers/',
          '/comforting/best-dog-travel-bags-for-flying/',
          '/cooling/dog-travel-hydration/',
          '/comforting/best-airline-crates-for-flying-with-your-dog/',
          '/calming/best-calming-products-for-anxious-dogs/',
          '/calming/car-anxiety-for-dogs/',
          '/travel/dog-road-trip-gear/',
        ],
      },
      {
        page: path.join('travel', 'dog-road-trip-gear', 'index.html'),
        expected: [
          '/comforting/best-travel-crates-for-road-trips/',
          '/cooling/car-cooling-for-dogs/',
          '/cooling/dog-travel-hydration/',
          '/calming/car-anxiety-for-dogs/',
          '/calming/best-lick-mats-for-dogs/',
        ],
      },
      {
        page: path.join('calming', 'cbd-for-dogs', 'index.html'),
        expected: [
          '/calming/best-calming-products-for-anxious-dogs/',
          '/calming/best-thundershirt-alternatives/',
          '/calming/car-anxiety-for-dogs/',
          '/calming/best-lick-mats-for-dogs/',
          '/comforting/best-orthopedic-dog-beds/',
        ],
      },
      {
        page: path.join('gear', 'fi-dog-collar-review', 'index.html'),
        expected: [
          '/gear/best-dog-gps-trackers/',
          '/gear/garmin-dog-tracking-collars/',
          '/gear/airtag-for-dogs/',
          '/travel/rhys-ran-away-cerro-san-luis-obispo/',
          '/safety/what-to-do-if-your-dog-runs-away/',
        ],
      },
      {
        page: path.join('cooling', 'cooling-mats', 'index.html'),
        expected: [
          '/cooling/cooling-bandanas/',
          '/cooling/cooling-vests/',
          '/cooling/freezable-dog-toys/',
          '/cooling/best-cooling-products-for-dogs/',
        ],
      },
      {
        page: path.join('cooling', 'car-cooling-for-dogs', 'index.html'),
        expected: [
          '/travel/dog-road-trip-gear/',
          '/cooling/cooling-mats/',
          '/cooling/dog-travel-hydration/',
          '/cooling/best-cooling-products-for-dogs/',
        ],
      },
      {
        page: path.join('calming', 'best-calming-products-for-anxious-dogs', 'index.html'),
        expected: [
          '/travel/dog-road-trip-gear/',
          '/cooling/best-cooling-products-for-dogs/',
          '/calming/',
          '/calming/best-thundershirt-alternatives/',
          '/gear/best-dog-gps-trackers/',
          '/safety/what-to-do-if-your-dog-runs-away/',
        ],
      },
      {
        page: path.join('comforting', 'best-anxiety-dog-crates', 'index.html'),
        expected: [
          '/calming/crate-training-for-dogs/',
          '/calming/best-calming-products-for-anxious-dogs/',
          '/comforting/best-heavy-duty-dog-crates/',
          '/comforting/best-puppy-crates/',
        ],
      },
    ];

    for (const testCase of cases) {
      const doc = readBuiltPage(testCase.page);
      const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>('.ils-link'));

      expect(links.map((link) => link.getAttribute('href'))).toEqual(testCase.expected);
      for (const link of links) {
        expect(link.getAttribute('data-track')).toBe('collector_to_converter_click');
      }
    }
  });

  it('renders derived RelatedGuides cards on migrated converter pages', () => {
    const cases = [
      {
        page: path.join('calming', 'best-calming-products-for-anxious-dogs', 'index.html'),
        expected: ['/travel/dog-road-trip-gear/', '/cooling/best-cooling-products-for-dogs/'],
      },
      {
        page: path.join('comforting', 'best-travel-crates-for-road-trips', 'index.html'),
        expected: [
          '/travel/dog-road-trip-gear/',
          '/calming/crate-training-for-dogs/',
          '/comforting/best-airline-crates-for-flying-with-your-dog/',
        ],
      },
    ];

    for (const testCase of cases) {
      const doc = readBuiltPage(testCase.page);
      const links = Array.from(doc.querySelectorAll<HTMLAnchorElement>('.related-guide-card'));

      expect(links.map((link) => link.getAttribute('href'))).toEqual(testCase.expected);
      for (const link of links) {
        expect(link.getAttribute('data-track')).toBe('collector_to_converter_click');
      }
    }
  });

  it('orders homepage article cards by article publish date', () => {
    const doc = readBuiltPage('index.html');
    const renderedArticleLinks = [
      ...Array.from(doc.querySelectorAll<HTMLAnchorElement>('.featured-grid [data-home-article="true"]')),
      ...Array.from(doc.querySelectorAll<HTMLAnchorElement>('.more-grid [data-home-article="true"]')),
    ].map((link) => link.getAttribute('href'));

    expect(renderedArticleLinks).toEqual(readArticlePublishOrder());
  });

  it('renders the inline signup on the homepage and excludes the footer signup from attractor and converter pages', () => {
    const homeDoc = readBuiltPage('index.html');
    const converterDoc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));

    expect(
      homeDoc.querySelector('[data-email-signup-placement="homepage_inline"]')
    ).not.toBeNull();
    expect(
      homeDoc.querySelector('[data-email-signup-placement="footer"]')
    ).toBeNull();
    expect(
      converterDoc.querySelector('[data-email-signup-placement="footer"]')
    ).toBeNull();
  });

  it('publishes generated per-page OG assets and metadata references', () => {
    const homeDoc = readBuiltPage('index.html');
    const coolingDoc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));
    const travelDoc = readBuiltPage(path.join('travel', 'dog-road-trip-gear', 'index.html'));
    const contactDoc = readBuiltPage(path.join('contact', 'index.html'));
    const termsDoc = readBuiltPage(path.join('terms', 'index.html'));

    expect(homeDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toBe(firstMainImageAbsolute(homeDoc));
    expect(homeDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toBe(homeDoc.querySelector('meta[name="twitter:image"]')?.getAttribute('content'));

    expect(coolingDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toContain('/og/cooling-cooling-mats.jpg');
    expect(travelDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toBe(firstMainImageAbsolute(travelDoc));
    expect(travelDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toBe(travelDoc.querySelector('meta[name="twitter:image"]')?.getAttribute('content'));

    // Explicitly excluded pages keep the static default fallback.
    expect(termsDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toContain('/og-default.jpg');
    // image-less indexable pages keep route-based generated OG assets
    expect(contactDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toContain('/og/contact.jpg');

    const homeOg = readFileSync(path.join(distRoot, 'og', 'home.jpg'));
    const coolingOg = readFileSync(path.join(distRoot, 'og', 'cooling-cooling-mats.jpg'));
    expect(homeOg.length).toBeGreaterThan(1024);
    expect(coolingOg.length).toBeGreaterThan(1024);
  });

  it('renders the content sitemap with share preview metadata', () => {
    const sitemapDoc = readBuiltPage(path.join('content-sitemap', 'index.html'));

    const contactRow = sitemapDoc.querySelector('[data-share-preview-row][data-href="/contact/"]');
    const roadTripRow = sitemapDoc.querySelector('[data-share-preview-row][data-href="/travel/dog-road-trip-gear/"]');
    const subscribeRow = sitemapDoc.querySelector('[data-share-preview-row][data-href="/subscribe/"]');
    const termsRow = sitemapDoc.querySelector('[data-share-preview-row][data-href="/terms/"]');

    expect(contactRow?.querySelector('[data-share-title]')?.textContent)
      .toContain('Contact Chill-Dogs | Questions & Feedback Welcome');
    expect(contactRow?.querySelector('[data-share-description]')?.textContent)
      .toContain('Have a question, feedback, or a partnership inquiry?');
    expect(contactRow?.querySelector('[data-share-image]')?.getAttribute('src'))
      .toContain('/og/contact.jpg');

    expect(roadTripRow?.querySelector('[data-share-title]')?.textContent)
      .toContain('Dog Road Trip Gear | Cooling & Calming Essentials');
    expect(roadTripRow?.querySelector('[data-share-description]')?.textContent)
      .toContain('Dog road trip gear tested on a 6,000-mile cross-country drive');
    expect(roadTripRow?.querySelector('[data-share-image]')?.getAttribute('src'))
      .toContain('/_assets/20250629_131343');

    const rhysRow = sitemapDoc.querySelector('[data-share-preview-row][data-href="/travel/rhys-ran-away-cerro-san-luis-obispo/"]');
    expect(rhysRow?.querySelector('[data-share-title]')?.textContent)
      .toContain('The Day Rhys Ran Off: What We Learned About Dog Tracking');
    expect(rhysRow?.querySelector('[data-share-image]')?.getAttribute('src'))
      .toContain('/_assets/bishop-peak-expert-trail-marker');

    expect(subscribeRow?.querySelector('[data-share-title]')?.textContent)
      .toContain('Subscribe to Chill-Dogs | Dog Tips and Gear Picks');
    expect(subscribeRow?.querySelector('[data-share-image]')?.getAttribute('src'))
      .toContain('/og/subscribe.jpg');

    expect(termsRow?.querySelector('[data-share-title]')?.textContent)
      .toContain('Terms of Use | Chill-Dogs');
    expect(termsRow?.querySelector('[data-share-image]')?.getAttribute('src'))
      .toContain('/og-default.jpg');
  });

  it('publishes homepage featured article images', () => {
    const homeDoc = readBuiltPage('index.html');
    const featuredImages = Array.from(
      homeDoc.querySelectorAll<HTMLImageElement>('.article-card img')
    );

    expect(featuredImages.length).toBeGreaterThan(0);

    for (const image of featuredImages) {
      const src = image.getAttribute('src');
      expect(src).toBeTruthy();
      expect(src === null ? '' : /^(\/og\/|\/_assets\/)/.test(src)).toBe(true);
      const asset = readFileSync(path.join(distRoot, src!.replace(/^\//, '')));
      expect(asset.length).toBeGreaterThan(1024);
    }
  });

  it('injects BreadcrumbList schema on indexable pages only', () => {
    const coolingDoc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));
    const termsDoc = readBuiltPage(path.join('terms', 'index.html'));

    const coolingSchemas = Array.from(
      coolingDoc.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
    ).map((script) => script.textContent || '');

    expect(coolingSchemas.some((schema) => schema.includes('"@type":"BreadcrumbList"'))).toBe(true);

    const termsSchemas = Array.from(
      termsDoc.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
    ).map((script) => script.textContent || '');

    expect(termsSchemas.some((schema) => schema.includes('"@type":"BreadcrumbList"'))).toBe(false);
  });

  it('renders cooling converter pages with tracked merchant affiliate links', () => {
    const doc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));
    const affiliateLinks = getAffiliateLinks(doc);

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expectTrackedAffiliateLink(link);
    }
  });

  it('renders calming converter pages with tracked merchant affiliate links', () => {
    const doc = readBuiltPage(path.join('calming', 'best-calming-products-for-anxious-dogs', 'index.html'));
    const affiliateLinks = getAffiliateLinks(doc);

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expectTrackedAffiliateLink(link);
    }
  });

  it('renders travel converter with affiliate links', () => {
    const doc = readBuiltPage(path.join('travel', 'dog-road-trip-gear', 'index.html'));
    const affiliateLinks = getAffiliateLinks(doc);

    expect(affiliateLinks.length).toBeGreaterThan(0);
    for (const link of affiliateLinks) {
      expectTrackedAffiliateLink(link);
    }
  });

  it('marks the custom 404 page as noindex', () => {
    const doc = readBuiltPage('404.html');
    const robots = doc.querySelector('meta[name="robots"]');

    expect(robots?.getAttribute('content')).toBe('noindex, nofollow');
  });

  it('keeps policy pages out of the index and renders affiliate disclosure copy', () => {
    const privacyDoc = readBuiltPage(path.join('privacy-policy', 'index.html'));
    const affiliateDoc = readBuiltPage(path.join('affiliate-disclosure', 'index.html'));

    expect(
      privacyDoc.querySelector('meta[name="robots"]')?.getAttribute('content')
    ).toBe('noindex, nofollow');
    expect(privacyDoc.body.textContent).toContain('Buttondown');
    expect(affiliateDoc.body.textContent).toContain('Amazon Services LLC Associates Program');
    expect(affiliateDoc.body.textContent).toContain('no additional cost to you');
  });

  it('renders search as a noindex collector with internal product result routes', () => {
    const searchDoc = readBuiltPage(path.join('search', 'index.html'));
    const searchIndex = JSON.parse(readBuiltAsset('search-index.json'));
    const productItems = searchIndex.filter((item: { type: string }) => item.type === 'product');

    expect(searchDoc.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('noindex, nofollow');
    expect(searchDoc.querySelectorAll('.search-results a[href*="amazon."]').length).toBe(0);
    expect(productItems.length).toBeGreaterThan(0);

    for (const item of productItems) {
      expect(item.href).toMatch(/^\/shop\/\?q=/);
      expect(item.href).not.toContain('amazon.');
      expect(item).not.toHaveProperty('amazonUrl');
    }
  });

  it('renders subscribe flow pages without site chrome and keeps them noindex', () => {
    const subscribeDoc = readBuiltPage(path.join('subscribe', 'index.html'));
    const thanksDoc = readBuiltPage(path.join('subscribe', 'thanks', 'index.html'));
    const confirmedDoc = readBuiltPage(path.join('subscribe', 'confirmed', 'index.html'));

    expect(subscribeDoc.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('noindex, nofollow');
    expect(thanksDoc.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('noindex, nofollow');
    expect(confirmedDoc.querySelector('meta[name="robots"]')?.getAttribute('content'))
      .toBe('noindex, nofollow');
    expect(subscribeDoc.querySelector('meta[property="og:image"]')?.getAttribute('content'))
      .toContain('/og/subscribe.jpg');
    expect(thanksDoc.querySelector('header.site-header')).toBeNull();
    expect(thanksDoc.querySelector('footer.site-footer')).toBeNull();
    expect(confirmedDoc.querySelector('header.site-header')).toBeNull();
    expect(confirmedDoc.querySelector('footer.site-footer')).toBeNull();
    expect(thanksDoc.querySelector('.subscribe-flow-header a[href="/"]')?.textContent)
      .toContain('Chill-Dogs');
    expect(confirmedDoc.querySelector('.subscribe-flow-header a[href="/"]')?.textContent)
      .toContain('Chill-Dogs');
    expect(confirmedDoc.body.textContent).toContain('Cooling Picks');
    expect(confirmedDoc.body.textContent).toContain('Hot Weather Guide');
  });

  it('publishes the postcard QR alias as a tracked subscribe redirect', () => {
    const expectedDestination = 'https://www.chill-dogs.com/subscribe/?utm_source=postcard&utm_medium=print&utm_campaign=offline_flyer';
    const joinDoc = readBuiltPage(path.join('join', 'index.html'));
    const refresh = joinDoc.querySelector('meta[http-equiv="refresh"]');
    const vercelConfig = JSON.parse(readFileSync(path.join(projectRoot, 'vercel.json'), 'utf8'));
    const joinRedirects = vercelConfig.redirects.filter(({ source }: { source: string }) =>
      source === '/join' || source === '/join/'
    );

    expect(refresh?.getAttribute('content')).toContain(expectedDestination);
    expect(joinRedirects).toEqual([
      { source: '/join', destination: expectedDestination, statusCode: 302 },
      { source: '/join/', destination: expectedDestination, statusCode: 302 },
    ]);
  });

  it('renders the fireworks article newsletter CTA in the exit-planning section', () => {
    const doc = readBuiltPage(path.join('calming', 'should-you-take-your-dog-to-fireworks', 'index.html'));
    const ctas = doc.querySelectorAll<HTMLElement>('.newsletter-callout');
    const cta = ctas[0];
    const exitHeading = doc.querySelector<HTMLElement>('#exit-before-dark');
    const whatToBringHeading = doc.querySelector<HTMLElement>('#what-to-bring');
    const link = cta?.querySelector<HTMLAnchorElement>('.newsletter-callout__link');

    expect(ctas).toHaveLength(1);
    expect(exitHeading).toBeTruthy();
    expect(whatToBringHeading).toBeTruthy();
    expect(Boolean(exitHeading!.compareDocumentPosition(cta!) & 4)).toBe(true);
    expect(Boolean(cta!.compareDocumentPosition(whatToBringHeading!) & 4)).toBe(true);
    expect(link?.getAttribute('href')).toBe('/subscribe/?utm_source=article&utm_medium=cta&utm_campaign=fireworks_safety&utm_content=exit_before_dark');
    expect(link?.getAttribute('data-track')).toBe('newsletter_cta_click');
    expect(link?.getAttribute('data-cta-type')).toBe('newsletter');
    expect(link?.getAttribute('data-topic')).toBe('fireworks_safety');
    expect(link?.getAttribute('data-placement')).toBe('exit_before_dark');
    expect(link?.getAttribute('data-source-page')).toBe('should-you-take-your-dog-to-fireworks');
  });

  it('renders the admin product catalog from all product data files', () => {
    const doc = readBuiltPage(path.join('admin', 'products', 'index.html'));

    expect(doc.body.textContent).toContain('Fi Series 3+ GPS Collar');
    expect(doc.body.textContent).toContain('Stunt Puppy Fi-Ready Collar');
    expect(doc.body.textContent).toContain('The Green Pet Shop Cooling Pet Pad');
    expect(doc.body.textContent).toContain('ThunderShirt Classic Dog Anxiety Jacket');
    expect(doc.body.textContent).toContain('SportPet Airline Compliant Travel Kennel');
    expect(doc.body.textContent).toContain('Amazon Basics Furniture Style Dog Crate');
    expect(doc.body.textContent).toContain('Oranland Heavy Duty Indestructible Dog Crate');
    expect(doc.body.textContent).toContain('src/data/tracking-products.ts');
  });

  it('renders new crate converter pages with affiliate links', () => {
    const airlineDoc = readBuiltPage(path.join('comforting', 'best-airline-crates-for-flying-with-your-dog', 'index.html'));
    const furnitureDoc = readBuiltPage(path.join('comforting', 'best-furniture-dog-crates', 'index.html'));
    const heavyDutyDoc = readBuiltPage(path.join('comforting', 'best-heavy-duty-dog-crates', 'index.html'));

    for (const doc of [airlineDoc, furnitureDoc, heavyDutyDoc]) {
      const affiliateLinks = getAffiliateLinks(doc);
      expect(affiliateLinks.length).toBeGreaterThan(0);
      for (const link of affiliateLinks) {
        expectTrackedAffiliateLink(link);
      }
    }
  });

  it('collector section pages are indexable with correct canonical', () => {
    const coolingDoc = readBuiltPage(path.join('cooling', 'index.html'));
    const calmingDoc = readBuiltPage(path.join('calming', 'index.html'));

    expect(coolingDoc.querySelector('meta[name="robots"]')).toBeNull();
    expect(calmingDoc.querySelector('meta[name="robots"]')).toBeNull();

    expect(coolingDoc.querySelector('link[rel="canonical"]')?.getAttribute('href'))
      .toBe('https://www.chill-dogs.com/cooling/');
    expect(calmingDoc.querySelector('link[rel="canonical"]')?.getAttribute('href'))
      .toBe('https://www.chill-dogs.com/calming/');
  });

  it('publishes robots and sitemap with key routes and no variants', () => {
    const robotsTxt = readBuiltAsset('robots.txt');
    const sitemapIndex = readBuiltAsset('sitemap-index.xml');
    const sitemap = readBuiltAsset('sitemap-0.xml');

    expect(robotsTxt).toContain('Sitemap: https://www.chill-dogs.com/sitemap-index.xml');
    expect(sitemapIndex).toContain('/sitemap-0.xml');
    expect(sitemap).toContain('<loc>https://www.chill-dogs.com/</loc>');
    expect(sitemap).toContain('/cooling/best-cooling-products-for-dogs/');
    expect(sitemap).toContain('/cooling/car-cooling-for-dogs/');
    expect(sitemap).toContain('/travel/dog-road-trip-gear/');
    expect(sitemap).toContain('/calming/best-calming-products-for-anxious-dogs/');
    expect(sitemap).toContain('/calming/best-lick-mats-for-dogs/');
    expect(sitemap).toContain('/calming/how-to-prepare-a-calm-room-for-fireworks-night/');
    expect(sitemap).toContain('/comforting/best-puppy-crates/');
    expect(sitemap).toContain('/comforting/best-anxiety-dog-crates/');
    expect(sitemap).toContain('/comforting/best-travel-crates-for-road-trips/');
    expect(sitemap).toContain('/comforting/best-airline-crates-for-flying-with-your-dog/');
    expect(sitemap).toContain('/comforting/best-furniture-dog-crates/');
    expect(sitemap).toContain('/comforting/best-heavy-duty-dog-crates/');
    expect(sitemap).not.toContain('/cooling/v/');
    expect(sitemap).not.toContain('/calming/v/');
    expect(sitemap).not.toContain('/content-sitemap/');
    expect(sitemap).not.toContain('/privacy-policy/');
    expect(sitemap).not.toContain('/terms/');
    expect(sitemap).not.toContain('/subscribe/thanks/');
    expect(sitemap).not.toContain('/subscribe/confirmed/');
  });

  it('publishes article collection entries in rss feed', () => {
    const rssXml = readBuiltAsset('rss.xml');

    expect(rssXml).toContain('/calming/crate-training-for-dogs/');
    expect(rssXml).toContain('How to Crate Train Your Dog');
    expect(rssXml).toContain('/calming/how-to-prepare-a-calm-room-for-fireworks-night/');
    expect(rssXml).toContain('How to Prepare a Calm Room for Fireworks Night');
  });

  it('does not render escaped HTML tags as visible text on any page', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      // Look for escaped HTML tags in the rendered output (outside of <script>/<style> blocks)
      const stripped = html
        .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
        .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

      // Match &lt;a, &lt;span, &lt;div etc — escaped tags that should have been rendered
      const escapedTagPattern = /&lt;(?:a|span|div|p|strong|em|br|img|ul|ol|li)\b/i;
      if (escapedTagPattern.test(stripped)) {
        const relative = path.relative(distRoot, filePath);
        failures.push(relative);
      }
    }

    expect(failures, `Pages with escaped HTML tags visible as text: ${failures.join(', ')}`).toEqual([]);
  });

  it('every page has exactly one h1 tag', () => {
    const ignored = ['404.html'];
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const relative = path.relative(distRoot, filePath);
      if (ignored.some((i) => relative.includes(i))) continue;

      const html = readFileSync(filePath, 'utf8');
      if (isRedirectStub(html)) continue;
      const h1Count = (html.match(/<h1[\s>]/gi) || []).length;
      if (h1Count !== 1) {
        failures.push(`${relative} (${h1Count} h1 tags)`);
      }
    }

    expect(failures, `Pages without exactly 1 h1: ${failures.join(', ')}`).toEqual([]);
  });

  it('every page has exactly one canonical tag', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      const canonicalCount = (html.match(/<link[^>]+rel=['"]canonical['"][^>]*>/gi) || []).length;
      if (canonicalCount !== 1) {
        const relative = path.relative(distRoot, filePath);
        failures.push(`${relative} (${canonicalCount} canonical tags)`);
      }
    }

    expect(failures, `Pages without exactly 1 canonical: ${failures.join(', ')}`).toEqual([]);
  });

  it('every page has a meta description', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      if (isRedirectStub(html)) continue;
      const descMatch = html.match(/<meta[^>]*name=['"]description['"][^>]*content=['"]([^'"]*)['"]/i);
      if (!descMatch || !descMatch[1].trim()) {
        const relative = path.relative(distRoot, filePath);
        failures.push(relative);
      }
    }

    expect(failures, `Pages missing meta description: ${failures.join(', ')}`).toEqual([]);
  });

  it('every page has an og:image', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      if (isRedirectStub(html)) continue;
      const ogMatch = html.match(/<meta[^>]*property=['"]og:image['"][^>]*content=['"]([^'"]*)['"]/i);
      if (!ogMatch || !/^https:\/\/www\.chill-dogs\.com\//.test(ogMatch[1])) {
        const relative = path.relative(distRoot, filePath);
        failures.push(relative);
      }
    }

    expect(failures, `Pages missing og:image: ${failures.join(', ')}`).toEqual([]);
  });

  it('content pages have at least one JSON-LD script', () => {
    const noSchemaExpected = ['404.html', 'privacy-policy', 'terms', 'content-sitemap', 'admin/', 'subscribe/', 'search/'];
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const relative = path.relative(distRoot, filePath);
      if (noSchemaExpected.some((i) => relative.includes(i))) continue;

      const html = readFileSync(filePath, 'utf8');
      if (isRedirectStub(html)) continue;
      const ldJsonCount = (html.match(/<script[^>]*type="application\/ld\+json"/gi) || []).length;
      if (ldJsonCount === 0) {
        failures.push(relative);
      }
    }

    expect(failures, `Content pages missing JSON-LD: ${failures.join(', ')}`).toEqual([]);
  });

  it('all internal links resolve to built pages', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      const relative = path.relative(distRoot, filePath);
      const hrefMatches = html.matchAll(/href="(\/[^"#?]*)"/g);

      for (const match of hrefMatches) {
        const href = match[1];
        const skipAsset = /\.(ico|png|jpg|jpeg|webp|svg|pdf|xml|txt|webmanifest|css|js)$/i.test(href);
        if (skipAsset) continue;
        // Check if the path resolves to a file or directory with index.html
        const asFile = path.join(distRoot, href);
        const asIndex = path.join(distRoot, href, 'index.html');
        const asHtml = href.endsWith('/') ? null : path.join(distRoot, href + '.html');

        const exists =
          existsSync(asFile) ||
          existsSync(asIndex) ||
          (asHtml !== null && existsSync(asHtml));

        if (!exists) {
          const entry = `${relative}: broken link → ${href}`;
          if (!failures.includes(entry)) failures.push(entry);
        }
      }
    }

    expect(failures, `Broken internal links:\n${failures.join('\n')}`).toEqual([]);
  });

  it('no render-blocking external stylesheets in head', () => {
    const htmlFiles = collectHtmlFiles(distRoot);
    const failures: string[] = [];

    for (const filePath of htmlFiles) {
      const html = readFileSync(filePath, 'utf8');
      const headMatch = html.match(/<head[\s>][\s\S]*?<\/head>/i);
      if (!headMatch) continue;

      const blockingLinks = (headMatch[0].match(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi) || []);
      if (blockingLinks.length > 0) {
        const relative = path.relative(distRoot, filePath);
        failures.push(`${relative} (${blockingLinks.length} blocking stylesheet(s))`);
      }
    }

    expect(failures, `Pages with render-blocking CSS:\n${failures.join('\n')}`).toEqual([]);
  });

  it('publishes llms.txt with all sections, key links, and no excluded paths', () => {
    const llmsText = readBuiltAsset('llms.txt');

    expect(llmsText).toContain('# Chill-Dogs');
    expect(llmsText).toContain('## Cooling Guides');
    expect(llmsText).toContain('## Calming Guides');
    expect(llmsText).toContain('## Travel Guides');
    expect(llmsText).toContain('https://www.chill-dogs.com/cooling/');
    expect(llmsText).toContain('https://www.chill-dogs.com/cooling/best-cooling-products-for-dogs/');
    expect(llmsText).toContain('https://www.chill-dogs.com/travel/dog-road-trip-gear/');
    expect(llmsText).not.toContain('/v/a/');
    expect(llmsText).not.toContain('/content-sitemap/');
    expect(llmsText).not.toContain('/privacy-policy/');
  });
});
