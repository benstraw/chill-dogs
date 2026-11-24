---
title: Awin Affiliate Program
type: canonical
domain: affiliate
status: active
updated: 2026-11-23
tags:
  - chill-dogs
  - affiliate
  - awin
  - aorkuler
related:
  - amazon-associates-rules.md
  - product-data-rules.md
  - disclosure-rules.md
---

# Awin

## Use this when

Adding or changing an Aorkuler link, or adding another Awin advertiser.

Awin is an affiliate network (like Impact, which carries Chewy). Chill-Dogs joined it in
November 2026 to get paid on Aorkuler sales. Aorkuler is the only Awin advertiser so far.

- **Publisher id** `awinaffid=3019981` (account "Chill-Dogs"). **Aorkuler advertiser id** `awinmid=69556`.
- **How a link works:** `https://www.awin1.com/cread.php?awinmid=<advertiser>&awinaffid=<publisher>&ued=<url-encoded destination>`. The `ued` value is where the reader lands.
- **Make a link:** Awin dashboard, Toolbox, Link Builder. Pick the advertiser, paste the destination page, Generate link, copy the URL tab. Any page on the advertiser's site works once the program is joined.
- **In the repo:** one constant, `AORKULER_AWIN_URL`, in `src/data/tracking-products.ts`, used as the `aorkuler` offer's `url`. `AORKULER_PRODUCT_URL` is the raw product page, used for the offer's `canonicalUrl` and for structured data (never put a tracking link in schema).
- **Rendering:** `MerchantAffiliateLink` already handles it: `rel="sponsored noopener noreferrer"`, `data-merchant="aorkuler"`, event `affiliate_outbound_click` (no `amazon_outbound_click` alias).
- **A second Awin advertiser:** add its id to `MerchantId` in `src/data/products/types.ts`, a matching offer type, and an entry in `src/data/products/merchants.ts`. Do not reuse the `aorkuler` merchant.
- **Not yet known:** commission rate, cookie window, payout threshold, and whether Awin allows the Amazon link beside it (the page shows both offers). Check the Aorkuler program terms in the Awin dashboard.

---

## Related knowledge

- [`product-data-rules.md`](product-data-rules.md) — Where product and offer data lives
- [`disclosure-rules.md`](disclosure-rules.md) — Where disclosure must appear
- [`amazon-associates-rules.md`](amazon-associates-rules.md) — The Amazon half of the Aorkuler offer stack
