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
| 2d | **Airlines page → airline carriers.** Add an existing product module, with the top carrier picks from `/comforting/best-airline-approved-dog-carriers/`, above the fold or right after the intro. | Additions only, from the module |
| 2e | **Runaway-dog page → GPS trackers.** The same pattern, with the top picks from `/gear/best-dog-gps-trackers/`, the site's best-converting page. | Additions only |
| 2f | **Links to the winners**, through `pinnedRelated` and related-link metadata only. In-body links would be copy edits, so they're left for a separate editorial PR. | Related-link strips change; prose unchanged |
| 2g | **Lifestyle article → newsletter.** Make the existing signup module more prominent. No products. | Additions or moves of the signup module only |
| 2h | **Homepage picks.** Investigate first, then make a layout change only. Investigated 2026-11-28 (below): in each section, the picks and converter links now come before the article cards. | Moves only, unless a copy change is agreed separately |

All of these reuse an existing module. If no existing module can render a few products by id inside an article, raise that before writing a new one.

After each revenue PR merges, add a PostHog annotation so its effect shows on the dashboard. At roughly 40 human visitors per page every 90 days, judge each change after about six weeks, not days.

Outside the repo: post the 214 Pinterest pins already in `public/pins/` and put the two winners in the next newsletter. Neither needs a PR.

### 2h findings: why the homepage picks get no clicks (2026-11-28)

PostHog, human traffic only, for the 90 days to 2026-11-28:
- **Who comes.** 57 people and 83 views. Only 3 look internal (admin pages or previews). Most are direct visits on desktop (36 direct, 15 from search), so these look like people checking out the brand, not shoppers.
- **What they do.** About 70% of homepage sessions leave the site from it. The rest go one each to a scatter of pages, mostly through the "Latest guide" card (the Aorkuler review) and section links. There were 0 affiliate clicks. Only 7 people reached the newsletter form at the bottom.
- **How far they scroll** (`$prev_pageview_max_scroll_percentage`). 33 of 47 desktop visits and 16 of 17 phone visits never scrolled past 25% of the page.

Where the picks sat before the change, as measured in the built page:

| | Desktop (1440 px) | Phone (390 px) |
|---|---|---|
| Page length | 7,700 px (8.6 screens) | 16,200 px (19 screens) |
| First buy button | 2,407 px, 31% down | 4,429 px, 27% down |
| Calming picks (ThunderShirt) | 44% down | 46% down |

Each section showed its article cards first and its picks last, so about 77% of visits never saw a single pick. The zero clicks are a placement problem, not a product problem.

**The change (2h, layout only).** In each section, the picks (with the converter links beside them on desktop) now come before the article cards. Nothing was added or removed. Afterward, the first buy button is at 1,956 px (25%) on desktop and 2,606 px (16%) on phones, and the Calming picks are at 37% and 32%.

**What to expect.** With about 50 human visitors a quarter, even a large relative gain is a click or two. The homepage mainly routes people elsewhere; the revenue is in the articles that get search traffic (2d–2f). Judge this change with the others, after about six weeks.

**Not done.** A shorter phone page, with fewer article cards per section on mobile, would cut the 19-screen length. That hides content, so it's an editorial call and is listed in #435.

### The `/shop/` decision (after 2a)

What Phase 1 found:
- The product pages were never open to Google. `PRODUCT_PAGES_INDEXABLE` in `src/utils/product-meta.ts` has been `false` since launch on 2026-09-02, so all 280 pages are `noindex` and out of the sitemap. The long-tail bet hasn't been tested.
- Since launch they've had 11 human views: 7 direct, 3 from Google and 1 internal. None came from Pinterest.
- 248 of the 280 products already meet the per-product copy bar.

Options:
- **Delete the pages.** Saves little: they're noindexed, so they cost nothing in search. It would mean about 280 redirects, and it would kill the Pinterest landing pages.
- **Switch on indexing for all of them.** That's the risk the switch exists to prevent: about 250 template pages next to about 65 hand-written ones is the pattern that can pull a whole site down in Google, the converters that earn included.
- **Recommended: a bounded test.** Make the switch per pillar and index one pillar of about 30 products, preferably ones no converter already covers. Watch Search Console for about 10 weeks. Set the bar before starting. If the pillar earns impressions and clicks, open the next pillar. If it doesn't, leave the product pages noindexed as Pinterest and direct-link targets, and stop investing in them.

Search Console isn't connected to this workspace, so the owner reads those numbers.

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
   - `/travel/dog-friendly-airlines/`: readers are planning a flight, so route them to `/comforting/best-airline-approved-dog-carriers/` and travel bags, with a product module or a prominent link above the fold.
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
