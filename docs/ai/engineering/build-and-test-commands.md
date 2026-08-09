---
title: Build and Test Commands
type: canonical
domain: engineering
status: active
updated: 2026-05-06
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
3. **Post-build:** `apply-first-page-image-og.mjs` → `apply-content-sitemap-share-preview.mjs` → `indexnow-submit.mjs`

**Run before:** `bun run test` (the SEO meta test reads from `dist/`), deploying, or verifying final output.

**Env vars needed:** `PUBLIC_SITE_URL` for OG image and canonical URL generation. `INDEXNOW_KEY` for the post-build IndexNow submission (skips gracefully if not set).

---

### `bun run preview`

Previews the built site from `dist/`. Run after `bun run build` to verify the production output locally.

---

### `bun run test`

Runs the full Vitest test suite. **Automatically triggers `bun run build` first** because the SEO meta test (`src/__tests__/seo-meta.test.ts`) reads from `dist/`.

Run this before finishing any substantive page or module change.

**What it checks:**
- SEO meta tag length constraints (og:title 40–65 chars, og:description 100–165 chars) for every indexable page
- Unit tests for `src/utils/**`, `src/scripts/**`, `src/data/**`
- Pre-commit hook: runs `bun run test && bun run test:smoke` before every commit

---

### `bun run test:smoke`

Smoke tests only (`src/__tests__/site-smoke.test.ts`). Builds the site internally before testing.

Use this for a faster check when only page-level HTML structure is affected (not utility logic or SEO meta values).

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
- All `.md` files have YAML frontmatter
- Required frontmatter keys are present (`title`, `type`, `domain`, `status`, `updated`, `tags`, `related`)
- Each file has `## Use this when` and `## Related knowledge` sections
- Relative Markdown links resolve to existing files

Run after adding or modifying files in `docs/ai/`.

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

**Env vars needed:** `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`. Optional `CHEWY_IMPACT_CATALOG_ID` sets a default for `--catalog-id`.

---

### `bun run chewy-link`

Mints Chewy affiliate tracking links through Impact. Runs `scripts/chewy-link.ts`.

```bash
bun run chewy-link --url https://www.chewy.com/dp/12345
bun run chewy-link:verify          # Confirm Impact credentials resolve
bun run chewy-link:csv input.csv   # Batch-convert a CSV of Chewy URLs
```

**Env vars needed:** `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID`. Setting `CHEWY_IMPACT_BASE_URL` to a pre-resolved tracking base skips the Impact API round trip.

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
