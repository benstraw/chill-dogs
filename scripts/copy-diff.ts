#!/usr/bin/env bun
/**
 * Copy diff: proves a change did not rewrite the site's written content.
 *
 * It extracts the visible text of every built page (headings, paragraphs, list items,
 * button and link text, image alt text, plus the title and meta descriptions) and
 * compares it with a snapshot taken from another build. The report says, per page,
 * which text blocks were removed, changed, added or moved. Pages with the same change
 * (a footer edit, say) are grouped so one edit is not reported 280 times.
 *
 *   bun run copy:diff -- --base origin/main   # build the ref in a temp worktree, then compare dist/ with it
 *   bun run copy:diff -- --save               # snapshot the current dist/ (run on the base branch)
 *   bun run copy:diff                         # compare the current dist/ with that snapshot
 *
 * Options:
 *   --html            also compare the full built HTML (normalized for asset hashes and
 *                     Astro scope ids). For refactors, where nothing should change at all.
 *   --strict          exit 1 if any text was removed or changed (and, with --html, if
 *                     any HTML changed). Added and moved text never fails.
 *   --out <file>      also write the markdown report to a file (paste it into the PR).
 *   --snapshot <file> snapshot path for --save and plain compare
 *                     (default .cache/copy-diff/snapshot.json).
 *   --allow-stale     compare even if dist/ was built from different inputs than the tree.
 *
 * `--base` snapshots are cached by commit in .cache/copy-diff/<sha>.json, so a second
 * run against the same base only rebuilds the working tree, not the base.
 *
 * Reading the report, per docs/plans/2026-11-25-revenue-and-architecture-roadmap.md:
 * revenue PRs show zero removed or changed text; refactors show nothing at all, --html
 * included. Text in llms.txt, rss.xml and search-index.json is not compared.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

import { computeBuildStamp, stampPath } from './build-stamp.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CACHE_DIR = join(ROOT, '.cache', 'copy-diff');
const SNAPSHOT_VERSION = 1;

// ---------------------------------------------------------------------------
// Text extraction
// ---------------------------------------------------------------------------

/** Never visible: code, styles, icon markup and comments. */
const INVISIBLE = /<(script|style|svg)\b[\s\S]*?<\/\1\s*>/gi;
const COMMENT = /<!--[\s\S]*?-->/g;
/** Tags that start a new line of text when rendered. Inline tags (a, strong, span) do not. */
const BLOCK_TAG =
  /<\/?(?:address|article|aside|blockquote|br|button|caption|dd|details|dialog|div|dl|dt|fieldset|figcaption|figure|footer|form|h[1-6]|header|hr|label|legend|li|main|nav|ol|option|p|pre|section|summary|table|tbody|td|tfoot|th|thead|tr|ul)\b[^>]*>/gi;
const IMG = /<img\b[^>]*>/gi;
const ANY_TAG = /<[^>]+>/g;

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  mdash: '—', ndash: '–', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  copy: '©', reg: '®', trade: '™', times: '×', middot: '·', bull: '•', deg: '°',
};

export function decodeEntities(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === '#') {
      const code = body[1] === 'x' || body[1] === 'X' ? parseInt(body.slice(2), 16) : Number(body.slice(1));
      return Number.isFinite(code) ? String.fromCodePoint(code) : match;
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match;
  });
}

function attrValue(tag: string, name: string): string | undefined {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, 'i'));
  return m ? (m[1] ?? m[2]) : undefined;
}

function clean(text: string): string {
  return decodeEntities(text).replace(/\s+/g, ' ').trim();
}

/** Title and descriptions: copy that search and social show, though not on the page. */
function headSegments(head: string): string[] {
  const out: string[] = [];
  const title = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  if (title && clean(title)) out.push(`[title] ${clean(title)}`);
  for (const key of ['description', 'og:title', 'og:description']) {
    const re = new RegExp(`<meta\\b[^>]*(?:name|property)=["']${key}["'][^>]*>`, 'i');
    const tag = head.match(re)?.[0];
    const content = tag ? attrValue(tag, 'content') : undefined;
    if (content && clean(content)) out.push(`[${key}] ${clean(content)}`);
  }
  return out;
}

/**
 * The visible text of a built page, one entry per rendered block (a paragraph, a
 * heading, a list item, a button). Image alt text is an entry of its own, marked
 * `[alt]`; head copy is marked `[title]`, `[description]`, `[og:…]`.
 */
