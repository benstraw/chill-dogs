/**
 * Source-level content and code rules from CLAUDE.md, in ONE read of the source tree.
 *
 * Every rule below is a function over the same in-memory file list, so adding a rule
 * costs a regex pass, not another walk of the disk. Rules that shipped code already
 * breaks use a ratchet allowlist (src/__tests__/allowlists/): nothing new gets in, and
 * entries are removed as the old violations are fixed. Allowlist keys are
 * `file :: literal`, never line numbers, so unrelated edits do not shift them.
 */
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  CARD_PRIMITIVE_ALLOWLIST,
  HARDCODED_ROUTE_ALLOWLIST,
  HUB_TOKEN_ALLOWLIST,
  VET_LANGUAGE_ALLOWLIST,
} from './allowlists/content-guardrails';
import { expectWithinAllowlist } from './helpers/ratchet';
import { mdxParagraphProblems } from '../../scripts/lib/mdx-paragraphs';

const ROOT = path.resolve(__dirname, '../..');
// Provider data is diagnostic and never edited by hand; images are binary; the docs
// archive is a historical record and keeps the wording it had.
const SKIP_DIRS = new Set(['amazon-products', 'chewy-products', 'watermarked', 'images', 'node_modules', 'archive']);
const TEXT_FILE = /\.(astro|ts|tsx|mdx|md|mjs|css|json|ya?ml)$/;

interface SourceFile {
  file: string;
  text: string;
}

function collect(target: string, out: SourceFile[]) {
  const full = path.join(ROOT, target);
  let entries;
  try {
    entries = readdirSync(full, { withFileTypes: true });
  } catch {
    out.push({ file: target, text: readFileSync(full, 'utf8') });
    return;
  }
  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const rel = path.join(target, entry.name);
    if (entry.isDirectory()) collect(rel, out);
    else if (TEXT_FILE.test(entry.name)) out.push({ file: rel, text: readFileSync(path.join(ROOT, rel), 'utf8') });
  }
}

const all: SourceFile[] = [];
for (const target of ['src', 'docs', 'CLAUDE.md', 'AGENTS.md']) collect(target, all);

const isTest = (file: string) => file.startsWith('src/__tests__/') || file.startsWith('src/__mocks__/');
/** Site code and copy: what ships. */
const site = all.filter(({ file }) => file.startsWith('src/') && !isTest(file) && /\.(astro|ts|tsx|mdx|mjs)$/.test(file));

