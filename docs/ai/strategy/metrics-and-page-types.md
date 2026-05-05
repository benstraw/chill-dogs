---
title: Keystone Metric and Page Type Definitions
type: canonical
domain: strategy
status: active
updated: 2026-05-03
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

---

### `collector`

**Job:** Capture organic search traffic and route it to converter pages.

**Metric:** Organic traffic volume + % routed to converters (`collector_to_converter_click` rate)

**Two subtypes:**

#### `collectorSubtype: 'section'`

Hub pages that aggregate and route intent.

**Required behavior:**
- Use `CollectorBody` module with card grid config
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

**Examples:** `/` (homepage), hero experiment variant pages (`/cooling/v/a/`, etc.)

**Note:** Hero experiment variant pages are `noindex` with a canonical pointing to the production URL. Winners get promoted to the default; variant URLs are retired.

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
