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
import { merchants } from '../../data/products/merchants';
import { MIDDLEWARE_ONLY_ROUTES } from '../../data/routes';
import {
  SITE_ORIGIN,
  anchors,
  attr,
  builtPages,
  decodeEntities,
  distRoot,
  isNoindex,
  isRedirectStub,
  jsonLdBlocks,
  metaContent,
  routeOf,
} from '../helpers/dist';
import { AFFILIATE_LINK_ALLOWLIST } from '../allowlists/affiliate-links';
import { DISCLOSURE_ALLOWLIST } from '../allowlists/disclosure';
import { JSON_LD_ALLOWLIST } from '../allowlists/json-ld';
import { expectWithinAllowlist } from '../helpers/ratchet';

// og meta lengths (search and social display limits).
const OG_TITLE = { min: 40, max: 65 };
const OG_DESC = { min: 100, max: 165 };

/** Hosts where a click can earn a commission. Short links count: amzn.to, a.co. */
const AFFILIATE_HOST = /^(?:www\.)?(?:amazon\.[a-z.]+|amzn\.to|a\.co|awin1\.com|aorkuler\.com|chewy\.com|chewy\.sjv\.io)$/;
const AMAZON_HOST = /^(?:www\.)?(?:amazon\.[a-z.]+|amzn\.to|a\.co)$/;

function outboundUrl(href: string): URL | undefined {
  try {
    return new URL(decodeEntities(href));
  } catch {
    return undefined;
  }
}
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
  | 'affiliateUntracked'
  | 'amazonProductData'
  | 'aorkulerDirect'
  | 'variantTag'
  | 'relatedLinks'
  | 'pillarTheme'
  | 'jsonLdInvalid'
  | 'offerSeller'
  | 'disclosure'
  | 'missingAssets'
  | 'reviewRating'
  | 'affiliateAttrs'
  | 'breadcrumbs';

const failures = Object.fromEntries(
  ([
    'escapedHtml', 'h1', 'canonical', 'metaDescription', 'ogImage', 'jsonLdPresent', 'brokenLinks',
    'blockingCss', 'ogTitleLength', 'ogDescLength', 'amazonEvent', 'amazonTag', 'affiliateUntracked', 'amazonProductData', 'aorkulerDirect', 'variantTag',
    'relatedLinks', 'pillarTheme', 'jsonLdInvalid', 'offerSeller', 'disclosure', 'missingAssets', 'reviewRating', 'affiliateAttrs', 'breadcrumbs',
  ] as Bucket[]).map((b) => [b, [] as string[]]),
) as Record<Bucket, string[]>;

let indexablePages = 0;
let pagesWithRelatedLinks = 0;
let pillarPages = 0;
let offersChecked = 0;
let pagesWithAffiliateLinks = 0;
let assetsChecked = 0;
let reviewRatingsChecked = 0;

const assetExists = new Map<string, boolean>();
/** Same-origin asset URL → whether dist/ has the file. Off-site and data: URLs → undefined. */
function localAssetExists(src: string): boolean | undefined {
  if (!src || src.startsWith('data:')) return undefined;
  let url: URL;
  try {
    url = new URL(decodeEntities(src), `${SITE_ORIGIN}/`);
  } catch {
    return false;
  }
  if (url.origin !== SITE_ORIGIN) return undefined;
  const file = decodeURIComponent(url.pathname);
  let hit = assetExists.get(file);
  if (hit === undefined) {
    hit = existsSync(path.join(distRoot, file));
    assetExists.set(file, hit);
  }
  return hit;
}
/** Disclosure copy written inline rather than through a disclosure component. */
const DISCLOSURE_TEXT = /As an Amazon Associate|contains affiliate links|affiliate links? (?:to|on)|earn (?:a small )?commissions?/i;

/** Merchant label for an offer URL, by host. Unknown hosts are not judged. */
const SELLER_BY_HOST: Array<[RegExp, string]> = [
  [/(^|\.)amazon\.com$/, merchants.amazon.label],
  [/(^|\.)(chewy\.com|chewy\.sjv\.io)$/, merchants.chewy.label],
  [/(^|\.)(aorkuler\.com|awin1\.com)$/, merchants.aorkuler.label],
];
function expectedSeller(url: string): string | undefined {
  try {
    const host = new URL(url).hostname;
    return SELLER_BY_HOST.find(([re]) => re.test(host))?.[1];
  } catch {
    return undefined;
  }
}

