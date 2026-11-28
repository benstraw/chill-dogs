---
title: Revenue and Architecture Roadmap
type: plan
domain: global
status: in-progress
updated: 2026-11-25
tags:
  - chill-dogs
  - roadmap
  - revenue
  - architecture
related:
  - ../roadmap.md
  - ../engineering/architecture.md
  - ../engineering/analytics-events.md
  - ../affiliate/disclosure-rules.md
  - ../strategy/metrics-and-page-types.md
---

# Plan: Revenue and Architecture Roadmap

## Context

This plan comes out of the November 2026 deep dive. The testing half shipped first, in #425–#428: a faster suite split into two tiers, site-wide revenue and SEO checks, and a docs cleanup. This plan covers what comes next. It draws on two sources: the architecture review, and PostHog data for the 90 days to 2026-11-25.

What the data showed. The counts are raw and unfiltered, so treat them as directional, not exact:

| Page | Views | Affiliate clicks | Click rate |
|---|---|---|---|
| `/calming/best-thundershirt-alternatives/` | 25 | 15 | 60% |
| `/gear/best-dog-gps-trackers/` | 24 | 12 | 50% |
| `/cooling/car-cooling-for-dogs/` | 19 | 7 | 37% |
| `/calming/best-calming-products-for-anxious-dogs/` | 13 | 4 | 31% |
| `/cooling/keep-dog-cool-in-car/` | 35 | 9 | 26% |
| `/` (homepage) | 87 | 0 | 0% |
| `/lifestyle/how-to-spend-time-with-dogs-without-owning-one/` | 57 | 0 | 0% |
| `/travel/dog-friendly-airlines/` | 42 | 0 | 0% |
| about 20 `/shop/<product>/` pages | 10–16 each | 0 | 0% |

- **Traffic is the bottleneck.** The busiest page got 87 views in 90 days.
- **Comparison pages convert very well** once a reader reaches them: 26–60%.
- **The three busiest pages earn nothing.**
- **The `/shop/` numbers look suspicious.** Most of those pages show as many visitors as views, which points to bots or link previews rather than people. Phase 1 confirmed it was a crawler; see "Phase 1 results" for the human-only numbers.

The architecture review found that converter pages are built four different ways: cooling, calming, relaxation and flea-tick each have their own page component and config format, and three of them define the same block types. Hand-written gear pages sit beside them. It also found product lists that must be kept in sync by hand, and six identical article route files.

The phases run from cheapest and most certain to largest. Measurement comes first, because every later decision depends on trusting the numbers.

## Phase 1 — Measure

Goal: know which traffic is real before spending effort on it.

1. **Check the `/shop/` traffic.** Break `$pageview` on `/shop/*` down by referrer, user agent and session length. Decide whether the visits are bots, link-preview fetchers or real people.
   - **If bots:** filter them, through PostHog's test-account or bot filters or by excluding them at capture. Re-read the click rates.
   - **If real people:** the `/shop/` page itself is not converting, and its layout becomes a Phase 2 item.
2. **Build a click-rate dashboard.** For each converter and article: pageviews, `affiliate_outbound_click`, `amazon_outbound_click` and click rate, with bots excluded, plus a weekly trend. It's how each later phase gets judged.

Done when: the dashboard exists, and the `/shop/` question has an answer.

### Phase 1 results (done 2026-11-25)

**The `/shop/` traffic is a bot.** An undeclared crawler spoofs ordinary browsers, so PostHog's built-in bot detection missed it. It started on 26–27 September 2026, and it accounted for 672 of 679 `/shop/` product-page views and about 64% of all pageviews in the 90 days. Its fingerprint:
- one pageview per visit, no referrer (`$direct`);
- browser language mostly `zh-CN`;
- IPs in China, Hong Kong, Singapore and some in the US;
- a different viewport size on each visit.

A second fingerprint is Linux Chrome 150 at a 1920 px viewport with no referrer.

Two custom PostHog bot rules now classify both, so `$virt_is_bot` is true for them:
- `e66180c2-ee60-46d4-9144-19c292e5b45b`, "Undeclared crawler: zh browser, no referrer";
- `a2346ef2-6411-4f4e-95e1-2cc5cf62bfe8`, "Undeclared crawler: Linux Chrome 150 at 1920px, no referrer".

After the rules, `/shop/` product pages show 11 human views in 90 days. That's too little traffic to be worth redesigning, so the `/shop/` layout is **not** a Phase 2 item.

**The dashboard.** "Chill-Dogs Revenue Command Center" (PostHog dashboard 1985689) now has a dashboard-wide filter, `$virt_is_bot = false`. Raw SQL tiles ignore dashboard filters, so the Monetization-gap tile excludes bots in its own query. Any new SQL tile must do the same.

