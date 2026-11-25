---
title: Test Suite Timings
type: canonical
domain: engineering
status: active
updated: 2026-11-25
tags:
  - chill-dogs
  - engineering
  - test
  - performance
related:
  - ../build-and-test-commands.md
---

# Test Suite Timings

Measured wall-clock numbers for the build and each test tier, recorded before and after every test-suite change. **Rule: nothing gets slower without an extremely good reason, written in the PR.**

## Use this when

- You change tests, test config, or anything the build runs, and need to show the change did not slow the suite.
- You are writing the PR body for a test-suite phase: paste the `--compare` table.

## How to measure

```bash
bun run test:timing -- --out docs/ai/engineering/test-timings/phase-N.json
bun run test:timing -- --compare docs/ai/engineering/test-timings/<previous>.json
```

- Each tier runs once as a discarded warm-up, then 3 times; the **median** is recorded.
- Tiers come from `package.json`: `build`, `unit` (`test:unit`), `dist` (`test:dist`, when it exists), `full` (`vitest run`, which is what CI runs after the build).
- `--compare` flags a regression when a tier or file is slower by **more than 10% and more than 250 ms**. Both must be exceeded, so millisecond noise never trips it. It exits 1 on any regression.
- Compare against the **previous phase**, not only the baseline. The bar only moves down.
- Measure on the same machine type as the file you compare against (see `meta` in each JSON). Shared CI runners are too noisy to gate on, so CI only reports.
- `perFile` is test execution time only. Import and environment setup are summed across workers in `breakdown` (`import`, `environment`).

## History

| Snapshot | Commit | Build | `test:unit` | `dist` | Full `vitest run` | Tests |
|---|---|---|---|---|---|---|
| [baseline.json](baseline.json) | `cb0a5d2` | 17.68 s | 6.51 s (353 tests) | — | 8.66 s | 418 |

Baseline machine: 4× Intel Xeon @ 2.10 GHz, Bun 1.4.4 (the repo pins 1.3.6; same major line), cloud container.

### Baseline observations

- `environment` setup totals 9.5 s across workers, more than the test bodies (6.4 s). Every file boots happy-dom, though only two need a DOM.
- `site-smoke.test.ts` is 3.47 s, about half of all test execution time. It walks and re-reads all 352 built pages eight times.
- `validate-ai-docs.test.ts` is 1.35 s, from spawning a `node` process per case.
- Test files sorted by speed: 2 files take 4.8 s; the other 37 take 1.6 s combined.

## Related knowledge

- [`../build-and-test-commands.md`](../build-and-test-commands.md) — What each command does
