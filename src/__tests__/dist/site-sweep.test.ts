/**
 * Site-wide checks over every built page, in ONE pass.
 *
 * Each page is read once and every rule below runs over it as a visitor that records
 * failures into its own bucket. Each `it` then only asserts its bucket. Adding a rule
 * means adding a visitor here, not another walk of dist/: this file replaced eight
 * separate walks in site-smoke plus the ones in seo-meta and affiliate-instrumentation.
 *
 * Parsing is string scanning (helpers/dist.ts), never a DOM.
 */

import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { pillarThemes } from '../../data/pillar-themes';
import { MIDDLEWARE_ONLY_ROUTES } from '../../data/routes';
import {
  SITE_ORIGIN,
  anchors,
  attr,
  builtPages,
  distRoot,
  isNoindex,
  isRedirectStub,
  jsonLdBlocks,
  metaContent,
  routeOf,
} from '../helpers/dist';

// og meta lengths (search and social display limits).
const OG_TITLE = { min: 40, max: 65 };
const OG_DESC = { min: 100, max: 165 };

const AMAZON_HOST = /amazon\.com/;
const ESCAPED_TAG = /&lt;(?:a|span|div|p|strong|em|br|img|ul|ol|li)\b/i;
const ASSET_EXT = /\.(ico|png|jpg|jpeg|webp|svg|pdf|xml|txt|webmanifest|css|js)$/i;
const NO_SCHEMA_EXPECTED = ['404.html', 'privacy-policy', 'terms', 'admin/', 'subscribe/', 'search/'];

type Bucket =
  | 'escapedHtml'
  | 'h1'
  | 'canonical'
  | 'metaDescription'
  | 'ogImage'
  | 'jsonLdPresent'
  | 'brokenLinks'
  | 'blockingCss'
  | 'ogTitleLength'
  | 'ogDescLength'
  | 'amazonEvent'
  | 'amazonTag'
  | 'rawAmazon'
  | 'variantTag'
  | 'relatedLinks'
  | 'pillarTheme';

const failures = Object.fromEntries(
  ([
    'escapedHtml', 'h1', 'canonical', 'metaDescription', 'ogImage', 'jsonLdPresent', 'brokenLinks',
    'blockingCss', 'ogTitleLength', 'ogDescLength', 'amazonEvent', 'amazonTag', 'rawAmazon', 'variantTag',
    'relatedLinks', 'pillarTheme',
  ] as Bucket[]).map((b) => [b, [] as string[]]),
) as Record<Bucket, string[]>;

let indexablePages = 0;
let pagesWithRelatedLinks = 0;
let pillarPages = 0;
const themeByPrefix = Object.values(pillarThemes).flatMap((theme) =>
  theme.pathPrefixes.map((prefix) => [prefix, theme.key] as const)
);
const RELATED_LINK_CLASS = /(?:^|\s)(?:ils-link|related-guide-card)(?:\s|$)/;
let amazonMerchantLinks = 0;

const linkExists = new Map<string, boolean>();
function internalTargetExists(href: string): boolean {
  let hit = linkExists.get(href);
  if (hit === undefined) {
    hit =
      existsSync(path.join(distRoot, href, 'index.html')) ||
      existsSync(path.join(distRoot, href)) ||
      (!href.endsWith('/') && existsSync(path.join(distRoot, `${href}.html`)));
    linkExists.set(href, hit);
  }
  return hit;
}

const pages = builtPages();

