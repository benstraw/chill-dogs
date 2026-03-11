# Test Plan

**Status:** Implemented
**Scope:** `src/utils/**`, `src/scripts/analytics.ts`, `src/data/**`, `src/__tests__/site-smoke.test.ts`
**Test runner:** Vitest 4 · Environment: happy-dom · Coverage: v8

---

## Philosophy

Test behavior, not implementation details. Focus on critical paths that protect revenue and prevent real bugs. Do not chase coverage numbers or test trivial code (one-liner filters, simple object pass-through). Every test should justify its maintenance cost.

The three questions before adding a test:

1. What bug would this catch?
2. Is there a cheaper layer to catch it?
3. Will this break when the code changes for valid reasons?

---

## Test Layers

### Unit tests (fast, deterministic)

Test non-trivial logic in isolation. Skip trivial getters, filters, and pass-through functions.

**What we test:**

- `analytics.ts` — PostHog dispatch, graceful degradation without PostHog, event delegation via `closest()`, `data-*` attribute mapping to snake_case props
- `llms.ts` — path normalization edge cases, `dedupeAndRankLinks` dedup/exclusion behavior, `buildLlmsMarkdown` output structure (maxLinks, section grouping, empty inputs)
- `og.ts` — headline derivation priority and site-suffix stripping, `clampOgText` boundary behavior (exact limit, no word boundary, normal truncation), CTA defaults and overrides, route eligibility logic
- `breadcrumbs.ts` — already fully covered, no changes needed
- `collection-helpers.ts` — already fully covered, no changes needed

**What we do NOT test:**

- `getProductsByCategory`, `getCoreProducts`, `getBonusProduct`, `getCalmingProductsByCategory` — these are one-liner `.filter()` / `.find()` calls. Testing them means testing that JavaScript's Array methods work. Bugs here would be caught immediately by the pages that consume them or by smoke tests.
- Individual `rankLlmsLink` priority tiers — implementation detail. The ranking behavior is validated through `dedupeAndRankLinks` which is the actual public API.
- `sectionForPath` exhaustive mapping — tested sufficiently through the existing integration test. Adding one case per section in a single test is enough.
- Props pass-through (empty objects, numeric values, booleans) — testing that JS passes objects is trivial.

### Data integrity tests (system boundary)

Product data is a system boundary — it's manually authored and directly drives revenue pages. Data integrity tests catch real mistakes: missing affiliate tags, incomplete product records, broken category meta.

**What we test:**

- Every `amazonUrl` in both product files contains `tag=chill-dogs-20`
- Every calming product has 3 bullets and populated `bestFor`, `howItHelps`, `considerIf`
- Every cooling category has complete meta: title, headline, intro copy, FAQs, and valid internal links

These tests are resilient to product additions/removals because they iterate over the data rather than asserting exact counts.

### Smoke tests (build + read from dist/)

Smoke tests build the site once and verify critical output. They catch integration-level regressions that unit tests can't: broken affiliate links in built HTML, missing sitemap entries, SEO misconfigurations.

**What we test:**

- Homepage renders with both pillar CTAs and correct canonical
- Affiliate links on cooling, calming, and travel converter pages have correct `rel`, `target`, `data-track`, and affiliate tag
- Collector hub pages are indexable with correct canonical URLs
- OG images are generated and referenced in meta tags
- BreadcrumbList schema appears on indexable pages, not on noindex pages
- 404 and policy pages are noindex
- Sitemap includes all content routes and excludes variant pages
- llms.txt includes all sections, key links, and excludes private/variant paths

**What we do NOT test:**

- Every single converter page — one representative per pillar is sufficient
- Styling, layout, or visual appearance
- Pages that are merely "indexable" with no other behavioral assertion (low value)

---

## Config

Coverage scope in `vitest.config.ts`: `src/utils/**`, `src/scripts/**`, `src/data/**`.

`generate-og-images.mjs` is excluded from unit coverage — it's a build script validated indirectly by smoke tests checking OG image output.

---

## Current State

10 test files, 50 tests, all passing. Suite runs in ~3 seconds.

| File | Tests | What it covers |
|---|---|---|
| `analytics.test.ts` | 6 | PostHog dispatch, degradation, delegation, attr mapping |
| `llms.test.ts` | 11 | Path normalization, dedup, exclusion, markdown output |
| `og.test.ts` | 8 | Headline derivation, clamping, CTA, eligibility |
| `breadcrumbs.test.ts` | 3 | Schema generation, special labels |
| `cooling-products.test.ts` | 2 | Affiliate tags, category meta completeness |
| `calming-products.test.ts` | 2 | Affiliate tags, display field integrity |
| `cooling-converter-pages.test.ts` | 2 | Page config completeness |
| `calming-converter-pages.test.ts` | 3 | Page config completeness |
| `routes.test.ts` | 2 | Route constants |
| `site-smoke.test.ts` | 11 | Full build validation — affiliate links, SEO, sitemap, llms.txt |
