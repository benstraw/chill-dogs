/**
 * Prove the common article paragraph forms safe without loading the MDX compiler.
 * Anything unfamiliar returns false and goes through the full parser; this is
 * only a fast pass for valid markup, never a replacement parser or error policy.
 */
export function hasSafeParagraphMarkup(source: string): boolean {
  let body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, '');
  // Any `<p` not continuing a longer tag name (`<pre>`, `<path>`) counts as a paragraph
  // opening, including `<p{...props}>`, which JSX accepts with no space after the name.
  const opening = String.raw`<p(?![\w.:-])`;
  if (!new RegExp(opening).test(body)) return true;
  if (/```|~~~|<!--|\{\s*\/\*/.test(body)) return false;
  // Inline code cannot introduce JSX. Keep offsets and line boundaries intact.
  // Multiline/escaped backticks and expressions are left to the real MDX parser.
  body = body.replace(/(?<!\\)`[^`\r\n]*`/g, (code) => ' '.repeat(code.length));
  if (body.includes('`')) return false;
  const attribute = String.raw`\s+[A-Za-z_:][\w:.-]*\s*=\s*(?:"[^"{}\r\n]*"|'[^'{}\r\n]*')`;
  const attributed = new RegExp(`^<p(?:${attribute})+\\s*>`);
  const link = new RegExp(`^<a(?:${attribute})*\\s*>`);
  const starts = [...body.matchAll(new RegExp(opening, 'g'))];
  let previousEnd = 0;
  for (const start of starts) {
    const offset = start.index;
    if (offset < previousEnd || body.slice(body.lastIndexOf('\n', offset - 1) + 1, offset).trim()) return false;
    const end = body.indexOf('</p>', offset);
    if (end < 0) return false;
    const paragraph = body.slice(offset, end + 4);
    if (/[\r\n{}]/.test(paragraph)) return false;
    if (!attributed.test(paragraph)) {
      if (!paragraph.startsWith('<p>')) return false;
      const inner = paragraph.slice(3, -4);
      const anchor = inner.match(link)?.[0];
      // Case-insensitive: `<A>` is a different JSX element, and mismatched case is a parse error.
      if (!anchor || !inner.endsWith('</a>') || /<\/?a\b/i.test(inner.slice(anchor.length, -4))) return false;
    }
    previousEnd = end + 4;
  }
  return true;
}
