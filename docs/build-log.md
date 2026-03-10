---
type: log
tags: [build, history]
created: 2026-02-28
---

# chill-dogs — Build Log

A chronological record of how the site was built, what was prioritized at
each phase, and the reasoning behind key decisions. Synthesized from git
history, existing documentation, and the codebase as of 2026-02-28.

---

## Phase 1 — Strategy

**Goal:** Define the keystone metric, identify the two core content
categories, and map out the page inventory before touching any code.

### Decisions made

**Keystone metric: Amazon affiliate revenue.**
All other metrics (traffic, engagement, click-through rate) are supporting
metrics that exist only to drive the keystone.

**Two revenue categories chosen: Cooling and Calming.**
- Cooling has strong seasonal buying intent (May–September) and a clear
  product taxonomy: mats, bandanas, vests, freezable toys.
- Calming is evergreen and complements cooling (anxious dogs are often also
  hot dogs in summer). Product taxonomy: anxiety wraps, calming treats, lick
  mats, snuffle mats.

**Page type taxonomy established:**
The Web Systems Adventure Mode framework (`docs/web-systems-adventure-mode.md`)
defines four page types: converter, collector, attractor, informer. Each page
was assigned exactly one type before any page was built. See
`docs/site-plan.md` for the full page inventory.

**Affiliate tag locked: `chill-dogs-20`.**
All Amazon URLs use this tag. The `AffiliateLink.astro` component was made
mandatory to prevent plain `<a>` tags from bypassing tracking or missing the
required `rel` attributes.

---

## Phase 2 — Architecture

**Goal:** Choose the tech stack, define the data model, and build the
scaffolding before writing any content.

### Tech stack decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Astro 5 (SSG) | Static HTML from CDN; no server round-trips; excellent Core Web Vitals |
| Package manager | Bun | Faster installs and script execution than npm/yarn |
| Styling | Vanilla CSS + custom properties | Zero runtime overhead; tokens in one file |
| Fonts | @fontsource Nunito Variable + Inter | Self-hosted; no Google Fonts DNS lookup |
| Deploy | Vercel (primary) + netlify.toml (fallback) | Both support Astro SSG out of the box |

### Data model

Two typed TypeScript data files were created for the core revenue categories:

- `src/data/cooling-products.ts` — 11 cooling products (3 mats, 2 bandanas,
  3 vests, 2 freezable toys, 1 bonus) + 4 car-cooling products (magnetic window
  shades, clip-on fan, collapsible bowl, seat hammock). Includes `CategoryMeta`
  for each subcategory (titles, FAQs, internal links).
- `src/data/calming-products.ts` — 8 calming products (1 anxiety wrap, 3
  calming treats, 2 lick mats, 2 snuffle mats).

Both files export typed interfaces and helper functions (`getProductsByCategory`,
`getCalmingProductsByCategory`, `getBonusProduct`) used by the page templates.

**Why typed TS instead of markdown?**
Product data is queried, filtered, and sorted programmatically. Typescript
interfaces give compile-time safety that markdown frontmatter alone cannot.

An Astro content collection (`src/content.config.ts`) was set up for
markdown-driven categories: `blog/`, `gift-guides/`, `luxury-gear/`. The glob
loader + Zod schema validates frontmatter fields at build time.

### Styling foundation

`src/styles/tokens.css` defines the complete design token set:
- Six-color palette: sand, sage, sky, cream, terracotta, charcoal
- Type scale, spacing scale, border radii
- Transition speed tokens

`src/styles/reset.css` — minimal CSS reset.
`src/styles/utilities.css` — `.sr-only` and other utilities.

### Path aliases

Configured in `tsconfig.json`:
```
@components/ → src/components/
@layouts/    → src/layouts/
@styles/     → src/styles/
@data/       → src/data/
@utils/      → src/utils/
```

### Layout shell

`src/layouts/BaseLayout.astro` was built as the HTML shell with:
- Full meta tag set (title, description, canonical, OG, Twitter card)
- `noindex` flag support (used for experiment variants and staging)
- Dynamic `--color-nav-accent` CSS variable for per-category theming
- `<slot name="head">` for JSON-LD and per-page script injection
- Header + Footer + Analytics components

---

## Phase 3 — Module Library

