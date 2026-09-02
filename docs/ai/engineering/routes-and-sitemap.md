---
title: Routes and Sitemap
type: canonical
domain: engineering
status: active
updated: 2026-08-29
tags:
  - chill-dogs
  - engineering
  - routes
  - sitemap
  - pages
related:
  - architecture.md
  - seo-and-schema.md
  - build-and-test-commands.md
  - ../strategy/metrics-and-page-types.md
---

# Routes and Sitemap

Where route constants live, how the sitemap inventory works, when to update each file, and when to update the system definition.

## Use this when

Adding a new page, changing a route, registering a page in the sitemap, or updating the system definition.

---

## Route constants

**All internal route strings live in `src/data/routes.ts` → `ROUTES` object.**

Never hardcode internal route strings in page bodies, components, or data files. Always import from `ROUTES`.

```typescript
// Correct
import { ROUTES } from '@data/routes';
<a href={ROUTES.coolingMats}>Cooling Mats</a>

// Wrong — never do this
<a href="/cooling/cooling-mats/">Cooling Mats</a>
```

When adding a new page, add its route constant to `ROUTES` first.

---

## Sitemap inventory

There are two layers:

### 1. Static page registry — `src/data/content-sitemap.ts`

All non-MDX pages must be registered here. This includes:
- Section collectors (`/cooling/`, `/calming/`)
- Article collectors (if not MDX)
- All converter pages
- Attractor pages
- Informer pages

When adding a page, use `createSitemapPage()` with these required fields:
- `baseTitle` — display title
- `description` — meta description (100–165 chars)
- `href` — use a `ROUTES` constant, never a string literal
- `pageType` — one of `converter`, `collector`, `attractor`, `informer`
- `collectorSubtype` — `'section'` or `'article'` for collector pages

Optional fields:
- `topics` — array of `SitemapTopic` values from `content-sitemap.ts`
- `pinnedRelated` — array of `ROUTES` hrefs to pin in related content
- `excludeRelated` — array of `ROUTES` hrefs to exclude from related content
- `relatedLabel` — shorter text for InternalLinkStrip pills
- `ogTitle` — social-specific title when `<title>` falls outside 40–65 char limit
- `noindex` — set true for admin/staging pages
- `pubDate` — original publication date; required for converter pages
- `lastUpdated` — material content/product refresh date; optional for converter pages

### 2. MDX article auto-discovery

MDX articles in `src/content/articles/` are **auto-discovered** from their `canonicalPath` frontmatter. Do not manually register MDX articles in `content-sitemap.ts`.

The `canonicalPath` field is the page URL and drives:
- Sitemap inventory discovery
- RSS feed
- Related content derivation

### 3. Complete inventory — `src/data/sitemap-inventory.ts`

Combines static registry + auto-discovered MDX articles at build time. This is the source of truth for:
- Related content derivation (`src/utils/related-pages.ts`)
- Section collector card inventories and `CollectionPage.hasPart` schema (`src/data/section-collectors.ts`)
- RSS feed
- `llms.txt`

Do not edit `sitemap-inventory.ts` directly for page registration — edit `content-sitemap.ts` for static pages.

---

## Discovery surfaces: XML sitemap and llms.txt

Both public discovery surfaces derive from the same data. Neither is a curated list.

| Surface | Built by | Source |
|---|---|---|
| `sitemap-0.xml` | `@astrojs/sitemap` in `astro.config.mjs` | Every built route, minus the shared exclusions |
| `llms.txt` | `src/pages/llms.txt.ts` | Complete sitemap inventory, minus `noindex` and the shared exclusions |

**Shared exclusions live in `src/data/discovery-exclusions.ts`.** Both surfaces import `isExcludedFromDiscovery()`, so a fragment added there disappears from both at once. Do not add a second exclusion list.

A page appears in `llms.txt` automatically once it is registered in `content-sitemap.ts` (or is an MDX article with a `canonicalPath`). There is nothing to curate — do not reintroduce a hand-maintained link array in `llms.txt.ts`. Ordering-only nudges for high-intent pages go in `PRIORITY_OVERRIDES`; they move a page within its section and never decide whether it is listed.

`src/__tests__/llms-coverage.test.ts` fails if `llms.txt` omits any indexable sitemap URL, lists a URL absent from the sitemap, or lists a `noindex` page.

Sections in `llms.txt` come from path prefix (`LLMS_SECTION_ORDER` in `src/utils/llms.ts`). When adding a new top-level path prefix, add a matching section rule — otherwise its pages still appear, but under `Core Pages`.

---

## Related content system

Related links derive from the complete sitemap inventory automatically. Do not add manual related arrays.

Use these frontmatter/config fields to control related content:

| Field | Purpose |
|---|---|
| `topics` | Topic tags for algorithmic matching — use values from `TOPICS` in `content-sitemap.ts` |
| `pinnedRelated` | Force specific pages to appear in related links (wins over algorithm) |
| `excludeRelated` | Prevent specific pages from appearing in related links (wins over pinning) |
| `relatedLabel` | Shorter text for InternalLinkStrip pills when the page title is too long |

