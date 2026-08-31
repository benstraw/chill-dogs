/**
 * @vitest-environment node
 *
 * The middleware is Edge-runtime code, not DOM code, and happy-dom's `Response`
 * drops `Set-Cookie` headers — which is most of what these tests assert.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  authorizeAdminRequest,
  config,
  createSessionToken,
  parseAllowlist,
  verifySessionToken,
} from '../../middleware';

const SESSION_SECRET = 'session-secret-value-for-tests';

const basicOnly = {
  ADMIN_USERNAME: 'chill-admin',
  ADMIN_PASSWORD: 'long:password-with-colon',
};

const githubOnly = {
  GITHUB_OAUTH_CLIENT_ID: 'client-id',
  GITHUB_OAUTH_CLIENT_SECRET: 'client-secret',
  ADMIN_SESSION_SECRET: SESSION_SECRET,
  ADMIN_GITHUB_LOGINS: 'benstraw, SecondOwner',
};

const bothModes = { ...githubOnly, ...basicOnly };

function adminRequest(
  pathname: string,
  init: { authorization?: string; cookie?: string } = {}
): Request {
  const headers: Record<string, string> = {};
  if (init.authorization) headers.authorization = init.authorization;
  if (init.cookie) headers.cookie = init.cookie;

  return new Request(`https://www.chill-dogs.com${pathname}`, { headers });
}

function basicAuthorization(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

function setCookieValues(response: Response | undefined): string[] {
  const headers = response?.headers as (Headers & { getSetCookie?: () => string[] }) | undefined;
  if (!headers) return [];
  if (typeof headers.getSetCookie === 'function') return headers.getSetCookie();
  const raw = headers.get('set-cookie');
  return raw ? raw.split(/,\s*(?=[A-Za-z0-9_-]+=)/) : [];
}

function cookieFrom(response: Response | undefined, name: string): string | undefined {
  for (const cookie of setCookieValues(response)) {
    const pair = cookie.split(';')[0];
    const separatorIndex = pair.indexOf('=');
    if (pair.slice(0, separatorIndex).trim() === name) {
      return decodeURIComponent(pair.slice(separatorIndex + 1));
    }
  }
  return undefined;
}

function attributesFor(response: Response | undefined, name: string): string {
  return setCookieValues(response).find((cookie) => cookie.startsWith(`${name}=`)) ?? '';
}

/** GitHub's two calls: the token exchange, then the user lookup. */
function stubGitHub(login: string | null, { accessToken = 'gho_token' } = {}) {
  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === 'string' ? input : input.toString();

    if (url.startsWith('https://github.com/login/oauth/access_token')) {
      return new Response(JSON.stringify({ access_token: accessToken }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (url.startsWith('https://api.github.com/user')) {
      if (login === null) return new Response('nope', { status: 401 });
      return new Response(JSON.stringify({ login }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    throw new Error(`unexpected fetch: ${url}`);
  });

  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('admin authentication middleware', () => {
  it('is scoped to every admin route', () => {
    expect(config.matcher).toBe('/admin/:path*');
    // Pinning a runtime here is what broke Vercel's middleware packaging before; the
    // default Edge runtime is deliberate. Cast because the literal has no such key —
    // that is exactly the state being asserted.
    expect((config as Record<string, unknown>).runtime).toBeUndefined();
  });

  it('fails closed when no authentication is configured at all', async () => {
    const response = await authorizeAdminRequest(adminRequest('/admin/'), {});

    expect(response?.status).toBe(503);
    expect(response?.headers.get('www-authenticate')).toBeNull();
    expect(response?.headers.get('cache-control')).toBe('no-store');
  });

  it('fails closed when GitHub is configured with an empty allowlist', async () => {
    const response = await authorizeAdminRequest(adminRequest('/admin/'), {
      ...githubOnly,
      ADMIN_GITHUB_LOGINS: '  ,  ',
    });

    expect(response?.status).toBe(503);
    expect(await response?.text()).toContain('ADMIN_GITHUB_LOGINS');
  });
});

describe('basic auth fallback', () => {
  it('allows valid credentials to continue to the static admin page', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
      }),
      basicOnly
    );

    expect(response).toBeUndefined();
  });

  it('challenges requests without valid credentials and prevents caching', async () => {
    const missing = await authorizeAdminRequest(adminRequest('/admin/'), basicOnly);
    const incorrect = await authorizeAdminRequest(
      adminRequest('/admin/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, 'incorrect'),
      }),
      basicOnly
    );

    for (const response of [missing, incorrect]) {
      expect(response?.status).toBe(401);
      expect(response?.headers.get('www-authenticate')).toContain('Chill-Dogs Admin');
      expect(response?.headers.get('cache-control')).toBe('no-store');
    }
  });

  it('rejects malformed authorization values', async () => {
    const unsupported = await authorizeAdminRequest(
      adminRequest('/admin/', { authorization: 'Bearer token' }),
      basicOnly
    );
    const malformedBase64 = await authorizeAdminRequest(
      adminRequest('/admin/', { authorization: 'Basic !!!' }),
      basicOnly
    );
    const missingSeparator = await authorizeAdminRequest(
      adminRequest('/admin/', { authorization: `Basic ${btoa('username-only')}` }),
      basicOnly
    );

    expect(unsupported?.status).toBe(401);
    expect(malformedBase64?.status).toBe(401);
    expect(missingSeparator?.status).toBe(401);
  });

  it('still accepts a basic header once GitHub login is enabled, for CLI clients', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/products/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
      }),
      bothModes
    );

    expect(response).toBeUndefined();
  });

  it('exchanges basic credentials for a session at the fallback door', async () => {
    const challenge = await authorizeAdminRequest(adminRequest('/admin/auth/basic/'), bothModes);
    expect(challenge?.status).toBe(401);
    expect(challenge?.headers.get('www-authenticate')).toContain('Chill-Dogs Admin');

    const accepted = await authorizeAdminRequest(
      adminRequest('/admin/auth/basic/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
      }),
      bothModes
    );

    expect(accepted?.status).toBe(302);
    expect(accepted?.headers.get('location')).toBe('/admin/');

    const session = await verifySessionToken(
      SESSION_SECRET,
      cookieFrom(accepted, 'cd_admin_session') ?? ''
    );
    expect(session?.via).toBe('basic');
  });
});