type Json = Record<string, unknown>;
const asArray = (v: unknown): unknown[] => (Array.isArray(v) ? v : v === undefined ? [] : [v]);
const types = (node: Json) => asArray(node['@type']).map(String);
const has = (node: Json, key: string) => node[key] !== undefined && node[key] !== '' && node[key] !== null;

/** Required fields per schema.org type, as Google's rich-result docs require them. */
function schemaProblems(node: Json): string[] {
  const problems: string[] = [];
  const need = (key: string) => {
    if (!has(node, key)) problems.push(`${types(node).join('/')} missing ${key}`);
  };
  for (const type of types(node)) {
    if (type === 'Product') need('name');
    if (type === 'Offer') need('url');
    if (type === 'Review') {
      need('author');
      const rating = node.reviewRating as Json | undefined;
      if (!rating || !has(rating, 'ratingValue')) problems.push('Review missing reviewRating.ratingValue');
      const item = node.itemReviewed as Json | undefined;
      if (!item || !has(item, 'name')) problems.push('Review missing itemReviewed.name');
    }
    if (type === 'Article' || type === 'BlogPosting') ['headline', 'datePublished'].forEach(need);
    if (type === 'FAQPage') {
      const questions = asArray(node.mainEntity) as Json[];
      if (!questions.length) problems.push('FAQPage has no questions');
      for (const q of questions) {
        const answer = q.acceptedAnswer as Json | undefined;
        if (!has(q, 'name') || !answer || !has(answer, 'text')) problems.push(`FAQ question incomplete: ${String(q.name ?? '?')}`);
      }
    }
    if (type === 'BreadcrumbList' || type === 'ItemList') {
      const items = asArray(node.itemListElement) as Json[];
      if (!items.length) problems.push(`${type} has no itemListElement`);
      items.forEach((item, i) => {
        if (item.position !== i + 1) problems.push(`${type} item ${i + 1} has position ${String(item.position)}`);
      });
    }
  }
  return problems;
}

