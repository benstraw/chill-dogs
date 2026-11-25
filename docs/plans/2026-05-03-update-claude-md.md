---
title: Update CLAUDE.md with Missing Architecture Details
type: plan
domain: engineering
status: executed
updated: 2026-05-03
tags:
  - chill-dogs
  - claude-md
  - documentation
  - engineering
related:
  - ../engineering/architecture.md
  - ../engineering/build-and-test-commands.md
  - ../engineering/routes-and-sitemap.md
---

# Plan: Update CLAUDE.md with Missing Architecture Details

## Context

CLAUDE.md (then 172 lines) was missing several areas that cause common agent mistakes: undocumented commands, missing env var reference, no build pipeline explanation, incomplete data architecture map, and a missing `@scripts/` path alias.

**Executed:** 2026-05-03
**Commit:** `a1d2137`

---

## Changes made

### Commands section — added 4 missing commands

```bash
bun run test                 # Run full vitest suite (build first — seo-meta test reads dist/)
bun run test:smoke           # Smoke tests only; builds the site internally
bun run test:coverage        # Coverage report for src/utils/**, src/scripts/**, src/data/**
bun run indexnow:submit      # Manually submit all URLs to IndexNow API
```

### Architecture section — added subsections

- **Key Data Files** — `routes.ts`, `product-catalog.ts`, `product-page-map.ts`, `collector-bodies.ts`, `amazon-products/`, converter page configs
- **Content Collections** — `src/content/articles/` MDX auto-discovery, `canonicalPath` frontmatter, topics matching
- **Build Pipeline** — 3-phase order: pre-build (`src/scripts/`) → Astro build → post-build (`scripts/` root). Distinction between the two script directories.
- **Layouts** — `BaseLayout` staging detection via `VERCEL_ENV`, BreadcrumbList on production only; `ArticleLayout` for MDX pages

### Path Aliases — added `@scripts/`

### Environment Variables — new reference table (10 variables)

### Quality Gates — added `bun run test:smoke` guidance and expanded coverage note to include `src/data/**`

## Related knowledge

- [Architecture](../engineering/architecture.md)
- [Build and Test Commands](../engineering/build-and-test-commands.md)
- [Routes and Sitemap](../engineering/routes-and-sitemap.md)
