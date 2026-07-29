---
name: verify
description: Build, serve, and visually verify the Chill-Dogs static site with Playwright screenshots.
---

# Verifying Chill-Dogs changes

Static Astro site — the surface is the built HTML served over HTTP.

## Build and serve

```bash
bun install            # fresh containers have no node_modules
bun run build          # outputs dist/ (prebuild generates OG images)
bunx serve dist -l 4321 &   # bun run preview also works
```

## Drive with Playwright

Playwright is installed globally at `/opt/node22/lib/node_modules/playwright/index.mjs`
(NOT in project node_modules). Chromium lives at `/opt/pw-browsers/chromium`:

```js
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', headless: true });
```

Screenshot at 1440px (desktop), 900px (tablet breakpoint at 1024px), and 390px
(mobile breakpoint at 640px). Check `document.documentElement.scrollWidth >
clientWidth` for horizontal overflow on mobile.

## Gotchas

- Remote product images (`m.media-amazon.com`) fail with ERR_TUNNEL_CONNECTION_FAILED
  in the sandboxed browser — expected, not a bug. They load in production and are the
  same images used on converter pages.
- Outbound affiliate clicks land on `chrome-error://` for the same reason; verify the
  `href` (must contain `tag=chill-dogs-20`) and `target="_blank"` from the DOM instead.
- Analytics: links carry `data-track` attributes read by a global click listener
  (src/scripts/analytics.ts); PostHog won't fire without a dev key, so verify the
  data attributes in the DOM rather than network events.
