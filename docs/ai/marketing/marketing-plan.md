---
title: Marketing Plan
type: canonical
domain: marketing
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - marketing
  - seo
  - pinterest
  - strategy
  - kpis
related:
  - pinterest-launch-plan.md
  - newsletter-guide.md
  - utm-rules.md
  - ../strategy/chill-dogs-context.md
---

# Marketing Plan

Positioning, audience, channels, KPI targets, and the organic-first posture for chill-dogs.com.

## Use this when

Planning any marketing activity: Pinterest campaigns, newsletter sends, content strategy, or channel decisions.

---

## Positioning

**Chill-Dogs** is the practical, research-based resource for dog owners who want reliable, curated product guidance — not vet-speak, not marketing fluff, not generic "top 10" spam.

Positioning statement: *"Researched, curated dog lifestyle products for cooling, calming, comfort, and travel — from a fellow dog owner who looked into it."*

The brand is calm, practical, and peer-level. It does not shout. It does not claim authority it does not have.

---

## Audience

Primary: Dog owners (25–55) in the US who:
- Search Google for practical product guidance ("best cooling mat for dogs," "how to keep dog cool in car")
- Use Pinterest to discover and save dog lifestyle content
- Make purchasing decisions on Amazon

Secondary: Dog owners who are email subscribers interested in useful guides.

---

## Channels

### 1. Organic search (primary driver)

**Model:** Pillar + cluster.

- Pillar pages: `/cooling/`, `/calming/`, `/comforting/` — broad category intent
- Cluster pages: individual converter pages — specific product intent
- Article collectors: informational long-tail ("how to keep dog cool in car") that feed into converters

**Goal:** Rank for informational and commercial intent queries in the cooling, calming, comfort, and travel dog categories.

**KPI:** Organic sessions → collector_to_converter_click rate → amazon_outbound_click rate

### 2. Pinterest (social discovery)

Pinterest is an organic visual search engine — pins have long shelf life and drive evergreen traffic.

**Strategy:**
- Create pins for every article collector and converter page
- Boards organized by category (Cooling, Calming, Comfort & Rest, Travel, Dog Safety)
- Drive traffic to chill-dogs.com pages with production URLs (not staging)
- UTM-tag all Pinterest links

See [`pinterest-launch-plan.md`](pinterest-launch-plan.md) for full format and cadence.

### 3. Newsletter (Buttondown)

Announce new articles and guides to existing audience. Drives return visits and converter traffic.

**Strategy:** Practical, useful voice. 2-4 links per email. Never spam or over-sell Amazon products.

See [`newsletter-guide.md`](newsletter-guide.md) for format.

### 4. Paid (low priority)

No active paid budget defined. Hero experiment variant pages (`/v/`, `/cooling/v/`, `/calming/v/`) exist to test conversion messaging for potential future paid campaigns.

---

## SEO strategy

- **Informational collectors** capture research-phase traffic
- **Product converters** capture buying-phase traffic
- **Internal link architecture** routes organic traffic from collectors to converters
- Canonical URLs enforced on all pages
- Schema (Article JSON-LD, BreadcrumbList, FAQPage) on all relevant pages
- OG images auto-generated for all indexable pages

**Priority topics for content expansion:**
- Cooling: heat safety, travel cooling, seasonal guides
- Calming: anxiety triggers, crate training, car travel anxiety
- Comfort: dog sleep, bed selection, crate use
- Travel: road trips, air travel, dog safety

---

## KPI targets

| Metric | Primary signal |
|---|---|
| Amazon affiliate revenue | Primary business metric |
| `amazon_outbound_click` rate | Converter performance |
| `collector_to_converter_click` rate | Internal routing efficiency |
| Organic sessions | SEO health |
| Pinterest outbound clicks | Social channel effectiveness |
| Email open rate / click rate | Newsletter effectiveness |

---

## Organic-first posture

The site earns primarily through organic search. All marketing supports that:

- Pinterest drives awareness → organic search reinforces → affiliate click completes
- Newsletter drives return visits → re-engagement with converter pages
- New content follows keyword demand, not editorial whim

---

## Content calendar principle

New articles and converter pages should be driven by:

1. Keyword opportunity (search volume + low competition)
2. Category gaps (a product type with buying intent but no converter page)
3. Seasonal timing (cooling content before summer, gift guides before December)

---

## Related knowledge

- [`pinterest-launch-plan.md`](pinterest-launch-plan.md) — Pinterest boards, pins, cadence
- [`newsletter-guide.md`](newsletter-guide.md) — Email format and rules
- [`utm-rules.md`](utm-rules.md) — UTM parameter format
- [`../strategy/chill-dogs-context.md`](../strategy/chill-dogs-context.md) — Full site context and categories
- [`../checklists/marketing-publish-checklist.md`](../checklists/marketing-publish-checklist.md) — Publish checklist
