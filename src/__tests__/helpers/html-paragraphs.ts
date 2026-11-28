/** Inspect served HTML before a browser repairs invalid paragraph nesting. */
export function htmlParagraphProblems(html: string, checkEmpty = true): string[] {
  const visible = html.replace(/<!--[\s\S]*?-->|<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '');
  const problems: string[] = [];
  const tags = /<(\/?)([a-z][\w:-]*)\b(?:[^>"']|"[^"]*"|'[^']*')*>/gi;
  const block = /^(?:address|article|aside|blockquote|caption|colgroup|dd|details|div|dl|dt|fieldset|figure|figcaption|footer|form|h[1-6]|header|hgroup|hr|li|main|menu|nav|ol|p|pre|section|table|tbody|td|tfoot|th|thead|tr|ul)$/;
  let open = 0;
  for (const match of visible.matchAll(tags)) {
    const closing = Boolean(match[1]);
    const tag = match[2].toLowerCase();
    if (!closing && open && block.test(tag)) problems.push(`<${tag}> inside <p> at offset ${match.index}`);
    if (tag === 'p') {
      if (closing && !open) problems.push(`unmatched </p> at offset ${match.index}`);
      else open += closing ? -1 : 1;
    }
  }
  if (open) problems.push(`${open} unclosed <p> element(s)`);
  if (checkEmpty) for (const match of visible.matchAll(/<p\b(?:[^>"']|"[^"]*"|'[^']*')*>\s*<\/p\s*>/gi)) problems.push(`empty <p> at offset ${match.index}`);
  return problems;
}
