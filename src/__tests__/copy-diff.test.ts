import { describe, expect, it } from 'vitest';

import {
  compareSnapshots,
  countTextChanges,
  diffSegments,
  extractText,
  formatReport,
  hasViolations,
  htmlLines,
  normalizeHtml,
  routeOf,
  type Snapshot,
} from '../../scripts/copy-diff';

const page = (body: string, head = '') => `<!doctype html><html><head>${head}</head><body>${body}</body></html>`;

function snapshot(label: string, pages: Record<string, string>): Snapshot {
  return {
    version: 1,
    label,
    createdAt: '2026-11-26T00:00:00.000Z',
    pages: Object.fromEntries(
      Object.entries(pages).map(([route, html]) => [route, { text: extractText(html), html: normalizeHtml(html) }]),
    ),
  };
}

describe('extractText', () => {
  it('returns one entry per rendered block, keeping inline markup in its block', () => {
    const html = page('<h1>Best crates</h1><p>A <strong>sturdy</strong> pick, <a href="/x">on Amazon</a>.</p><ul><li>One</li><li>Two</li></ul>');
    expect(extractText(html)).toEqual(['Best crates', 'A sturdy pick, on Amazon.', 'One', 'Two']);
  });

  it('drops scripts, styles, svg icons and comments, which are never visible', () => {
    const html = page(
      '<script type="application/ld+json">{"name":"Hidden"}</script><style>.a{}</style>' +
        '<svg><title>icon</title></svg><!-- note --><p>Shown</p>',
    );
    expect(extractText(html)).toEqual(['Shown']);
  });

  it('keeps image alt text and head copy, marked by kind', () => {
    const html = page(
      '<img src="/a.jpg" alt="A dog in a crate"><img src="/b.jpg" alt="">',
      '<title>Crates &amp; carriers</title><meta name="description" content="Compare crates.">' +
        '<meta property="og:title" content="Crates">',
    );
    expect(extractText(html)).toEqual([
      '[title] Crates & carriers',
      '[description] Compare crates.',
      '[og:title] Crates',
      '[alt] A dog in a crate',
    ]);
  });

  it('decodes entities and collapses whitespace', () => {
    expect(extractText(page('<p>Don&#39;t\n   panic&nbsp;&mdash; it&#x2019;s fine</p>'))).toEqual(['Don\'t panic — it’s fine']);
  });
});

describe('diffSegments', () => {
  it('reports nothing for identical pages', () => {
    expect(diffSegments(['a', 'b'], ['a', 'b'])).toEqual({ removed: [], added: [], changed: [], moved: [] });
  });

  it('reports a moved block (a disclosure moved above the first link) as moved only', () => {
    const before = ['Intro', 'Buy the crate', 'As an Amazon Associate we earn from qualifying purchases.'];
    const after = ['Intro', 'As an Amazon Associate we earn from qualifying purchases.', 'Buy the crate'];
    const diff = diffSegments(before, after);
    expect(diff.removed).toEqual([]);
    expect(diff.added).toEqual([]);
    expect(diff.changed).toEqual([]);
    expect(diff.moved).toHaveLength(1);
  });

  it('pairs a reworded block as changed, not as one removal and one addition', () => {
    const diff = diffSegments(
      ['This crate folds flat in seconds without tools.'],
      ['This crate folds flat in seconds, no tools needed.'],
    );
    expect(diff.changed).toEqual([
      { before: 'This crate folds flat in seconds without tools.', after: 'This crate folds flat in seconds, no tools needed.' },
    ]);
    expect(diff.removed).toEqual([]);
    expect(diff.added).toEqual([]);
  });

  it('keeps unrelated blocks as plain removals and additions', () => {
    const diff = diffSegments(['Old paragraph about cooling mats'], ['Top carrier picks']);
    expect(diff).toMatchObject({ removed: ['Old paragraph about cooling mats'], added: ['Top carrier picks'], changed: [] });
  });

  it('counts repeated blocks instead of collapsing them', () => {
    const diff = diffSegments(['Check price', 'Check price'], ['Check price', 'Check price', 'Check price']);
    expect(diff.added).toEqual(['Check price']);
    expect(diff.removed).toEqual([]);
  });

  it('treats pure additions as additions with nothing moved', () => {
    const diff = diffSegments(['Intro', 'Body'], ['Intro', 'New module', 'Body']);
    expect(diff).toEqual({ removed: [], added: ['New module'], changed: [], moved: [] });
  });
});

