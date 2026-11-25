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
bun run test:timing -- --out docs/engineering/test-timings/phase-N.json
bun run test:timing -- --compare docs/engineering/test-timings/<previous>.json
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
| [phase-1.json](phase-1.json) | Phase 1 | 16.56 s | 3.58 s (395 tests, **−45%**) | 2.47 s (69 tests) | 5.35 s (**−38%**) | 464 |
| [phase-2.json](phase-2.json) | Phase 2 | 16.51 s | 3.81 s (438 tests) | 2.27 s (79 tests) | 5.48 s | 517 |

`test:unit` changed meaning in Phase 1: the baseline figure still included two files that read `dist/`. Since Phase 1, `unit` never touches `dist/`.

Baseline machine: 4× Intel Xeon @ 2.10 GHz, Bun 1.4.4 (the repo pins 1.3.6; same major line), cloud container.

### Baseline observations

- `environment` setup totals 9.5 s across workers, more than the test bodies (6.4 s). Every file boots happy-dom, though only two need a DOM.
- `site-smoke.test.ts` is 3.47 s, about half of all test execution time. It walks and re-reads all 352 built pages eight times.
- `validate-ai-docs.test.ts` is 1.35 s, from spawning a `node` process per case.
- Test files sorted by speed: 2 files take 4.8 s; the other 37 take 1.6 s combined.

### Phase 1 observations

- `environment` setup fell from 9.5 s to 0.5 s summed. Tests default to `node`; only `analytics` and `site-smoke` boot happy-dom.
- `site-smoke` fell from 3.47 s to 1.58 s. Its eight whole-site walks became one pass in `site-sweep`, and the 1.2 MB admin catalog page is scanned as a string, not parsed as a DOM.
- `validate-ai-docs` fell from 1.35 s to 0.23 s by validating in process instead of spawning `node` per case.
- `related-pages` rose from 46 ms to 120 ms. It now runs over the 17 real articles instead of an empty collection. That's under the noise threshold, and it buys real coverage.

### Phase 2 observations

Phase 2 added 53 tests and 10 revenue and SEO rules: JSON-LD validity, offer sellers, disclosure placement, site-wide affiliate tracking, assets, redirect parity, and others. Against Phase 1, the full run is within noise (+2%) and the dist tier is faster (−8%). That's because the new dist rules ride on the existing single sweep, and these savings offset their cost:

- `site-smoke` 1.58 s → about 1.0 s: each built page is parsed with happy-dom once, not once per test (the homepage was parsed eight times).
- The American English rule pre-checks each whole file before splitting it into lines. Its first version shared a global regex between the pre-check and the line scan and silently missed every hit; the mutation check caught it.
- Redirects moved from `astro.config.mjs` into `src/data/redirects.ts`. Importing the Astro config cost about 1 s per test file.
- `merchant-images` parses the 15 MB Amazon cache once instead of twice; `validate-ai-docs` keeps one CLI spawn (the failure path) instead of two.

Tier-level noise on this machine is about ±300 ms between back-to-back runs (`unit` read 3.50 s and 3.81 s for nearly identical code), which is why the regression rule needs both >10% and >250 ms.

## Related knowledge

- [`../build-and-test-commands.md`](../build-and-test-commands.md) — What each command does
