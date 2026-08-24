---
title: Environment and Integrations
type: canonical
domain: engineering
status: active
updated: 2026-08-24
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
3. **An HTTP client that works through the proxy** — see below. In a proxied container this rules out every Bun-run script regardless of 1 and 2.

These fail independently and look alike from inside a script. Check all three before assuming a key is wrong.

### Bun's fetch does not work through the agent proxy

In Claude Code web containers, egress goes through a local CONNECT proxy (`HTTPS_PROXY=http://127.0.0.1:<port>`) that re-terminates TLS with its own CA. Bun's `fetch` opens the tunnel and then fails the TLS handshake inside it:

```
< 200 Connection Established
FAIL ECONNRESET  The socket connection was closed unexpectedly.
```

Verified on bun 1.3.11 against multiple allowlisted hosts, with the env proxy, with an explicit `proxy:` option, and with an explicit `tls: { ca }` pointed at the bundle — all four fail identically. The proxy logs no relay failure, so this is Bun's side, not a blocked host. Same requests succeed from `curl`, and from Node's fetch with `NODE_USE_ENV_PROXY=1` (Node >= 22.21).

Consequences:

- `check:asins`, `fetch:chewy`, `chewy-link`, and `scripts/fetch-amazon-data.ts` all run under `bun run` and therefore **cannot make network calls in a proxied container**, even with credentials set and hosts allowlisted. Run them via `.github/workflows/integration-checks.yml` instead.
- `indexnow:submit` and the build's submit step run under `node`, so they work in-container once `INDEXNOW_KEY` is set.
- Do not "fix" this by disabling TLS verification. Porting the scripts off Bun is not worth it either — Node cannot run them as-is (its type stripping works, but the extensionless relative imports fail `ERR_MODULE_NOT_FOUND`), so it would mean adding a TS loader dependency to work around a bug in one container.

---

## Script requirements

"Runtime" is the HTTP client the network calls go through, which decides whether the script works in a proxied container (see above).

| Command | Env vars | Outbound host | Runtime |
|---|---|---|---|
| `bun run dev` | none (PostHog silent without `PUBLIC_POSTHOG_KEY`) | none | — |
| `bun run build` | `PUBLIC_SITE_URL`; `INDEXNOW_KEY` for the final submit step | `api.indexnow.org` (submit step only; self-skips unless `VERCEL_ENV=production`) | node |
| `bun run test` / `test:smoke` / `test:coverage` | none | none | — |
| `bun run check:amazon` | none | none — reads the local cache only | — |
| `bun run check:asins` | none | `www.amazon.com` | **bun** |
| `bun run check:ai-docs` | none | none | — |
| `bun run indexnow:submit` | `INDEXNOW_KEY` | `api.indexnow.org` | node |
| `bun run fetch:chewy` | `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, optional `CHEWY_IMPACT_CATALOG_ID` | `api.impact.com` | **bun** |
| `bun run chewy-link` | `IMPACT_ACCOUNT_SID`, `IMPACT_AUTH_TOKEN`, `CHEWY_IMPACT_CAMPAIGN_ID`, `CHEWY_IMPACT_AD_ID` (or `CHEWY_IMPACT_BASE_URL` to skip the API) | `api.impact.com`, `www.chewy.com` | **bun** |
| `scripts/fetch-amazon-data.ts` | `SERP_API_KEY` (preferred) or `SEARCHAPI_KEY` (backup) | `serpapi.com` or `www.searchapi.io` | **bun** |

Rows marked **bun** cannot reach the network from a proxied agent container. Run them in GitHub Actions.

The full allowlist for a container that should run everything:

```
www.amazon.com
serpapi.com
www.searchapi.io
api.impact.com
www.chewy.com
api.indexnow.org
```

Add `mcp.impact.com` as well if the container should reach the impact.com MCP server (below). No script needs it — only the Claude Code connection does.

---

## impact.com MCP server

Registered in `.mcp.json` at project scope, so it travels with the repo:

```json
{
  "mcpServers": {
    "impact": {
      "type": "http",
      "url": "https://mcp.impact.com/mcp"
    }
  }
}
```

This is impact.com's own cloud-hosted server, and it is a **read/write connection to the live partner account** — the same account the Chewy commissions run through. Treat it accordingly.

Unlike everything else on this page it takes no environment variables. Auth is OAuth 2.1, negotiated by the MCP client at connect time, and the token is scoped to the impact.com user permissions of whoever authorizes it. Credentials never enter the repo, `.env`, or the model's context, so `IMPACT_ACCOUNT_SID` / `IMPACT_AUTH_TOKEN` are irrelevant here — those stay for the Bun scripts.

Two things gate the connection, both outside the repo:

1. **An account admin enables MCP** at impact.com → User Profile → Settings → Tools → MCP. Off by default.
2. **Each client authorizes once** in a browser. Every LLM client gets its own revocable token, so Claude Code, Cursor, and ChatGPT each authorize separately and revoke separately.

First use of a project-scoped server prompts for approval — expected, and it is per-developer.

### It does not work in a sandboxed agent container

Two independent blockers, and neither has a workaround from inside the container:

- `mcp.impact.com` is not on the default egress allowlist, so the CONNECT fails with 403.
- The OAuth handshake needs a browser that can complete a redirect.

Authorize on a local machine. Adding the host to Environment settings → Network access clears the first blocker but not the second.

### Not the same as the npm package

Searching for this turns up a third-party `impact-mcp-server` package that runs locally over stdio and reads `IMPACT_ACCOUNT_SID` / `IMPACT_AUTH_TOKEN`. Unaffiliated with impact.com and not what `.mcp.json` points at.

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
4. Probes every outbound host in parallel with `curl`, then prints one readiness line per integration script.

Set `CHILL_DOGS_SKIP_BUILD=true` to skip step 3.

The readiness line reports the first blocker it finds, so fix them in the order printed:

| Label | Meaning | Fix |
|---|---|---|
| `ready` | runnable right now | — |
| `no-keys` | env vars unset | add them under Environment settings → Environment variables |
| `blocked` | host off the allowlist (`curl` cannot open the tunnel) | add the host under Environment settings → Network access |
| `no-proxy` | keys and host fine, but the script runs under Bun | run it in GitHub Actions; see the Bun section above |

### GitHub Actions

- `.github/workflows/ci.yml` — build, test, and `check:ai-docs` on every push to `main` and every PR.
- `.github/workflows/integration-checks.yml` — weekly (and `workflow_dispatch`) run of `check:asins`, `check:amazon --fail-on-stale`, and `chewy-link:verify`.

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
