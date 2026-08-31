/**
 * Vercel Routing Middleware for /admin/*.
 *
 * The admin pages are static HTML on the CDN, so this file is the only thing
 * standing in front of them. It is deliberately dependency-free and runs on
 * Vercel's default Edge runtime — do not pin `config.runtime`, and do not add
 * an npm lockfile, or Vercel's isolated middleware packager breaks.
 *
 * Two ways in:
 *   - GitHub OAuth (primary). Sign in with GitHub, get checked against
 *     ADMIN_GITHUB_LOGINS, receive an HMAC-signed session cookie.
 *   - HTTP Basic (fallback). Preview deployments get random hostnames that a
 *     GitHub OAuth app cannot register, and CLI clients cannot do a browser
 *     redirect dance, so ADMIN_USERNAME / ADMIN_PASSWORD still work.
 */

export const config = {
  matcher: '/admin/:path*',
};

const ADMIN_HOME = '/admin/';
const LOGIN_PATH = '/admin/auth/login/';
const CALLBACK_PATH = '/admin/auth/callback/';
const LOGOUT_PATH = '/admin/auth/logout/';
const BASIC_PATH = '/admin/auth/basic/';

const SESSION_COOKIE = 'cd_admin_session';
const STATE_COOKIE = 'cd_admin_state';
// Set on sign-out. A browser caches HTTP Basic credentials and re-sends them
// forever, so clearing the session alone would let the very next request walk
// back in. This marker suppresses the Basic-header shortcut until the visitor
// deliberately signs in again. CLI clients send no cookies and never see it.
const SIGNED_OUT_COOKIE = 'cd_admin_signed_out';
// Set alongside the one 401 that forces a fresh password prompt after sign-out.
// The browser replays cached credentials automatically, so refusing the first
// attempt is the only way to make it ask; the retry carries this cookie.
const CHALLENGE_COOKIE = 'cd_admin_challenge';
const SESSION_TTL_SECONDS = 8 * 60 * 60;
const STATE_TTL_SECONDS = 10 * 60;
const SIGNED_OUT_TTL_SECONDS = 12 * 60 * 60;
const CHALLENGE_TTL_SECONDS = 5 * 60;

const GITHUB_AUTHORIZE_URL = 'https://github.com/login/oauth/authorize';
const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const USER_AGENT = 'chill-dogs-admin';

const SAFE_NEXT_PATH = /^\/admin\/[A-Za-z0-9/_-]*$/;

const encoder = new TextEncoder();

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Robots-Tag': 'noindex, nofollow',
};

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

function continueResponse() {
  return new Response(null, {
    headers: {
      'x-middleware-next': '1',
    },
  });
}

function constantTimeEqual(actual, expected) {
  const maxLength = Math.max(actual.length, expected.length);
  let difference = actual.length ^ expected.length;

  for (let index = 0; index < maxLength; index += 1) {
    difference |= (actual.charCodeAt(index) || 0) ^ (expected.charCodeAt(index) || 0);
  }

  return difference === 0;
}

function withTrailingSlash(pathname) {
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

function toBase64Url(bytes) {
  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value) {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function randomToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function hmacSignature(secret, message) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message));
  return toBase64Url(new Uint8Array(signature));
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * `v1.<base64url(payload)>.<base64url(hmac)>`. The signature is the only thing
 * making this trustworthy — the payload itself is readable, and deliberately
 * carries no GitHub access token.
 */
export async function createSessionToken(secret, session, now = Date.now()) {
  const payload = {
    sub: session.sub,
    via: session.via,
    exp: Math.floor(now / 1000) + SESSION_TTL_SECONDS,
  };
  const encoded = toBase64Url(encoder.encode(JSON.stringify(payload)));
  return `v1.${encoded}.${await hmacSignature(secret, encoded)}`;
}

