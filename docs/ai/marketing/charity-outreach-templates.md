---
title: Charity Outreach Email Templates
type: canonical
domain: marketing
status: active
updated: 2026-08-19
tags:
  - chill-dogs
  - charities
  - outreach
  - email
  - templates
  - marketing
related:
  - charity-outreach-program.md
  - newsletter-guide.md
  - utm-rules.md
  - ../writing/medical-and-vet-claim-guardrails.md
---

# Charity Outreach Email Templates

Copy templates for the three-touch charity outreach sequence, plus ready-to-send week 1 drafts.

## Use this when

Writing or sending any charity outreach email. The sequence and schedule these fit into live in [`charity-outreach-program.md`](charity-outreach-program.md).

---

## Before sending

- **Plain text, not HTML.** These go person-to-person, not as a broadcast. No header image, no branded template, no tracking pixel.
- **Short.** Touch 1 should be readable in under a minute. Charity inboxes are busy and mostly full of asks.
- **Personalize the specific-detail line.** Every template has one. A message that could have been sent to any of the nine reads as a mail merge, which defeats the point of the program.
- **Send from a real person's address**, not `info@` or `noreply@`. Sign with a real name.
- **No vet-authority language** — see [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md).
- **Never offer or imply paid placement**, and never make the listing conditional on a link or a share.

### Placeholders

| Placeholder | Meaning |
|---|---|
| `{{CHARITY}}` | Organization name, matching the heading on `/shelter-dog-charities/` |
| `{{CONTACT_NAME}}` | Named person if known; otherwise rework the greeting, do not write "Dear Sir or Madam" |
| `{{SPECIFIC_DETAIL}}` | One true, concrete thing about their work — drawn from their own listing |
| `{{SENDER_NAME}}` | Real sender name |
| `{{NEWSLETTER_ARCHIVE_URL}}` | Buttondown archive URL for the published issue |

### Link and UTM conventions

Production URLs only. UTM-tag every link so referral traffic from outreach is attributable — format rules in [`utm-rules.md`](utm-rules.md).

| Touch | Link |
|---|---|
| 1 — Introduction | `https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-intro` |
| 2 — Pre-publication | Same charity page link, `utm_campaign=charity-spotlight` |
| 3 — Follow-up | `{{NEWSLETTER_ARCHIVE_URL}}` plus the charity page link with `utm_campaign=charity-spotlight` |

Do not put Amazon affiliate links in any outreach email.

---

## Template 1 — Introduction

**Goal:** establish contact and hand them something useful. **No ask.**

**Subject:** `{{CHARITY}} is featured on Chill-Dogs`

```
Hi {{CONTACT_NAME}},

I run Chill-Dogs, a small site about dog cooling, calming, comfort, and
travel gear. We keep a page of dog charities we think are worth knowing
about, and {{CHARITY}} is on it.

{{SPECIFIC_DETAIL}}

You can see the listing here:
https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-intro

Two things worth saying plainly: the listing is editorial, so nobody paid
for it and nothing is expected in return. And if anything there is wrong or
out of date, send me a correction and I will fix it.

We also feature one of these organizations in our newsletter from time to
time. If that ends up being you, I will get in touch first rather than
writing about you without asking.

Thanks for the work you do.

{{SENDER_NAME}}
Chill-Dogs
```

**Do not** add a request for a link, a share, or a mention. That is what makes touch 3 work later.

---

## Template 2 — Pre-publication check-in

**Goal:** get current material before the spotlight publishes.

**Subject:** `Featuring {{CHARITY}} in the next Chill-Dogs newsletter`

```
Hi {{CONTACT_NAME}},

{{CHARITY}} is scheduled for the next Chill-Dogs newsletter, going out
{{DATE}}.

Before I write it, is there anything current you would want readers to
know about? A campaign, a donation page, an event, a volunteer need — if
there is something specific you are pushing right now, I would rather
point people at that than at your homepage.

Also a good moment to flag anything on your listing that needs updating.

No rush, and no problem if you would rather I just write from what is
public.

{{SENDER_NAME}}
Chill-Dogs
```

If they do not reply, publish from public information. The check-in is a courtesy, not a dependency — do not let silence block the issue.

---

## Template 3 — Published feature follow-up

**Goal:** deliver the published piece and make sharing easy. This is the **only** touch that mentions sharing, and it stays casual.

**Subject:** `{{CHARITY}} in this week's Chill-Dogs newsletter`

```
Hi {{CONTACT_NAME}},

The newsletter featuring {{CHARITY}} went out this morning. Here it is:

{{NEWSLETTER_ARCHIVE_URL}}

Your listing is also live here:
https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-spotlight

Feel free to share it with your supporters or add it to your press or news
page if that is useful to you. No obligation at all — it is yours to use
or ignore.

If you ever have news worth covering, my inbox is open.

{{SENDER_NAME}}
Chill-Dogs
```

