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
const GITHUB_PATH = '/admin/auth/github/';

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

/**
 * The middleware's own pages. They cannot use the site's CSS — Astro inlines a
 * per-page stylesheet at build time and these routes are never built — so the
 * brand tokens from src/styles/tokens.css are mirrored here deliberately.
 * /images/ sits outside the /admin matcher, so the logo loads unauthenticated.
 */
function renderPage(title, bodyHtml) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
    `<meta name="viewport" content="width=device-width, initial-scale=1">` +
    `<meta name="robots" content="noindex, nofollow"><title>${title} · Chill-Dogs Admin</title>` +
    `<style>` +
    `:root{--bg:#f0f4f6;--surface:#fff;--text:#2d2d2d;--muted:#595959;` +
    `--link:#345765;--border:#c5d4dc;--accent:#5e7a5a}` +
    `*{box-sizing:border-box}` +
    `body{margin:0;min-height:100vh;display:grid;place-items:center;padding:1.5rem;` +
    `background:var(--bg);color:var(--text);` +
    `font-family:Inter,system-ui,sans-serif;line-height:1.5}` +
    `main{width:100%;max-width:26rem;background:var(--surface);border:1px solid var(--border);` +
    `border-radius:1rem;padding:2.5rem 2rem;text-align:center;` +
    `box-shadow:0 1px 3px rgba(45,45,45,.06)}` +
    `img{width:3rem;height:3rem;object-fit:contain}` +
    `.eyebrow{margin:.75rem 0 0;color:var(--accent);font-size:.75rem;font-weight:700;` +
    `letter-spacing:.08em;text-transform:uppercase}` +
    `h1{margin:.25rem 0 .5rem;font-family:Nunito,system-ui,sans-serif;font-size:1.5rem}` +
    `p{margin:0 0 1.5rem;color:var(--muted)}` +
    `.button{display:flex;align-items:center;justify-content:center;gap:.5rem;` +
    `width:100%;padding:.75rem 1rem;border-radius:.5rem;background:var(--text);color:#fff;` +
    `font-size:1rem;font-weight:600;text-decoration:none}` +
    `.button:hover{background:#000}` +
    `.button svg{width:1.25rem;height:1.25rem;fill:currentColor}` +
    `.alt{display:inline-block;margin-top:1.25rem;color:var(--link);font-size:.875rem}` +
    `.note{margin:1.5rem 0 0;font-size:.8125rem;color:var(--muted)}` +
    `</style></head><body><main>` +
    `<img src="/images/paw-logo.png" alt="">` +
    `<p class="eyebrow">Chill-Dogs</p>` +
    bodyHtml +
    `</main></body></html>`;
}

function htmlResponse(status, title, bodyHtml, cookies = [], extraHeaders = {}) {
  const headers = new Headers({
    ...NO_STORE_HEADERS,
    'Content-Type': 'text/html; charset=utf-8',
    ...extraHeaders,
  });
  for (const cookie of cookies) {
    headers.append('Set-Cookie', cookie);
  }

  return new Response(renderPage(title, bodyHtml), { status, headers });
}

const GITHUB_MARK =
  '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';

function messageResponse(status, heading, message, links = [], cookies = [], extraHeaders = {}) {
  const actions = links
    .map((link) => `<p><a class="alt" href="${link.href}">${link.label}</a></p>`)
    .join('');

  return htmlResponse(
    status,
    heading,
    `<h1>${heading}</h1><p>${message}</p>${actions}`,
    cookies,
    extraHeaders
  );
}

/**
 * The sign-in landing page. Rendering it rather than redirecting straight to
 * github.com means the visitor sees where they are going before they leave.
 */
function loginPage(url, configuration, cookies = []) {
  const next = safeNextPath(url.searchParams.get('next'));
  const parts = ['<h1>Admin sign-in</h1>'];

  if (configuration.githubConfigured) {
    parts.push('<p>Sign in with the GitHub account on the admin allowlist.</p>');
    parts.push(
      `<a class="button" href="${GITHUB_PATH}?next=${encodeURIComponent(next)}">` +
        `${GITHUB_MARK}<span>Sign in with GitHub</span></a>`
    );
    if (configuration.basicConfigured) {
      parts.push(
        `<p><a class="alt" href="${BASIC_PATH}?next=${encodeURIComponent(next)}">` +
          'Use the password fallback instead</a></p>'
      );
    }
  } else {
    parts.push('<p>This deployment uses the admin password.</p>');
    parts.push(
      `<a class="button" href="${BASIC_PATH}?next=${encodeURIComponent(next)}">Continue</a>`
    );
    parts.push(
      '<p class="note">GitHub sign-in is not configured here. Preview deployments ' +
        'fall back to the password because a GitHub OAuth App registers one callback URL.</p>'
    );
  }

  return htmlResponse(200, 'Admin sign-in', parts.join(''), cookies);
}

