import { hasSafeParagraphMarkup } from '../../scripts/lib/mdx-paragraph-check';
import { describe, expect, it } from 'vitest';
import { compile } from '@mdx-js/mdx';
import { mdxParagraphProblems, migrateMdxParagraphs } from '../../scripts/lib/mdx-paragraphs';
import { htmlParagraphProblems } from './helpers/html-paragraphs';

describe('MDX paragraph migration', () => {
  it('keeps hard wrapping and separates prose from adjacent headings and components', async () => {
    const source = '<div class="prose">\n  <h2 id="first">First</h2>\n  <p>\n    First line\n    and another line with <strong>emphasis</strong>.\n  </p>\n  <h3 id="next">Next</h3>\n  <p>More text.</p>\n  <Widget />\n</div>';
    const next = migrateMdxParagraphs(source);
    expect(next).toContain('First line\n  and another line');
    expect(next).not.toContain('<p>');
    expect(mdxParagraphProblems(next)).toEqual([]);
    // Compile with a real MDX processor: missing boundary lines can make a heading
    // or component a child of the preceding Markdown paragraph.
    const compiled = String(await compile(next, { jsx: true }));
    expect(compiled).toContain('<h3 id="next">');
    expect(compiled).not.toMatch(/<_components\.p>\s*<(?:h[1-6]|Widget)/);
    expect(migrateMdxParagraphs(next)).toBe(next);
  });

  it('preserves frontmatter, exports, tracked links, expressions and heading IDs', () => {
    const prefix = '---\ntitle: "Do not edit <p>this</p>"\n---\n\nexport const label = "<p>keep this string</p>";\n\n';
    const link = '<a href={ROUTES.example} data-track="collector_to_converter_click" data-from-page={pageSlug}>our picks</a>';
    const next = migrateMdxParagraphs(prefix + '<div>\n  <h2 id="same-id">Same</h2>\n  <p>\n    See ' + link + "{' '}today.\n  </p>\n</div>");
    expect(next.startsWith(prefix)).toBe(true);
    expect(next).toContain(link + "{' '}today.");
    expect(next).toContain('<h2 id="same-id">Same</h2>');
  });

  it('keeps attributed paragraphs and standalone tracked link paragraphs explicit', () => {
    const next = migrateMdxParagraphs('<div>\n  <p id="note" class="lede">\n    Text <em>with emphasis</em>.\n  </p>\n  <p>\n    <a href="https://example.com" data-track="click">See all</a>\n  </p>\n</div>');
    expect(next).toContain('<p id="note" class="lede">Text <em>with emphasis</em>.</p>');
    expect(next).toContain('<p><a href="https://example.com" data-track="click">See all</a></p>');
    expect(mdxParagraphProblems(next)).toEqual([]);
    expect(migrateMdxParagraphs(next)).toBe(next);
  });

  it('refuses block content and significant multiline expressions for manual review', () => {
    expect(() => migrateMdxParagraphs('<p>\n  <h2>Bad heading</h2>\n</p>')).toThrow(/block content/);
    expect(() => migrateMdxParagraphs('<p class="note">\n  {`first\nsecond`}\n</p>')).toThrow(/multiline expression/);
    expect(() => migrateMdxParagraphs('<p class="note">\n  Text <a title={`first\nsecond`}>link</a>.\n</p>')).toThrow(/multiline attribute/);
  });

  it('ignores literal tags in fenced code and comments', () => {
    const source = '```html\n<p>\n  Example only.\n</p>\n```\n\n{/* <p>Example only.</p> */}\n';
    expect(mdxParagraphProblems(source)).toEqual([]);
    expect(migrateMdxParagraphs(source)).toBe(source);
  });

  it('rejects reintroduced multiline paragraphs and ordinary literal paragraphs', () => {
    expect(mdxParagraphProblems('<p class="lede">\n  Nested.\n</p>')).toEqual([expect.stringContaining('one line')]);
    expect(mdxParagraphProblems('<p>Use Markdown.</p>')).toEqual([expect.stringContaining('Markdown')]);
    expect(mdxParagraphProblems('<p class="lede">Safe.</p>')).toEqual([]);
  });
});

