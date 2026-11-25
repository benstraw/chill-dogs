---
title: Amazon Associates Rules
type: canonical
domain: affiliate
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - affiliate
  - amazon
  - affiliate-link
  - compliance
related:
  - product-data-rules.md
  - disclosure-rules.md
  - ../writing/product-copy-rules.md
  - ../engineering/analytics-events.md
---

# Amazon Associates Rules

Affiliate tag, required component, rel attributes, tracking, and compliance rules for all Amazon links on chill-dogs.com.

## Use this when

Adding any Amazon link, modifying a product component, or verifying affiliate link compliance.

---

## Affiliate tag

```
chill-dogs-20
```

This tag must appear in the query string of every Amazon offer URL: `?tag=chill-dogs-20`

Never change it. Never omit it. Always verify it is present when writing or editing any Amazon link.

---

## Required component: AffiliateLink.astro

**All Amazon outbound links must use `AffiliateLink.astro`.** Never use a plain `<a>` tag for Amazon URLs.

The component enforces:
- `rel="sponsored noopener noreferrer"` — required for affiliate compliance and security
- `target="_blank"` — opens in new tab
- `data-affiliate="true"` — enables affiliate click analytics

```astro
<!-- Correct -->
<AffiliateLink
  href="https://www.amazon.com/dp/B09XYZ/?tag=chill-dogs-20"
  data-track="affiliate_outbound_click"
  data-track-also="amazon_outbound_click"
  data-merchant="amazon"
  data-product-id="ruffwear-swamp-cooler"
  data-asin="B09XYZ"
  data-product-name="Ruffwear Swamp Cooler"
>
  Buy on Amazon
</AffiliateLink>

<!-- Wrong — never do this -->
<a href="https://www.amazon.com/dp/B09XYZ/?tag=chill-dogs-20">Buy on Amazon</a>
```

---

## Import path

```astro
import AffiliateLink from '@components/AffiliateLink.astro';
```

---

## Required data attributes

When using `AffiliateLink.astro` for product links, include:

| Attribute | Value | Purpose |
|---|---|---|
| `data-track` | `"affiliate_outbound_click"` | Fires the cross-merchant affiliate event |
| `data-track-also` | `"amazon_outbound_click"` | Preserves legacy Amazon dashboards during migration |
| `data-merchant` | `"amazon"` | Identifies the merchant |
| `data-asin` | The Amazon ASIN | Identifies the product in analytics |
| `data-product-name` | The product name | Readable label in analytics |

---

## Compliance rules

### Pricing display

Do not display specific Amazon prices in product copy. Prices change and displaying an incorrect price violates Amazon's Operating Agreement. Use CTAs like "Check Price on Amazon" instead.

### Trademark usage

Do not misrepresent the relationship with Amazon or imply Amazon endorsement of Chill-Dogs.

### No medical/vet claims on affiliate links

See [`../writing/product-copy-rules.md`](../writing/product-copy-rules.md) and [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md).

### Disclosure

The affiliate relationship must be disclosed before product CTAs. See [`disclosure-rules.md`](disclosure-rules.md).

### Reference

Amazon Associates Operating Agreement: `https://affiliate-program.amazon.com/help/operating/policies`

Refer to this when making decisions about affiliate link usage, pricing display, or trademark usage.

---

## URL format

```
https://www.amazon.com/dp/<ASIN>/?tag=chill-dogs-20
```

Or with additional tracking parameters:
```
https://www.amazon.com/dp/<ASIN>/?linkCode=ll1&tag=chill-dogs-20&linkId=<id>&language=en_US&ref_=as_li_ss_tl
```

Always verify `tag=chill-dogs-20` is present.

---

## Click tracking

Merchant-aware affiliate links fire `affiliate_outbound_click`. Amazon links also dual-fire the legacy
`amazon_outbound_click` event while dashboards are migrated. Properties captured from `data-*` attributes:
- `asin` (from `data-asin`)
- `product_name` (from `data-product-name`)
- `product_id` (from `data-product-id`)
- `merchant` (from `data-merchant`)
- `page_slug` (derived from current URL)
- `position` (from `data-position` if set)

---

## Related knowledge

- [`product-data-rules.md`](product-data-rules.md) — Where product data lives and how to add products
- [`disclosure-rules.md`](disclosure-rules.md) — FTC disclosure placement
- [`../writing/product-copy-rules.md`](../writing/product-copy-rules.md) — Product description language
- [`../engineering/analytics-events.md`](../engineering/analytics-events.md) — Full analytics event definitions
