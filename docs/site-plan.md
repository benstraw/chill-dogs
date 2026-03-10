---
type: plan
tags: [strategy, site-plan]
created: 2026-02-28
---

# chill-dogs — Site System Plan

This document is the concrete application of the
[Web Systems Adventure Mode](./web-systems-adventure-mode.md) framework to
`chill-dogs.com`. It records the strategic decisions made when building the
site and should be consulted before adding new pages, categories, or features.

---

## 1. Keystone Metrics

```yaml
keystone_metrics:
  primary: Amazon affiliate commission revenue
  secondary: Organic search traffic (volume of visitors routed to converter pages)
```

Every page, component, and content decision traces back to one of these two
metrics. If a proposed change does not directly drive affiliate clicks or
improve organic visibility that routes to converters, it should be questioned.

---

## 2. Page Inventory

Each page is exactly one type. The table below is the authoritative page
registry.

### Homepage

| Field | Value |
|---|---|
| URL | `/` |
| Type | attractor |
| Target action | Route visitor to `/cooling/` or `/calming/` hub |
| Primary metric | Combined cooling + calming CTA click-through rate |
| Layout | `BaseLayout` + `HomepageHero` + `HomepageBody` |

### Cooling Category

| URL | Type | Target action | Metric | Layout |
|---|---|---|---|---|
| `/cooling/` | attractor | Route to `/cooling/best-cooling-products-for-dogs/` | CTA click-through | `BaseLayout` + `HeroExperiment` |
| `/cooling/best-cooling-products-for-dogs/` | collector | Route to individual product converter pages | Traffic + click-through to converters | `BaseLayout` |
| `/cooling/cooling-mats/` | converter | Affiliate click to Amazon (cooling mats) | Conversion rate | `BaseLayout` |
| `/cooling/cooling-bandanas/` | converter | Affiliate click to Amazon (cooling bandanas) | Conversion rate | `BaseLayout` |
| `/cooling/cooling-vests/` | converter | Affiliate click to Amazon (cooling vests) | Conversion rate | `BaseLayout` |
| `/cooling/freezable-dog-toys/` | converter | Affiliate click to Amazon (freezable toys) | Conversion rate | `BaseLayout` |

### Calming Category

| URL | Type | Target action | Metric | Layout |
|---|---|---|---|---|
| `/calming/` | attractor | Route to `/calming/best-calming-products-for-anxious-dogs/` | CTA click-through | `BaseLayout` + `HeroExperiment` |
| `/calming/best-calming-products-for-anxious-dogs/` | collector | Route to product converters | Traffic + click-through to converters | `BaseLayout` |
| `/calming/best-thundershirt-alternatives/` | collector | Route to anxiety-wrap converters | Traffic + click-through | `BaseLayout` |

### Travel / Road Trip Category

| URL | Type | Target action | Metric | Layout |
|---|---|---|---|---|
| `/travel/rhys-road-trip-chill-kit/` | collector | Route to `/cooling/car-cooling-for-dogs/` or `/calming/car-anxiety-for-dogs/` | Click-through to converters | `BaseLayout` |
| `/cooling/car-cooling-for-dogs/` | converter | Affiliate click to Amazon (car cooling gear) | Conversion rate | `BaseLayout` |
| `/calming/car-anxiety-for-dogs/` | converter | Affiliate click to Amazon (travel calming aids) | Conversion rate | `BaseLayout` |



| URL pattern | Type | Target action | Layout |
|---|---|---|---|
| `/blog/{slug}/` | collector | Route to relevant converter | `PostLayout` |
| `/gift-guides/{slug}/` | collector or converter | Affiliate clicks or routing | `PostLayout` or `ConverterLayout` |
| `/luxury-gear/{slug}/` | collector or converter | Affiliate clicks or routing | `PostLayout` or `ConverterLayout` |

### Informer Pages

| URL | Type | Purpose |
|---|---|---|
| `/about/` | informer | Brand credibility, link to affiliate disclosure |
| `/affiliate-disclosure/` | informer | FTC compliance |
| `/privacy-policy/` | informer | Legal compliance |
| `/terms/` | informer | Legal compliance |
| `/contact/` | informer | Administrative contact |

### Hero Experiment Variants (noindex)

| URL pattern | Canonical | Purpose |
|---|---|---|
| `/cooling/v/{a–g}/` | `/cooling/` | A/B test hero variants |
| `/calming/v/{a–g}/` | `/calming/` | A/B test hero variants |
| `/v/{v1–v5}/` | `/` | A/B test homepage hero variants |

---

## 3. Module System

### Workhorse Modules

These are the reusable, content-agnostic modules that compose every page.
Build these first and default to reusing them before creating new ones.

