/**
 * Analytics.astro carries an inline copy of the host gate so PostHog is never even
 * loaded in dev or preview. That copy and shouldCaptureAnalytics() (which gates the
 * keystone amazon_outbound_click event) must agree, or production silently stops
 * reporting clicks, or dev traffic leaks into the numbers.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { shouldCaptureAnalytics } from '../scripts/analytics';

const source = readFileSync(path.resolve(__dirname, '../components/Analytics.astro'), 'utf8');
const inline = source.match(/function analyticsDisabled\(\)\s*\{[\s\S]*?\n\s*\}\n/)?.[0];

function inlineDisabled(hostname: string, storageValue: string | null = null): boolean {
  const window = { location: { hostname }, localStorage: { getItem: () => storageValue } };
  return new Function('window', `${inline}\nreturn analyticsDisabled();`)(window) as boolean;
}

const HOSTS = [
  'www.chill-dogs.com',
  'chill-dogs.com',
  'localhost',
  '127.0.0.1',
  '::1',
  '0.0.0.0',
  'site.localhost',
  '10.0.0.4',
  '192.168.1.20',
  '172.16.0.1',
  '172.31.255.255',
  '172.32.0.1',
  'chill-dogs-git-branch.vercel.app',
  'example.org',
];

describe('analytics host gate', () => {
  it('finds the inline gate in Analytics.astro', () => {
    expect(inline, 'analyticsDisabled() not found; update this test if it moved').toBeTruthy();
  });

  it.each(HOSTS)('agrees with shouldCaptureAnalytics on %s', (host) => {
    expect(inlineDisabled(host)).toBe(!shouldCaptureAnalytics(host));
  });

  it('captures in production and honors the local opt-in', () => {
    expect(inlineDisabled('www.chill-dogs.com')).toBe(false);
    expect(inlineDisabled('localhost', 'on')).toBe(false);
  });
});
