/**
 * newsletter-sync.ts — read-only pull of every Buttondown email into a snapshot.
 *
 * Usage:
 *   bun run newsletter:sync            # print a summary table
 *   bun run newsletter:sync -- --write # also write docs/ai/marketing/newsletter-issues.json
 *
 * Needs BUTTONDOWN_API_KEY in .env (bun loads it). The key is sent only as an
 * Authorization header and is never printed or written. This script only reads;
 * it creates, edits, and sends nothing.
 *
 * The snapshot lists, per email: subject, send date, status, archive URL, the
 * chill-dogs.com paths linked in the body, and any analytics Buttondown returns.
 * docs/ai/marketing/newsletter-archive.md is still edited by hand from it.
 */
import { writeFileSync } from 'node:fs';

import { linkedPaths, utmSources } from './newsletter-links';

const API = 'https://api.buttondown.com/v1';
const key = process.env.BUTTONDOWN_API_KEY;
const write = process.argv.includes('--write');

if (!key) {
  console.error('BUTTONDOWN_API_KEY is not set. Add it to .env (see .env.example).');
  process.exit(1);
}

type Email = Record<string, unknown> & {
  id: string;
  subject?: string;
  status?: string;
  publish_date?: string;
  creation_date?: string;
  absolute_url?: string;
  body?: string;
  analytics?: unknown;
};

async function get(url: string): Promise<any> {
  const res = await fetch(url, { headers: { Authorization: `Token ${key}` } });
  if (!res.ok) {
    // Status only: never echo headers or the key.
    console.error(`Buttondown API ${res.status} for ${url.replace(API, '')}`);
    process.exit(1);
  }
  return res.json();
}

async function allEmails(): Promise<Email[]> {
  const out: Email[] = [];
  let url: string | null = `${API}/emails?page_size=100&ordering=publish_date`;
  while (url) {
    const page = await get(url);
    out.push(...(page.results ?? []));
    url = page.next ?? null;
  }
  return out;
}

const emails = await allEmails();
const rows = emails.map((e) => ({
  id: e.id,
  subject: e.subject ?? '',
  status: e.status ?? '',
  sent: (e.publish_date ?? e.creation_date ?? '').slice(0, 10),
  url: e.absolute_url ?? '',
  paths: linkedPaths(e.body),
  utmSources: utmSources(e.body),
  hasPinterest: /pinterest\.com\/chilldogs42/.test(e.body ?? ''),
  analytics: e.analytics ?? null,
}));

rows.sort((a, b) => b.sent.localeCompare(a.sent));
for (const r of rows) {
  console.log(`${r.sent}  ${r.status.padEnd(10)} ${r.subject}`);
  console.log(`            ${r.url || '(no archive URL)'}  links:${r.paths.length}  pinterest:${r.hasPinterest}`);
}
console.log(`\n${rows.length} emails.`);

if (write) {
  const file = 'docs/ai/marketing/newsletter-issues.json';
  writeFileSync(file, JSON.stringify(rows, null, 2) + '\n');
  console.log(`Wrote ${file}`);
}
