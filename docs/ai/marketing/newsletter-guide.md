---
title: Newsletter Guide
type: canonical
domain: marketing
status: active
updated: 2026-08-19
tags:
  - chill-dogs
  - newsletter
  - email
  - buttondown
  - marketing
related:
  - marketing-plan.md
  - utm-rules.md
  - charity-outreach-program.md
  - ../writing/article-writing-guide.md
  - ../writing/medical-and-vet-claim-guardrails.md
---

# Newsletter Guide

Email format, tone, link rules, and content guidelines for Chill-Dogs newsletters (via Buttondown).

## Use this when

Writing, reviewing, or scheduling a Chill-Dogs newsletter email.

---

## Purpose of the newsletter

Announce new articles and guides to existing subscribers. Drive return visits to collector and converter pages. Build relationship through useful, practical content — not sales pressure.

---

## Email format template

```
Subject: [Specific, useful subject — not clickbait]

Opening: [1–2 sentences. State what this issue is about. Direct and useful.]

Main article: [Brief description of the featured article or guide — 2–4 sentences.
               Why it matters. What they will learn or find.]

[Markdown link to featured article]

Related links:
- [Link title](https://www.chill-dogs.com/path/) — one-line context
- [Link title](https://www.chill-dogs.com/path/) — one-line context
- [Link title](https://www.chill-dogs.com/path/) — one-line context

Soft close: [1 sentence. Friendly, low-pressure. "See you next issue." or similar.]
```

---

## Subject line rules

- Specific and useful: "How to keep your dog cool in the car this summer"
- Not clickbait: not "You won't believe this," not "MUST READ"
- Under 60 characters for mobile preview
- Match the main article topic

---

## Voice and tone

Match the site voice: calm, practical, peer-level. Not breathless, not "excited to share," not marketing copy.

The newsletter reader is a fellow dog owner. Write to them directly and usefully.

---

## Link rules

- Use Markdown link format: `[Link text](https://www.chill-dogs.com/path/)`
- Include 2–4 Chill-Dogs links per email (one featured, 1–3 related)
- All links point to production URLs: `https://www.chill-dogs.com/`
- Add UTM parameters to links — see [`utm-rules.md`](utm-rules.md)
- Example with UTM: `https://www.chill-dogs.com/cooling/keep-dog-cool-in-car/?utm_source=newsletter&utm_medium=email&utm_campaign=may2026`

---

## Content rules

- **Announce new articles and guides.** That is the primary job of each email.
- **Do not over-sell Amazon products.** The newsletter routes to articles and converter pages — let those pages do the product selling.
- **Do not reproduce full article text.** Brief, useful summary + link is the pattern.
- **Do not claim vet authority** — see [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md).
- **Keep it short.** One featured article + 2–3 related links + close. Not a roundup of 10 things.

---

## What not to do

- "Amazing new guide!" — marketing voice, not editorial voice
- "Click here to buy on Amazon" — link to the converter page, not directly to Amazon from the email
- Fake urgency: "Act now," "Limited time"
- Reproducing the full article text in the email
- Links to staging or preview URLs

---

## Buttondown setup

- Platform: Buttondown (`PUBLIC_BUTTONDOWN_FORM_ACTION`, `PUBLIC_BUTTONDOWN_USERNAME`)
- Email signup: homepage inline block + footer on non-converter pages
- Converter pages intentionally exclude the footer signup (keeps them single-purpose)

---

## Related knowledge

- [`utm-rules.md`](utm-rules.md) — UTM parameter format
- [`marketing-plan.md`](marketing-plan.md) — Channel strategy and KPIs
- [`charity-outreach-program.md`](charity-outreach-program.md) — Coordinating charity spotlight issues
- [`../writing/article-writing-guide.md`](../writing/article-writing-guide.md) — Article voice and structure
- [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md) — Health claim rules