describe('github login', () => {
  it('sends unauthenticated admin requests to the login route', async () => {
    const response = await authorizeAdminRequest(adminRequest('/admin/images/'), githubOnly);

    expect(response?.status).toBe(302);
    expect(response?.headers.get('location')).toBe(
      '/admin/auth/login/?next=%2Fadmin%2Fimages%2F'
    );
    expect(response?.headers.get('cache-control')).toBe('no-store');
  });

  it('redirects the login route to GitHub and stores the state', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/auth/login/?next=%2Fadmin%2Fproducts%2F'),
      githubOnly
    );

    expect(response?.status).toBe(302);

    const location = new URL(response?.headers.get('location') ?? '');
    expect(location.origin + location.pathname).toBe('https://github.com/login/oauth/authorize');
    expect(location.searchParams.get('client_id')).toBe('client-id');
    expect(location.searchParams.get('redirect_uri')).toBe(
      'https://www.chill-dogs.com/admin/auth/callback/'
    );
    // No scope is requested — GET /user needs none to return the login.
    expect(location.searchParams.get('scope')).toBeNull();

    const state = location.searchParams.get('state') ?? '';
    expect(cookieFrom(response, 'cd_admin_state')).toBe(state);

    const attributes = attributesFor(response, 'cd_admin_state');
    expect(attributes).toContain('HttpOnly');
    expect(attributes).toContain('Secure');
    expect(attributes).toContain('SameSite=Lax');
    expect(attributes).toContain('Path=/admin');
  });

  it('refuses to redirect anywhere outside /admin/ after login', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/auth/login/?next=https%3A%2F%2Fevil.example.com%2F'),
      githubOnly
    );

    const state = new URL(response?.headers.get('location') ?? '').searchParams.get('state') ?? '';
    const encodedNext = state.slice(state.indexOf('.') + 1);
    const decodedNext = atob(encodedNext.replace(/-/g, '+').replace(/_/g, '/'));

    expect(decodedNext).toBe('/admin/');
  });

  it('signs in an allowlisted GitHub account and returns to the requested page', async () => {
    const login = await authorizeAdminRequest(
      adminRequest('/admin/auth/login/?next=%2Fadmin%2Fproducts%2F'),
      githubOnly
    );
    const state = cookieFrom(login, 'cd_admin_state') ?? '';

    const fetchMock = stubGitHub('benstraw');
    const callback = await authorizeAdminRequest(
      adminRequest(`/admin/auth/callback/?code=abc123&state=${encodeURIComponent(state)}`, {
        cookie: `cd_admin_state=${encodeURIComponent(state)}`,
      }),
      githubOnly
    );

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(callback?.status).toBe(302);
    expect(callback?.headers.get('location')).toBe('/admin/products/');

    const token = cookieFrom(callback, 'cd_admin_session') ?? '';
    const session = await verifySessionToken(SESSION_SECRET, token);
    expect(session).toMatchObject({ sub: 'benstraw', via: 'github' });

    // The token itself must never carry the GitHub access token.
    expect(token).not.toContain('gho_token');

    const authorized = await authorizeAdminRequest(
      adminRequest('/admin/products/', { cookie: `cd_admin_session=${encodeURIComponent(token)}` }),
      githubOnly
    );
    expect(authorized).toBeUndefined();
  });

  it('matches allowlist entries case-insensitively', async () => {
    const login = await authorizeAdminRequest(adminRequest('/admin/auth/login/'), githubOnly);
    const state = cookieFrom(login, 'cd_admin_state') ?? '';

    stubGitHub('secondowner');
    const callback = await authorizeAdminRequest(
      adminRequest(`/admin/auth/callback/?code=abc123&state=${encodeURIComponent(state)}`, {
        cookie: `cd_admin_state=${encodeURIComponent(state)}`,
      }),
      githubOnly
    );

    expect(callback?.status).toBe(302);
    expect(callback?.headers.get('location')).toBe('/admin/');
  });

  it('rejects a GitHub account that is not on the allowlist', async () => {
    const login = await authorizeAdminRequest(adminRequest('/admin/auth/login/'), githubOnly);
    const state = cookieFrom(login, 'cd_admin_state') ?? '';

    stubGitHub('random-visitor');
    const callback = await authorizeAdminRequest(
      adminRequest(`/admin/auth/callback/?code=abc123&state=${encodeURIComponent(state)}`, {
        cookie: `cd_admin_state=${encodeURIComponent(state)}`,
      }),
      githubOnly
    );

    expect(callback?.status).toBe(403);
    expect(await callback?.text()).toContain('@random-visitor');
    expect(cookieFrom(callback, 'cd_admin_session')).toBeUndefined();
  });

  it('rejects a callback whose state does not match the cookie', async () => {
    stubGitHub('benstraw');
    const forged = await authorizeAdminRequest(
      adminRequest('/admin/auth/callback/?code=abc123&state=attacker-state', {
        cookie: 'cd_admin_state=real-state',
      }),
      githubOnly
    );
    const missingCookie = await authorizeAdminRequest(
      adminRequest('/admin/auth/callback/?code=abc123&state=attacker-state'),
      githubOnly
    );

    expect(forged?.status).toBe(403);
    expect(missingCookie?.status).toBe(403);
  });

  it('surfaces a GitHub failure instead of signing anyone in', async () => {
    const login = await authorizeAdminRequest(adminRequest('/admin/auth/login/'), githubOnly);
    const state = cookieFrom(login, 'cd_admin_state') ?? '';

    stubGitHub(null);
    const callback = await authorizeAdminRequest(
      adminRequest(`/admin/auth/callback/?code=abc123&state=${encodeURIComponent(state)}`, {
        cookie: `cd_admin_state=${encodeURIComponent(state)}`,
      }),
      githubOnly
    );

    expect(callback?.status).toBe(502);
    expect(cookieFrom(callback, 'cd_admin_session')).toBeUndefined();
  });
});

