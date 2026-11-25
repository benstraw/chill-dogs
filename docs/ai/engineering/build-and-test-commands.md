---
title: Build and Test Commands
type: canonical
domain: engineering
status: active
updated: 2026-11-25
tags:
  - chill-dogs
  - engineering
  - build
  - test
  - commands
related:
  - architecture.md
  - routes-and-sitemap.md
  - seo-and-schema.md
  - environment-and-integrations.md
---

# Build and Test Commands

All scripts that exist in `package.json` — what they do, when to run them, and which require environment variables.

## Use this when

You need to know which command to run before finishing a task, or what a script does.

---

## Commands

### `bun run dev`

Starts the local development server at `localhost:4321`.

Use for active development. Does not run the pre-build or post-build pipeline scripts. OG images and watermarked images are not regenerated in dev mode.

**Env vars needed:** None required; PostHog will not fire without `PUBLIC_POSTHOG_KEY` but the site works without it.

---

### `bun run build`

Full production build. Runs all three pipeline phases:

1. **Pre-build:** `watermark-images.mjs` (watermarks original photos) → `generate-og-images.mjs` (generates OG images for every eligible route)
2. **Astro build:** outputs static HTML to `dist/`
3. **Post-build:** `apply-first-page-image-og.mjs` → `apply-sitemap-share-preview.mjs` → `build-stamp.mjs` (records which inputs `dist/` was built from) → `indexnow-submit.mjs`

**Run before:** the dist test tier (it reads `dist/`), deploying, or verifying final output.

**Env vars needed:** `PUBLIC_SITE_URL` for OG image and canonical URL generation. `INDEXNOW_KEY` for the post-build IndexNow submission (skips gracefully if not set).

---

### `bun run preview`

Previews the built site from `dist/`. Run after `bun run build` to verify the production output locally.

---

### Test tiers

The suite is split into two Vitest projects (`vitest.config.ts`):

| Tier | Files | Needs `dist/` | Command |
|---|---|---|---|
| `unit` | `src/__tests__/*.test.ts` | No. Also no network, no git writes, no child processes beyond one CLI smoke spawn | `bun run test:unit` |
| `dist` | `src/__tests__/dist/*.test.ts` | Yes, current | `bun run test:dist` |

- **Missing or stale `dist/` fails loudly.** The dist tier's global setup (`src/__tests__/dist/global-setup.ts`) refuses to run when `dist/` is missing, has fewer than 200 pages, or was built from different inputs. Freshness is a content hash of `src/`, `public/` and the build config, written by `scripts/build-stamp.mjs` at the end of `bun run build` to `.cache/dist-build-stamp`. Set `ALLOW_STALE_DIST=1` to skip only the freshness check.
- **Site-wide rules go in `src/__tests__/dist/site-sweep.test.ts`.** It reads every built page once and runs each rule as a visitor over it. Add a visitor there rather than a new walk of `dist/`. Helpers for anchors, attributes, meta tags and JSON-LD are in `src/__tests__/helpers/dist.ts`; use string scanning, not a DOM.
- **Tests run in the `node` environment.** A file that needs a DOM opts in with `// @vitest-environment happy-dom` on its first line.
- **`astro:content` is mocked with the real article frontmatter** (`src/__mocks__/astro-content.ts`), so unit tests see the actual articles.
- **Source rules go in `src/__tests__/content-guardrails.test.ts`.** It reads the source tree once: American English, vet-authority language, route constants, "hub", card primitives, `DisclosureBar`.
- **Rules that shipped code already breaks use a ratchet** (`src/__tests__/helpers/ratchet.ts`, lists in `src/__tests__/allowlists/`). A violation not on the list fails; a listed one that no longer occurs prints a warning so you can delete it. Keys are `file :: literal`, never line numbers. Fix entries; never add them.
- **Unit tests are hermetic.** `src/__tests__/setup/hermetic.ts` makes `fetch` throw and strips ambient merchant credentials and proxy variables. Inject `fetchImpl`, or stub `fetch` and call `vi.unstubAllGlobals()` in `afterEach`.
- **A new guard must be shown to fail.** Make a temporary violation, see the test fail, revert.
- **Assert invariants, not snapshots.** "Every strip link is tracked and resolves", not "this page links to these five URLs". The exception is public URL stability (route constants, product ids), where pinning the value is the point.
- **Speed is tracked.** See [`test-timings/test-timings.md`](test-timings/test-timings.md). Nothing gets slower without a reason written in the PR.

