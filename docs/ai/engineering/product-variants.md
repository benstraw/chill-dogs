---
title: Product Variant System
type: canonical
domain: engineering
status: active
updated: 2026-08-16
tags:
  - chill-dogs
  - engineering
  - product-data
  - variants
  - affiliate
related:
  - architecture.md
  - analytics-events.md
  - ../affiliate/product-data-rules.md
  - ../affiliate/amazon-associates-rules.md
---

# Product Variant System

How one product record carries several buyable options — dog sizes, pack counts, scents, colorways — each with its own merchant listing and ASIN.

## Use this when

Adding a product that Amazon or Chewy sells as several listings under one page, or changing anything that walks the catalog's ASINs.

---

## The problem

Plenty of products sell as a family of listings: a topical with a separate ASIN per weight band, a bathrobe in eight sizes, a spray in four scents. Before this system the repo had exactly two options, both bad:

1. **One product record per variant.** `udyoude-flea-collar-large-2pack` and `njkpuyt-flea-collar-small-4pack` are the same product at different sizes, but they are separate catalog rows, separate page-map entries, separate ItemList positions.
2. **Pick one size and drop the rest.** Every buyer whose dog is a different size bounces.

The naive fix — a CTA per variant — does not survive contact with a card that has both Amazon and Chewy offers. Five sizes becomes ten buttons.

---

## The core rule

**The variant selector is decoupled from the merchant CTAs.**

Picking a variant *repoints* the existing merchant buttons. It never adds buttons. A five-size product with two merchants stays at one chip row plus two buttons, exactly the same button count as a product with no variants.

The corollary matters just as much:

**Variant offers never enter `product.offers`.**

`getOffers(product)` is rendered straight into a button stack by every product card on the site. `product.offers`, `product.asin` and `product.amazonUrl` all describe **the default variant only**. Variant offers live on `variantGroup.variants[].offers`. This is what keeps the change invisible to schema builders, catalog rows, the admin page and every existing test.

---

## Data model

Types live in `src/data/products/types.ts`:

```ts
interface ProductVariantAxis {
  id: string;        // 'dog-size' | 'pack-count' | 'scent' | 'color'
  label: string;     // "Size" — the selector heading
  hint?: string;     // "Measure back length before ordering"
}

interface ProductVariant {
  id: string;                        // unique within the product
  label: string;                     // chip text — short, must fit a 390px card
  longLabel?: string;                // accessible name
  offers: readonly AffiliateOffer[]; // this variant's own merchant listings
  image?: ProductImage;              // colorways only
  note?: string;                     // caution shown while selected
  status?: OfferStatus;
}

interface ProductVariantGroup {
  axis: ProductVariantAxis;
  defaultVariantId: string;
  variants: readonly ProductVariant[];
}
```

Any product extending `OfferBackedProduct` can carry `variantGroup?: ProductVariantGroup`.

### Rules

- **One axis per product.** Multi-axis (Size × Scent) is not supported. Amazon lists plenty of them; pick the axis that actually drives the purchase decision and leave the other on the Amazon page.
- `defaultVariantId` must resolve to a variant with at least one active offer.
- The default variant's offers must match `product.offers`. A test enforces this — it is what makes the legacy ASIN fields trustworthy.
- A variant may carry a different merchant mix from the default. If Chewy stocks a size Amazon does not, the picker hides the Amazon CTA while that size is selected.
- Never invent a variant ASIN. Sources, in order of preference: the cached Amazon payload's own `variants` array (see below), then a live listing check.

### Adding a variant group

1. Check `src/data/amazon-products/<ASIN>.json` for a `variants` array. Roughly two thirds of cached payloads have one, carrying Amazon's own sibling ASINs and labels. SerpAPI nests them as `product_results.variants[].items[]`; SearchAPI flattens them as `product.variants[].dimensions[]`.
2. Add `variantGroup` to the product record, keeping the existing ASIN as `defaultVariantId` so the legacy fields stay accurate.
3. Fetch cache entries for the new ASINs: `bun run scripts/fetch-amazon-data.ts --asin <ASIN>` (needs `SERP_API_KEY`). Until you do, `check:amazon` reports them under "Missing raw cache files" — a warning, not a failure.
4. Run `bun run check:asins` to confirm every new ASIN is live.

### Do not collapse existing records casually

Merging separate product records into one variant group removes cards from a page, which shifts every downstream `positionOffset` in the converter page config and renumbers `data-position` across the whole page. That breaks analytics comparability. Do it as its own commit, and renumber the offsets deliberately.

---

## Offer helpers

`src/data/products/offers.ts`:

