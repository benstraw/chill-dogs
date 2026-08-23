---
title: Product Copy Rules
type: canonical
domain: writing
status: active
updated: 2026-08-23
tags:
  - chill-dogs
  - writing
  - product-copy
  - content-guardrails
related:
  - medical-and-vet-claim-guardrails.md
  - article-writing-guide.md
  - ../affiliate/amazon-associates-rules.md
---

# Product Copy Rules

Standards for writing product descriptions, comparisons, and calls-to-action on chill-dogs.com.

## Use this when

Writing any product description, comparison summary, card copy, or CTA text for converter pages or inline product cards in articles.

---

## Core language rules

### Use grounded, researched language

Preferred terms: `researched`, `compared`, `curated`, `popular`, `practical`, `widely used`, `top-rated`.

Never: `vet-approved`, `vet-recommended`, `clinically proven`, `proven to`, `guaranteed`.

See full vet and health claim rules at [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md).

### Claim hands-on testing only for products that carry `handsOn`

Most of the catalog is researched rather than handled, so research language is the
default. Some products genuinely are used, though, and for those the copy should say
so — understating real experience is its own kind of inaccuracy.

The `handsOn` field on the product record is the source of truth. It carries `since`
(when the product was first used) and `note` (what was actually done with it), and it
is set by hand only when that is true. See `ProductEditorialFields` in
[`src/data/products/types.ts`](../../../src/data/products/types.ts).

**Product has no `handsOn` field** — write research language:

- "based on our research," "we compared," "we looked at," "customer reviews note."
- Never: "we tested," "in our testing," "we tried," "in our hands-on review."

**Product has `handsOn`** — first-hand language is allowed, and should stay inside what
the `note` actually covers:

- Write what was done, not what it proves: "we used this on a week of desert hikes" is
  grounded; "we tested this against every competitor" is not, unless that happened.
- One summer with one dog is one dog's experience. Say so rather than generalizing it
  into a durability or safety verdict.
- Everything else on this page still applies. Hands-on use does not license a vet
  claim, a health claim, or "best" as an objective fact — see
  [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md).

If a product was handled but has no `handsOn` field yet, add the field in the same
change as the copy. Copy and record ship together, never one without the other.

### Do not use "best" as an unsupported superlative fact

Framing "best" as editorial opinion on a comparison page is acceptable. Stating "X is the best cooling mat" as an objective fact is not.

- Acceptable: "One of the most popular options for dogs that run hot."
- Not acceptable: "This is definitively the best cooling mat for dogs."

### No fake urgency

Do not write: "Buy before it's gone," "Limited time," "Act now," "Last chance."

The editorial voice is calm and practical. Trust it.

### No vet or medical authority claims

See [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md) for the full table.

---

## What good product copy covers

For each product on a converter page, copy should address:

1. **Category fit** — What type of dog or owner is this for? Hot climate vs. indoor use? Active dog vs. senior dog?
2. **Use case** — When and how is this used? Car ride? Backyard? All-day wear?
3. **Tradeoffs** — What does this product trade off? Portability vs. cooling power? Price vs. durability?
4. **Buyer context** — Who will get the most value from this? Who should look elsewhere?

For cooling, calming, and relaxation converters, product copy lives in bullets on the canonical product record. There is no fixed bullet count; write only the bullets that differentiate the product. Do not repeat context that applies to all products on the page; state shared context once in the page intro instead.

Keep descriptions factual and specific. Vague praise ("great quality," "dogs love it") adds no value.

---

## What good product copy avoids

- Padding with adjectives: "incredible," "amazing," "awesome," "fantastic"
- Medical claims: "reduces anxiety by X%," "clinically shown to calm dogs"
- Vet endorsement: "recommended by vets," "vet-approved formula"
- Unverified claims: any specific statistic or effectiveness claim not backed by a real source
- Fake testing: implying the product was physically evaluated when it was not

---

## CTA copy

CTA buttons on `AffiliateLink.astro` links should be:

- Clear and direct: "Buy on Amazon," "Check Price on Amazon," "See on Amazon"
- Not: "Get yours now," "Click here," "Shop this deal"
- Not misleading about what clicking will do (it goes to Amazon)

---

## Related knowledge

- [`converter-writing-guide.md`](converter-writing-guide.md) — Full copy structure and anti-repetition rules for converter pages
- [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md) — Full guardrails for health and vet claims
- [`article-writing-guide.md`](article-writing-guide.md) — Voice and style for all site copy
- [`../affiliate/amazon-associates-rules.md`](../affiliate/amazon-associates-rules.md) — Affiliate link requirements
- [`../affiliate/disclosure-rules.md`](../affiliate/disclosure-rules.md) — When disclosure is required
