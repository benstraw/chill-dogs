---
title: Environment and Integrations
type: canonical
domain: engineering
status: active
updated: 2026-10-05
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

## The three independent requirements

Every integration script needs **all three**:

1. **Credentials** — environment variables (below).
2. **Network egress** — sandboxed agent containers only reach hosts on the environment's allowlist. A blocked host returns `403 CONNECT tunnel failed` from the agent proxy, which surfaces as a generic fetch failure inside the script.
3. **An HTTP client that works through the proxy** — see below. Bun's `fetch` used to fail here; it works on current Bun, and the session-start hook probes it each session.

These fail independently and look alike from inside a script. Check all three before assuming a key is wrong.

### Bun's fetch and the agent proxy

In Claude Code web containers, egress goes through a local CONNECT proxy (`HTTPS_PROXY=http://127.0.0.1:<port>`) that re-terminates TLS with its own CA.

**Current state (bun 1.3.14, verified 2026-10-05): Bun's `fetch` works through the proxy.** A `HEAD` from Bun got an HTTP response from all six integration hosts below, and `bun run check:asins` fetched real `www.amazon.com` pages in-container. Amazon answered most requests with a CAPTCHA, so expect largely inconclusive results there, as on shared CI runners. The Bun-run scripts (`check:asins`, `fetch:chewy`, `chewy-link`, `scripts/fetch-amazon-data.ts`) can make network calls in a proxied container once their credentials are set and their hosts are allowlisted.

History: on bun 1.3.11, Bun's `fetch` opened the tunnel and then failed the TLS handshake inside it (`200 Connection Established`, then `ECONNRESET  The socket connection was closed unexpectedly.`), with the env proxy, an explicit `proxy:` option, and an explicit `tls: { ca }` alike, while `curl` and Node's fetch succeeded. If that regresses:

- The session-start hook catches it. It probes Bun's `fetch` against a host `curl` already reached, and marks the Bun scripts `no-proxy` only when that probe fails.
- Fall back to `.github/workflows/integration-checks.yml`, whose runners have unrestricted egress.
- Do not "fix" it by disabling TLS verification, and do not port the scripts off Bun. Node cannot run them as-is: type stripping works, but the extensionless relative imports fail with `ERR_MODULE_NOT_FOUND`.

`indexnow:submit` and the build's submit step run under `node` and have always worked in-container once `INDEXNOW_KEY` is set.

---

## Script requirements

"Runtime" is the HTTP client the network calls go through. It matters only if the Bun proxy problem above regresses.

| Command | Env vars | Outbound host | Runtime |
|---|---|---|---|
| `bun run dev` | none (PostHog silent without `PUBLIC_POSTHOG_KEY`) | none | — |
| `bun run build` | `PUBLIC_SITE_URL`; `INDEXNOW_KEY` for the final submit step | `api.indexnow.org` (submit step only; self-skips unless `VERCEL_ENV=production`) | node |
| `bun run test` / `test:smoke` / `test:coverage` | none | none | — |
| `bun run check:amazon` | none | none — reads the local cache only | — |
| `bun run check:asins` | none | `www.amazon.com` | **bun** |
| `bun run check:ai-docs` | none | none | — |
| `bun run admin:serve` | none | none — binds 127.0.0.1:4322, writes the repo | — |
| `bun run indexnow:submit` | `INDEXNOW_KEY` | `api.indexnow.org` | node |
| `bun run fetch:chewy` | `IMPACT_ACCOUNT_SID`, Impact auth (see below), `CHEWY_IMPACT_CAMPAIGN_ID`, optional `CHEWY_IMPACT_CATALOG_ID` | `api.impact.com` | **bun** |
| `bun run chewy-link` | `IMPACT_ACCOUNT_SID`, Impact auth (see below), `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID` (or `CHEWY_IMPACT_BASE_URL` to skip the API) | `api.impact.com`, `www.chewy.com` | **bun** |
| `scripts/fetch-amazon-data.ts` | `SERP_API_KEY` (preferred) or `SEARCHAPI_KEY` (backup) | `serpapi.com` or `www.searchapi.io` | **bun** |

Rows marked **bun** depend on Bun's `fetch` working through the agent proxy. It does on current Bun; if the session-start hook reports them `no-proxy`, run them in GitHub Actions.

### Impact auth

Impact's API uses HTTP Basic auth: the Account SID is the username and the Auth Token is the password. `src/lib/affiliate/impact.ts` accepts it in either of two forms:

| Where | How auth is supplied |
|---|---|
| Local dev | `IMPACT_AUTH_TOKEN` in `.env`. The client sends the `Authorization` header itself. |
| GitHub Actions | `IMPACT_AUTH_TOKEN` from repository secrets, same as local. |
| Claude Code on the web | An **API credential** on the environment: type **Basic**, username = Account SID, password = Auth Token, allowed website `api.impact.com`. The agent proxy adds the header, so the token never enters the container. Leave `IMPACT_AUTH_TOKEN` unset there. |

When `IMPACT_AUTH_TOKEN` is unset the client sends no `Authorization` header, so the proxy's credential applies. It only treats a missing token as configured when `HTTPS_PROXY` is set. Without a proxy, a missing token still means "not configured", and `chewy-link` falls back to `CHEWY_IMPACT_BASE_URL` as before. If a tokenless request gets a 401, the error says no credentials were sent.

`IMPACT_ACCOUNT_SID`, `CHEWY_IMPACT_CAMPAIGN_ID` and `CHEWY_IMPACT_AD_ID` stay plain environment variables in every setup: they are identifiers, not secrets, and the SID is part of every request path. `CHEWY_IMPACT_AD_ID` is the middle number of the program's tracking link (`chewy.sjv.io/c/<partner>/<ad>/<campaign>`, currently `2846786`). Do not confuse it with the catalog ID (`24727`), which `/Ads/<id>/TrackingLink` answers with a 404.

