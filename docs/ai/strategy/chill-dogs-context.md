---
title: Chill-Dogs Site Context
type: canonical
domain: strategy
status: active
updated: 2026-05-23
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

Single source of truth for what Chill-Dogs is, how it earns money, what it covers, and how it is built.

## Use this when

You need background on the site before writing content, building pages, or making any decision that requires understanding the business model, categories, or brand.

---

## What Chill-Dogs is

**Chill-Dogs** (`chill-dogs.com`) is an Amazon affiliate site for dog lifestyle — specifically cooling, calming, comfort, and travel products. Revenue comes entirely from Amazon Associates commissions.

**Brand name:** Chill-Dogs (hyphenated, title case). Domain: `chill-dogs.com`. Tagline: "Stay cool."

**Author of record:** Ben Strawbridge — a careful, practical dog owner who researches questions real dog owners ask. Not a veterinarian.

---

## Business model

Affiliate revenue via the Amazon Associates program (tag: `chill-dogs-20`).

- Every Amazon URL must contain `?tag=chill-dogs-20`.
- All Amazon links must use `AffiliateLink.astro` — never a plain `<a>` tag.
- The keystone event is `amazon_outbound_click`.
- Every design, content, and engineering decision is evaluated against: does this drive or support affiliate clicks?

---

## Content categories

### Cooling

Summer heat relief for dogs. High seasonal intent (May–September peak).

- Product types: cooling mats, cooling bandanas, cooling vests, freezable dog toys, car cooling gear
- Cross-links naturally with calming (hot dogs are often anxious dogs)

### Calming

Anxiety management for dogs. Evergreen intent year-round.

- Product types: anxiety wraps/ThunderShirt alternatives, calming treats, lick mats, snuffle mats, car anxiety aids

### Comfort

Rest, recovery, and relaxation. Theme color: Dusty Rose.

- Product types: calming dog beds, orthopedic dog beds, puppy crates, anxiety crates, travel crates, airline crates, airline carriers, furniture crates, heavy-duty crates

### Travel / Gear

Road trips, air travel, GPS tracking, safety.

- Article collectors for road trips, flying with dogs, crate training
- GPS tracker converters (cellular, off-grid, Bluetooth)

---

## Current page map

### Attractor
- `/` — Home: routes to cooling, calming, comfort, travel

### Collectors (section)
- `/cooling/` — Cooling section collector
- `/calming/` — Calming section collector
- `/comforting/` — Comfort & Rest section collector

### Collectors (article)
- `/cooling/keep-dog-cool-in-car/`
- `/cooling/how-hot-is-too-hot-for-dogs/`
- `/calming/crate-training-for-dogs/`
- `/comforting/how-much-do-dogs-sleep/`
- `/travel/dog-road-trip-gear/`
- `/travel/how-to-fly-with-a-dog/`
- `/travel/rhys-ran-away-cerro-san-luis-obispo/`
- `/gear/garmin-dog-tracking-collars/`
- `/gear/airtag-for-dogs/`
- `/safety/what-to-do-if-your-dog-runs-away/`

### Converters (cooling)
- `/cooling/best-cooling-products-for-dogs/`
- `/cooling/cooling-mats/`
- `/cooling/cooling-bandanas/`
- `/cooling/cooling-vests/`
- `/cooling/freezable-dog-toys/`
- `/cooling/car-cooling-for-dogs/`

### Converters (calming)
- `/calming/best-calming-products-for-anxious-dogs/`
- `/calming/best-thundershirt-alternatives/`
- `/calming/car-anxiety-for-dogs/`

### Converters (comfort)
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

### Converters (tracking/gear)
- `/gear/best-dog-gps-trackers/`
- `/gear/fi-dog-collar-review/`

### Informer pages
- `/about/`, `/contact/`, `/affiliate-disclosure/`, `/privacy-policy/`, `/terms/`
- `/admin/products/`, `/content-sitemap/`
- `/subscribe/thanks/`, `/subscribe/confirmed/`

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 (full static build — SSG) |
| Package manager | Bun |
| Language | TypeScript |
| Styling | Vanilla CSS with custom properties (no Tailwind) |
| Hosting | Vercel — auto-detects Astro, deploys on push to `main` |
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

- **Headings:** Nunito Variable (self-hosted via `@fontsource-variable/nunito`)
- **Body:** Inter (self-hosted via `@fontsource/inter`)
- No Google Fonts — all self-hosted to avoid third-party DNS lookups.

---

## Brand rules

- Brand name: **Chill-Dogs** (hyphenated, title case)
- Logo: gradient paw print blending sky → sage → rose top to bottom
- Logo mark: `public/images/paw-logo.png`
- Voice: measured, practical, calm, peer-level — not hyperactive, not breathless, not marketing-speak

---

## Content guardrails

- Do not describe products as "vet-recommended" or "vet-approved" without documented sourcing.
- Do not imply Chill-Dogs consulted veterinarians or has medical authority.
- Do not claim products were hands-on tested unless that actually happened.
- Prefer: `researched`, `compared`, `curated`, `practical`, `popular`.
- Full guardrails: [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md)

---

## Amazon affiliate tag

```
chill-dogs-20
```

This tag must appear on every Amazon URL. Never change it. Verify it is present whenever writing or editing any Amazon link.

---

## Primary analytics event

`amazon_outbound_click` — fires on every `AffiliateLink` click. Properties: `page_slug`, `product_name`, `product_category`, `position`, `destination`.

---

## Related knowledge

- [`../AGENT_START.md`](../AGENT_START.md) — Quick operating constraints
- [`web-systems.md`](web-systems.md) — Why these rules exist
- [`metrics-and-page-types.md`](metrics-and-page-types.md) — Page type definitions
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — Affiliate link rules
