---
title: Converter Page Writing Guide
type: canonical
domain: writing
status: active
updated: 2026-06-10
tags:
  - chill-dogs
  - writing
  - converter
  - product-copy
  - content-guardrails
related:
  - product-copy-rules.md
  - article-writing-guide.md
  - ../strategy/metrics-and-page-types.md
  - ../checklists/converter-page-checklist.md
---

# Converter Page Writing Guide

Defines the copy structure, length constraints, and anti-repetition rules for converter pages on chill-dogs.com.

## Use this when

Writing or reviewing any converter page — product comparison pages, best-of lists, category roundups.

---

## 1. What a converter page is

A converter page has one job: get a qualified visitor to click an affiliate link. Every copy decision should serve that goal. The tone and language rules from [`article-writing-guide.md`](article-writing-guide.md) apply here too — measured, practical, peer-level. See that file for voice, sentence style, and what sounds wrong.

---

## 2. Page-level structure

```
1. Hero / intro blurb   (2–3 sentences)
2. Product entries       (one per product)
3. FAQ                  (optional; 3–5 questions)
4. InternalLinkStrip    (links to related converters/collectors)
```

---

## 3. Intro / header copy

The intro block at the top of the page gets **2–3 sentences**. It should:

- Say who this page is for and what it covers
- State any shared context that applies to all products — say it here, not in every product entry
- Not repeat the H1 verbatim

Example: if every cooling mat on the page works best on hard floors, say that in the intro. Do not repeat it in each product description.

---

## 4. Per-product copy

### Length: 2–4 sentences per product

This is a firm target, not a floor. One well-chosen sentence that nails the differentiator is better than four sentences that pad.

### What to write

The four topics from [`product-copy-rules.md`](product-copy-rules.md) — category fit, use case, tradeoffs, buyer context — are a **mental checklist**, not a four-paragraph structure. For each product, pick the **1–2 points that are most differentiating** and write only those.

Ask: what makes this product different from the others on this page? Write that. Skip anything that is true of every product on the page.

### What to avoid

- **Re-introductions.** Do not re-explain what the product category does in each entry. The intro covered it.
- **Shared context repeated per product.** If a trait applies to all products, it belongs in the intro, not each entry.
- **Covering all four topics every time.** Most products only need 1–2 points. A third or fourth point is only worth adding if it is genuinely differentiating.
- **Padding.** "This is a great option for dog owners who want..." adds no information. State the specific fit directly.

---

## 5. Preserve existing product copy

Product copy written into canonical data files (`src/data/products/`) is the **source of truth**. Render it as-is — do not rewrite or summarize it when building a converter page.

Where a product has page-specific copy overrides (set in the data or page config), preserve those overrides exactly as written. Do not normalize them to match other products on the same page.

The brevity rules in this guide apply when writing **new** copy during page creation, not to copy that has already been edited and committed to the data files.

---

## 6. FAQ

- 3–5 questions
- Questions must come from real search patterns — not invented to pad
- Each answer: **2–3 sentences**
- Do not repeat information the product entries already covered in full

---

## 7. Anti-repetition checklist

Before finishing a converter page, scan for:

- [ ] Does the intro cover shared context (so product entries don't have to)?
- [ ] Does any product entry re-explain what the product category does?
- [ ] Does any phrase appear in more than one product entry with minor variation?
- [ ] Are any product entries longer than 4 sentences?
- [ ] Do FAQ answers repeat what product entries already said?

---

## Related knowledge

- [`product-copy-rules.md`](product-copy-rules.md) — Language rules: no fake testing, no vet claims, no urgency; the 4-topic checklist
- [`article-writing-guide.md`](article-writing-guide.md) — Voice, tone, and style rules that apply site-wide
- [`../strategy/metrics-and-page-types.md`](../strategy/metrics-and-page-types.md) — Converter type definition and required behavior
- [`../checklists/converter-page-checklist.md`](../checklists/converter-page-checklist.md) — Publishing gate
- [`../affiliate/product-data-rules.md`](../affiliate/product-data-rules.md) — Where product data and copy live