**Goal:** Build all workhorse modules before writing page content.
Modules are built once and reused everywhere.

### Modules built (roughly in order)

**Structural**
- `Header.astro` — Site header with minimal navigation (≤5 links)
- `Footer.astro` — Footer with legal links, final CTA
- `Analytics.astro` — GA4 script injection with environment guard

**Product display**
- `CoolingProductCard.astro` — Individual cooling product card with 3 bullet
  points, bestFor, and affiliate CTA. Supports `kind: 'internal'` for routing
  to converter pages vs. `kind: 'affiliate'` for direct Amazon links.
- `CoolingProductGrid.astro` — Grid wrapper
- `CalmingProductCard.astro` — Calming product card; includes `howItHelps` and
  `considerIf` fields to guide purchase decisions without overstepping medical
  authority
- `CalmingUseTable.astro` — Category comparison table for calming product types
- `ComparisonTable.astro` — Generic comparison table

**Page-structure**
- `Hero.astro` — Static hero for converter/collector pages (not A/B-tested)
- `SummaryBlock.astro` — Above-fold "Quick Picks" summary on pillar pages;
  routes users to converter pages immediately without requiring scroll
- `Toc.astro` — Sticky table of contents for long-form pillar pages
- `FAQ.astro` — Structured FAQ with schema-ready markup
- `BonusCallout.astro` — Highlighted bonus product (NASA-inspired bed) section
- `Disclosure.astro` — Inline affiliate disclosure for use inside page content
- `AffiliateDisclosure.astro` — Full affiliate disclosure component

**Navigation and cross-linking**
- `InternalLinkStrip.astro` — Bottom-of-page internal link bar for navigation
  between converter pages without leaving the category
- `RelatedGuides.astro` — Cross-category recommendation cards (cooling → calming
  and vice versa)

**Hub content**
- `CoolingHubBody.astro` — Category card grid for the cooling hub page
- `CalmingHubBody.astro` — Category card grid for the calming hub page
- `HomepageBody.astro` — "Top Guides" + "Latest Posts" below-fold homepage
  content; shared between `/` and all `/v/vN/` experiment variants

**SEO**
- `JsonLd.astro` — Injects JSON-LD structured data into `<head>`
- `StructuredData.astro` — Additional structured data helpers
- `PostCard.astro` — Card component for markdown-collection posts (blog,
  gift-guides)
- `TopPicks.astro` — "Top Picks" editorial module for collector pages

**AffiliateLink enforcement**
- `AffiliateLink.astro` — Mandatory wrapper for all Amazon affiliate links.
  Enforces `rel="nofollow sponsored noopener"`, `target="_blank"`, and
  `data-affiliate="true"` for click tracking.

---

## Phase 4 — Page Build-out

**Goal:** Build all pages using the module library.

### Cooling pages built

1. `/cooling/` (attractor) — Hub page with `HeroExperiment` (variant A,
   Aurora Wash) and `CoolingHubBody`.
2. `/cooling/best-cooling-products-for-dogs/` (collector) — Pillar guide
   covering all four product subcategories. Uses `SummaryBlock`, `Toc`,
   per-section product grids, FAQ, `RelatedGuides`, and `InternalLinkStrip`.
3. `/cooling/cooling-mats/` (converter) — Individual converter with full
   product list for cooling mats.
4. `/cooling/cooling-bandanas/` (converter)
5. `/cooling/cooling-vests/` (converter)
6. `/cooling/freezable-dog-toys/` (converter)

### Calming pages built

1. `/calming/` (attractor) — Hub page with `HeroExperiment` (variant A,
   Aurora Wash) and `CalmingHubBody`.
2. `/calming/best-calming-products-for-anxious-dogs/` (collector) — Pillar
   guide covering all four calming subcategories. Includes `CalmingUseTable`
   and `CalmingDisclaimer` to handle the sensitivity of calming claims.
3. `/calming/best-thundershirt-alternatives/` (collector) — Targeted page
   for users searching for ThunderShirt alternatives; covers anxiety wraps and
   non-wrap options.

### Homepage

`/` (attractor) — Split-pane hero routing visitors to cooling or calming.
Uses `HomepageHero` (variant v1 default) with a "Not sure where to start?"
prompt linking to both top converter pages.

### Informer pages

