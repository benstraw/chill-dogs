#!/usr/bin/env node
/**
 * validate-ai-docs.mjs
 *
 * Validates all Markdown files under docs/ai/:
 *   1. Each file starts with YAML frontmatter (---)
 *   2. Required frontmatter keys are present: title, type, domain, status, updated, tags, related
 *   3. Each file has a "## Use this when" section
 *   4. Each file has a "## Related knowledge" section
 *   5. Relative Markdown links (e.g. [text](../path/file.md)) resolve to existing files
 *
 * Exits with code 1 if any issues are found.
 */

import { readFileSync, existsSync } from 'node:fs';
import { readdirSync, statSync } from 'node:fs';
import { join, resolve, dirname, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '..');
const docsAiDir = join(repoRoot, 'docs', 'ai');

const REQUIRED_FRONTMATTER_KEYS = ['title', 'type', 'domain', 'status', 'updated', 'tags', 'related'];

let totalFiles = 0;
let totalIssues = 0;
const issueLog = [];

function logIssue(file, message) {
  const relPath = relative(repoRoot, file);
  issueLog.push(`  [${relPath}] ${message}`);
  totalIssues++;
}

/**
 * Recursively find all .md files under a directory.
 */
function findMarkdownFiles(dir) {
  const results = [];
  const entries = readdirSync(dir);
  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Parse YAML frontmatter from a Markdown string.
 * Returns { hasFrontmatter, keys, rest } where keys is an array of found keys.
 */
function parseFrontmatter(content) {
  if (!content.startsWith('---')) {
    return { hasFrontmatter: false, keys: [], rest: content };
  }

  const endIndex = content.indexOf('\n---', 3);
  if (endIndex === -1) {
    return { hasFrontmatter: false, keys: [], rest: content };
  }

  const frontmatter = content.slice(3, endIndex);
  const rest = content.slice(endIndex + 4);

  // Extract top-level keys (lines that start with a word followed by colon)
  const keys = [];
  for (const line of frontmatter.split('\n')) {
    const match = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):/);
    if (match) {
      keys.push(match[1]);
    }
  }

  return { hasFrontmatter: true, keys, rest };
}

/**
 * Extract all relative Markdown links from content.
 * Returns array of { text, href } objects.
 * Only considers relative links (starting with . or ..)
 */
function extractRelativeLinks(content) {
  const linkPattern = /\[([^\]]*)\]\(([^)]+)\)/g;
  const links = [];
  let match;
  while ((match = linkPattern.exec(content)) !== null) {
    const href = match[2];
    // Only relative links (not http://, https://, /, or anchors)
    if (!href.startsWith('http') && !href.startsWith('/') && !href.startsWith('#')) {
      // Strip any fragment identifier
      const hrefWithoutFragment = href.split('#')[0];
      if (hrefWithoutFragment && hrefWithoutFragment.endsWith('.md')) {
        links.push({ text: match[1], href: hrefWithoutFragment });
      }
    }
  }
  return links;
}

/**
 * Validate a single Markdown file.
 */
function validateFile(filePath) {
  totalFiles++;
  const content = readFileSync(filePath, 'utf-8');

  // 1. Check for YAML frontmatter
  const { hasFrontmatter, keys, rest } = parseFrontmatter(content);
  if (!hasFrontmatter) {
    logIssue(filePath, 'Missing YAML frontmatter (must start with ---)');
  } else {
    // 2. Check required frontmatter keys
    for (const requiredKey of REQUIRED_FRONTMATTER_KEYS) {
      if (!keys.includes(requiredKey)) {
        logIssue(filePath, `Missing required frontmatter key: "${requiredKey}"`);
      }
    }
  }

  // 3. Check for "## Use this when" section (plans use "## Context" instead)
  const isPlan = keys.includes('type') &&
    (() => {
      const typeMatch = content.match(/^type:\s*(.+)$/m);
      return typeMatch && typeMatch[1].trim() === 'plan';
    })();
  if (!isPlan && !content.includes('## Use this when')) {
    logIssue(filePath, 'Missing "## Use this when" section');
  }
  if (isPlan && !content.includes('## Context')) {
    logIssue(filePath, 'Plan file missing "## Context" section');
  }

  // 4. Check for "## Related knowledge" section
  if (!content.includes('## Related knowledge')) {
    logIssue(filePath, 'Missing "## Related knowledge" section');
  }

  // 5. Check relative Markdown links resolve to existing files
  const links = extractRelativeLinks(content);
  const fileDir = dirname(filePath);
  for (const link of links) {
    const resolvedPath = resolve(fileDir, link.href);
    if (!existsSync(resolvedPath)) {
      const relTarget = relative(repoRoot, resolvedPath);
      logIssue(filePath, `Broken relative link: [${link.text}](${link.href}) → ${relTarget} does not exist`);
    }
  }
}

// Main
console.log(`Validating AI docs under docs/ai/...\n`);

if (!existsSync(docsAiDir)) {
  console.error(`docs/ai/ directory not found at: ${docsAiDir}`);
  process.exit(1);
}

const markdownFiles = findMarkdownFiles(docsAiDir);

if (markdownFiles.length === 0) {
  console.error('No .md files found under docs/ai/');
  process.exit(1);
}

for (const file of markdownFiles) {
  validateFile(file);
}

// Summary
console.log(`Files checked: ${totalFiles}`);
console.log(`Issues found:  ${totalIssues}`);

if (totalIssues > 0) {
  console.log('\nIssues:\n');
  for (const issue of issueLog) {
    console.log(issue);
  }
  process.exit(1);
} else {
  console.log('\nAll AI docs are valid.');
  process.exit(0);
}
