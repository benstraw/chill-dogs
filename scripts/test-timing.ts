#!/usr/bin/env bun
/**
 * Test-suite timing harness.
 *
 *   bun run test:timing                         # measure, print, write JSON to --out (optional)
 *   bun run test:timing -- --out docs/ai/engineering/test-timings/phase-1.json
 *   bun run test:timing -- --compare docs/ai/engineering/test-timings/baseline.json
 *   bun run test:timing -- --compare old.json --against new.json   # compare two saved runs
 *
 * Options:
 *   --runs N        runs per tier, median reported (default 3)
 *   --tiers a,b     subset of: build, unit, dist, full (default: all that exist)
 *   --skip-build    do not time `bun run build` (dist/ must already exist)
 *
 * Tiers are read from package.json so they follow the scripts as they evolve:
 *   build  `bun run build`
 *   unit   the `test:unit` script (vitest args after `vitest run`)
 *   dist   the `test:dist` script, when it exists
 *   full   `vitest run` (what CI runs after the build)
 *
 * Regression rule for --compare: a tier or file is a regression when it is slower
 * by MORE than 10% AND MORE than 250 ms. Both must hold, so millisecond noise on
 * tiny files and percentage noise on big ones never trip it. Exits 1 on any
 * regression. Timing is never asserted inside the test suite itself.
 */
import { spawnSync } from 'node:child_process';
import { cpus } from 'node:os';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { tmpdir } from 'node:os';

const ROOT = join(import.meta.dir, '..');
const PCT = 0.1;
const FLOOR_MS = 250;

type VitestTier = {
  wallMs: number;
  tests: number;
  files: number;
  /** vitest's own "Duration" breakdown (transform, setup, import, tests, environment), summed across workers. */
  breakdown: Record<string, number>;
  /** Per test file: time spent running its tests (vitest JSON startTime→endTime). */
  perFile: Record<string, number>;
};
type Report = {
  meta: {
    date: string;
    gitSha: string;
    cpus: number;
    cpuModel: string;
    bun: string;
    runs: number;
    note: string;
  };
  tiers: Record<string, VitestTier | { wallMs: number }>;
};

function arg(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i === -1 ? undefined : process.argv[i + 1];
}
const has = (name: string) => process.argv.includes(name);

function median(values: number[]): number {
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

function sh(cmd: string, args: string[], env: Record<string, string> = {}) {
  const t0 = performance.now();
  const res = spawnSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    env: { ...process.env, INDEXNOW_DRY_RUN: 'true', FORCE_COLOR: '0', NO_COLOR: '1', ...env },
  });
  const wallMs = performance.now() - t0;
  if (res.status !== 0) {
    process.stderr.write(res.stdout + res.stderr);
    throw new Error(`${cmd} ${args.join(' ')} exited ${res.status}`);
  }
  return { wallMs, out: (res.stdout ?? '') + (res.stderr ?? '') };
}

