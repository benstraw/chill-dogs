# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev       # Start dev server at localhost:4321
bun run build     # Static build to dist/
bun run preview   # Preview built site
```

## Source Of Truth

- `docs/system-definition.yaml` defines this project as a modular conversion system.
- Keep `docs/system-definition.yaml` updated whenever pages, routes, page types, module stacks, navigation, or conversion flow change.
- AI-assisted page changes are incomplete unless this file remains accurate.

## Governing Principles

This site is a **modular conversion system** governed by `docs/web-systems-adventure-mode.md`. Before any change, ask:

1. **Does this serve the keystone?** The primary metric is **affiliate revenue** (Amazon commissions). Every feature, component, and design choice must trace back to driving or supporting conversions. If it doesn't serve the keystone, question whether it belongs.
2. **What page type is this for?** Every page is exactly one of: converter, collector, attractor, informer. Know the type before touching it. Converters have one job and one CTA. Collectors route traffic to converters. Attractors convert campaign traffic. Informers are administrative. Don't blur the lines.
3. **Is this modular?** Components must be reusable workhorse modules — no hardcoded content, responsive, accessible, performant. Build for reuse. Showstopper (custom/complex) modules are used sparingly and never stacked. Don't over-engineer; don't under-abstract.
4. **Does this preserve clarity and speed?** Minimize friction between visitor and conversion. Fewer steps, fewer distractions, fast loads (sub-2s). Navigation stays minimal (≤5 links). Every page answers: "What is the single action this page exists to drive?"

## AI Build Contract (Strict)

### Terminology

- Use only these page-type terms: `converter`, `collector`, `attractor`, `informer`.
- Do not use "hub" in specs, comments, or implementation notes. Use `collector`.

### Architecture Rules

- Every new page must have one declared page type before implementation.
- If two or more pages share structure, use one reusable composer/module plus config inputs instead of duplicating page scaffolding.
- Keep page-level differences in centralized data/config objects (copy, category keys, CTA targets, FAQ sets, section toggles).
- Avoid hardcoded internal route strings in page bodies when centralized route constants exist.
- Reuse existing modules first; introduce new modules only when no existing module can satisfy page goals.

### Converter Rules

- `converter` pages should render this stack unless scope explicitly says otherwise:
- `Hero`, comparison/product sections, `FAQ` when data exists, `Disclosure`, internal links to related converters/collectors.
- Above-the-fold CTA should prioritize high-intent conversion behavior.
- All Amazon outbound links must use `AffiliateLink.astro`.

### Collector Rules

- `collector` pages must route users to relevant `converter` pages.
- Require at least one above-the-fold route to a `converter`.
- `collector` pages should aggregate and route intent; avoid duplicating full converter-style comparison implementations.

### Quality Gates

- Validate internal routes (no dead or malformed links).
- Validate modularity (no repeated scaffolding where shared module/config patterns should be used).
- Run `bun run test` and `bun run build` for substantive page/module changes.
- Changes to `src/utils/**` or `src/scripts/**` require updated unit tests.

## Content Guardrails

- Do not describe products or picks as "vet-recommended," "vet-approved," or similar unless the site has real, documented veterinarian sourcing for that exact claim.
- Do not imply chill-dogs consulted veterinarians, commissioned veterinary reviews, or gathered veterinary endorsements when that did not happen.
- Prefer grounded language like `researched`, `compared`, `curated`, `popular`, or `practical` instead of medical-authority framing.

## Project Overview

Amazon affiliate dog lifestyle site built with **Astro 5** (SSG) and **bun**. Revenue comes from affiliate links to Amazon products. Deploy target is Vercel.

## Architecture

- Astro 5 static routes with modular section components.
- Shared render patterns should be driven by centralized data/config inputs rather than duplicated page markup.
- The active page model is based on explicit routes and page-type behavior (`converter`, `collector`, `attractor`, `informer`), not freeform category templates.

### Styling

Vanilla CSS with custom properties (no Tailwind). Design tokens in `src/styles/tokens.css`. Components use Astro scoped `<style>` blocks. Six-color palette: sand, sage, sky, cream, terracotta, charcoal.

Self-hosted fonts via `@fontsource`: Nunito Variable (headings), Inter (body).

### Affiliate Link Requirements

All Amazon affiliate links **must** use the `AffiliateLink.astro` component which enforces `rel="nofollow sponsored noopener" target="_blank"` and adds `data-affiliate="true"` for click tracking. Products are defined in TypeScript data files (`src/data/cooling-products.ts`, `src/data/calming-products.ts`) with affiliate URLs using tag `chill-dogs-20`.

Amazon Associates Program Policies (operating agreement): <https://affiliate-program.amazon.com/help/operating/policies>. Refer to this when making decisions about affiliate link usage, product claims, pricing display, trademark usage, or any compliance questions.

### Images

All local images **must** use the `<Image>` component from `astro:assets` — never raw `<img>` tags. Astro optimizes local images at build time (format conversion, compression, responsive sizing). Use raw `<img>` only for external URLs (e.g. Amazon CDN) that cannot be optimized at build time.

### Path Aliases

`@components/`, `@layouts/`, `@styles/`, `@data/`, `@utils/` — configured in tsconfig.json.

## Analytics

Event tracking uses `src/scripts/analytics.ts`. The `track(eventName, props)` function fires to PostHog (`window.posthog.capture`) when configured, falling back to `console.log` in dev.

- `src/components/Analytics.astro` calls `init()` once globally — **do not** add per-page `init()` calls.
- Wire events via `data-track="event_name"` on elements; extra `data-*` attrs become props.
- Amazon outbound clicks use `data-track="amazon_outbound_click"` with `data-asin` and `data-product-name`.
- All affiliate links must use `AffiliateLink.astro` (enforces `data-affiliate="true"`, `rel`, `target`).

### PostHog Setup

1. Create a project at [posthog.com](https://posthog.com).
2. Copy the **Project API Key** from Project Settings.
3. Set `PUBLIC_POSTHOG_KEY=<your-key>` in `.env` (and in your Vercel environment variables).
4. Optionally set `PUBLIC_POSTHOG_HOST` — defaults to `https://us.i.posthog.com`; use `https://eu.i.posthog.com` for EU cloud or your self-hosted URL.
5. PostHog is used for experiments (A/B tests via Feature Flags), funnel analysis, and session recordings.
