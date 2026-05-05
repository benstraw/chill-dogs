---
title: Product Data Rules
type: canonical
domain: affiliate
status: active
updated: 2026-05-03
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
---

# Product Data Rules

Where product data lives, how to add new products, and how the product catalog connects to the admin page.

## Use this when

Adding new products, updating product data, checking product data file structure, or verifying the admin page is complete.

---

## Product data file locations

| File | Contents |
|---|---|
| `src/data/cooling-products.ts` | 15 cooling products — ASINs, affiliate URLs, image thumbnails, category metadata |
| `src/data/calming-products.ts` | 13 calming products — ASINs, affiliate URLs, image thumbnails |
| `src/data/relaxation-products.ts` | 41 comfort/rest products — calming beds, orthopedic beds, crates, travel crates |
| `src/data/tracking-products.ts` | 8 tracker products + 1 accessory — cellular/off-grid/bluetooth/accessory types |
| `src/data/product-catalog.ts` | Master catalog — normalized inventory across all pillar data files |
| `src/data/product-page-map.ts` | Maps product IDs to the converter pages they appear on |
| `src/data/amazon-products/` | ASIN-keyed JSON files with SearchAPI Amazon product metadata |

---

## Product catalog — the master inventory

`src/data/product-catalog.ts` is the master product list. It combines all pillar data files into one normalized inventory.

The admin page at `/admin/products/` consumes `product-catalog.ts`. **Do not hardcode product rows directly in the admin route.**

When adding products:
1. Add to the relevant pillar data file (`cooling-products.ts`, `calming-products.ts`, etc.)
2. Ensure `product-catalog.ts` imports and re-exports from the pillar file
3. The admin page will pick them up automatically

---

## Amazon product metadata (amazon-products/)

`src/data/amazon-products/` contains ASIN-keyed JSON files with full SearchAPI Amazon product responses.

**Do not edit these files manually.** They are fetched and written by `scripts/fetch-amazon-data.ts`.

These files provide structured metadata (title, image URLs, rating, price range) used by product card components.

---

## How to add a new product

1. Find the ASIN on Amazon and verify the product is live
2. Add the product entry to the correct pillar data file with:
   - `id` — unique identifier string
   - `name` — product display name
   - `asin` — Amazon ASIN
   - `affiliateUrl` — `https://www.amazon.com/dp/<ASIN>/?tag=chill-dogs-20`
   - `imageUrl` — Amazon CDN image URL (external, no optimization)
   - `category` — category key matching the page's category system
   - Any other fields required by the pillar's TypeScript interface
3. Verify `product-catalog.ts` includes the new product (it should, if the pillar file is already imported)
4. Run `bun run check:asins` to verify the ASIN is live

---

## Product page map

`src/data/product-page-map.ts` maps product IDs to the converter pages they appear on. This powers the admin page's "appears on" column.

Update this file when:
- A product is added to a converter page
- A product is removed from a converter page
- A converter page is added or removed

---

## ASIN validity

Run after any product data change:

```bash
bun run check:asins            # Check all ASINs
bun run check:asins -- --quiet # Issues only
```

Requires `SEARCHAPI_KEY` or `SERP_API_KEY` environment variable.

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
- [`../engineering/build-and-test-commands.md`](../engineering/build-and-test-commands.md) — `check:asins` command
