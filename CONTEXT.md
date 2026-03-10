---
type: context
tags: [ai-context, strategy, creative]
updated: 2026-03-02
---

# chill-dogs — AI Context File

This file is the single source of truth for sharing context about `chill-dogs.com` with AI platforms and coding assistants. It covers strategy, content, technical stack, and creative guidelines.

---

## 1. What Is chill-dogs?

**chill-dogs** (`chill-dogs.com`) is an Amazon affiliate site focused on dog lifestyle — specifically cooling and calming products. The site earns revenue through the Amazon Associates program. Every design, content, and engineering decision is evaluated against one question: does this drive or support affiliate revenue?

---

## 2. Strategy and Web Systems

The site is built on the **Web Systems Adventure Mode** framework (`docs/web-systems-adventure-mode.md`). This is a modular, metric-driven planning system with one governing principle:

> A website is a modular conversion system — driven by one dominant metric, structured by page intent, built with reusable modules, governed by clarity and speed, and improved through continuous measurement.

### Page Classification

Every page belongs to exactly one type. Mixing types is not allowed.

| Type | Job | Metric |
|---|---|---|
| **converter** | Drive affiliate clicks to Amazon — one CTA, no distractions | Conversion rate (% of visitors who click an affiliate link) |
| **collector** | Capture organic search traffic and route it to converters | Traffic volume + % routed to converters |
| **attractor** | Convert paid or social campaign traffic | Campaign conversion rate |
| **informer** | Administrative and legal pages — no revenue goal | Accuracy, currency |

### Navigation Rules

- Maximum 5 primary nav links
- No novelty patterns
- Informer pages (about, privacy, terms) go in the footer only, never the primary nav
- Current primary nav: **Cooling**, **Calming**, **Gift Guides**

### Conversion Flow

The ideal path is two clicks:

```
Homepage or hub hero CTA → Collector (pillar guide) → Converter (product page) → Amazon
```

Primary friction points to minimize:
- Hero CTA positioning on mobile
- Affiliate disclosure above the fold (legal requirement, slight friction)

---

## 3. Keystone Metric

```yaml
keystone_metrics:
  primary: Amazon affiliate commission revenue
  secondary: Organic search traffic (volume of visitors routed to converter pages)
```

Every page, component, and content decision traces back to one of these two metrics. If a proposed change does not directly drive affiliate clicks or improve organic visibility that routes to converters, it should be questioned.

The **keystone event** in analytics is `amazon_outbound_click`.

---

## 4. Content Job-Map

### Category Strategy

The site is organized around two high-intent problem categories:

1. **Cooling** — summer heat relief for dogs. High seasonal intent (May–September peak).
2. **Calming** — anxiety management for dogs. Evergreen intent year-round.

Both categories cross-link naturally (hot dogs are often anxious dogs), which supports internal link equity.

### SEO Model: Pillar + Cluster

Each category has a pillar collector page that targets broad intent, with cluster converter pages targeting specific product categories.

### Page Job-Map

#### Homepage
| URL | Type | Job |
|---|---|---|
| `/` | attractor | Route visitor to `/cooling/` or `/calming/` hub |

#### Cooling Category
| URL | Type | Job |
|---|---|---|
| `/cooling/` | attractor | Route to pillar guide (`/cooling/best-cooling-products-for-dogs/`) |
| `/cooling/best-cooling-products-for-dogs/` | **collector** | Capture "best cooling products for dogs" organic traffic; route to category converters |
| `/cooling/cooling-mats/` | **converter** | Drive affiliate clicks for cooling mats |
| `/cooling/cooling-bandanas/` | **converter** | Drive affiliate clicks for cooling bandanas |
| `/cooling/cooling-vests/` | **converter** | Drive affiliate clicks for cooling vests |
| `/cooling/freezable-dog-toys/` | **converter** | Drive affiliate clicks for freezable toys |
| `/cooling/car-cooling-for-dogs/` | **converter** | Drive affiliate clicks for car cooling gear |

#### Calming Category
| URL | Type | Job |
|---|---|---|
| `/calming/` | attractor | Route to pillar guide (`/calming/best-calming-products-for-anxious-dogs/`) |
| `/calming/best-calming-products-for-anxious-dogs/` | **collector** | Capture "best calming products" organic traffic; route to converters |
| `/calming/best-thundershirt-alternatives/` | **collector** | Target "thundershirt alternatives" queries; route to anxiety-wrap converters |
| `/calming/car-anxiety-for-dogs/` | **converter** | Drive affiliate clicks for travel calming aids |

#### Travel / Cross-Category
| URL | Type | Job |
|---|---|---|
| `/travel/rhys-road-trip-chill-kit/` | **collector** | Route to car cooling and car anxiety converters |