for (const { rel, html } of pages) {
  const stub = isRedirectStub(html);
  const route = routeOf(rel);

  // Escaped tags rendered as visible text (outside script/style).
  const visible = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  if (ESCAPED_TAG.test(visible)) failures.escapedHtml.push(rel);

  // Exactly one h1.
  if (!stub && !rel.includes('404.html')) {
    const h1 = (html.match(/<h1[\s>]/gi) ?? []).length;
    if (h1 !== 1) failures.h1.push(`${rel} (${h1} h1 tags)`);
  }

  // Exactly one canonical.
  const canonical = (html.match(/<link[^>]+rel=['"]canonical['"][^>]*>/gi) ?? []).length;
  if (canonical !== 1) failures.canonical.push(`${rel} (${canonical} canonical tags)`);

  if (!stub) {
    if (!metaContent(html, 'description')?.trim()) failures.metaDescription.push(rel);

    const ogImage = metaContent(html, 'og:image') ?? '';
    if (!ogImage.startsWith(`${SITE_ORIGIN}/`)) failures.ogImage.push(`${rel} → ${ogImage || '(none)'}`);

    if (!NO_SCHEMA_EXPECTED.some((p) => rel.includes(p)) && jsonLdBlocks(html).length === 0) {
      failures.jsonLdPresent.push(rel);
    }
  }

  // Internal links resolve to built pages.
  for (const [, href] of html.matchAll(/href="(\/[^"#?]*)"/g)) {
    if (ASSET_EXT.test(href) || MIDDLEWARE_ONLY_ROUTES.includes(href)) continue;
    if (!internalTargetExists(href)) failures.brokenLinks.push(`${rel}: broken link → ${href}`);
  }

  // No render-blocking stylesheets in <head>.
  const head = html.match(/<head[\s>][\s\S]*?<\/head>/i)?.[0];
  const blocking = head?.match(/<link[^>]+rel=['"]stylesheet['"][^>]*>/gi)?.length ?? 0;
  if (blocking) failures.blockingCss.push(`${rel} (${blocking} blocking stylesheet(s))`);

  // og:title / og:description lengths on indexable pages, measured as emitted (escaped),
  // the same convention as htmlAttrLength in src/utils/product-meta.ts. Skips only pages
  // whose robots meta says noindex (it used to skip any page mentioning "noindex").
  if (!stub && !isNoindex(html)) {
    indexablePages++;
    const title = metaContent(html, 'og:title') ?? '';
    const desc = metaContent(html, 'og:description') ?? '';
    if (title.length < OG_TITLE.min || title.length > OG_TITLE.max) {
      failures.ogTitleLength.push(`${title.length} chars  ${route}\n    "${title}"`);
    }
    if (desc.length < OG_DESC.min || desc.length > OG_DESC.max) {
      failures.ogDescLength.push(`${desc.length} chars  ${route}\n    "${desc}"`);
    }
  }

  // Pillar theme: every page under a pillar path carries that pillar's theme.
  const pillar = themeByPrefix.find(([prefix]) => route.startsWith(prefix));
  if (pillar && !stub) {
    pillarPages++;
    const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
    const theme = attr(htmlTag, 'data-pillar-theme');
    if (theme !== pillar[1] || !(attr(htmlTag, 'style') ?? '').includes('--pillar-accent:')) {
      failures.pillarTheme.push(`${route}: expected theme ${pillar[1]}, got ${theme ?? '(none)'}`);
    }
  }

  // Derived related links (InternalLinkStrip, RelatedGuides): tracked, never the page
  // itself, never repeated. Which pages they pick is unit-tested in related-pages.test.ts;
  // pinning each page's exact list here only broke on every content edit.
  const related = anchors(html).filter((tag) => RELATED_LINK_CLASS.test(attr(tag, 'class') ?? ''));
  if (related.length) pagesWithRelatedLinks++;
  const seenRelated = new Set<string>();
  for (const tag of related) {
    const href = attr(tag, 'href') ?? '';
    if (attr(tag, 'data-track') !== 'collector_to_converter_click') {
      failures.relatedLinks.push(`${rel} → ${href}: missing data-track="collector_to_converter_click"`);
    }
    if (href === route) failures.relatedLinks.push(`${rel}: links to itself`);
    const kind = RELATED_LINK_CLASS.exec(attr(tag, 'class') ?? '')![0].trim();
    if (seenRelated.has(`${kind} ${href}`)) failures.relatedLinks.push(`${rel}: repeats ${href} in ${kind}`);
    seenRelated.add(`${kind} ${href}`);
  }

  // Affiliate instrumentation.
  const isAdmin = rel.startsWith('admin/');
  for (const tag of anchors(html)) {
    const href = attr(tag, 'href') ?? '';
    const amazon = AMAZON_HOST.test(href);

    if (attr(tag, 'data-merchant') === 'amazon') {
      amazonMerchantLinks++;
      const emits = [attr(tag, 'data-track'), attr(tag, 'data-track-also')];
      if (!emits.includes('amazon_outbound_click')) {
        failures.amazonEvent.push(`${rel} :: ${attr(tag, 'data-product-name') ?? tag.slice(0, 90)}`);
      }
    }
    if (!amazon) continue;

    const tagged = href.includes('tag=chill-dogs-20');
    if (attr(tag, 'data-affiliate') === 'true' && !tagged) failures.amazonTag.push(`${rel} :: ${href.slice(0, 90)}`);
    if (attr(tag, 'data-variant-option')) {
      if (!tagged) failures.variantTag.push(`${rel} :: ${href.slice(0, 90)}`);
    } else if (!isAdmin && !attr(tag, 'data-track') && !attr(tag, 'data-track-also')) {
      // Raw <a> to Amazon that never went through AffiliateLink: neither tagged nor
      // instrumented. Allowed: /admin/ (internal diagnostic) and variant chips, which
      // repoint the tracked CTA instead (docs/ai/engineering/product-variants.md).
      failures.rawAmazon.push(rel);
    }
  }
}

function report(bucket: Bucket, fix: string): string {
  const list = [...new Set(failures[bucket])];
  return `${list.length} failure(s). Fix: ${fix}\n${list.join('\n')}`;
}

describe('site sweep: every built page', () => {
  it('swept a real build', () => {
    expect(indexablePages, 'no indexable pages found in dist/').toBeGreaterThan(50);
    expect(amazonMerchantLinks, 'no Amazon merchant links found in dist/').toBeGreaterThan(50);
  });

  it('related link strips are tracked, never self-links, never repeats', () => {
    expect(pagesWithRelatedLinks, 'no related link strips found').toBeGreaterThan(20);
    expect(failures.relatedLinks, report('relatedLinks', 'use InternalLinkStrip / RelatedGuides with sitemap metadata, not hand-written links')).toEqual([]);
  });

  it('applies the pillar theme to every page under a pillar path', () => {
    expect(pillarPages).toBeGreaterThan(30);
    expect(failures.pillarTheme, report('pillarTheme', 'render the page through BaseLayout so the path resolves its theme')).toEqual([]);
  });

  it('renders no escaped HTML tags as visible text', () => {
    expect(failures.escapedHtml, report('escapedHtml', 'render the markup with set:html or a component, not as a string')).toEqual([]);
  });

  it('has exactly one h1', () => {
    expect(failures.h1, report('h1', 'one <h1> per page; demote the others to <h2>')).toEqual([]);
  });

  it('has exactly one canonical tag', () => {
    expect(failures.canonical, report('canonical', 'pass canonicalUrl once, via BaseLayout')).toEqual([]);
  });

  it('has a meta description', () => {
    expect(failures.metaDescription, report('metaDescription', 'pass description to BaseLayout')).toEqual([]);
  });

  it('has a same-origin og:image', () => {
    expect(failures.ogImage, report('ogImage', `og:image must be an absolute ${SITE_ORIGIN}/ URL`)).toEqual([]);
  });

  it('content pages carry at least one JSON-LD block', () => {
    expect(failures.jsonLdPresent, report('jsonLdPresent', 'add a <JsonLd> schema to the page')).toEqual([]);
  });

  it('every internal link resolves to a built page', () => {
    expect(failures.brokenLinks, report('brokenLinks', 'link via ROUTES (src/data/routes.ts) to a page that exists')).toEqual([]);
  });

  it('has no render-blocking stylesheets in <head>', () => {
    expect(failures.blockingCss, report('blockingCss', 'inline the CSS or load it non-blocking')).toEqual([]);
  });

  it(`og:title is ${OG_TITLE.min}-${OG_TITLE.max} chars on indexable pages`, () => {
    expect(failures.ogTitleLength, report('ogTitleLength', 'set the ogTitle prop on BaseLayout')).toEqual([]);
  });

  it(`og:description is ${OG_DESC.min}-${OG_DESC.max} chars on indexable pages`, () => {
    expect(failures.ogDescLength, report('ogDescLength', 'adjust the page description')).toEqual([]);
  });

  it('every Amazon merchant link emits amazon_outbound_click', () => {
    expect(failures.amazonEvent, report('amazonEvent', 'use AffiliateLink.astro for Amazon links')).toEqual([]);
  });

  it('every affiliate Amazon link carries the associate tag', () => {
    expect(failures.amazonTag, report('amazonTag', 'build the URL with the product data helpers so tag=chill-dogs-20 is added')).toEqual([]);
  });

  it('has no uninstrumented raw Amazon anchors', () => {
    expect(failures.rawAmazon, report('rawAmazon', 'use AffiliateLink.astro instead of a raw <a>')).toEqual([]);
  });

  it('every variant chip carries the associate tag', () => {
    expect(failures.variantTag, report('variantTag', 'variant URLs must carry tag=chill-dogs-20')).toEqual([]);
  });
});