| Function | Returns |
|---|---|
| `getOffers(product)` | The default variant's offers. Unchanged behaviour for products without variants. |
| `getDefaultVariant(product)` | The variant a card shows before the buyer touches the selector. |
| `getVariants(product)` | Every selectable variant, unavailable ones dropped. |
| `getVariantOffers(variant)` | One variant's offers, ordered and filtered like `getOffers`. |
| `getAmazonOfferEntries(catalog)` | **One primary ASIN per product.** Deliberately ignores variants. |
| `getAllAmazonOfferEntries(catalog)` | Every ASIN — primaries plus variants, deduped. |

The split between the last two is load-bearing. `getAmazonOfferEntries` matches the legacy `product.asin` field one-for-one, which is the invariant `products-offers.test.ts` guards. The merchant-data scripts (`check:asins`, `check:amazon`, `fetch-amazon-data.ts`) all use `getAllAmazonOfferEntries` so no variant ASIN goes unchecked or gets reported as an unreferenced cache file.

---

## UI

`src/components/modules/primitives/ProductVariantPicker.astro`, rendered by `AffiliateOfferStack` when a `variantGroup` is passed. Cards opt in by forwarding one prop:

```astro
<AffiliateOfferStack
  offers={offers}
  product={{ id: product.id, name: product.name, category: product.category }}
  variantGroup={product.variantGroup}
  ...
/>
```

Chips render as **real anchors** to each variant's primary offer, so no-JS visitors and crawlers reach every ASIN. They carry `rel="sponsored noopener noreferrer"` but deliberately **not** `data-affiliate="true"` or `data-track` — only the CTAs below fire the keystone event, so click counts stay comparable between cards with and without a picker. An untracked no-JS chip click is not a gap: analytics needs JS either way.

Script behaviour, following the chip pattern in `src/pages/shop/index.astro`:

- The server serializes the offer table onto `data-variant-offers`; the script only applies it.
- On selection it rewrites each CTA's `href`, `data-asin`, `data-merchant-product-id`, `data-variant-option` and `data-variant-axis`, hides CTAs whose merchant has no offer for the selection, and re-assigns `data-variant="primary"` to the first visible CTA so the filled/outlined pairing survives.
- Radio semantics (`role="radiogroup"`, `aria-checked`, roving `tabindex`, arrow keys) are applied by the script, so the markup reads as plain links when JS is unavailable.

### Attribute naming

`data-variant` is already the CTA button style (`primary` / `secondary`) and `variant` is already a `MerchantAffiliateLink` prop. Product variants use **`data-variant-option`** and **`data-variant-axis`**. Do not reuse `data-variant`.

---

## Analytics

Selecting a chip fires `product_variant_select` with `product_id`, `variant_axis`, `variant_option`, `page_slug` and `position`.

Affiliate CTAs on a variant card gain `variant_option` and `variant_axis` properties. `affiliate_outbound_click` and `amazon_outbound_click` are otherwise unchanged, so variant attribution is a breakdown on existing dashboards rather than a migration.

---

## Reference implementation

`tuff-pupper-drying-bathrobe` in `src/data/flea-tick-products.ts`, on `/safety/dog-bath-tools-for-flea-season/`. Eight dog sizes, every ASIN taken from Amazon's own variant list in the cached payload for `B0BY9GBMXX`. `large` is the default, matching the record's legacy `asin`.

### Not yet converted: Vectra 3D

`vectra-3d-xl-95-plus` is the clearest case for this system — it ships as one card for dogs over 95 lbs while Vectra sells five weight bands. Its sibling ASINs are **not** in the cache (`B071JS3MYK.json` has no `variants` array), so they need sourcing from live listings first. The shape once they are:

```ts
variantGroup: {
  axis: { id: 'dog-size', label: 'Dog weight', hint: 'Match your dog to the weight band on the box.' },
  defaultVariantId: 'lb-95-plus',
  variants: [
    { id: 'lb-5-10',   label: '5–10 lb',  offers: [amazonOffer('TODO(asin)')] },
    { id: 'lb-11-20',  label: '11–20 lb', offers: [amazonOffer('TODO(asin)')] },
    { id: 'lb-21-55',  label: '21–55 lb', offers: [amazonOffer('TODO(asin)')] },
    { id: 'lb-56-95',  label: '56–95 lb', offers: [amazonOffer('TODO(asin)')] },
    { id: 'lb-95-plus', label: '95+ lb',  offers: [amazonOffer('B071JS3MYK')] },
  ],
},
```

Do not ship placeholder ASINs. Source them, then fill the group in.

---

## Related knowledge

- [`../affiliate/product-data-rules.md`](../affiliate/product-data-rules.md) — Where product data lives and how to add products
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — Affiliate tag and link component rules
- [`analytics-events.md`](analytics-events.md) — Full event definitions
- [`architecture.md`](architecture.md) — Data-driven page architecture
