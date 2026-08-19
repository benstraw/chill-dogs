---
title: Charity Outreach Program
type: canonical
domain: marketing
status: active
updated: 2026-08-19
tags:
  - chill-dogs
  - charities
  - outreach
  - newsletter
  - backlinks
  - marketing
related:
  - charity-outreach-templates.md
  - newsletter-guide.md
  - marketing-plan.md
  - utm-rules.md
  - ../writing/medical-and-vet-claim-guardrails.md
  - ../checklists/marketing-publish-checklist.md
---

# Charity Outreach Program

Turns the editorial mentions on the Dog Charities We Love page into ongoing relationships with the organizations covered there.

## Use this when

Contacting a charity featured on `/shelter-dog-charities/`, scheduling a charity newsletter spotlight, or following up after one publishes.

---

## What this program is

Chill-Dogs features a group of dog-focused charities on the **Dog Charities We Love** page (`ROUTES.shelterCharities` → `/shelter-dog-charities/`) and periodically highlights one of them in the newsletter.

This program builds contact relationships with those organizations so the charity section works as living editorial rather than a static directory.

**Goals:**

- Introduce Chill-Dogs and make each charity aware of its inclusion on the site
- Give organizations a chance to correct or update their listing
- Establish contact before asking for anything promotional
- Coordinate future newsletter charity spotlights
- Encourage charities to share Chill-Dogs coverage through their own channels
- Earn relevant, legitimate backlinks and referral traffic over time
- Develop a pipeline of charity stories, campaigns, and events that become future Chill-Dogs content

**Guiding principle:**

> Feature first, relationship second, promotion third.

Make the coverage genuinely useful to the charity before asking them to help amplify Chill-Dogs.

---

## Page type note

`/shelter-dog-charities/` is registered as an **`informer`** page in `src/data/content-sitemap.ts`. It carries no revenue goal and no affiliate CTA, and outreach must not change that. Do not add product placements, affiliate links, or converter-style CTAs to the charity page in service of this program. The business value here is earned links, referral traffic, and story supply — all of which flow to collectors and converters elsewhere on the site.

---

## The three-touch sequence

Copy for all three touches, plus personalized week 1 drafts, lives in [`charity-outreach-templates.md`](charity-outreach-templates.md).

### Touch 1 — Initial introduction

An individual email to each charity explaining:

- what Chill-Dogs is
- why we selected their organization
- where they are featured on the charity page
- that we periodically feature charities in the Chill-Dogs newsletter
- that the inclusion is **editorial — not sponsored or paid**
- that they are welcome to send corrections or updated information

**Do not ask for a backlink, a share, or any promotion in this email.** The only job of touch 1 is to establish contact and hand the charity something useful.

### Touch 2 — Pre-publication check-in

When a charity is scheduled for a newsletter spotlight, contact them again **before** publication.

Ask whether there is a current campaign, program, donation page, event, volunteer opportunity, or other priority they would especially like readers to know about.

This produces fresher material and makes the feature more useful to the organization.

### Touch 3 — Published feature follow-up

After publication, send the organization the newsletter archive link.

At this point, casually encourage them to share the feature with supporters or add it to a news, media, or press page. This is the natural moment for social shares and backlinks to develop without making the original outreach feel transactional.

---

## Copy rules for outreach emails

Outreach email copy is Chill-Dogs marketing copy and follows the same guardrails as everything else:

- Match the site voice: calm, practical, peer-level. Not breathless, not "excited to share."
- **No vet-authority language.** No "vet-approved" or "vet-recommended" — see [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md).
- State plainly that the listing is editorial and unpaid. Never imply the charity paid for placement, and never offer placement in exchange for a link.
- Link to production URLs only (`https://www.chill-dogs.com/`), never staging or preview.
- UTM-tag links sent to charities so referral traffic is attributable — see [`utm-rules.md`](utm-rules.md).
- Do not put Amazon affiliate links in charity outreach email. The charity page is an `informer`; outreach that leads with monetization undercuts the relationship and the program's premise.

Newsletter spotlight content itself follows [`newsletter-guide.md`](newsletter-guide.md) — same format, subject line, and link rules as any other issue.

---

## Rollout schedule

Begin with 2–3 charities per week so each message can be personalized and responses managed properly.

| Week | Charities | Action |
|---|---|---|
| 1 | 15 out of 10 Foundation · Cuddly · Every Bark Counts | Send initial introductions; record contacts and responses |
| 2 | Fix'n Fidos · PAW-SOME MISSION · Reducing Animal Stress | Continue introductions; follow up on week 1 responses |
| 3 | Rolling Dog Farm · Tails That Teach · Wild Tunes | Complete the first round; begin coordinating the next newsletter feature |

All nine organizations currently on the page are covered by weeks 1–3. When the page changes, this table changes with it.

### Week 4 onward — the regular cycle

**Before newsletter publication:**

- Contact the featured charity
- Verify current listing information
- Ask about anything timely they want highlighted

**After publication:**

- Send the published newsletter link
- Encourage sharing
- Record any social mention, newsletter mention, or website backlink

**Ongoing:**

- Add new charities to the outreach process when they are added to the page
- Reconnect with existing charities when they have significant news or a new Chill-Dogs feature

---

## Tracking

Maintain an outreach tracker with these columns:

| Column | Notes |
|---|---|
| Charity | Must match the heading on `/shelter-dog-charities/` |
| Primary contact | Name and role |
| Email | |
| Initial outreach date | Touch 1 |
| Response | |
| Listing corrections | Feed these back into `src/pages/shelter-dog-charities.astro` |
| Newsletter feature date | |
| Pre-publication contact | Touch 2 |
| Post-publication follow-up | Touch 3 |
| Social share | |
| Newsletter mention | |
| Website backlink | Target URL and the page it links from |
| Notes / future story opportunities | |

Listing corrections are a content change to the charity page, so they run through the normal publish path — see [`../checklists/marketing-publish-checklist.md`](../checklists/marketing-publish-checklist.md).

---

## Editorial benefits

Charity contacts can supply:

- updates on new programs
- rescue stories
- fundraising campaigns
- volunteer opportunities
- educational initiatives
- quotes and expert perspectives
- photos and approved media
- suggestions for other organizations Chill-Dogs should consider

Over time this becomes a recurring source of original material for the newsletter, website, Pinterest, and social channels.

**Media use:** only publish charity logos, photos, or quotes the organization has explicitly approved, and keep a record of that approval in the tracker notes.

---

## Success measures

Treat this primarily as an editorial and relationship-building program. Results can be measured through:

- percentage of charities responding
- charity-provided updates or story leads
- social shares of Chill-Dogs coverage
- newsletter mentions
- earned backlinks
- referral traffic (attributable via UTM tags)
- new organizations referred to us
- repeat engagement with charities already featured

These are supporting metrics. They do not replace the keystone event `amazon_outbound_click` — the value chain runs: charity relationship → earned link and referral traffic → collector pages → converter pages → Amazon.

---

## Related knowledge

- [`charity-outreach-templates.md`](charity-outreach-templates.md) — Email copy for all three touches, plus week 1 drafts
- [`newsletter-guide.md`](newsletter-guide.md) — Email format, voice, and link rules for the spotlight itself
- [`marketing-plan.md`](marketing-plan.md) — Channel strategy, KPIs, organic-first posture
- [`utm-rules.md`](utm-rules.md) — UTM parameter format for links sent to charities
- [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md) — Claim guardrails for outreach copy
- [`../checklists/marketing-publish-checklist.md`](../checklists/marketing-publish-checklist.md) — Publish gate for listing corrections and spotlights
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Why the charity page is an `informer`
