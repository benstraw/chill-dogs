---
title: Affiliate Disclosure Rules
type: canonical
domain: affiliate
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - affiliate
  - disclosure
  - ftc
  - compliance
related:
  - amazon-associates-rules.md
  - product-data-rules.md
  - ../writing/product-copy-rules.md
---

# Affiliate Disclosure Rules

When and where the affiliate disclosure must appear on chill-dogs.com pages.

## Use this when

Adding product cards to a page, creating a new converter or collector page, or verifying FTC disclosure compliance.

---

## Requirement

The affiliate relationship must be clearly disclosed before or near product CTAs. This is a legal requirement under FTC guidelines.

---

## Where disclosure must appear

### Converter pages

The `Disclosure` component must appear on every converter page. Place it before or near the first product card — not buried at the bottom of the page.

### Section collector pages

The `Disclosure` component must appear on section collector pages (`/cooling/`, `/calming/`) — include it near any product links or CTAs.

### Article collectors with inline product cards

When an article collector includes inline product cards (`CoolingProductCard`, `RelaxationProductCard`, etc.), the `Disclosure` component is required on that page.

If an article has no inline product cards, the `Disclosure` component is optional — the sitewide footer disclosure covers it.

### Informer pages

The full `/affiliate-disclosure/` informer page is linked from the site footer on every page. This is the comprehensive FTC disclosure.

---

## What not to do

- Do not bury the disclosure below product CTAs — it must appear before or prominently near them
- Do not omit disclosure from any page with product cards
- Do not write affiliate disclosure language into article prose — the `Disclosure` component handles it, do not duplicate
- Do not remove the footer link to `/affiliate-disclosure/`

---

## Disclosure language

Keep disclosure language accurate and plain. The `Disclosure` component has approved language built in — do not override it with weaker or misleading alternatives.

The disclosure explains:
- Chill-Dogs earns commissions from Amazon on qualifying purchases made through links on the site
- This does not affect the price the reader pays
- Products are curated based on research, not paid placement

---

## Footer disclosure

The footer on every page carries a persistent affiliate disclosure statement and a link to `/affiliate-disclosure/`. This is the sitewide baseline compliance layer.

**Note:** Converter pages intentionally exclude the footer newsletter signup to keep them single-purpose. The footer disclosure still appears.

---

## Related knowledge

- [`amazon-associates-rules.md`](amazon-associates-rules.md) — AffiliateLink component and tag rules
- [`product-data-rules.md`](product-data-rules.md) — Product data file locations
- [`../writing/product-copy-rules.md`](../writing/product-copy-rules.md) — What to say in product descriptions
- [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md) — What not to claim