describe('admin auth routes exist in every configuration mode', () => {
  // Regression: these four are served only by the middleware and are never
  // built to files, so passing one through means a CDN 404. Basic-only is the
  // mode preview deployments actually run in.
  const authRoutes = ['/admin/auth/login/', '/admin/auth/callback/', '/admin/auth/basic/', '/admin/auth/logout/'];

  it('never falls through to the CDN in basic-only mode', async () => {
    const credentialed = basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD);

    for (const route of authRoutes) {
      const response = await authorizeAdminRequest(
        adminRequest(route, { authorization: credentialed }),
        basicOnly
      );

      expect(response, `${route} passed through and would 404`).toBeDefined();
    }
  });

  it('points the login route at the basic door when GitHub is not configured', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/auth/login/?next=%2Fadmin%2Fproducts%2F'),
      basicOnly
    );

    expect(response?.status).toBe(302);
    expect(response?.headers.get('location')).toBe('/admin/auth/basic/?next=%2Fadmin%2Fproducts%2F');
  });

  it('explains rather than 404s when a GitHub callback arrives at a basic-only deployment', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/auth/callback/?code=abc&state=xyz'),
      basicOnly
    );

    expect(response?.status).toBe(503);
    expect(await response?.text()).toContain('GitHub sign-in is not configured');
  });

  it('issues no session cookie when there is no secret to sign it with', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/auth/basic/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
      }),
      basicOnly
    );

    expect(response?.status).toBe(302);
    // Signing with an absent secret would HMAC the literal string "undefined".
    expect(cookieFrom(response, 'cd_admin_session')).toBeUndefined();
  });
});

