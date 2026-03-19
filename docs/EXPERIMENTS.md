# Hero Experiment System

Lightweight, color-based hero experiments for the Cooling and Calming hub pages.
No images, no heavy JS, no third-party animation libraries.

## URLs

| Page     | Control (canonical)   | Variants                                |
|----------|-----------------------|-----------------------------------------|
| Cooling  | `/cooling/`           | `/cooling/v/a/` … `/cooling/v/h/`      |
| Calming  | `/calming/`           | `/calming/v/a/` … `/calming/v/g/`      |
| Homepage | `/`                   | `/v/v1/` … `/v/v5/`                    |

All variant pages carry `<meta name="robots" content="noindex, follow">` and
a canonical link pointing to the control URL. The body content below the hero
is identical across control and all variants.

---

## Experiment Status

| Page    | Status   | Winner      | Notes                                                  |
|---------|----------|-------------|--------------------------------------------------------|
| Cooling | Active   | —           | Variant A is control; variant H (Playful Animated) added for comparison |
| Calming | Complete | Variant A   | Aurora Wash promoted to default; variant URLs remain live |
| Homepage | Active  | —           | v1 is current default; collecting data                 |

---

## Variants

### Variant A — Aurora Wash Gradient

**Design:** Multi-radial gradients (sky/teal/navy) layered over a very dark base.
Rich depth without any images.

