# PostHog Dashboard Setup Guide

Step-by-step guide to setting up PostHog dashboards, funnels, and actions for Chill Dogs.

## Prerequisites

- PostHog account with project `phc_sgfPdNSEEuSK8Q33eEverGmzIpmsQZYKuNCvLSUgj7K`
- Site deployed and sending events (verify on Activity → Live Events)

---

## Step 1: Define Actions

Actions are reusable event definitions you'll use across dashboards, funnels, and experiments.

Go to **Data Management → Actions → New Action**

### Action: "Amazon Outbound Click" (Keystone)

1. Click **New Action → From event or pageview**
2. Match group:
   - **Event name**: `amazon_outbound_click`
3. Name it: `Amazon Outbound Click`
4. Save

### Action: "Converter Page Visit"

This matches pageviews to your money pages (the pages with Buy on Amazon buttons).

1. Click **New Action → From event or pageview**
2. Match group:
   - **Event name**: `$pageview`
   - **Filter by properties → Add property filter**:
     - Property: `$current_url`
     - Operator: `matches regex`
     - Value: `/(cooling-mats|cooling-bandanas|cooling-vests|freezable-dog-toys|car-cooling-for-dogs|best-calming-products|best-thundershirt-alternatives|car-anxiety-for-dogs)/`
3. Name it: `Converter Page Visit`
4. Save

> **Why regex?** Your converter pages don't share a single URL prefix — they're spread across `/cooling/` and `/calming/`. The regex matches the slug portion of any converter page URL. Update this regex when you add new converter pages.

### Action: "Collector to Converter Click"

1. Click **New Action → From event or pageview**
2. Match group:
   - **Event name**: `collector_to_converter_click`
3. Name it: `Collector to Converter Click`
4. Save

### Action: "Hero CTA Click"

1. Click **New Action → From event or pageview**
2. Match group 1:
   - **Event name**: `hero_click_cooling`
3. Click **+ Add match group** (OR)
4. Match group 2:
   - **Event name**: `hero_click_calming`
5. Name it: `Hero CTA Click`
6. Save

---

## Step 2: Create the Revenue Funnel Dashboard

Go to **Dashboards → New Dashboard**. Name it **"Revenue Funnel"**.

### Insight 1: Core Funnel (Visit → Convert → Amazon)

1. Click **+ Add insight → Funnel**
2. Add these steps in order:
   - Step 1: `$pageview` (any pageview — this is top of funnel)
   - Step 2: Action `Converter Page Visit`
   - Step 3: `amazon_outbound_click`
3. Set time range to **Last 14 days**
4. Set **Breakdown** → `$current_url` to see which pages convert best
5. Name it: **"Core Revenue Funnel"**
6. Save to dashboard

### Insight 2: Amazon Clicks Over Time

1. Click **+ Add insight → Trends**
2. Series: `amazon_outbound_click`
3. Set to **Daily** or **Weekly** depending on traffic volume
4. Name it: **"Amazon Outbound Clicks"**
5. Save to dashboard

### Insight 3: Amazon Clicks by Product

1. Click **+ Add insight → Trends**
2. Series: `amazon_outbound_click`
3. **Breakdown by** → Event property → `product_name`
4. Name it: **"Amazon Clicks by Product"**
5. Save to dashboard

### Insight 4: Amazon Clicks by Page

1. Click **+ Add insight → Trends**
2. Series: `amazon_outbound_click`
3. **Breakdown by** → Event property → `page_slug`
4. Name it: **"Amazon Clicks by Page"**
5. Save to dashboard

### Insight 5: Collector → Converter Routing

1. Click **+ Add insight → Trends**
2. Series: `collector_to_converter_click`
3. **Breakdown by** → Event property → `to_page`
4. Name it: **"Internal Routing (Collector → Converter)"**
5. Save to dashboard

### Insight 6: Hero CTA Engagement

1. Click **+ Add insight → Trends**
2. Series 1: `hero_click_cooling`
3. Series 2: `hero_click_calming`
4. Name it: **"Hero CTA Clicks"**
5. Save to dashboard

### Insight 7: TOC Engagement

1. Click **+ Add insight → Trends**
2. Series: `toc_click`
3. **Breakdown by** → Event property → `target_anchor`
4. Name it: **"Table of Contents Clicks"**
5. Save to dashboard

---

## Step 3: Session Recording Filters

Go to **Session Recordings**. Create these saved filters:

### "Successful Converters"

Filter: Sessions where event `amazon_outbound_click` was performed

This shows you what successful visitors do — how they navigate, what they read, where they click.

### "Converter Page Drop-offs"

Filter:
- Sessions where event `$pageview` with `$current_url` matches regex `/(cooling-mats|cooling-bandanas|cooling-vests|freezable-dog-toys)/`
- AND where event `amazon_outbound_click` was NOT performed

This shows people who reached a money page but didn't click through to Amazon — look for friction, confusion, or missing information.

---

## Step 4: A/B Testing (Hero Experiments)

When ready to test hero variants with PostHog:

1. Go to **Experiments → New Experiment**
2. Name: "Homepage Hero Variant"
3. Feature flag key: `homepage-hero-variant`
4. Variants: `v1`, `v2`, `v3`, `v4`, `v5` (match your existing variants)
5. **Goal metric**: Action `Amazon Outbound Click`
6. **Secondary metric**: Action `Hero CTA Click`
7. Start experiment

Then in your code, use `posthog.getFeatureFlag('homepage-hero-variant')` to dynamically assign the variant instead of hardcoding `variant="v1"` in `index.astro`. This requires client-side JS — we can implement this when you're ready.

---

## Event Reference

All custom events currently tracked on the site:

| Event | Fired from | Properties |
|---|---|---|
| `hero_click_cooling` | HomepageHero CTA | `variant` |
| `hero_click_calming` | HomepageHero CTA | `variant` |
| `amazon_outbound_click` | Hero, ProductCard, ComparisonTable, BonusCallout, TopPicks | `page_slug`, `product_name`, `product_category`, `position`, `destination` |
| `collector_to_converter_click` | Hero, HubBody, SummaryBlock, RelatedGuides, PostCard, InternalLinkStrip, index.astro | `from_page`, `to_page`, `link_position` |
| `toc_click` | Toc | `page_slug`, `target_anchor` |

PostHog also auto-captures: `$pageview`, `$pageleave`, `$autocapture` (all clicks), Web Vitals, and session recordings.

---

## Converter Page URL Patterns

Update the regex in the "Converter Page Visit" action when adding new converter pages:

Current converter pages:
- `/cooling/cooling-mats/`
- `/cooling/cooling-bandanas/`
- `/cooling/cooling-vests/`
- `/cooling/freezable-dog-toys/`
- `/cooling/car-cooling-for-dogs/`
- `/calming/best-calming-products-for-anxious-dogs/`
- `/calming/best-thundershirt-alternatives/`
- `/calming/car-anxiety-for-dogs/`

---

## TODO

- [ ] Set up PostHog reverse proxy — managed proxy at `woof.chill-dogs.com` created but stuck "Erroring" (support ticket open, CNAME verified resolving to `363de8967e998f4c87e3.cf-prod-us-proxy.proxyhog.com`). Once resolved: update `api_host` to `https://woof.chill-dogs.com` and add `ui_host: 'https://us.posthog.com'` in `Analytics.astro`. Fallback: Cloudflare Worker proxy.
- [x] Updated PostHog snippet loader to latest version (March 2026)
- [ ] Implement feature flag–driven hero experiments (replace hardcoded variants)
