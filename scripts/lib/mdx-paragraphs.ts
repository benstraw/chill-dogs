import { createProcessor } from '@mdx-js/mdx';

// Parse with the same MDX major version as Astro. Mask frontmatter rather than
// deleting it so the parser's source offsets and line numbers remain accurate.
const processor = createProcessor();
interface MdxNode {
  type: string;
  name?: string | null;
  attributes?: Array<{ position?: MdxNode['position'] }>;
  children?: MdxNode[];
  position?: { start: { offset?: number; line: number }; end: { offset?: number; line: number } };
}

function paragraphs(source: string): MdxNode[] {
  const body = source.replace(/^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/, (frontmatter) => frontmatter.replace(/[^\r\n]/g, ' '));
  const found: MdxNode[] = [];
  function visit(node: MdxNode) {
    if ((node.type === 'mdxJsxFlowElement' || node.type === 'mdxJsxTextElement') && node.name === 'p') found.push(node);
    node.children?.forEach(visit);
  }
  visit(processor.parse(body));
  return found;
}

/** A standalone JSX link needs its explicit paragraph to retain block spacing. */
function standaloneLink(node: MdxNode): boolean {
  const children = node.children?.length === 1 && node.children[0].type === 'paragraph' ? node.children[0].children : node.children;
  return children?.length === 1 && children[0].name === 'a';
}

export function mdxParagraphProblems(source: string): string[] {
  return paragraphs(source).flatMap((node) => {
    const { start, end } = node.position!;
    const raw = source.slice(start.offset, end.offset);
    const problems: string[] = [];
    if (raw.includes('\n')) problems.push(`line ${start.line}: explicit <p> must keep its tags and content on one line`);
    if (!node.attributes?.length && !standaloneLink(node)) problems.push(`line ${start.line}: use Markdown for ordinary prose`);
    return problems;
  });
}

/**
 * Edit only paragraph source ranges, never serialize the whole MDX tree. Blank
 * lines isolate Markdown from adjacent JSX headings, lists and components.
 * Refuse unfamiliar blocks/expressions instead of silently changing their meaning.
 */
export function migrateMdxParagraphs(source: string): string {
  const edits = paragraphs(source).map((node) => {
    const start = node.position!.start.offset!;
    const end = node.position!.end.offset!;
    const lastAttribute = node.attributes?.at(-1)?.position?.end.offset;
    const openEnd = source.indexOf('>', lastAttribute ?? start) + 1;
    const closeStart = source.lastIndexOf('</p', end);
    if (!openEnd || closeStart < openEnd) throw new Error(`Cannot migrate self-closing paragraph at line ${node.position!.start.line}`);
    const opening = source.slice(start, openEnd);
    const inner = source.slice(openEnd, closeStart);
    const lineStart = source.lastIndexOf('\n', start - 1) + 1;
    const indent = source.slice(lineStart, start);
    const explicit = Boolean(node.attributes?.length) || standaloneLink(node);

    // JSX expressions and attribute expressions may contain significant newlines
    // (for example template strings). This migration never rewrites those values.
    function checkChildren(child: MdxNode) {
      if (child !== node && child.name && /^(?:p|h[1-6]|div|section|article|ul|ol|table|figure|blockquote|pre)$/.test(child.name)) {
        throw new Error(`Review block content in paragraph at line ${node.position!.start.line} manually`);
      }
      if (child.type.endsWith('Expression') && child.position) {
        const value = source.slice(child.position.start.offset, child.position.end.offset);
        if (value.includes('\n')) throw new Error(`Review multiline expression at line ${child.position.start.line} manually`);
      }
      for (const attribute of child.attributes ?? []) {
        if (attribute.position && source.slice(attribute.position.start.offset, attribute.position.end.offset).includes('\n')) {
          throw new Error(`Review multiline attribute at line ${attribute.position.start.line} manually`);
        }
      }
      child.children?.forEach(checkChildren);
    }
    checkChildren(node);
    const children = node.children ?? [];
    if (children.some((child) => child.type !== 'paragraph' && child.type !== 'text' && child.type !== 'strong' && child.type !== 'emphasis' && child.type !== 'mdxTextExpression' && child.type !== 'mdxJsxTextElement' && !(standaloneLink(node) && child.name === 'a'))) {
      throw new Error(`Review block content in paragraph at line ${node.position!.start.line} manually`);
    }
    if (children.filter((child) => child.type === 'paragraph').length > 1) throw new Error(`Review multiple paragraphs at line ${node.position!.start.line} manually`);

    if (explicit) {
      return { start, end, markdown: false, text: opening + inner.trim().replace(/\r?\n[\t ]*/g, ' ') + '</p>' };
    }
    if (indent.trim()) throw new Error(`Review inline paragraph at line ${node.position!.start.line} manually`);
    // Keep hard wrapping. Remove only the indentation contributed by the old <p>.
    const prose = inner.trim().split('\n').map((line, index) => index > 0 && line.startsWith(indent + '  ') ? line.slice(2) : line).join('\n');
    return { start: lineStart, end, markdown: true, text: indent + prose };
  });

  let result = '';
  let cursor = 0;
  for (const edit of edits) {
    result += source.slice(cursor, edit.start);
    if (edit.markdown && result && !/\n[\t ]*\n$/.test(result)) result += '\n';
    result += edit.text;
    if (edit.markdown && !/^[\t ]*\n[\t ]*\n/.test(source.slice(edit.end))) result += '\n';
    cursor = edit.end;
  }
  result += source.slice(cursor);
  const problems = mdxParagraphProblems(result);
  if (problems.length) throw new Error(`Migration needs manual review:\n${problems.join('\n')}`);
  return result;
}