describe('served HTML paragraph guard', () => {
  it.each([
    '<p><p>Nested</p></p>',
    '<p class="lede">\n<p id="inner">Nested with attributes</p></p>',
    '<p>Intro <strong><p>Nested inside inline markup</p></strong></p>',
    '<p><h2 id="next">Swallowed heading</h2>Text</p>',
    '<p><div>Swallowed component wrapper</div></p>',
    '<p class="empty"> <!-- comment --> </p>',
    '<p>Unclosed',
    '</p>',
  ])('rejects invalid raw HTML: %s', (html) => {
    expect(htmlParagraphProblems(html).length).toBeGreaterThan(0);
  });

  it('allows inline content, quoted angle brackets, and examples in scripts/styles/comments', () => {
    expect(htmlParagraphProblems('<p class="lede">Text <a title="a > b" href="/example/">link</a><br><strong>bold</strong></p><h2>Next</h2><p>Next paragraph</p>')).toEqual([]);
    expect(htmlParagraphProblems('<script>const example = "<p><p>";</script><style>p::after { content: "<p>"; }</style><!-- <p><p> -->')).toEqual([]);
  });

  it('can allow empty live regions outside articles without allowing invalid nesting', () => {
    expect(htmlParagraphProblems('<p aria-live="polite"></p>', false)).toEqual([]);
    expect(htmlParagraphProblems('<p><p>Broken</p></p>', false).length).toBeGreaterThan(0);
  });
});

describe('MDX paragraph fast pass', () => {
  it.each([
    'Ordinary Markdown with **emphasis**.',
    '<p class="lede">A safe styled paragraph.</p>',
    '<p id="note" class="lede">Text <strong>with emphasis</strong> and <br /> a break.</p>',
    '<p><a href="https://example.com" data-track="click">See all <strong>picks</strong></a></p>',
    '---\ntitle: "<p>frontmatter literal</p>"\n---\n\nMarkdown prose.',
    'Use `<p>example only</p>` in inline code.\n\n<p class="lede">Actual paragraph.</p>',
    '<div>\n  <p class="lede">One.</p>\n  <p class="note">Two.</p>\n</div>',
  ])('accepts a simple safe form: %s', (source) => expect(hasSafeParagraphMarkup(source)).toBe(true));

  it.each([
    '<p>Use Markdown.</p>',
    '<p class="lede">\nMultiline.\n</p>',
    '<p\n class="lede">Multiline opening.</p>',
    '<p class="lede">No closing tag',
    '<p class="lede"><p>Nested ordinary prose.</p></p>',
    '<p><a href="one">One</a><a href="two">Two</a></p>',
    '<p>Before <a href="one">One</a></p>',
    '<div><p class="lede">Inline JSX context.</p></div>',
    '<p class={style}>Expression attribute.</p>',
    '<p class="lede">{text}</p>',
    '```html\n<p>Code example.</p>\n```',
    '{/* <p>Comment example.</p> */}',
    '<!-- <p>Comment example.</p> -->',
    'export const example = `<p>\nTemplate literal\n</p>`;',
    'export const example = "<p>String literal</p>";',
    '<p />',
    '<p{...lede}>Spread with no space.</p>',
    '<p{...lede}>First line\nsecond line</p>',
    '<p><a href="1">One</A><A href="2">Two</a></p>',
  ])('delegates ambiguous or invalid syntax to the existing AST guard: %s', (source) => expect(hasSafeParagraphMarkup(source)).toBe(false));

  it('defers a valid article with a code fence instead of failing it', () => {
    const source = 'Run this:\n\n```bash\nls\n```\n\n<p class="lede">Styled.</p>';
    expect(hasSafeParagraphMarkup(source)).toBe(false);
    expect(mdxParagraphProblems(source)).toEqual([]);
  });
});