`InternalLinkStrip` and `RelatedGuides` use `currentHref` prop for automated derivation. Do not add new manual related arrays.

Section collectors (`/cooling/`, `/calming/`, `/comforting/`, `/gear/`) also use sitemap topics. Their definitions in `src/data/section-collectors.ts` match indexable converters and article collectors by topic, group cards into first-match topic subsections, allow cross-topic pages to appear in multiple collectors, and preserve converter-first ordering within each subsection. `/gear/` is the fourth pillar (violet theme, covering gear/travel/safety content) — it replaced a former 301 redirect stub. `/articles/` is a reverse-chronological index of every article, linked from the homepage hero.

---

## Converter recency metadata

Converter entries in `src/data/content-sitemap.ts` must include `pubDate`. Use the first real publication date from git history when available. Set `lastUpdated` only for a material content or product refresh that should promote the converter in recency-based surfaces.

The homepage theme sections use this metadata via `getHomepageConverters()` + `groupHomepageConvertersByTheme()`: converters are sorted by `lastUpdated ?? pubDate` descending (undated last), grouped by theme, and each `HomepageSection` renders its theme's most recent few as compact links. This ordering is homepage-specific; section collectors still use topic and priority routing rules.

---

## When to update system-definition.yaml

Update `docs/system-definition.yaml` whenever:
- A new page is added (any type)
- A page is removed or its route changes
- A page type changes
- Primary navigation changes
- Module stack changes
- Analytics funnel definition changes

AI-assisted page changes are incomplete until this file is updated.

---

## Adding a new page — checklist order

1. Add route constant to `src/data/routes.ts`
2. Create the page file in `src/pages/`
3. Register in `src/data/content-sitemap.ts` (unless MDX — those are auto-discovered)
4. Update `docs/system-definition.yaml`
5. Run `bun run build` and `bun run test`

---

## Redirects

When a live/indexed URL changes slug:
- Add a redirect entry in `docs/system-definition.yaml` under `redirects:`
- Add the HTTP redirect to `vercel.json` → `redirects` array (true 301 at Vercel edge)
- Add a meta-refresh fallback to `astro.config.mjs` → `redirects` block for local dev

---

## Product ids are public URLs

Every product in `src/data/*-products.ts` is built as a detail page at `/shop/<id>/`.
That makes the `id` field a **public, indexed URL**, not an internal key.

- Renaming a product's `name` is free. It changes page copy and nothing else.
- Renaming a product's `id` retires a live URL. Pinterest pins, Google results, and
  every `appearsOn` link pointing at it break.

To rename an id, treat it as the slug change it is: keep the old entry in
`src/data/product-url-history.ts`, then add **both** redirects listed above for
`/shop/<old-id>/`.

`src/__tests__/product-slugs.test.ts` enforces this. It fails the build when an id in
the history file no longer builds and has no redirect, when two products share an id,
when an id is not URL-safe kebab-case, or when a new product is missing from the
history file — and it prints the exact lines to paste.

Prefer editing the `name` and leaving the `id` alone. An id that reads a little
tersely is not worth a URL change.

---

## Topics taxonomy

Valid `topics` values are defined in `src/data/content-sitemap.ts` as the `TOPICS` const:

`cooling`, `heat-safety`, `car-cooling`, `cooling-mats`, `cooling-wearables`, `frozen-toys`, `calming`, `anxiety`, `car-anxiety`, `crate-training`, `fireworks`, `comfort`, `sleep`, `beds`, `orthopedic`, `crates`, `travel`, `road-trips`, `flying`, `carriers`, `tracking`, `gps-tracking`, `lost-dog-safety`

Use these exact values. Do not invent new topic strings.

---

## Product detail page indexing

`/shop/<id>/` pages are built for all 214 catalog products but ship **noindex and out of the
XML sitemap**, gated by `PRODUCT_PAGES_INDEXABLE` in `src/utils/product-meta.ts`.

Adding ~200 programmatically generated pages to a site of roughly 65 is the shape that draws
site-wide quality demotion, and the pages at risk are the hand-written converters that earn.
The URLs still work from day one — Pinterest pins, direct links and internal navigation all
resolve — so only long-tail search discovery waits. Flip the switch to `true` to hand the
decision back to `meetsProductCopyBar`, the per-product copy bar that stays enforced meanwhile.

Both surfaces read through `isIndexableProduct`, so they cannot drift: llms.txt filters on
`noindex` directly, and the XML sitemap filter in `astro.config.mjs` excludes
`noindexProductPaths()` from `src/data/product-indexing.ts`. That module is deliberately
alias-free because config is evaluated before the `@` aliases it declares exist. Before this,
the sitemap honoured only `EXCLUDED_DISCOVERY_FRAGMENTS`, so all 214 pages were submitted
including the 19 thin ones already carrying `noindex` — contradictory signals that Search
Console reports as an error.

## Related knowledge

- [`architecture.md`](architecture.md) — Stack, file structure, content collections
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta constraints and schema types
- [`build-and-test-commands.md`](build-and-test-commands.md) — What to run after changes
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Page type rules