| Module | File | Purpose |
|---|---|---|
| `Hero` | `modules/Hero.astro` | Static hero for converter/collector pages |
| `HeroExperiment` | `modules/HeroExperiment.astro` | A/B-testable hero for hub pages (variants a–g) |
| `HomepageHero` | `modules/HomepageHero.astro` | Split-pane homepage hero (variants v1–v5) |
| `HomepageBody` | `modules/HomepageBody.astro` | Below-hero content (Top Guides + Latest Posts) |
| `CoolingHubBody` | `modules/CoolingHubBody.astro` | Category grid for cooling hub |
| `CalmingHubBody` | `modules/CalmingHubBody.astro` | Category grid for calming hub |
| `CoolingProductCard` | `modules/CoolingProductCard.astro` | Single product card with affiliate CTA |
| `CalmingProductCard` | `modules/CalmingProductCard.astro` | Single calming product card with affiliate CTA |
| `ProductCard` | `ProductCard.astro` | Generic product card for markdown-driven content |
| `ProductGrid` | `ProductGrid.astro` | Grid wrapper for `ProductCard` |
| `SummaryBlock` | `modules/SummaryBlock.astro` | Above-fold summary list on collector pages |
| `Toc` | `modules/Toc.astro` | Table of contents for long-form collector pages |
| `FAQ` | `modules/FAQ.astro` | Expandable FAQ section |
| `BonusCallout` | `modules/BonusCallout.astro` | Highlighted bonus product section |
| `Disclosure` | `modules/Disclosure.astro` | Inline affiliate disclosure notice |
| `AffiliateDisclosure` | `AffiliateDisclosure.astro` | Full affiliate disclosure component |
| `InternalLinkStrip` | `modules/InternalLinkStrip.astro` | Bottom-of-page internal link navigation |
| `RelatedGuides` | `modules/RelatedGuides.astro` | Cross-category routing cards |
| `Header` | `Header.astro` | Site header with minimal navigation |
| `Footer` | `Footer.astro` | Site footer with legal links |
| `Analytics` | `Analytics.astro` | Analytics script injection |
| `JsonLd` | `JsonLd.astro` | JSON-LD structured data injection |

### Showstopper Modules

Used sparingly. These have higher complexity and fragility.

| Module | File | Why showstopper |
|---|---|---|
| `HeroExperiment` | `modules/HeroExperiment.astro` | 7 visual variants, CSS animation (variant F), backdrop-filter (variant E), complex CSS architecture |
| `HomepageHero` | `modules/HomepageHero.astro` | Split-pane, 5 variants, JS toggle (v4), IntersectionObserver impression tracking |

**Rule:** Never stack two showstopper modules on the same page.

### High-Touch Modules

Require careful testing and iteration; cannot be blindly copied from other projects.

| Module | Why high-touch |
|---|---|
| `CoolingProductGrid` | Conversion-critical; product selection and ordering directly affects revenue |
| `ComparisonTable` | Decision-making tool; bad UX kills conversions |
| `CalmingUseTable` | Category guidance table; must match user intent accurately |

---

## 4. Navigation Rules

```yaml
nav:
  primary_links:
    - label: Cooling
      href: /cooling/
    - label: Calming
      href: /calming/
    - label: Gift Guides
      href: /gift-guides/
  max_links: 5
  novelty_patterns: false
```

Keep navigation minimal. The site has two revenue-generating categories
(cooling, calming) and one content-collection category (gift guides). Do not
add navigation links for informer pages (about, privacy, etc.) — those belong
in the footer only.

---

## 5. Conversion Flow

```yaml
conversion_flow:
  primary_path:
    - step: Homepage or hub page hero CTA click
    - step: Collector page (pillar guide)
    - step: Converter page (category product list)
    - step: Amazon affiliate link click
    friction_points:
      - No-image product cards (relying on copy alone)
      - Hero CTA positioning on mobile
      - Affiliate disclosure above the fold (legal requirement, slight friction)
  secondary_path:
    - step: Organic search → collector page
    - step: Internal link to converter page
    - step: Amazon affiliate click
```

Minimize steps. The ideal path is two clicks: hub CTA → converter → Amazon.
Every page should have exactly one primary CTA that advances the visitor toward
an affiliate click.

---

## 6. Architecture

```yaml
architecture:
  frontend: Astro 5 (SSG — full static build to dist/)
  package_manager: Bun
  cms: None — typed TypeScript data files (cooling, calming) + Astro content
    collection (markdown for blog/gift-guides/luxury-gear)
  hosting: Vercel (primary); netlify.toml present as fallback
  seo_strategy:
    - Canonical URLs enforced on all pages (BaseLayout)
    - noindex on hero experiment variant URLs
    - Sitemap via @astrojs/sitemap with priority tuning
    - robots.txt via astro-robots-txt
    - JSON-LD structured data (WebSite, Organization, CollectionPage, ItemList,
      Product) on hub and converter pages
    - OpenGraph + Twitter card meta on every page
  performance_monitoring: Core Web Vitals via Vercel; no third-party monitoring
    added yet
  analytics: GA4-ready via window.gtag; custom events tracked via analytics.ts
    and data-track attributes; dataLayer push for GTM compatibility
```

