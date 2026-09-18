# CLAUDE.md

This repo uses a Markdown AI knowledge graph under `docs/ai/`.

## Start here

1. Read [`docs/ai/AGENT_START.md`](docs/ai/AGENT_START.md) - operating brief
2. Read [`docs/ai/AI_INDEX.md`](docs/ai/AI_INDEX.md) - task router
3. Use [`docs/ai/KNOWLEDGE_GRAPH.md`](docs/ai/KNOWLEDGE_GRAPH.md) to find domain-specific docs
4. Before finishing, run the relevant checklist in [`docs/ai/checklists/`](docs/ai/checklists/)

Do not skip the task-specific docs.

## Core rules

- Chill-Dogs is an **Astro 5 / Bun** static affiliate site.
- Primary business goal: **Amazon affiliate commission revenue**.
- Keystone event: `amazon_outbound_click`.
- Valid page types: `converter`, `collector`, `attractor`, `informer`. Do not invent new types.
- Do not hardcode internal routes - import from `src/data/routes.ts`.
- Use `AffiliateLink.astro` for all Amazon outbound links.
- **Product cards on converters must compose the shared primitives in `src/components/modules/primitives/`** (`ProductCardShell`, `ProductImageFrame`, `ProductBulletList`, `AffiliateOfferStack`). Do not hand-roll a card surface, image frame, bullet list, or CTA stack. If a primitive is missing something, add an opt-in prop to the primitive rather than forking it locally. Card-specific extras (badges, spec lists, notes) stay local. `BrowseProductCard` is the one sanctioned exception.
- **"Show N more" expanders use the `DisclosureBar` primitive** (`src/components/modules/primitives/DisclosureBar.astro`) — a full-width outlined bar on the pillar accent. Do not hand-roll a bare `<summary>` text link.
- Use the existing related-content system (`src/utils/related-pages.ts`). Do not add manual related arrays.
- **A product `id` in `src/data/*-products.ts` is a public URL** — every product builds at `/shop/<id>/`. Renaming a product's `name` is free; renaming its `id` retires an indexed URL and needs redirects in **both** `vercel.json` and `astro.config.mjs`, with the old id left in `src/data/product-url-history.ts`. Enforced by `src/__tests__/product-slugs.test.ts`.
- Run relevant tests/build checks before finishing.
- **Never merge, close, or squash a pull request without explicit confirmation.** Phrases like "push the PR up", "put it up for review", or "send it up" mean push the branch and open/update the PR — NOT merge it. Only run `gh pr merge` when the user says exactly that.

## Source of truth files

- `docs/system-definition.yaml` - keep updated when pages, routes, or page types change.
- `src/data/sitemap-inventory.ts` - every new non-MDX page must be registered here.
- `src/data/routes.ts` - all internal route strings live here.
- `src/data/products/` - canonical merchant offer types/helpers. Product editorial copy remains in product records; Amazon/Chewy provider metadata is diagnostic only and must not auto-overwrite copy or images.

## Commands

```bash
bun run dev              # Start dev server at localhost:4321
bun run build            # Static build to dist/
bun run preview          # Preview built site
bun run test             # Run full vitest suite (build first; seo-meta test reads dist/)
bun run test:smoke       # Smoke tests only; builds the site internally
bun run test:coverage    # Coverage report for src/utils/**, src/scripts/**, src/data/**
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

`pins:gen` renders one 1000x1500 Pinterest pin per product into `public/pins/`, which
`PinterestSave` on `/shop/<id>/` hands to Pinterest. Without a pin, the Save button falls
back to the raw product photo — a square catalogue shot with no title or branding, in a
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

- Do not use "vet-approved", "vet-recommended", or similar without documented sourcing.
- Prefer: researched, compared, curated, popular, practical.
- Full guardrails: [`docs/ai/writing/medical-and-vet-claim-guardrails.md`](docs/ai/writing/medical-and-vet-claim-guardrails.md)
