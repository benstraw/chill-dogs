import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

/**
 * These tests exist to keep the validator honest in both directions: it must
 * catch genuine rot, and it must not fail docs for legitimate Markdown
 * variation. The false-positive cases matter most — a doc linter that cries
 * wolf gets disabled, and then nothing is checked at all.
 */

const SCRIPT = resolve(__dirname, '../../scripts/validate-ai-docs.mjs');

let root: string;

const frontmatter = (over: Record<string, string> = {}) => {
  const base: Record<string, string> = {
    title: 'Fixture',
    type: 'canonical',
    domain: 'engineering',
    status: 'active',
    updated: '2026-08-09',
    tags: '\n  - fixture',
    related: '\n  - target.md',
    ...over,
  };
  return ['---', ...Object.entries(base).map(([k, v]) => `${k}:${v.startsWith('\n') ? '' : ' '}${v}`), '---'].join('\n');
};

const SECTIONS = '\n## Use this when\n\nFixture.\n\n## Related knowledge\n\n- none\n';

/** Write a doc into a fresh subdirectory and validate just that directory. */
function check(files: Record<string, string>): { ok: boolean; out: string } {
  const dir = mkdtempSync(join(root, 'case-'));
  for (const [name, body] of Object.entries(files)) {
    const full = join(dir, name);
    mkdirSync(resolve(full, '..'), { recursive: true });
    writeFileSync(full, body);
  }
  try {
    const out = execFileSync('node', [SCRIPT, dir], { encoding: 'utf-8', stdio: 'pipe' });
    return { ok: true, out };
  } catch (err) {
    const e = err as { stdout?: string; stderr?: string };
    return { ok: false, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
}

/** A minimal valid doc that other cases vary from. */
const target = `${frontmatter({ related: '\n  - doc.md' })}\n\n# Target\n\n## Use this when\n\nT.\n\n## Related knowledge\n\n- none\n`;

beforeAll(() => {
  root = mkdtempSync(join(tmpdir(), 'ai-docs-validator-'));
});

afterAll(() => {
  rmSync(root, { recursive: true, force: true });
});

describe('validate-ai-docs: accepts legitimate docs', () => {
  it('passes a well-formed doc', () => {
    expect(check({ 'doc.md': frontmatter() + SECTIONS, 'target.md': target }).ok).toBe(true);
  });

  it('resolves anchors to headings containing code, formatting and punctuation', () => {
    const t = `${frontmatter({ related: '\n  - doc.md' })}\n\n## Run \`bun run build\` — carefully!\n\n## Use this when\n\nT.\n\n## Related knowledge\n\n- none\n`;
    const doc = `${frontmatter()}${SECTIONS}\n[x](./target.md#run-bun-run-build--carefully)\n`;
    expect(check({ 'doc.md': doc, 'target.md': t }).ok).toBe(true);
  });

  it('resolves the -1 suffix on a repeated heading', () => {
    const t = `${frontmatter({ related: '\n  - doc.md' })}\n\n## Notes\n\n## Notes\n\n## Use this when\n\nT.\n\n## Related knowledge\n\n- none\n`;
    const doc = `${frontmatter()}${SECTIONS}\n[a](./target.md#notes) [b](./target.md#notes-1)\n`;
    expect(check({ 'doc.md': doc, 'target.md': t }).ok).toBe(true);
  });

  it('accepts explicit {#custom-id} and HTML anchors', () => {
    const t = `${frontmatter({ related: '\n  - doc.md' })}\n\n## Heading {#custom-id}\n\n<a id="html-anchor"></a>\n\n## Use this when\n\nT.\n\n## Related knowledge\n\n- none\n`;
    const doc = `${frontmatter()}${SECTIONS}\n[a](./target.md#custom-id) [b](./target.md#html-anchor)\n`;
    expect(check({ 'doc.md': doc, 'target.md': t }).ok).toBe(true);
  });

  it('ignores links and headings inside fenced code blocks', () => {
    const doc = [
      frontmatter(),
      SECTIONS,
      '```md',
      '[an example of a broken link](./nope.md)',
      '[and a bad anchor](./target.md#nope)',
      '## Use this when',
      '```',
    ].join('\n');
    expect(check({ 'doc.md': doc, 'target.md': target }).ok).toBe(true);
  });

  it('accepts a link title and a directory target', () => {
    const doc = `${frontmatter()}${SECTIONS}\n[a](./target.md "A title") [b](./sub/)\n`;
    // The nested doc needs its own valid related: path — it resolves relative
    // to sub/, not to the root of the tree being checked.
    const nested = `${frontmatter({ related: '\n  - ../target.md' })}${SECTIONS}`;
    expect(check({ 'doc.md': doc, 'target.md': target, 'sub/other.md': nested }).ok).toBe(true);
  });

  it('accepts a plan using ## Context instead of ## Use this when', () => {
    const plan = `${frontmatter({ type: 'plan' })}\n\n## Context\n\nPlan.\n\n## Related knowledge\n\n- none\n`;
    expect(check({ 'doc.md': plan, 'target.md': target }).ok).toBe(true);
  });
});

describe('validate-ai-docs: catches rot', () => {
  it('fails a related: entry that does not resolve', () => {
    const doc = frontmatter({ related: '\n  - ./gone.md' }) + SECTIONS;
    const { ok, out } = check({ 'doc.md': doc, 'target.md': target });
    expect(ok).toBe(false);
    expect(out).toContain('related: "./gone.md" does not exist');
  });

  it('fails an anchor that is not in the target file', () => {
    const doc = `${frontmatter()}${SECTIONS}\n[x](./target.md#no-such-heading)\n`;
    const { ok, out } = check({ 'doc.md': doc, 'target.md': target });
    expect(ok).toBe(false);
    expect(out).toContain('Broken anchor');
  });

  it('suggests a near match for a mistyped anchor', () => {
    const doc = `${frontmatter()}${SECTIONS}\n[x](./target.md#use-this)\n`;
    expect(check({ 'doc.md': doc, 'target.md': target }).out).toContain('did you mean #use-this-when');
  });

  it('fails an empty required frontmatter value', () => {
    const doc = frontmatter({ title: '' }) + SECTIONS;
    const { ok, out } = check({ 'doc.md': doc, 'target.md': target });
    expect(ok).toBe(false);
    expect(out).toContain('"title" is empty');
  });

  it('fails unparseable frontmatter instead of silently skipping it', () => {
    const doc = `---\ntitle: "unclosed\ntype: [1, 2\n---\n${SECTIONS}`;
    const { ok, out } = check({ 'doc.md': doc, 'target.md': target });
    expect(ok).toBe(false);
    expect(out).toContain('not valid YAML');
  });

  it('fails a broken relative link', () => {
    const doc = `${frontmatter()}${SECTIONS}\n[x](./missing.md)\n`;
    expect(check({ 'doc.md': doc, 'target.md': target }).out).toContain('Broken link');
  });

  it('fails a missing required section', () => {
    const doc = `${frontmatter()}\n\n## Use this when\n\nNo related section.\n`;
    expect(check({ 'doc.md': doc, 'target.md': target }).out).toContain('Missing "## Related knowledge"');
  });
});
