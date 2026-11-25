/**
 * Ratchet for rules that shipped code already breaks.
 *
 * A guard lands with an allowlist of today's violations, each with a reason. The test
 * fails on any violation NOT in the list, so nothing new gets in. Entries that no
 * longer occur are printed as a warning, never a failure: cleaning up is good, and it
 * should not turn a build red. Remove the entry when you see the warning.
 */
import { expect } from 'vitest';

/** Violation key → why it is tolerated for now. */
export type Allowlist = Readonly<Record<string, string>>;

export function expectWithinAllowlist(found: Iterable<string>, allowlist: Allowlist, label: string, fix: string) {
  const seen = new Set(found);
  const fresh = [...seen].filter((key) => !(key in allowlist)).sort();
  const stale = Object.keys(allowlist).filter((key) => !seen.has(key));
  if (stale.length) {
    console.warn(`[${label}] allowlist entries no longer needed; remove them:\n  ${stale.join('\n  ')}`);
  }
  expect(fresh, `${fresh.length} new ${label} violation(s). Fix: ${fix}\n${fresh.join('\n')}`).toEqual([]);
}
