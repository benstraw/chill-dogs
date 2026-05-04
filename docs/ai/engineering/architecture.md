---
title: Engineering Architecture
type: canonical
domain: engineering
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - engineering
  - architecture
  - astro
  - bun
  - typescript
related:
  - routes-and-sitemap.md
  - build-and-test-commands.md
  - seo-and-schema.md
  - analytics-events.md
---

# Engineering Architecture

Tech stack, file structure, component reuse rules, and data-driven page conventions for chill-dogs.com.

## Use this when

Making any engineering change — adding pages, modifying components, creating data files, or changing the build pipeline.

---

## Core stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (full static build — SSG) |
| Package manager | Bun (1.3.6) |
| Language | TypeScript |
| Styling | Vanilla CSS with custom properties (no Tailwind) |
| Hosting | Vercel — auto-detects Astro, deploys on push to `main` |
| Testing | Vitest |
| Analytics | PostHog |

No CMS. No server. Content is code-first TypeScript data files or MDX articles.

---

## Source directories

| Path | Purpose |
|---|---|
| `src/pages/` | Astro page routes (static SSG pages) |
| `src/content/articles/` | MDX article files (auto-discovered by sitemap) |
| `src/components/` | Reusable Astro components |
| `src/layouts/` | Page layout wrappers (`BaseLayout.astro`, `ArticleLayout.astro`) |
| `src/data/` | TypeScript data files — routes, products, configs |
| `src/utils/` | Pure utility functions |
| `src/scripts/` | Pre-build scripts (run before Astro build) |
| `src/styles/` | Global CSS and design tokens |
| `src/__tests__/` | Vitest test files |
| `src/__mocks__/` | Module stubs for test isolation |
| `scripts/` | Post-build scripts (run after Astro build) |
| `public/` | Static assets served as-is |

**Important:** `src/scripts/` = pre-build. `scripts/` (root) = post-build. Wrong directory breaks the pipeline phase.

---

## Path aliases

Configured in `tsconfig.json`:

| Alias | Maps to |
|---|---|
| `@components/` | `src/components/` |
| `@layouts/` | `src/layouts/` |
| `@scripts/` | `src/scripts/` |
| `@styles/` | `src/styles/` |
| `@data/` | `src/data/` |
| `@utils/` | `src/utils/` |

Always use aliases in imports, not relative paths from `src/`.

---

## Component reuse rule

**Reuse existing modules first. Introduce new modules only when no existing module can satisfy page goals.**

- Two pages that share structure use one shared module with config inputs — never duplicated page scaffolding.
- Keep page-level differences in centralized data/config objects (copy, category keys, CTA targets, FAQ sets, section toggles).
- Avoid hardcoded content in components — pass content as props from data files.

---

## Data-driven pages

Converter pages are configured from data files:

- `src/data/cooling-converter-pages.ts` — cooling converter copy, CTA targets, FAQ sets
- `src/data/calming-converter-pages.ts` — calming converter config
- `src/data/relaxation-converter-pages.ts` — comfort/relaxation converter config

When a shared product appears on multiple converter pages, update the canonical product data file — not individual page configs — unless the change is explicitly page-specific.

---

## Layouts

- `BaseLayout.astro` — Global layout wrapper. Detects staging via `VERCEL_ENV !== 'production'` and injects `noindex, nofollow`. Auto-resolves OG image path. Emits BreadcrumbList JSON-LD on production only.
- `ArticleLayout.astro` — Wraps MDX article collector pages. Used by `src/content/articles/` entries.

---

## Styling

Vanilla CSS with custom properties. No runtime overhead.

- Design tokens: `src/styles/tokens.css`
- Components use Astro scoped `<style>` blocks
- Six-color palette: sand, sage, sky, cream, terracotta, charcoal
- Self-hosted fonts: Nunito Variable (headings), Inter (body)

---

## Images

- **Local images:** Use `<Image>` from `astro:assets` — never raw `<img>`. Astro optimizes at build time.
- **External images (Amazon CDN):** Use raw `<img>` — cannot be optimized at build time.
- **Original site photography:** Must be watermarked before use. See watermarking pipeline in build-and-test-commands.md.

---

## Build pipeline

Three phases run automatically via `bun run build`:

1. **Pre-build** (`src/scripts/`): `watermark-images.mjs` → `generate-og-images.mjs`
   - Generates `/public/og/<slug>.jpg` for every indexable route
   - CTA text per page type comes from `src/config/og-cta.mjs`

2. **Astro build**: outputs static HTML to `dist/`

3. **Post-build** (`scripts/`): `apply-first-page-image-og.mjs` → `apply-content-sitemap-share-preview.mjs` → `indexnow-submit.mjs`

---

## Content collections

- `src/content/config.ts` — Astro content collection schema for the `articles` collection
- `src/content/articles/` — MDX files. `canonicalPath` frontmatter = page URL
- MDX articles are **auto-discovered** — no manual registration in `content-sitemap.ts` needed
- All other page types require manual registration in `src/data/content-sitemap.ts`

---

## A/B experiment variants

- `/cooling/v/{a–g}/` — 7 cooling hub hero variants
- `/calming/v/{a–g}/` — 7 calming hub hero variants
- `/v/{v1–v5}/` — 5 homepage hero variants
- All are `noindex` with canonical pointing to the production hub URL
- Winners promoted to default; variant URLs retired

---

## Environment variables

| Variable | When needed | Purpose |
|---|---|---|
| `PUBLIC_POSTHOG_KEY` | Prod | PostHog analytics API key |
| `PUBLIC_POSTHOG_HOST` | Optional | PostHog ingest URL (defaults to `https://us.i.posthog.com`) |
| `PUBLIC_PINTEREST_TAG_ID` | Optional | Pinterest conversion pixel (production only) |
| `PUBLIC_BUTTONDOWN_FORM_ACTION` | Optional | Buttondown embed form URL |
| `PUBLIC_BUTTONDOWN_USERNAME` | Optional | Buttondown account name |
| `PUBLIC_SITE_URL` | Build | Site base URL for OG images, canonicals, llms.txt |
| `VERCEL_ENV` | Auto | Set by Vercel; controls staging noindex and Pinterest loading |
| `MAINTENANCE_MODE` | Optional | Any truthy value shows maintenance page at `/` |
| `INDEXNOW_KEY` | Prod | Key for IndexNow URL submission on deploy |
| `SERP_API_KEY` / `SEARCHAPI_KEY` | Scripts only | Amazon product metadata fetching |

---

## Related knowledge

- [`routes-and-sitemap.md`](routes-and-sitemap.md) — Route constants, sitemap inventory, system-definition
- [`build-and-test-commands.md`](build-and-test-commands.md) — All build and test commands
- [`analytics-events.md`](analytics-events.md) — PostHog event tracking
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta, JSON-LD, canonical URLs
