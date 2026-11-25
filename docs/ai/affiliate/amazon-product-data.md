---
title: Amazon Product Data Fetching
type: reference
domain: affiliate
status: active
updated: 2026-11-25
tags:
  - chill-dogs
  - amazon
  - product-data
  - cache
related:
  - product-data-rules.md
  - ../engineering/environment-and-integrations.md
  - ../engineering/build-and-test-commands.md
---

# Amazon Product Data Fetching

## Use this when

You are fetching Amazon metadata for a product, checking the provider cache's freshness, or need the full flag reference for `scripts/fetch-amazon-data.ts`. The rules for what that data may and may not change are in [`product-data-rules.md`](product-data-rules.md).


## Purpose

Product data files keep the editorial product copy used on pages. Raw Amazon provider responses are cached separately in `src/data/amazon-products/` so images, titles, ratings, and other metadata can be inspected without repeatedly spending API searches.

The cache is diagnostic and editorial-support data. It must not auto-overwrite product copy or rendered page content.

## Cache Files

| File | Purpose |
|---|---|
| `src/data/amazon-products/<ASIN>.json` | Raw provider response for one ASIN. Do not edit manually. |
| `src/data/amazon-products/_index.json` | Sidecar freshness manifest keyed by ASIN. Tracks `fetchedAt`, `provider`, `title`, and `imageUrl`. |

The raw provider payloads stay unchanged. Freshness and drift checks live in the sidecar manifest.

## API Providers

| Provider | Env variable | Notes |
|---|---|---|
| SerpAPI | `SERP_API_KEY` | Default provider. |
| SearchAPI | `SEARCHAPI_KEY` | Backup provider. |

Both providers return Amazon product metadata, but response shapes differ. The freshness helper normalizes both `product.*` and `product_results.*` structures.

## Fetch Script

Location: `scripts/fetch-amazon-data.ts`

```bash
# Fetch all uncached products using SerpAPI
bun run scripts/fetch-amazon-data.ts

# Use SearchAPI instead
bun run scripts/fetch-amazon-data.ts --provider searchapi

# Fetch a single ASIN
bun run scripts/fetch-amazon-data.ts --asin B0XXXXXX

# Re-fetch even if cached
bun run scripts/fetch-amazon-data.ts --force

# Fetch only missing or stale manifest entries
bun run scripts/fetch-amazon-data.ts --stale

# Use a custom stale threshold
bun run scripts/fetch-amazon-data.ts --stale --days 120
```

Default behavior still skips raw cached JSON. `--stale` uses `_index.json` and fetches ASINs whose raw cache or manifest entry is missing, or whose manifest entry is older than the configured threshold.

## Freshness Check

Run:

```bash
bun run check:amazon
bun run check:amazon -- --days 120
```

The default threshold is 90 days and the command is warning-only. It reports:

- catalog ASINs with no raw cache file
- catalog ASINs with no manifest entry
- stale manifest entries
- malformed raw cache payloads
- title or image drift between raw cache and manifest snapshot
- extra cache files not referenced by the current product catalog

Use `--fail-on-stale` only when intentionally making staleness blocking.

## Manifest Backfill

Run this after introducing the sidecar manifest or after restoring cache files:

```bash
bun run scripts/backfill-amazon-cache-index.ts
```

The backfill scans existing raw cache files, extracts normalized title/image snapshots, infers provider where possible, and uses each file's mtime as `fetchedAt`. It does not fetch network data or modify raw provider JSON.

## Product Ingestion Loop

1. Add the product to the relevant source data file with its ASIN and affiliate URL.
2. Fetch that ASIN:
   ```bash
   bun run scripts/fetch-amazon-data.ts --asin B0NEWASIN
   ```
3. Inspect the saved raw JSON manually for useful metadata such as `product.main_image` or `product_results.thumbnail`.
4. Add or update the product image/copy intentionally in source product data.
5. Run:
   ```bash
   bun run check:amazon
   bun run check:asins
   ```

`check:amazon` verifies cache coverage and freshness. `check:asins` verifies live Amazon page availability.

## Related knowledge

- [`product-data-rules.md`](product-data-rules.md) — Where product data lives and what provider data may change
- [`../engineering/environment-and-integrations.md`](../engineering/environment-and-integrations.md) — API keys and network hosts for the fetch scripts
- [`../engineering/build-and-test-commands.md`](../engineering/build-and-test-commands.md) — `check:amazon` and `check:asins`
