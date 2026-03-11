# Amazon Product Data Fetching

## Purpose

Product cards on the site need thumbnail images from Amazon. We fetch product data (including `main_image` URLs) via Amazon Product APIs offered by third-party search providers. Raw JSON responses are cached locally so we don't waste searches on repeat fetches.

## API Providers

| Provider | Free tier | Env variable | Status |
|----------|-----------|--------------|--------|
| **SerpAPI** (preferred) | 250 searches/month | `SERP_API_KEY` | Primary |
| **SearchAPI** (backup) | 100 searches/month | `SEARCHAPI_KEY` | 76 remaining as of 2026-03-11 |

**Use SerpAPI by default.** It has a larger free tier (250 vs 100/month) and resets monthly.

### Endpoints

- **SerpAPI**: `GET https://serpapi.com/search?engine=amazon_product&asin={ASIN}&api_key={KEY}`
- **SearchAPI**: `GET https://www.searchapi.io/api/v1/search?engine=amazon_product&asin={ASIN}&api_key={KEY}`

Both return the same general structure. The key field we use is `product.main_image`.

## The Fetch Script

**Location**: `scripts/fetch-amazon-data.ts`

### What it does

1. Reads all ASINs from `src/data/cooling-products.ts` and `src/data/calming-products.ts`
2. Checks each ASIN against the local cache (`src/data/amazon-products/{ASIN}.json`)
3. Fetches only uncached ASINs from the selected provider
4. Saves the full JSON response to the cache directory
5. Reports how many searches were used

### Usage

```bash
# Fetch all uncached products using SerpAPI (default)
bun run scripts/fetch-amazon-data.ts

# Use SearchAPI instead
bun run scripts/fetch-amazon-data.ts --provider searchapi

# Fetch a single ASIN
bun run scripts/fetch-amazon-data.ts --asin B0XXXXXX

# Re-fetch everything, ignoring cache
bun run scripts/fetch-amazon-data.ts --force

# Show help
bun run scripts/fetch-amazon-data.ts --help
```

### Flags

| Flag | Default | Description |
|------|---------|-------------|
| `--provider <name>` | `serpapi` | `serpapi` or `searchapi` |
| `--asin <ASIN>` | — | Fetch a single ASIN only |
| `--force` | off | Re-fetch even if cached |

## How to Add a New Product

1. **Add the product** to the appropriate data file (`src/data/cooling-products.ts` or `src/data/calming-products.ts`) with its ASIN
2. **Run the fetch script** for just that ASIN:
   ```bash
   bun run scripts/fetch-amazon-data.ts --asin B0NEWASIN
   ```
3. **Extract the image URL** from the saved JSON:
   ```bash
   cat src/data/amazon-products/B0NEWASIN.json | jq '.product.main_image'
   ```
4. **Populate the `image` field** on the product in the data file
5. **Build to verify**: `bun run build`

## Search Budget Tracking

Keep a running log so we don't blow through free tiers.

| Date | Provider | Searches used | Remaining | Notes |
|------|----------|---------------|-----------|-------|
| 2026-03-11 | SearchAPI | 24 | 76 | Initial bulk fetch of 23 ASINs (22 succeeded, 1 empty) |

## Rules

- **Don't waste searches.** The script skips cached ASINs by default. Use `--asin` for single fetches.
- **Cache everything.** Raw JSON is saved to `src/data/amazon-products/`. Don't delete these files unless you need to re-fetch.
- **Save raw JSON.** We store the full API response, not just the image URL. This lets us extract additional data later (price, title, rating) without burning more searches.
- **Prefer SerpAPI.** It has 2.5x the free monthly budget.
