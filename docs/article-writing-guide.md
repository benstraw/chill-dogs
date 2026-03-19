---
type: guide
tags: [writing, content, persona, articles]
updated: 2026-03-19
---

# Chill-Dogs Article Writing Guide

This guide defines the voice, structure, required modules, and content standards for every article collector (`collector · article`) published on `chill-dogs.com`. Read this before writing or reviewing any article.

---

## 1. Persona

**The writer is a careful, practical dog owner — not a veterinarian.**

Ben Strawbridge (the author of record) researches questions that real dog owners ask, synthesizes reliable information into usable guidance, and connects readers to products he has curated through research. He is not a vet, does not claim veterinary expertise, and does not pretend to have hands-on tested every product.

The persona in every article is:

- **Knowledgeable but grounded.** Specific, researched, accurate — backed by named sources (AKC, AAHA, etc.) where applicable. Never makes up statistics or implies clinical authority.
- **Practical, not preachy.** Tells the reader what to do in the situation they're actually in. Skips moralizing. Gets to the useful part fast.
- **Direct and calm.** Matching the brand name: low-key, assured. Not hyperactive, not breathless, not "OMG you need to read this."
- **Peer-level, not expert-to-novice.** Writing to a fellow adult dog owner who is capable of following a practical argument. Does not over-explain basics or write down to the reader.
- **Warm without being saccharine.** Dogs matter to the reader; that's understood and respected. No fake enthusiasm or emoji energy. The care shows through usefulness, not adjectives.

---

## 2. Tone and Style

### Voice
Measured, precise, confident. Conversational enough to read easily; substantive enough to trust.

Write like someone who looked into this carefully and is telling a friend what they found — without the filler words that come from talking.

### Sentence style
- Short to medium sentences. Vary the rhythm.
- Active voice by default.
- Avoid passive constructions where the subject is obscured: "dogs can be affected by heat" → "heat affects dogs."
- Bold is for key terms or scan-friendly emphasis — not decoration. One bolded phrase per point, max.

### Paragraph style
- Three to four sentences per paragraph is the target. Five is the ceiling.
- One idea per paragraph. Don't stack two unrelated points.
- Paragraphs end when the idea is complete, not when a word count is hit.

### What sounds right
- "The back seat runs 10–15°F hotter than the front cabin, even with the AC on."
- "A cooling bandana works by soaking the carotid artery area — which helps regulate full-body temperature."
- "Brachycephalic breeds overheat faster — narrower airways mean panting is less effective."

### What sounds wrong
- "We all know how much we love our furry best friends!" ← fake warmth, filler
- "According to experts, dogs can sometimes experience heat-related issues." ← vague, weasel language
- "Check out these AMAZING cooling products that will keep your pup cool all summer!" ← marketing voice, not editorial
- "It goes without saying that..." ← say it or cut it
- "In conclusion..." ← no signposting your own structure

### Numbers and units
- Use numerals for all numbers in body copy: `85 °F`, `3 products`, `10–15 minutes`.
- Spell out ordinals in prose: "the third option" not "the 3rd option."
- Temperature: always include `°F` with a space: `85 °F`, not `85F` or `85°F`.
- Ranges: en-dash with no spaces: `1–2 hours`, `10–15 °F`.

---

## 3. Required Modules (Article Collectors)

Every article collector must include these modules. Order matters.

```
1. Article header (eyebrow + h1 + lede)
2. Toc              — required on articles with 4+ h2 sections
3. Prose body       — <article><div class="prose"> structure
4. FAQ              — minimum 3 questions; 5 is ideal
5. InternalLinkStrip — 3–5 links pointing to relevant converters
```

Optional modules (use when appropriate):
```
- Disclosure        — required when product cards appear inline
- CoolingProductCard / calming equivalent — embed mid-article when contextually motivated
```

### Module rules

**`Toc`** — Headings fed to `Toc` must exactly match the `id` attributes on the corresponding `h2` elements. Every anchor in `tocHeadings` needs a matching `id` in the prose. Do not add headings to the TOC that don't exist in the body, and don't add `id` attributes to headings not in the TOC.

**`FAQ`** — Questions must come from real search patterns — not invented to pad. Each answer should be 2–4 sentences: enough to be genuinely useful, not so long it belongs in the body. Do not repeat information the body already covered in full.

**`InternalLinkStrip`** — Links must point to converter pages (or other article collectors where cross-linking adds value). This is the primary conversion mechanism for articles. It appears at the bottom, after `FAQ`. Labels should be short and descriptive: "Best Cooling Mats" not "Click here for cooling mats."

**`Disclosure`** — Required on any article that renders inline product cards. Place it after the prose, before or after `FAQ`. If no product cards appear inline, `Disclosure` is optional (the footer disclosure covers it).

---

## 4. Article Structure

