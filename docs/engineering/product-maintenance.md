---
title: Weekly Product Maintenance
type: canonical
domain: engineering
status: active
updated: 2026-11-28
tags:
  - chill-dogs
  - engineering
  - products
  - ci
related:
  - environment-and-integrations.md
  - build-and-test-commands.md
  - ../affiliate/product-data-rules.md
---

# Weekly Product Maintenance

## Use this when

Reviewing aging product recommendations, configuring merchant credentials, checking
coverage, refreshing selected caches, or retiring a product safely.

## Weekly review

The **Weekly product maintenance** workflow runs Monday at 13:00 UTC (8 a.m.
Eastern in winter, 9 a.m. in summer). One issue labeled `merchant-check`, assigned
to `benstraw`, contains up to five prioritized review tasks. Its generated section
links the complete HTML inventory and JSON report on `maintenance-data`, plus the
Actions run with downloadable artifacts retained for 90 days.

The inventory includes active products, all default and variant listing owners,
actual built editorial placements (including homepage picks and inline article
cards), validly redirected retired URLs, and unused raw caches. Detail pages,
browse indexes, admin pages, redirect stubs, and script metadata do not count as
editorial promotion. Missing cache files and cache age are informational; they do
not establish that a recommendation is outdated.

Priorities are configuration/assets/redirect integrity, identity mismatches or
repeated negative observations, potential availability/newer models, products
without editorial placements, and unrecorded or older-than-90-day human reviews.
Within a priority, homepage/hero exposure comes first, then editorial page count,
then oldest human review, then product ID. The full report retains findings that
do not fit in the five-task queue. Unused caches form one cleanup task.

Check a routine task after reviewing its fit, alternatives, claims, and placement:
this records a human-review acknowledgment. Checking a concrete problem only
acknowledges the evidence. The condition remains in the full report and resurfaces
after 14 days if unchanged, immediately if evidence changes. Only disappearance
of the underlying condition resolves it. Checked tasks remain in an acknowledgment
archive. Write notes outside the marked generated section; additional lines
inside that section are also retained when regenerating it.

Cache timestamps, successful or attempted provider checks, and human-review dates
are separate. Missing dates are **not recorded**, never synthesized from a file's
modification time. Cached evidence retains its original fetch timestamp and label.

## Credentials and rollout

Use repository **Settings → Secrets and variables → Actions**. Local `.env`
values and Claude proxy credentials do not transfer to Actions.

| Name | Storage | Purpose |
|---|---|---|
| `SERP_API_KEY` | Secret | Primary Amazon provider (legacy `SERPAPI_KEY` also supported) |
| `SEARCHAPI_KEY` | Secret | Amazon fallback |
| `IMPACT_AUTH_TOKEN` | Secret only | Partner/Media Partner token with GET access to programs, tracking links, and catalogs |
| `IMPACT_ACCOUNT_SID` | Variable | SID belonging to that token |
| `CHEWY_IMPACT_CAMPAIGN_ID` | Variable | `32975`, verify against the authenticated Chewy program |
| `CHEWY_IMPACT_AD_ID` | Variable | `3054490`, verified against current site tracking links |
| `CHEWY_IMPACT_CATALOG_ID` | Variable | `24727`, verified against cached Impact records; confirm authenticated access |
| `MAINTENANCE_LIVE_ENABLED` | Variable | Set to `true` only after the rollout checks below |