function unauthorizedResponse(cookies = []) {
  // The browser only renders this body if the visitor dismisses the password
  // dialog, so it is a dead end unless it offers a way back. The
  // WWW-Authenticate header has to stay or the dialog stops appearing at all.
  return messageResponse(
    401,
    'Password required',
    'The Chill-Dogs admin is password protected. If no password box appeared, ' +
      'your browser is declining to ask again — reload the page, or sign in another way.',
    [{ href: LOGIN_PATH, label: 'Back to sign-in' }],
    cookies,
    { 'WWW-Authenticate': 'Basic realm="Chill-Dogs Admin", charset="UTF-8"' }
  );
}

function notConfiguredResponse(detail = 'Admin authentication is not configured.') {
  return messageResponse(503, 'Admin unavailable', detail);
}

/**
 * A browser's top-level page load. Browsers set Sec-Fetch-Mode on every request
 * and script cannot forge it; curl and other tooling send nothing at all.
 */
function isBrowserNavigation(request) {
  return request.headers.get('sec-fetch-mode') === 'navigate';
}

function isSignedOut(request) {
  return readCookie(request, SIGNED_OUT_COOKIE) === '1';
}

function signedOutPage(configuration, cookies = []) {
  return messageResponse(
    200,
    'Signed out',
    'You are signed out of the Chill-Dogs admin.',
    [{ href: LOGIN_PATH, label: 'Sign in again' }],
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

/**
 * Mints the state and hands the visitor to GitHub. This is a route rather than
 * a link built into the sign-in page because state minted at render time ages
 * from when the page was drawn: leave the tab open past the cookie's life, or
 * draw the page a second time in another tab, and the button carries a state
 * the cookie no longer holds. Minting on the click means the cookie is always
 * seconds old, and repeat renders mint nothing at all.
 */
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

  // Naming which check failed: collapsing these into one message made the page
  // useless for working out what actually went wrong.
  if (!code) {
    return messageResponse(
      403,
      'Sign-in could not be completed',
      'GitHub did not return an authorization code.',
      [{ href: LOGIN_PATH, label: 'Start again' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  if (!expectedState) {
    return messageResponse(
      403,
      'Sign-in expired',
      'This browser is not holding a sign-in in progress. That happens if the attempt ' +
        'sat unfinished for more than ten minutes, or if it began on a different address ' +
        'from the one GitHub returned to.',
      [{ href: LOGIN_PATH, label: 'Start again' }],
      [clearCookie(STATE_COOKIE, url)]
    );
  }

  if (!returnedState || !constantTimeEqual(returnedState, expectedState)) {
    return messageResponse(
      403,
      'Sign-in could not be verified',
      'The sign-in GitHub returned does not match the one this browser started.',
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

  // An already-authenticated visitor has no business being shown a sign-in page
  // or challenged for a password they do not need: send them where they were
  // going. Sign-out is excluded, for obvious reasons.
  if (path === LOGIN_PATH || path === BASIC_PATH || path === GITHUB_PATH) {
    const active = await verifySessionToken(
      configuration.sessionSecret,
      readCookie(request, SESSION_COOKIE),
      now
    );
    if (active) {
      return redirectResponse(safeNextPath(url.searchParams.get('next')));
    }
  }

  // These exist only here at the edge and are never built to files, so every
  // configuration mode has to handle them — letting one fall through to the
  // CDN is a 404.
  switch (path) {
    case LOGIN_PATH:
      // Reaching a landing page is not authenticating, so the sign-out mark has
      // to survive it — only a completed sign-in lifts that. What this page does
      // reset is the challenge, making it the "start over" door: without that,
      // dismissing the password dialog would leave the challenge spent and the
      // next attempt would hand back the browser's cached credentials in silence.
      return loginPage(url, configuration, [clearCookie(CHALLENGE_COOKIE, url)]);
    case GITHUB_PATH:
      return configuration.githubConfigured
        ? startGithubLogin(url, configuration)
        : notConfiguredResponse('GitHub sign-in is not configured for this deployment.');
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

  // A correct Basic header still admits CLI clients, which cannot follow the
  // browser redirect dance. It must not admit a browser page load: browsers
  // replay cached Basic credentials on every request forever, so honouring one
  // here walks the visitor past GitHub entirely and makes the primary sign-in
  // unreachable wherever both are configured. Browsers reach the password
  // fallback deliberately, through /admin/auth/basic/.
  if (
    configuration.basicConfigured &&
    !isBrowserNavigation(request) &&
    basicHeaderMatches(request, configuration)
  ) {
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
