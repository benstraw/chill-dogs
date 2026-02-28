# AGENTS.md

Repository guidance for coding agents working in `/Volumes/wanderer/dev/solo/chill-dogs`.

## Priority

- The keystone metric is Amazon affiliate revenue.
- Optimize pages for clarity, trust, and outbound affiliate clicks.
- Do not make changes outside the user-requested section or scope.

## Page-Type Rules

- Every page should behave as one type: `converter`, `collector`, `attractor`, or `informer`.
- `converter`: one job, drive affiliate clicks.
- `collector`: capture search traffic and route users to converters.
- `attractor`: convert campaign or social traffic.
- `informer`: admin or legal content only.

## Content Guardrails

- Do not say products are `vet-recommended`, `vet-approved`, or anything similar unless there is real documented sourcing for that exact claim.
- Do not imply Chill Dogs consulted veterinarians or has veterinary endorsements when it did not.
- Prefer language like `researched`, `compared`, `curated`, `practical`, or `popular`.
- Do not claim the site hands-on tests products unless that actually happened.
- Do not imply products were ordered, tried, or tested by the site unless that actually happened.

## Affiliate Rules

- All Amazon links must use [AffiliateLink.astro](/Volumes/wanderer/dev/solo/chill-dogs/src/components/AffiliateLink.astro).
- Keep the affiliate tag as `chill-dogs-20`.
- Favor above-the-fold paths to high-intent pages and affiliate clicks when appropriate for the page type.

## Styling

- Follow the existing Astro + scoped CSS approach.
- Reuse existing layout and section patterns before inventing new ones.
- Keep spacing, card structure, and CTA styling visually consistent with the existing site section you are editing.

## Project Notes

- Framework: Astro 5 static site.
- Package manager/scripts: `bun run dev`, `bun run build`, `bun run preview`.
- Key aliases: `@components`, `@layouts`, `@styles`, `@data`, `@utils`.

## Workflow

- Read [CLAUDE.md](/Volumes/wanderer/dev/solo/chill-dogs/CLAUDE.md) when repo-specific product, content, or conversion rules matter.
- Prefer local consistency over introducing a new pattern.
- Before changing copy, check that claims about expertise, testing, safety, and sourcing are actually supported.