#### Content Collection (expanding)
| URL Pattern | Type | Job |
|---|---|---|
| `/blog/{slug}/` | collector | Route warm informational traffic to converters |
| `/gift-guides/{slug}/` | collector or converter | Gift-intent traffic; affiliate clicks |
| `/luxury-gear/{slug}/` | collector or converter | Premium product traffic; affiliate clicks |

#### Informer Pages
| URL | Type | Purpose |
|---|---|---|
| `/about/` | informer | Brand credibility |
| `/affiliate-disclosure/` | informer | FTC compliance |
| `/privacy-policy/` | informer | Legal compliance |
| `/terms/` | informer | Legal compliance |
| `/contact/` | informer | Administrative contact |

---

## 5. Amazon Associates Program

### Affiliate Tag

```
chill-dogs-20
```

This tag must appear on every Amazon URL. It must never change. If you are writing or editing any Amazon link, verify the tag is present.

### Link Rules

- **All Amazon links must use the `AffiliateLink.astro` component.** Never use a plain `<a>` tag for Amazon URLs.
- The component enforces `rel="nofollow sponsored noopener"`, `target="_blank"`, and `data-affiliate="true"` for click tracking.

```astro
<!-- Correct -->
<AffiliateLink href="https://www.amazon.com/dp/ASIN/?tag=chill-dogs-20">
  Buy on Amazon
</AffiliateLink>

<!-- Wrong — never do this -->
<a href="https://www.amazon.com/dp/ASIN/?tag=chill-dogs-20">Buy on Amazon</a>
```

### FTC Compliance

- Inline `Disclosure` component appears at the top of all converter and collector pages.
- A full `/affiliate-disclosure/` informer page is linked from the footer.
- No language may imply veterinary endorsement, hands-on product testing, or medical authority unless directly sourced.

### Click Tracking

The keystone analytics event `amazon_outbound_click` fires on every `[data-affiliate="true"]` element click. Properties captured: `page_slug`, `product_name`, `product_category`, `position`, `destination`.

---

## 6. Technical Stack

### Core Framework

| Layer | Technology |
|---|---|
| Framework | Astro 5 (SSG — full static build) |
| Package manager | Bun |
| Language | TypeScript |
| Styling | Vanilla CSS with custom properties (no Tailwind) |

### Hosting

**Vercel** (primary). Astro is auto-detected. Deploys on push to `main`. Domain: `chill-dogs.com`.

### Build Commands

```bash
bun run dev       # Dev server at localhost:4321
bun run build     # Static build to dist/
bun run preview   # Preview built site
bun run test      # Vitest unit tests
```

### Path Aliases

```
@components/  →  src/components/
@layouts/     →  src/layouts/
@styles/      →  src/styles/
@data/        →  src/data/
@utils/       →  src/utils/
```

### Analytics and Experiments

**PostHog** is the primary analytics and experimentation platform.

- **Project API Key:** set as `PUBLIC_POSTHOG_KEY` in environment variables.
- **Host:** defaults to `https://us.i.posthog.com` (configurable via `PUBLIC_POSTHOG_HOST`).
- **Usage:** A/B experiments via Feature Flags, funnel analysis, session recordings.
- Loaded globally by `src/components/Analytics.astro` — do not add per-page `init()` calls.

**Event tracking pattern:**
- Add `data-track="event_name"` to any element for click tracking.
- Additional `data-*` attributes become event properties.
- Import `track()` from `src/scripts/analytics.ts` for non-click events.

**Defined events:**

| Event | Trigger |
|---|---|
| `amazon_outbound_click` | Click on any `AffiliateLink` |
| `hero_cta_click` | Click on hub page hero CTA |
| `hero_impression` | Hero is 50% visible (IntersectionObserver) |
| `collector_to_converter_click` | Click on internal link from collector to converter |
| `toc_click` | Click on table of contents link |

### Hero A/B Experiments

- `/cooling/v/{a–g}/` — 7 cooling hub hero variants
- `/calming/v/{a–g}/` — 7 calming hub hero variants
- `/v/{v1–v5}/` — 5 homepage hero variants

All experiment variant URLs are `noindex` with a canonical pointing to the production hub URL. Winners are promoted to the default and variant URLs are retired.

### Content Architecture

Product data for cooling and calming pages lives in strongly-typed TypeScript files:
- `src/data/cooling-products.ts` — 11 products, 5 categories
- `src/data/calming-products.ts` — 8 products, 4 categories

Blog, gift guide, and luxury-gear content uses the Astro 5 Content Layer (markdown files with Zod-validated frontmatter) in `src/data/posts/{category}/`.

### SEO

