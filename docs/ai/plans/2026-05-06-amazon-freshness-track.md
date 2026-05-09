---
title: Amazon Freshness Track
type: plan
domain: engineering
status: planned
updated: 2026-05-06
tags:
  - chill-dogs
  - amazon
  - product-data
  - cache-freshness
  - engineering
related:
  - ../affiliate/product-data-rules.md
  - ../engineering/build-and-test-commands.md
  - ../../amazon-product-data.md
---

# Plan: Amazon Freshness Track

## Context

Raw Amazon provider responses live in `src/data/amazon-products/*.json`, but before this track there was no sidecar freshness index, stale-cache reporting, or drift check. The product catalog had 124 unique ASINs, 159 cache files, one catalog ASIN with no cache file (`B0FPXB1D8L`), and 36 cache files no longer referenced by the current catalog.

The goal is to add a manual, warning-only freshness workflow without changing page rendering, raw provider payloads, JSON-LD behavior, product copy, or Amazon outbound links.

## Plan

- Add `src/data/amazon-products/_index.json` as an ASIN-keyed sidecar manifest with `fetchedAt`, `provider`, `title`, and `imageUrl`.
- Add a shared Amazon cache helper in `src/scripts/` that normalizes both `product.*` and `product_results.*` provider response shapes, computes staleness with a 90-day default, reads/writes the manifest, builds freshness reports, and backfills the manifest from existing cache files.
- Update `scripts/fetch-amazon-data.ts` so successful fetches update the manifest, `--force` still refetches, and `--stale` fetches missing or stale manifest entries.
- Add `scripts/check-amazon-freshness.ts` and `bun run check:amazon` as a manual warning-only cache audit for missing raw files, missing manifest entries, stale entries, malformed payloads, title/image drift, and extra cache files.
- Add `scripts/backfill-amazon-cache-index.ts` to seed `_index.json` from existing raw cache files using file mtime as `fetchedAt`; it must not fetch network data or mutate raw JSON.
- Keep `check:asins` focused on live Amazon availability and do not auto-overwrite product copy or product images from provider metadata.
- Update Amazon product-data docs and AI build/product-data docs to document the new ingestion loop.

## Test Plan

- Add unit tests for provider-shape normalization, stale age detection, missing raw cache reporting, missing manifest reporting, malformed payload reporting, drift reporting, extra cache reporting, and sorted manifest backfill.
- Avoid network calls and API-key requirements in tests.
- Verify with `bun run test:coverage`, `bun run check:amazon`, `bun run check:ai-docs`, and `bun run build`.

## Related knowledge

- [Product Data Rules](../affiliate/product-data-rules.md)
- [Build and Test Commands](../engineering/build-and-test-commands.md)
- [Amazon Product Data Fetching](../../amazon-product-data.md)