### Key Architectural Decisions

**Why Astro 5 SSG?**
Static builds serve pre-rendered HTML from a CDN — no server round-trips,
no JavaScript framework hydration overhead. Ideal for an affiliate site where
Core Web Vitals (LCP, CLS) directly affect SEO rankings.

**Why typed TypeScript data files instead of markdown for cooling/calming?**
Cooling and calming product data is structured and frequently needs to be
queried by category, sorted, and shaped into typed interfaces used across
multiple pages. TypeScript gives compile-time correctness and IDE autocompletion
that markdown frontmatter alone cannot provide.

**Why Astro content collections for blog/gift-guides/luxury-gear?**
These categories grow through content authoring, not code changes. The glob
loader + Zod schema gives validated, type-safe frontmatter without requiring
TypeScript data files for each piece of content.

**Why vanilla CSS with custom properties?**
Zero runtime overhead. All design decisions are expressed as CSS custom
properties in `src/styles/tokens.css`. This is intentional for a high-traffic
static site where CSS bundle size directly affects perceived load time.

**Why bun?**
Faster installs and script execution than npm/yarn. No behavioral difference
for Astro builds.

---

## 7. Analytics Instrumentation

```yaml
tracking:
  keystone_event: amazon_outbound_click
  page_conversion_events:
    - hero_cta_click (variant, page, cta)
    - hero_impression (variant)
    - collector_to_converter_click
  funnel_defined: true
  implementation:
    - src/scripts/analytics.ts — event delegation on [data-track] attributes
    - src/components/Analytics.astro — GA4 script injection
    - window.dataLayer push for GTM compatibility
    - navigator.sendBeacon fallback for amazon_outbound_click (fire-and-forget)
```

### Required Event Definitions (GA4)

| Event | Parameters | Trigger |
|---|---|---|
| `amazon_outbound_click` | `product_id`, `page_slug`, `position` | Click on any AffiliateLink |
| `hero_cta_click` | `variant`, `page`, `cta` (primary/secondary) | Click on hub page hero CTA |
| `hero_impression` | `variant` | Hero is 50% visible (IntersectionObserver) |
| `collector_to_converter_click` | `from_slug`, `to_slug` | Click on internal link from collector to converter |

---

## 8. Content Strategy

### Category Focus

The site is organized around two high-intent problem categories:

1. **Cooling** — summer heat relief for dogs. High seasonal intent (May–September
   peak). Product categories: mats, bandanas, vests, freezable toys.

2. **Calming** — anxiety management for dogs. Evergreen intent. Product
   categories: anxiety wraps, calming treats, lick mats, snuffle mats.

Both categories have complementary cross-linking (e.g., hot dogs are often
anxious dogs) which supports internal link equity.

### SEO Target Strategy

- **Pillar + cluster model**: Each category hub (`/cooling/`, `/calming/`) is
  the pillar. Category converter pages (`/cooling-mats/`, etc.) are the
  cluster. All cluster pages link back to the pillar.
- **Target long-tail keywords**: "best cooling mat for dogs," "calming chews
  for anxious dogs," etc. High buying intent, lower competition than
  head terms.
- **Content collection expansion**: `blog/`, `gift-guides/`, and `luxury-gear/`
  support topical authority building and cover informational queries that feed
  warm traffic into the cooling/calming converters.

### Affiliate Tag

All Amazon URLs use `tag=chill-dogs-20`. This tag must remain consistent.
All affiliate links must use the `AffiliateLink.astro` component — never
plain `<a>` tags — to enforce correct `rel` attributes and click tracking.

---

## 9. Open Items

These items are tracked here as they remain incomplete at the point of initial
documentation. See also the TODO section in `README.md`.

- [ ] Analytics: connect GA4 property; wire `hero_cta_click` and
  `amazon_outbound_click` events
- [ ] Assets: add `/public/og-default.jpg` (currently referenced, missing)
- [ ] Assets: add `/public/favicon.svg` (currently referenced, missing)
- [ ] Hero experiments: evaluate cooling/calming winners (need 200+ clicks per
  variant over 2+ weeks); promote winner to default and retire variant URLs
- [ ] Homepage hero: evaluate v1–v5 winner; same criteria
- [ ] Calming category expansion: add individual converter pages for
  `anxiety-wraps`, `calming-treats`, `lick-mats`, `snuffle-mats`
  (parallel to the existing cooling converter structure)
- [ ] Content: populate `gift-guides/` and `luxury-gear/` with markdown content
- [ ] Structured data: add `Product` schema to individual converter pages
- [ ] Verify affiliate tag `chill-dogs-20` is active and approved in Amazon
  Associates dashboard
