---
type: context
tags: [ai-context, strategy, creative]
updated: 2026-05-25
---

# Chill-Dogs Portable AI Onboarding Brief

This is a portable context snapshot for sharing `chill-dogs.com` with AI tools that do not already know the site. It is intentionally detailed enough to upload into a blank chatbot, but it is not the final authority when the repository is available.

## Start here when repo access is available

Use the maintained AI documentation and live repo data before relying on this snapshot:

- GitHub AI docs folder: <https://github.com/benstraw/chill-dogs/tree/main/docs/ai>
- `docs/ai/AGENT_START.md` - minimum operating brief
- `docs/ai/AI_INDEX.md` - task-based documentation router
- `docs/ai/KNOWLEDGE_GRAPH.md` - dependency chain between docs
- `docs/system-definition.yaml` - site structure, page types, modules, and conversion architecture
- `src/data/routes.ts` - internal route constants
- `src/data/content-sitemap.ts` and `src/data/sitemap-inventory.ts` - page metadata and related-content inventory
- `src/data/**` - live product, page, and catalog data

If this file conflicts with the maintained docs or live source files, use the maintained docs and source files.

---

## 1. What Chill-Dogs is

**Chill-Dogs** (`chill-dogs.com`) is an Astro 5 static affiliate site for dog lifestyle products. It focuses on cooling, calming, comfort, travel, and dog tracking content. Revenue comes from Amazon Associates commissions.

The primary business question for strategy, content, design, and engineering is:

> Does this drive or support qualified Amazon affiliate clicks?

**Brand name:** Chill-Dogs, hyphenated and title case.

**Domain:** `chill-dogs.com`

**Tagline:** "Stay cool."

**Author of record:** Ben Strawbridge, a careful and practical dog owner who researches questions real dog owners ask. Ben is not a veterinarian, and the site should not imply veterinary authority or endorsements.

---

## 2. Business model and metrics

Chill-Dogs earns through Amazon Associates. The affiliate tag is:

```text
chill-dogs-20
```

The keystone metric is **Amazon affiliate revenue**, supported by qualified outbound clicks to Amazon.

Primary analytics event:

```text
amazon_outbound_click
```

Important supporting events include:

- `collector_to_converter_click` - internal route from informational or section pages to product pages
- `hero_cta_click` - click on a prominent hero CTA
- `hero_impression` - hero visibility event
- `toc_click` - table of contents navigation
- `pinterest_save_click` - Pinterest save interaction
- email events such as `email_signup_view`, `email_signup_start`, and `email_signup_submit`

Secondary metric:

```text
collector_to_converter_click rate
```

This tracks whether traffic captured by collector pages successfully moves toward converter pages.

---

## 3. Page model

Every page has exactly one official page type:

| Type | Job | Success metric |
|---|---|---|
| `converter` | Drive Amazon affiliate outbound clicks | `amazon_outbound_click` rate |
| `collector` | Capture search or topic intent and route users to converters | Organic traffic plus `collector_to_converter_click` rate |
| `attractor` | Convert campaign, social, or broad entry traffic into site engagement | Campaign or entry-path conversion rate |
| `informer` | Legal, admin, and trust content | Accuracy and currency |

Collector pages have subtypes:

- `collectorSubtype: 'section'` - category routing pages such as `/cooling/`, `/calming/`, and `/comforting/`
- `collectorSubtype: 'article'` - long-form guides that answer search intent and route to relevant converters

Do not invent page types. Use only `converter`, `collector`, `attractor`, and `informer`.

### Conversion flow

The site works as a modular conversion system:

```text
Attractor or collector entry -> relevant converter -> Amazon outbound click -> Amazon purchase
```

Collector pages should not duplicate full product comparison implementations. They should qualify the reader's intent and point them to the right converter. Converter pages should stay focused on affiliate clicks.

---

## 4. Content categories

### Cooling

Summer heat relief for dogs. Seasonal intent peaks from May through September.

Common product and content areas:

- cooling mats
- cooling bandanas
- cooling vests
- freezable dog toys
- car cooling gear
- travel hydration
- heat safety articles

### Calming

Anxiety and overstimulation support. Evergreen intent year-round.

Common product and content areas:

- calming product roundups
- ThunderShirt alternatives and anxiety wraps
- car anxiety aids
- lick mats and enrichment tools
- crate training
- fireworks calm-room setup
- CBD safety and expectation-setting content

### Comfort

Rest, recovery, and relaxation. Theme color is dusty rose.

Common product and content areas:

- calming dog beds
- orthopedic dog beds
- puppy crates
- anxiety crates
- road-trip travel crates
- airline crates
- airline-approved soft-sided carriers
- dog travel bags
- furniture dog crates
- heavy-duty dog crates
- sleep education

### Travel, gear, and safety

Travel and lost-dog prevention content connects cooling, calming, comfort, and tracking.

Common areas:

- dog road trip gear
- flying with a dog
- GPS tracker comparisons
- Fi collar review
- Garmin dog tracking collar education
- AirTag expectation-setting
- lost-dog safety guide
- Rhys runaway story

---

## 5. Current route families

This list is a practical orientation map. When coding, use `src/data/routes.ts` and the sitemap inventory instead of hardcoding these strings.

### Attractor

- `/` - home page, routes visitors into cooling, calming, comfort, crate, and travel paths

### Section collectors

- `/cooling/`
- `/calming/`
- `/comforting/`

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

