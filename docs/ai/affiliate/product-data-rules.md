---
title: Product Data Rules
type: canonical
domain: affiliate
status: active
updated: 2026-05-06
tags:
  - chill-dogs
  - affiliate
  - product-data
  - data-files
  - catalog
related:
  - amazon-associates-rules.md
  - disclosure-rules.md
  - ../engineering/architecture.md
  - ../engineering/build-and-test-commands.md
  - ../engineering/product-variants.md
---

# Product Data Rules

Where product data lives, how to add new products, and how the product catalog connects to the admin page.

## Use this when

Adding new products, updating product data, checking product data file structure, or verifying the admin page is complete.

---

## Product data file locations

| File | Contents |
|---|---|
| `src/data/cooling-products.ts` | 25 cooling products — canonical editorial copy, optional Amazon fields, merchant offers, image thumbnails, category metadata |
| `src/data/calming-products.ts` | 23 calming products — canonical editorial copy, optional Amazon fields, merchant offers, image thumbnails |
| `src/data/relaxation-products.ts` | 78 comfort/rest products — calming beds, orthopedic beds, crates, carriers, travel bags |
| `src/data/tracking-products.ts` | 8 tracker products + 1 accessory — cellular/off-grid/bluetooth/accessory types |
| `src/data/product-catalog.ts` | Master catalog — normalized inventory across all pillar data files, including merchant offers |
| `src/data/products/` | Merchant offer types, merchant registry, and offer helpers for Amazon/Chewy affiliate links |
| `src/data/product-page-map.ts` | Maps product IDs to the converter pages they appear on |
| `src/data/amazon-products/` | ASIN-keyed raw Amazon provider JSON plus `_index.json` freshness manifest |

---

## Product catalog — the master inventory

`src/data/product-catalog.ts` is the master product list. It combines all pillar data files into one normalized inventory.
Each product also exposes `offers`, derived through `src/data/products/` helpers.

The admin page at `/admin/products/` consumes `product-catalog.ts`. **Do not hardcode product rows directly in the admin route.**

Canonical editorial product content belongs on the product record, not on merchant offers. Do not move or duplicate
`name`, `bullets`, gear-specific signal/subscription notes, or manually chosen images into Amazon, Chewy, or future
merchant metadata. Cooling, calming, and relaxation converter product copy should stay in bullets only.

When adding products:
1. Add to the relevant pillar data file (`cooling-products.ts`, `calming-products.ts`, etc.)
2. Ensure `product-catalog.ts` imports and re-exports from the pillar file
3. The admin page will pick them up automatically

---

## Amazon product metadata (amazon-products/)

`src/data/amazon-products/` contains ASIN-keyed JSON files with full Amazon product responses from SerpAPI or SearchAPI.

**Do not edit these files manually.** They are fetched and written by `scripts/fetch-amazon-data.ts`.

`src/data/amazon-products/_index.json` is the sidecar freshness manifest. It tracks `fetchedAt`, `provider`, `title`, and `imageUrl` snapshots for diagnostics. The raw provider payloads stay unchanged, and provider metadata must not auto-overwrite product copy.

Chewy provider data follows the same rule: raw/cache metadata is diagnostic only. If a fetched title or image looks better
than the canonical editorial record, surface it for manual editorial review instead of applying it automatically.

## Chewy Impact workflow

Chewy links are stored as merchant offers. Generate and verify Chewy affiliate links with the Impact-backed tooling in
[`../../affiliate-links.md`](../../affiliate-links.md).