Record any resulting social mention, newsletter mention, or backlink in the tracker.

---

## Week 1 drafts

Ready to send once `{{CONTACT_NAME}}` and `{{SENDER_NAME}}` are filled in. The specific-detail line in each is drawn from that organization's own listing on `/shelter-dog-charities/` — if the listing changes, change these too.

### 15 out of 10 Foundation

**Subject:** `15 out of 10 Foundation is featured on Chill-Dogs`

```
Hi {{CONTACT_NAME}},

I run Chill-Dogs, a small site about dog cooling, calming, comfort, and
travel gear. We keep a page of dog charities we think are worth knowing
about, and the 15 out of 10 Foundation is on it.

What made us include you is the part of the mission most groups avoid:
sponsoring dogs with behavioral or medical issues who are unlikely to get
out of the shelter otherwise. Doug's story is the clearest version of why
that gap needs filling.

You can see the listing here:
https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-intro

Two things worth saying plainly: the listing is editorial, so nobody paid
for it and nothing is expected in return. And if anything there is wrong or
out of date, send me a correction and I will fix it.

We also feature one of these organizations in our newsletter from time to
time. If that ends up being you, I will get in touch first rather than
writing about you without asking.

Thanks for the work you do.

{{SENDER_NAME}}
Chill-Dogs
```

### Cuddly

**Subject:** `Cuddly is featured on Chill-Dogs`

```
Hi {{CONTACT_NAME}},

I run Chill-Dogs, a small site about dog cooling, calming, comfort, and
travel gear. We keep a page of organizations we think dog owners should
know about, and Cuddly is on it.

We included you for the verification side specifically — requiring partner
rescues to be confirmed 501(c)(3)s is the thing that makes a fundraising
platform worth recommending to readers, and it is not the norm.

You can see the listing here:
https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-intro

Two things worth saying plainly: the listing is editorial, so nobody paid
for it and nothing is expected in return. And if anything there is wrong or
out of date, send me a correction and I will fix it.

We also feature one of these organizations in our newsletter from time to
time. If that ends up being you, I will get in touch first rather than
writing about you without asking.

Thanks for the work you do.

{{SENDER_NAME}}
Chill-Dogs
```

**Note:** Cuddly is a fundraising platform, not a rescue. The listing and any outreach should describe it that way. If it is ever the newsletter spotlight, the story is likely a partner rescue's campaign rather than Cuddly itself.

### Every Bark Counts

**Subject:** `Every Bark Counts is featured on Chill-Dogs`

```
Hi {{CONTACT_NAME}},

I run Chill-Dogs, a small site about dog cooling, calming, comfort, and
travel gear. We keep a page of dog charities we think are worth knowing
about, and Every Bark Counts is on it.

The focus on rural shelters is why. They get the least support and the
least attention, and choosing them deliberately says more about an
organization than its fundraising total does.

You can see the listing here:
https://www.chill-dogs.com/shelter-dog-charities/?utm_source=charity-outreach&utm_medium=email&utm_campaign=charity-intro

Two things worth saying plainly: the listing is editorial, so nobody paid
for it and nothing is expected in return. And if anything there is wrong or
out of date, send me a correction and I will fix it.

We also feature one of these organizations in our newsletter from time to
time. If that ends up being you, I will get in touch first rather than
writing about you without asking.

Thanks for the work you do.

{{SENDER_NAME}}
Chill-Dogs
```

**Note:** Every Bark Counts was founded by Austin Testa when he was 12. Confirm his current age before sending. If he is still a minor, route outreach through the organization's general or parent/guardian contact rather than to him directly, and do not publish new photos or personal detail about him without documented adult consent.

---

## What not to send

- An ask for a backlink in touch 1
- "We'd love to partner with you" — vague, and reads as a pitch
- Anything implying the listing is paid, sponsored, or conditional
- Vet-authority claims about products or care
- Amazon affiliate links
- HTML newsletter templates or tracking pixels
- The same specific-detail line reused across two charities

---

## Related knowledge

- [`charity-outreach-program.md`](charity-outreach-program.md) — Sequence, schedule, tracker, success measures
- [`newsletter-guide.md`](newsletter-guide.md) — Format and voice for the spotlight issue itself
- [`utm-rules.md`](utm-rules.md) — UTM parameter format
- [`../writing/medical-and-vet-claim-guardrails.md`](../writing/medical-and-vet-claim-guardrails.md) — Claim guardrails for outreach copy
- [`../checklists/marketing-publish-checklist.md`](../checklists/marketing-publish-checklist.md) — Publish gate for listing corrections
