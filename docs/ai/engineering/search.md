---
title: Search — Architecture & Pattern
type: canonical
domain: engineering
status: active
updated: 2026-05-24
tags:
  - chill-dogs
  - engineering
  - search
  - fuse.js
  - client-side
related:
  - analytics-events.md
  - routes-and-sitemap.md
  - architecture.md
---

# Search — Architecture & Pattern

How client-side search works on chill-dogs.com: index generation, Fuse.js configuration, the `/search/` page, and how to maintain it.

## Use this when

Adding new searchable content types, tuning relevance weights, updating the search UI, or wiring search analytics.

---

## Overview

Search is fully static — no server. The index is prerendered at build time as a JSON file. Fuse.js runs in the browser against that file.

| Part | File |
|---|---|
| Index endpoint | `src/pages/search-index.json.ts` |
| Search page | `src/pages/search.astro` |
| Route constant | `ROUTES.search = '/search/'` in `src/data/routes.ts` |

---

## Index endpoint (`/search-index.json`)

`src/pages/search-index.json.ts` is an Astro API route that prerenders at build time.

**Sources:**
- All non-noindex pages from `getCompleteSitemapPages()` (`src/data/sitemap-inventory.ts`)
- All products from `productCatalogItems` (`src/data/product-catalog.ts`)

**Output shape:**

```typescript
type SearchIndexItem =
  | {
      type: 'page';
      title: string;         // SitemapPage.baseTitle
      description: string;   // SitemapPage.preview.description
      pageType: string;      // 'converter' | 'collector' | 'attractor' | 'informer'
      href: string;
      topics: string[];
    }
  | {
      type: 'product';
      name: string;
      pillar: string;        // 'cooling' | 'calming' | 'comfort' | 'gear'
      category: string;
      bestFor: string;
      bullets: string;       // bullets array joined to a single string for Fuse weight matching
      amazonUrl: string;
    };
```

When new product data files or page sections are added, they automatically appear in the index on next build — no manual update required.

---

## Fuse.js configuration

```javascript
new Fuse(items, {
  keys: [
    { name: 'title',       weight: 0.40 },
    { name: 'name',        weight: 0.40 },
    { name: 'description', weight: 0.25 },
    { name: 'bestFor',     weight: 0.25 },
    { name: 'bullets',     weight: 0.15 },
    { name: 'category',    weight: 0.10 },
    { name: 'topics',      weight: 0.10 },
  ],
  threshold: 0.35,    // lower = stricter match
  includeScore: true,
  minMatchCharLength: 2,
})
```

Threshold 0.35 is the working sweet spot: tight enough to avoid noise, loose enough for common misspellings like "bandana" vs "bandanas" or "orthopedic" vs "orthopaedic". Adjust if results feel too noisy or too sparse.

---

## Search page (`/search/`)

- Page type: `informer`, `noindex: true`
- Registered in `src/data/content-sitemap.ts` (Admin & Legal section)
- Registered in `src/data/routes.ts` as `ROUTES.search`
- A magnifying-glass icon in `src/components/Header.astro` links to it

### UI features

- **Search input** — debounced 150 ms; updates `?q=` URL param for shareable links
- **Filter bar** — pill buttons: All / Guides (converter) / Hubs (collector) / Products
- **Result cards:**
  - Page card — badge (Guide/Hub/Home/Info), title, description, "Read guide →" text link
  - Product card — badge (Cooling/Calming/Comfort/Gear), name, bestFor, styled "Buy on Amazon" CTA button
- **Zero-state** — "No results for …" message

### Analytics

| Event | When |
|---|---|
| `search_query` | After debounce, when results render. Props: `query`, `result_count`, `filter` |
| `search_result_click` | Click on a page result card. Props: `result_href`, `result_title`, `result_type`, `query` |
| `amazon_outbound_click` | Click on any product Buy button. Props: `product_name` (via `data-track` + `data-product-name`) |

The Amazon buy buttons in search results carry `data-affiliate="true"` and `data-track="amazon_outbound_click"` so they fire the same keystone event as all other affiliate links.

---

## Smoke test exemption

`src/__tests__/site-smoke.test.ts` exempts `search/` from the JSON-LD presence check (noindex pages do not get breadcrumb schema from `BaseLayout`).

---

## Maintenance notes

- **New product pillar**: add to `productCatalogItems` — search index picks it up automatically
- **New page section**: add to `staticSitemapSections` in `src/data/content-sitemap.ts` — search index picks it up automatically
- **Relevance tuning**: adjust key weights or `threshold` in `src/pages/search.astro`
- **Do not** add a sitemap entry or canonical link for `/search/` — it is noindex by design

---

## Related knowledge

- [`analytics-events.md`](analytics-events.md) — Full event table and tracking rules
- [`routes-and-sitemap.md`](routes-and-sitemap.md) — How to add pages to the sitemap
- [`architecture.md`](architecture.md) — PostHog and build pipeline
