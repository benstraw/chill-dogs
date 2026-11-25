// @vitest-environment happy-dom
/**
 * Page-specific checks on the built site. Site-wide rules (one h1, canonical, og
 * lengths, links, affiliate instrumentation, ...) live in site-sweep.test.ts, which
 * reads every page once. Only add a test here when it is about particular pages.
 */
import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

import { productCatalogItems } from '../../data/product-catalog';
import { getCompleteSitemapPages } from '../../data/sitemap-inventory';
import { isHomepageArticle } from '../../utils/homepage-articles';
import { SITE_ORIGIN, decodeEntities, distRoot, projectRoot } from '../helpers/dist';

function readBuiltPage(relativePath: string): Document {
  const html = readFileSync(path.join(distRoot, relativePath), 'utf8')
    .replace(/<link\b[^>]*rel="stylesheet"[^>]*>/g, '')
    .replace(/<script\b[^>]*src="[^"]*"[^>]*><\/script>/g, '');
  return new DOMParser().parseFromString(html, 'text/html');
}

function readBuiltAsset(relativePath: string): string {
  return readFileSync(path.join(distRoot, relativePath), 'utf8');
}

/**
 * Expected article order, derived from the same data the site is built from (the
 * astro:content mock loads the real MDX frontmatter; static review pages come from
 * the inventory), then sorted here independently: newest first, ties by href.
 * It used to combine readdirSync order with a hard-coded list of static pages.
 */
async function readArticlePublishOrder(): Promise<string[]> {
  return (await getCompleteSitemapPages())
    .filter(isHomepageArticle)
    .map((page) => ({ href: page.href, date: page.pubDate!.valueOf() }))
    .sort((a, b) => b.date - a.date || (a.href < b.href ? -1 : a.href > b.href ? 1 : 0))
    .map((page) => page.href);
}

function firstMainImageAbsolute(doc: Document): string | null {
  const image = doc.querySelector<HTMLImageElement>('main img');
  const src = image?.getAttribute('src');
  if (!src) return null;
  if (src.startsWith('data:')) return null;
  if (src.startsWith('//')) return `https:${src}`;
  return new URL(src, SITE_ORIGIN).href;
}