`www.chewy.com` appears in the allowlist only because `chewy-link` resolves canonical product URLs against it.
**Chewy product pages themselves are behind Kasada bot protection and return `429` to every automated client**
(`WebFetch`, `curl`, headless and in-app browsers), on a local machine as much as in a container. Never source
Chewy product titles, images, or bullets by fetching a `/dp/` page — use the Impact catalog via `fetch:chewy`.
See [`../affiliate/product-data-rules.md`](../affiliate/product-data-rules.md#chewy-impact-workflow).

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

## The admin gallery writer (`bun run admin:serve`)

`/admin/images/` is a static page. It can read the Amazon cache at build time but has no
way to write back — the site is `output: 'static'` with no adapter, so adding an Astro API
route would fail `astro build`. `scripts/admin-image-server.ts` is the writer, run as a
separate process:

```bash
bun run admin:serve   # 127.0.0.1:4322 — the writer
bun run dev           # localhost:4321 — the site
```

The page probes `GET /health` on load and shows which mode it is in:

- **reachable** → the Save button writes `src/data/product-galleries.ts`
- **not reachable** → falls back to copying a paste-ready snippet, which is the only
  behaviour available in production, where the admin pages sit behind GitHub sign-in on a
  static build with no repository to write to

It needs no keys and makes no outbound calls, so it works in a proxied container. It does
have write access to the repository, so it binds to loopback only, requires a localhost
`Origin`, and rejects any payload whose `productId` is not a real catalog product or whose
image URLs are not https on a known merchant CDN. Do not expose it off your machine.

Saves rewrite the whole gallery file rather than patching it, so formatting is normalised
on every save and a save for one product cannot corrupt another's entry.

---

## Where each environment gets configured

### Local dev

Copy `.env.example` to `.env` and fill in what you need. `.env` is gitignored. Astro reads it through Vite; the CLI scripts read `process.env`.

### Claude Code on the web

Configured on the environment, not in the repo:

- **Environment variables** — Environment settings → Environment variables. These are visible to anyone using the environment, so keep tokens out of them where an API credential can carry them instead (see [Impact auth](#impact-auth)). Never put secrets in `.env.example` or a committed file.
- **API credentials** — Environment settings → API credentials. The agent proxy adds the credential to requests for the allowed hosts, and sessions never see the value. Impact's token lives here.
- **Network allowlist** — Environment settings → Network access. Without the hosts above, `check:asins`, `fetch:chewy`, `chewy-link`, and the SerpAPI fetch cannot run regardless of credentials.

`.claude/hooks/session-start.sh` runs on session start and:

1. Runs `bun install` (`node_modules` is not committed).
2. Writes `.env` from whichever of those variables the environment supplies, so `import.meta.env` and `process.env` agree.
3. Runs `bun run build` to warm `dist/`, so `bunx vitest run` works immediately — the `seo-meta` test reads `dist/`.
4. Probes every outbound host in parallel with `curl`, probes Bun's `fetch` once through the proxy, then prints one readiness line per integration script.

Set `CHILL_DOGS_SKIP_BUILD=true` to skip step 3.

The readiness line reports the first blocker it finds, so fix them in the order printed:

| Label | Meaning | Fix |
|---|---|---|
| `ready` | runnable right now. The Impact scripts add `(auth: token)` or `(auth: proxy-credential)` | — |
| `no-keys` | env vars unset, or no Impact auth (no `IMPACT_AUTH_TOKEN`, and an unauthenticated probe of `api.impact.com` did not return 200) | add the env vars, or the Impact API credential (see [Impact auth](#impact-auth)) |
| `blocked` | host off the allowlist (`curl` cannot open the tunnel) | add the host under Environment settings → Network access |
| `no-proxy` | keys and host fine, but the hook's Bun `fetch` probe failed (the bun 1.3.11 regression is back) | run it in GitHub Actions; see the Bun section above |

### GitHub Actions

- `.github/workflows/ci.yml` — build, test, and `check:ai-docs` on every push to `main` and every PR.
- `.github/workflows/integration-checks.yml` — weekly (and `workflow_dispatch`) run of `check:asins`, `check:amazon --fail-on-stale`, and `chewy-link:verify`.
- `.github/workflows/posthog-deploy-annotation.yml` — on a successful Vercel `Production` `deployment_status`, creates a PostHog annotation (deduped per commit SHA) so deploys show up on charts. Needs secret `POSTHOG_CI_API_KEY` (a personal API key with annotation write scope); optional variables `POSTHOG_PROJECT_ID` (defaults to chill-dogs project 328578) and `POSTHOG_HOST` (defaults to `https://us.posthog.com` — not the `woof.chill-dogs.com` ingest proxy). It self-skips with a notice when unconfigured and never blocks the deploy.

The three checks run under `continue-on-error` so one failure cannot suppress the others, and a final gate step fails the job on any of their outcomes. On failure the workflow files a `merchant-check` issue assigned to `benstraw`, or comments on the open one if it already exists — a long-lived dead link produces one issue with a comment per week, not a new issue every Monday. Close the issue once fixed; the next failure opens a fresh one. Reports upload as artifacts (`merchant-check-reports`, 90 days) and per-check outcomes land in the job summary.

Note: GitHub disables scheduled workflows after 60 days without repository activity. On a quiet stretch this check stops running rather than failing, which looks identical to passing — re-enable it from the Actions tab.

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