- `/about/` — Brand credibility + "how we choose" section to build trust
  before the user reaches converters
- `/affiliate-disclosure/` — FTC-required disclosure
- `/privacy-policy/`
- `/terms/`
- `/contact/`

### Content collection route handlers

- `src/pages/blog/index.astro` + `[...slug].astro`
- `src/pages/gift-guides/index.astro` + `[...slug].astro`

(No markdown content in these categories yet; infrastructure is ready.)

---

## Phase 5 — SEO and Compliance

**Goal:** Ensure every page is crawlable, correctly structured, and legally
compliant before launch.

### Structured data (JSON-LD)

- `WebSite` + `Organization` schemas on homepage
- `CollectionPage` schema on each hub page (`/cooling/`, `/calming/`)
- `ItemList` schema on pillar pages (`/best-cooling-products-for-dogs/`, etc.)
- All schemas injected via `<JsonLd slot="head">` in BaseLayout

### Meta tags

- `<title>` — Dynamic with site suffix (e.g. "Best Cooling Mats | chill-dogs")
- `<meta name="description">` — Unique per page
- `<link rel="canonical">` — Enforced on every page; experiment variants point
  to their canonical hub URL
- `<meta name="robots" content="noindex, follow">` — Applied to all hero
  experiment variant pages and Vercel preview deployments

### Sitemap

`@astrojs/sitemap` generates `/sitemap-index.xml` with priority tuning:
- Homepage: 1.0
- Cooling/calming pages: 0.9
- Gift guides/luxury-gear: 0.8
- All others: 0.6

### robots.txt

`astro-robots-txt` generates `/robots.txt` at build time, consistent with
the sitemap.

### FTC affiliate disclosure

- Inline `Disclosure` component used on all converter and collector pages
- Full `/affiliate-disclosure/` informer page
- Amazon Associates disclosure text in hero subtitle on pillar pages

### Content guardrails enforced

During the SEO/compliance audit, all copy was reviewed against the content
guardrails in `CLAUDE.md`:
- Removed "vet-recommended" and "vet-approved" language
- Replaced with "researched," "compared," and "practical"
- Added `CalmingDisclaimer` on calming pages to clarify the site does not
  provide veterinary advice
- Removed implied hands-on testing language

---

## Phase 6 — Hero Experiment System

**Goal:** Build a structured A/B testing system for hub-page heroes to
optimize CTA click-through rate.

### Cooling and Calming hub hero experiments (variants A–G)

Seven visual hero variants were built for `/cooling/` and `/calming/`:

| Variant | Design concept | Hypothesis |
|---|---|---|
| A — Aurora Wash | Multi-radial gradients, dark base | Premium/authoritative feel → higher CTA trust |
| B — Split Temperature | Two-tone vertical split | Decisiveness framing → less hesitation |
| C — Conic Spotlight | Soft spotlight from below center | Low visual noise → copy focus |
| D — Pattern Overlay | Dot-grid texture | Craft signal → distinguishes from competitors |
| E — Glass Card | Frosted glass card on gradient bg | CTA focus through visual separation |
| F — Kinetic Underline | Sliding underline animation on headline | Motion → reading fixation → CTA activation |
| G — Minimal Badge + Big Type | Oversized type, pill badge | Maximum typographic weight → fastest path to CTA |

**Winner (cooling and calming):** Variant A (Aurora Wash) promoted to
default on both hubs. Variant URLs remain live for tracking continuity.

Experiment URLs:
- `/cooling/v/a/` through `/cooling/v/g/`
- `/calming/v/a/` through `/calming/v/g/`

All use `noindex, follow` + canonical pointing to the hub.

CSS architecture:
- `src/styles/hero.base.css` — Theme tokens, base layout, typography
- `src/styles/hero.variants.css` — Per-variant styles (a–g)
- `src/components/modules/HeroExperiment.astro` — Template

### Homepage hero experiments (variants v1–v5)

Five split-pane homepage hero variants were built:

| Variant | Design concept |
|---|---|
| v1 — Split Gradient + Grain | Bold 50/50 split with SVG grain texture (current default) |
| v2 — Poster Typography | Diagonal stripe texture + oversized ghost words |
| v3 — Diagonal Clip-Path | Geometric diagonal split via CSS clip-path |
| v4 — Toggle Mode | Segmented control — one category shown at a time |
| v5 — Generative Gradient | Fluid multi-layer radial gradient spanning both panes |