/** Every object node in a JSON-LD document, including @graph members and nested values. */
function* nodes(value: unknown): Generator<Json> {
  if (Array.isArray(value)) for (const v of value) yield* nodes(v);
  else if (value && typeof value === 'object') {
    yield value as Json;
    for (const v of Object.values(value)) yield* nodes(v);
  }
}
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

  // JSON-LD: parses, required fields per type, and each Offer's seller is the merchant its URL goes to.
  for (const block of jsonLdBlocks(html)) {
    let doc: unknown;
    try {
      doc = JSON.parse(block);
    } catch (error) {
      failures.jsonLdInvalid.push(`${rel}: does not parse (${(error as Error).message})`);
      continue;
    }
    for (const node of nodes(doc)) {
      for (const problem of schemaProblems(node)) failures.jsonLdInvalid.push(`${rel}: ${problem}`);
      // Google ignores a Review rating that is not visible on the page. ReviewRating.astro
      // renders it as aria-label="4.5 out of 5 stars".
      const rating = types(node).includes('Review') ? (node.reviewRating as Json | undefined) : undefined;
      if (rating && typeof rating.ratingValue === 'number') {
        reviewRatingsChecked++;
        const value = rating.ratingValue;
        const display = Number.isInteger(value) ? `${value}.0` : value.toFixed(1);
        const best = rating.bestRating ?? 5;
        if (!html.includes(`aria-label="${display} out of ${best} stars"`)) {
          failures.reviewRating.push(`${rel}: schema rates ${value}/${best} but the page shows no matching <ReviewRating>`);
        }
      }
      if (types(node).includes('Offer') && typeof node.url === 'string') {
        const expected = expectedSeller(node.url);
        const seller = (node.seller as Json | undefined)?.name;
        if (expected && seller !== undefined) {
          offersChecked++;
          if (seller !== expected) failures.offerSeller.push(`${rel}: offer to ${new URL(node.url).hostname} names seller "${String(seller)}", expected "${expected}"`);
        }
      }
    }
  }

  // BreadcrumbList on every indexable page below the homepage, and never on a noindex one.
  if (!stub && rel !== 'index.html' && !rel.endsWith('404.html')) {
    const hasCrumbs = jsonLdBlocks(html).some((block) => block.includes('"BreadcrumbList"'));
    if (hasCrumbs === isNoindex(html)) {
      failures.breadcrumbs.push(`${route}: ${hasCrumbs ? 'noindex page carries' : 'indexable page lacks'} BreadcrumbList`);
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

  // Local images and share images exist. The link check skips assets, so a renamed
  // image or a missing generated OG card shipped silently.
  const assetRefs = [
    ...Array.from(html.matchAll(/<(?:img|source)\b[^>]*>/gi), (m) => m[0]).flatMap((tag) => [
      attr(tag, 'src') ?? '',
      ...(attr(tag, 'srcset') ?? '').split(',').map((part) => part.trim().split(/\s+/)[0]),
    ]),
    metaContent(html, 'og:image') ?? '',
    metaContent(html, 'twitter:image') ?? '',
  ];
  for (const src of assetRefs) {
    const exists = localAssetExists(src);
    if (exists === undefined) continue;
    assetsChecked++;
    if (!exists) failures.missingAssets.push(`${rel} → ${src}`);
  }

  // Disclosure before the first affiliate link (above the footer, whose own
  // disclosure covers only the footer logos).
  if (!rel.startsWith('admin/')) {
    const footerAt = html.search(/<footer\b/);
    const main = footerAt > -1 ? html.slice(0, footerAt) : html;
    const firstLink = main.search(/<a\b[^>]*data-affiliate="true"/);
    if (firstLink > -1) {
      pagesWithAffiliateLinks++;
      const before = main.slice(0, firstLink);
      const text = before
        .slice(Math.max(0, before.search(/<body\b/)))
        .replace(/<script\b[\s\S]*?<\/script>/gi, '')
        .replace(/<[^>]+>/g, ' ');
      if (!before.includes('data-affiliate-disclosure') && !DISCLOSURE_TEXT.test(text)) failures.disclosure.push(rel);
    }
  }

  // Affiliate links. Every anchor to a merchant host must go through AffiliateLink /
  // MerchantAffiliateLink: tracked, marked sponsored, and (Amazon) tagged exactly.
  // Exempt: /admin/ (internal diagnostic) and variant chips, which repoint the tracked
  // CTA instead of replacing it (docs/ai/engineering/product-variants.md); chips are
  // still checked for the tag and rel.
  const isAdmin = rel.startsWith('admin/');
  for (const tag of anchors(html)) {
    const href = attr(tag, 'href') ?? '';

    if (attr(tag, 'data-merchant') === 'amazon') {
      amazonMerchantLinks++;
      const emits = [attr(tag, 'data-track'), attr(tag, 'data-track-also')];
      if (!emits.includes('amazon_outbound_click')) {
        failures.amazonEvent.push(`${rel} :: ${attr(tag, 'data-product-name') || tag.slice(0, 90)}`);
      }
    }

    const url = outboundUrl(href);
    if (isAdmin || !url || !AFFILIATE_HOST.test(url.hostname)) continue;
    const where = `${rel} :: ${url.hostname}${url.pathname.slice(0, 60)}`;
    const isChip = Boolean(attr(tag, 'data-variant-option'));
    const sponsored = /(?:^|\s)sponsored(?:\s|$)/.test(attr(tag, 'rel') ?? '');

    if (AMAZON_HOST.test(url.hostname) && url.searchParams.get('tag') !== 'chill-dogs-20') {
      (isChip ? failures.variantTag : failures.amazonTag).push(`${where} (tag=${url.searchParams.get('tag') ?? 'none'})`);
    }
    if (url.hostname.endsWith('aorkuler.com')) failures.aorkulerDirect.push(where);

    if (isChip) {
      if (!sponsored) failures.affiliateUntracked.push(`${where}: variant chip without rel="sponsored"`);
      continue;
    }
    if (attr(tag, 'data-affiliate') !== 'true' || !attr(tag, 'data-track') || !sponsored) {
      failures.affiliateUntracked.push(where);
    }
    if (attr(tag, 'data-affiliate') === 'true') {
      const rels = (attr(tag, 'rel') ?? '').split(/\s+/);
      if (attr(tag, 'target') !== '_blank' || !rels.includes('noopener') || !rels.includes('noreferrer')) {
        failures.affiliateAttrs.push(`${where}: needs target="_blank" rel="sponsored noopener noreferrer"`);
      }
      if (attr(tag, 'data-merchant') !== 'amazon' && attr(tag, 'data-track-also') === 'amazon_outbound_click') {
        failures.affiliateAttrs.push(`${where}: non-Amazon link fires amazon_outbound_click`);
      }
    }
    if (AMAZON_HOST.test(url.hostname)) {
      if (!attr(tag, 'data-product-name')) failures.amazonProductData.push(`${where}: empty data-product-name`);
      if (/\/dp\//.test(url.pathname) && !attr(tag, 'data-asin')) failures.amazonProductData.push(`${where}: empty data-asin`);
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

  it('emits valid JSON-LD with the fields each type requires', () => {
    expectWithinAllowlist(failures.jsonLdInvalid, JSON_LD_ALLOWLIST, 'JSON-LD', 'fix the schema object passed to <JsonLd>');
  });

  it("names the right seller on every Offer", () => {
    expect(offersChecked, 'no Offer sellers found to check').toBeGreaterThan(50);
    expect(failures.offerSeller, report('offerSeller', 'take the seller from merchants[offer.merchant].label')).toEqual([]);
  });

  it('discloses affiliate links before the first one', () => {
    expect(pagesWithAffiliateLinks).toBeGreaterThan(100);
    expectWithinAllowlist(failures.disclosure, DISCLOSURE_ALLOWLIST, 'disclosure placement', 'put <Disclosure /> or <AffiliateDisclosure /> above the first affiliate link');
  });

  it('every local image and share image exists', () => {
    expect(assetsChecked).toBeGreaterThan(500);
    expect(failures.missingAssets, report('missingAssets', 'fix the path, or regenerate the image (bun run build / og:gen)')).toEqual([]);
  });

  it('shows every Review rating on the page, matching the schema', () => {
    expect(reviewRatingsChecked, 'no Review ratings found').toBeGreaterThan(0);
    expect(failures.reviewRating, report('reviewRating', 'pass the same RATING to buildReviewSchema and <ReviewRating>')).toEqual([]);
  });

  it('puts BreadcrumbList on indexable pages only', () => {
    expect(failures.breadcrumbs, report('breadcrumbs', 'BaseLayout adds it from the path; check noindex')).toEqual([]);
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

  it('every Amazon link carries exactly tag=chill-dogs-20', () => {
    expect(failures.amazonTag, report('amazonTag', 'build the URL with the product data helpers so tag=chill-dogs-20 is added')).toEqual([]);
  });

  it('every merchant link is tracked and marked sponsored', () => {
    expectWithinAllowlist(
      failures.affiliateUntracked,
      AFFILIATE_LINK_ALLOWLIST,
      'untracked merchant link',
      'use AffiliateLink.astro / MerchantAffiliateLink.astro instead of a raw <a>'
    );
  });

  it('opens every affiliate link in a new tab with sponsored noopener noreferrer', () => {
    expect(failures.affiliateAttrs, report('affiliateAttrs', 'use MerchantAffiliateLink, which sets these')).toEqual([]);
  });

  it('every Amazon link names its product, and its ASIN for /dp/ links', () => {
    expect(failures.amazonProductData, report('amazonProductData', 'pass data-product-name (and data-asin) to AffiliateLink')).toEqual([]);
  });

  it('never links to aorkuler.com directly (the Awin link earns the commission)', () => {
    expect(failures.aorkulerDirect, report('aorkulerDirect', 'use the Awin tracking URL from the Aorkuler offer')).toEqual([]);
  });

  it('every variant chip carries the associate tag', () => {
    expect(failures.variantTag, report('variantTag', 'variant URLs must carry tag=chill-dogs-20')).toEqual([]);
  });
});