---

### `bun run test`

Builds, then runs both tiers (`bun run build && vitest run`). CI does the same.

Run this before finishing any substantive page or module change.

---

### `bun run test:unit`

The unit tier only. Runs in about 3 s and needs no build, so it's the fast loop while editing data, utils or scripts.

---

### `bun run test:dist`

The dist tier only, against the current `dist/`. Fails if `dist/` is missing or stale; run `bun run build` first.

---

### `bun run test:smoke`

Page-level HTML checks (`src/__tests__/dist/site-smoke.test.ts`). Builds first **only if `dist/` is missing or stale** (`BUILD_IF_STALE=1`), otherwise reuses it, so a repeat run takes about 2 s.

Use this for a fast check when only page-level HTML structure is affected.

---

### `bun run test:timing`

Measures the build and each test tier (median of 3 after a warm-up) and compares against a saved snapshot. See [`test-timings/test-timings.md`](test-timings/test-timings.md).

---

### `bun run test:coverage`

Runs Vitest with coverage reporting. Coverage target is ≥90% statement coverage for `src/utils/**` and `src/scripts/**`.

Use when adding or modifying utility functions, scripts, or data modules.

---

### `bun run check:asins`

Checks that all product ASINs are still live on Amazon. Runs `scripts/check-asin-validity.ts`.

**Run after:** Adding new products, updating product data files, or whenever you want to verify affiliate links are not broken.

```bash
bun run check:asins            # All products
bun run check:asins -- --quiet # Issues only
```

**Env vars needed:** None. This checks Amazon product pages directly.

Results split into two kinds, because they call for different responses:

- **Dead links** (`REMOVED`, `UNAVAILABLE`, `ERROR n`) — the product is gone or unbuyable. Fix the product record.
- **Inconclusive** (`RATE LIMITED`, `UNKNOWN`, `FETCH ERROR`) — Amazon would not answer. Says nothing about the product. Retried twice with backoff under a 5-minute global budget before being recorded.

Exits 1 on any dead link, and also when more than 25% of results are inconclusive — a run that could not see Amazon has not verified anything, and reporting it as a pass would be worse than reporting nothing. Amazon throttles unauthenticated traffic from shared CI runner IPs, so the inconclusive path is normal there, not a bug.

**Runs in a proxied agent container** on current Bun, as long as `www.amazon.com` is allowlisted, though Amazon serves most container requests a CAPTCHA, so results are mostly inconclusive. Older Bun (1.3.11) could not use the agent proxy, and the session-start hook flags it as `no-proxy` if that comes back. See [`environment-and-integrations.md`](environment-and-integrations.md).

---

### `bun run check:amazon`

Checks local Amazon provider cache coverage and freshness. Runs `scripts/check-amazon-freshness.ts`.

**Run after:** Adding products, fetching Amazon metadata, backfilling the cache manifest, or auditing product cache drift.

```bash
bun run check:amazon
bun run check:amazon -- --days 120
```

Default threshold is 90 days and the command is warning-only. It reports missing raw cache files, missing manifest entries, stale entries, malformed cache payloads, title/image drift, and extra cache files not referenced by the current catalog.

**Env vars needed:** None. This reads local cache files only.

---

### `bun run indexnow:submit`

Manually submits all site URLs to the IndexNow API. This also runs automatically at the end of `bun run build`.

Use for manual re-submission after a batch of content changes.

**Env vars needed:** `INDEXNOW_KEY`

---

### `bun run check:ai-docs`

Validates the AI knowledge graph in `docs/ai/`. Checks:
- All `.md` files have frontmatter that parses as YAML
- Required frontmatter keys are present and non-empty (`title`, `type`, `domain`, `status`, `updated`, `tags`, `related`)
- Each file has `## Use this when` and `## Related knowledge` sections (`type: plan` uses `## Context`)
- `related:` entries resolve to existing files, relative to the doc's own directory
- Relative Markdown links resolve, **including their `#anchors`**

Run after adding or modifying files in `docs/ai/`. Takes an optional directory argument (`node scripts/validate-ai-docs.mjs <dir>`), which is how its own test suite drives it.

It is built to be lenient about legitimate Markdown variation, so that a failure means real rot rather than a style disagreement:

- Fenced code blocks are stripped before anything is extracted, so a doc that *demonstrates* a link, a heading, or frontmatter never has the example validated as real.
- Anchors match GitHub's slug algorithm — formatting and punctuation stripped, repeated headings suffixed `-1`, `-2` — and also accept explicit `{#custom-id}` and `<a id="…">` anchors.
- A mistyped anchor gets a "did you mean" suggestion rather than a bare failure.

`src/__tests__/validate-ai-docs.test.ts` pins both directions: that it catches rot, and that the cases above do not trip it. Add a case there before tightening a rule — a doc linter that cries wolf gets disabled, and then nothing is checked at all.

---

### `bun run fetch:chewy`

Pulls Chewy product metadata from the Impact catalog API. Runs `scripts/fetch-chewy-data.ts`.

Data written by this script is **diagnostic only** — canonical product copy, image choices, and merchant offers stay hand-edited in `src/data/products/`. Never let a fetch overwrite editorial copy.

```bash
bun run fetch:chewy --search "cooling mat"
bun run fetch:chewy --item-id 12345
bun run fetch:chewy --stale --days 60   # Refresh only stale cache entries
bun run fetch:chewy --clear-cache
```

**Env vars needed:** `IMPACT_ACCOUNT_SID`, `CHEWY_IMPACT_CAMPAIGN_ID`, and `IMPACT_AUTH_TOKEN` unless a cloud environment API credential supplies Impact auth (see [Impact auth](environment-and-integrations.md#impact-auth)). Optional `CHEWY_IMPACT_CATALOG_ID` sets a default for `--catalog-id`.

---

### `bun run chewy-link`

Mints Chewy affiliate tracking links through Impact. Runs `scripts/chewy-link.ts`.

```bash
bun run chewy-link --url https://www.chewy.com/dp/12345
bun run chewy-link:verify          # Confirm Impact credentials resolve
bun run chewy-link:csv input.csv   # Batch-convert a CSV of Chewy URLs
```

**Env vars needed:** `IMPACT_ACCOUNT_SID`, `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID`, and `IMPACT_AUTH_TOKEN` unless a cloud environment API credential supplies Impact auth (see [Impact auth](environment-and-integrations.md#impact-auth)). Setting `CHEWY_IMPACT_BASE_URL` to a pre-resolved tracking base skips the Impact API round trip.

---

### `scripts/fetch-amazon-data.ts`

Fetches Amazon product metadata into the local provider cache. Not wired to a `package.json` script — invoke it directly:

```bash
bun run scripts/fetch-amazon-data.ts --help
```

Like the Chewy fetch, output is diagnostic only and must not auto-overwrite product copy or images. Verify results afterwards with `bun run check:amazon`.

**Env vars needed:** `SERP_API_KEY` (preferred, 250 free searches/month) or `SEARCHAPI_KEY` (backup, 100/month). The script picks whichever is set.

---

### `bun run og:gen` / `bun run og:force`

Generates product-style OG share images via Satori. `og:force` regenerates images that already exist.

Generated files land in `public/og/`, which is gitignored except for product-style JPGs that are committed deliberately with `git add -f`.

**Env vars needed:** None. `PUBLIC_SITE_URL` affects the URLs baked into the images.

---

## When to run what

| Change type | Command |
|---|---|
| Substantive page or module change | `bun run test` (includes build) |
| Page-level HTML only | `bun run test:smoke` |
| Added or changed utilities/scripts/data | `bun run test:coverage` |
| Added or changed products | `bun run check:amazon` and `bun run check:asins` |
| Added or changed `docs/ai/` files | `bun run check:ai-docs` |
| Verify final production output | `bun run build && bun run preview` |
| A script fails on a missing key or a network error | [`environment-and-integrations.md`](environment-and-integrations.md) |

---

## Pre-commit hook

The git pre-commit hook runs automatically:

```bash
bun run test && bun run test:smoke
```

Commits are blocked if tests fail. Fix the issue before retrying — do not skip the hook.

---

## Test file locations

- `src/__tests__/` — all Vitest test files
- `src/__mocks__/astro-content.ts` — stub for `astro:content` virtual module (allows utils to be tested outside Astro build context)
- Coverage target: ≥90% statement coverage for `src/utils/**` and `src/scripts/**`

---

## Related knowledge

- [`architecture.md`](architecture.md) — Build pipeline details and file structure
- [`routes-and-sitemap.md`](routes-and-sitemap.md) — What needs to be updated when pages change
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta constraints enforced by tests
- [`environment-and-integrations.md`](environment-and-integrations.md) — Env vars, network allowlist, CI, and session setup
