---
title: Analytics Events
type: canonical
domain: engineering
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - engineering
  - analytics
  - posthog
  - tracking
  - events
related:
  - architecture.md
  - build-and-test-commands.md
  - ../strategy/chill-dogs-context.md
---

# Analytics Events

PostHog setup, event definitions, data-track pattern, and tracking rules for chill-dogs.com.

## Use this when

Wiring analytics events to new components, verifying existing tracking, or understanding what events are defined.

---

## Platform

**PostHog** is the primary analytics and experimentation platform.

- A/B experiments via Feature Flags
- Funnel analysis
- Session recordings
- Keystone event: `amazon_outbound_click`

**Setup:** Set `PUBLIC_POSTHOG_KEY` in `.env` and Vercel environment variables. Optionally set `PUBLIC_POSTHOG_HOST` (defaults to `https://us.i.posthog.com`).

---

## Init rule

`src/components/Analytics.astro` calls `init()` once globally.

**Do not add per-page `init()` calls.** One global init is the pattern.

---

## How tracking works

### `data-track` pattern (click events)

Add `data-track="event_name"` to any HTML element. Additional `data-*` attributes become event properties.

```html
<button
  data-track="hero_cta_click"
  data-variant="a"
  data-page="cooling"
>
  See Cooling Picks
</button>
```

When the element is clicked, `analytics.ts` captures the event with all `data-*` attributes (excluding `data-track`) as properties.

### `track()` function (programmatic)

Import `track` from `src/scripts/analytics.ts` for non-click events:

```typescript
import { track } from '@scripts/analytics';
track('hero_impression', { variant: 'a', page: 'cooling' });
```

---

## Defined events

| Event | Trigger | Key Properties |
|---|---|---|
| `amazon_outbound_click` | Click on any `AffiliateLink` component | `asin`, `product_name`, `page_slug`, `position` |
| `hero_cta_click` | Click on hub page hero CTA | `variant`, `page`, `cta` (primary/secondary) |
| `hero_impression` | Hero is 50% visible (IntersectionObserver) | `variant`, `page` |
| `collector_to_converter_click` | Click on internal link from collector to converter | `from_slug`, `to_slug` |
| `toc_click` | Click on table of contents link | `anchor`, `page_slug` |
| `email_signup_view` | Email signup form is viewed | — |
| `email_signup_start` | Email field is focused | — |
| `email_signup_submit` | Form submitted | — |

---

## AffiliateLink tracking

`AffiliateLink.astro` automatically adds `data-affiliate="true"` to every Amazon outbound link.

The `amazon_outbound_click` event fires on any click of `[data-affiliate="true"]`. Additional properties come from `data-asin` and `data-product-name` attributes.

```astro
<AffiliateLink
  href="https://www.amazon.com/dp/B09XYZ/?tag=chill-dogs-20"
  data-track="amazon_outbound_click"
  data-asin="B09XYZ"
  data-product-name="Ruffwear Swamp Cooler"
>
  Buy on Amazon
</AffiliateLink>
```

Never use a plain `<a>` for Amazon links — tracking and rel attributes are enforced by `AffiliateLink.astro`.

---

## Collector-to-converter tracking

Internal links from collector pages to converter pages should include:

```html
<a
  href={ROUTES.coolingMats}
  data-track="collector_to_converter_click"
  data-from-slug="/cooling/keep-dog-cool-in-car/"
  data-to-slug="/cooling/cooling-mats/"
>
  Best Cooling Mats
</a>
```

---

## What to preserve

When editing existing components, always preserve:
- `data-track` attributes
- `data-asin` attributes
- `data-product-name` attributes
- `data-affiliate="true"` on all Amazon links
- `data-from-slug` and `data-to-slug` on collector-to-converter links

Removing tracking attributes breaks the analytics funnel.

---

## Related knowledge

- [`architecture.md`](architecture.md) — PostHog setup and environment variables
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — AffiliateLink component rules
- [`../strategy/chill-dogs-context.md`](../strategy/chill-dogs-context.md) — Keystone metric context
