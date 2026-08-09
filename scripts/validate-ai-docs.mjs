#!/usr/bin/env node
/**
 * validate-ai-docs.mjs
 *
 * Validates the Markdown knowledge graph under docs/ai/:
 *   1. Each file starts with parseable YAML frontmatter
 *   2. Required frontmatter keys are present and non-empty
 *   3. Each file has a "## Use this when" section (plans use "## Context")
 *   4. Each file has a "## Related knowledge" section
 *   5. `related:` frontmatter entries resolve to existing files
 *   6. Relative Markdown links resolve, including their #anchors
 *
 * Usage: node scripts/validate-ai-docs.mjs [dir]   (default: docs/ai)
 * Exits 1 if any issues are found.
 *
 * Deliberately lenient where Markdown is legitimately varied: fenced code
 * blocks are stripped before anything is extracted, so documentation that
 * *shows* frontmatter or links is never mistaken for the real thing; anchors
 * accept GitHub's generated slugs as well as explicit HTML/attribute ids. The
 * point is to catch rot, not to enforce a house style.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const targetDir = resolve(repoRoot, process.argv[2] ?? join('docs', 'ai'));

const REQUIRED_FRONTMATTER_KEYS = ['title', 'type', 'domain', 'status', 'updated', 'tags', 'related'];

const issueLog = [];
let totalFiles = 0;

/** Repo-relative where that reads well, absolute once the path escapes the repo. */
function displayPath(p) {
  const rel = relative(repoRoot, p);
  return !rel || rel.startsWith('..') ? p : rel;
}

function logIssue(file, message) {
  issueLog.push(`  [${displayPath(file)}] ${message}`);
}

function findMarkdownFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return findMarkdownFiles(fullPath);
    return entry.endsWith('.md') ? [fullPath] : [];
  });
}

/**
 * Blank out fenced code blocks, preserving line count so nothing downstream
 * needs to care. A doc that demonstrates a link or a heading in an example
 * should not have that example validated as if it were real.
 */