describe('normalizeHtml', () => {
  it('ignores content-hashed asset names and Astro scope ids', () => {
    const a = '<script src="/_assets/Analytics.astro_astro_type_script_index_0_lang.CvShA8QQ.js"></script><div data-astro-cid-3ef6ksr2>';
    const b = '<script src="/_assets/Analytics.astro_astro_type_script_index_0_lang.Zz9_Yy-1.js"></script><div data-astro-cid-abcd1234>';
    expect(normalizeHtml(a)).toBe(normalizeHtml(b));
    expect(normalizeHtml(a)).toContain('/_assets/Analytics.astro_astro_type_script_index_0_lang.js');
  });

  it('keeps real attribute changes visible', () => {
    expect(normalizeHtml('<a rel="sponsored">')).not.toBe(normalizeHtml('<a rel="nofollow">'));
  });

  it('splits HTML one tag per line', () => {
    expect(htmlLines('<p>a</p>  <p>b</p>')).toEqual(['<p>a</p>', '<p>b</p>']);
  });
});

describe('routeOf', () => {
  it('maps built files to routes', () => {
    expect(routeOf('index.html')).toBe('/');
    expect(routeOf('cooling/index.html')).toBe('/cooling/');
    expect(routeOf('404.html')).toBe('/404.html');
  });
});

describe('compareSnapshots', () => {
  const footer = '<footer><p>As an Amazon Associate we earn from qualifying purchases.</p></footer>';

  it('passes a PR that only adds a module and moves the disclosure', () => {
    const base = snapshot('main', {
      '/a/': page(`<p>Intro</p><p>Buy</p><p>Disclosure text</p>${footer}`),
      '/b/': page(`<p>Other</p>${footer}`),
    });
    const head = snapshot('branch', {
      '/a/': page(`<p>Intro</p><p>Disclosure text</p><p>Buy</p><p>Top picks</p>${footer}`),
      '/b/': page(`<p>Other</p>${footer}`),
    });
    const comparison = compareSnapshots(base, head);
    expect(hasViolations(comparison)).toBe(false);
    expect(countTextChanges(comparison)).toEqual({ removed: 0, changed: 0, added: 1, moved: 1 });
    expect(formatReport(comparison)).toContain('**No written content removed or edited.**');
  });

  it('flags an edited sentence and names the page', () => {
    const base = snapshot('main', { '/a/': page('<p>The crate folds flat in seconds without tools.</p>') });
    const head = snapshot('branch', { '/a/': page('<p>The crate folds flat in seconds with no tools.</p>') });
    const comparison = compareSnapshots(base, head);
    expect(hasViolations(comparison)).toBe(true);
    const report = formatReport(comparison);
    expect(report).toContain('0 blocks removed, 1 edited');
    expect(report).toContain('`/a/`');
  });

  it('groups pages with the same change into one entry', () => {
    const pages = (text: string) =>
      Object.fromEntries(['/a/', '/b/', '/c/'].map((route) => [route, page(`<p>${route}</p><footer><p>${text}</p></footer>`)]));
    const comparison = compareSnapshots(snapshot('main', pages('Old footer line')), snapshot('branch', pages('New footer copy')));
    expect(comparison.textGroups).toHaveLength(1);
    expect(comparison.textGroups[0].routes).toEqual(['/a/', '/b/', '/c/']);
  });

  it('reports removed pages as violations and added pages as information', () => {
    const base = snapshot('main', { '/a/': page('<p>A</p>'), '/gone/': page('<p>Gone</p>') });
    const head = snapshot('branch', { '/a/': page('<p>A</p>'), '/new/': page('<p>New</p>') });
    const comparison = compareSnapshots(base, head);
    expect(comparison.pagesRemoved).toEqual(['/gone/']);
    expect(comparison.pagesAdded).toEqual(['/new/']);
    expect(hasViolations(comparison)).toBe(true);
  });

  it('in --html mode, flags markup-only changes that leave the text alone', () => {
    const base = snapshot('main', { '/a/': page('<a href="https://amzn.to/x" rel="sponsored">Buy</a>') });
    const head = snapshot('branch', { '/a/': page('<a href="https://amzn.to/x" rel="nofollow">Buy</a>') });
    expect(hasViolations(compareSnapshots(base, head))).toBe(false);
    const html = compareSnapshots(base, head, { html: true });
    expect(html.htmlChanges?.map((c) => c.route)).toEqual(['/a/']);
    expect(hasViolations(html)).toBe(true);
  });
});