### Gear and tracking converters

- `/gear/best-dog-gps-trackers/`
- `/gear/fi-dog-collar-review/`
- `/shop/` - cross-pillar product browse page; this is a converter because it drives Amazon affiliate clicks

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

### Informer and admin pages

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

## 6. Affiliate and compliance rules

All Amazon links must use `src/components/AffiliateLink.astro`.

Never write a plain `<a>` tag for an Amazon URL.

```astro
<!-- Correct -->
<AffiliateLink href="https://www.amazon.com/dp/ASIN/?tag=chill-dogs-20">
  Buy on Amazon
</AffiliateLink>

<!-- Wrong -->
<a href="https://www.amazon.com/dp/ASIN/?tag=chill-dogs-20">Buy on Amazon</a>
```

The affiliate tag must stay `chill-dogs-20`.

The affiliate disclosure must be visible where affiliate content appears. Converter pages require disclosure before product CTAs. Article collectors require disclosure when product cards or affiliate links appear.

The full affiliate disclosure page is `/affiliate-disclosure/`.

---

## 7. Content guardrails

Do not say or imply:

- products are `vet-recommended`, `vet-approved`, or similar without documented sourcing for that exact claim
- Chill-Dogs consulted veterinarians when it did not
- Chill-Dogs has veterinary endorsements
- products were hands-on tested, ordered, tried, or physically reviewed unless that actually happened
- CBD is recommended or dosed by Chill-Dogs
- safety, medical, or legal certainty beyond the available sourcing

Prefer language like:

- `researched`
- `compared`
- `curated`
- `practical`
- `popular`

Tone should be measured, practical, calm, peer-level, and specific. Avoid breathless marketing copy.

---

## 8. Technical stack

| Layer | Technology |
|---|---|
| Framework | Astro 5 static site generation |
| Package manager | Bun |
| Runtime requirement | `bun@1.3.6` |
| Language | TypeScript |
| Content | Code-first TypeScript data files and MDX articles |
| Styling | Vanilla CSS with scoped Astro styles and custom properties |
| Hosting | Vercel |
| Analytics | PostHog |
| Email | Buttondown |

There is no CMS and no server-rendered backend.

### Commands

```bash
bun install --frozen-lockfile
bun run dev
bun run build
bun run preview
bun run test
bun run test:smoke
bun run test:coverage
bun run check:asins
bun run check:amazon
bun run check:ai-docs
```

The pre-commit hook runs:

```bash
bun run test && bun run test:smoke
```

For substantive page or module changes, run both:

```bash
bun run test
bun run build
```

For documentation-only AI doc changes, run:

```bash
bun run check:ai-docs
```

### Path aliases

```text
@components -> src/components
@layouts    -> src/layouts
@styles     -> src/styles
@data       -> src/data
@utils      -> src/utils
```

---

## 9. Data and architecture rules

Internal routes should come from `src/data/routes.ts`.

Static non-MDX pages are registered in `src/data/content-sitemap.ts`. MDX article collectors are discovered through `canonicalPath` frontmatter. `src/data/sitemap-inventory.ts` combines the full inventory at build time.

Related links should derive from sitemap metadata through the related-content system. Do not add new manual related arrays.

Important metadata fields:

- `topics`
- `pinnedRelated`
- `excludeRelated`
- `relatedLabel`

Product data should flow through shared data/catalog modules. If a product appears in multiple places, copy edits usually belong in the canonical product record under `src/data/**`, not a page-specific override.

The `/admin/products/` page should stay complete through shared product imports. Do not hardcode product rows there.

---

## 10. Brand and design context

### Voice

Chill-Dogs sounds calm, practical, specific, and owner-to-owner. It should feel researched and trustworthy without claiming clinical authority.

### Palette

| Token | Hex | Role |
|---|---|---|
| `--color-sky` | `#87b7c7` | Cooling theme and primary CTA |
| `--color-sage` | `#8fa98b` | Calming theme and accent |
| `--color-rose` | `#b56f76` | Comfort theme |
| `--color-sand` | `#e8dcc8` | Warm neutral and secondary surfaces |
| `--color-cream` | `#f5f0e8` | Light surface and card backgrounds |
| `--color-terracotta` | `#c4704b` | Warm accent and secondary CTAs |
| `--color-charcoal` | `#2d2d2d` | Primary text |

### Typography

- Headings: Nunito Variable, self-hosted through `@fontsource-variable/nunito`
- Body: Inter, self-hosted through `@fontsource/inter`
- No Google Fonts

### Logo

- Logo mark: `public/images/paw-logo.png`
- Padded logo: `public/images/chill-dogs-logo-padded.png`
- Logo concept: paw print gradient blending sky, sage, and rose

---

## 11. Working rules for AI agents

When coding in the repo:

1. Identify the page type before changing a page.
2. Use existing modules and data-driven patterns before creating new scaffolding.
3. Use `ROUTES` constants for internal links.
4. Use `AffiliateLink.astro` for Amazon links.
5. Keep affiliate disclosures accurate and visible.
6. Keep product claims conservative and sourced.
7. Register new non-MDX pages in `src/data/content-sitemap.ts`.
8. Update `docs/system-definition.yaml` when pages, routes, page types, module stacks, navigation, or conversion flow change.
9. Use sitemap metadata for related content.
10. Run the relevant checks before finishing.

For task-specific instructions, read the relevant files under `docs/ai/` before editing.
