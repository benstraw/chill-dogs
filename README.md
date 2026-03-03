# Chill-Dogs

Amazon Associates affiliate site for dog cooling and calming products. Built as a static site and deployed to Vercel.

**Live:** https://chill-dogs.com

---

## Stack

| | |
|---|---|
| Framework | Astro 5 (SSG) |
| Runtime / package manager | Bun |
| Styling | Vanilla CSS, custom properties |
| Fonts | Nunito Variable (headings), Inter (body) via `@fontsource` |
| Deploy | Vercel (primary); `netlify.toml` also present |

---

## Commands

```bash
bun run dev       # Dev server at localhost:4321
bun run build     # Static build → dist/
bun run preview   # Preview the built site
bun run test      # Full Vitest suite
bun run test:smoke # Built-site smoke tests for key pages
bun run test:coverage # Coverage for src/utils and src/scripts
```

---

## Project structure

```
src/
├── components/        # Shared UI components
│   └── modules/       # Page-level modules (Hero, ProductCard, FAQ, etc.)
├── data/
│   ├── cooling-products.ts   # 11 cooling products (typed)
│   ├── calming-products.ts   # 8 calming products (typed)
│   └── posts/                # Markdown content by category
│       ├── blog/
│       ├── gift-guides/
│       └── luxury-gear/
├── layouts/
│   ├── BaseLayout.astro      # HTML shell, head, header/footer
│   ├── ConverterLayout.astro # Money pages with product grids
│   └── PostLayout.astro      # SEO collector and editorial pages
├── pages/
│   ├── cooling/              # Cooling hub + converters + v/[variant] experiments
│   ├── calming/              # Calming hub + pillar + v/[variant] experiments
│   ├── gift-guides/
│   ├── blog/
│   └── content-sitemap.astro # Hidden editor-facing sitemap page (`/content-sitemap/`)
├── styles/
│   ├── tokens.css            # All design tokens (colors, spacing, type, radii)
│   ├── hero.base.css         # Hero experiment base layout + theme tokens
│   └── hero.variants.css     # 7 hero variant styles (A–G)
└── utils/
    ├── collection-helpers.ts # getSlugFromId, getCategoryFromId, etc.
    └── types.ts              # PageType, Category, Product interfaces
```

---

## Page types

Every page is exactly one type, set via the `pageType` frontmatter field:

| Type | Job | Layout | Primary metric |
|---|---|---|---|
| `converter` | Sell via affiliate links | ConverterLayout | Conversion rate |
| `collector` | Capture organic traffic, route to converters | PostLayout | Traffic + click-through |
| `attractor` | Convert campaign/social traffic | PostLayout | Campaign conversion |
| `informer` | Admin/legal (about, privacy, terms) | — | None |

---

## Routing

Cooling and calming pages are hand-authored in `src/pages/` (not the content collection) because they use typed TypeScript product data rather than markdown frontmatter.

The content collection (`src/content.config.ts`) handles `blog/`, `gift-guides/`, and `luxury-gear/`. Content IDs from the glob loader are in `category/filename` format — use `getSlugFromId()` and `getCategoryFromId()` from `src/utils/collection-helpers.ts` to extract them.

There is also a hidden internal page at `/content-sitemap/` for editorial workflow. It is built from a mix of explicit hand-authored routes and collection-driven entries, and it is marked `noindex` so it stays out of search.

---

## Styling

Design tokens live entirely in `src/styles/tokens.css`. No Tailwind.

**Color palette:**

| Token | Value | Used for |
|---|---|---|
| `--color-sky` | `#87b7c7` | Cooling theme, primary |
| `--color-sage` | `#8fa98b` | Calming theme, accent |
| `--color-sand` | `#e8dcc8` | Backgrounds |
| `--color-cream` | `#f5f0e8` | Surfaces |
| `--color-terracotta` | `#c4704b` | Accent alt |
| `--color-charcoal` | `#2d2d2d` | Text |

**Path aliases** (configured in `tsconfig.json`):

```
@components/  →  src/components/
@layouts/     →  src/layouts/
@styles/      →  src/styles/
@data/        →  src/data/
@utils/       →  src/utils/
```

---

## Adding content

Create a `.md` file in `src/data/posts/{category}/` with required frontmatter:

```yaml
---
title: "Your page title"
description: "Meta description"
category: gift-guides   # gift-guides | blog | luxury-gear
date: 2026-01-15
pageType: collector      # converter | collector | attractor | informer
draft: false             # true = excluded from build
---
```

Converter pages also need a `products` array:

```yaml
products:
  - name: "Product Name"
    description: "Short description"
    affiliateUrl: "https://amazon.com/dp/ASIN?tag=chill-dogs-20"
    priceNote: "~$29"
    tag: best-overall    # best-overall | budget | premium
    pros: ["Pro one", "Pro two"]
    cons: ["Con one"]
```

---

## Analytics

Event tracking uses a provider-agnostic system that supports **Plausible** (recommended) and **GA4** simultaneously.

### Setup

Set environment variables in your hosting platform (Vercel):

| Variable | Required | Example |
|---|---|---|
| `PUBLIC_PLAUSIBLE_DOMAIN` | Recommended | `chill-dogs.com` |
| `PUBLIC_GA_ID` | Optional | `G-XXXXXXXXXX` |

Both can run at the same time. If neither is set, events log to the browser console in dev mode.

### How it works

1. `src/components/Analytics.astro` loads provider scripts and calls `init()` globally (included via `BaseLayout.astro`)
2. `src/scripts/analytics.ts` sets up a single `click` event delegation listener on `[data-track]` attributes
3. Every click on an element with `data-track="event_name"` fires to all configured providers
4. Additional `data-*` attributes on the same element are sent as event properties (e.g. `data-product-name`, `data-asin`, `data-position`)