**Status:** Active. v1 is current default; data still collecting.

Experiment URLs: `/v/v1/` through `/v/v5/`

CSS architecture:
- `src/styles/hero.home.base.css`
- `src/styles/hero.home.variants.css`
- `src/components/modules/HomepageHero.astro`

See `EXPERIMENTS.md` for full variant descriptions, hypotheses, tracking setup,
and measurement checklists.

---

## Phase 7 — Analytics Instrumentation

**Goal:** Make every target action trackable before launch.

### Analytics implementation

`src/scripts/analytics.ts` — Lightweight event utility:
- Event delegation on `[data-track]` attributes (no per-component listeners)
- Routes to `window.gtag('event', ...)` when GA4 is loaded
- Falls back to `console.log` in dev mode
- Uses `navigator.sendBeacon` as a fire-and-forget fallback for
  `amazon_outbound_click` events (handles page-unload timing)

`src/components/Analytics.astro` — GA4 script injection with guard against
firing on Vercel preview deployments (`VERCEL_ENV !== 'production'`).

### Hero experiment tracking

Both `HeroExperiment.astro` and `HomepageHero.astro` instrument:
- `data-hero-variant` on the `<section>` root
- `data-hero-cta` on each CTA link
- JS event emission on CTA click: `hero_cta_click` with variant, page, cta
- IntersectionObserver impression event: `hero_impression` (homepage hero)
- Events push to `window.dataLayer` (GTM-compatible) and call `gtag()` directly

### Affiliate click tracking

`AffiliateLink.astro` adds `data-track="amazon_outbound_click"` with product
metadata attributes. `analytics.ts` picks this up via event delegation.

---

## Phase 8 — Iteration Backlog

Items identified for the next iteration cycle, in priority order:

1. **Analytics wiring** — Connect GA4 property; confirm events appear in
   reports before driving paid or campaign traffic.
2. **Missing assets** — Add `favicon.svg` and `og-default.jpg` to `/public/`.
3. **Hero experiment winner** — Evaluate cooling/calming A–G and homepage
   v1–v5 after 200+ primary CTA clicks per variant over 2+ weeks. Promote
   winner; retire or redirect losing variant URLs.
4. **Calming converter pages** — Add individual converter pages for
   `anxiety-wraps`, `calming-treats`, `lick-mats`, `snuffle-mats`. This
   unlocks the same pillar-to-converter funnel that already exists for cooling.
5. **Gift guides content** — Populate `src/data/posts/gift-guides/` with
   markdown content. High-value seasonal traffic (holiday gift guides for
   dog owners).
6. **Luxury gear content** — Populate `src/data/posts/luxury-gear/`.
7. **Product schema** — Add `Product` JSON-LD schema to individual converter
   pages for product-rich results in Google Search.
8. **Affiliate tag verification** — Confirm `chill-dogs-20` is active and
   approved in Amazon Associates.

---

## Phase 9 — Road Trip Collector + Car Cooling/Calming Converters

**Goal:** Add a cross-category collector page targeting road-trip search traffic
and route visitors into two new focused converter pages — one for car cooling
gear and one for travel calming aids.

### Rationale

Road trips represent a high-intent use case that combines both revenue categories:
dogs in hot cars need cooling gear; anxious dogs in cars need calming aids. A
single collector bridges both pillars and adds a new SEO entry point without
duplicating product data already on the pillar pages.

### New pages

| URL | Type | Target action |
|---|---|---|
| `/travel/rhys-road-trip-chill-kit/` | collector | Route to `/cooling/car-cooling-for-dogs/` or `/calming/car-anxiety-for-dogs/` |
| `/cooling/car-cooling-for-dogs/` | converter | Affiliate click to Amazon (car cooling gear) |
| `/calming/car-anxiety-for-dogs/` | converter | Affiliate click to Amazon (travel calming aids) |

### Collector page structure (`/travel/rhys-road-trip-chill-kit/`)

The page follows the Web Systems collector pattern: one job (route to converters),
two primary CTAs above the fold, and all product content organized to support
that routing decision.

