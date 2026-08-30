---
title: Keystone Metric and Page Type Definitions
type: canonical
domain: strategy
status: active
updated: 2026-08-30
tags:
  - chill-dogs
  - page-types
  - metrics
  - converter
  - collector
  - attractor
  - informer
related:
  - ../AGENT_START.md
  - web-systems.md
  - chill-dogs-context.md
---

# Keystone Metric and Page Type Definitions

Defines the business metric that governs every decision and the four valid page types with their jobs, metrics, and required behavior.

## Use this when

You are planning a new page, evaluating a page change, or need to know what behavior is required for a given page type.

---

## Keystone metric

```
Primary:   Amazon affiliate commission revenue
           (qualified outbound clicks that result in Amazon purchases)

Secondary: collector_to_converter_click rate
           (organic visitors routed from collector pages to converter pages)
```

Every page, component, and content decision must trace back to one of these two metrics. If it does not, question whether it belongs.

---

## Four valid page types

### `converter`

**Job:** Drive affiliate outbound clicks to Amazon. One CTA. No distractions.

**Metric:** % of visitors who click an affiliate link (`amazon_outbound_click` rate)

**Required behavior:**
- One primary CTA above the fold
- All Amazon links via `AffiliateLink.astro`
- `Disclosure` component appears before product CTAs
- `Hero`, comparison/product sections, `FAQ` (when data exists), internal links to related converters/collectors
- Do not add navigation items that distract from the CTA
- Product data comes from canonical data sources — no hardcoded product rows

**Examples:** `/cooling/cooling-mats/`, `/comforting/best-calming-dog-beds/`, `/gear/best-dog-gps-trackers/`

#### The catalog layer — `/shop/<product-id>/`

Product detail pages are converters, but they are not converter *guides*, and the
difference matters enough to state. There is one generated page per catalog product.
They are still `converter` — the type list is closed and this is the only honest fit:
their job is an affiliate click and their metric is `amazon_outbound_click` rate.

**How they differ from a hand-authored converter guide:**

| | Converter guide | Catalog page |
|---|---|---|
| Authoring | Hand-written comparison | Generated from `product-catalog.ts` |
| Scope | Several products, ranked | One product, no comparison |
| Body | Editorial prose and sections | The product's own bullets |
| Entry | Collector routes intent in | `/shop/` browse and social/search direct links |
| Count | Tens | Hundreds |

**Consequences that follow from that, and are enforced in code:**

- They are **excluded from every surface that means "our guides"** — the homepage
  Compare picks list, the section collectors, and related-content strips. By count alone
  they would crowd all three out. The marker is `isProductDetailPage()` in
  `src/data/content-sitemap.ts`; use it rather than a new href check.
- They carry an **indexing gate** (`isIndexableProduct()` in `src/utils/product-meta.ts`):
  under 2 bullets or 120 characters of copy, the page still builds — direct links keep
  working — but goes `noindex`. Hundreds of near-empty pages read as doorway pages and
  can discount the whole set.
- Their **`id` is a public URL.** See the stability rule in `CLAUDE.md`.

**The converter rules that still apply in full.** A looser contract is not no contract:
`Disclosure` before the CTA, Amazon links through the shared affiliate components,
product data from canonical sources, shared card primitives, product schema, and
registration in the sitemap inventory.

**Known tension, unresolved.** The funnel is defined below as
*collector or attractor entry → converter click → affiliate_outbound_click*. Catalog
pages sit outside it: nothing routes into them but `/shop/`, which is itself a converter,
so the secondary keystone metric (`collector_to_converter_click`) does not measure them.
They also overlap their category converter — `/shop/kh-cool-bed-iii/` and
`/cooling/cooling-mats/` both want "k&h cool bed" traffic. The bet is that they capture
narrower, more navigational queries the guides do not rank for. Watch whether the guides
lose mid-tail positions after these are indexed; if they do, the answer is to cut the
catalog set back, not to thin the guides.

---

### `collector`

**Job:** Capture organic search traffic and route it to converter pages.

**Metric:** Organic traffic volume + % routed to converters (`collector_to_converter_click` rate)

**Two subtypes:**

#### `collectorSubtype: 'section'`

Section collector pages that aggregate and route intent.

**Required behavior:**
- Use `SectionCollectorPage` with `src/data/section-collectors.ts` definitions
- Render `CollectorBody` from dynamic topic-matched converter and article inventory grouped into topic subsections
- Derive cards and `CollectionPage.hasPart` from the complete sitemap inventory
- Above-the-fold route to a converter (no prose above fold)
- Pure routing intent — no prose content
- No converter-style comparison implementations

**Examples:** `/cooling/`, `/calming/`, `/comforting/`

#### `collectorSubtype: 'article'`

Long-form informational guides.

**Required behavior:**
- Full prose content with `<article>` structure
- `Toc` module required when article has 4+ h2 sections
- Short lede/summary near the top
- `FAQ` module with 3+ real questions
- `InternalLinkStrip` at the bottom linking to relevant converters
- `Article` JSON-LD schema (not `CollectionPage`)
- Drive conversions via `InternalLinkStrip` — not above-fold CTA
- `Disclosure` required when inline product cards appear

**Examples:** `/cooling/keep-dog-cool-in-car/`, `/calming/crate-training-for-dogs/`, `/travel/dog-road-trip-gear/`

---

### `attractor`

**Job:** Convert paid or social campaign traffic into site engagement and affiliate clicks.

**Metric:** Campaign conversion rate

**Required behavior:**
- High visual clarity
- Campaign-specific messaging
- Clear route to a converter or collector
- Limited lifespan for campaign-specific variants

**Examples:** `/` (homepage) and its noindex `/v/` experiment variants

**Note:** Homepage experiment pages are `noindex` with a canonical pointing to `/`. The retired `/cooling/v/` and `/calming/v/` routes are no longer built; their production pages are section collectors.

---

### `informer`

**Job:** Administrative and compliance. No revenue goal.

**Metric:** Accuracy and currency (not conversion)

**Required behavior:**
- Accurate
- Up to date
- Not metric-driven
- Footer only — do not put informer pages in primary nav

**Examples:** `/about/`, `/affiliate-disclosure/`, `/privacy-policy/`, `/terms/`, `/contact/`

---

## Invalid behavior — do not do these

- **Mixing page types.** A page is exactly one type. A collector does not have a product comparison table. A converter does not have a full prose article.
- **Inventing page types.** The four types above are the complete list. Do not use "hub," "pillar," "landing," "article-collector," or any other invented type.
- **Using "hub" in code or specs.** The word is "collector." Use `collector`.
- **Two CTAs on a converter.** One primary CTA per converter page.
- **Informer pages in primary nav.** Informer pages go in the footer only.
- **Section collectors with prose content.** Section collectors route. They do not explain.
- **Article collectors without TOC or FAQ.** Both are required (TOC when 4+ h2s, FAQ always).

---

## Related knowledge

- [`web-systems.md`](web-systems.md) — Framework theory behind these rules
- [`chill-dogs-context.md`](chill-dogs-context.md) — Full page map by category
- [`../AGENT_START.md`](../AGENT_START.md) — Quick operating constraints
- [`../checklists/article-publish-checklist.md`](../checklists/article-publish-checklist.md) — Article collector checklist
- [`../checklists/converter-page-checklist.md`](../checklists/converter-page-checklist.md) — Converter checklist
