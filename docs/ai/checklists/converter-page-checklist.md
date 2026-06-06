---
title: Converter Page Checklist
type: checklist
domain: checklists
status: active
updated: 2026-06-05
tags:
  - chill-dogs
  - checklist
  - converter
  - publishing
  - affiliate
related:
  - article-publish-checklist.md
  - coding-agent-finish-checklist.md
  - ../affiliate/amazon-associates-rules.md
  - ../strategy/metrics-and-page-types.md
---

# Converter Page Checklist

Gate checklist for publishing or updating a converter page.

## Use this when

Finishing any converter page before marking work as done.

---

## Checklist

- [ ] Page type is `converter`
- [ ] One primary CTA above the fold
- [ ] Amazon links use `AffiliateLink.astro` — no plain `<a>` tags for Amazon URLs
- [ ] Affiliate tag `chill-dogs-20` present in every Amazon URL
- [ ] Product data sourced from canonical data file (`cooling-products.ts`, `calming-products.ts`, `relaxation-products.ts`, etc.) — not hardcoded in page
- [ ] `Disclosure` component appears before product CTAs
- [ ] Product claims are research-based — not fake hands-on testing
- [ ] No "vet-approved" / "vet-recommended" language unless sourced with documentation
- [ ] Schema present (FAQPage if FAQ exists, appropriate structured data for product listings)
- [ ] Related content uses the approved related-content system only (`topics`, `pinnedRelated`, `excludeRelated`, `relatedLabel` in sitemap config) — no new manual related arrays
- [ ] Added to sitemap inventory (`src/data/content-sitemap.ts`)
- [ ] Sitemap entry includes `heroProduct` when one product should represent the page in social previews; omit it for browse/search or multi-product pages
- [ ] Sitemap entry includes `pubDate`; set `lastUpdated` only for a material content/product refresh
- [ ] Route constant added to `src/data/routes.ts`
- [ ] Updated `docs/system-definition.yaml`
- [ ] Build passes: `bun run build`
- [ ] Tests pass: `bun run test`
- [ ] Amazon cache and ASIN checks pass: `bun run check:amazon` and `bun run check:asins`

---

## Related knowledge

- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — AffiliateLink component and tag
- [`../affiliate/product-data-rules.md`](../affiliate/product-data-rules.md) — Product data file locations
- [`../affiliate/disclosure-rules.md`](../affiliate/disclosure-rules.md) — Disclosure placement rules
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Converter type definition
- [`coding-agent-finish-checklist.md`](coding-agent-finish-checklist.md) — Engineering finish gate