/** vitest args for a package.json script of the form `vitest run ...`. */
function scriptVitestArgs(script: string | undefined): string[] | undefined {
  if (!script) return undefined;
  const m = script.match(/vitest run(.*)$/);
  if (!m) return undefined;
  // Split on spaces outside single quotes, then drop the quotes.
  return (m[1].match(/'[^']*'|\S+/g) ?? []).map((a) => a.replace(/^'|'$/g, ''));
}

function parseBreakdown(out: string): Record<string, number> {
  const toMs = (v: string) => (v.endsWith('ms') ? parseFloat(v) : parseFloat(v) * 1000);
  const line = out.split('\n').find((l) => /^\s*Duration\s/.test(l));
  if (!line) return {};
  const result: Record<string, number> = {};
  const total = line.match(/Duration\s+([\d.]+m?s)/);
  if (total) result.total = toMs(total[1]);
  for (const [, key, val] of line.matchAll(/(\w+)\s+([\d.]+m?s)/g)) {
    if (key !== 'Duration') result[key] = toMs(val);
  }
  return result;
}

function runVitest(args: string[]): VitestTier {
  const dir = join(tmpdir(), `test-timing-${process.pid}`);
  mkdirSync(dir, { recursive: true });
  const outFile = join(dir, 'vitest.json');
  try {
    const { wallMs, out } = sh('bunx', [
      'vitest',
      'run',
      ...args,
      '--reporter=default',
      '--reporter=json',
      `--outputFile.json=${outFile}`,
    ]);
    const json = JSON.parse(readFileSync(outFile, 'utf8'));
    const perFile: Record<string, number> = {};
    for (const t of json.testResults) {
      perFile[relative(ROOT, t.name)] = Math.round(t.endTime - t.startTime);
    }
    return {
      wallMs,
      tests: json.numTotalTests,
      files: json.testResults.length,
      breakdown: parseBreakdown(out),
      perFile,
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

function medianTier(samples: VitestTier[]): VitestTier {
  const keys = new Set(samples.flatMap((s) => Object.keys(s.perFile)));
  const bkeys = new Set(samples.flatMap((s) => Object.keys(s.breakdown)));
  return {
    wallMs: Math.round(median(samples.map((s) => s.wallMs))),
    tests: samples[0].tests,
    files: samples[0].files,
    breakdown: Object.fromEntries(
      [...bkeys].map((k) => [k, Math.round(median(samples.map((s) => s.breakdown[k] ?? 0)))]),
    ),
    perFile: Object.fromEntries(
      [...keys].sort().map((k) => [k, Math.round(median(samples.map((s) => s.perFile[k] ?? 0)))]),
    ),
  };
}

function measure(): Report {
  const runs = Number(arg('--runs') ?? 3);
  const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
  const available: Record<string, string[] | undefined> = {
    unit: scriptVitestArgs(pkg.scripts['test:unit']),
    dist: scriptVitestArgs(pkg.scripts['test:dist']),
    full: [],
  };
  const wanted = (arg('--tiers') ?? 'build,unit,dist,full').split(',');
  const tiers: Report['tiers'] = {};

  if (wanted.includes('build') && !has('--skip-build')) {
    const samples: number[] = [];
    for (let i = 0; i < runs; i++) {
      process.stderr.write(`[timing] build run ${i + 1}/${runs}\n`);
      samples.push(sh('bun', ['run', 'build']).wallMs);
    }
    tiers.build = { wallMs: Math.round(median(samples)) };
  }

  for (const tier of ['unit', 'dist', 'full']) {
    const args = available[tier];
    if (!wanted.includes(tier) || !args) continue;
    // Warm-up run (transform cache, OS file cache) is discarded.
    process.stderr.write(`[timing] ${tier} warm-up\n`);
    runVitest(args);
    const samples: VitestTier[] = [];
    for (let i = 0; i < runs; i++) {
      process.stderr.write(`[timing] ${tier} run ${i + 1}/${runs}\n`);
      samples.push(runVitest(args));
    }
    tiers[tier] = medianTier(samples);
  }

  const git = spawnSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: ROOT, encoding: 'utf8' });
  return {
    meta: {
      date: new Date().toISOString(),
      gitSha: git.stdout.trim(),
      cpus: cpus().length,
      cpuModel: cpus()[0]?.model ?? 'unknown',
      bun: Bun.version,
      runs,
      note: 'Median of N runs after one discarded warm-up. perFile = test execution time per file (excludes import/collect).',
    },
    tiers,
  };
}

const fmt = (ms: number) => (ms >= 1000 ? `${(ms / 1000).toFixed(2)} s` : `${Math.round(ms)} ms`);

function printReport(r: Report) {
  console.log(`\nTest timing — ${r.meta.gitSha} — ${r.meta.cpus}× ${r.meta.cpuModel} — bun ${r.meta.bun} — median of ${r.meta.runs}\n`);
  console.log('| Tier | Wall | Tests | Files | import | tests | environment |');
  console.log('|---|---|---|---|---|---|---|');
  for (const [name, t] of Object.entries(r.tiers)) {
    if ('perFile' in t) {
      const b = t.breakdown;
      console.log(`| ${name} | ${fmt(t.wallMs)} | ${t.tests} | ${t.files} | ${fmt(b.import ?? b.collect ?? 0)} | ${fmt(b.tests ?? 0)} | ${fmt(b.environment ?? 0)} |`);
    } else {
      console.log(`| ${name} | ${fmt(t.wallMs)} | — | — | — | — | — |`);
    }
  }
  const full = (r.tiers.full ?? r.tiers.unit) as VitestTier | undefined;
  if (full && 'perFile' in full) {
    console.log('\nSlowest files (test execution time, full tier):\n');
    console.log('| File | Time |');
    console.log('|---|---|');
    for (const [f, ms] of Object.entries(full.perFile).sort((a, b) => b[1] - a[1]).slice(0, 10)) {
      console.log(`| ${f} | ${fmt(ms)} |`);
    }
  }
}

function isRegression(before: number, after: number) {
  return after - before > FLOOR_MS && after > before * (1 + PCT);
}

function compare(before: Report, after: Report): number {
  let regressions = 0;
  const delta = (b: number, a: number) => {
    const d = a - b;
    const pct = b ? ` (${d >= 0 ? '+' : ''}${Math.round((d / b) * 100)}%)` : '';
    return `${d >= 0 ? '+' : ''}${fmt(d)}${pct}`;
  };
  console.log(`\nCompare ${before.meta.gitSha} → ${after.meta.gitSha}\n`);
  console.log('| Tier | Before | After | Δ | Tests before → after | |');
  console.log('|---|---|---|---|---|---|');
  for (const name of new Set([...Object.keys(before.tiers), ...Object.keys(after.tiers)])) {
    const b = before.tiers[name];
    const a = after.tiers[name];
    if (!b || !a) {
      console.log(`| ${name} | ${b ? fmt(b.wallMs) : '—'} | ${a ? fmt(a.wallMs) : '—'} | new/removed tier | | |`);
      continue;
    }
    const reg = isRegression(b.wallMs, a.wallMs);
    if (reg) regressions++;
    const tests = 'tests' in b && 'tests' in a ? `${b.tests} → ${a.tests}` : '';
    console.log(`| ${name} | ${fmt(b.wallMs)} | ${fmt(a.wallMs)} | ${delta(b.wallMs, a.wallMs)} | ${tests} | ${reg ? '**SLOWER**' : ''} |`);
  }

  const bf = before.tiers.full as VitestTier | undefined;
  const af = after.tiers.full as VitestTier | undefined;
  if (bf && af && 'perFile' in bf && 'perFile' in af) {
    const rows: string[] = [];
    const added: string[] = [];
    for (const f of new Set([...Object.keys(bf.perFile), ...Object.keys(af.perFile)])) {
      const b = bf.perFile[f];
      const a = af.perFile[f];
      if (b === undefined) {
        added.push(`| ${f} | new | ${fmt(a)} | | |`);
        continue;
      }
      if (a === undefined) {
        rows.push(`| ${f} | ${fmt(b)} | removed | | |`);
        continue;
      }
      const reg = isRegression(b, a);
      if (reg) regressions++;
      if (reg || Math.abs(a - b) > 50) rows.push(`| ${f} | ${fmt(b)} | ${fmt(a)} | ${delta(b, a)} | ${reg ? '**SLOWER**' : ''} |`);
    }
    if (rows.length || added.length) {
      console.log('\nPer-file changes > 50 ms, plus new/removed files (full tier):\n');
      console.log('| File | Before | After | Δ | |');
      console.log('|---|---|---|---|---|');
      for (const r of [...rows, ...added]) console.log(r);
    }
  }
  console.log(
    regressions
      ? `\n${regressions} regression(s) (> ${PCT * 100}% and > ${FLOOR_MS} ms). Justify in the PR or fix.`
      : `\nNo regressions (threshold: > ${PCT * 100}% and > ${FLOOR_MS} ms).`,
  );
  return regressions;
}

const comparePath = arg('--compare');
const againstPath = arg('--against');
const outPath = arg('--out');

const current: Report = againstPath ? JSON.parse(readFileSync(againstPath, 'utf8')) : measure();
if (!againstPath) printReport(current);
if (outPath) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, `${JSON.stringify(current, null, 2)}\n`);
  console.log(`\nWrote ${outPath}`);
}
if (comparePath) {
  const regressions = compare(JSON.parse(readFileSync(comparePath, 'utf8')), current);
  if (regressions) process.exit(1);
}
