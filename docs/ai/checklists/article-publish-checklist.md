---
title: Article Publish Checklist
type: checklist
domain: checklists
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - checklist
  - article
  - collector
  - publishing
related:
  - converter-page-checklist.md
  - coding-agent-finish-checklist.md
  - ../writing/article-writing-guide.md
  - ../strategy/metrics-and-page-types.md
---

# Article Publish Checklist

Gate checklist for publishing an article collector page.

## Use this when

Finishing any article collector page before marking work as done.

---

## Checklist

- [ ] Page type is `collector` with `collectorSubtype: 'article'`
- [ ] Title matches informational search intent
- [ ] Lede is specific and useful (also serves as meta description — 100–165 chars)
- [ ] TOC exists when article has 4+ H2s
- [ ] TOC anchors match H2 `id` attributes exactly
- [ ] FAQ exists with 3+ real questions (not invented to pad)
- [ ] Article JSON-LD schema present with all required fields (headline, description, url, image, author, publisher)
- [ ] `InternalLinkStrip` appears after FAQ, links to relevant converters
- [ ] Links route to relevant converter pages (not just any internal page)
- [ ] Product cards include `Disclosure` component when present on the page
- [ ] No vet-authority claims ("vet-approved," "vet-recommended," "clinically proven")
- [ ] No fake hands-on testing claims ("we tested," "in our testing")
- [ ] Health emergencies covered include escalation language ("contact your vet immediately")
- [ ] Added to sitemap inventory (`src/data/content-sitemap.ts`) if not MDX — MDX auto-discovers from `canonicalPath`
- [ ] `topics` frontmatter set to relevant values from the `TOPICS` const in `content-sitemap.ts`
- [ ] Updated `docs/system-definition.yaml`
- [ ] Build passes: `bun run build`
- [ ] Tests pass: `bun run test`

---

## Related knowledge

- [`../writing/article-writing-guide.md`](../writing/article-writing-guide.md) — Full article structure and voice guide
- [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md) — Vet and health claim rules
- [`../engineering/routes-and-sitemap.md`](../engineering/routes-and-sitemap.md) — Sitemap registration
- [`../engineering/seo-and-schema.md`](../engineering/seo-and-schema.md) — Article JSON-LD and OG meta
- [`coding-agent-finish-checklist.md`](coding-agent-finish-checklist.md) — Engineering finish gate
