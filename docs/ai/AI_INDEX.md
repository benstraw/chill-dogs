---
title: AI Knowledge Graph Index
type: index
domain: global
status: active
updated: 2026-05-06
tags:
  - chill-dogs
  - routing
  - index
related:
  - AGENT_START.md
  - KNOWLEDGE_GRAPH.md
  - strategy/metrics-and-page-types.md
---

# AI Knowledge Graph Index

This file routes agents to the right documentation for any task. Read the relevant section before doing work. Do not skip domain-specific docs.

## Use this when

You are starting any task and need to know which docs apply.

## Start here

- [`AGENT_START.md`](AGENT_START.md) — Operating brief: what the site is, business goal, core constraints
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — Dependency chains between docs
- [`strategy/metrics-and-page-types.md`](strategy/metrics-and-page-types.md) — Four page types, their jobs, and their metrics

---

## By task

### Writing an article collector

**Read:**
- [`writing/article-writing-guide.md`](writing/article-writing-guide.md) — Voice, structure, required modules, TOC/FAQ rules, schema
- [`writing/medical-and-vet-claim-guardrails.md`](writing/medical-and-vet-claim-guardrails.md) — What not to say about health and vets
- [`writing/product-copy-rules.md`](writing/product-copy-rules.md) — Product description language standards
- [`engineering/routes-and-sitemap.md`](engineering/routes-and-sitemap.md) — Registering new pages and using route constants
- [`engineering/seo-and-schema.md`](engineering/seo-and-schema.md) — Article JSON-LD, OG meta constraints

**Checklist:** [`checklists/article-publish-checklist.md`](checklists/article-publish-checklist.md)

---

### Creating or editing a converter page

**Read:**
- [`strategy/metrics-and-page-types.md`](strategy/metrics-and-page-types.md) — Converter job and required behavior
- [`writing/converter-writing-guide.md`](writing/converter-writing-guide.md) — Copy structure, length limits, anti-repetition rules
- [`affiliate/amazon-associates-rules.md`](affiliate/amazon-associates-rules.md) — AffiliateLink.astro, rel attributes, tag requirement
- [`affiliate/product-data-rules.md`](affiliate/product-data-rules.md) — Where product data lives, how to add products
- [`affiliate/disclosure-rules.md`](affiliate/disclosure-rules.md) — Disclosure placement rules
- [`writing/product-copy-rules.md`](writing/product-copy-rules.md) — Product description language
- [`engineering/routes-and-sitemap.md`](engineering/routes-and-sitemap.md) — Registering new converter pages

**Checklist:** [`checklists/converter-page-checklist.md`](checklists/converter-page-checklist.md)

---

### Adding products or Amazon links

**Read:**
- [`affiliate/amazon-associates-rules.md`](affiliate/amazon-associates-rules.md) — Required component, tag, and rel attributes
- [`affiliate/product-data-rules.md`](affiliate/product-data-rules.md) — Data file locations, how to add products, check:amazon, check:asins
- [`affiliate/disclosure-rules.md`](affiliate/disclosure-rules.md) — When and where to show disclosure
- [`writing/product-copy-rules.md`](writing/product-copy-rules.md) — Language rules for product descriptions

**Checklist:** [`checklists/converter-page-checklist.md`](checklists/converter-page-checklist.md)

---

### Creating Pinterest, newsletter, or marketing content

**Read:**
- [`marketing/pinterest-launch-plan.md`](marketing/pinterest-launch-plan.md) — Boards, pin format, cadence, CTA style
- [`marketing/newsletter-guide.md`](marketing/newsletter-guide.md) — Email format, tone, link rules
- [`marketing/utm-rules.md`](marketing/utm-rules.md) — UTM parameter format and examples
- [`marketing/marketing-plan.md`](marketing/marketing-plan.md) — Positioning, audience, channels, KPIs
- [`writing/medical-and-vet-claim-guardrails.md`](writing/medical-and-vet-claim-guardrails.md) — What not to claim

**Checklist:** [`checklists/marketing-publish-checklist.md`](checklists/marketing-publish-checklist.md)

---

### Changing routes, sitemap, schema, or architecture

**Read:**
- [`engineering/routes-and-sitemap.md`](engineering/routes-and-sitemap.md) — Route constants, sitemap inventory, system-definition
- [`engineering/architecture.md`](engineering/architecture.md) — Stack, data-driven pages, component reuse rules
- [`engineering/seo-and-schema.md`](engineering/seo-and-schema.md) — OG meta, JSON-LD, BreadcrumbList
- [`engineering/build-and-test-commands.md`](engineering/build-and-test-commands.md) — What to run before finishing
- [`strategy/metrics-and-page-types.md`](strategy/metrics-and-page-types.md) — Page type rules

**Checklist:** [`checklists/coding-agent-finish-checklist.md`](checklists/coding-agent-finish-checklist.md)

---

### Before finishing any coding task

**Read:**
- [`engineering/build-and-test-commands.md`](engineering/build-and-test-commands.md) — Which commands to run
- [`engineering/analytics-events.md`](engineering/analytics-events.md) — Preserve tracking attributes

**Checklist:** [`checklists/coding-agent-finish-checklist.md`](checklists/coding-agent-finish-checklist.md)

---

### Setting up an environment, or a script fails on a key or a network error

**Read:**
- [`engineering/environment-and-integrations.md`](engineering/environment-and-integrations.md) — Env vars and outbound hosts per script, plus local/web/CI/Vercel config
- [`engineering/build-and-test-commands.md`](engineering/build-and-test-commands.md) — What each command does

---

## Related knowledge

- [`AGENT_START.md`](AGENT_START.md) — Core operating brief
- [`KNOWLEDGE_GRAPH.md`](KNOWLEDGE_GRAPH.md) — How docs depend on each other
- [`strategy/chill-dogs-context.md`](strategy/chill-dogs-context.md) — Full site context
