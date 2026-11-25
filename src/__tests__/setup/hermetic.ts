/**
 * Unit-tier setup: make every unit test hermetic, whatever machine it runs on.
 *
 * 1. No network. `fetch` throws unless a test stubs it. A test that falls through to
 *    the real fetch used to reach the live Impact API from a cloud container, which
 *    injects credentials, and only under some test orders, because an earlier test's
 *    stub leaked into it. Inject `fetchImpl`, or `vi.stubGlobal('fetch', ...)` and
 *    `vi.unstubAllGlobals()` in afterEach.
 * 2. No ambient merchant credentials or proxy. Developer machines, CI and cloud
 *    containers all differ here; tests set exactly the variables they need.
 */
const AMBIENT_ENV = /^(IMPACT_|CHEWY_IMPACT_|SERPAPI|INDEXNOW_KEY$|HTTPS?_PROXY$|https?_proxy$|VERCEL_ENV$)/;
for (const key of Object.keys(process.env)) {
  if (AMBIENT_ENV.test(key)) delete process.env[key];
}

// Assigned directly (not vi.stubGlobal) so vi.unstubAllGlobals() restores THIS, not the real fetch.
globalThis.fetch = (async (input: unknown) => {
  const url = typeof input === 'string' ? input : input instanceof URL ? input.href : (input as Request).url;
  throw new Error(`Unit tests must not use the network (fetch ${url}). Inject fetchImpl or stub fetch.`);
}) as typeof fetch;
