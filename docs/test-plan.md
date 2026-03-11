# Test Plan — Unit & Smoke Testing

**Status:** Draft — awaiting review before implementation  
**Scope:** `src/utils/**`, `src/scripts/analytics.ts`, `src/data/**`, `src/__tests__/site-smoke.test.ts`  
**Test runner:** Vitest 4 · Environment: happy-dom · Coverage: v8

---

## 1. Coverage Baseline (current)

The coverage configuration in `vitest.config.ts` currently only includes `src/utils/**` and `src/scripts/**`. The refactor introduced two new data-helper files in `src/data/` that are **not yet in scope** and have zero coverage.

### Currently tracked (utils + scripts)

| File | Stmts | Branch | Funcs | Notes |
|---|---|---|---|---|
| `scripts/analytics.ts` | 94% | 89% | 100% | 3 uncovered branches |
| `scripts/generate-og-images.mjs` | 0% | 0% | 0% | Build script — see §4 |
| `utils/breadcrumbs.ts` | 100% | 100% | 100% | ✅ fully covered |
| `utils/collection-helpers.ts` | 100% | 100% | 100% | ✅ fully covered |
| `utils/llms.ts` | 91% | 81% | 100% | Several `rankLlmsLink` branches |
| `utils/og.ts` | 97% | 81% | 100% | 2 branch gaps |
| `utils/types.ts` | — | — | — | Type-only, excluded |

**Overall (tracked files):** ~70% statements, ~67% branches — below the ≥ 90% goal.

### New files not yet in coverage scope

| File | Exported helpers | Coverage |
|---|---|---|
| `data/cooling-products.ts` | `getProductsByCategory`, `getCoreProducts`, `getBonusProduct` | ❌ 0% (not in scope) |
| `data/calming-products.ts` | `getCalmingProductsByCategory` | ❌ 0% (not in scope) |

These files contain no Astro dependencies and are directly unit-testable. Adding `src/data/**` to the `coverage.include` array in `vitest.config.ts` is required.

---

## 2. Coverage Goals

| Scope | Target | Rationale |
|---|---|---|
| `src/utils/**` | ≥ 90% stmts, ≥ 90% branches | Stated in AGENTS.md |
| `src/scripts/analytics.ts` | ≥ 90% stmts, ≥ 90% branches | Stated in AGENTS.md |
| `src/data/**` | ≥ 90% stmts, ≥ 90% branches | New data layer introduced in refactor; helpers are pure TS with no Astro deps |
| `src/scripts/generate-og-images.mjs` | excluded from unit coverage | Node build script; indirectly validated by smoke tests |
| Smoke: key page types | 1 representative per type | converter, collector, attractor (variant), informer |

**Config change required:** Add `'src/data/**'` to `coverage.include` in `vitest.config.ts`.

---

## 3. Unit Test Plan

### 3.1 `analytics.ts` — 3 missing branches

**Current gaps (uncovered lines 21, 62–72):**

| Gap | Test case | Notes |
|---|---|---|
| Line 21: `typeof window === 'undefined'` | Call `track()` in an environment where `window` is deleted / undefined; expect no error thrown and nothing dispatched | `happy-dom` always exposes `window`, so this requires temporarily reassigning or using `globalThis` manipulation |
| Line 62: `navigator.sendBeacon` falsy branch | Set `navigator.sendBeacon = undefined` before firing an `amazon_outbound_click` data-track click; expect `track()` still called but `sendBeacon` not invoked | Verifies graceful degradation |
| Line 72: `typeof document === 'undefined'` | Call `init()` after deleting `document` from global scope; expect no error | SSR-safety guard |

**Additional hardening tests (not gaps but not yet exercised):**

| Test case | What it proves |
|---|---|
| `getTrackingData` with multiple `data-*` attrs (e.g., `data-asin`, `data-product-name`, `data-section`) | All kebab-case attrs are mapped to snake_case |
| Delegated click on a **child** of a `[data-track]` element (e.g., `<span>` inside `<a data-track>`) | `closest()` traversal works; parent's event name and props are used |
| Duplicate test removal | `analytics.test.ts` has two identical `'calls window.plausible when it is available'` tests under `describe('track')`; the duplicate should be removed. After removal, add a dedicated test verifying that `window.plausible` is called **exactly once** per `track()` invocation to confirm no double-firing |

