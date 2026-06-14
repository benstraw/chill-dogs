---
title: Knowledge Sync - Shared conversion UI system (CTA + card primitives + ui-grid)
type: plan
domain: global
status: executed
updated: 2026-06-10
tags:
  - chill-dogs
  - knowledge-sync
related:
  - ../AI_INDEX.md
---

# Knowledge Sync: Shared conversion UI system

## Context

The `css-conversion-primitives` branch (PR #233) standardized the conversion UI layer
(product cards + affiliate CTAs) without changing product data, routes, affiliate URLs, or
page copy. It introduced shared CSS/component primitives that future agents should reuse
instead of writing bespoke per-component CSS, and unified the product-grid breakpoints —
none of which was reflected in the knowledge graph.

What changed in code:

- **Shared CTA system** — `src/styles/cta.css` (`.ui-cta`, imported globally in
  `BaseLayout`) driven by new `variant` / `size` / `tone` props on
  `MerchantAffiliateLink.astro` (rendered as `data-*`). Cooling/calming/comfort/browse card
  CTAs migrated off bespoke `.cp-cta` / `.calm-card-cta` / `.rx-card-cta` / `.card-cta`.
- **Card-shell primitives** — `src/components/modules/primitives/`: `ProductCardShell`,
  `ProductImageFrame` (uses Astro `<Image>`), `ProductBulletList`, `AffiliateOfferStack`.
  Cooling/calming/comfort cards compose them; `BrowseProductCard` keeps a bespoke shell and
  only reuses `AffiliateOfferStack`.
- **Shared grid vocabulary** — `.ui-grid--1/2/3` in `src/styles/utilities.css`; converter,
  cooling, and gear product grids migrated onto it. Canonical collapse standardized at
  3→2 cols @1024px, 2→1 col @768px. `shop/` compact catalog grid + `.cards-grid--*`
  collector grids left bespoke.

**Executed:** 2026-06-10
**Commits reviewed:** 3090e18, b162601, 1368896
**Follow-up:** Reconciled with the simplified converter product model after PR #232, keeping the shared UI primitives while rendering converter cards from bullet-only product copy.

## Changes made

- **`engineering/architecture.md`** (`updated` → 2026-06-10):
  - **Styling** section: added per-pillar theming note (`pillar-themes.ts` sets
    `--color-primary` = `--pillar-accent` on themed pages) and a new **Shared conversion UI
    system** subsection documenting `cta.css` / `.ui-cta` + the `variant`/`size`/`tone`
    props, the `primitives/` components, and the `.ui-grid` vocabulary with its 1024/768
    breakpoints and which grids use it vs. stay bespoke.
  - **Images** section: clarified that `ProductImageFrame` renders product images via
    `<Image>` (remote Amazon URLs pass through unchanged, no `image.domains` configured),
    so it does not contradict the raw-`<img>`-for-external guidance.

No other docs/ai/ files were factually stale. `affiliate/amazon-associates-rules.md` still
correctly describes the `AffiliateLink.astro` contract (it wraps `MerchantAffiliateLink`,
unchanged); the converter-page checklist and routers needed no edits.

## Related knowledge

- [AI Index](../AI_INDEX.md)
