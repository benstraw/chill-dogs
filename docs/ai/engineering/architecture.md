---
title: Engineering Architecture
type: canonical
domain: engineering
status: active
updated: 2026-08-29
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

The conversion surface (product cards + affiliate CTAs) is built from shared primitives. **Every converter product card must compose these — do not hand-roll a card surface, image frame, bullet list, or CTA stack.** A card that re-implements one silently drifts from the rest of the site: it misses shared fixes and picks up differences nobody chose (the flea/tick card did exactly this, and shipped with unmarked bullets, a tinted image background, and no shadow or hover until it was folded back onto the primitives).

**If a primitive cannot express what a card needs, add an opt-in prop to the primitive** — defaulted off so existing callers are untouched — rather than forking it locally. `ProductCardShell`'s `fill` and `id` props came from that path.

- **CTA buttons** — `src/styles/cta.css` defines the `.ui-cta` button and is imported globally in `BaseLayout`. Drive it through `MerchantAffiliateLink.astro`'s presentation props: `variant` (`primary` / `secondary` / `ghost`), `size` (`compact` / `standard` / `wide`), `tone` (`pillar` / `neutral` / `merchant`), rendered as `data-variant` / `data-size` / `data-tone`. Defaults: primary / standard / pillar. Passing any of the three opts the link into `.ui-cta`. Merchant-specific styling (e.g. Chewy blue) stays authoritative via the scoped `data-merchant` selector in `MerchantAffiliateLink`. Raw internal CTAs can use `class="ui-cta"` directly.
- **Product-card primitives** — `src/components/modules/primitives/`:
  - `ProductCardShell` — surface / radius / shadow / hover + padded body. Props: `fill` (card stretches to its grid row and the body grows, so CTAs line up across a row of cards with uneven copy), `id` (deep-link anchor). Both default off.
  - `ProductImageFrame` — 4:3 image shell, `<Image>` with width/height, `onerror` swap to the shared placeholder silhouette in the pillar accent, white tile behind the product photo.
  - `ProductBulletList` — `+`-marker list in the pillar accent. Required: `reset.css` sets `list-style: none` globally, so a hand-rolled `<ul>` renders with no marker at all.
  - `AffiliateOfferStack` — maps `getOffers(product)` to `MerchantAffiliateLink` with primary/secondary variants; `topGap` + `resolveLabel` props.

  The cooling / calming / comfort / gear / safety (flea-tick) cards all compose these. `BrowseProductCard` is the **only** sanctioned exception — its sand/border/footer layout is a different thing, not drift — and it still reuses `AffiliateOfferStack`. Card-specific extras with no primitive (badges, spec `<dl>`s, "Why it fits" / "Caution" notes) stay local to the card.
- **Disclosure bar** — `src/components/modules/primitives/DisclosureBar.astro` is the shared "Show N more" control: a full-width outlined bar (1px border + text in `--pillar-accent`, faint accent-tinted fill, 8px radius, 44px+ tap target, centred label with a chevron that rotates 180° on open). It is a native `<details>`/`<summary>` disclosure with no JS — the `<summary>` stays the focusable, keyboard-toggleable control, and the label swaps on `[open]` in CSS so only the active label is in the accessibility tree. Props: `label`, `expandedLabel` (defaults to `label`), `open`, `id`; slot content is what expands. Use it instead of a bare `<summary>` text link anywhere a section hides overflow items, and let it inherit the page's pillar accent rather than hard-coding `--color-accent`.
- **Product grids** — `.ui-grid` / `.ui-grid--1` / `--2` / `--3` in `src/styles/utilities.css` is the shared product-grid vocabulary. It owns columns / gap / responsive only; callers keep their own page-specific max-width, centering, and margins. Canonical collapse: 3→2 cols at 1024px, any 2→1 col at 768px. Used by the converter, cooling, and gear product grids. The separate `.cards-grid--*` family is for collector hub grids; `shop/` uses a bespoke compact catalog grid (left intentionally separate).

---

## Images

- **Local images:** Use `<Image>` from `astro:assets` — never raw `<img>`. Astro optimizes at build time.
- **External images (Amazon / Chewy CDN):** Cannot be optimized at build time (no `image.domains` configured). Product images must go through the `ProductImageFrame` primitive, which renders them via `<Image>` — remote URLs pass through unchanged, but you still get the width/height attributes that prevent layout shift and the `onerror` fallback to the placeholder. Raw `<img>` is acceptable only for external images outside a product card.
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
- `src/data/product-galleries.ts` — tool-managed multi-image galleries keyed by product id,
  written by `bun run admin:serve`. Read it through `getProductImages()` in
  `src/data/products/images.ts`, which prefers a record-level `images` override, then this
  store, then the product's single `image`. Galleries render only on `/shop/<id>/` detail
  pages; converter cards stay single-image.