export async function verifySessionToken(secret, token, now = Date.now()) {
  if (!secret || !token) {
    return null;
  }

  const parts = token.split('.');
  if (parts.length !== 3 || parts[0] !== 'v1') {
    return null;
  }

  const [, encoded, signature] = parts;

  try {
    if (!constantTimeEqual(signature, await hmacSignature(secret, encoded))) {
      return null;
    }

    const payload = JSON.parse(new TextDecoder().decode(fromBase64Url(encoded)));
    if (typeof payload?.exp !== 'number' || payload.exp <= Math.floor(now / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Cookies                                                                     */
/* -------------------------------------------------------------------------- */

function readCookie(request, name) {
  const header = request.headers.get('cookie');
  if (!header) {
    return undefined;
  }

  for (const part of header.split(';')) {
    const separatorIndex = part.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }
    if (part.slice(0, separatorIndex).trim() !== name) {
      continue;
    }
    return decodeURIComponent(part.slice(separatorIndex + 1).trim());
  }

  return undefined;
}

function serializeCookie(name, value, url, maxAgeSeconds) {
  const attributes = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/admin',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${maxAgeSeconds}`,
  ];

  // `Secure` would make the cookie unusable under `vercel dev` on http://localhost.
  if (url.protocol === 'https:') {
    attributes.push('Secure');
  }

  return attributes.join('; ');
}

function clearCookie(name, url) {
  return serializeCookie(name, '', url, 0);
}

/* -------------------------------------------------------------------------- */
/* Responses                                                                   */
/* -------------------------------------------------------------------------- */

function redirectResponse(location, cookies = []) {
  const headers = new Headers({ ...NO_STORE_HEADERS, Location: location });
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie);
  }
  return new Response(null, { status: 302, headers });
}

function messageResponse(status, heading, message, links = [], cookies = []) {
  const actions = links
    .map((link) => `<p><a href="${link.href}">${link.label}</a></p>`)
    .join('');
  const body = `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="robots" content="noindex, nofollow"><title>${heading}</title>` +
    `<style>body{font-family:system-ui,sans-serif;margin:0;min-height:100vh;display:grid;` +
    `place-items:center;background:#f0f4f6;color:#1d2b32}main{max-width:32rem;padding:2rem;` +
    `text-align:center}h1{font-size:1.5rem;margin:0 0 .75rem}p{margin:.5rem 0;line-height:1.5}` +
    `a{color:#0f6f8c}</style></head><body><main><h1>${heading}</h1><p>${message}</p>` +
    `${actions}</main></body></html>`;

  const headers = new Headers({
    ...NO_STORE_HEADERS,
    'Content-Type': 'text/html; charset=utf-8',
  });
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie);
  }

  return new Response(body, { status, headers });
}

function unauthorizedResponse(cookies = []) {
  const headers = new Headers({
    ...NO_STORE_HEADERS,
    'Content-Type': 'text/plain; charset=utf-8',
    'WWW-Authenticate': 'Basic realm="Chill-Dogs Admin", charset="UTF-8"',
  });
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie);
  }

  return new Response('Authentication required.', { status: 401, headers });
}