describe('content guardrails', () => {
  it('uses Markdown prose and safe explicit paragraphs in MDX articles', () => {
    const articles = site.filter(({ file }) => file.startsWith('src/content/articles/') && file.endsWith('.mdx'));
    expect(articles.length).toBeGreaterThan(0);
    const failures = articles.flatMap(({ file, text }) => mdxParagraphProblems(text).map((problem) => `${file}: ${problem}`));
    expect(failures, 'See docs/writing/article-writing-guide.md#mdx-paragraphs').toEqual([]);
  });

  it('reads the source tree', () => {
    expect(site.length).toBeGreaterThan(150);
    expect(all.some(({ file }) => file.startsWith('docs/'))).toBe(true);
  });

  // ── American English ──────────────────────────────────────────────────────────
  // Rule and word table: docs/writing/article-writing-guide.md (American English).
  // In Markdown, words inside `code spans` are exempt: that is how the rule docs
  // (CLAUDE.md, AGENT_START.md, the checklist) quote the British forms they forbid.
  const BRITISH = new RegExp(
    '(?<![\\w/])(' +
      [
        'maths',
        'whilst',
        'amongst',
        'learnt',
        'aluminium',
        'cosy',
        'tyres?',
        'kerbs?',
        'judgement',
        'sceptical',
        'jewellery',
        'pyjamas',
        'ageing',
        'catalogues?',
        'grey',
        'cupboards?',
        '\\w*(?:colour|favour|behaviour|neighbour|honour|flavour|odour|harbour|labour|rumour|humour)\\w*',
        '(?:kilo|milli|centi)?metres?',
        '(?:milli)?litres?',
        'centre[sd]?',
        'fibres?',
        'theatres?',
        '\\w*(?:real|organ|recogn|synchron|normal|optim|custom|priorit|minim|maxim|summar|apolog|emphas|special|standard|util|monet|categor|final|personal|familiar|stabil|visual|author|critic|memor|social|sensit|neutral|steril|tranquil|tranquill|immun|sanit|character|harmon|energ|modern)is(?:e|ed|es|er|ers|ing|ation|ations)',
        'analys(?:e|ed|es|ing)',
        '(?:travel|label|cancel|model|level|fuel|signal)l(?:ed|ing|ers?)',
        // Vocabulary, with context so the verb "lead" and "lead poisoning" pass.
        '(?:on|off)-lead',
        // Not "slip lead": that is the standard US term for the product.
        '(?:retractable|training|long)\\s+leads?',
      ].join('|') +
      ')(?![\\w])',
    'gi'
  );

  const BRITISH_ANYWHERE = new RegExp(BRITISH.source, 'i');

  const ENGLISH_EXEMPT = new Set([
    'src/__tests__/content-guardrails.test.ts',
    // The canonical word table: it lists the British forms in plain table cells.
    'docs/writing/article-writing-guide.md',
  ]);

  it('uses American spelling and vocabulary in copy, comments and docs', () => {
    const hits: string[] = [];
    for (const { file, text } of all) {
      if (ENGLISH_EXEMPT.has(file)) continue;
      // Whole-file pre-check: almost no file has a candidate word, so most skip the
      // per-line pass (this rule was the slowest in the file).
      // A separate non-global copy: .test() on the global regex would move lastIndex,
      // and matchAll below would then start mid-line and miss every hit.
      if (!BRITISH_ANYWHERE.test(text)) continue;
      const markdown = /\.mdx?$/.test(file);
      text.split('\n').forEach((line, index) => {
        // URLs carry merchant slugs we do not control.
        // Kebab-case ids and slugs with 3+ parts are public URLs (a product id like
        // dog-gone-smart-shammy-grey cannot be renamed); two-part prose compounds
        // such as "blue-grey" are still checked.
        let scan = line.replace(/https?:\/\/\S+/g, '').replace(/\b[a-z0-9]+(?:-[a-z0-9]+){2,}\b/g, '');
        if (markdown) scan = scan.replace(/`[^`]*`/g, '');
        for (const match of scan.matchAll(BRITISH)) hits.push(`${file}:${index + 1}  ${match[0]}`);
      });
    }
    expect(hits, `British spellings found:\n${hits.join('\n')}`).toEqual([]);
  });

  // ── Vet-authority language ────────────────────────────────────────────────────
  it('makes no vet-authority claims in site copy', () => {
    const VET = /\b(?:vet|veterinarian)s?[- ]?(?:approved|recommended|endorsed)\b|\bclinically[- ]proven\b/gi;
    const found = site.flatMap(({ file, text }) => Array.from(text.matchAll(VET), (m) => `${file} :: ${m[0].toLowerCase()}`));
    expectWithinAllowlist(
      found,
      VET_LANGUAGE_ALLOWLIST,
      'vet-authority claim',
      'say researched, compared, curated or popular (docs/writing/medical-and-vet-claim-guardrails.md)'
    );
  });

  // ── Route constants ───────────────────────────────────────────────────────────
  it('takes internal routes from src/data/routes.ts', () => {
    const HREF = /href(?:=\{?|:\s*)(["'`])(\/[^"'`$]*)\1/g;
    const ASSET = /\.(?:xml|png|svg|ico|jpg|jpeg|webp|webmanifest|txt|pdf|json)$/;
    const found = site
      .filter(({ file }) => file !== 'src/data/routes.ts')
      .flatMap(({ file, text }) =>
        Array.from(text.matchAll(HREF), (m) => m[2])
          .filter((href) => !ASSET.test(href))
          .map((href) => `${file} :: ${href}`)
      );
    expectWithinAllowlist(found, HARDCODED_ROUTE_ALLOWLIST, 'hardcoded route', 'import the path from ROUTES in src/data/routes.ts');
  });

  // ── Page-type vocabulary ──────────────────────────────────────────────────────
  it('does not call pages "hubs" (the type is collector)', () => {
    const HUB = /\b\w*hub\w*\b/gi;
    const ROUTE_KEY = /^(?:cooling|calming|comfort|gear)Hub$/;
    const found = new Set<string>();
    for (const { file, text } of all) {
      if (isTest(file)) continue;
      // The rule's own docs quote the word: "hub".
      const scan = text.replace(/["“]hub[,.]?["”]/gi, '');
      for (const m of scan.matchAll(HUB)) {
        if (/github/i.test(m[0])) continue;
        // The four ROUTES.*Hub keys are keyed by name: using an existing constant in
        // another file is not a new violation. Anything else is keyed by file.
        found.add(ROUTE_KEY.test(m[0]) ? m[0] : `${file} :: ${m[0].toLowerCase()}`);
      }
    }
    expectWithinAllowlist(found, HUB_TOKEN_ALLOWLIST, '"hub"', 'use "collector" (docs/strategy/metrics-and-page-types.md)');
  });

  // ── Shared primitives ─────────────────────────────────────────────────────────
  it('builds product cards from the shared primitives', () => {
    // A page or module that renders its own <img> next to an affiliate link, without
    // ProductCardShell / ProductImageFrame, is hand-rolling a product card.
    const found = site
      .filter(({ file }) => /^src\/(pages|components\/modules)\//.test(file) && /\.(astro|mdx)$/.test(file))
      .filter(({ file }) => !file.includes('/primitives/') && !file.endsWith('BrowseProductCard.astro'))
      .filter(({ text }) => /<img\b/.test(text) && /<(?:Merchant)?AffiliateLink\b/.test(text))
      .filter(({ text }) => !/ProductCardShell|ProductImageFrame/.test(text))
      .map(({ file }) => file);
    expectWithinAllowlist(
      found,
      CARD_PRIMITIVE_ALLOWLIST,
      'hand-rolled product card',
      'compose ProductCardShell, ProductImageFrame, ProductBulletList and AffiliateOfferStack'
    );
  });

  it('uses DisclosureBar for every "show more" expander', () => {
    const found = site
      .filter(({ file }) => !file.endsWith('primitives/DisclosureBar.astro'))
      .filter(({ text }) => /<summary\b/.test(text))
      .map(({ file }) => file);
    expect(found, 'use src/components/modules/primitives/DisclosureBar.astro, not a bare <summary>').toEqual([]);
  });
});