**Edge cases:**

- `track()` called with an empty `props` object `{}` — no error
- `track()` called with props containing numeric and boolean values — passed through unchanged to all providers
- `init()` called twice — second call should add a second listener but not break anything (or document that behavior)

---

### 3.2 `llms.ts` — 7 uncovered branches in `rankLlmsLink`

Lines 78, 82, 86, 93, 102 in the coverage report correspond to priority tiers and path-exclusion inside `dedupeAndRankLinks`.

**Missing `rankLlmsLink` cases:**

| Path | Expected priority | Currently tested? |
|---|---|---|
| `/cooling/` | 950 | ❌ |
| `/calming/` | 950 | ❌ |
| `/cooling/cooling-mats/` | 900 | indirect via `dedupeAndRankLinks` only |
| `/travel/rhys-road-trip-chill-kit/` | 880 | ❌ |
| `/blog/some-post/` | 700 | ❌ |
| `/gift-guides/top-picks/` | 700 | ❌ |
| `/about/` | 500 | ❌ |
| `/contact/` | 500 | ❌ |
| `/unknown-path/` | 400 (default) | ❌ |

**Missing `dedupeAndRankLinks` cases:**

| Test case | What it proves |
|---|---|
| Input list containing an excluded path (e.g., `/404/`, `/privacy-policy/`) | Those entries are silently dropped; not present in output |
| Input list with duplicate paths where the first entry has a higher explicit priority | First (higher priority) entry wins |
| Input with paths that need `normalizePath` correction (no leading slash, no trailing slash) | Normalised correctly before dedup |

**Missing `normalizePath` cases:**

| Input | Expected output |
|---|---|
| `'cooling/'` (no leading slash) | `'/cooling/'` |
| `'/cooling'` (no trailing slash) | `'/cooling/'` |
| `'/cooling/'` (already normalised) | `'/cooling/'` |

**Missing `sectionForPath` cases:**

| Path | Expected section |
|---|---|
| `/gift-guides/top-picks/` | `'Gift Guides'` |
| `/blog/some-post/` | `'Articles'` |
| `/contact/` | `'About'` |
| `/unknown/path/` | `'Core Pages'` (default) |

**Missing `buildLlmsMarkdown` cases:**

| Test case | What it proves |
|---|---|
| `maxLinks: 2` with 5 input links | Only 2 highest-priority links appear in output |
| No `shortParagraph` supplied | Output has no paragraph block between description and first section |
| Links that map to every section (`Cooling Guides`, `Calming Guides`, `Travel Guides`, `Gift Guides`, `Articles`, `About`) | All sections rendered in canonical order |

**Edge cases:**

- Empty `links: []` → produces header + description only, no section headings
- All links excluded → same as empty
- Two links for the same path, one with `description` and one without → higher-priority version wins; its `description` is used in the output

---

### 3.3 `og.ts` — 2 uncovered branches

| Gap | Test case |
|---|---|
| `isAutoOgEligible` with `/404` (no trailing slash) | Returns `false` |
| `clampOgText` when the last safe word boundary is **before** 60% of `maxChars` | Falls back to hard truncation at `maxChars - 1`, still appends `…` |

**Additional hardening tests:**

| Test case | What it proves |
|---|---|
| `deriveOgHeadline({})` — no props at all | Returns `'Chill Dogs'` (default fallback) |
| `deriveOgCta({})` — no pageType, no ogCta | Returns the default CTA for `'collector'` |
| `ogSlugFromPathname` with multiple consecutive slashes (`'//cooling//'`) | Normalised to `'cooling'` |
| `resolveAutoOgImagePath` for `/` | Returns `'/og/home.png'` |
| `resolveAutoOgImagePath` for a noindex page | Returns `null` |

