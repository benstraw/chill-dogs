---
title: Create AI Knowledge Graph under docs/ai/
type: plan
domain: global
status: executed
updated: 2026-05-03
tags:
  - chill-dogs
  - knowledge-graph
  - documentation
  - ai
related:
  - ../AI_INDEX.md
  - ../AGENT_START.md
  - ../KNOWLEDGE_GRAPH.md
---

# Plan: Create AI Knowledge Graph under docs/ai/

## Context

CLAUDE.md had grown to contain the entire project brain in a single file, making it hard to maintain, easy to contradict, and poorly scoped for different agent types (coding, writing, marketing, affiliate). The goal was to decompose it into a navigable knowledge graph under `docs/ai/` so agents can read only what's relevant to their task.

**Executed:** 2026-05-03
**Commit:** `e8fba20`

---

## Changes made

### Created `docs/ai/` — 25 files across 6 domains

**Top-level:**
- `AI_INDEX.md` — routes agents by task type
- `AGENT_START.md` — short operating brief
- `KNOWLEDGE_GRAPH.md` — dependency chains between docs

**`strategy/`**
- `web-systems.md` — Web Systems Adventure Mode framework: keystone metric, page types, module system, conversion flow
- `chill-dogs-context.md` — business model, categories, page map, tech stack, brand, affiliate tag
- `metrics-and-page-types.md` — four page types with jobs, metrics, required behavior, invalid behavior table

**`writing/`**
- `article-writing-guide.md` — persona, tone, module order, TOC/FAQ rules, schema, conversion integration
- `product-copy-rules.md` — researched/compared language, no fake testing, no vet claims
- `medical-and-vet-claim-guardrails.md` — avoid/use-instead table, emergency escalation language

**`marketing/`**
- `marketing-plan.md` — positioning, audience, channels, KPIs, organic-first posture
- `pinterest-launch-plan.md` — boards, pin topics, cadence, description template, UTM rules
- `newsletter-guide.md` — format template, voice, Buttondown setup
- `utm-rules.md` — lowercase convention, Pinterest/newsletter examples

**`engineering/`**
- `architecture.md` — Astro 5, Bun, SSG, file structure, path aliases, build pipeline
- `routes-and-sitemap.md` — ROUTES object, sitemap layers, MDX auto-discovery, when to update
- `analytics-events.md` — PostHog, events table, data-track pattern, AffiliateLink tracking
- `build-and-test-commands.md` — all 8 package scripts documented
- `seo-and-schema.md` — OG meta constraints, JSON-LD types, OG image generation

**`affiliate/`**
- `amazon-associates-rules.md` — tag, AffiliateLink.astro, compliance
- `product-data-rules.md` — data file locations, master catalog, how to add products
- `disclosure-rules.md` — FTC placement on converter/collector/article pages

**`checklists/`**
- `article-publish-checklist.md` — 18-item gate
- `converter-page-checklist.md` — 16-item gate
- `coding-agent-finish-checklist.md` — 12-item engineering finish gate
- `marketing-publish-checklist.md` — 12-item marketing publish gate

### Created `scripts/validate-ai-docs.mjs`

Node.js validation script (no external deps). Checks:
- YAML frontmatter presence and required keys
- `## Use this when` section
- `## Related knowledge` section
- Relative Markdown links resolve to existing files

Added `"check:ai-docs": "node scripts/validate-ai-docs.mjs"` to `package.json`.

### Refactored `CLAUDE.md`

Reduced from 228 lines to 59 lines. Now a bootloader pointing to `docs/ai/`. Retained: commands table, SEO meta constraints, content guardrails, source-of-truth files, core rules.

## Related knowledge

- [AI Index](../AI_INDEX.md)
- [Agent Start](../AGENT_START.md)
- [Knowledge Graph](../KNOWLEDGE_GRAPH.md)
