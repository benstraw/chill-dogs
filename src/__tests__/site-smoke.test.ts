import { beforeAll, describe, expect, it } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const projectRoot = path.resolve(__dirname, '../..');
const distRoot = path.join(projectRoot, 'dist');

function buildSite() {
  execFileSync('npm', ['run', 'build'], {
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

function getAmazonAffiliateLinks(doc: Document): HTMLAnchorElement[] {
  return Array.from(
    doc.querySelectorAll<HTMLAnchorElement>('a[data-affiliate="true"][href*="amazon."]')
  );
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
    expect(canonical?.getAttribute('href')).toBe('https://chill-dogs.com/');
  });

  it('publishes generated per-page OG assets and metadata references', () => {
    const homeDoc = readBuiltPage('index.html');
    const coolingDoc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));
    const termsDoc = readBuiltPage(path.join('terms', 'index.html'));

    expect(homeDoc.querySelector('meta[property=\"og:image\"]')?.getAttribute('content'))
      .toContain('/og/home.svg');
    expect(coolingDoc.querySelector('meta[property=\"og:image\"]')?.getAttribute('content'))
      .toContain('/og/cooling-cooling-mats.svg');

    // noindex pages keep the static default fallback
    expect(termsDoc.querySelector('meta[property=\"og:image\"]')?.getAttribute('content'))
      .toContain('/og-default.jpg');

    const homeOg = readBuiltAsset(path.join('og', 'home.svg'));
    const coolingOg = readBuiltAsset(path.join('og', 'cooling-cooling-mats.svg'));
    expect(homeOg).toContain('<svg');
    expect(coolingOg).toContain('Shop Top Picks Now');
  });

  it('renders cooling converter pages with tagged Amazon affiliate links', () => {
    const doc = readBuiltPage(path.join('cooling', 'cooling-mats', 'index.html'));
    const affiliateLinks = getAmazonAffiliateLinks(doc);

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expect(link.getAttribute('rel')).toBe('nofollow sponsored noopener');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('data-track')).toBe('amazon_outbound_click');
      expect(link.href).toContain('tag=chill-dogs-20');
    }
  });

  it('renders calming converter pages with tagged Amazon affiliate links', () => {
    const doc = readBuiltPage(path.join('calming', 'best-calming-products-for-anxious-dogs', 'index.html'));
    const affiliateLinks = getAmazonAffiliateLinks(doc);

    expect(affiliateLinks.length).toBeGreaterThan(0);

    for (const link of affiliateLinks) {
      expect(link.getAttribute('rel')).toBe('nofollow sponsored noopener');
      expect(link.getAttribute('target')).toBe('_blank');
      expect(link.getAttribute('data-track')).toBe('amazon_outbound_click');
      expect(link.href).toContain('tag=chill-dogs-20');
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
    expect(affiliateDoc.body.textContent).toContain('Amazon Services LLC Associates Program');
    expect(affiliateDoc.body.textContent).toContain('no additional cost to you');
  });

  it('publishes robots and sitemap entries for key routes', () => {
    const robotsTxt = readBuiltAsset('robots.txt');
    const sitemapIndex = readBuiltAsset('sitemap-index.xml');
    const sitemap = readBuiltAsset('sitemap-0.xml');

    expect(robotsTxt).toContain('Sitemap: https://chill-dogs.com/sitemap-index.xml');
    expect(sitemapIndex).toContain('/sitemap-0.xml');
    expect(sitemap).toContain('<loc>https://chill-dogs.com/</loc>');
    expect(sitemap).toContain('<loc>https://chill-dogs.com/cooling/cooling-mats/</loc>');
    expect(sitemap).toContain('<loc>https://chill-dogs.com/calming/best-calming-products-for-anxious-dogs/</loc>');
  });
});