**Edge cases:**

- `clampOgText` with exactly `maxChars` characters → returned verbatim (no ellipsis)
- `clampOgText` with an empty string → returns `''`
- `deriveOgHeadline` strips `| Chill-Dogs` and also `| ChillDogs` variants (no hyphen)
- `deriveOgHeadline` strips leading `Chill-Dogs —` prefix

---

### 3.4 `breadcrumbs.ts` — no gaps, optional hardening

| Test case | Why add it |
|---|---|
| Path with a known special label (`/affiliate-disclosure/`) | `SEGMENT_LABELS` map is exercised for that key |
| Path with a known special label (`/privacy-policy/`) | Same as above |
| Single-segment path (`/cooling/`) | Produces 2-item breadcrumb list (Home + Cooling) |
| Path with no leading slash (`cooling/cooling-mats/`) | `buildBreadcrumbSchema` still builds correct URLs |

---

### 3.5 `collection-helpers.ts` — no gaps, optional hardening

| Test case | Why add it |
|---|---|
| `getPostsForCategory` with a category that has no matching posts | Returns empty array |
| `getAllPosts` when all posts are drafts | Returns empty array |
| Posts with identical dates | Sort is stable (original order preserved for equal dates) |

---

### 3.6 `data/cooling-products.ts` — new file, 0% coverage ⚠️

This file was introduced in the refactor. It exports three pure TypeScript helpers used by every cooling converter page. No tests exist yet.

**`getProductsByCategory(category: ProductCategory)`**

| Test case | What it proves |
|---|---|
| `getProductsByCategory('cooling-mats')` returns 3 products | Correct category filtering |
| `getProductsByCategory('cooling-bandanas')` returns 2 products | Correct category filtering |
| `getProductsByCategory('cooling-vests')` returns 3 products | Correct category filtering |
| `getProductsByCategory('freezable-dog-toys')` returns 2 products | Correct category filtering |
| `getProductsByCategory('car-cooling')` returns 4 products | Correct category filtering |
| `getProductsByCategory('bonus')` returns only the bonus product | Doesn't filter out `isBonus = true` items |
| All returned products have the expected `category` field | No cross-category contamination |

**`getCoreProducts()`**

| Test case | What it proves |
|---|---|
| Returns all products where `isBonus` is falsy | Bonus item excluded |
| Does not include the NASA bed (only bonus item) | Correct bonus exclusion |
| Returns 15 products (all 16 minus the 1 bonus) | Count is stable against data changes |

**`getBonusProduct()`**

| Test case | What it proves |
|---|---|
| Returns the single product with `isBonus: true` | Correct bonus selection |
| Returned product has `id: 'nasa-bed'` | Points to the right record |
| Returns `undefined` if no bonus product exists (mocked data) | Handles empty-bonus case gracefully |

**`categoryMeta` record**

| Test case | What it proves |
|---|---|
| Every non-bonus `ProductCategory` key has a `title`, `heroHeadline`, `introCopy`, and non-empty `faqs` array | Record is complete; no undefined on page load |
| Every `internalLinks` entry has a non-empty `label` and an `href` starting with `/` | Internal link data is valid |

**Edge cases:**

- `getProductsByCategory` with a valid category that has no products (mock data with empty array) → returns `[]`
- All `amazonUrl` values in `coolingProducts` contain `tag=chill-dogs-20` — assert the affiliate tag is present on every product

---

### 3.7 `data/calming-products.ts` — new file, 0% coverage ⚠️

This file was introduced in the refactor. It exports one pure TypeScript helper used by every calming page and the travel page.

**`getCalmingProductsByCategory(category: CalmingProductCategory)`**

| Test case | What it proves |
|---|---|
| `getCalmingProductsByCategory('anxiety-wraps')` returns 1 product | Correct category filtering |
| `getCalmingProductsByCategory('calming-treats')` returns 3 products | Correct category filtering |
| `getCalmingProductsByCategory('lick-mats')` returns 2 products | Correct category filtering |
| `getCalmingProductsByCategory('snuffle-mats')` returns 2 products | Correct category filtering |
| All returned products have the expected `category` field | No cross-category contamination |
| Calling with a category that has no matching products (mocked empty data) → returns `[]` | Graceful empty-result handling |

