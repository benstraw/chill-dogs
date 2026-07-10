---
title: Engineering Architecture
type: canonical
domain: engineering
status: active
updated: 2026-06-10
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
- `src/data/section-collectors.ts` — cooling, calming, and comfort section collector metadata, hero config, topic subsection grouping, topic coverage, priority ordering, dynamic card inventory, and `CollectionPage.hasPart` schema

When a shared product appears on multiple converter pages, update the canonical product data file — not individual page configs — unless the change is explicitly page-specific.

---

## Layouts

- `BaseLayout.astro` — Global layout wrapper. Detects staging via `VERCEL_ENV !== 'production'` and injects `noindex, nofollow`. Auto-resolves OG image path. Emits BreadcrumbList JSON-LD on production only.
- `ArticleLayout.astro` — Wraps MDX article collector pages. Used by `src/content/articles/` entries.

---

## Styling

Vanilla CSS with custom properties. No runtime overhead.

- Design tokens: `src/styles/tokens.css`
- Per-pillar theming: `src/data/pillar-themes.ts` injects `--pillar-*` CSS vars inline at the layout level (cooling / calming / comfort). Themed pages also set `--color-primary` to the pillar accent, so `--pillar-accent` and `--color-primary` resolve to the same value on themed pages.
- Components use Astro scoped `<style>` blocks for component-specific styling.
- Six-color palette: sand, sage, sky, cream, terracotta, charcoal
- Self-hosted fonts: Nunito Variable (headings), Inter (body)

### Shared conversion UI system

The conversion surface (product cards + affiliate CTAs) is built from shared primitives. **Prefer these over bespoke per-component CSS** when building or editing product cards, CTAs, or product grids.

- **CTA buttons** — `src/styles/cta.css` defines the `.ui-cta` button and is imported globally in `BaseLayout`. Drive it through `MerchantAffiliateLink.astro`'s presentation props: `variant` (`primary` / `secondary` / `ghost`), `size` (`compact` / `standard` / `wide`), `tone` (`pillar` / `neutral` / `merchant`), rendered as `data-variant` / `data-size` / `data-tone`. Defaults: primary / standard / pillar. Passing any of the three opts the link into `.ui-cta`. Merchant-specific styling (e.g. Chewy blue) stays authoritative via the scoped `data-merchant` selector in `MerchantAffiliateLink`. Raw internal CTAs can use `class="ui-cta"` directly.
- **Product-card primitives** — `src/components/modules/primitives/`: `ProductCardShell` (surface / radius / shadow / hover + padded body), `ProductImageFrame` (4:3 image shell + shared placeholder), `ProductBulletList` (`+`-marker list), `AffiliateOfferStack` (maps `getOffers(product)` to `MerchantAffiliateLink` with primary/secondary variants; `topGap` + `resolveLabel` props). The cooling / calming / comfort cards compose these; `BrowseProductCard` keeps a bespoke sand/footer shell and only reuses `AffiliateOfferStack`.
- **Product grids** — `.ui-grid` / `.ui-grid--1` / `--2` / `--3` in `src/styles/utilities.css` is the shared product-grid vocabulary. It owns columns / gap / responsive only; callers keep their own page-specific max-width, centering, and margins. Canonical collapse: 3→2 cols at 1024px, any 2→1 col at 768px. Used by the converter, cooling, and gear product grids. The separate `.cards-grid--*` family is for collector hub grids; `shop/` uses a bespoke compact catalog grid (left intentionally separate).

---

## Images

- **Local images:** Use `<Image>` from `astro:assets` — never raw `<img>`. Astro optimizes at build time.
- **External images (Amazon CDN):** Cannot be optimized at build time (no `image.domains` configured). The `ProductImageFrame` primitive renders product images via `<Image>`, which passes remote Amazon URLs through unchanged; outside the primitive, raw `<img>` is also acceptable for external images.
- **Original site photography:** Must be watermarked before use. See watermarking pipeline in build-and-test-commands.md.

---

## Build pipeline

Three phases run automatically via `bun run build`:

1. **Pre-build** (`src/scripts/`): `watermark-images.mjs` → `generate-og-images.mjs`
   - Generates `/public/og/<slug>.jpg` for every eligible route
   - CTA text per page type comes from `src/config/og-cta.mjs`

2. **Astro build**: outputs static HTML to `dist/`

3. **Post-build** (`scripts/`): `apply-first-page-image-og.mjs` → `apply-sitemap-share-preview.mjs` → `indexnow-submit.mjs`

---

## Content collections

- `src/content/config.ts` — Astro content collection schema for the `articles` collection
- `src/content/articles/` — MDX files. `canonicalPath` frontmatter = page URL
- MDX articles are **auto-discovered** — no manual registration in `content-sitemap.ts` needed
- All other page types require manual registration in `src/data/content-sitemap.ts`

---

## A/B experiment variants

- `/cooling/v/{a–i}/` — cooling section collector hero variants
- `/calming/v/{a–h}/` — calming section collector hero variants
- `/v/{v1–v5}/` — 5 homepage hero variants
- All are `noindex` with canonical pointing to the production collector URL
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
| `ADMIN_USERNAME` | Vercel Production + Preview | HTTP Basic Auth username for all `/admin/*` routes |
| `ADMIN_PASSWORD` | Vercel Production + Preview | HTTP Basic Auth password for all `/admin/*` routes |
| `SERP_API_KEY` / `SEARCHAPI_KEY` | Scripts only | Amazon product metadata fetching |

### Admin route protection

Root `middleware.js` is dependency-free Vercel Routing Middleware scoped by its matcher to `/admin/:path*`. It protects the otherwise static admin HTML with HTTP Basic Authentication before CDN content is served. Authorized requests return Vercel's `x-middleware-next` continuation response. The middleware uses Vercel's default Edge runtime and imports no packages. Vercel CLI 55 nevertheless launches `npm` unconditionally during Routing Middleware packaging, so deployment installation is pinned to npm 10 and `.npmrc` enables legacy peer resolution for the existing Astro/MDX disagreement; the site build and local development scripts continue to use Bun. Credentials must come from `ADMIN_USERNAME` and `ADMIN_PASSWORD` environment variables and must never be committed. Missing configuration fails closed with HTTP 503; missing or invalid credentials return HTTP 401 with a Basic Auth challenge. Astro's local dev server does not execute this Vercel middleware. For local end-to-end verification in this repository, add both variables to the gitignored root `.env` and restart `vercel dev`; Vercel CLI 54 selects the existing `.env` for middleware and ignores `.env.local` and `.vercel/.env.development.local` during local execution.

---

## Related knowledge

- [`routes-and-sitemap.md`](routes-and-sitemap.md) — Route constants, sitemap inventory, system-definition
- [`build-and-test-commands.md`](build-and-test-commands.md) — All build and test commands
- [`analytics-events.md`](analytics-events.md) — PostHog event tracking
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta, JSON-LD, canonical URLs
