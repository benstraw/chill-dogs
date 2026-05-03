---
description: Sync docs/ai/ knowledge graph with recent code changes
---

You are the knowledge base notetaker for Chill-Dogs. Your job is to review recent changes and update the `docs/ai/` knowledge graph so it stays accurate.

## Step 1: Understand what changed

Run these in parallel:
- `git log --oneline -10` - recent commits
- `git status --short` - uncommitted changes in working tree
- `git diff --name-only` - unstaged changes
- `git diff --cached --name-only` - staged changes
- `git diff HEAD~1 --name-only` - files changed in last commit
- `git diff main...HEAD --name-only` - all changes on this branch vs main

## Step 2: Map changes to knowledge domains

Use this mapping to decide which `docs/ai/` files may need updating:

| Changed area | Potentially stale docs/ai/ files |
|---|---|
| `src/data/routes.ts`, `src/pages/**` | `engineering/routes-and-sitemap.md` |
| `src/data/sitemap-inventory.ts`, `src/data/content-sitemap.ts` | `engineering/routes-and-sitemap.md` |
| `src/data/*-products.ts`, `src/data/product-catalog.ts`, `src/data/amazon-products/` | `affiliate/product-data-rules.md` |
| `src/scripts/analytics.ts`, `src/components/Analytics.astro` | `engineering/analytics-events.md` |
| `src/scripts/**`, `scripts/**`, `package.json` | `engineering/build-and-test-commands.md`, `engineering/architecture.md` |
| `src/components/AffiliateLink.astro` | `affiliate/amazon-associates-rules.md` |
| `src/layouts/**`, `astro.config.mjs`, `tsconfig.json` | `engineering/architecture.md` |
| `src/__tests__/**`, `vitest.config.ts` | `engineering/build-and-test-commands.md` |
| `docs/system-definition.yaml` | `strategy/chill-dogs-context.md`, `strategy/metrics-and-page-types.md` |
| `docs/article-writing-guide.md` | `writing/article-writing-guide.md` |
| `CLAUDE.md` | `engineering/architecture.md`, `AGENT_START.md` |
| `src/utils/related-pages.ts` | `engineering/routes-and-sitemap.md` |
| `src/utils/og.ts`, `src/config/og-cta.mjs` | `engineering/seo-and-schema.md` |
| `.env.example` | `engineering/architecture.md` |

## Step 3: Read the affected docs/ai/ files

Read each potentially stale file identified in Step 2. Also read the changed source files to understand what actually changed.

## Step 4: Update stale content

For each docs/ai/ file that needs updating:
- Edit only the sections that are factually wrong or missing information
- Do not rewrite sections that are still accurate
- Update the `updated:` frontmatter date to today's date
- Keep the same structure and tone

Do NOT update files just because they are adjacent to the change. Only update if content is genuinely stale.

## Step 5: Save a plan record

Create a new file in `docs/ai/plans/` using this filename pattern:

`YYYY-MM-DD-HHMM-knowledge-sync.md`

Use today's date and current time (24h format) to avoid same-day collisions. Example: `2026-05-03-1430-knowledge-sync.md`.

Use this frontmatter and structure:

```markdown
---
title: Knowledge Sync - <brief description of what changed>
type: plan
domain: global
status: executed
updated: <today's date>
tags:
  - chill-dogs
  - knowledge-sync
related:
  - ../AI_INDEX.md
---

# Knowledge Sync: <brief description>

## Context

<What changed in the codebase and why the knowledge graph needed updating.>

**Executed:** <today's date>
**Commits reviewed:** <commit hashes>

## Changes made

<List of docs/ai/ files updated and what was changed in each. If no files needed updating, say so.>

## Related knowledge

- [AI Index](../AI_INDEX.md)
```

## Step 6: Validate

Run `bun run check:ai-docs` and fix any issues before proceeding.

## Step 7: Commit behavior

**If this command was invoked as a standalone knowledge-sync task** (not as part of a larger coding task):
- Stage and commit the docs changes: `git add docs/ai/ && git commit -m "chore: sync knowledge graph - <brief description>"`
- Push to the current branch.

**If this command is being run as part of a larger coding task** (e.g. called from the finish checklist mid-task):
- Do NOT commit separately.
- Leave the docs changes in the working tree so they are included in the main task commit.
- Tell the user what was updated so they can include it in their commit message.