Sections:
1. Hero + above-fold CTA bar (Cooling + Calming buttons)
2. Summary block + "what to buy first" quick list
3. Table of contents (6 anchors)
4. "The Real Setup" — Rhys's cross-country setup (fan, ice, magnetic shades, routine)
5. Problem → Solution map table (5 road trip scenarios)
6. Cooling section — shades, fan, mats, vests; each subsection links to cooling converter
7. Calming section — wraps, chews, routine, lick mats; each subsection links to calming converter
8. Road Trip Checklist — minimal kit and full cross-country kit, each with converter CTA
9. FAQ — 8 questions covering cooling, hydration, carsickness, calming chews
10. Closing CTAs — both converters repeated

### Analytics attributes

All primary CTAs carry `data-cta` for click tracking in GA4:

```html
data-cta="roadtrip_to_cooling"   <!-- all cooling converter CTAs -->
data-cta="roadtrip_to_calming"   <!-- all calming converter CTAs -->
```

Both also carry `data-track="collector_to_converter_click"` for the existing
`analytics.ts` event delegation system.

### Data model changes (`src/data/cooling-products.ts`)

Added a `car-cooling` product category with 4 products:

| Product | Purpose |
|---|---|
| Enovoe Magnetic Car Window Shades (4-Pack) | Passive sun/UV blocking on rear windows |
| K&H Pet Products Clip-On Travel Fan | Active airflow directed at the back seat |
| Outward Hound Port-A-Bowl Collapsible Bowl | Pit-stop hydration |
| 4Knines Dog Seat Cover Hammock | Cooler surface + back-seat safety positioning |

`categoryMeta['car-cooling']` added with title, description, hero copy, FAQs, and
internal links (following the same pattern as `cooling-mats`, `cooling-vests`, etc.).

### Internal linking additions

- `CoolingHubBody.astro` — Road Trip card added; grid updated from 2→3 columns.
- `CalmingHubBody.astro` — Road Trip card added; grid updated from 2→3 columns.
- `best-cooling-products-for-dogs.astro` — Road Trip entry added to `RelatedGuides`.
- `best-calming-products-for-anxious-dogs.astro` — Road Trip entry added to `RelatedGuides`.
- Both new converter pages link back to the collector and to each other's hub.

---

## Phase 10 — Cooling Collector Content

**Goal:** Expand the cooling category with collector articles targeting
informational search queries that route traffic to converter pages.

### New pages

| URL | Type | Purpose |
|---|---|---|
| `/cooling/how-hot-is-too-hot-for-dogs/` | collector | Informational article on heat safety thresholds; routes to cooling converters |

### Hub updates

- `CoolingHubBody.astro` — Added "Cooling Safety Guides" section with link to
  the new article.

---

## Phase 11 — Maintenance Mode & Site Polish

**Goal:** Merge the coming-soon page capability into `main` so a single
environment variable toggles the homepage between the live site and a
coming-soon page, without affecting other routes.

### Changes

- `src/layouts/BaseLayout.astro` — Added `hideChrome` prop to conditionally
  hide Header and Footer (used by coming-soon page).
- `src/components/ComingSoon.astro` — Self-contained coming-soon component
  ported from the `codex/coming-soon` branch. CSS-drawn dog illustration,
  aurora/snow animations, no external image dependencies.
- `src/pages/index.astro` — Checks `import.meta.env.MAINTENANCE_MODE` at
  build time. If truthy, renders `ComingSoon` with `noindex` and `hideChrome`.
  If falsy, renders the normal homepage unchanged.
- `.env.example` — Documented `MAINTENANCE_MODE` variable.

### Additional fixes

- **Favicon:** Switched from `.svg` to `.ico` format. Updated `BaseLayout.astro`
  link tag and `index.astro` org schema logo reference.
- **OG image:** Added real `og-default.jpg` to `/public/`.
- **Sitemap cleanup:** Updated `astro.config.mjs` sitemap filter to exclude
  `/v/` experiment variant URLs. Previously only `/draft` pages were filtered.

### Verification

- `bun run build` (no env var) — normal homepage, no noindex, all routes built.
- `MAINTENANCE_MODE=true bun run build` — coming-soon at `/`, noindex applied,
  all other routes still built and accessible.

---

## Phase 12 — Automated Per-Page OG Images

