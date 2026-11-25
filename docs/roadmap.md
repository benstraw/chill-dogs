---
title: Chill-Dogs Roadmap
type: plan-list
domain: global
status: active
updated: 2026-11-25
tags:
  - chill-dogs
  - roadmap
related:
  - system-definition.yaml
  - engineering/build-and-test-commands.md
---

# Chill-Dogs Roadmap

## Use this when

You want to know what is planned, already shipped, or dropped. Check an item against the code before acting on it.

Open work, carried over from the README's TODO list when the README became a project
overview rather than a working document. This is the current list; `docs/archive/build-log.md`
is the historical record and its Phase 8 backlog is kept as-written for that reason.
Last reviewed 2026-11-25 against the code.

## Open

- [ ] Expand calming category: converter pages for calming treats and snuffle mats
      (anxiety wraps and lick mats are shipped)
- [ ] Monitor early-bounce event loss and feature-flag flicker from the deferred PostHog
      init (the idle-time init itself is shipped)
- [ ] Align Astro and MDX peer versions: `@astrojs/mdx` 5.0.3 requires Astro ^6 but
      Astro 5.18 is installed. Use `@astrojs/mdx` v4 with Astro 5, or upgrade Astro and
      its official integrations to v6 together
- [ ] Content idea: dog sleep and activity trackers (from Ben's 2026-05-08 story list; the Fi collar review covers fitness tracking, nothing covers sleep yet)

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
- [x] Third pillar, launched as **Comforting** (`/comforting/`): beds, crates and travel gear
- [x] Calming converters for anxiety wraps (ThunderShirt alternatives) and lick mats
- [x] Defer PostHog init to idle time (`requestIdleCallback`, with a timeout fallback)

## Dropped

- Feature-flag hero experiments and the winner evaluation: the section collector hero
  experiments were retired on 2026-08-10 (see `docs/archive/hero-experiments.md`)

## Related knowledge

- Build commands and test layers — [`docs/engineering/build-and-test-commands.md`](engineering/build-and-test-commands.md)
- Environment variables and integration scripts — [`docs/engineering/environment-and-integrations.md`](engineering/environment-and-integrations.md)
- Analytics event registry — [`docs/engineering/analytics-events.md`](engineering/analytics-events.md)
- OG image pipeline and SEO metadata — [`docs/engineering/seo-and-schema.md`](engineering/seo-and-schema.md)
- Page types, routes, and module stacks — [`docs/system-definition.yaml`](system-definition.yaml)
