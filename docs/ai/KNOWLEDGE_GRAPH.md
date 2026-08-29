---
title: Knowledge Graph — Doc Dependency Chains
type: reference
domain: global
status: active
updated: 2026-05-06
tags:
  - chill-dogs
  - knowledge-graph
  - dependencies
related:
  - AI_INDEX.md
  - AGENT_START.md
  - strategy/web-systems.md
---

# Knowledge Graph

Shows how docs depend on each other. Use this to find related context when one doc references concepts you need more detail on.

## Use this when

You need to understand how a doc relates to other docs, or you want to find the upstream context for a specific rule.

---

## Core dependency chain

Everything depends on these three in order:

```
docs/web-systems-adventure-mode.md        # Framework: modular conversion system theory
    ↓
strategy/web-systems.md                   # How that framework applies to chill-dogs
    ↓
strategy/metrics-and-page-types.md        # Four page types with jobs, metrics, behavior
    ↓
strategy/chill-dogs-context.md            # Full site context: pages, tech, brand, categories
```

Start at `web-systems.md` if you're unsure why a rule exists. The framework explains the reasoning.

---

## Article work chain

```
AGENT_START.md                            # Quick constraints
    ↓
strategy/metrics-and-page-types.md        # collector · article type and required behavior
    ↓
writing/article-writing-guide.md          # Voice, structure, modules, TOC, FAQ, schema
    ↓
writing/medical-and-vet-claim-guardrails.md   # What not to say about health
    ↓
writing/product-copy-rules.md             # Product description language when cards appear
    ↓
engineering/routes-and-sitemap.md         # Registering the page in sitemap inventory
    ↓
engineering/seo-and-schema.md             # Article JSON-LD, OG meta limits
    ↓
checklists/article-publish-checklist.md   # Final gate
```

---

## Converter work chain

```
AGENT_START.md
    ↓
strategy/metrics-and-page-types.md        # converter type: one job, one CTA
    ↓
affiliate/amazon-associates-rules.md      # AffiliateLink.astro, tag, rel attributes
    ↓
affiliate/product-data-rules.md           # Data files, product catalog, check:amazon, check:asins
    ↓
affiliate/disclosure-rules.md             # Where disclosure must appear
    ↓
writing/converter-writing-guide.md        # Copy structure, length limits, anti-repetition rules
    ↓
writing/product-copy-rules.md             # Product description language guardrails
    ↓
engineering/routes-and-sitemap.md         # Register in sitemap, use route constants
    ↓
engineering/seo-and-schema.md             # OG meta, schema
    ↓
checklists/converter-page-checklist.md    # Final gate
```

---

## Marketing work chain

```
strategy/chill-dogs-context.md            # Audience, categories, positioning
    ↓
marketing/marketing-plan.md               # Channels, KPIs, organic-first posture
    ↓
marketing/pinterest-launch-plan.md        # Boards, pin format, cadence, CTA style
    ↓
marketing/utm-rules.md                    # UTM parameter format for external links
    ↓
marketing/newsletter-guide.md             # Email format and link rules
    ↓
marketing/charity-outreach-program.md     # Charity relationships, spotlight coordination, tracker
    ↓
marketing/charity-outreach-templates.md   # Email copy for each touch in the sequence
    ↓
writing/medical-and-vet-claim-guardrails.md   # What not to claim in marketing copy
    ↓
checklists/marketing-publish-checklist.md # Final gate
```

---

## Engineering work chain

```
engineering/architecture.md               # Astro 5, Bun, SSG, file structure
    ↓
engineering/routes-and-sitemap.md         # Routes, sitemap inventory, system-definition
    ↓
engineering/analytics-events.md           # PostHog, data-track pattern, keystone event
    ↓
engineering/seo-and-schema.md             # Canonical URLs, OG meta, JSON-LD
    ↓
engineering/build-and-test-commands.md    # What to run before finishing
    ↓
engineering/environment-and-integrations.md   # Env vars, network allowlist, CI, session setup
    ↓
checklists/coding-agent-finish-checklist.md   # Final gate
```

---

## Affiliate compliance chain

```
affiliate/amazon-associates-rules.md      # Tag, component, rel attributes, compliance
    ↓
affiliate/product-data-rules.md           # Where data lives, how to add products
    ↓
affiliate/disclosure-rules.md             # FTC disclosure placement
    ↓
writing/product-copy-rules.md             # Language standards for product claims
    ↓
writing/medical-and-vet-claim-guardrails.md   # Health and vet claim guardrails
```

---

## Related knowledge

- [`AI_INDEX.md`](AI_INDEX.md) — Task-based routing table
- [`AGENT_START.md`](AGENT_START.md) — Quick operating brief
- [`strategy/web-systems.md`](strategy/web-systems.md) — Framework theory