function notConfiguredResponse(detail = 'Admin authentication is not configured.') {
  return new Response(detail, {
    status: 503,
    headers: {
      ...NO_STORE_HEADERS,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

function isSignedOut(request) {
  return readCookie(request, SIGNED_OUT_COOKIE) === '1';
}

/** Whichever sign-in door this deployment actually has. */
function signInPath(configuration) {
  return configuration.githubConfigured ? LOGIN_PATH : BASIC_PATH;
}

function signedOutPage(configuration, cookies = []) {
  return messageResponse(
    200,
    'Signed out',
    'You are signed out of the Chill-Dogs admin.',
    [{ href: signInPath(configuration), label: 'Sign in again' }],
    cookies
  );
}

function signOut(url, configuration) {
  return signedOutPage(configuration, [
    clearCookie(SESSION_COOKIE, url),
    clearCookie(STATE_COOKIE, url),
    serializeCookie(SIGNED_OUT_COOKIE, '1', url, SIGNED_OUT_TTL_SECONDS),
  ]);
}

/* -------------------------------------------------------------------------- */
/* Configuration                                                               */
/* -------------------------------------------------------------------------- */

export function parseAllowlist(value) {
  return (value ?? '')
    .split(',')
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean);
}

function readConfiguration(environment) {
  const configuration = {
    clientId: environment.GITHUB_OAUTH_CLIENT_ID?.trim(),
    clientSecret: environment.GITHUB_OAUTH_CLIENT_SECRET?.trim(),
    sessionSecret: environment.ADMIN_SESSION_SECRET?.trim(),
    allowedLogins: parseAllowlist(environment.ADMIN_GITHUB_LOGINS),
    basicUsername: environment.ADMIN_USERNAME?.trim(),
    basicPassword: environment.ADMIN_PASSWORD,
  };

  configuration.githubConfigured = Boolean(
    configuration.clientId && configuration.clientSecret && configuration.sessionSecret
  );
  configuration.basicConfigured = Boolean(
    configuration.basicUsername && configuration.basicPassword
  );

  return configuration;
}

/* -------------------------------------------------------------------------- */
/* Basic credentials                                                           */
/* -------------------------------------------------------------------------- */

function basicHeaderMatches(request, configuration) {
  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Basic ')) {
    return false;
  }

  try {
    const decoded = atob(authorization.slice('Basic '.length));
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) {
      return false;
    }

    // The password may itself contain ':', so only the first one separates.
    const usernameMatches = constantTimeEqual(
      decoded.slice(0, separatorIndex),
      configuration.basicUsername
    );
    const passwordMatches = constantTimeEqual(
      decoded.slice(separatorIndex + 1),
      configuration.basicPassword
    );

    return usernameMatches && passwordMatches;
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* GitHub OAuth                                                                */
/* -------------------------------------------------------------------------- */

function safeNextPath(value) {
  if (!value) {
    return ADMIN_HOME;
  }
  const candidate = withTrailingSlash(value);
  return SAFE_NEXT_PATH.test(candidate) ? candidate : ADMIN_HOME;
}

function callbackUrl(url) {
  return `${url.origin}${CALLBACK_PATH}`;
}

function encodeState(nextPath) {
  return `${randomToken()}.${toBase64Url(encoder.encode(nextPath))}`;
}

function decodeState(state) {
  const separatorIndex = state.indexOf('.');
  if (separatorIndex === -1) {
    return ADMIN_HOME;
  }

  try {
    return safeNextPath(new TextDecoder().decode(fromBase64Url(state.slice(separatorIndex + 1))));
  } catch {
    return ADMIN_HOME;
  }
}

function startGithubLogin(url, configuration) {
  const state = encodeState(safeNextPath(url.searchParams.get('next')));
  const authorize = new URL(GITHUB_AUTHORIZE_URL);
  // No `scope`: GET /user returns the authorizing user's public profile, which
  // is all the allowlist check needs.
  authorize.searchParams.set('client_id', configuration.clientId);
  authorize.searchParams.set('redirect_uri', callbackUrl(url));
  authorize.searchParams.set('state', state);
  authorize.searchParams.set('allow_signup', 'false');

  return redirectResponse(authorize.toString(), [
    serializeCookie(STATE_COOKIE, state, url, STATE_TTL_SECONDS),
    clearCookie(SIGNED_OUT_COOKIE, url),
  ]);
}

async function fetchGithubLogin(code, url, configuration) {
  try {
    const tokenResponse = await fetch(GITHUB_TOKEN_URL, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({
        client_id: configuration.clientId,
        client_secret: configuration.clientSecret,
        code,
        redirect_uri: callbackUrl(url),
      }),
    });

    if (!tokenResponse.ok) {
      return null;
    }

    const accessToken = (await tokenResponse.json())?.access_token;
    if (typeof accessToken !== 'string' || !accessToken) {
      return null;
    }

    const userResponse = await fetch(GITHUB_USER_URL, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': USER_AGENT,
      },
    });

    if (!userResponse.ok) {
      return null;
    }

    const login = (await userResponse.json())?.login;
    return typeof login === 'string' && login ? login : null;
  } catch {
    return null;
  }
}