Identifier secrets remain fallback inputs while moving identifiers to variables.
Keep the token secret. Never paste credentials into issues, logs, or reports.
Impact uses HTTP Basic authentication with the SID as username and token as
password. See [Impact credential guidance](https://impact.com/partnerships/get-more-efficient-and-grow-your-business-with-impact-apis/).

1. Merge the reviewed implementation. Dispatch `mode: offline` first. Download
   `inventory.html` and inspect the maintained issue and `maintenance-data` branch.
2. Configure the credentials above. Dispatch `mode: chewy-smoke`. It shares the
   weekly ten-request Impact allowance. It must authenticate the configured Chewy
   program, verify the ad's tracking base against current site links, retrieve one
   currently referenced cache-backed item, and validate its returned identity and
   decoded canonical destination. A cached tracking-base fallback is not a pass.
   Its observation includes timestamp and Impact stock when supplied.
3. After a successful smoke test, set `MAINTENANCE_LIVE_ENABLED=true` and dispatch
   `mode: live`. Verify both integrations' coverage, request ledgers, artifacts,
   and the issue. A completed smoke test releases its unused reservation, so the
   live run can use the remaining requests within that UTC week's ten-request cap.
4. Verify the first scheduled report the following Monday. A dispatch on a feature
   branch is intentionally skipped. GitHub may disable schedules after 60 days of
   repository inactivity; check the Actions tab if weekly reports stop appearing.

Missing configuration creates an explicit setup finding and **not configured**
coverage. Configured authentication failures are integration failures. No Chewy
storefront pages are scraped. Unknown Impact item mappings require manual cache
mapping work; a Chewy `/dp/` identifier is never substituted for an Impact item ID.
Mapping requires a unique cached `Id`/catalog identity and matching decoded URL,
not a similar title. An item-endpoint 404 means mapping/feed uncertainty, not proof
that a storefront listing was discontinued.
When supplied, the cached resource `Uri` must match that identity; its `Item` or
`Items` endpoint form is retained without retaining the cached account SID.

## Request safety and history

Amazon uses [SerpAPI](https://serpapi.com/amazon-product-api) with
[SearchAPI fallback](https://www.searchapi.io/docs/amazon-product), deduplicated by
ASIN with all product/variant owners retained. The direct `check:asins` command
remains manual. Listings observed within seven days are skipped. Oldest eligible
observations rotate first; at most five request slots are selected for problem
followups. Explicit newer-model suggestions and changed provider titles are
editorial evidence, not automatic edits.

Impact verifies program/tracking in two requests, then rotates through up to eight
referenced items. Retries reduce the available lookups. Stock is labeled
**Impact-reported availability**, not a real-time storefront guarantee. Missing
stock, feed delays, rate limits, schema changes, authentication failures, and
unknown identities never become unavailable-product verdicts. Two negative
observations at least seven days apart elevate review; nothing is automatically
retired. Aorkuler remains manual editorial review.

Both integrations send serial requests with a 15-second timeout and at most one
transient retry per endpoint operation. Every attempt counts, including fallback,
verification, 404s, and retries. Quota/rate errors stop that provider for the run.

Weekly caps are **25 Amazon requests and 10 Impact requests per UTC ISO week**.
The workflow serializes all runs in one concurrency group. Before requests begin,
the integration's entire remaining allowance is reserved on `maintenance-data`
using a fast-forward-only Git ref update. A competing writer cannot spend a
reservation from a rejected commit. Once every request in an integration has
returned, its reservation is durably settled to the attempts actually counted;
later runs can use the remainder of the same weekly cap. Cancellation, crashes,
or failed settlement retain the full reservation unless the history ref proves
settlement committed. A lease expires at the UTC week boundary. If state cannot be safely read or written,
external requests stop and the offline report still publishes as far as possible.

The orphan history branch holds normalized observations, human acknowledgments,
request ledgers, timestamped reports, and `latest/` reports. It contains no site
source. Its first commit disables Vercel deployments, and the main Vercel config
also disables that branch. The writer only accepts report paths in addition to
its fixed state/config files. It cannot edit canonical products, provider caches,
offers, images, or production source. Changes to those require a normal PR.

## Commands and failure handling

```bash
bun run build
bun run maintenance:offline
# Trusted default-branch Actions runs only:
bun run maintenance:chewy-smoke
bun run maintenance:live
# Assess an already written report without network or issue writes:
bun run scripts/product-maintenance.ts --gate
```

Reports default to `.cache/maintenance/`; use `--output <directory>` to choose
another local destination. Offline PR CI needs no credentials or GitHub writes.
All reports share inventory, listings/findings, coverage, integration status, and
request-accounting fields. Coverage distinguishes checked, skipped, unknown,
failed, budget-limited, and unconfigured; unknown/failed can describe a checked
response, so these are not mutually exclusive totals.

Explicit Bash shells propagate pipeline failures through `tee`. Collection steps
continue independently; artifact publication and the final status gate always
run. Deterministic integrity errors and broken maintenance machinery fail CI.
Editorial findings, exhausted allowances, expected throttling, and missing setup
remain visible as partial coverage. They do not turn uncertain stock into a
broken-product verdict or trigger a deployment.

## Selected cache refresh and retirement

After manually confirming an ASIN, refresh only that cache entry:

```bash
bun run scripts/fetch-amazon-data.ts --asin B00027466A --force
bun run check:amazon
```

Use `--provider searchapi` to test the fallback deliberately. Manual refreshes are
outside the automatic weekly allowance and use your local credentials. Review the
raw cache and manifest diff before committing. Chewy cache updates use
`fetch:chewy` as documented in the environment guide; do not run broad catalog
downloads as weekly maintenance or guess an item ID from a storefront URL.

To retire a product, first review its placements and alternatives. Remove or
replace editorial placements, remove the canonical product/offer when appropriate,
retain its ID in `product-url-history.ts`, and add permanent redirects to both
`src/data/redirects.ts` and `vercel.json` (slash and nonslash forms at the edge).
Point to a relevant built destination and avoid redirect chains. Run the build,
product-slug tests, and offline maintenance report in the PR. A validly redirected
retired URL stays historical inventory and does not recur as a problem.

## Validation and test cost

The implementation adds 57 offline unit fixtures for request budgets, retries,
fallback, authentication, identity checks, history writes, and human acknowledgments,
plus one built-site inventory test. No tests contact merchant services.

Five measured runs after a discarded warm-up on the same machine, comparing
main at `d5c8111` with this implementation:

| Tier | Main | Maintenance | Change |
|---|---|---|---|
| Unit | 814 ms / 545 tests | 926 ms / 602 tests | +112 ms (+14%) |
| Full | 1.23 s / 622 tests | 1.36 s / 680 tests | +128 ms (+10%) |

The extra fixture cost protects the paid-request limits and durable state. The
existing content guard remained at 46 ms. The new inventory test performs the
required built-site join in the dist tier. These costs are explicit; the existing
timing regression gate also passes. Snapshots:
[main](test-timings/maintenance-before.json) and
[maintenance](test-timings/maintenance-after.json).

## Related knowledge

- [Environment and integrations](environment-and-integrations.md)
- [Build and test commands](build-and-test-commands.md)
- [Product data rules](../affiliate/product-data-rules.md)
