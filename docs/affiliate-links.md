# Affiliate Link Tooling

Internal workflows for creating and checking non-Amazon affiliate links.

## Chewy via Impact

Chewy links are generated through Impact. The tool prefers the current tracking link from the Impact Partner API and uses `CHEWY_IMPACT_BASE_URL` only as a cache/fallback.

Required environment variables:

```bash
IMPACT_ACCOUNT_SID=""
IMPACT_AUTH_TOKEN=""
CHEWY_IMPACT_CAMPAIGN_ID=""
CHEWY_IMPACT_AD_ID=""
CHEWY_IMPACT_CATALOG_ID=""
CHEWY_IMPACT_BASE_URL=""
```

`IMPACT_ACCOUNT_SID` is the Basic Auth username and `IMPACT_AUTH_TOKEN` is the password. Create them in Impact under user profile settings, Technical, API. Use read-only scopes for this tooling.

Leave unknown values blank or omit the line. Do not use placeholders like `...` or `<catalog-id>` in `.env`.

Find the Chewy campaign/program ID from Impact's joined programs list or dashboard. Find the ad ID from the Chewy ad/asset used as the base tracking link. Find the catalog ID by running:

```bash
bun run fetch:chewy
```

With only `IMPACT_ACCOUNT_SID` and `IMPACT_AUTH_TOKEN`, that command lists available joined programs first. After you identify Chewy, set `CHEWY_IMPACT_CAMPAIGN_ID` or pass `--campaign-id` to list Chewy catalogs.

## Generate Links

Generate one Chewy affiliate link:

```bash
bun run chewy-link -- "https://www.chewy.com/example-product/dp/123456" --article best-cooling-products --placement product-card
```

Verify the active tracking base:

```bash
bun run chewy-link:verify
```

Generate links from CSV:

```bash
bun run chewy-link:csv -- ./chewy-products.csv
```

Input columns:

```csv
name,chewy_url,article_slug,placement
Cooling Mat,https://www.chewy.com/example-product/dp/123456,best-cooling-products,product-card
```

Output adds `affiliate_url`.

Generated links should be click-tested and checked in Impact reporting after setup.

## Sync Chewy Catalog Data

Fetch Chewy catalog data from Impact:

```bash
bun run fetch:chewy -- --catalog-id <catalog-id>
bun run fetch:chewy -- --catalog-id <catalog-id> --item-id <item-id>
bun run fetch:chewy -- --campaign-id <campaign-id>
bun run fetch:chewy -- --search "cooling mat"
bun run fetch:chewy -- --search "cooling mat" --no-cache
bun run fetch:chewy -- --delete-cache <item-id>
bun run fetch:chewy -- --clear-cache
bun run fetch:chewy -- --stale --days 90
```

Raw payloads are cached in `src/data/chewy-products/`. The manifest at `src/data/chewy-products/_index.json` stores diagnostic fields such as product name, description, tracking URL, image URLs, price, stock, GTIN, MPN, category, provider, and fetch date.

Use `--no-cache` when you only want to discover candidate item IDs without writing raw payloads or updating `_index.json`.

Use `--delete-cache <item-id>` to remove one cached raw payload and its `_index.json` entry. Use `--clear-cache` to remove all Chewy raw payloads and reset `_index.json`.

The cache is review-only. It must not automatically replace canonical product copy, manually selected images, or merchant offers.

> **TODO — improve Chewy cache ID matching:** The Impact catalog assigns its own internal IDs that often differ from the Chewy `/dp/` product IDs stored in our product records (e.g. Kurgo RSG is `207876` on Chewy but `181207` in Impact; Adventure Medical products diverge similarly). As a result, `--item-id` fetches fail and `--search` must be used, which caches 100 unrelated items at a time. Two improvements to consider: (1) add a `--search-one "keyword"` mode that runs a search but writes only the first-ranked result to cache; (2) store `merchantProductId` alongside Impact's own `CatalogItemId` in the manifest so the two ID spaces can be reconciled without a full re-search. Until then, fetch with `--search`, then manually trim the manifest to just the products you need.

## How to Add Chewy Products to the Catalog

1. Find or fetch the Chewy catalog item:

```bash
bun run fetch:chewy -- --search "product name"
```

2. Generate the Impact affiliate link from the canonical Chewy product URL:

```bash
bun run chewy-link -- "https://www.chewy.com/example-product/dp/123456" --article page-slug --placement product-card
```

3. Add a Chewy offer to the relevant canonical product record in `src/data/**`:

```ts
offers: [
  {
    merchant: 'chewy',
    url: 'https://chewy.sjv.io/...',
    canonicalUrl: 'https://www.chewy.com/example-product/dp/123456',
    merchantProductId: 'chewy-123456',
    status: 'active',
  },
],
```

Use `canonicalUrl` for the public Chewy URL, `url` for the Impact affiliate/deep link, and `merchantProductId` for the stable Chewy or Impact catalog item ID when known.

For Chewy-only products, omit `asin` and `amazonUrl`, and include at least one active Chewy offer.

Treat cached Chewy names, bullets, descriptions, and images as review inputs. Manually choose any copy or image changes and keep canonical editorial copy on the product record.

After adding an offer, confirm `/admin/products/` reflects it through shared product data. Do not hardcode rows in the admin page.

## Tests

Run the focused and full gates before finishing changes:

```bash
bun run test:coverage
bun run build
bun run test
```