**`calmingProducts` data integrity**

| Test case | What it proves |
|---|---|
| All `amazonUrl` values contain `tag=chill-dogs-20` | Affiliate tag is present on every product |
| Every product has exactly 3 `bullets` (tuple constraint is runtime-verifiable) | Data matches the `[string, string, string]` type |
| Every product has non-empty `bestFor`, `howItHelps`, and `considerIf` | Required display fields are populated |

---

## 4. `generate-og-images.mjs` — Build Script Coverage Strategy

This file is a Node.js build-time script that invokes `@resvg/resvg-js` to rasterise SVG templates. Direct unit testing is impractical because:

1. It depends on binary native modules (`resvg-js`).
2. It reads the filesystem (`dist/`) for route discovery.
3. Its only output is written PNG files.

**Approach: indirect validation via smoke tests** (see §5.3).  
Unit-testing individual pure helper functions extracted from this script (e.g., `buildOgSvg`, `computeRoutes`) is a future option if the script is refactored to export them.

---

## 5. Smoke Test Plan

The smoke suite (`site-smoke.test.ts`) builds the site once in `beforeAll` and then reads from `dist/`. All new smoke tests follow the existing pattern.

### 5.1 Tests to add — affiliate link coverage

| Page | Path | What to assert |
|---|---|---|
| Cooling pillar | `/cooling/best-cooling-products-for-dogs/` | ≥ 1 Amazon link; `data-affiliate="true"`, correct `rel`, `tag=chill-dogs-20` |
| Car cooling converter | `/cooling/car-cooling-for-dogs/` | Same affiliate link checks (new page added in refactor) |
| Travel converter | `/travel/rhys-road-trip-chill-kit/` | ≥ 1 Amazon link; each has `data-affiliate="true"`, `rel` contains `noopener noreferrer sponsored`, `tag=chill-dogs-20` |
| Additional calming converters | `/calming/best-thundershirt-alternatives/`, `/calming/car-anxiety-for-dogs/` | Same affiliate link checks |
| Additional cooling converters | `/cooling/cooling-bandanas/`, `/cooling/cooling-vests/`, `/cooling/freezable-dog-toys/` | Same affiliate link checks |

### 5.2 Tests to add — SEO / meta correctness

| Test | Pages | Assertions |
|---|---|---|
| Collector hub pages are indexable with correct canonical | `/cooling/`, `/calming/` | No `robots: noindex`; canonical href matches the hub URL; OG image is the generated hub `.png` |
| Variant pages are noindex with canonical pointing to their hub | `/cooling/v/a/`, `/calming/v/a/` | `meta[name="robots"]` content is `noindex, follow`; canonical href is the hub URL (not the variant URL) |
| About and contact pages are indexable | `/about/`, `/contact/` | These informer pages should be indexed — assert they do NOT carry a `noindex` meta tag and that their canonical href matches the page URL |
| Blog index renders | `/blog/` | Page renders; `<h1>` or `<title>` present; no affiliate links on the index |
| Gift-guides index renders | `/gift-guides/` | Page renders; `<title>` contains "Gift Guides" |

### 5.3 Tests to add — OG image generation

| Test | What to assert |
|---|---|
| Hub pages have generated OG images | `dist/og/cooling.png` and `dist/og/calming.png` exist and are > 1 KB |
| Hub pages reference their generated OG image | `og:image` meta on `/cooling/` contains `/og/cooling.png` |
| Variant pages use the default OG fallback | `og:image` meta on `/cooling/v/a/` contains `/og-default.jpg` |

### 5.4 Tests to add — Structured data