function stripCodeFences(content) {
  let inFence = false;
  let fenceMarker = '';
  return content
    .split('\n')
    .map((line) => {
      const fence = line.match(/^\s*(`{3,}|~{3,})/);
      if (fence) {
        if (!inFence) {
          inFence = true;
          fenceMarker = fence[1][0];
          return '';
        }
        if (fence[1][0] === fenceMarker) {
          inFence = false;
          return '';
        }
      }
      return inFence ? '' : line;
    })
    .join('\n');
}

function splitFrontmatter(content) {
  if (!content.startsWith('---')) return { raw: null, body: content };
  const end = content.indexOf('\n---', 3);
  if (end === -1) return { raw: null, body: content };
  return { raw: content.slice(3, end), body: content.slice(end + 4) };
}

/**
 * GitHub's heading-slug algorithm: strip formatting, lowercase, drop
 * punctuation, spaces to hyphens, and suffix repeats with -1, -2, ...
 */
function slugify(headingText) {
  return headingText
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_~]/g, '')
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s/g, '-');
}

/**
 * Every anchor a link may legitimately target in a file: generated heading
 * slugs, explicit `{#custom-id}` suffixes, and HTML id/name attributes.
 */
function collectAnchors(content) {
  const stripped = stripCodeFences(content);
  const anchors = new Set();
  const seen = new Map();

  for (const line of stripped.split('\n')) {
    const heading = line.match(/^#{1,6}\s+(.*)$/);
    if (heading) {
      let text = heading[1].trim();
      const custom = text.match(/\{#([\w-]+)\}\s*$/);
      if (custom) {
        anchors.add(custom[1]);
        text = text.slice(0, custom.index).trim();
      }
      const base = slugify(text);
      if (base) {
        const count = seen.get(base) ?? 0;
        seen.set(base, count + 1);
        anchors.add(count === 0 ? base : `${base}-${count}`);
      }
    }
    for (const attr of line.matchAll(/<a\s[^>]*(?:id|name)=["']([^"']+)["']/gi)) {
      anchors.add(attr[1]);
    }
  }
  return anchors;
}

/** Relative Markdown links, excluding external, root-absolute and same-page ones. */
function extractRelativeLinks(content) {
  const links = [];
  for (const match of stripCodeFences(content).matchAll(/\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g)) {
    const href = match[2];
    if (/^(?:[a-z][a-z0-9+.-]*:|\/|#|mailto:)/i.test(href)) continue;
    const [path, anchor] = href.split('#');
    if (!path) continue;
    links.push({ text: match[1], href, path: decodeURIComponent(path), anchor });
  }
  return links;
}

function suggest(anchor, anchors) {
  const near = [...anchors].find((a) => a.includes(anchor) || anchor.includes(a));
  return near ? ` — did you mean #${near}?` : '';
}

function validateFile(filePath) {
  totalFiles++;
  const content = readFileSync(filePath, 'utf-8');
  const fileDir = dirname(filePath);
  const { raw, body } = splitFrontmatter(content);

  // 1 + 2. Frontmatter parses, and required keys are present and non-empty.
  let data = null;
  if (raw === null) {
    logIssue(filePath, 'Missing YAML frontmatter (must start with ---)');
  } else {
    try {
      data = parseYaml(raw) ?? {};
    } catch (err) {
      logIssue(filePath, `Frontmatter is not valid YAML: ${err.message.split('\n')[0]}`);
    }
  }

  if (data) {
    for (const key of REQUIRED_FRONTMATTER_KEYS) {
      if (!(key in data)) {
        logIssue(filePath, `Missing required frontmatter key: "${key}"`);
      } else if (
        data[key] === null ||
        data[key] === '' ||
        (Array.isArray(data[key]) && data[key].length === 0)
      ) {
        logIssue(filePath, `Frontmatter key "${key}" is empty`);
      }
    }
  }

  // 3 + 4. Required sections. Checked against the body with fences stripped so
  // a doc quoting these headings in an example does not satisfy the rule.
  const bodyOutsideFences = stripCodeFences(body);
  const isPlan = data?.type === 'plan';
  if (!isPlan && !bodyOutsideFences.includes('## Use this when')) {
    logIssue(filePath, 'Missing "## Use this when" section');
  }
  if (isPlan && !bodyOutsideFences.includes('## Context')) {
    logIssue(filePath, 'Plan file missing "## Context" section');
  }
  if (!bodyOutsideFences.includes('## Related knowledge')) {
    logIssue(filePath, 'Missing "## Related knowledge" section');
  }

  // 5. related: entries resolve, relative to the doc's own directory.
  const related = data?.related;
  if (Array.isArray(related)) {
    for (const entry of related) {
      if (typeof entry !== 'string' || !entry.trim()) {
        logIssue(filePath, `related: entry is not a path: ${JSON.stringify(entry)}`);
        continue;
      }
      const [path] = entry.split('#');
      if (!existsSync(resolve(fileDir, path))) {
        logIssue(filePath, `related: "${entry}" does not exist`);
      }
    }
  } else if (related != null && !Array.isArray(related)) {
    logIssue(filePath, 'Frontmatter key "related" must be a list');
  }

  // 6. Relative links resolve, and their anchors exist in the target.
  for (const link of extractRelativeLinks(body)) {
    const resolved = resolve(fileDir, link.path);
    if (!existsSync(resolved)) {
      logIssue(
        filePath,
        `Broken link: [${link.text}](${link.href}) → ${displayPath(resolved)} does not exist`,
      );
      continue;
    }
    if (!link.anchor || !resolved.endsWith('.md') || statSync(resolved).isDirectory()) continue;

    const anchors = collectAnchors(readFileSync(resolved, 'utf-8'));
    if (!anchors.has(link.anchor)) {
      logIssue(
        filePath,
        `Broken anchor: [${link.text}](${link.href}) → ` +
          `${displayPath(resolved)} has no "#${link.anchor}"${suggest(link.anchor, anchors)}`,
      );
    }
  }
}

// Main
console.log(`Validating AI docs under ${displayPath(targetDir)}/...\n`);

if (!existsSync(targetDir)) {
  console.error(`Directory not found: ${targetDir}`);
  process.exit(1);
}

const markdownFiles = findMarkdownFiles(targetDir);
if (markdownFiles.length === 0) {
  console.error(`No .md files found under ${displayPath(targetDir)}`);
  process.exit(1);
}

for (const file of markdownFiles) validateFile(file);

console.log(`Files checked: ${totalFiles}`);
console.log(`Issues found:  ${issueLog.length}`);

if (issueLog.length > 0) {
  console.log('\nIssues:\n');
  for (const issue of issueLog) console.log(issue);
  process.exit(1);
}

console.log('\nAll AI docs are valid.');
process.exit(0);
