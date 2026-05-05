---
title: Article Writing Guide
type: canonical
domain: writing
status: active
updated: 2026-05-03
tags:
  - chill-dogs
  - writing
  - articles
  - voice
  - structure
  - seo
related:
  - product-copy-rules.md
  - medical-and-vet-claim-guardrails.md
  - ../strategy/metrics-and-page-types.md
  - ../engineering/seo-and-schema.md
  - ../checklists/article-publish-checklist.md
---

# Article Writing Guide

Defines the voice, structure, required modules, and content standards for every article collector (`collector · article`) on chill-dogs.com.

## Use this when

Writing or reviewing any article collector page — how-to guides, safety articles, informational content.

---

## 1. Persona

**The writer is a careful, practical dog owner — not a veterinarian.**

Ben Strawbridge (author of record) researches questions real dog owners ask, synthesizes reliable information into usable guidance, and connects readers to products curated through research. He is not a vet, does not claim veterinary expertise, and does not pretend to have hands-on tested every product.

The persona is:

- **Knowledgeable but grounded.** Specific, researched, accurate — backed by named sources (AKC, AAHA, etc.) where applicable. Never makes up statistics or implies clinical authority.
- **Practical, not preachy.** Gets to the useful part fast. Skips moralizing.
- **Direct and calm.** Low-key, assured. Not hyperactive, not breathless.
- **Peer-level, not expert-to-novice.** Writing to a fellow adult dog owner who can follow a practical argument.
- **Warm without being saccharine.** Care shows through usefulness, not adjectives.

---

## 2. Tone and style

### Voice

Measured, precise, confident. Conversational enough to read easily; substantive enough to trust.

Write like someone who looked into this carefully and is telling a friend what they found — without the filler words that come from talking.

### Sentence style

- Short to medium sentences. Vary the rhythm.
- Active voice by default.
- Avoid passive constructions: "dogs can be affected by heat" → "heat affects dogs."
- Bold is for key terms or scan-friendly emphasis — not decoration. One bolded phrase per point, max.

### Paragraph style

- Three to four sentences per paragraph. Five is the ceiling.
- One idea per paragraph.

### What sounds right

- "The back seat runs 10–15 °F hotter than the front cabin, even with the AC on."
- "A cooling bandana works by soaking the carotid artery area — which helps regulate full-body temperature."
- "Brachycephalic breeds overheat faster — narrower airways mean panting is less effective."

### What sounds wrong

- "We all know how much we love our furry best friends!" — fake warmth, filler
- "According to experts, dogs can sometimes experience heat-related issues." — vague, weasel language
- "Check out these AMAZING cooling products!" — marketing voice, not editorial
- "In conclusion..." — no signposting your own structure

### Numbers and units

- Use numerals for all numbers: `85 °F`, `3 products`, `10–15 minutes`
- Temperature: always include `°F` with a space: `85 °F`, not `85F` or `85°F`
- Ranges: en-dash with no spaces: `1–2 hours`, `10–15 °F`

---

## 3. Required modules

Every article collector must include these modules. Order matters.

```
1. Article header    (eyebrow + h1 + lede)
2. Toc               required on articles with 4+ h2 sections
3. Prose body        <article><div class="prose"> structure
4. FAQ               minimum 3 questions; 5 is ideal
5. InternalLinkStrip 3–5 links pointing to relevant converters
```

Optional:
```
- Disclosure         required when product cards appear inline
- CoolingProductCard / calming equivalent — embed mid-article when contextually motivated
```

### Module rules

**`Toc`** — Headings fed to `Toc` must exactly match the `id` attributes on the corresponding `h2` elements. Do not add headings to the TOC that do not exist in the body. Do not add `id` attributes to headings not in the TOC.

**`FAQ`** — Questions must come from real search patterns — not invented to pad. Each answer: 2–4 sentences. Do not repeat information the body already covered in full.

**`InternalLinkStrip`** — Links must point to converter pages (or other article collectors where cross-linking adds value). Appears at the bottom, after `FAQ`. Labels: short and descriptive — "Best Cooling Mats" not "Click here for cooling mats."

For migrated article collectors: render `InternalLinkStrip` with `currentHref`. Keep relationship intent in `topics`, `pinnedRelated`, `excludeRelated`, `relatedLabel`. Do not add new manual related arrays.

**`Disclosure`** — Required when inline product cards appear. Place after prose, before or after `FAQ`.

---

## 4. Article structure

### Header block

```
eyebrow     category label (e.g. "Cooling & Car Safety")
h1          exact search-intent title
lede        1–2 sentences; doubles as the description meta. Specific and useful, not teaser copy.
```

