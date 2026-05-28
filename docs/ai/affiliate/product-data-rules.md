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
`name`, `bullets`, `bestFor`, `howItHelps`, `whyItWorks`, `considerIf`, sizing notes, signal notes, or manually chosen
images into Amazon, Chewy, or future merchant metadata.

When adding products:
1. Add to the relevant pillar data file (`cooling-products.ts`, `calming-products.ts`, etc.)
2. Ensure `product-catalog.ts` imports and re-exports from the pillar file
3. The admin page will pick them up automatically

---

## Amazon product metadata (amazon-products/)

`src/data/amazon-products/` contains ASIN-keyed JSON files with full Amazon product responses from SerpAPI or SearchAPI.

**Do not edit these files manually.** They are fetched and written by `scripts/fetch-amazon-data.ts`.

`src/data/amazon-products/_index.json` is the sidecar freshness manifest. It tracks `fetchedAt`, `provider`, `title`, and `imageUrl` snapshots for diagnostics. The raw provider payloads stay unchanged, and provider metadata must not auto-overwrite product copy.

Future Chewy provider data should follow the same rule: raw/cache metadata is diagnostic only. If a fetched title or image
looks better than the canonical editorial record, surface it for manual editorial review instead of applying it automatically.

## Manual Chewy URL workflow

Chewy links are stored as merchant offers. Until the Impact deep-link workflow is finalized, add Chewy links manually:

1. Create the Chewy affiliate/deep link in Impact.
2. Add a Chewy offer to the product with `merchant: 'chewy'` and the affiliate URL.
3. Add `canonicalUrl` when you know the public Chewy product URL.
4. Add `merchantProductId` only when it is obvious and stable; it is optional for now.
5. Do not change canonical product copy or images just because a Chewy product title, image, or description differs.

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
