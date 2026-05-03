---
title: Coding Agent Finish Checklist
type: checklist
domain: checklists
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - checklist
  - engineering
  - coding
  - finish-gate
related:
  - article-publish-checklist.md
  - converter-page-checklist.md
  - marketing-publish-checklist.md
  - ../engineering/build-and-test-commands.md
---

# Coding Agent Finish Checklist

Engineering gate checklist. Run this before declaring any coding task complete.

## Use this when

Finishing any coding task — new page, component change, data file update, utility change, or route/sitemap change.

---

## Checklist

- [ ] Reused existing modules where possible — did not create new components when existing ones could be configured
- [ ] Did not invent page types — used only `converter`, `collector`, `attractor`, `informer`
- [ ] Did not use "hub" in code, comments, or specs — used `collector`
- [ ] Did not hardcode internal route strings where `ROUTES` constants exist in `src/data/routes.ts`
- [ ] Updated `docs/system-definition.yaml` if page structure, routes, page types, navigation, or module stacks changed
- [ ] Updated sitemap inventory (`src/data/content-sitemap.ts`) if new non-MDX pages were added or routes changed
- [ ] Used `AffiliateLink.astro` for all Amazon outbound links — no plain `<a>` tags
- [ ] Preserved tracking attributes on modified components: `data-track`, `data-asin`, `data-product-name`, `data-affiliate="true"`
- [ ] Added or updated tests for changed utilities, scripts, or data files (`src/__tests__/`)
- [ ] Ran relevant build command:
  - Substantive page/module change: `bun run test` (includes build)
  - Page-level HTML only: `bun run test:smoke`
  - Utility/script/data changes: `bun run test:coverage`
- [ ] Confirmed build passes for substantive changes
- [ ] If products were added or changed: `bun run check:asins` passes
- [ ] If `docs/ai/` files were added or changed: `bun run check:ai-docs` passes

---

## Related knowledge

- [`../engineering/build-and-test-commands.md`](../engineering/build-and-test-commands.md) — What each command does
- [`../engineering/routes-and-sitemap.md`](../engineering/routes-and-sitemap.md) — When to update route constants and sitemap
- [`../engineering/analytics-events.md`](../engineering/analytics-events.md) — Tracking attributes to preserve
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — AffiliateLink requirements