describe('signing out', () => {
  const signedOut = 'cd_admin_signed_out=1';

  it('clears the session and marks the browser signed out', async () => {
    const response = await authorizeAdminRequest(adminRequest('/admin/auth/logout/'), githubOnly);

    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain('Signed out');
    expect(attributesFor(response, 'cd_admin_session')).toContain('Max-Age=0');
    expect(cookieFrom(response, 'cd_admin_signed_out')).toBe('1');
  });

  it('keeps a browser out even while it replays cached basic credentials', async () => {
    const credentialed = basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD);

    for (const environment of [basicOnly, bothModes]) {
      const response = await authorizeAdminRequest(
        adminRequest('/admin/products/', { authorization: credentialed, cookie: signedOut }),
        environment
      );

      expect(response?.status).toBe(200);
      expect(await response?.text()).toContain('Signed out');
    }
  });

  it('keeps a browser out even if a session cookie survives', async () => {
    const token = await createSessionToken(SESSION_SECRET, { sub: 'benstraw', via: 'github' });
    const response = await authorizeAdminRequest(
      adminRequest('/admin/', {
        cookie: `cd_admin_session=${encodeURIComponent(token)}; ${signedOut}`,
      }),
      githubOnly
    );

    expect(response?.status).toBe(200);
    expect(await response?.text()).toContain('Signed out');
  });

  it('does not affect CLI clients, which send no cookies', async () => {
    const response = await authorizeAdminRequest(
      adminRequest('/admin/products/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
      }),
      bothModes
    );

    expect(response).toBeUndefined();
  });

  it('offers the sign-in door this deployment actually has', async () => {
    const github = await authorizeAdminRequest(adminRequest('/admin/auth/logout/'), githubOnly);
    const basic = await authorizeAdminRequest(adminRequest('/admin/auth/logout/'), basicOnly);

    expect(await github?.text()).toContain('href="/admin/auth/login/"');
    expect(await basic?.text()).toContain('href="/admin/auth/basic/"');
  });

  it('lifts the mark when the visitor deliberately signs in again', async () => {
    const viaBasic = await authorizeAdminRequest(
      adminRequest('/admin/auth/basic/', {
        authorization: basicAuthorization(basicOnly.ADMIN_USERNAME, basicOnly.ADMIN_PASSWORD),
        cookie: signedOut,
      }),
      bothModes
    );
    const viaGithub = await authorizeAdminRequest(
      adminRequest('/admin/auth/login/', { cookie: signedOut }),
      githubOnly
    );

    expect(attributesFor(viaBasic, 'cd_admin_signed_out')).toContain('Max-Age=0');
    expect(attributesFor(viaGithub, 'cd_admin_signed_out')).toContain('Max-Age=0');
  });
});

describe('session tokens', () => {
  it('rejects a tampered payload, a foreign secret, and an expired session', async () => {
    const now = Date.now();
    const token = await createSessionToken(SESSION_SECRET, { sub: 'benstraw', via: 'github' }, now);

    expect(await verifySessionToken(SESSION_SECRET, token, now)).toMatchObject({ sub: 'benstraw' });
    expect(await verifySessionToken('a-different-secret', token, now)).toBeNull();
    expect(await verifySessionToken(SESSION_SECRET, `${token}x`, now)).toBeNull();
    expect(await verifySessionToken(SESSION_SECRET, token, now + 9 * 60 * 60 * 1000)).toBeNull();
  });

  it('does not let a forged payload through without a matching signature', async () => {
    const now = Date.now();
    const forgedPayload = btoa(JSON.stringify({ sub: 'attacker', via: 'github', exp: 4102444800 }))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    expect(await verifySessionToken(SESSION_SECRET, `v1.${forgedPayload}.`, now)).toBeNull();
  });

  it('sends an expired session back to the login route', async () => {
    const now = Date.now();
    const token = await createSessionToken(SESSION_SECRET, { sub: 'benstraw', via: 'github' }, now);

    const response = await authorizeAdminRequest(
      adminRequest('/admin/', { cookie: `cd_admin_session=${encodeURIComponent(token)}` }),
      githubOnly,
      now + 9 * 60 * 60 * 1000
    );

    expect(response?.status).toBe(302);
    expect(response?.headers.get('location')).toContain('/admin/auth/login/');
  });
});

describe('allowlist parsing', () => {
  it('trims, lowercases, and drops empty entries', () => {
    expect(parseAllowlist(' benstraw , SecondOwner ,, ')).toEqual(['benstraw', 'secondowner']);
    expect(parseAllowlist(undefined)).toEqual([]);
  });
});
