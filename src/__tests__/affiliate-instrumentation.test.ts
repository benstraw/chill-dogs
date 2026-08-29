import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { globSync } from 'node:fs';
import { join, relative } from 'node:path';

/**
 * Guards the outbound-click instrumentation against silent regressions.
 *
 * The keystone event is `amazon_outbound_click`. It is emitted by the global click
 * listener in src/scripts/analytics.ts from `data-track` / `data-track-also`, which
 * MerchantAffiliateLink sets for every Amazon offer. A hand-rolled anchor that skips
 * that component still sends the visitor to Amazon but reports nothing, so the page
 * looks like it converts at zero.
 *
 * These tests read the built site, so they cover every page regardless of how its
 * markup is authored (.astro, .mdx, or a component).
 */

const DIST = 'dist';

function builtPages(): string[] {
  return globSync('**/*.html', { cwd: DIST }).map((p) => join(DIST, p));
}

function anchorsIn(html: string): string[] {
  return html.match(/<a\b[^>]*>/g) ?? [];
}

function attr(tag: string, name: string): string | undefined {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}

const pages = builtPages().map((file) => ({ file, html: readFileSync(file, 'utf8') }));

describe('affiliate instrumentation', () => {
  it('has a built site to inspect', () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  it('every Amazon merchant link emits amazon_outbound_click', () => {
    const offenders: string[] = [];

    for (const { file, html } of pages) {
      for (const tag of anchorsIn(html)) {
        if (attr(tag, 'data-merchant') !== 'amazon') continue;

        const emits = [attr(tag, 'data-track'), attr(tag, 'data-track-also')].filter(Boolean);
        if (!emits.includes('amazon_outbound_click')) {
          offenders.push(`${relative(DIST, file)} :: ${attr(tag, 'data-product-name') ?? tag.slice(0, 90)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });

  it('every affiliate Amazon link carries the associate tag', () => {
    const untagged: string[] = [];

    for (const { file, html } of pages) {
      for (const tag of anchorsIn(html)) {
        if (attr(tag, 'data-affiliate') !== 'true') continue;

        const href = attr(tag, 'href') ?? '';
        if (!/amazon\.com/.test(href)) continue;
        if (!href.includes('tag=chill-dogs-20')) {
          untagged.push(`${relative(DIST, file)} :: ${href.slice(0, 90)}`);
        }
      }
    }

    expect(untagged).toEqual([]);
  });

  /**
   * Raw <a> tags pointing at Amazon that never went through AffiliateLink are neither
   * tagged nor instrumented. /admin/products/ is the internal catalog diagnostic — it
   * links out to every ASIN on purpose and is not a monetised surface, so it is the one
   * allowed source. Any other page appearing here is a real regression.
   */
  it('does not add new uninstrumented Amazon anchors', () => {
    const raw = new Set<string>();

    for (const { file, html } of pages) {
      const page = relative(DIST, file);
      if (page.startsWith('admin/')) continue;

      for (const tag of anchorsIn(html)) {
        const href = attr(tag, 'href') ?? '';
        if (!/amazon\.com/.test(href)) continue;
        if (attr(tag, 'data-track') || attr(tag, 'data-track-also')) continue;
        raw.add(page);
      }
    }

    expect([...raw].sort()).toEqual([]);
  });
});