export function extractText(html: string): string[] {
  const bodyStart = html.search(/<body\b/i);
  const head = bodyStart === -1 ? '' : html.slice(0, bodyStart);
  const body = bodyStart === -1 ? html : html.slice(bodyStart);

  // Blocks are separated by a sentinel, not '\n': a line break inside a paragraph's
  // source is ordinary whitespace and must not split the paragraph in two.
  const BREAK = '\u0000';
  const text = body
    .replace(COMMENT, '')
    .replace(INVISIBLE, BREAK)
    .replace(IMG, (tag) => {
      const alt = clean(attrValue(tag, 'alt') ?? '');
      return alt ? `${BREAK}[alt] ${alt}${BREAK}` : '';
    })
    .replace(BLOCK_TAG, BREAK)
    .replace(ANY_TAG, '');

  const blocks = text.split(BREAK).map(clean).filter(Boolean);
  return [...headSegments(head), ...blocks];
}

// ---------------------------------------------------------------------------
// HTML normalization (for --html)
// ---------------------------------------------------------------------------

/**
 * Removes build noise that is not a real change: content-hashed asset names (they
 * change whenever any bundled file does) and Astro's scope ids (derived from the
 * component's file path, so moving a component renames them on every page).
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/data-astro-cid-[a-z0-9]+/g, 'data-astro-cid')
    .replace(/(\/_assets\/[^"'\s)?#,]+)\.[A-Za-z0-9_-]{6,}(\.[a-z0-9]+)(?=["'\s)?#,])/g, '$1$2');
}

/** One tag per line, so an HTML diff shows the element that changed. */
export function htmlLines(html: string): string[] {
  return html.replace(/>\s*</g, '>\n<').split('\n').map((line) => line.trim()).filter(Boolean);
}

// ---------------------------------------------------------------------------
// Diffing
// ---------------------------------------------------------------------------

export interface ChangedSegment {
  before: string;
  after: string;
}

export interface SegmentDiff {
  removed: string[];
  added: string[];
  changed: ChangedSegment[];
  moved: string[];
}

