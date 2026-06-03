---
title: Chill-Dogs Site Context
type: canonical
domain: strategy
status: active
updated: 2026-05-25
tags:
  - chill-dogs
  - context
  - site-overview
  - brand
  - tech-stack
related:
  - ../AGENT_START.md
  - web-systems.md
  - metrics-and-page-types.md
---

# Chill-Dogs Site Context

Canonical AI strategy context for what Chill-Dogs is, how it earns money, what it covers, and how it is built. For route constants, page registration, and product data, defer to the live repo files listed in `../AGENT_START.md` and `../AI_INDEX.md`.

## Use this when

You need background on the site before writing content, building pages, or making a decision that requires understanding the business model, categories, or brand.

---

## What Chill-Dogs is

**Chill-Dogs** (`chill-dogs.com`) is an Amazon affiliate site for dog lifestyle products: cooling, calming, comfort, travel, and tracking/safety. Revenue comes from Amazon Associates commissions.

**Brand name:** Chill-Dogs, hyphenated and title case. Domain: `chill-dogs.com`. Tagline: "Stay cool."

**Author of record:** Ben Strawbridge, a careful and practical dog owner who researches questions real dog owners ask. Ben is not a veterinarian.

---

## Business model

Affiliate revenue via the Amazon Associates program.

- Affiliate tag: `chill-dogs-20`.
- Every Amazon URL must contain `?tag=chill-dogs-20`.
- All Amazon links must use `AffiliateLink.astro`, never a plain `<a>` tag.
- The keystone event is `amazon_outbound_click`.
- Every design, content, and engineering decision is evaluated against whether it drives or supports affiliate clicks.

---

## Content categories

### Cooling

Summer heat relief for dogs. High seasonal intent from May through September.

- Product types: cooling mats, cooling bandanas, cooling vests, freezable dog toys, car cooling gear, travel hydration
- Related article intent: car heat, heat safety, road-trip cooling
- Cross-links naturally with calming because hot or uncomfortable dogs can also become anxious

### Calming

Anxiety and overstimulation support. Evergreen intent year-round.

- Product types: anxiety wraps and ThunderShirt alternatives, calming treats, lick mats, snuffle mats, car anxiety aids
- Related article intent: crate training, fireworks calm-room setup, CBD expectation-setting

### Comfort

Rest, recovery, and relaxation. Theme color: Dusty Rose.

- Product types: calming dog beds, orthopedic dog beds, puppy crates, anxiety crates, travel crates, airline crates, airline carriers, furniture crates, heavy-duty crates, travel bags

### Travel / Gear / Safety

Travel planning, dog tracking, and lost-dog prevention.

- Article collectors for road trips, flying with dogs, GPS expectations, and lost-dog safety
- Converter pages for GPS trackers and Fi collar review

---

## Current page map

Use this as a readable orientation map. When coding, use `src/data/routes.ts`, `src/data/content-sitemap.ts`, MDX frontmatter, and the complete sitemap inventory.

### Attractor

- `/` - Home, routes to cooling, calming, comfort, crate, and travel paths

### Section collectors

- `/cooling/` - Cooling section collector
- `/calming/` - Calming section collector
- `/comforting/` - Comfort & Rest section collector

### Article collectors

- `/cooling/keep-dog-cool-in-car/`
- `/cooling/how-hot-is-too-hot-for-dogs/`
- `/calming/crate-training-for-dogs/`
- `/calming/cbd-for-dogs/`
- `/calming/how-to-prepare-a-calm-room-for-fireworks-night/`
- `/comforting/how-much-do-dogs-sleep/`
- `/travel/dog-road-trip-gear/`
- `/travel/how-to-fly-with-a-dog/`
- `/travel/rhys-ran-away-cerro-san-luis-obispo/`
- `/gear/garmin-dog-tracking-collars/`
- `/gear/airtag-for-dogs/`
- `/safety/what-to-do-if-your-dog-runs-away/`

### Cooling converters

