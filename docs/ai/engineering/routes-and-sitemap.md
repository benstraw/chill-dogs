---
title: Routes and Sitemap
type: canonical
domain: engineering
status: active
updated: 2026-05-23
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

Section collectors (`/cooling/`, `/calming/`, `/comforting/`) also use sitemap topics. Their definitions in `src/data/section-collectors.ts` match indexable converters and article collectors by topic, allow cross-topic pages to appear in multiple collectors, and preserve curated converter priority before falling back to sitemap order.

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

## Topics taxonomy

Valid `topics` values are defined in `src/data/content-sitemap.ts` as the `TOPICS` const:

`cooling`, `heat-safety`, `car-cooling`, `cooling-mats`, `cooling-wearables`, `frozen-toys`, `calming`, `anxiety`, `car-anxiety`, `crate-training`, `fireworks`, `comfort`, `sleep`, `beds`, `orthopedic`, `crates`, `travel`, `road-trips`, `flying`, `carriers`, `tracking`, `gps-tracking`, `lost-dog-safety`

Use these exact values. Do not invent new topic strings.

---

## Related knowledge

- [`architecture.md`](architecture.md) — Stack, file structure, content collections
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta constraints and schema types
- [`build-and-test-commands.md`](build-and-test-commands.md) — What to run after changes
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Page type rules
