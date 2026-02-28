# Hero Experiment System

Lightweight, color-based hero experiments for the Cooling and Calming hub pages.
No images, no heavy JS, no third-party animation libraries.

## URLs

| Page    | Control (canonical)   | Variants                                |
|---------|-----------------------|-----------------------------------------|
| Cooling | `/cooling/`           | `/cooling/v/a/` … `/cooling/v/g/`      |
| Calming | `/calming/`           | `/calming/v/a/` … `/calming/v/g/`      |

All variant pages carry `<meta name="robots" content="noindex, follow">` and
a canonical link pointing to the control URL. The body content below the hero
is identical across control and all variants.

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

On every CTA click, the page emits:

```js
// dataLayer (GA4 / GTM compatible)
window.dataLayer.push({
  event: 'hero_cta_click',
  page: 'cooling' | 'calming',
  variant: 'a' | 'b' | ... | 'g',
  cta: 'primary' | 'secondary',
});

// also calls gtag() directly if the function is present
gtag('event', 'hero_cta_click', { page, variant, cta });
```

To connect to GA4: configure a custom event trigger in GTM or create a
GA4 custom event definition for `hero_cta_click` with the three parameters.

---

## CSS Architecture

| File | Purpose |
|------|---------|
| `src/styles/hero.base.css` | Theme tokens (cooling/calming), base layout, typography, CTA focus states, mobile breakpoints |
| `src/styles/hero.variants.css` | Per-variant background, color, and effect rules (a–g) |
| `src/components/modules/HeroExperiment.astro` | Component template; imports both CSS files; handles variant-specific markup differences (glass card wrapper for E, kinetic span for F, badge for G) |

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