function words(text: string): Set<string> {
  return new Set(text.toLowerCase().match(/[\p{L}\p{N}']+/gu) ?? []);
}

/** Share of words two blocks have in common (Jaccard). */
export function similarity(a: string, b: string): number {
  const wa = words(a);
  const wb = words(b);
  if (wa.size === 0 && wb.size === 0) return 1;
  let shared = 0;
  for (const w of wa) if (wb.has(w)) shared++;
  return shared / (wa.size + wb.size - shared);
}

/** At or above this, a removed block and an added block count as one edited block. */
export const CHANGED_THRESHOLD = 0.5;

/** Entries of the longest common subsequence are "in place"; the rest moved. */
function movedEntries(before: string[], after: string[]): string[] {
  let start = 0;
  while (start < before.length && start < after.length && before[start] === after[start]) start++;
  let endB = before.length;
  let endA = after.length;
  while (endB > start && endA > start && before[endB - 1] === after[endA - 1]) {
    endB--;
    endA--;
  }
  const b = before.slice(start, endB);
  const a = after.slice(start, endA);
  if (b.length === 0) return [];

  // Classic LCS table over the differing middle, which is small in practice.
  const cols = a.length + 1;
  const table = new Uint32Array((b.length + 1) * cols);
  for (let i = b.length - 1; i >= 0; i--) {
    for (let j = a.length - 1; j >= 0; j--) {
      table[i * cols + j] =
        b[i] === a[j] ? table[(i + 1) * cols + j + 1] + 1 : Math.max(table[(i + 1) * cols + j], table[i * cols + j + 1]);
    }
  }
  const inPlace = new Set<number>();
  let i = 0;
  let j = 0;
  while (i < b.length && j < a.length) {
    if (b[i] === a[j]) {
      inPlace.add(j);
      i++;
      j++;
    } else if (table[(i + 1) * cols + j] >= table[i * cols + j + 1]) i++;
    else j++;
  }
  return a.filter((_, index) => !inPlace.has(index));
}

/**
 * Compares two pages' text blocks as multisets (a repeated "Check price" button is
 * counted, not collapsed), then:
 *  - pairs each removed block with its most similar added block as "changed";
 *  - reports blocks present in both but out of order as "moved".
 */
export function diffSegments(before: string[], after: string[]): SegmentDiff {
  const surplus = new Map<string, number>();
  for (const s of before) surplus.set(s, (surplus.get(s) ?? 0) + 1);
  for (const s of after) surplus.set(s, (surplus.get(s) ?? 0) - 1);

  const removedAll: string[] = [];
  const keptBefore: string[] = [];
  const left = new Map(surplus);
  for (const s of before) {
    const n = left.get(s) ?? 0;
    if (n > 0) {
      removedAll.push(s);
      left.set(s, n - 1);
    } else keptBefore.push(s);
  }
  const addedAll: string[] = [];
  const keptAfter: string[] = [];
  for (const s of after) {
    const n = left.get(s) ?? 0;
    if (n < 0) {
      addedAll.push(s);
      left.set(s, n + 1);
    } else keptAfter.push(s);
  }

  const changed: ChangedSegment[] = [];
  const pairedAdded = new Set<number>();
  const removed: string[] = [];
  for (const r of removedAll) {
    let best = -1;
    let bestScore = CHANGED_THRESHOLD;
    addedAll.forEach((a, index) => {
      if (pairedAdded.has(index)) return;
      const score = similarity(r, a);
      if (score >= bestScore) {
        best = index;
        bestScore = score;
      }
    });
    if (best === -1) removed.push(r);
    else {
      pairedAdded.add(best);
      changed.push({ before: r, after: addedAll[best] });
    }
  }
  const added = addedAll.filter((_, index) => !pairedAdded.has(index));

  return { removed, added, changed, moved: movedEntries(keptBefore, keptAfter) };
}

export function isEmptyDiff(diff: SegmentDiff): boolean {
  return !diff.removed.length && !diff.added.length && !diff.changed.length && !diff.moved.length;
}

// ---------------------------------------------------------------------------
// Snapshots
// ---------------------------------------------------------------------------

export interface PageSnapshot {
  text: string[];
  html: string;
}

export interface Snapshot {
  version: number;
  label: string;
  createdAt: string;
  pages: Record<string, PageSnapshot>;
}

/** `cooling/index.html` → `/cooling/`; `404.html` → `/404.html`. */
export function routeOf(rel: string): string {
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return `/${rel.slice(0, -'index.html'.length)}`;
  return `/${rel}`;
}

function htmlFiles(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) htmlFiles(full, out);
    else if (entry.name.endsWith('.html')) out.push(full);
  }
  return out;
}

/** Astro's redirect stubs carry no content of their own. */
const REDIRECT_STUB = /http-equiv=['"]refresh['"]/i;

export function snapshotDist(distDir: string, label: string): Snapshot {
  const pages: Record<string, PageSnapshot> = {};
  for (const file of htmlFiles(distDir).sort()) {
    const html = readFileSync(file, 'utf8');
    if (REDIRECT_STUB.test(html)) continue;
    pages[routeOf(relative(distDir, file).split('\\').join('/'))] = {
      text: extractText(html),
      html: normalizeHtml(html),
    };
  }
  return { version: SNAPSHOT_VERSION, label, createdAt: new Date().toISOString(), pages };
}

// ---------------------------------------------------------------------------
// Comparison and report
// ---------------------------------------------------------------------------

export interface PageGroup {
  routes: string[];
  diff: SegmentDiff;
}

export interface HtmlChange {
  route: string;
  removed: string[];
  added: string[];
}

export interface Comparison {
  baseLabel: string;
  headLabel: string;
  compared: number;
  pagesAdded: string[];
  pagesRemoved: string[];
  textGroups: PageGroup[];
  htmlChanges: HtmlChange[] | null;
}

export function compareSnapshots(base: Snapshot, head: Snapshot, options: { html?: boolean } = {}): Comparison {
  const baseRoutes = Object.keys(base.pages);
  const headRoutes = Object.keys(head.pages);
  const headSet = new Set(headRoutes);
  const baseSet = new Set(baseRoutes);
  const common = baseRoutes.filter((route) => headSet.has(route)).sort();

  // Identical change sets are grouped, so a footer edit reads as one entry.
  const groups = new Map<string, PageGroup>();
  const htmlChanges: HtmlChange[] = [];
  for (const route of common) {
    const before = base.pages[route];
    const after = head.pages[route];
    const sameText = before.text.length === after.text.length && before.text.every((s, i) => s === after.text[i]);
    if (!sameText) {
      const diff = diffSegments(before.text, after.text);
      if (!isEmptyDiff(diff)) {
        const key = JSON.stringify(diff);
        const group = groups.get(key);
        if (group) group.routes.push(route);
        else groups.set(key, { routes: [route], diff });
      }
    }
    if (options.html && before.html !== after.html) {
      const lines = diffSegments(htmlLines(before.html), htmlLines(after.html));
      htmlChanges.push({
        route,
        removed: [...lines.removed, ...lines.changed.map((c) => c.before)],
        added: [...lines.added, ...lines.changed.map((c) => c.after)],
      });
    }
  }

  return {
    baseLabel: base.label,
    headLabel: head.label,
    compared: common.length,
    pagesAdded: headRoutes.filter((route) => !baseSet.has(route)).sort(),
    pagesRemoved: baseRoutes.filter((route) => !headSet.has(route)).sort(),
    textGroups: [...groups.values()],
    htmlChanges: options.html ? htmlChanges : null,
  };
}

export function countTextChanges(comparison: Comparison) {
  let removed = 0;
  let changed = 0;
  let added = 0;
  let moved = 0;
  for (const { routes, diff } of comparison.textGroups) {
    removed += diff.removed.length * routes.length;
    changed += diff.changed.length * routes.length;
    added += diff.added.length * routes.length;
    moved += diff.moved.length * routes.length;
  }
  return { removed, changed, added, moved };
}

/** Removed or changed text, removed pages, or (with --html) any HTML change. */
export function hasViolations(comparison: Comparison): boolean {
  const { removed, changed } = countTextChanges(comparison);
  return removed > 0 || changed > 0 || comparison.pagesRemoved.length > 0 || Boolean(comparison.htmlChanges?.length);
}

const MAX_ITEMS = 15;
const MAX_CHARS = 240;

function short(text: string): string {
  return text.length > MAX_CHARS ? `${text.slice(0, MAX_CHARS - 1)}…` : text;
}

function quoteList(title: string, items: string[], lines: string[]) {
  if (!items.length) return;
  lines.push(`**${title} (${items.length})**`, '');
  for (const item of items.slice(0, MAX_ITEMS)) lines.push(`- ${short(item)}`);
  if (items.length > MAX_ITEMS) lines.push(`- … and ${items.length - MAX_ITEMS} more`);
  lines.push('');
}

function routeList(routes: string[]): string {
  const shown = routes.slice(0, 5).map((r) => `\`${r}\``).join(', ');
  return routes.length > 5 ? `${shown} and ${routes.length - 5} more` : shown;
}

export function formatReport(comparison: Comparison): string {
  const counts = countTextChanges(comparison);
  const changedPages = comparison.textGroups.reduce((n, g) => n + g.routes.length, 0);
  const lines: string[] = [`## Copy diff: \`${comparison.baseLabel}\` → \`${comparison.headLabel}\``, ''];

  lines.push(
    `${comparison.compared} pages compared · ${changedPages} with text changes · ` +
      `${comparison.pagesAdded.length} added · ${comparison.pagesRemoved.length} removed`,
    '',
  );
  lines.push(
    counts.removed || counts.changed
      ? `**Written content changed:** ${counts.removed} blocks removed, ${counts.changed} edited.`
      : '**No written content removed or edited.**',
    `Added blocks: ${counts.added}. Moved blocks: ${counts.moved}.`,
    '',
  );

  if (comparison.pagesRemoved.length) lines.push(`**Pages removed:** ${routeList(comparison.pagesRemoved)}`, '');
  if (comparison.pagesAdded.length) lines.push(`**Pages added:** ${routeList(comparison.pagesAdded)}`, '');

  for (const { routes, diff } of comparison.textGroups) {
    lines.push(`### ${routeList(routes)}`, '');
    if (diff.changed.length) {
      lines.push(`**Edited (${diff.changed.length})**`, '');
      for (const { before, after } of diff.changed.slice(0, MAX_ITEMS)) {
        lines.push(`- before: ${short(before)}`, `  after: ${short(after)}`);
      }
      if (diff.changed.length > MAX_ITEMS) lines.push(`- … and ${diff.changed.length - MAX_ITEMS} more`);
      lines.push('');
    }
    quoteList('Removed', diff.removed, lines);
    quoteList('Added', diff.added, lines);
    quoteList('Moved', diff.moved, lines);
  }

  if (comparison.htmlChanges) {
    lines.push('### HTML', '');
    if (!comparison.htmlChanges.length) lines.push('No HTML changes.', '');
    for (const change of comparison.htmlChanges.slice(0, 30)) {
      lines.push(`\`${change.route}\``, '', '```diff');
      for (const line of change.removed.slice(0, MAX_ITEMS)) lines.push(`- ${short(line)}`);
      for (const line of change.added.slice(0, MAX_ITEMS)) lines.push(`+ ${short(line)}`);
      const hidden = Math.max(0, change.removed.length - MAX_ITEMS) + Math.max(0, change.added.length - MAX_ITEMS);
      if (hidden) lines.push(`  … and ${hidden} more lines`);
      lines.push('```', '');
    }
    if (comparison.htmlChanges.length > 30) lines.push(`… and ${comparison.htmlChanges.length - 30} more pages.`, '');
  }

  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function git(args: string[], cwd = ROOT): string {
  const result = spawnSync('git', args, { cwd, encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`git ${args.join(' ')} failed: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

function readSnapshot(path: string): Snapshot {
  const snapshot = JSON.parse(readFileSync(path, 'utf8')) as Snapshot;
  if (snapshot.version !== SNAPSHOT_VERSION) {
    throw new Error(`${relative(ROOT, path)} is an old snapshot format. Take it again.`);
  }
  return snapshot;
}

function writeSnapshot(path: string, snapshot: Snapshot) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(snapshot));
}

/** Builds `ref` in a throwaway worktree and snapshots it, cached by commit. */
function snapshotRef(ref: string): Snapshot {
  const sha = git(['rev-parse', '--verify', `${ref}^{commit}`]);
  const cached = join(CACHE_DIR, `${sha}.json`);
  if (existsSync(cached)) {
    console.error(`[copy-diff] using cached snapshot of ${ref} (${sha.slice(0, 8)})`);
    return readSnapshot(cached);
  }

  if (git(['diff', '--name-only', sha, '--', 'bun.lock'])) {
    console.error(`[copy-diff] warning: bun.lock differs from ${ref}; the base builds with this tree's node_modules.`);
  }

  // Inside the repo (under the gitignored .cache/), so the base build finds this
  // tree's node_modules by the normal upward lookup. A symlinked node_modules does
  // not work: Astro resolves components through the real path and loses track of them.
  mkdirSync(CACHE_DIR, { recursive: true });
  const dir = mkdtempSync(join(CACHE_DIR, 'worktree-'));
  console.error(`[copy-diff] building ${ref} (${sha.slice(0, 8)}) in a temporary worktree...`);
  git(['worktree', 'add', '--detach', dir, sha]);
  try {
    const build = spawnSync('bun', ['run', 'build'], {
      cwd: dir,
      stdio: ['ignore', 'ignore', 'inherit'],
      env: { ...process.env, INDEXNOW_DRY_RUN: 'true' },
    });
    if (build.status !== 0) throw new Error(`building ${ref} failed (exit ${build.status}).`);
    const snapshot = snapshotDist(join(dir, 'dist'), `${ref} (${sha.slice(0, 8)})`);
    writeSnapshot(cached, snapshot);
    return snapshot;
  } finally {
    spawnSync('git', ['worktree', 'remove', '--force', dir], { cwd: ROOT });
    rmSync(dir, { recursive: true, force: true });
  }
}

function headLabel(): string {
  const sha = git(['rev-parse', '--short', 'HEAD']);
  const dirty = git(['status', '--porcelain', '--', 'src', 'public', 'astro.config.mjs']) ? ', uncommitted changes' : '';
  return `working tree (${sha}${dirty})`;
}

function main() {
  const argv = process.argv.slice(2);
  const option = (name: string) => {
    const i = argv.indexOf(name);
    return i === -1 ? undefined : argv[i + 1];
  };
  const flag = (name: string) => argv.includes(name);
  const distDir = join(ROOT, 'dist');
  const snapshotPath = option('--snapshot') ? join(ROOT, option('--snapshot')!) : join(CACHE_DIR, 'snapshot.json');

  if (!existsSync(join(distDir, 'index.html'))) throw new Error('dist/ is missing. Run `bun run build` first.');
  if (!flag('--allow-stale')) {
    const built = existsSync(stampPath) ? readFileSync(stampPath, 'utf8').trim() : '';
    if (built !== computeBuildStamp()) {
      throw new Error('dist/ is stale or has no build stamp. Run `bun run build` first, or pass --allow-stale.');
    }
  }

  if (flag('--save')) {
    writeSnapshot(snapshotPath, snapshotDist(distDir, `snapshot of ${headLabel()}`));
    console.log(`[copy-diff] saved ${relative(ROOT, snapshotPath)}`);
    return;
  }

  const baseRef = option('--base');
  let base: Snapshot;
  if (baseRef) base = snapshotRef(baseRef);
  else if (existsSync(snapshotPath)) base = readSnapshot(snapshotPath);
  else throw new Error(`No snapshot at ${relative(ROOT, snapshotPath)}. Pass --base <ref>, or run with --save on the base first.`);

  const comparison = compareSnapshots(base, snapshotDist(distDir, headLabel()), { html: flag('--html') });
  const report = formatReport(comparison);
  console.log(report);
  const out = option('--out');
  if (out) writeFileSync(join(ROOT, out), `${report}\n`);
  if (flag('--strict') && hasViolations(comparison)) process.exitCode = 1;
}

if (import.meta.main) {
  try {
    main();
  } catch (error) {
    console.error(`[copy-diff] ${(error as Error).message}`);
    process.exitCode = 1;
  }
}