**Goal:** Remove the single-image Open Graph bottleneck by generating
route-specific OG images with deterministic headline + CTA text at build time.

### Why this was added

The site previously used one static OG image (`/public/og-default.jpg`) for all
pages. That created weak social previews and failed common OG quality checks
("missing clear headline" / "missing CTA in image"). The fix needed to be:

- automatic (no per-page manual image editing),
- compatible with Astro static builds on Vercel,
- page-type aware so converter pages can keep conversion-oriented CTA language.

### What changed

- Added `src/scripts/generate-og-images.mjs`.
  - Runs in `prebuild` (`package.json`) before `astro build`.
  - Scans static Astro routes + markdown content routes.
  - Excludes non-indexable routes (`404`, `/v/` variants, selected `noindex` pages).
  - Generates one PNG OG image per route to `public/og/<route-slug>.png`.
  - Uses `@resvg/resvg-js` to render PNG output at build time for broad social
    platform compatibility (`jpg/png/gif/webp` family support expectations).
- Added `src/utils/og.ts`.
  - Deterministic headline derivation with fallback chain:
    `ogHeadline` -> `seoTitle` -> `title`.
  - Deterministic CTA derivation with fallback chain:
    `ogCta` -> page-type default.
  - Route slug + auto-eligibility helpers for consistent OG path resolution.
- Updated `src/layouts/BaseLayout.astro`.
  - `og:image`/`twitter:image` now resolve in this order:
    1. explicit `ogImage` prop,
    2. auto-generated route image (`/og/<route-slug>.png`) when eligible,
    3. `/og-default.jpg` fallback.
- Extended content schema in `src/content.config.ts` for optional OG overrides:
  - `ogHeadline`, `ogCta`, `ogTheme`.
- Updated `.gitignore` to ignore generated OG artifacts (`public/og/`) and
  local Vercel metadata (`.vercel/`) so routine builds do not dirty the repo.

### Documentation updates

- `README.md` now includes a dedicated "Per-page OG images" section:
  - generation command and lifecycle (`prebuild`),
  - default behavior and exclusions,
  - frontmatter override fields and priority rules.
- TODO checklist updated to mark per-page OG generation complete.

### Verification

- Added `src/__tests__/og.test.ts` for utility behavior:
  - headline and CTA precedence,
  - text clamping,
  - route slug generation,
  - route eligibility and resolved OG path.
- Updated `src/__tests__/site-smoke.test.ts`:
  - verifies generated OG asset references in built HTML,
  - verifies OG files exist in `dist/og/`,
  - verifies `noindex` pages still fall back to default OG image.
- Confirmed OG metadata now points to `.png` assets (not `.svg`) on indexable
  routes to avoid unsupported-format issues on some platforms.

---

## Phase 13 — BreadcrumbList Schema Coverage

**Goal:** Add consistent `BreadcrumbList` JSON-LD on indexable pages so search
engines get explicit page hierarchy context.

### Why this was added

The site had multiple JSON-LD types (`WebSite`, `Organization`, `CollectionPage`,
`ItemList`, `Article`) but no breadcrumb structured data. Breadcrumb schema is
low-effort SEO hygiene and can improve SERP URL presentation.

### What changed

- Added `src/utils/breadcrumbs.ts`:
  - Builds deterministic breadcrumb chains from `Astro.url.pathname`.
  - Emits `Home -> ... -> current page` `ListItem` entries with canonical URLs.
  - Includes label normalization for known segments (`gift-guides`,
    `affiliate-disclosure`, etc.).
- Updated `src/layouts/BaseLayout.astro`:
  - Injects `BreadcrumbList` JSON-LD automatically in `<head>` for indexable
    pages.
  - Skips breadcrumbs when:
    - page is `noindex`,
    - environment is staging/preview,
    - route is homepage (`/`).

### Verification

- Added `src/__tests__/breadcrumbs.test.ts`:
  - verifies nested route breadcrumb generation,
  - verifies special label mapping,
  - verifies homepage returns no breadcrumb schema.
- Extended `src/__tests__/site-smoke.test.ts`:
  - confirms `BreadcrumbList` exists on indexable routes,
  - confirms no breadcrumb schema is injected on `noindex` pages.
- Full suite passes with breadcrumb coverage added.