function getAffiliateLinks(root: ParentNode): HTMLAnchorElement[] {
  return Array.from(
    root.querySelectorAll<HTMLAnchorElement>('a[data-affiliate="true"][data-track="affiliate_outbound_click"]')
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

describe('site smoke tests', () => {

  it('renders the homepage with both primary navigation CTAs', () => {
    const doc = readBuiltPage('index.html');

    const coolingCta = doc.querySelector<HTMLAnchorElement>('a[data-track="hero_click_cooling"]');
    const calmingCta = doc.querySelector<HTMLAnchorElement>('a[data-track="hero_click_calming"]');
    const loveNote = doc.querySelector<HTMLElement>('.hp-v6-love-note');
    const loveHeart = doc.querySelector<SVGElement>('.hp-v6-love-heart');
    const heroSlogan = doc.querySelector<HTMLElement>('.hp-v6-slogan');
    const canonical = doc.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    const paneArrows = doc.querySelectorAll('.hp-v6-pane .hp-v6-pane-arrow');
    const heroFeatured = doc.querySelector<HTMLAnchorElement>(
      'a[data-link-position="homepage-hero-featured"]'
    );

    const gearCta = doc.querySelector<HTMLAnchorElement>('a[data-track="hero_click_gear"]');
    const viewAll = doc.querySelector<HTMLAnchorElement>('a[data-cta="articles"]');

    expect(coolingCta?.getAttribute('href')).toBe('/cooling/');
    expect(calmingCta?.getAttribute('href')).toBe('/calming/');
    expect(gearCta?.getAttribute('href')).toBe('/gear/');
    expect(paneArrows.length).toBe(4);
    expect(heroFeatured?.getAttribute('data-track')).toBe('collector_to_converter_click');
    expect(heroFeatured?.getAttribute('data-to-page')).toBe(heroFeatured?.getAttribute('href'));
    expect(heroFeatured?.hasAttribute('data-cta')).toBe(false);
    expect(viewAll?.getAttribute('href')).toBe('/articles/');
    expect(viewAll?.getAttribute('data-track')).toBe('hero_click_articles');
    expect(loveNote?.getAttribute('aria-label')).toBe('For the love of dogs');
    expect(loveNote?.textContent?.trim()).toBe('For the love of dogs');
    expect(loveHeart?.getAttribute('aria-hidden')).toBe('true');
    expect(heroSlogan?.textContent?.replace(/\s+/g, ' ').trim()).toBe(
      'Temperature or Temperament — We Have You Covered'
    );
    expect(canonical?.getAttribute('href')).toBe(`${SITE_ORIGIN}/`);
  });

  it('links the homepage theme sections into converter and guide paths', () => {
    const doc = readBuiltPage('index.html');

    const sectionHeaders = Array.from(
      doc.querySelectorAll<HTMLAnchorElement>('a[data-link-position$="-section-header"]')
    );
    const headerTargets = Object.fromEntries(
      sectionHeaders.map((link) => [link.getAttribute('data-link-position'), link.getAttribute('href')])
    );
    const linkPositions = new Set(
      Array.from(doc.querySelectorAll<HTMLAnchorElement>('a[data-link-position]')).map((link) =>
        link.getAttribute('data-link-position')
      )
    );
    const lickMatLinks = Array.from(
      doc.querySelectorAll<HTMLAnchorElement>('a[href="/calming/best-lick-mats-for-dogs/"]')
    );

    expect(headerTargets).toEqual({
      'homepage-cool-section-header': '/cooling/',
      'homepage-calm-section-header': '/calming/',
      'homepage-comfort-section-header': '/comforting/',
      'homepage-gear-section-header': '/gear/',
    });
    for (const theme of ['cool', 'calm', 'comfort', 'gear']) {
      expect(linkPositions).toContain(`homepage-${theme}-articles`);
      expect(linkPositions).toContain(`homepage-${theme}-converters`);
    }
    expect(doc.querySelector('.more-card .more-arrow')).not.toBeNull();
    expect(lickMatLinks.map((link) => link.getAttribute('data-link-position'))).toEqual([
      'homepage-calm-converters',
    ]);
  });

  it('fires the keystone affiliate event from homepage product picks', () => {
    const doc = readBuiltPage('index.html');

    const amazonPicks = Array.from(
      doc.querySelectorAll<HTMLAnchorElement>(
        'a[data-affiliate="true"][data-track-also="amazon_outbound_click"][data-page-type="attractor"]'
      )
    );

    expect(amazonPicks.length).toBeGreaterThanOrEqual(4);
    for (const pick of amazonPicks) {
      expect(pick.getAttribute('rel')).toContain('sponsored');
      expect(pick.getAttribute('data-track')).toBe('affiliate_outbound_click');
      expect(pick.getAttribute('data-page-type')).toBe('attractor');
      expect(pick.getAttribute('data-page-slug')).toBe('/');
    }
  });

  it('renders the articles index in reverse publish order with pillar labels', async () => {
    const doc = readBuiltPage(path.join('articles', 'index.html'));
    const publishOrder = await readArticlePublishOrder();

    const featured = doc.querySelector<HTMLAnchorElement>(
      'a[data-link-position="articles-index-featured"]'
    );
    const gridLinks = Array.from(
      doc.querySelectorAll<HTMLAnchorElement>('a[data-link-position="articles-index"]')
    ).map((link) => link.getAttribute('href'));

    expect(featured?.getAttribute('href')).toBe(publishOrder[0]);
    expect(gridLinks).toEqual(publishOrder.slice(1));
    expect(doc.querySelectorAll('h1')).toHaveLength(1);
    expect(doc.querySelector('.article-label')).not.toBeNull();
  });

  it('renders the gear collector with tracking, safety, and travel inventories', () => {
    const gearDoc = readBuiltPage(path.join('gear', 'index.html'));
    const links = Array.from(gearDoc.querySelectorAll<HTMLAnchorElement>('a')).map((link) =>
      link.getAttribute('href')
    );
    const headings = Array.from(
      gearDoc.querySelectorAll<HTMLHeadingElement>('.section-heading')
    ).map((heading) => heading.textContent);

    expect(links).toEqual(
      expect.arrayContaining([
        '/gear/best-dog-gps-trackers/',
        '/gear/fi-dog-collar-review/',
        '/safety/what-to-do-if-your-dog-runs-away/',
        '/travel/dog-road-trip-gear/',
      ])
    );
    expect(headings).toEqual(
      expect.arrayContaining(['GPS Trackers & Escape Safety', 'Trail & Emergency Prep'])
    );
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

  it('renders tracked themed section heroes without retired variant markup or routes', () => {
    const cases = [
      { page: path.join('cooling', 'index.html'), theme: 'cooling' },
      { page: path.join('calming', 'index.html'), theme: 'calming' },
      { page: path.join('comforting', 'index.html'), theme: 'comfort' },
      { page: path.join('gear', 'index.html'), theme: 'gear' },
    ];

    for (const { page, theme } of cases) {
      const doc = readBuiltPage(page);
      const hero = doc.querySelector<HTMLElement>('section[aria-label="Page hero"]');
      const ctas = Array.from(
        hero?.querySelectorAll<HTMLAnchorElement>('a[data-track="hero_cta_click"]') ?? []
      );

      expect(hero).not.toBeNull();
      expect(hero?.classList.contains('hx')).toBe(true);
      expect(hero?.classList.contains(`hx--${theme}`)).toBe(true);
      expect(hero?.classList.contains('hx--c')).toBe(false);
      expect(hero?.getAttribute('data-hero-variant')).toBeNull();
      expect(ctas.map((cta) => cta.getAttribute('data-cta'))).toEqual(['primary', 'secondary']);
      expect(ctas.every((cta) => cta.getAttribute('data-page') === theme)).toBe(true);
    }

    expect(existsSync(path.join(distRoot, 'cooling', 'v'))).toBe(false);
    expect(existsSync(path.join(distRoot, 'calming', 'v'))).toBe(false);
  });

  it('marks the active pillar top-nav item with the pillar theme', () => {
    const comfortDoc = readBuiltPage(path.join('comforting', 'best-anxiety-dog-crates', 'index.html'));
    const activeNav = comfortDoc.querySelector<HTMLAnchorElement>('.main-nav a[aria-current="page"]');

    expect(comfortDoc.documentElement.getAttribute('data-pillar-theme')).toBe('comfort');
    expect(comfortDoc.documentElement.getAttribute('style')).toContain('--color-nav-accent: hsl(345, 38%, 38%)');
    expect(activeNav?.getAttribute('href')).toBe('/comforting/');

    const gearDoc = readBuiltPage(path.join('gear', 'fi-dog-collar-review', 'index.html'));
    const gearActiveNav = gearDoc.querySelector<HTMLAnchorElement>('.main-nav a[aria-current="page"]');

    expect(gearDoc.documentElement.getAttribute('data-pillar-theme')).toBe('gear');
    expect(gearDoc.documentElement.getAttribute('style')).toContain('--color-nav-accent: hsl(262, 45%, 38%)');
    expect(gearActiveNav?.getAttribute('href')).toBe('/gear/');
  });

  it('links fireworks checklist sections to supporting article guides', () => {
    const doc = readBuiltPage(path.join('calming', 'dog-fireworks-anxiety-checklist', 'index.html'));
    const calmRoomLink = doc.querySelector<HTMLAnchorElement>(
      'a[href="/calming/how-to-prepare-a-calm-room-for-fireworks-night/"][data-link-position="morning-of-july-4"]'
    );
    const eventDecisionLink = doc.querySelector<HTMLAnchorElement>(
      'a[href="/calming/should-you-take-your-dog-to-fireworks/"][data-link-position="during-fireworks"]'
    );

    expect(calmRoomLink?.textContent).toBe('fireworks calm room guide');
    expect(calmRoomLink?.getAttribute('data-from-page')).toBe('dog-fireworks-anxiety-checklist');
    expect(eventDecisionLink?.textContent).toBe('fireworks event decision guide');
    expect(eventDecisionLink?.getAttribute('data-from-page')).toBe('dog-fireworks-anxiety-checklist');
  });

  it('orders homepage article cards by article publish date', async () => {
    const doc = readBuiltPage('index.html');
    const publishOrder = await readArticlePublishOrder();
    const themeFor = (href: string) =>
      href.startsWith('/cooling/')
        ? 'cool'
        : href.startsWith('/calming/')
          ? 'calm'
          : href.startsWith('/comforting/')
            ? 'comfort'
            : 'gear';

    const heroFeatured = doc
      .querySelector<HTMLAnchorElement>('a[data-link-position="homepage-hero-featured"]')
      ?.getAttribute('href');
    expect(heroFeatured).toBe(publishOrder[0]);

    for (const theme of ['cool', 'calm', 'comfort', 'gear']) {
      const rendered = Array.from(
        doc.querySelectorAll<HTMLAnchorElement>(`a[data-link-position="homepage-${theme}-articles"]`)
      ).map((link) => link.getAttribute('href'));
      const expected = publishOrder
        .filter((href) => href !== heroFeatured && themeFor(href) === theme)
        .slice(0, 3);

      expect(rendered).toEqual(expected);
    }
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

  it('renders the admin sitemap with share preview metadata', () => {
    const sitemapDoc = readBuiltPage(path.join('admin', 'sitemap', 'index.html'));

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

  it('publishes homepage theme sections with product pick images', () => {
    const homeDoc = readBuiltPage('index.html');
    const sections = homeDoc.querySelectorAll('.home-section');
    const pickImages = Array.from(
      homeDoc.querySelectorAll<HTMLImageElement>('.home-section .product-image-frame img')
    );

    expect(sections).toHaveLength(4);
    expect(pickImages.length).toBeGreaterThanOrEqual(4);

    for (const image of pickImages) {
      expect(image.getAttribute('src')).toBeTruthy();
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

  it('renders a variant picker without adding affiliate CTAs to the card', () => {
    const doc = readBuiltPage(path.join('safety', 'dog-bath-tools', 'index.html'));
    const card = doc.querySelector<HTMLElement>('#tuff-pupper-drying-bathrobe');
    const picker = card?.querySelector<HTMLElement>('[data-variant-picker]');

    expect(picker).not.toBeNull();
    expect(picker?.getAttribute('data-variant-selected')).toBe('large');

    const chips = Array.from(picker!.querySelectorAll<HTMLAnchorElement>('[data-variant-option]'));
    expect(chips).toHaveLength(8);

    for (const chip of chips) {
      // Chips reach every ASIN without JS, but must not fire the keystone
      // event — otherwise a card with a picker would out-count one without.
      expect(chip.href).toContain('tag=chill-dogs-20');
      expect(relTokens(chip)).toEqual(['noopener', 'noreferrer', 'sponsored']);
      expect(chip.getAttribute('data-affiliate')).toBeNull();
      expect(chip.getAttribute('data-track')).toBeNull();
    }

    // Every size ASIN is linked in the static HTML.
    const chipAsins = chips.map((chip) => chip.href.match(/\/dp\/([A-Z0-9]{10})/)?.[1]);
    expect(new Set(chipAsins).size).toBe(8);

    // The card still carries exactly one tracked CTA, on the default variant.
    const cardCtas = getAffiliateLinks(card!);
    expect(cardCtas).toHaveLength(1);
    expect(cardCtas[0].getAttribute('data-asin')).toBe('B0BY9GBMXX');
    expectTrackedAffiliateLink(cardCtas[0]);

    // The serialized offer table the picker script reads on selection.
    const table = JSON.parse(picker!.getAttribute('data-variant-offers') || '{}');
    expect(Object.keys(table)).toHaveLength(8);
    expect(table['xx-large'].merchants.amazon.asin).toBe('B0BY9C72VY');
  });

  it('keeps affiliate CTA positions contiguous on a page carrying a variant picker', () => {
    const doc = readBuiltPage(path.join('safety', 'dog-bath-tools', 'index.html'));
    const positions = getAffiliateLinks(doc)
      .map((link) => link.getAttribute('data-position'))
      .filter((position): position is string => position !== null)
      .map(Number);

    expect(positions.length).toBeGreaterThan(0);
    expect([...new Set(positions)].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 27 }, (_, i) => i + 1),
    );
  });

  it('hides the overflow of a deep product section behind the disclosure bar', () => {
    const doc = readBuiltPage(
      path.join('safety', 'best-flea-and-tick-products-for-dogs', 'index.html'),
    );
    const section = doc.querySelector<HTMLElement>('#grooming-tools');
    const disclosure = section?.querySelector<HTMLDetailsElement>('details.disclosure-bar');

    expect(section).not.toBeNull();
    expect(disclosure).not.toBeNull();

    // Six cards render open; the rest sit inside the collapsed disclosure.
    const allCards = section!.querySelectorAll('.product-card');
    const hiddenCards = disclosure!.querySelectorAll('.product-card');

    expect(allCards).toHaveLength(13);
    expect(hiddenCards).toHaveLength(7);
    expect(allCards.length - hiddenCards.length).toBe(6);

    // The label states the count and swaps on open, so only one is ever read out.
    expect(disclosure!.querySelector('.disclosure-bar__label--collapsed')?.textContent).toBe(
      'Show 7 more recommendations',
    );
    expect(disclosure!.querySelector('.disclosure-bar__label--expanded')?.textContent).toBe(
      'Show fewer recommendations',
    );

    // Native <details> keeps the overflow in the DOM: hidden products stay
    // crawlable and their CTAs stay tracked, so the expander costs no coverage.
    const hiddenCtas = getAffiliateLinks(disclosure!);
    expect(hiddenCtas.length).toBeGreaterThanOrEqual(7);
    for (const link of hiddenCtas) {
      expectTrackedAffiliateLink(link);
    }
  });

  it('keeps affiliate CTA positions contiguous across a disclosure bar', () => {
    const doc = readBuiltPage(
      path.join('safety', 'best-flea-and-tick-products-for-dogs', 'index.html'),
    );
    const positions = getAffiliateLinks(doc)
      .map((link) => link.getAttribute('data-position'))
      .filter((position): position is string => position !== null)
      .map(Number);

    expect([...new Set(positions)].sort((a, b) => a - b)).toEqual(
      Array.from({ length: 44 }, (_, i) => i + 1),
    );
  });

  it('marks only the natural products on the merged flea and tick page', () => {
    const doc = readBuiltPage(
      path.join('safety', 'best-flea-and-tick-products-for-dogs', 'index.html'),
    );

    const marked = [...doc.querySelectorAll('.product-card--accent-natural')]
      .map((card) => card.getAttribute('id'))
      .filter((id): id is string => id !== null);

    // Every natural-* category product on the page, and nothing else.
    expect(marked).toHaveLength(27);
    expect(marked).toEqual(
      expect.arrayContaining([
        'ortho-pawz-natural-flea-tick-spray',
        'duty-mitt-flea-tick-mitt',
        'tevrapet-naturals-flea-tick-shampoo',
        'amdeiur-natural-flea-collar',
        'trihood-flea-tick-tag',
        'lkdhfjc-flea-tick-chews-200',
      ]),
    );

    // Conventional pesticide products must never carry the plant-based mark.
    for (const id of [
      'vectra-3d-xl-95-plus',
      'trioak-topical-medium-23-44',
      'udyoude-flea-collar-large-2pack',
      'cabins-flea-collar-4pack',
      'green-pet-double-sided-flea-comb',
    ]) {
      expect(marked, `${id} must not be marked natural`).not.toContain(id);
    }

    // The mark cannot be color-only: each marked card carries a spoken label.
    expect(doc.body.innerHTML.match(/Natural product: /g) ?? []).toHaveLength(27);

    // The legend that explains the mark, and the anchor inbound links land on.
    const legend = doc.querySelector('#natural-options');
    expect(legend, 'missing #natural-options legend block').toBeTruthy();
    expect(legend?.querySelector('h2')?.textContent).toMatch(/Natural/);
  });

  it('leaves a product section open when too few products would be hidden', () => {
    const doc = readBuiltPage(
      path.join('safety', 'dog-bath-tools', 'index.html'),
    );

    // 9 products, 3 hidden — over the threshold, so the bar renders.
    expect(
      doc.querySelector('#bath-brushes details.disclosure-bar'),
    ).not.toBeNull();

    // 7 products would hide only 1, and 6 would hide none. Both stay open.
    expect(doc.querySelector('#drying details.disclosure-bar')).toBeNull();
    expect(doc.querySelector('#bath-kits details.disclosure-bar')).toBeNull();
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
    const expectedDestination = `${SITE_ORIGIN}/subscribe/?utm_source=postcard&utm_medium=print&utm_campaign=offline_flyer`;
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
    // Raw HTML, not a DOM: this page is over 1 MB and parsing it took most of this file's
    // run time. Every catalog product must be listed, not a hand-picked eight.
    const html = decodeEntities(readBuiltAsset(path.join('admin', 'products', 'index.html')));
    const missing = productCatalogItems.filter((product) => !html.includes(product.name)).map((product) => product.id);

    expect(productCatalogItems.length).toBeGreaterThan(100);
    expect(missing).toEqual([]);
    expect(html).toContain('src/data/tracking-products.ts');
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
      .toBe(`${SITE_ORIGIN}/cooling/`);
    expect(calmingDoc.querySelector('link[rel="canonical"]')?.getAttribute('href'))
      .toBe(`${SITE_ORIGIN}/calming/`);
  });

  it('publishes robots and sitemap with key routes and no variants', () => {
    const robotsTxt = readBuiltAsset('robots.txt');
    const sitemapIndex = readBuiltAsset('sitemap-index.xml');
    const sitemap = readBuiltAsset('sitemap-0.xml');

    expect(robotsTxt).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap-index.xml`);
    expect(sitemapIndex).toContain('/sitemap-0.xml');
    expect(sitemap).toContain(`<loc>${SITE_ORIGIN}/</loc>`);
    expect(sitemap).toContain('/cooling/best-cooling-products-for-dogs/');
    expect(sitemap).toContain('/cooling/car-cooling-for-dogs/');
    expect(sitemap).toContain('/travel/dog-road-trip-gear/');
    expect(sitemap).toContain('/calming/best-calming-products-for-anxious-dogs/');
    expect(sitemap).toContain('/calming/best-lick-mats-for-dogs/');
    expect(sitemap).toContain('/calming/dog-fireworks-anxiety-checklist/');
    expect(sitemap).toContain('/calming/how-to-prepare-a-calm-room-for-fireworks-night/');
    expect(sitemap).toContain('/comforting/best-puppy-crates/');
    expect(sitemap).toContain('/comforting/best-anxiety-dog-crates/');
    expect(sitemap).toContain('/comforting/best-travel-crates-for-road-trips/');
    expect(sitemap).toContain('/comforting/best-airline-crates-for-flying-with-your-dog/');
    expect(sitemap).toContain('/comforting/best-furniture-dog-crates/');
    expect(sitemap).toContain('/comforting/best-heavy-duty-dog-crates/');
    expect(sitemap).not.toContain('/cooling/v/');
    expect(sitemap).not.toContain('/calming/v/');
    expect(sitemap).not.toContain('/admin/sitemap/');
    expect(sitemap).not.toContain('/privacy-policy/');
    expect(sitemap).not.toContain('/terms/');
    expect(sitemap).not.toContain('/subscribe/thanks/');
    expect(sitemap).not.toContain('/subscribe/confirmed/');
    expect(sitemap).not.toContain('/join');
  });

  it('publishes article collection entries in rss feed', () => {
    const rssXml = readBuiltAsset('rss.xml');

    expect(rssXml).toContain('/calming/crate-training-for-dogs/');
    expect(rssXml).toContain('How to Crate Train Your Dog');
    expect(rssXml).toContain('/calming/dog-fireworks-anxiety-checklist/');
    expect(rssXml).toContain('Dog Fireworks Anxiety Checklist: What to Do Before, During, and After the Fourth of July');
    expect(rssXml).toContain('/calming/how-to-prepare-a-calm-room-for-fireworks-night/');
    expect(rssXml).toContain('How to Prepare a Calm Room for Fireworks Night');
  });

  it('publishes llms.txt with all sections, key links, and no excluded paths', () => {
    const llmsText = readBuiltAsset('llms.txt');

    expect(llmsText).toContain('# Chill-Dogs');
    expect(llmsText).toContain('## Cooling Guides');
    expect(llmsText).toContain('## Calming Guides');
    expect(llmsText).toContain('## Travel Guides');
    expect(llmsText).toContain(`${SITE_ORIGIN}/cooling/`);
    expect(llmsText).toContain(`${SITE_ORIGIN}/cooling/best-cooling-products-for-dogs/`);
    expect(llmsText).toContain(`${SITE_ORIGIN}/travel/dog-road-trip-gear/`);
    expect(llmsText).not.toContain('/v/a/');
    expect(llmsText).not.toContain('/admin/sitemap/');
    expect(llmsText).not.toContain('/privacy-policy/');
  });
  it('gives every charity a stable anchor id and matching deep-link handle', () => {
    // These ids are linked from the newsletter, so renaming one silently breaks
    // links that are already out in the wild.
    const doc = readBuiltPage('shelter-dog-charities/index.html');
    const charities = [...doc.querySelectorAll('article.charity')];

    expect(charities.length).toBe(doc.querySelectorAll('.prose h2').length);
    expect(charities.map((el) => el.id)).toEqual([
      'fifteen-out-of-ten-foundation',
      'cuddly',
      'every-bark-counts',
      'fixn-fidos',
      'hollywood-rescue-grooming',
      'paw-some-mission',
      'reducing-animal-stress',
      'rolling-dog-farm',
      'tails-that-teach',
      'wild-tunes',
    ]);

    for (const charity of charities) {
      const handle = charity.querySelector('h2 a.charity-anchor');
      expect(handle?.getAttribute('href'), `anchor handle for #${charity.id}`).toBe(
        `#${charity.id}`
      );
      expect(handle?.getAttribute('aria-label')).toBeTruthy();

      // An id starting with a digit is legal HTML but not a valid CSS selector,
      // so `querySelector('#' + hash)` throws on it. Keep ids selector-safe.
      expect(charity.id).toMatch(/^[a-z][a-z0-9-]*$/);
    }

    // Charity logos are hotlinked. Facebook's CDN signs its URLs with an
    // expiry, so a logo sourced from there dies on its own schedule.
    for (const logo of doc.querySelectorAll('img.charity-logo')) {
      expect(logo.getAttribute('src'), logo.getAttribute('alt') ?? '').not.toContain('fbcdn.net');
    }
  });
  it('renders comfort travel-bed converter pages with tagged Amazon affiliate links', () => {
    const doc = readBuiltPage(path.join('comforting', 'best-dog-travel-beds', 'index.html'));
    const affiliateLinks = getAffiliateLinks(doc).filter((link) => link.getAttribute('data-merchant') === 'amazon');

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expectTrackedAffiliateLink(link);
    }
  });

  it('renders comfort chew-resistant converter pages with tagged Amazon affiliate links', () => {
    const doc = readBuiltPage(path.join('comforting', 'best-chew-resistant-dog-beds', 'index.html'));
    const affiliateLinks = getAffiliateLinks(doc).filter((link) => link.getAttribute('data-merchant') === 'amazon');

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expectTrackedAffiliateLink(link);
    }
  });
});
