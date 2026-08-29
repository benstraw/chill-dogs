# Chill-Dogs Roadmap

Open work, carried over from the README's TODO list when the README became a project
overview rather than a working document. This is the current list; `docs/build-log.md`
is the historical record and its Phase 8 backlog is kept as-written for that reason.

## Open

- [ ] Implement feature flag–driven hero experiments (replace hardcoded variants)
- [ ] Evaluate hero experiment winner after 2 weeks / 200+ primary CTA clicks per
      variant; promote winner to default, retire losing variant URLs
- [ ] Expand calming category: individual converter pages for anxiety-wraps,
      calming-treats, lick-mats, snuffle-mats (parallel to cooling converter structure)
- [ ] Defer PostHog init (idle + interaction fallback); monitor early-bounce event loss
      and feature-flag flicker
- [ ] Align Astro and MDX peer versions: use `@astrojs/mdx` v4 with the current
      Astro 5 stack, or upgrade Astro and its official integrations to v6 together
- [ ] Add third pillar: **Relaxing** — dog beds, plush toys, snuggly blankets, and cozy
      comfort gear

## Shipped

- [x] Connect Vercel project and set up auto-deploy from `main`
- [x] Point `chill-dogs.com` domain to Vercel; confirm SSL
- [x] Set up analytics — PostHog (primary) via `src/components/Analytics.astro` with
      global `init()` and `data-track` event delegation
- [x] Set up PostHog reverse proxy — managed proxy at `woof.chill-dogs.com` active;
      `api_host` updated in `Analytics.astro`
- [x] Add OG image (`/public/og-default.jpg`)
- [x] Add favicon (`/public/favicon.ico`)
- [x] Generate per-page OG images with dynamic headline + CTA text
      (`src/scripts/generate-og-images.mjs`)
- [x] Review affiliate tag is active and approved in Amazon Associates dashboard
      (`chill-dogs-20`)
- [x] Set up IndexNow for instant search engine indexing on deploy (Bing, Yandex, etc.)
- [x] Redo the entire article about Thundershirt alternatives

## Where the details live

- Hero experiment variants, hypotheses, and tracking — [`docs/EXPERIMENTS.md`](./EXPERIMENTS.md)
- Build commands and test layers — [`docs/ai/engineering/build-and-test-commands.md`](./ai/engineering/build-and-test-commands.md)
- Environment variables and integration scripts — [`docs/ai/engineering/environment-and-integrations.md`](./ai/engineering/environment-and-integrations.md)
- Analytics event registry — [`docs/ai/engineering/analytics-events.md`](./ai/engineering/analytics-events.md)
- OG image pipeline and SEO metadata — [`docs/ai/engineering/seo-and-schema.md`](./ai/engineering/seo-and-schema.md)
- Page types, routes, and module stacks — [`docs/system-definition.yaml`](./system-definition.yaml)
