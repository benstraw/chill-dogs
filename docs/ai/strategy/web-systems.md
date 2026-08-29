---
title: Web Systems Framework — Applied to Chill-Dogs
type: canonical
domain: strategy
status: active
updated: 2026-08-10
tags:
  - chill-dogs
  - web-systems
  - strategy
  - page-types
  - conversion
related:
  - ../AGENT_START.md
  - metrics-and-page-types.md
  - chill-dogs-context.md
---

# Web Systems Framework — Applied to Chill-Dogs

This file summarizes how the Web Systems Adventure Mode framework (`docs/web-systems-adventure-mode.md`) governs every decision on chill-dogs.com.

## Use this when

You want to understand why a rule exists, why page types are defined as they are, or why conversion clarity takes priority over feature richness.

---

## One keystone metric

Chill-Dogs has one primary metric:

> **Amazon affiliate commission revenue** — earned when a visitor clicks an affiliate link and completes a purchase on Amazon.

Secondary metric: organic search traffic volume routed to converter pages.

If a proposed change does not drive affiliate clicks or improve organic visibility that routes to converters, question whether it belongs.

---

## Page classification system

Every page on the site belongs to exactly one type. Mixing types is not allowed.

### Converter

- **Purpose:** Convert visitors into affiliate clicks.
- **Rules:** One job only. One CTA only. Minimize navigation distractions. Minimize steps from CTA to completion.
- **Metric:** % of visitors who click an affiliate link.
- **Chill-Dogs examples:** `/cooling/cooling-mats/`, `/comforting/best-calming-dog-beds/`, `/gear/best-dog-gps-trackers/`

### Collector

- **Purpose:** Capture organic search traffic via SEO and route it to converters.
- **Two subtypes on this site:**
  - `section` — section collector pages (`/cooling/`, `/calming/`, `/comforting/`). Pure routing intent. No prose. Must route above the fold to a converter.
  - `article` — long-form informational guides. Full prose, TOC, FAQ, InternalLinkStrip to converters.
- **Metric:** Organic traffic volume + % routed to converters.
- **Chill-Dogs examples:** `/cooling/` (section), `/cooling/keep-dog-cool-in-car/` (article)

### Attractor

- **Purpose:** Convert paid or social campaign traffic.
- **Characteristics:** High visual clarity, campaign-specific messaging.
- **Metric:** Campaign conversion rate.
- **Chill-Dogs example:** `/` (homepage)

### Informer

- **Purpose:** Administrative and compliance.
- **Rules:** Accurate, updated, not metric-driven.
- **Chill-Dogs examples:** `/about/`, `/affiliate-disclosure/`, `/privacy-policy/`

---

## Page mission rule

Every page (except the homepage) must answer:

> What is the single action this page exists to drive?

If more than one target action exists — split the page or remove the secondary CTA.

---

## Module system

All pages are built from modules.

### Workhorse modules

Reusable, content-agnostic. Build for reuse. Avoid hardcoded content.

Examples: `Hero`, `SectionHero`, `SectionCollectorPage`, `CollectorBody`, `FAQ`, `Disclosure`, `InternalLinkStrip`, `Toc`, `CoolingProductCard`, `RelaxationProductCard`

### Showstopper modules

High-impact, custom, complex. Use sparingly — high fragility, high cost. Never stack two showstoppers on one page.

Examples: 404 visual

### High-touch modules

Require careful testing and iteration. Cannot be blindly copied.

Examples: `HomepageHero` variants, Road Trip collector narrative

---

## Navigation rules

- Maximum 5 primary nav links.
- No novelty patterns.
- Informer pages go in the footer only — never in primary nav.
- Current primary nav: `/`, `/cooling/`, `/calming/`, `/comforting/`, `/about/`

---

## Conversion flow rules

The ideal path is two clicks:

```
Homepage or section collector hero CTA → Converter → Amazon
```

Rules:
- Minimize steps between CTA and completion.
- Maintain fast load speeds (sub-2s ideal).
- Audit mobile first — hero CTA positioning on mobile is the top friction point.
- Remove navigation from booking/conversion flows.

---

## Analytics instrumentation

Every target action must be trackable. Required:
- Keystone event tracking (`amazon_outbound_click`)
- Page-level conversion tracking
- Funnel tracking (collector or attractor entry → converter click → amazon outbound)

Key events: `amazon_outbound_click`, `collector_to_converter_click`, `hero_cta_click`, `hero_impression`, `toc_click`

---

## Core principle

> A website is a modular conversion system — driven by one dominant metric, structured by page intent, built with reusable modules, governed by clarity and speed, and improved through continuous measurement.

---

## Related knowledge

- [`../AGENT_START.md`](../AGENT_START.md) — Quick operating brief
- [`metrics-and-page-types.md`](metrics-and-page-types.md) — Full page type definitions with invalid behavior
- [`chill-dogs-context.md`](chill-dogs-context.md) — Site-specific page map, tech stack, brand
- [`../KNOWLEDGE_GRAPH.md`](../KNOWLEDGE_GRAPH.md) — Full dependency chains
