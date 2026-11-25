/**
 * The site sweep's rules all rest on these string-scanning helpers, so their edge
 * cases are pinned here, in the unit tier, without needing a build.
 */
import { describe, expect, it } from 'vitest';

import { attr, decodeEntities, isNoindex, isRedirectStub, jsonLdBlocks, metaContent, routeOf } from './helpers/dist';

describe('dist helpers', () => {
  it('reads attributes with either quote style, and not from a longer name', () => {
    const tag = `<a data-track-also="amazon_outbound_click" data-track='affiliate_outbound_click' href="/x/">`;
    expect(attr(tag, 'data-track')).toBe('affiliate_outbound_click');
    expect(attr(tag, 'data-track-also')).toBe('amazon_outbound_click');
    expect(attr(tag, 'rel')).toBeUndefined();
  });

  it('reads meta content in either attribute order', () => {
    expect(metaContent('<meta property="og:title" content="A title">', 'og:title')).toBe('A title');
    expect(metaContent('<meta content="B title" property="og:title">', 'og:title')).toBe('B title');
    expect(metaContent('<meta name="description" content="Desc">', 'description')).toBe('Desc');
    expect(metaContent('<meta property="og:titles" content="no">', 'og:title')).toBeUndefined();
  });

  it('treats only the robots meta as noindex, not the word in copy', () => {
    expect(isNoindex('<meta name="robots" content="noindex, follow">')).toBe(true);
    expect(isNoindex('<p>Pages marked noindex stay out of search.</p>')).toBe(false);
    expect(isNoindex('<meta name="robots" content="index, follow">')).toBe(false);
  });

  it('extracts every JSON-LD block', () => {
    const html = '<script type="application/ld+json">{"a":1}</script><script type="application/ld+json">{"b":2}</script>';
    expect(jsonLdBlocks(html).map((block) => JSON.parse(block))).toEqual([{ a: 1 }, { b: 2 }]);
  });

  it('maps dist paths to routes', () => {
    expect(routeOf('index.html')).toBe('/');
    expect(routeOf('cooling/cooling-mats/index.html')).toBe('/cooling/cooling-mats/');
    expect(routeOf('404.html')).toBe('/404.html');
  });

  it('recognizes redirect stubs and decodes Astro entities', () => {
    expect(isRedirectStub('<meta http-equiv="refresh" content="0;url=/x/">')).toBe(true);
    expect(isRedirectStub('<p>hello</p>')).toBe(false);
    expect(decodeEntities('Flea &#38; Tick &amp; Nature&#39;s &quot;best&quot;')).toBe(`Flea & Tick & Nature's "best"`);
  });
});
