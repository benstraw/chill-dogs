<p align="center">
  <a href="https://www.chill-dogs.com/"><img src="public/images/paw-logo.png" alt="Chill-Dogs" width="140"></a>
</p>

<h1 align="center">Chill-Dogs</h1>

<p align="center"><em>For the love of dogs.</em></p>

<p align="center">
  <a href="https://www.chill-dogs.com/"><img alt="Website status" src="https://img.shields.io/website?url=https%3A%2F%2Fwww.chill-dogs.com&amp;up_message=online&amp;down_message=out%20for%20a%20walk&amp;style=for-the-badge&amp;logo=googlechrome&amp;logoColor=white"></a>
  <a href="https://vercel.com/"><img alt="Deployed on Vercel" src="https://img.shields.io/badge/deploys-Vercel-000000?style=for-the-badge&amp;logo=vercel&amp;logoColor=white"></a>
  <a href="https://www.chill-dogs.com/affiliate-disclosure/"><img alt="Amazon Associates" src="https://img.shields.io/badge/Amazon-Associates-FF9900?style=for-the-badge&amp;logo=amazon&amp;logoColor=white"></a>
  <img alt="Dogs consulted: all of them" src="https://img.shields.io/badge/dogs%20consulted-all%20of%20them-87B7C7?style=for-the-badge">
</p>

<p align="center">
  <a href="https://astro.build/"><img alt="Built with Astro" src="https://img.shields.io/badge/built%20with-Astro%205-BC52EE?style=flat-square&amp;logo=astro&amp;logoColor=white"></a>
  <a href="https://bun.sh/"><img alt="Runs on Bun" src="https://img.shields.io/badge/runs%20on-Bun-FBF0DF?style=flat-square&amp;logo=bun&amp;logoColor=black"></a>
  <a href="https://www.typescriptlang.org/"><img alt="TypeScript" src="https://img.shields.io/badge/typed%20with-TypeScript-3178C6?style=flat-square&amp;logo=typescript&amp;logoColor=white"></a>
  <img alt="Styled with CSS, no Tailwind" src="https://img.shields.io/badge/styled%20with-CSS%2C%20no%20Tailwind-663399?style=flat-square">
  <a href="https://posthog.com/"><img alt="Analytics by PostHog" src="https://img.shields.io/badge/measured%20with-PostHog-F54E00?style=flat-square&amp;logo=posthog&amp;logoColor=white"></a>
</p>

<p align="center">
  <a href="https://github.com/benstraw/chill-dogs/commits/main"><img alt="Last commit" src="https://img.shields.io/github/last-commit/benstraw/chill-dogs?style=flat-square&amp;logo=github"></a>
  <a href="https://github.com/benstraw/chill-dogs/graphs/commit-activity"><img alt="Commit activity" src="https://img.shields.io/github/commit-activity/m/benstraw/chill-dogs?style=flat-square&amp;logo=github"></a>
  <a href="https://github.com/benstraw/chill-dogs"><img alt="Repository size" src="https://img.shields.io/github/repo-size/benstraw/chill-dogs?style=flat-square&amp;logo=github"></a>
</p>

Somewhere right now there is a dog panting on a kitchen floor, a dog hiding in a
bathtub because of fireworks, and a dog who has decided the only acceptable bed is
the one you are currently sitting on. [Chill-Dogs](https://www.chill-dogs.com/) is
for the people trying to fix that — a small, researched catalog of the gear that
actually helps, so nobody has to scroll through ten thousand near-identical listings
at eleven at night.

This repository is the whole site. Chill-Dogs earns Amazon Associates commissions on
the products it recommends, and the code is public so anyone curious about how that
works can read every line of it — the product data, the disclosure rules, the tests,
the guardrails on what the copy is allowed to claim.

## Three ways to make a dog comfortable

The paw up top runs sky blue to sage green to dusty rose, which is not decoration —
those are the three theme colors, and each one is a section of the site.

**[Cooling](https://www.chill-dogs.com/cooling/)** is the summer problem. Mats,
vests, bandanas, freezable toys, hot-car gear, travel water, and the honest answer to
"how hot is too hot for a walk?"

**[Calming](https://www.chill-dogs.com/calming/)** is the year-round one. Anxiety
wraps and ThunderShirt alternatives, lick mats, crate training, car anxiety, and how
to build a room a dog will actually settle in on the fourth of July.

**[Comforting](https://www.chill-dogs.com/comforting/)** is where the dog ends up
once everything else is sorted. Orthopedic and calming beds, crates that don't look
like crates, airline carriers, and how much sleep a dog is supposed to get anyway.

Threading through all three: travel, gear, and safety — road-trip packing, flying
with a dog, GPS trackers, and what to do in the twenty minutes after a dog runs off,
which is a guide written from experience nobody wanted to gain.

## Under the hood

Static Astro 5, built with Bun, deployed on Vercel. No CMS, no database, no backend —
every product is a typed TypeScript record, so a bad ASIN or a missing field is a
compile error rather than a broken page someone finds three weeks later. Styling is
vanilla CSS driven by a single token file; there is no Tailwind and no component
library. Social share images are rendered at build time with Satori, which means the
preview card for a product page is generated from the same data the page is.

## Every page has exactly one job

The site is built as a conversion system, and the interesting constraint is that every
page must declare which of four jobs it does. **Converters** exist to send a qualified
click to Amazon. **Collectors** catch search intent and route it to the right
converter. **Attractors** turn campaign and social traffic into a first useful click.
**Informers** handle legal and trust.

One page, one type, one metric. A collector that starts growing its own product
comparison tables is a bug, not a feature, and the page-type field is what makes that
argument settleable instead of a matter of taste. The full model lives in
[`docs/system-definition.yaml`](./docs/system-definition.yaml).

## The repo is written for robots too

Most projects document themselves for people. This one also documents itself for the
AI agents that work on it. [`docs/ai/`](./docs/ai/) is a Markdown knowledge graph —
an operating brief, a task router, a dependency map, and thirty-odd domain documents
covering everything from affiliate compliance to how to write a product bullet. There
is a generated `/llms.txt` for crawlers, `CLAUDE.md` and `AGENTS.md` for coding
agents, and a validator that fails CI when a cross-link rots or a doc's frontmatter
drifts. Documentation that can go stale silently will, so this documentation can't.

## Keeping it honest

Every outbound Amazon link goes through one component that enforces
`rel="nofollow sponsored noopener"` and the affiliate tag — there is no way to
hand-roll a link that skips the disclosure. The copy guardrails ban "vet-approved",
"vet-recommended", and any claim that a product was physically tested, because none of
that would be true; the site researches, compares, and curates, and says so in those
words. A scheduled job re-checks every tracked ASIN against Amazon so dead product
links surface as a failing build rather than a dead end for a reader. Thirty-one test
files stand between a change and `main`.

---

[Visit the site](https://www.chill-dogs.com/) ·
[Cooling](https://www.chill-dogs.com/cooling/) ·
[Calming](https://www.chill-dogs.com/calming/) ·
[Comforting](https://www.chill-dogs.com/comforting/) ·
[Affiliate disclosure](https://www.chill-dogs.com/affiliate-disclosure/) ·
[AI docs](./docs/ai/AI_INDEX.md) ·
[Roadmap](./docs/roadmap.md)