| Test | Pages | What to assert |
|---|---|---|
| Hub collector pages have `CollectionPage` schema | `/cooling/`, `/calming/` | `application/ld+json` script present; `@type` is `CollectionPage` |
| Calming pillar page has `ItemList` schema | `/calming/best-calming-products-for-anxious-dogs/` | `@type` is `ItemList`; `numberOfItems` matches the product count (8); each `itemListElement` has a `position`, `name`, and Amazon `url` |
| Converter pages have `BreadcrumbList` schema | `/cooling/car-cooling-for-dogs/`, `/calming/car-anxiety-for-dogs/` | `@type` is `BreadcrumbList`; positions are sequential |
| New cooling pillar has `BreadcrumbList` schema | `/cooling/best-cooling-products-for-dogs/` | `BreadcrumbList` present with at least 3 items (Home → Cooling → page) |

### 5.5 Tests to add — Sitemap completeness

| Test | What to assert |
|---|---|
| New cooling pillar in sitemap | `sitemap-0.xml` contains `/cooling/best-cooling-products-for-dogs/` |
| Car cooling converter in sitemap | `sitemap-0.xml` contains `/cooling/car-cooling-for-dogs/` |
| Calming converter URLs in sitemap | `sitemap-0.xml` contains `best-thundershirt-alternatives` and `car-anxiety-for-dogs` |
| Travel converter URL in sitemap | `sitemap-0.xml` contains `/travel/rhys-road-trip-chill-kit/` |
| Variant pages excluded from sitemap | `sitemap-0.xml` does NOT contain `/cooling/v/` or `/calming/v/` |
| Policy / noindex pages excluded from sitemap | `sitemap-0.xml` does NOT contain `/privacy-policy/`, `/terms/`, `/affiliate-disclosure/` |

### 5.6 Tests to add — llms.txt correctness

| Test | What to assert |
|---|---|
| All major content sections present | Contains `## Cooling Guides`, `## Calming Guides`, `## Travel Guides` |
| New cooling pillar link present | Contains `https://chill-dogs.com/cooling/best-cooling-products-for-dogs/` |
| Car cooling converter link present | Contains `https://chill-dogs.com/cooling/car-cooling-for-dogs/` |
| Travel link present and absolute | Contains `https://chill-dogs.com/travel/rhys-road-trip-chill-kit/` |
| Variant paths excluded | Does NOT contain `/v/a/` or `/v/b/` |
| Policy paths excluded | Does NOT contain `/privacy-policy/` or `/terms/` |

---

## 6. Test Quality Notes

- **Remove duplicate test** in `analytics.test.ts`: the test `'calls window.plausible when it is available'` is defined twice inside `describe('track')` (lines 21–28 and 58–65). One copy should be removed.
- **Prefer `describe` grouping** for new `rankLlmsLink` tests to keep them separate from the integration-level `dedupeAndRankLinks` tests.
- **Use `beforeEach` resets** for any test that mutates `window`, `navigator`, or `document.body` to prevent state bleed between tests — follow the pattern in the existing analytics suite.
- **Smoke test timeout**: `beforeAll` already has a `30_000` ms timeout for the build. No changes needed.
- **No new dependencies** are required — Vitest, happy-dom, and the existing mock infrastructure are sufficient for all planned tests.

---

## 7. Implementation Order

1. **vitest.config.ts** — add `'src/data/**'` to `coverage.include`
2. **data/cooling-products.ts** — new test file covering all 3 helpers + data integrity (easy wins, no mocking needed)
3. **data/calming-products.ts** — new test file covering the 1 helper + data integrity
4. **analytics.ts** — close 3 branch gaps + clean up duplicate test
5. **llms.ts** — add `rankLlmsLink` tier tests, `normalizePath` edge cases, `dedupeAndRankLinks` exclusion, `buildLlmsMarkdown` maxLinks + section ordering
6. **og.ts** — close 2 branch gaps + hardening cases
7. **breadcrumbs.ts** — optional hardening (low priority, already 100%)
8. **collection-helpers.ts** — optional hardening (low priority, already 100%)
9. **site-smoke.test.ts** — add affiliate, SEO/meta, OG, schema, sitemap, and llms.txt tests from §5
