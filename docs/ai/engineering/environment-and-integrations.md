---
title: Environment and Integrations
type: canonical
domain: engineering
status: active
updated: 2026-08-09
tags:
  - chill-dogs
  - engineering
  - environment
  - secrets
  - integrations
  - ci
related:
  - build-and-test-commands.md
  - architecture.md
  - ../checklists/coding-agent-finish-checklist.md
---

# Environment and Integrations

Which environment variables and which outbound hosts each script needs, and where those get configured for local dev, Claude Code on the web, CI, and Vercel.

## Use this when

A script fails with a missing-key error or a network error, you are setting up a fresh environment, or you need to know whether a check can run in the current container at all.

---

## The two independent requirements

Every integration script needs **both**:

1. **Credentials** — environment variables (below).
2. **Network egress** — sandboxed agent containers only reach hosts on the environment's allowlist. A blocked host returns `403 CONNECT tunnel failed` from the agent proxy, which surfaces as a generic fetch failure inside the script.

A script with valid keys still fails if its host is not allowlisted. Check the host before assuming the key is wrong.

---

## Script requirements

| Command | Env vars | Outbound host |
|---|---|---|
| `bun run dev` | none (PostHog silent without `PUBLIC_POSTHOG_KEY`) | none |
| `bun run build` | `PUBLIC_SITE_URL`; `INDEXNOW_KEY` for the final submit step | `api.indexnow.org` (submit step only; self-skips unless `VERCEL_ENV=production`) |
| `bun run test` / `test:smoke` / `test:coverage` | none | none |
| `bun run check:amazon` | none | none — reads the local cache only |
| `bun run check:asins` | none | `www.amazon.com` |
| `bun run check:ai-docs` | none | none |
| `bun run indexnow:submit` | `INDEXNOW_KEY` | `api.indexnow.org` |
| `bun run fetch:chewy` | `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, optional `CHEWY_IMPACT_CATALOG_ID` | `api.impact.com` |
| `bun run chewy-link` | `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID` (or `CHEWY_IMPACT_BASE_URL` to skip the API) | `api.impact.com`, `www.chewy.com` |
| `scripts/fetch-amazon-data.ts` | `SERP_API_KEY` (preferred) or `SEARCHAPI_KEY` (backup) | `serpapi.com` or `www.searchapi.io` |

The full allowlist for a container that should run everything:

```
www.amazon.com
serpapi.com
www.searchapi.io
api.impact.com
www.chewy.com
api.indexnow.org
```

---

## Where each environment gets configured

### Local dev

Copy `.env.example` to `.env` and fill in what you need. `.env` is gitignored. Astro reads it through Vite; the CLI scripts read `process.env`.

### Claude Code on the web

Configured on the environment, not in the repo:

- **Environment variables** — Environment settings → Environment variables. Secrets belong here, never in `.env.example` or a committed file.
- **Network allowlist** — Environment settings → Network access. Without the hosts above, `check:asins`, `fetch:chewy`, `chewy-link`, and the SerpAPI fetch cannot run regardless of credentials.

`.claude/hooks/session-start.sh` runs on session start and:

1. Runs `bun install` (`node_modules` is not committed).
2. Writes `.env` from whichever of those variables the environment supplies, so `import.meta.env` and `process.env` agree.
3. Runs `bun run build` to warm `dist/`, so `bunx vitest run` works immediately — the `seo-meta` test reads `dist/`.
4. Prints a readiness line per integration script naming any missing variables.

Set `CHILL_DOGS_SKIP_BUILD=true` to skip step 3.

### GitHub Actions

- `.github/workflows/ci.yml` — build, test, and `check:ai-docs` on every push to `main` and every PR.
- `.github/workflows/integration-checks.yml` — weekly (and `workflow_dispatch`) run of `check:asins`, `check:amazon --fail-on-stale`, and `chewy-link:verify`.

Runners have unrestricted egress, which makes Actions the reliable home for the network-dependent merchant checks when the agent container's allowlist does not cover them. Impact credentials come from repository secrets (`IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID`); the Chewy step self-skips when they are absent.

### Vercel

Project Settings → Environment Variables. `INDEXNOW_KEY` and `PUBLIC_SITE_URL` are the ones the production build depends on. See the Deploy section of `README.md` for the IndexNow key-file setup.

---

## Public vs. private variables

`PUBLIC_`-prefixed variables are inlined into the client bundle by Astro and are visible to anyone viewing the site — correct for the PostHog project key, the Pinterest tag ID, and the Buttondown form action. Everything else (`SERP_API_KEY`, `SEARCHAPI_KEY`, `IMPACT_AUTH_TOKEN`, `INDEXNOW_KEY`) is build-time only and must never gain a `PUBLIC_` prefix.

---

## Related knowledge

- [`build-and-test-commands.md`](build-and-test-commands.md) — What each command does and when to run it
- [`architecture.md`](architecture.md) — Build pipeline phases and file structure
- [`../checklists/coding-agent-finish-checklist.md`](../checklists/coding-agent-finish-checklist.md) — Which checks to run before finishing
