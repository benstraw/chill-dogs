/**
 * Sent newsletters cannot be edited. Every site path an archived issue links to must
 * still resolve, as a built page or through a redirect, or retiring a page silently
 * breaks links in subscribers' inboxes.
 */
import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { distRoot, projectRoot } from '../helpers/dist';
import { vercelRedirects } from '../helpers/redirects';

const issues = JSON.parse(readFileSync(path.join(projectRoot, 'docs/marketing/newsletter-issues.json'), 'utf8')) as Array<{
  subject: string;
  paths: string[];
}>;

describe('newsletter archive links', () => {
  it('every linked path still resolves', () => {
    const redirects = vercelRedirects();
    const linked = issues.flatMap((issue) => issue.paths.map((p) => ({ subject: issue.subject, p })));
    expect(linked.length).toBeGreaterThan(10);
    const broken = linked
      .filter(({ p }) => !existsSync(path.join(distRoot, p, 'index.html')) && !existsSync(path.join(distRoot, p)))
      .filter(({ p }) => !redirects.has(p.length > 1 ? p.replace(/\/$/, '') : p))
      .map(({ subject, p }) => `${p}  (in "${subject}")`);
    expect(broken, 'add a redirect for each retired path').toEqual([]);
  });
});