- Canonical URLs enforced on every page via `BaseLayout`
- `@astrojs/sitemap` with priority tuning (homepage: 1.0, cooling/calming: 0.9, gift-guides/luxury-gear: 0.8)
- `robots.txt` via `astro-robots-txt`
- JSON-LD structured data (WebSite, Organization, CollectionPage, ItemList, Product) on hub and converter pages
- OpenGraph + Twitter card meta on every page

### Testing

- **Framework:** Vitest
- **Location:** `src/__tests__/`
- **Coverage target:** ≥ 90% statement coverage for `src/utils/**` and `src/scripts/**`
- **Pre-commit hook:** runs `npm test` before every commit; commits are blocked on test failure
- **Stub:** `astro:content` virtual module stubbed in `src/__mocks__/astro-content.ts` so helpers can be tested outside Astro build context

---

## 7. Creative Guidelines

### Brand Name

**chill-dogs** (hyphenated, title case). Domain: `chill-dogs.com`.

### Tagline

> Stay cool.

### Color Palette

Six named brand colors form the palette. Sky blue signals cooling; sage green signals calming.

| Token | Hex | Role |
|---|---|---|
| `--color-sky` | `#87b7c7` | Cooling theme primary; primary CTA color |
| `--color-sage` | `#8fa98b` | Calming theme primary; accent color |
| `--color-sand` | `#e8dcc8` | Warm neutral; secondary surfaces |
| `--color-cream` | `#f5f0e8` | Light surface; card backgrounds |
| `--color-terracotta` | `#c4704b` | Warm accent; secondary CTAs |
| `--color-charcoal` | `#2d2d2d` | Primary text |

**Semantic color tokens** (use these in components):

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#f0f4f6` | Page background |
| `--color-bg-alt` | `#e0eaee` | Alternative section background |
| `--color-text` | `var(--color-charcoal)` | Body text |
| `--color-text-muted` | `#6b6b6b` | Secondary/muted text |
| `--color-text-inverse` | `#f0f4f6` | Text on dark backgrounds |
| `--color-primary` | `var(--color-sky)` | Primary button and link color |
| `--color-primary-hover` | `#74a5b6` | Primary hover state |
| `--color-accent` | `var(--color-sage)` | Accent elements |
| `--color-accent-alt` | `var(--color-terracotta)` | Alternate accent |
| `--color-surface` | `#ffffff` | Card / surface |
| `--color-border` | `#c5d4dc` | Borders and dividers |

### Typography

| Role | Font | Source |
|---|---|---|
| Headings | **Nunito Variable** | Self-hosted via `@fontsource-variable/nunito` |
| Body | **Inter** | Self-hosted via `@fontsource/inter` |

No Google Fonts — all fonts are self-hosted to avoid third-party DNS lookups.

**Font tokens:**
```css
--font-heading: 'Nunito Variable', 'Nunito', sans-serif;
--font-body:    'Inter', system-ui, sans-serif;
```

**Type scale:** `xs (0.75rem)` → `sm` → `base (1rem)` → `lg` → `xl` → `2xl` → `3xl` → `4xl` → `5xl (3rem)`

**Font weights:** `400 (normal)` · `500 (medium)` · `600 (semibold)` · `700 (bold)` · `800 (extrabold)`

### Logo

Text-based. The site name **"chill-dogs"** is the logo:
- Font: `var(--font-heading)` (Nunito Variable)
- Weight: `800` (extrabold)
- Size: `var(--text-xl)`
- Color: `var(--color-text)` at rest; `var(--color-primary)` on hover

No image or SVG logo mark — the word mark is the identity.

### Spacing Scale

```css
--space-xs:  0.25rem
--space-sm:  0.5rem
--space-md:  1rem
--space-lg:  1.5rem
--space-xl:  2rem
--space-2xl: 3rem
--space-3xl: 4rem
--space-4xl: 6rem
```

### Border Radii

```css
--radius-sm:   0.25rem
--radius-md:   0.5rem
--radius-lg:   1rem
--radius-full: 9999px
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.08)
--shadow-md: 0 4px 12px rgba(0, 0, 0, 0.10)
--shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.12)
```

### Layout

```css
--max-width:       1200px
--max-width-prose: 720px
--header-height:   4rem
```

---

## 8. Content Guardrails

These rules apply to all copy written for or about chill-dogs.com:

- **Do not** describe products as "vet-recommended," "vet-approved," or similar unless the site has real, documented veterinarian sourcing for that exact claim.
- **Do not** imply chill-dogs consulted veterinarians or has veterinary endorsements.
- **Do not** claim products were hands-on tested or physically reviewed by the site unless that actually happened.
- **Prefer** language like: `researched`, `compared`, `curated`, `practical`, `popular`.
- Keep all affiliate disclosure language accurate and visible.