- `src/content/articles/` — MDX files. `canonicalPath` frontmatter = page URL
- MDX articles are **auto-discovered** — no manual registration in `content-sitemap.ts` needed
- All other page types require manual registration in `src/data/content-sitemap.ts`

---

## A/B experiment variants

- `/v/{v1–v5}/` — 5 homepage hero variants
- All are `noindex` with canonical pointing to the homepage
- The retired `/cooling/v/` and `/calming/v/` section hero routes are no longer built
- Section collectors share `SectionHero.astro`, with pillar-specific content and theme tokens supplied by `src/data/section-collectors.ts`

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
| `GITHUB_OAUTH_CLIENT_ID` | Vercel Production | GitHub OAuth App client id for admin sign-in |
| `GITHUB_OAUTH_CLIENT_SECRET` | Vercel Production | GitHub OAuth App client secret |
| `ADMIN_SESSION_SECRET` | Vercel Production | HMAC key for the admin session cookie |
| `ADMIN_GITHUB_LOGINS` | Vercel Production | Comma-separated GitHub logins allowed into `/admin/*` |
| `ADMIN_USERNAME` | Vercel Preview (fallback) | HTTP Basic Auth username for all `/admin/*` routes |
| `ADMIN_PASSWORD` | Vercel Preview (fallback) | HTTP Basic Auth password for all `/admin/*` routes |
| `SERP_API_KEY` / `SEARCHAPI_KEY` | Scripts only | Amazon product metadata fetching |

### Admin route protection

Root `middleware.js` is dependency-free Vercel Routing Middleware scoped by its matcher to `/admin/:path*`. It protects the otherwise static admin HTML before CDN content is served. Authorized requests return Vercel's `x-middleware-next` continuation response. The middleware uses Vercel's default Edge runtime and imports no packages. Bun is the sole package manager: the repository keeps only `bun.lock`, and Vercel installs dependencies with `bun install`. Do not add an npm lockfile because Vercel's isolated middleware packager will otherwise select npm despite the Bun package-manager declaration.

There are two ways in, and both end in the same signed session cookie:

- **GitHub OAuth (primary).** `/admin/auth/login/` mints a `state`, stores it in the short-lived `cd_admin_state` cookie, and redirects to GitHub with no scopes requested. `/admin/auth/callback/` verifies the state, exchanges the code, reads `login` from `GET https://api.github.com/user`, and checks it case-insensitively against `ADMIN_GITHUB_LOGINS`. The GitHub access token is used once and never stored.
- **HTTP Basic (fallback).** A correct `Authorization: Basic` header is accepted on any admin path, and `/admin/auth/basic/` issues the challenge in a browser. This exists because a GitHub OAuth App registers exactly one callback URL, so Vercel preview deployments — which get generated hostnames — cannot use GitHub login.

The session cookie `cd_admin_session` is `v1.<base64url(payload)>.<base64url(HMAC-SHA256)>` signed with `ADMIN_SESSION_SECRET` via `crypto.subtle`, valid for 8 hours, and set `HttpOnly; SameSite=Lax; Path=/admin` plus `Secure` on https. `/admin/auth/logout/` clears it. None of the `/admin/auth/*` routes is a built page — they exist only at the edge, which is why `src/data/routes.ts` exports `MIDDLEWARE_ONLY_ROUTES` for the smoke suite's link-integrity check to skip.

Configuration fails closed. Nothing configured returns 503; GitHub configured with an empty `ADMIN_GITHUB_LOGINS` also returns 503, so an empty allowlist can never read as "any GitHub account". With only `ADMIN_USERNAME` / `ADMIN_PASSWORD` set, every admin path falls back to a plain 401 Basic challenge. Unauthenticated browser requests in GitHub mode get a 302 to `/admin/auth/login/`, and the `next` parameter is only honored when it resolves inside `/admin/`.

Astro's local dev server does not execute this Vercel middleware. For local end-to-end verification, add the variables to the gitignored root `.env` and restart `vercel dev`; Vercel CLI 54 selects the existing `.env` for middleware and ignores `.env.local` and `.vercel/.env.development.local` during local execution.

---

## Related knowledge

- [`routes-and-sitemap.md`](routes-and-sitemap.md) — Route constants, sitemap inventory, system-definition
- [`build-and-test-commands.md`](build-and-test-commands.md) — All build and test commands
- [`analytics-events.md`](analytics-events.md) — PostHog event tracking
- [`seo-and-schema.md`](seo-and-schema.md) — OG meta, JSON-LD, canonical URLs