**Cooling accent:** Sky blue (#3bb5d6-ish), deep navy, teal
**Calming accent:** Sage green, muted plum, forest green

**Hypothesis:** A dramatic dark-base hero signals premium/serious intent,
priming visitors to trust our picks before they see the first product card.
Higher perceived authority → higher CTA click-through.

**Primary metric:** Hero primary CTA click-through rate
**Secondary metric:** Downstream affiliate link clicks on `/best-cooling-products-for-dogs/`

---

### Variant B — Split Temperature / Temperament

**Design:** Two-tone vertical split (dark navy left / accent right).
Headline spans both halves with a strong text-shadow for readability.
Switches to horizontal split on mobile.

**Hypothesis:** A high-contrast split signals visual decisiveness and
differentiation, reducing hesitation before clicking. "Two worlds" framing
reinforces the page's purpose (cool vs hot, anxious vs calm).

**Primary metric:** Primary CTA click-through
**Secondary metric:** Scroll depth past hero (via `scroll` event in analytics)

---

### Variant C — Conic Spotlight

**Design:** Light-toned gradient base with a blurred conic-gradient "spotlight"
rising from below center. Subtle glow effect, especially effective for the
calming theme's softer palette.

**Hypothesis:** A soft, atmospheric background removes visual noise and
keeps all attention on the headline + CTA. Light backgrounds tend to load
with lower perceived "weight", encouraging casual visitors to stay and read.

**Primary metric:** Primary CTA click-through
**Secondary metric:** Secondary CTA click-through ("How we choose products" / "What to try first")

---

### Variant D — Pattern Overlay

**Design:** Dot-grid (repeating-radial-gradient, 22px pitch) blended over a
light gradient background via `background-blend-mode: multiply`. Dots use a
diluted accent color and stay subtle — readability is never compromised.

**Hypothesis:** Subtle texture signals craft and intentionality without
adding weight or complexity. Distinguishes the page from blank-white
competitors without distraction.

**Primary metric:** Primary CTA click-through
**Secondary metric:** Time-on-page (proxy for engagement with below-fold content)

---

### Variant E — Glass Card

**Design:** Saturated gradient background (same multi-radial as variant A)
with a translucent frosted-glass card (`backdrop-filter: blur(16px)`) containing
the headline, subhead, and CTAs. Falls back gracefully: when backdrop-filter is
unsupported, the card uses a solid semi-transparent background.

**Hypothesis:** The glass card creates visual separation that focuses the eye
on the offer. The saturation contrast between bg and card draws immediate
attention to CTAs.

**Primary metric:** Primary CTA click-through
**Secondary metric:** Mobile vs desktop click-through split (backdrop-filter fallback path)

---

### Variant F — Kinetic Underline

**Design:** Light gradient background (same as C). The entire headline is
wrapped in a `<span class="hx-kinetic">` that animates an underline sliding
in from left using a CSS `::after` + `@keyframes` + `transform: scaleX()`.
Animation respects `prefers-reduced-motion: reduce` — shows the underline
statically when motion is disabled.

**Hypothesis:** A single, purposeful motion element draws the eye to the
headline and increases reading fixation, leading to better copy recall
and higher CTA activation.

**Primary metric:** Primary CTA click-through
**Secondary metric:** Reduced-motion visitor click-through (compare against full-motion cohort)

---

### Variant G — Minimal Badge + Big Type

**Design:** Near-white gradient with a small uppercase pill badge above the
headline (e.g. "BEAT THE HEAT" / "FIND YOUR CALM"). The headline is
significantly oversized (`clamp(2.5rem, 6.5vw, 3.75rem)`) with tight
letter-spacing. Clean, editorial, zero visual clutter.

**Hypothesis:** Maximum typographic weight with minimal visual noise produces
the fastest path from landing to CTA click. Badge functions as a category
anchor, reducing cognitive load for first-time visitors.

**Primary metric:** Primary CTA click-through
**Secondary metric:** Bounce rate relative to control

---

### Variant H — Playful Animated Scene (Cooling only)

**Design:** Bespoke full-scene hero — layered SVG wavy ground (navy → teal → aqua → ice →
powder), rotating CSS sun with repeating-conic-gradient rays and radial glow (top-right),
floating cool elements (❄ 💧 ✦), CSS dog with squinting eyes, lazy tail wag, panting
tongue, and a "so chill" thought bubble. Content lives in a frosted-glass card
(`backdrop-filter: blur(18px) saturate(150%)`). Headline uses an animated gradient
cycling through powder → aqua → teal → sky. Fonts: Baloo 2 + Fredoka. All animations
off under `prefers-reduced-motion`.

**Cooling accent:** Navy sky (#1a5f8a), teal (#2ec4b6), aqua (#4de8c4), ice (#a8daec),
powder (#d6eef8). Warm sun contrast: #ff9020 / #ffd166.

**Hypothesis:** A playful, character-driven scene with visible motion signals personality
and memorability, driving stronger brand recall and CTA activation than a gradient-only
hero. The visual "it's hot, but the dog is chill" narrative reinforces the product
category's promise at a glance.

**Primary metric:** Hero primary CTA click-through rate vs variant A control
**Secondary metric:** Downstream affiliate link clicks on `/best-cooling-products-for-dogs/`

**URL:** `/cooling/v/h/`
**Component:** `src/components/modules/CoolingHubHero.astro`

---

## Tracking Implementation

All variants instrument two event surfaces:

### 1. `data-*` attributes on the DOM

```html
<!-- Hero root -->
<section data-hero-variant="a" ...>

<!-- CTA links -->
<a data-hero-cta="primary" ...>
<a data-hero-cta="secondary" ...>
```

### 2. JavaScript event emission

On every CTA click, the page emits via `track()` from `src/scripts/analytics.ts`:

```js
import { track } from '@scripts/analytics';

track('hero_cta_click', {
  page: 'cooling' | 'calming',
  variant: 'a' | 'b' | ... | 'g',
  cta: 'primary' | 'secondary',
});
```

`track()` calls `window.posthog.capture()` when PostHog is loaded, and falls
back to `console.log` in dev. Do not call `posthog.capture()` directly — always
go through `track()`.

---

## CSS Architecture

| File | Purpose |
|------|---------|
| `src/styles/hero.base.css` | Theme tokens (cooling/calming), base layout, typography, CTA focus states, mobile breakpoints |
| `src/styles/hero.variants.css` | Per-variant background, color, and effect rules (a–h; variant h styles are self-contained in CoolingHubHero.astro) |
| `src/components/modules/HeroExperiment.astro` | Component template for variants a–g; imports both CSS files; handles variant-specific markup differences |
| `src/components/modules/CoolingHubHero.astro` | Self-contained component for variant h; SVG art, CSS dog, glass card, and all styles scoped within |

Both CSS files are imported inside the Astro component's `<style>` block and
are scoped to the component via Astro's data-attribute mechanism.

---

## Accessibility Notes

- All variants meet **WCAG AA 4.5:1** contrast for body text and CTA buttons.
- CTA buttons have explicit `focus-visible` outlines (3px solid currentColor,
  offset 4px) — never hidden or overridden.
- The kinetic underline animation (variant F) is fully disabled via
  `prefers-reduced-motion: reduce` — the underline appears statically.
- Backdrop-filter (variant E) has a solid-color fallback for older browsers.
- Screen readers see the section as `<section aria-label="Page hero">`.

---

## Measurement Checklist

Before declaring a winner:

- [ ] Minimum 200 primary CTA clicks per variant (per page) before calling significance
- [ ] Run variants for at least 2 full weeks to capture weekly seasonality
- [ ] Check mobile/desktop split — some variants (B, E) may diverge significantly
- [ ] Verify `data-hero-variant` appears in GA4 event reports for each variant URL
- [ ] Confirm canonical tags are resolving correctly (no variant URLs indexed)
- [ ] After winner selection: set winner as the control hero on the index page,
  retire losing variant URLs, or redirect them

---

## Optional: Slides

A Marp-compatible slides file is available at `docs/hero-experiments-slides.md`
if you need to present this experiment plan to stakeholders. Each slide covers
one variant with hypothesis, implementation notes, and metric definitions.

---

# Homepage Hero Experiment — Temperature vs Temperament

A split-pane hero that routes visitors directly into either the cooling or calming
category hub. Unlike the single-theme hub heroes, this one presents both destinations
simultaneously and measures which visual style produces the highest combined CTA engagement.

## URLs

| Control | Variants             |
|---------|----------------------|
| `/`     | `/v/v1/` … `/v/v5/` |

All variant pages carry `noindex, follow` + `<link rel="canonical" href="/">`.
Body content (Top Guides + Latest Posts) is identical across control and all variants.

---

## Variants

### Variant v1 — Split Screen Gradient + Grain (default)

**Design:** True 50/50 split with two bold multi-radial gradients — deep navy/teal
for cooling, deep forest/sage for calming. An SVG feTurbulence grain overlay adds
subtle texture. Hover brightens the moused-over pane slightly.

**Hypothesis:** Bold, high-contrast split signals two distinct value propositions
without ambiguity. The grain texture adds premium feel. Visitors self-select
into their problem category faster than a single-theme hero allows.

**Primary metric:** Combined cooling + calming CTA click-through rate vs overall visitors
**Secondary metric:** Cooling vs calming click distribution (does one dominate?)

---

### Variant v2 — Poster Typography + CSS Pattern

**Design:** Solid dark panes with diagonal stripe texture via `repeating-linear-gradient`.
Large faint "TEMP." and "CALM." ghost words positioned behind each pane's content via
`::after` pseudo-elements. Headline and pane titles use tighter letter-spacing and
larger clamp ranges for a bold editorial feel.

**Hypothesis:** Oversized typography and textural richness hold attention longer,
giving copy more time to land. The ghost words reinforce category identity without
adding visual clutter.

**Primary metric:** Combined CTA click-through
**Secondary metric:** Scroll depth below the hero (does richer top-of-page content improve engagement?)

---

### Variant v3 — Diagonal / Geometric Split (clip-path)

**Design:** The cooling pane uses `clip-path: polygon()` to create a diagonal
right edge, with the calming pane flowing into the freed space. Falls back
gracefully to a straight 50/50 split on browsers without clip-path support.

**Hypothesis:** A non-rectangular split creates visual surprise and momentum,
guiding the eye from left (cool) to right (calm). The diagonal implies movement
and direction — useful for a decision-oriented page.

**Primary metric:** Combined CTA click-through
**Secondary metric:** Mobile vs desktop CTR split (clip-path degrades on mobile; tests whether
the fallback still converts at parity)

---

### Variant v4 — Toggle Mode (segmented control)

**Design:** A segmented control above the split shows one category pane at a time.
Tabs are implemented as `<label>` elements tied to hidden radio inputs — no JS
required for the core toggle. JS enhances with localStorage persistence so
returning visitors see their previous selection. CTAs appear prominently for
whichever mode is active.

**Hypothesis:** Reducing simultaneous choice to one option at a time lowers
decision friction. Visitors commit to one category before being presented with
a single CTA, potentially increasing click intent on the visible option.

**Primary metric:** CTA click-through on the active/visible pane
**Secondary metric:** Cool vs calm tab selection distribution (which category do
visitors choose first?)

---

### Variant v5 — Generative Gradient Field

**Design:** Multi-layer radial gradients (cool blue at left, sage green at right,
deep indigo at bottom) create a "generative blob" background that spans the full
hero. Both panes use semi-transparent backdrops; where `backdrop-filter` is
available, a blur enhances the glass-like separation.

**Hypothesis:** A fluid, organic background feels warmer and less product-catalog
than flat or striped alternatives. The merged gradient hints at the two categories
without hard separation, potentially keeping undecided visitors engaged longer
before they self-select.

**Primary metric:** Combined CTA click-through
**Secondary metric:** Bounce rate relative to control

---

## Tracking Implementation

### DOM attributes

```html
<!-- Hero root -->
<section data-hero-variant="v1" data-hero-impression="true" ...>

<!-- CTA links -->
<a data-cta="cooling" href="/cooling/">Explore cooling picks</a>
<a data-cta="calming" href="/calming/">Explore calming picks</a>
```

### JavaScript event emission

Via `track()` from `src/scripts/analytics.ts`:

**Impression** (fires once at 50% IntersectionObserver visibility):
```js
import { track } from '@scripts/analytics';

track('hero_impression', { variant: 'v1' });
```

**CTA click:**
```js
track('hero_cta_click', { variant: 'v1', cta: 'cooling', href: '/cooling/' });
```

`track()` calls `window.posthog.capture()` when PostHog is loaded, and falls
back to `console.log` in dev. Do not call `posthog.capture()` directly — always
go through `track()`.

---

## CSS Architecture

| File | Purpose |
|------|---------|
| `src/styles/hero.home.base.css` | Token defaults, base layout, split panes, CTA buttons, tabs, mobile, reduced motion |
| `src/styles/hero.home.variants.css` | Per-variant backgrounds, effects, and token overrides (v1–v5) |
| `src/components/modules/HomepageHero.astro` | Template; imports both CSS files; handles v4 radio markup conditionally |
| `src/components/modules/HomepageBody.astro` | Below-hero content (Top Guides + Latest Posts); shared by `/` and all `/v/vN/` pages |

---

## Accessibility Notes

- All variants target WCAG AA 4.5:1 contrast for text and CTA buttons against pane backgrounds.
- CTA links have `focus-visible` outlines (3px solid, 4px offset) — never suppressed.
- v3 clip-path: `@supports` fallback ensures a clean split on unsupported browsers.
- v4 labels have `tabindex="0"`; JS binds Enter/Space for keyboard activation.
- v5 backdrop-filter: falls back to a solid semi-transparent pane background.
- `prefers-reduced-motion: reduce` disables all transitions and animations.

---

## Measurement Checklist

- [ ] Minimum 200 combined CTA clicks per variant before calling significance
- [ ] Run for at least 2 full weeks to capture weekly seasonality
- [ ] Check cooling vs calming click split per variant — some variants may skew one direction
- [ ] Check mobile/desktop split — v3 clip-path and v5 backdrop-filter may diverge by device
- [ ] Verify `data-hero-variant` appears in GA4 event reports for each variant URL
- [ ] Confirm canonical tags resolve correctly (no `/v/vN/` URLs indexed)
- [ ] After winner selection: promote winner to `/` as new default, retire or redirect variant URLs
