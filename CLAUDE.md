# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server at localhost:4321
bun run build     # Static build to dist/
bun run preview   # Preview built site
```

## Governing Principles

This site is a **modular conversion system** governed by `docs/web-systems-adventure-mode.md`. Before any change, ask:

1. **Does this serve the keystone?** The primary metric is **affiliate revenue** (Amazon commissions). Every feature, component, and design choice must trace back to driving or supporting conversions. If it doesn't serve the keystone, question whether it belongs.
2. **What page type is this for?** Every page is exactly one of: converter, collector, attractor, informer. Know the type before touching it. Converters have one job and one CTA. Collectors route traffic to converters. Attractors convert campaign traffic. Informers are administrative. Don't blur the lines.
3. **Is this modular?** Components must be reusable workhorse modules — no hardcoded content, responsive, accessible, performant. Build for reuse. Showstopper (custom/complex) modules are used sparingly and never stacked. Don't over-engineer; don't under-abstract.
4. **Does this preserve clarity and speed?** Minimize friction between visitor and conversion. Fewer steps, fewer distractions, fast loads (sub-2s). Navigation stays minimal (≤5 links). Every page answers: "What is the single action this page exists to drive?"

## Content Guardrails

- Do not describe products or picks as "vet-recommended," "vet-approved," or similar unless the site has real, documented veterinarian sourcing for that exact claim.
- Do not imply Chill Dogs consulted veterinarians, commissioned veterinary reviews, or gathered veterinary endorsements when that did not happen.
- Prefer grounded language like `researched`, `compared`, `curated`, `popular`, or `practical` instead of medical-authority framing.

## Project Overview

Amazon affiliate dog lifestyle site built with **Astro 5** (SSG) and **bun**. Revenue comes from affiliate links to Amazon products. Deploy target is Netlify.

## Architecture

### Content System

Single `posts` collection defined in `src/content.config.ts` using Astro 5's Content Layer with `glob()` loader. All content lives in `src/data/posts/{category}/` as markdown files with YAML frontmatter.

**Page types** (frontmatter `pageType` field) determine layout, purpose, and metric. Each page has **one job** — if a page tries to do two things, split it or remove the secondary CTA.
- **converter** — Money pages. One CTA: buy via affiliate link. Metric: conversion rate. Uses `ConverterLayout.astro`.
- **collector** — SEO pages. Job: capture organic traffic and route it to converters. Metric: traffic volume + % routed to converters. Uses `PostLayout.astro`.
- **attractor** — Social/viral pages. Job: convert campaign/social traffic. Metric: campaign conversion rate. Uses `PostLayout.astro`.
- **informer** — Admin/legal pages (about, privacy, terms). Not metric-driven. Not in the collection.

**Categories**: `gift-guides`, `luxury-gear`, `blog` — each maps to a URL path and has its own `pages/{category}/index.astro` + `[...slug].astro`.

### Routing Pattern

Each category has an identical pair of route files. The `[...slug].astro` file selects `ConverterLayout` or `PostLayout` based on `pageType`. Content rendering uses Astro 5's `render(post)` from `astro:content` (not the old `post.render()` API).

Slug extraction uses helpers in `src/utils/collection-helpers.ts` — content IDs come from the glob loader as `category/filename` format.

### Styling

Vanilla CSS with custom properties (no Tailwind). Design tokens in `src/styles/tokens.css`. Components use Astro scoped `<style>` blocks. Six-color palette: sand, sage, sky, cream, terracotta, charcoal.

Self-hosted fonts via `@fontsource`: Nunito Variable (headings), Inter (body).

### Affiliate Link Requirements

All Amazon affiliate links **must** use the `AffiliateLink.astro` component which enforces `rel="nofollow sponsored noopener" target="_blank"` and adds `data-affiliate="true"` for click tracking. Products are defined in markdown frontmatter `products` array with affiliate URLs using tag `chill-dogs-20`.

### Path Aliases

`@components/`, `@layouts/`, `@styles/`, `@data/`, `@utils/` — configured in tsconfig.json.

## Adding Content

Create a markdown file in `src/data/posts/{category}/` with required frontmatter fields: `title`, `description`, `category`, `date`, `pageType`. Converter pages need a `products` array. Set `draft: true` to exclude from build.