The lede answers "why should I keep reading" in one breath. It is also the `description` meta field — write it for both humans and search.

### Prose body

**Opening paragraph (no heading):** Restate the problem without repeating the lede verbatim. Orient the reader. Do not start with "In this article we will..."

**Body sections (h2):** 4–7 sections is the typical range. Each h2 = one complete sub-topic. Section order: lead with "why this matters" mechanics, then practical guidance, then product integration, then edge cases.

Use `h3` only when a section genuinely has subsections. One level of nesting is the limit.

**Product card placement:** Embed mid-article only where the product directly solves the problem being discussed in that section. Not as decoration; not just to hit a quota.

**Closing:** No formal conclusion section needed. Let `FAQ` and `InternalLinkStrip` carry the close.

---

## 5. SEO and search intent

Article collectors target **informational intent** — "how to," "why does," "when should I," "is it safe to." They are not product round-ups (that is the converter's job).

### Title format

- Sentence case: "How to keep a dog cool in a car"
- No clickbait formulas
- Clear and literal: the title says exactly what the article covers

### Keywords

- Primary keyword phrase appears naturally in the lede, one early h2, and the FAQ.
- Write for the reader — the keyword recurs because the topic recurs.

### Schema

All article collectors use `Article` JSON-LD (not `CollectionPage`). Required fields:

```js
{
  '@type': 'Article',
  headline: title,
  description,
  url: 'https://www.chill-dogs.com/...',
  image: ['...og-image-url...'],
  author: { '@type': 'Person', name: 'Benjamin Strawbridge', url: 'https://www.benstrawbridge.com/' },
  publisher: { '@type': 'Organization', name: 'Chill-Dogs', logo: { ... } }
}
```

---

## 6. Source and citation standards

- Named sources preferred: "According to AKC," "AAHA notes," "per a study published in..."
- Do not cite a source you have not verified.
- Do not use Wikipedia as a primary source.
- Specific figures add credibility: "85 °F on asphalt can reach 135 °F" is better than "asphalt gets very hot."
- If a claim is contested or depends on conditions, say so.

---

## 7. Content guardrails

See full guardrails at [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md).

Quick reference:

| Do not write | Write instead |
|---|---|
| "vet-recommended" | "popular among dog owners" / "widely used" |
| "vet-approved" | omit, or cite an actual vet source |
| "we tested" | "based on our research" / "we compared" |
| "proven to" | "designed to" / "intended to" |
| "clinically proven" | cite the actual study or remove the claim |
| "the best" (as fact) | "one of the most popular" / "a top-rated option" |
| "safe for all dogs" | "safe for most dogs" or name the exceptions |

Medical escalation: articles may describe symptoms and general first-response guidance, but must not replace veterinary advice. When covering health emergencies (heatstroke, seizure, severe anxiety), include a clear statement to contact a vet. Do not suggest dosages or medications.

---

## 8. Conversion integration

Articles earn money through the `InternalLinkStrip` at the bottom and, when present, inline product cards.

**How to integrate conversion naturally:**
- Describe the product category in prose at the moment it solves the problem being discussed.
- Link to the converter page inline using tracked anchor links with `data-track="collector_to_converter_click"`.
- The `InternalLinkStrip` at the bottom aggregates those paths into clear next steps.

**What to avoid:**
- Sections that exist only to mention products
- Forced transitions that break the editorial voice
- Affiliate disclosure language woven into prose (the `Disclosure` component handles that)

---

## 9. Sitemap and frontmatter

MDX articles in `src/content/articles/` are auto-discovered — no manual registration in `content-sitemap.ts` needed.

Required frontmatter fields: `canonicalPath` (the page URL), `title`, `description`, `publishDate`, `author`.

Optional but recommended:
```yaml
topics: [travel, road-trips, car-cooling]
pinnedRelated: ['/cooling/car-cooling-for-dogs/']
excludeRelated: ['/privacy-policy/']
relatedLabel: 'Road Trip Gear'
```

`topics` values must match topic values defined in `src/data/content-sitemap.ts`.

---

## Related knowledge

- [`medical-and-vet-claim-guardrails.md`](medical-and-vet-claim-guardrails.md) — Full vet and health claim guardrails
- [`product-copy-rules.md`](product-copy-rules.md) — Product description language when cards appear
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Collector article type definition
- [`../engineering/seo-and-schema.md`](../engineering/seo-and-schema.md) — OG meta constraints and schema
- [`../checklists/article-publish-checklist.md`](../checklists/article-publish-checklist.md) — Publish checklist
