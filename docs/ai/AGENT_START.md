---
title: Agent Operating Brief
type: start
domain: global
status: active
updated: 2026-05-23
tags:
  - chill-dogs
  - operating-brief
  - quick-start
related:
  - AI_INDEX.md
  - KNOWLEDGE_GRAPH.md
  - strategy/metrics-and-page-types.md
  - strategy/chill-dogs-context.md
---

# Agent Operating Brief

Read this first. It is the minimum context needed before touching anything.

## Use this when

You are starting any task in the chill-dogs repo.

---

## What Chill-Dogs is

**Chill-Dogs** (`chill-dogs.com`) is a static Amazon affiliate site for dog lifestyle — cooling, calming, comfort, and travel. Built with **Astro 5** and **Bun**, deployed to **Vercel** as a full static build. No CMS. No server. All content is code-first TypeScript data files or MDX articles.

---

## Primary business goal

**Amazon affiliate commission revenue.**

Every feature, page, component, and content decision must trace back to driving or supporting affiliate clicks to Amazon. If a proposed change does not serve that goal, question whether it belongs.

**Affiliate tag:** `chill-dogs-20` — must appear on every Amazon URL.

---

## Keystone event

`amazon_outbound_click`

This fires on every click of an `AffiliateLink` component. It is the primary analytics signal for business health.

---

## Valid page types

Every page is exactly one of these. Do not invent new types.

| Type | Job |
|---|---|
| `converter` | Drive affiliate clicks to Amazon — one CTA, no distractions |
| `collector` | Capture organic search traffic and route to converters |
| `attractor` | Convert paid or social campaign traffic |
| `informer` | Administrative and compliance pages — no revenue goal |

For collectors: use `collectorSubtype: 'section'` for section collector pages and `collectorSubtype: 'article'` for prose guides.

Do not use the word "hub" in specs, code, or comments. Use `collector`.

---

## Before changing anything

1. **Know the page type.** Every page is one of the four types above. Identify it before making changes.
2. **Use route constants.** Never hardcode internal route strings. Import from `src/data/routes.ts` → `ROUTES` object.
3. **Use `AffiliateLink.astro`** for all Amazon outbound links. Never use a plain `<a>` tag for Amazon URLs.
4. **Use the existing related-content system.** Do not add manual related arrays. Use `topics`, `pinnedRelated`, `excludeRelated`, `relatedLabel` in sitemap metadata.
5. **Register new pages.** Every new non-MDX page must be added to `src/data/content-sitemap.ts`. Update `docs/system-definition.yaml`.
6. **Run tests.** Run `bun run test` and `bun run build` for substantive changes. `bun run test:smoke` for page-level HTML only.

---

## Key constraints at a glance

- **No vet-authority language.** Do not say "vet-approved," "vet-recommended," or imply medical endorsement. Use "researched," "compared," "curated," "popular."
- **No hardcoded routes.** Always import from `src/data/routes.ts`.
- **No manual related arrays.** Use sitemap metadata; the system derives links automatically.
- **No raw `<a>` for Amazon.** Always `AffiliateLink.astro`.
- **No duplicate page scaffolding.** Two pages that share structure get one shared module with config inputs.
- **No inventing page types.** The four types are fixed.

---

## Most important docs

| Task | Doc |
|---|---|
| Task routing | [`AI_INDEX.md`](AI_INDEX.md) |
| Doc dependencies | [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) |
| Page types in detail | [`strategy/metrics-and-page-types.md`](strategy/metrics-and-page-types.md) |
| Full site context | [`strategy/chill-dogs-context.md`](strategy/chill-dogs-context.md) |
| Writing articles | [`writing/article-writing-guide.md`](writing/article-writing-guide.md) |
| Amazon/affiliate rules | [`affiliate/amazon-associates-rules.md`](affiliate/amazon-associates-rules.md) |
| Engineering reference | [`engineering/architecture.md`](engineering/architecture.md) |
| Build commands | [`engineering/build-and-test-commands.md`](engineering/build-and-test-commands.md) |
| Finish any coding task | [`checklists/coding-agent-finish-checklist.md`](checklists/coding-agent-finish-checklist.md) |

---

## Related knowledge

- [`AI_INDEX.md`](AI_INDEX.md) — Full task-based routing table
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — Dependency chains between docs
- [`strategy/chill-dogs-context.md`](strategy/chill-dogs-context.md) — Deep context on the site
