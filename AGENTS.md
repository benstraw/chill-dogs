# AGENTS.md

The one instruction file for coding agents in this repo. `CLAUDE.md` imports it, and
`.github/copilot-instructions.md` points here, so every tool reads the same rules.
Edit this file, not those.

This repo uses a Markdown AI knowledge graph under `docs/ai/`.

## Start here

1. Read [`docs/ai/AGENT_START.md`](docs/ai/AGENT_START.md) - operating brief
2. Read [`docs/ai/AI_INDEX.md`](docs/ai/AI_INDEX.md) - task router
3. Use [`docs/ai/KNOWLEDGE_GRAPH.md`](docs/ai/KNOWLEDGE_GRAPH.md) to find domain-specific docs
4. Before finishing, run the relevant checklist in [`docs/ai/checklists/`](docs/ai/checklists/)

Do not skip the task-specific docs.

## Bootstrap

- Runtime: `bun@1.3.6` (`package.json#packageManager`).
- Install: `bun install --frozen-lockfile`
- Build: `bun run build`. Test: `bun run test` (builds, then runs both test tiers).
- Leave untracked marketing assets alone unless the task asks for them.
- Do not make changes outside the requested section or scope.

## Core rules

- Chill-Dogs is an **Astro 5 / Bun** static affiliate site.
- Primary business goal: **Amazon affiliate commission revenue**. Optimize pages for clarity, trust, and outbound affiliate clicks.
- Keystone event: `amazon_outbound_click`.
- Valid page types: `converter`, `collector`, `attractor`, `informer`. Do not invent new types, and do not say "hub" in code, comments or specs: the type is `collector`.
- Do not hardcode internal routes - import from `src/data/routes.ts`.
- Use `AffiliateLink.astro` for all Amazon outbound links. The affiliate tag is `chill-dogs-20`.
- **Product cards on converters must compose the shared primitives in `src/components/modules/primitives/`** (`ProductCardShell`, `ProductImageFrame`, `ProductBulletList`, `AffiliateOfferStack`). Do not hand-roll a card surface, image frame, bullet list, or CTA stack. If a primitive is missing something, add an opt-in prop to the primitive rather than forking it locally. Card-specific extras (badges, spec lists, notes) stay local. `BrowseProductCard` is the one sanctioned exception.
- **"Show N more" expanders use the `DisclosureBar` primitive** (`src/components/modules/primitives/DisclosureBar.astro`) — a full-width outlined bar on the pillar accent. Do not hand-roll a bare `<summary>` text link.
- Use the existing related-content system (`src/utils/related-pages.ts`). Do not add manual related arrays.
- **A product `id` in `src/data/*-products.ts` is a public URL** — every product builds at `/shop/<id>/`. Renaming a product's `name` is free; renaming its `id` retires an indexed URL and needs redirects in **both** `vercel.json` and `src/data/redirects.ts` (which `astro.config.mjs` uses), with the old id left in `src/data/product-url-history.ts`. Enforced by `src/__tests__/product-slugs.test.ts`.
- If the same product appears on several converter pages, a copy edit belongs in the canonical product record in `src/data/**`, unless the instruction says it is for one page only. Use page-level overrides only for page-specific changes.
- Run relevant tests/build checks before finishing.
- **Never merge, close, or squash a pull request without explicit confirmation.** Phrases like "push the PR up", "put it up for review", or "send it up" mean push the branch and open/update the PR — NOT merge it. Only run `gh pr merge` when the user says exactly that.

## Page types and build contract

- Every new page declares one page type before coding. Details: [`docs/ai/strategy/metrics-and-page-types.md`](docs/ai/strategy/metrics-and-page-types.md).
  - `converter`: one job, drive affiliate clicks. Renders the standard stack unless scoped out: `Hero`, comparison/product sections, `FAQ` when data exists, `Disclosure`, and internal links to related pages. The above-the-fold CTA prioritizes high-intent clicks.
  - `collector`: capture search traffic and route it to converters, with at least one above-the-fold path to a converter. Aggregate and qualify intent; do not duplicate full converter comparisons. Articles are `pageType: 'collector'` with `collectorSubtype: 'article'`.
  - `attractor`: convert campaign or social traffic.
  - `informer`: admin or legal content only.
- If 2+ pages share structure, use one shared module with data/config inputs instead of duplicating page scaffolding. Keep per-page differences (copy, category keys, CTA targets, FAQ sets, section toggles) in centralized data/config objects.
- Reuse existing modules first; create a new module only when none can serve the page type and conversion goal.
- Related links come from the complete sitemap inventory: use `topics` as ranking signals, `pinnedRelated` only for intentional editorial relationships, `excludeRelated` for poor matches (exclusion wins), and `relatedLabel` for a shorter pill label. Details: [`docs/ai/engineering/routes-and-sitemap.md`](docs/ai/engineering/routes-and-sitemap.md).
- When a product is added or changed in `src/data/**`, `/admin/products/` must stay complete through the shared catalog modules, never hardcoded rows.

## Source of truth files