async function completeGithubLogin(request, url, configuration, now) {
  if (url.searchParams.get('error')) {
    return messageResponse(
      403,
      'Sign-in cancelled',
      'GitHub did not authorize this sign-in.',
      [{ href: LOGIN_PATH, label: 'Try again' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  const code = url.searchParams.get('code') ?? '';
  const returnedState = url.searchParams.get('state') ?? '';
  const expectedState = readCookie(request, STATE_COOKIE) ?? '';

  if (!code || !returnedState || !expectedState || !constantTimeEqual(returnedState, expectedState)) {
    return messageResponse(
      403,
      'Sign-in could not be verified',
      'The sign-in state did not match. This usually means the attempt expired.',
      [{ href: LOGIN_PATH, label: 'Start again' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  const login = await fetchGithubLogin(code, url, configuration);
  if (!login) {
    return messageResponse(
      502,
      'GitHub sign-in failed',
      'GitHub did not return an account for this sign-in.',
      [{ href: LOGIN_PATH, label: 'Try again' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  if (!configuration.allowedLogins.includes(login.toLowerCase())) {
    return messageResponse(
      403,
      'Not an admin account',
      `Signed in to GitHub as @${login}, which is not on the Chill-Dogs admin allowlist.`,
      [{ href: LOGOUT_PATH, label: 'Sign in as someone else' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  const token = await createSessionToken(
    configuration.sessionSecret,
    { sub: login, via: 'github' },
    now
  );

  return redirectResponse(decodeState(returnedState), [
    serializeCookie(SESSION_COOKIE, token, url, SESSION_TTL_SECONDS),
    clearCookie(STATE_COOKIE, url),
    clearCookie(SIGNED_OUT_COOKIE, url),
  ]);
}

async function basicSignIn(request, url, configuration, now) {
  if (!configuration.basicConfigured) {
    return notConfiguredResponse('The Basic Auth fallback is not configured.');
  }

  const challenged = readCookie(request, CHALLENGE_COOKIE) === '1';

  // Returning from an explicit sign-out, refuse the first attempt even when the
  // credentials are correct. Otherwise the browser replays what it cached and
  // signs the visitor straight back in without ever asking. The 401 makes it
  // prompt; the retry arrives with the challenge cookie and is accepted.
  if ((isSignedOut(request) && !challenged) || !basicHeaderMatches(request, configuration)) {
    return unauthorizedResponse([
      serializeCookie(CHALLENGE_COOKIE, '1', url, CHALLENGE_TTL_SECONDS),
    ]);
  }

  // Signing in here is deliberate, so it lifts a previous sign-out.
  const cookies = [clearCookie(SIGNED_OUT_COOKIE, url), clearCookie(CHALLENGE_COOKIE, url)];

  // Basic-only deployments have no ADMIN_SESSION_SECRET to sign with; the
  // browser's cached credentials carry the session instead. Minting a token
  // without a secret would HMAC with the literal string "undefined".
  if (configuration.sessionSecret) {
    const token = await createSessionToken(
      configuration.sessionSecret,
      { sub: configuration.basicUsername, via: 'basic' },
      now
    );
    cookies.push(serializeCookie(SESSION_COOKIE, token, url, SESSION_TTL_SECONDS));
  }

  return redirectResponse(safeNextPath(url.searchParams.get('next')), cookies);
}

/* -------------------------------------------------------------------------- */
/* Router                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Returns a Response to send instead of the admin page, or `undefined` to let
 * the request through to the static CDN content.
 */
export async function authorizeAdminRequest(request, environment, now = Date.now()) {
  const url = new URL(request.url);
  const path = withTrailingSlash(url.pathname);
  const configuration = readConfiguration(environment);

  if (!configuration.githubConfigured && !configuration.basicConfigured) {
    return notConfiguredResponse();
  }

  // An empty allowlist must never read as "any GitHub account will do".
  if (configuration.githubConfigured && configuration.allowedLogins.length === 0) {
    return notConfiguredResponse(
      'Admin authentication is not configured: ADMIN_GITHUB_LOGINS is empty.'
    );
  }

  // These four exist only here at the edge and are never built to files, so
  // every configuration mode has to handle them — letting one fall through to
  // the CDN is a 404.
  switch (path) {
    case LOGIN_PATH:
      return configuration.githubConfigured
        ? startGithubLogin(url, configuration)
        : redirectResponse(
            `${BASIC_PATH}?next=${encodeURIComponent(safeNextPath(url.searchParams.get('next')))}`
          );
    case CALLBACK_PATH:
      return configuration.githubConfigured
        ? completeGithubLogin(request, url, configuration, now)
        : notConfiguredResponse('GitHub sign-in is not configured for this deployment.');
    case BASIC_PATH:
      return basicSignIn(request, url, configuration, now);
    case LOGOUT_PATH:
      return signOut(url, configuration);
    default:
      break;
  }

  // Signing out has to outlast the browser's cached Basic credentials, so it
  // beats both the header shortcut and any surviving session cookie.
  if (isSignedOut(request)) {
    return signedOutPage(configuration);
  }

  // Basic-only deployments keep the original behaviour: challenge every path.
  if (!configuration.githubConfigured) {
    return basicHeaderMatches(request, configuration) ? undefined : unauthorizedResponse();
  }

  // CLI clients cannot follow the browser redirect dance, so a correct Basic
  // header is accepted on any admin path.
  if (configuration.basicConfigured && basicHeaderMatches(request, configuration)) {
    return undefined;
  }

  const session = await verifySessionToken(
    configuration.sessionSecret,
    readCookie(request, SESSION_COOKIE),
    now
  );
  if (session) {
    return undefined;
  }

  return redirectResponse(
    `${LOGIN_PATH}?next=${encodeURIComponent(safeNextPath(url.pathname))}`,
    [clearCookie(SESSION_COOKIE, url)]
  );
}

export default async function middleware(request) {
  const authenticationResponse = await authorizeAdminRequest(request, {
    ADMIN_GITHUB_LOGINS: process.env.ADMIN_GITHUB_LOGINS,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
    ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    GITHUB_OAUTH_CLIENT_ID: process.env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: process.env.GITHUB_OAUTH_CLIENT_SECRET,
  });

  return authenticationResponse ?? continueResponse();
}