1. Find or fetch the Chewy catalog item with `bun run fetch:chewy -- --search "product name"` or `bun run fetch:chewy -- --catalog-id <catalog-id> --item-id <item-id>`.
2. Generate the Impact affiliate link from the canonical Chewy product URL with `bun run chewy-link -- "https://www.chewy.com/example-product/dp/123456" --article <page-slug> --placement <placement>`.
3. Add a Chewy offer to the relevant canonical product record in `src/data/**`.
4. Use `canonicalUrl` for the public Chewy URL, `url` for the affiliate/deep link, and `merchantProductId` for the stable Chewy or Impact catalog item ID when known.
5. For Chewy-only products, omit `asin` and `amazonUrl`; include at least one active Chewy offer.
6. Treat cached Chewy name, bullets, description, price, stock, and image URLs as review inputs. Manually choose any copy or image changes.
7. Confirm `/admin/products/` reflects the new offer through shared product data. Do not hardcode admin rows.

---

## How to add a new product

1. Find the ASIN on Amazon and verify the product is live
2. Add the product entry to the correct pillar data file with:
   - `id` — unique identifier string
   - `name` — product display name
   - `asin` — Amazon ASIN
   - `amazonUrl` — `https://www.amazon.com/dp/<ASIN>/?tag=chill-dogs-20`
   - `image` — Amazon CDN image URL and alt text (external, no optimization)
   - `category` — category key matching the page's category system
   - Any other fields required by the pillar's TypeScript interface
3. Verify `product-catalog.ts` includes the new product (it should, if the pillar file is already imported)
4. Fetch Amazon metadata for the ASIN: `bun run scripts/fetch-amazon-data.ts --asin <ASIN>`
5. Run `bun run check:amazon` to verify cache coverage/freshness
6. Run `bun run check:asins` to verify the ASIN is live

For Chewy-only products, omit `asin` and `amazonUrl`; add at least one active Chewy offer instead. Product pages and
schema use the primary merchant offer, while Amazon-only scripts ignore products without Amazon offers.

## Products sold in several sizes or packs

When one product is several merchant listings — a topical per weight band, a robe per dog size, a spray per scent —
do not add a record per listing. Add a `variantGroup` to the single record instead, and keep the existing ASIN as the
default variant so `asin` / `amazonUrl` / `offers` still describe the card. Full rules, including where to source
variant ASINs and why variant offers must stay out of `offers`, are in
[`../engineering/product-variants.md`](../engineering/product-variants.md).

---

## Product page map

`src/data/product-page-map.ts` maps product IDs to the converter pages they appear on. This powers the admin page's "appears on" column.

Update this file when:
- A product is added to a converter page
- A product is removed from a converter page
- A converter page is added or removed

---

## Amazon cache freshness

Run after adding products or refreshing Amazon metadata:

```bash
bun run check:amazon
bun run check:amazon -- --days 120
```

`check:amazon` is warning-only by default. It reports missing raw cache files, missing manifest entries, stale entries older than 90 days, malformed cache payloads, title/image drift, and extra cache files not referenced by the catalog.

Use `bun run scripts/backfill-amazon-cache-index.ts` to seed `_index.json` from existing raw cache files without network calls.

---

## ASIN validity

Run after any product data change:

```bash
bun run check:asins            # Check all ASINs
bun run check:asins -- --quiet # Issues only
```

This checks live Amazon product pages directly and does not use the provider cache.

---

## Converter page configs

Converter page configs live in separate files:

- `src/data/cooling-converter-pages.ts` — copy, CTA targets, FAQ sets for cooling converters
- `src/data/calming-converter-pages.ts` — calming converter config
- `src/data/relaxation-converter-pages.ts` — comfort/relaxation converter config

When a shared product appears on multiple converter pages, update the canonical product data file — not individual page configs — unless the change is explicitly page-specific.

---

## Related knowledge

- [`amazon-associates-rules.md`](amazon-associates-rules.md) — Affiliate link and tag rules
- [`disclosure-rules.md`](disclosure-rules.md) — When disclosure is required
- [`../engineering/architecture.md`](../engineering/architecture.md) — Data-driven page architecture
- [`../engineering/build-and-test-commands.md`](../engineering/build-and-test-commands.md) — `check:amazon` and `check:asins` commands