That tile had also been dropping the homepage, because trimming the trailing `/` left an empty path. It now keeps the homepage as `/`.

Human-only numbers for the 90 days to 2026-11-25 replace the raw table in Context:

| Page | Human visitors | Amazon clicks | Clicks per visitor |
|---|---|---|---|
| `/` (homepage) | 52 | 0 | 0 |
| `/lifestyle/how-to-spend-time-with-dogs-without-owning-one/` | 41 | 0 | 0 |
| `/travel/dog-friendly-airlines/` | 41 | 0 | 0 |
| `/calming/best-thundershirt-alternatives/` | 19 | 14 | 0.74 |
| `/cooling/keep-dog-cool-in-car/` | 19 | 6 | 0.32 |
| `/gear/best-dog-gps-trackers/` | 17 | 12 | 0.71 |
| `/cooling/car-cooling-for-dogs/` | 16 | 7 | 0.44 |
| `/safety/what-to-do-if-your-dog-runs-away/` | 12 | 0 | 0 |
| `/gear/fi-dog-collar-review/` | 12 | 1 | 0.08 |

Site-wide, about 11% of human visitors click an Amazon link.

What this changes for Phase 2:
- The three zero-click pages in item 3 are confirmed as real human traffic, most of it from search.
- `/safety/what-to-do-if-your-dog-runs-away/` joins them. A lost-dog reader may want a GPS tracker, which is the site's best-converting page.

## PR sequence for Phases 2 and 3

Each step below is its own PR, so a reviewer can check one kind of change at a time. Disclosure fixes and product additions never share a PR.

**The rule for every PR here: no written content changes.** These PRs may add a module, move a component, or change markup, metadata or schema. They must not reword, cut or add any prose sentence:
- in an article;
- in a product record (`name`, `bullets`, `description` and other copy fields);
- in page copy.

If a step turns out to need a copy edit, stop and raise it as a separate editorial PR for the owner to write or approve.

Every PR also runs `bun run test:timing -- --compare` against the latest snapshot, as the test overhaul set up.

### Step 0 — A copy-freeze check (tooling, first PR) — done

