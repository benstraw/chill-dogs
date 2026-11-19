import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Chill-Dogs is written in American English. This catches the common British
 * spellings before they ship; vocabulary and idiom still need a human reread.
 * Rule and word table: docs/ai/writing/article-writing-guide.md (American English).
 */

const ROOT = process.cwd();
const SCAN_DIRS = ['src', 'docs/ai', 'CLAUDE.md', 'AGENTS.md'];
// Provider data is diagnostic and never edited by hand.
const SKIP_DIRS = new Set(['amazon-products', 'chewy-products', 'watermarked', 'images', 'node_modules']);
const EXTENSIONS = /\.(astro|ts|tsx|mdx|md|mjs|css)$/;
// These files spell out the British forms on purpose, as the rule and its examples.
const SKIP_FILES = new Set([
  'src/__tests__/american-english.test.ts',
  'docs/ai/writing/article-writing-guide.md',
  'docs/ai/AGENT_START.md',
  'docs/ai/checklists/coding-agent-finish-checklist.md',
  'CLAUDE.md',
  'AGENTS.md',
]);

const BRITISH = new RegExp(
  '(?<![\\w/-])(' +
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
      '\\w*(?:colour|favour|behaviour|neighbour|honour|flavour|odour|harbour|labour|rumour|humour)\\w*',
      '(?:kilo|milli|centi)?metres?',
      '(?:milli)?litres?',
      'centre[sd]?',
      'fibres?',
      'theatres?',
      '\\w*(?:real|organ|recogn|synchron|normal|optim|custom|priorit|minim|maxim|summar|apolog|emphas|special|standard|util|monet|categor|final|personal|familiar|stabil|visual)is(?:e|ed|es|ing|ation|ations)',
      'analys(?:e|ed|es|ing)',
      '(?:travel|label|cancel|model|level|fuel|signal)l(?:ed|ing|ers?)',
    ].join('|') +
    ')(?![\\w-])',
  'gi',
);

function collect(target: string, out: string[] = []): string[] {
  const full = path.join(ROOT, target);
  if (statSync(full).isFile()) {
    out.push(target);
    return out;
  }
  for (const entry of readdirSync(full, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const rel = path.join(target, entry.name);
    if (entry.isDirectory()) collect(rel, out);
    else if (EXTENSIONS.test(entry.name)) out.push(rel);
  }
  return out;
}

describe('American English', () => {
  it('has no British spellings in site copy, comments, or docs', () => {
    const hits: string[] = [];
    for (const file of SCAN_DIRS.flatMap((dir) => collect(dir))) {
      if (SKIP_FILES.has(file)) continue;
      readFileSync(path.join(ROOT, file), 'utf8')
        .split('\n')
        .forEach((line, index) => {
          // URLs carry merchant slugs we do not control.
          const text = line.replace(/https?:\/\/\S+/g, '');
          for (const match of text.matchAll(BRITISH)) {
            hits.push(`${file}:${index + 1}  ${match[0]}`);
          }
        });
    }
    expect(hits, `British spellings found:\n${hits.join('\n')}`).toEqual([]);
  });
});
