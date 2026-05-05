---
title: UTM Parameter Rules
type: canonical
domain: marketing
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - utm
  - marketing
  - analytics
  - tracking
related:
  - pinterest-launch-plan.md
  - newsletter-guide.md
  - marketing-plan.md
  - ../engineering/analytics-events.md
---

# UTM Parameter Rules

Format and usage rules for UTM tracking parameters on Chill-Dogs external campaign links.

## Use this when

Adding UTM parameters to any external link — Pinterest pins, newsletter emails, or other campaign links pointing to chill-dogs.com.

---

## When to use UTMs

UTM parameters are for **external links only** — links in Pinterest pins, newsletter emails, social posts, or any other off-site source that points to chill-dogs.com.

Do not add UTM parameters to internal links within the site. Internal routing uses the `data-track` event system instead.

---

## Format rules

- All lowercase — no camelCase, no underscores in values (use hyphens)
- No spaces — use hyphens to separate words
- Keep values short and descriptive

---

## Required parameters

| Parameter | Purpose | Example |
|---|---|---|
| `utm_source` | Where the traffic comes from | `pinterest`, `newsletter`, `email` |
| `utm_medium` | Marketing channel type | `social`, `email` |
| `utm_campaign` | Campaign or initiative name | `launch`, `may2026`, `summer-cooling` |

---

## Optional parameters

| Parameter | Purpose | Example |
|---|---|---|
| `utm_content` | Specific pin, post, or link variant | `pin035_road_trip`, `featured-link` |

---

## Examples

### Pinterest pin example

```
https://www.chill-dogs.com/cooling/keep-dog-cool-in-car/?utm_source=pinterest&utm_medium=social&utm_campaign=launch&utm_content=pin035_road_trip
```

### Newsletter example

```
https://www.chill-dogs.com/cooling/keep-dog-cool-in-car/?utm_source=newsletter&utm_medium=email&utm_campaign=may2026
```

### Pinterest board launch campaign

```
https://www.chill-dogs.com/comforting/best-calming-dog-beds/?utm_source=pinterest&utm_medium=social&utm_campaign=comfort-launch&utm_content=pin012_calming-beds
```

---

## Rules summary

1. **External links only.** No UTMs on internal chill-dogs.com links.
2. **All lowercase.** `pinterest` not `Pinterest`.
3. **Hyphens, not underscores** in values. `summer-cooling` not `summer_cooling`.
4. **Always include** `utm_source`, `utm_medium`, `utm_campaign` for trackable links.
5. **Add `utm_content`** when you need to differentiate multiple links to the same page (e.g., different pins to the same article).
6. **Production URLs only.** Never use UTMs on staging or preview URLs.

---

## Related knowledge

- [`pinterest-launch-plan.md`](pinterest-launch-plan.md) — Pinterest link and CTA rules
- [`newsletter-guide.md`](newsletter-guide.md) — Email link format
- [`marketing-plan.md`](marketing-plan.md) — Channel strategy
- [`../engineering/analytics-events.md`](../engineering/analytics-events.md) — Internal event tracking system