`bun run copy:diff -- --base origin/main` builds the base branch in a temporary worktree, then compares it with the current `dist/`. For every page it reports which visible text blocks were removed, edited, added or moved, and it groups pages that share a change. `--strict` exits 1 on any removed or edited text. `--html` also compares the full HTML. Details: [`../engineering/build-and-test-commands.md`](../engineering/build-and-test-commands.md#bun-run-copydiff).

How to read the report:
- **Revenue PRs:** zero removed or edited blocks. Added blocks may come only from the new module, such as product names and bullets from existing records, or the standard disclosure text. Moved blocks are expected for disclosure fixes.
- **Phase 3 refactors:** `--html` must report no changes, except where intended.

Every PR pastes the report into its description.

### Phase 2 PRs

| PR | Change | What the copy diff must show |
|---|---|---|
| 2a | **Disclosure placement, hand-built pages:** homepage, `/shop/`, Aorkuler review, Garmin, shelter-dog charities. Move or add `<Disclosure />` above the first affiliate link. Remove each page from `src/__tests__/allowlists/disclosure.ts`. | Disclosure text moved or added; nothing else |
| 2b | **Disclosure placement, two MDX articles:** crate training and keep-cool-in-car. Move the existing `<Disclosure />` tag above the first inline affiliate link. Only the tag line moves; no prose line changes. Remove both from the allowlist, which leaves it empty. | Disclosure block moved; nothing else |
| 2c | **Fi collar review schema.** Its Review schema has no rating. Default: switch it to Article schema, which needs no new claim. The alternative is a star rating, but a rating is an editorial judgment, so the owner would have to supply it. | No visible change |
| 2d | **Airlines page → airline carriers.** A `ConverterPicks` module with the top carrier picks from `/comforting/best-airline-approved-dog-carriers/`, inline in the section about under-seat carriers. Shipped together with 2e in #436 (#434 superseded). | Additions only, from the module |
| 2e | **Runaway-dog page → GPS trackers.** The same pattern: one tracker of each type (cellular, off-grid, Bluetooth) from `/gear/best-dog-gps-trackers/`, the site's best-converting page, inline in the section about tracking (#436). | Additions only |
| 2f | **Links to the winners**, through `pinnedRelated` and related-link metadata only. In-body links would be copy edits, so they're left for a separate editorial PR. | Related-link strips change; prose unchanged |
| 2g | **Lifestyle article → newsletter.** Make the existing signup module more prominent. No products. | Additions or moves of the signup module only |
| 2h | **Homepage picks.** Investigate first, using the hero funnel and placement tiles; then make a layout change only. | Moves only, unless a copy change is agreed separately |

**Placement rule for product additions.** These pages are article collectors, which drive conversions through links and inline cards, not through an early call to action (`docs/strategy/metrics-and-page-types.md`). Put picks inline, in the section whose text gives the reason to buy, and keep a link to the converter.

All of these reuse an existing module. If no existing module can render a few products by id inside an article, raise that before writing a new one.

After each revenue PR merges, add a PostHog annotation so its effect shows on the dashboard. At roughly 40 human visitors per page every 90 days, judge each change after about six weeks, not days.

Outside the repo: post the 214 Pinterest pins already in `public/pins/` and put the two winners in the next newsletter. Neither needs a PR.

### The `/shop/` decision (after 2a)

What Phase 1 found:
- The product pages were never open to Google. `PRODUCT_PAGES_INDEXABLE` in `src/utils/product-meta.ts` has been `false` since launch on 2026-09-02, so all 280 pages are `noindex` and out of the sitemap. The long-tail bet hasn't been tested.
- Since launch they've had 11 human views: 7 direct, 3 from Google and 1 internal. None came from Pinterest.
- 248 of the 280 products already meet the per-product copy bar.

Options considered:
- **Delete the pages.** Saves little: they're noindexed, so they cost nothing in search. It would mean about 280 redirects, and it would kill the Pinterest landing pages.
- **Switch on indexing for all of them.** That's the risk the switch exists to prevent: about 250 template pages next to about 65 hand-written ones is the pattern that can pull a whole site down in Google, the converters that earn included.
- **Index one pillar of about 30 (the earlier plan). Dropped.** A check on 2026-11-28 found that **278 of the 280 products already appear on a converter.** Every `/shop/` page would duplicate a card that ranks on a converter, and would compete with it in search, the two best converters included.

**Decision (2026-11-28): test the pages with Pinterest first, with no change for Google.**

Stage 1, the Pinterest test (#444):
- The `/shop/` pages had two jobs: ranking in search, and acting as Pinterest landing pages. The second was never tried, since only one pin had been posted, to an "Other stuff" board.
- Pin design: #442 moved "See the details" clear of Pinterest's corner buttons and regenerated all 280 pins.
- The pins: 20 products, chosen by human Amazon clicks over the past year and posted from each page's Save button to a matching board, about 2–3 a day.
  - Wave 1, now: anxiety and fireworks, GPS trackers, travel.
  - Wave 2, early March: cooling.
- Measurement: the PostHog tile [Pinterest test: /shop/ visits and merchant clicks](https://us.posthog.com/project/328578/insights/GGnpGJsq) on the Revenue dashboard, plus each pin's Pinterest "Outbound clicks".
- After about six weeks:
  - **If visitors who reach a `/shop/` page click through to a merchant**, stage 2 is worth considering.
  - **If they don't**, keep the pages as quiet Pinterest landing pages, leave them `noindex`, and stop investing in them.

Stage 2, only if stage 1 passes: a tiny search test.
- **Size:** 10 products, not a pillar.
- **Choosing them:** only products whose names get no search impressions for the site today, so there's nothing for a new page to take from a converter.
- **Switch:** a per-product allowlist, never `PRODUCT_PAGES_INDEXABLE`.
- **Baseline and stop rule:** record a Search Console baseline for the converters first. If converter impressions or clicks fall beyond normal noise, switch the 10 back to `noindex` the same day.

PostHog lists Google Search Console as a connected integration. If its data is reachable there, it can pick the stage 2 products. Otherwise the owner reads Search Console directly.

### Phase 3 PRs

Each is a refactor, so the `--html` copy diff must be empty unless a change is intended and described.

| PR | Change |
|---|---|
| 3a | One `[...article].astro` route replaces the six `[slug].astro` files, with a test that no article's `canonicalPath` collides with a hand-written page |
| 3b | The road-trip and car-cooling product lists move into data exports, and the "Keep in sync with" comments go |
| 3c | The hardcoded internal routes move to `ROUTES`, in batches small enough to review |
| 3d | The route keys `coolingHub`, `calmingHub`, `comfortHub` and `gearHub` are renamed to collector wording |
| 3e | The hand-built cards in `airtag-for-dogs` and `fi-dog-collar-review` move onto the card primitives. `shelter-dog-charities` is reviewed and either fixed or kept with a written reason |

Phase 4 (Astro 6, one converter system) starts after 3e.

## Phase 2 — Revenue on existing traffic

Goal: earn more from the visitors the site already has, with small edits. "PR sequence for Phases 2 and 3" above is the order of work.

3. **Products on the busiest zero-click pages.**
   - `/travel/dog-friendly-airlines/`: readers are planning a flight, so route them to `/comforting/best-airline-approved-dog-carriers/` and travel bags, with a product module inline in the section about carriers.
   - Homepage: find out why its picks get no clicks (placement, which picks, what shows above the fold) and fix it.
   - `/lifestyle/…`: it has no buying intent, so make it a newsletter-signup page rather than forcing products onto it.
4. **More traffic to the winners.** The ThunderShirt alternatives and GPS tracker pages convert at 50–60%. Give them:
   - links from the busiest articles, through `pinnedRelated` or in-body links;
   - new Pinterest pins;
   - a spot in the next newsletter.
5. **Fix disclosure placement.** Seven pages show an affiliate link before any disclosure: the homepage, `/shop/`, the Aorkuler review (a brand-provided unit), Garmin, crate training, keep-cool-in-car, and charities. Put the disclosure above the first link on each, and delete each page's entry from `src/__tests__/allowlists/disclosure.ts` as it is fixed. This is an FTC and Amazon Associates compliance risk.
   - The **Fi collar review** also has Review schema with no rating. Give it an editorial rating, or switch it to Article schema.

Done when: each change is live and the dashboard shows its effect over a few weeks. The disclosure allowlist is empty.

## Phase 3 — Foundations

Goal: remove duplication and manual sync points while the changes are still small.

6. **One article route.** Replace the six identical `src/pages/{calming,comforting,cooling,lifestyle,safety,travel}/[slug].astro` files with a single `src/pages/[...article].astro` that builds each article at its `canonicalPath`.
   - URLs don't change.
   - Articles can live in any section without adding a route file.
   - Hand-written pages still win, because Astro ranks specific routes above a catch-all.
   - Add a test that no article `canonicalPath` collides with a hand-written page.
7. **Remove hand-synced product lists.** `src/data/product-page-map.ts` repeats the product ids shown by `RoadTripProducts.astro` and `CarCoolingArticleProducts.astro`, marked "Keep in sync with". Move each list into one data export that the component and the page map both read.
8. **Shrink the allowlists in small PRs:**
   - the 39 hard-coded internal routes (use `ROUTES`);
   - the route key names `coolingHub`, `calmingHub`, `comfortHub` and `gearHub` (rename to collector wording across their callers);
   - the three hand-built product cards (`airtag-for-dogs`, `fi-dog-collar-review`, and `shelter-dog-charities`, which needs reviewing).

   Each entry removed from `src/__tests__/allowlists/` is one fixed violation.

Done when: there is one article route, the "Keep in sync with" comments are gone, and the allowlists are shorter.

## Phase 4 — Platform

Goal: one converter system on a current Astro.

9. **Upgrade to Astro 6.** `@astrojs/mdx` 5.0.3 already requires Astro ^6, but Astro 5.18 is installed. Upgrade Astro and its official integrations together, or pin `@astrojs/mdx` to v4 to match Astro 5. Do this before the converter merge, so the merged system is built once, on the new version.
10. **One converter system.** Merge `CoolingConverterPage`, `CalmingConverterPage`, `RelaxationConverterPage` and `FleaTickConverterPage` into one composer with one config format:
    - one set of hero, section, prose, note and decision-column block types;
    - products referenced by id. Cooling's one-category-per-record model is why the same product needed two records (the OHMO bowl `shopPageId` workaround);
    - then move the hand-written gear pages and `/cooling/best-cooling-products-for-dogs/` onto it.

    Migrate one page at a time. The site-wide dist tests (sweep, JSON-LD, affiliate attributes, disclosure) are the safety net, and a page's built HTML should not change except where intended.

Done when: there is one composer and one config format, `shopPageId` is no longer needed, and no converter page is written by hand.

## Not in this plan

These were left out of the test overhaul:
- behavior tests for the `/shop/?q=` filter and the search page;
- tests for the local `admin:serve` writer.

Add them alongside Phase 3 or 4, whichever touches that code first.

## Related knowledge

- [`../roadmap.md`](../roadmap.md) — Open, shipped and dropped items
- [`../engineering/architecture.md`](../engineering/architecture.md) — Current structure
- [`../engineering/analytics-events.md`](../engineering/analytics-events.md) — Events behind the click-rate numbers
- [`../affiliate/disclosure-rules.md`](../affiliate/disclosure-rules.md) — Disclosure placement rules
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Page types and their metrics