### Header block
```
eyebrow     → category label (e.g. "Cooling & Car Safety", "Calming & Anxiety")
h1          → exact search-intent title
lede        → 1–2 sentences; the description meta text. Specific and useful, not teaser copy.
```

The lede should answer "why should I keep reading" in one breath. It is also the `description` meta field — write it for both humans and search.

### Prose body sections

**Opening paragraph (no heading)**
Restate the problem in one paragraph without repeating the lede verbatim. Orient the reader to what the article will do for them. Do not start with "In this article we will..."

**Body sections (h2)**
- 4–7 sections is the typical range.
- Each h2 should represent one complete sub-topic.
- Section order: lead with the "why this matters" mechanics, then practical guidance, then product integration, then edge cases or high-risk populations.
- Use `h3` only when a section genuinely has subsections. One level of nesting is the limit.

**Product card placement**
- Embed product cards mid-article only where the product directly solves the problem being discussed in that section.
- Not as decoration; not just to hit a quota.
- Use `Disclosure` when product cards are present.

**Closing**
- The prose body does not need a formal conclusion section.
- If there's a natural final section (e.g., "Signs your dog is overheating"), end on that. Let `FAQ` and `InternalLinkStrip` carry the close.

---

## 5. SEO and Search Intent

### Intent match
Article collectors target **informational intent** — "how to," "why does," "when should I," "is it safe to." They are not product round-ups (that's the converter's job).

Every article answers one specific question thoroughly. The title should be exactly what someone types or speaks into a search engine.

### Title format
- Sentence case: "How to keep a dog cool in a car" → render as "How to Keep a Dog Cool in a Car"
- No clickbait formulas: no "You Won't Believe," no numbers for their own sake
- Clear and literal: the title says exactly what the article covers

### Keywords
- The primary keyword phrase should appear naturally in the lede, one early h2, and the FAQ.
- Do not repeat it mechanically or stuff it.
- Write for the reader; the keyword naturally recurs because the topic naturally recurs.

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

## 6. Source and Citation Standards

- Named sources are preferred: "According to AKC," "AAHA notes," "per a study published in..."
- Do not cite a source you haven't verified. If unsure, hedge the claim plainly: "Most vets recommend..." is fine when it's consensus, but don't invent the endorsement.
- Do not use Wikipedia as a primary source.
- Specific figures add credibility: "85 °F on asphalt can reach 135 °F" is better than "asphalt gets very hot."
- If a claim is contested or depends on conditions, say so: "Most dogs, though individual tolerance varies."

---

## 7. Content Guardrails

These apply to every piece of copy on the site, but articles are where violations most often creep in.

| Do not write | Write instead |
|---|---|
| "vet-recommended" | "popular among dog owners" / "widely used" |
| "vet-approved" | omit, or cite an actual vet source |
| "we tested" / "in our testing" | "based on our research" / "we compared" |
| "proven to" | "designed to" / "intended to" |
| "clinically proven" | cite the actual study or remove the claim |
| "the best" as a superlative fact | "one of the most popular" / "a top-rated option" |
| "safe for all dogs" | "safe for most dogs" or name the exceptions |

Medical escalation: articles may describe symptoms and general first-response guidance, but must not replace veterinary advice. When covering health emergencies (heatstroke, seizure, severe anxiety), include a clear statement to contact a vet. Do not suggest dosages or medications.

---

## 8. Conversion Integration

Articles earn money through the `InternalLinkStrip` at the bottom and, when present, inline product cards. The editorial voice must not become a sales pitch — but it must create genuine motivation to click through.

**How to integrate conversion naturally:**
- Describe the product category in the prose at the moment it solves the problem being discussed. Not before; not after.
- Link to the converter page inline using tracked anchor links (see `keep-dog-cool-in-car.astro` for the `data-track` pattern).
- The `InternalLinkStrip` at the bottom aggregates those paths into clear next steps.

**What to avoid:**
- Sections that exist only to mention products ("And speaking of cooling, here are some products…")
- Forced transitions that break the editorial voice
- Affiliate disclosure language woven into article prose (the `Disclosure` component handles that; don't duplicate it)

The article's job is to be useful. A genuinely useful article earns the click. Trust the structure.

---

## 9. Quick Checklist

Before submitting or shipping an article collector:

- [ ] Page type declared: `collector · article`
- [ ] Added to `content-sitemap.astro`
- [ ] Added to `docs/system-definition.yaml`
- [ ] `Article` JSON-LD present with all required fields
- [ ] `Toc` module included (if 4+ h2 sections) with matching `id` attributes
- [ ] `FAQ` module included (minimum 3 questions)
- [ ] `InternalLinkStrip` at the bottom, linking to relevant converters
- [ ] `Disclosure` included if inline product cards are present
- [ ] No vet-authority language
- [ ] No "we tested" claims
- [ ] Lede is specific and doubles as the `description` meta
- [ ] Internal converter links use `data-track="collector_to_converter_click"`
- [ ] `bun run build` passes