- `docs/system-definition.yaml` - update it in the same task whenever pages, routes, page types, modules or conversion flow change.
- `src/data/content-sitemap.ts` - every new non-MDX page is registered here. MDX articles are picked up from frontmatter by `src/data/sitemap-inventory.ts`.
- `src/data/routes.ts` - all internal route strings live here.
- `src/data/products/` - canonical merchant offer types/helpers. Product editorial copy remains in product records; Amazon/Chewy provider metadata is diagnostic only and must not auto-overwrite copy or images.

## Commands

```bash
bun run dev              # Start dev server at localhost:4321
bun run build            # Static build to dist/
bun run preview          # Preview built site
bun run test             # Build, then run both test tiers (unit + dist)
bun run test:unit        # Unit tier only: no dist/, ~3 s
bun run test:dist        # Dist tier only: fails loudly if dist/ is missing or stale
bun run test:smoke       # Page-level HTML checks; builds only if dist/ is stale
bun run test:timing      # Time build + tiers; --compare <json> against a snapshot
bun run test:coverage    # Coverage report (scope and floor in vitest.config.ts)
bun run check:asins      # Check all product ASINs are still live on Amazon
bun run check:asins -- --quiet  # Same, issues only
bun run check:amazon     # Check local Amazon cache coverage, freshness, and drift
bun run indexnow:submit  # Manually submit all URLs to IndexNow API
bun run check:ai-docs    # Validate AI knowledge graph frontmatter and links
bun run fetch:chewy      # Pull Chewy catalog metadata from Impact (diagnostic only)
bun run chewy-link:verify # Confirm Impact credentials resolve
bun run og:gen           # Generate product-style OG share images
bun run pins:gen         # Generate 1000x1500 Pinterest pins for /shop/ product pages
bun run admin:serve      # Local writer for /admin/images/ (see below); no network, no keys
```

Test tiers, ratchet allowlists and timing rules: [`docs/ai/engineering/build-and-test-commands.md`](docs/ai/engineering/build-and-test-commands.md).
New features and changes to `src/utils/**`, `src/scripts/**` or `scripts/**` come with unit tests in `src/__tests__/`.

`pins:gen` renders one 1000x1500 Pinterest pin per product into `public/pins/`, which
`PinterestSave` on `/shop/<id>/` hands to Pinterest. Without a pin, the Save button falls
back to the raw product photo — a square catalog shot with no title or branding, in a
ratio Pinterest crops. It fetches product photos from the merchant CDN, so it **needs
network** and will not run in a sandboxed agent container; add `--placeholder` to preview
the template offline with a stand-in photo, and `--only <id>` to render one product.
Pins are gitignored like `public/og/` — force-add the ones you have reviewed.

`admin:serve` runs alongside `bun run dev`. It is the local companion for the
`/admin/images/` browser: with it running, Save writes `src/data/product-galleries.ts`;
without it the page falls back to copying a paste-ready snippet. It binds to
127.0.0.1 only and validates product ids and image hosts before writing.

Scripts that need API keys or outbound network access (`check:asins`, `fetch:chewy`,
`chewy-link`, `fetch-amazon-data.ts`, `indexnow:submit`) are documented in
[`docs/ai/engineering/environment-and-integrations.md`](docs/ai/engineering/environment-and-integrations.md).
In a sandboxed container, a blocked host and a missing key look alike — check both.

## SEO meta constraints (enforced by tests)

| Tag | Min | Max |
|---|---|---|
| `og:title` | 40 chars | 65 chars |
| `og:description` | 100 chars | 165 chars |

Use `ogTitle` prop on `BaseLayout` when `<title>` falls outside the og:title range.

## Content guardrails

- **American English only.** Chill-Dogs is a US site with US authors. Write `math`, `color`, `neighborhood`, `meters`, `-ize`, `leash`, `backyard`, `closet`, `store` — never `maths`, `colour`, `neighbourhood`, `metres`, `-ise`, `lead`, `garden`, `cupboard`, `shop`. Rhys is a Welsh name on a Los Angeles dog; it is not a cue for British English. Applies to copy, alt text, comments, docs, and commit messages. Enforced (spelling, plus a few vocabulary forms) by `src/__tests__/content-guardrails.test.ts`; details in [`docs/ai/writing/article-writing-guide.md`](docs/ai/writing/article-writing-guide.md#american-english).
- Do not use "vet-approved", "vet-recommended", or similar without documented sourcing, and do not imply the site consulted veterinarians or has veterinary endorsements.
- Do not claim the site ordered, tried or hands-on tested a product unless that actually happened.
- Prefer: researched, compared, curated, popular, practical.
- Full guardrails: [`docs/ai/writing/medical-and-vet-claim-guardrails.md`](docs/ai/writing/medical-and-vet-claim-guardrails.md)

## Styling

- Follow the existing Astro + scoped CSS approach, and reuse existing layout and section patterns before inventing new ones.
- Keep spacing, card structure, and CTA styling consistent with the section you are editing.
- Key import aliases: `@components`, `@layouts`, `@styles`, `@data`, `@utils`, `@scripts`.