### Tracked events

| Event name | Fired from | Purpose |
|---|---|---|
| `hero_click_cooling` | HeroSection | Homepage CTA → cooling hub |
| `hero_click_calming` | HeroSection | Homepage CTA → calming hub |
| `amazon_outbound_click` | ProductCards, ComparisonTable, BonusCallout | Outbound affiliate click (uses `sendBeacon` fallback) |
| `collector_to_converter_click` | HubBody, SummaryBlock, InternalLinkStrip | Internal routing from collector → converter pages |
| `toc_click` | Toc | Table of contents navigation |

### Adding a tracked element

Add `data-track="your_event_name"` to any clickable element. Extra `data-*` attributes become event props:

```html
<a href="/cooling/cooling-mats/" data-track="collector_to_converter_click" data-destination="cooling-mats">
  See cooling mats
</a>
```

For Plausible, register matching **Goals** in the Plausible dashboard for each event name.

### Programmatic tracking

Import `track()` directly when you need to fire events outside of click delegation:

```ts
import { track } from '../scripts/analytics';
track('custom_event', { key: 'value' });
```

---

## Testing

The test suite is split into fast unit tests and a built-site smoke layer:

| Command | What it checks |
|---|---|
| `bun run test` | Full Vitest suite |
| `bun run test:smoke` | Builds the site and verifies key rendered `.astro` output |
| `bun run test:coverage` | Coverage report for `src/utils/**` and `src/scripts/**` |

The smoke tests are intentionally narrow and stable. They verify:

- homepage funnel CTAs route to `/cooling/` and `/calming/`
- key converter pages emit Amazon affiliate links with required attributes and the `chill-dogs-20` tag
- legal and SEO basics like `noindex`, canonical tags, `robots.txt`, and sitemap output

Pre-commit runs both the Vitest suite and the smoke tests, so broken rendered output blocks commits before it reaches `main`.

---

## Affiliate links

All Amazon links must use the `AffiliateLink` component — never a plain `<a>` tag:

```astro
import AffiliateLink from '@components/AffiliateLink.astro';

<AffiliateLink href="https://amazon.com/dp/ASIN?tag=chill-dogs-20">
  Check price on Amazon
</AffiliateLink>
```

The component enforces `rel="nofollow sponsored noopener"`, `target="_blank"`, and `data-affiliate="true"`. The Associates tag is `chill-dogs-20`.

---

## Hero experiments

Seven color-based hero variants (A–G) run as alternate URLs:

- `/cooling/v/a/` … `/cooling/v/g/`
- `/calming/v/a/` … `/calming/v/g/`

All variant pages carry `noindex, follow` and canonical links pointing to the hub pages. The current default hero on `/cooling/` and `/calming/` is variant A (Aurora Wash).

See [EXPERIMENTS.md](./EXPERIMENTS.md) for variant descriptions, hypotheses, and tracking setup.

---

## Strategy and build docs

| File | Purpose |
|---|---|
| [docs/web-systems-adventure-mode.md](./docs/web-systems-adventure-mode.md) | The modular conversion-system framework governing all site decisions |
| [docs/site-plan.md](./docs/site-plan.md) | Applied system plan for chill-dogs: keystone metrics, page inventory, module registry, architecture decisions, analytics events |
| [docs/build-log.md](./docs/build-log.md) | Chronological build phases — strategy → architecture → modules → pages → SEO → experiments → analytics → backlog |
| [EXPERIMENTS.md](./EXPERIMENTS.md) | Hero A/B experiment details, variant descriptions, tracking setup, measurement checklists |

---

## Deploy

The repo is at [github.com/benstraw/chill-dogs](https://github.com/benstraw/chill-dogs), deployed via Vercel with automatic deploys on push to `main`.

A `netlify.toml` is also present with equivalent build config and security headers if you ever need to switch.

**Vercel environment:** Vercel auto-detects Astro. No `vercel.json` required. If `bun` is not available on your Vercel team plan, add:

```json
// vercel.json
{
  "installCommand": "bun install",
  "buildCommand": "bun run build",
  "outputDirectory": "dist"
}
```

---

## TODO

- [ ] Connect Vercel project and set up auto-deploy from `main`
- [ ] Point `chill-dogs.com` domain to Vercel; confirm SSL
- [x] Set up analytics — Plausible (primary) + GA4 (optional) + PostHog; wired via `src/components/Analytics.astro` with global `init()` and `data-track` event delegation
- [ ] **Set up PostHog reverse proxy on Netlify/Vercel** — PostHog scripts are blocked by Firefox Enhanced Tracking Protection and ad blockers. Proxy `/ingest/*` → `us.posthog.com/*` so the SDK loads from the same origin. See [PostHog reverse proxy docs](https://posthog.com/docs/advanced/proxy). Critical for accurate analytics coverage.
- [ ] Add OG image (`/public/og-default.jpg`) — currently referenced but missing
- [ ] Add `favicon.svg` — currently referenced but missing
- [ ] Evaluate hero experiment winner after 2 weeks / 200+ primary CTA clicks per variant; promote winner to default, retire losing variant URLs
- [ ] Expand calming category: individual converter pages for anxiety-wraps, calming-treats, lick-mats, snuffle-mats (parallel to cooling converter structure)
- [ ] Add `luxury-gear` and `gift-guides` content (directories exist, no markdown yet)
- [ ] Review affiliate tag is active and approved in Amazon Associates dashboard (`chill-dogs-20`)