- `/cooling/best-cooling-products-for-dogs/`
- `/cooling/cooling-mats/`
- `/cooling/cooling-bandanas/`
- `/cooling/cooling-vests/`
- `/cooling/freezable-dog-toys/`
- `/cooling/car-cooling-for-dogs/`
- `/cooling/dog-travel-hydration/`

### Calming converters

- `/calming/best-calming-products-for-anxious-dogs/`
- `/calming/best-thundershirt-alternatives/`
- `/calming/car-anxiety-for-dogs/`
- `/calming/best-lick-mats-for-dogs/`

### Comfort converters

- `/comforting/best-calming-dog-beds/`
- `/comforting/best-orthopedic-dog-beds/`
- `/comforting/best-puppy-crates/`
- `/comforting/best-anxiety-dog-crates/`
- `/comforting/best-travel-crates-for-road-trips/`
- `/comforting/best-airline-crates-for-flying-with-your-dog/`
- `/comforting/best-airline-approved-dog-carriers/`
- `/comforting/best-dog-travel-bags-for-flying/`
- `/comforting/best-furniture-dog-crates/`
- `/comforting/best-heavy-duty-dog-crates/`

### Gear and browse converters

- `/gear/best-dog-gps-trackers/`
- `/gear/fi-dog-collar-review/`
- `/shop/`

### Informer pages

- `/about/`
- `/contact/`
- `/affiliate-disclosure/`
- `/privacy-policy/`
- `/terms/`
- `/admin/products/`
- `/content-sitemap/`
- `/subscribe/thanks/`
- `/subscribe/confirmed/`

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 static site generation |
| Package manager | Bun |
| Runtime requirement | `bun@1.3.6` |
| Language | TypeScript |
| Styling | Vanilla CSS with scoped Astro styles and custom properties |
| Hosting | Vercel |
| Analytics | PostHog (`PUBLIC_POSTHOG_KEY`) |
| Email | Buttondown (`PUBLIC_BUTTONDOWN_FORM_ACTION`) |

No CMS. Content is code-first TypeScript data files or MDX articles in `src/content/articles/`.

---

## Color palette

| Token | Hex | Role |
|---|---|---|
| `--color-sky` | `#87b7c7` | Cooling theme, primary CTA |
| `--color-sage` | `#8fa98b` | Calming theme, accent |
| `--color-rose` | `#b56f76` | Comfort theme |
| `--color-sand` | `#e8dcc8` | Warm neutral, secondary surfaces |
| `--color-cream` | `#f5f0e8` | Light surface, card backgrounds |
| `--color-terracotta` | `#c4704b` | Warm accent, secondary CTAs |
| `--color-charcoal` | `#2d2d2d` | Primary text |

---

## Typography

- **Headings:** Nunito Variable, self-hosted through `@fontsource-variable/nunito`
- **Body:** Inter, self-hosted through `@fontsource/inter`
- No Google Fonts

---

## Brand rules

- Brand name: **Chill-Dogs**, hyphenated and title case
- Logo: gradient paw print blending sky, sage, and rose
- Logo mark: `public/images/paw-logo.png`
- Voice: measured, practical, calm, peer-level, specific
- Avoid hyperactive, breathless, or unsupported marketing copy

---

## Content guardrails

- Do not describe products as "vet-recommended" or "vet-approved" without documented sourcing.
- Do not imply Chill-Dogs consulted veterinarians or has medical authority.
- Do not claim products were hands-on tested unless that actually happened.
- Prefer: `researched`, `compared`, `curated`, `practical`, `popular`.
- Full guardrails: [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md)

---

## Amazon affiliate tag

```text
chill-dogs-20
```

This tag must appear on every Amazon URL. Never change it. Verify it whenever writing or editing any Amazon link.

---

## Primary analytics event

`amazon_outbound_click` fires on every `AffiliateLink` click.

Expected properties include `page_slug`, `product_name`, `product_category`, `position`, and `destination`.

---

## Related knowledge

- [`../AGENT_START.md`](../AGENT_START.md) - Quick operating constraints
- [`web-systems.md`](web-systems.md) - Why these rules exist
- [`metrics-and-page-types.md`](metrics-and-page-types.md) - Page type definitions
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) - Affiliate link rules
