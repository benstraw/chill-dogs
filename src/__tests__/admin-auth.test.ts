import { describe, expect, it } from 'vitest';

import { authorizeAdminRequest, config } from '../../middleware';

const credentials = {
  ADMIN_USERNAME: 'chill-admin',
  ADMIN_PASSWORD: 'long:password-with-colon',
};

function adminRequest(authorization?: string): Request {
  return new Request('https://www.chill-dogs.com/admin/', {
    headers: authorization ? { authorization } : undefined,
  });
}

function basicAuthorization(username: string, password: string): string {
  return `Basic ${btoa(`${username}:${password}`)}`;
}

describe('admin authentication middleware', () => {
  it('is scoped to every admin route', () => {
    expect(config.matcher).toBe('/admin/:path*');
  });

  it('allows valid credentials to continue to the static admin page', () => {
    const response = authorizeAdminRequest(
      adminRequest(basicAuthorization(credentials.ADMIN_USERNAME, credentials.ADMIN_PASSWORD)),
      credentials
    );

    expect(response).toBeUndefined();
  });

  it('challenges requests without valid credentials and prevents caching', () => {
    const missing = authorizeAdminRequest(adminRequest(), credentials);
    const incorrect = authorizeAdminRequest(
      adminRequest(basicAuthorization(credentials.ADMIN_USERNAME, 'incorrect')),
      credentials
    );

    for (const response of [missing, incorrect]) {
      expect(response?.status).toBe(401);
      expect(response?.headers.get('www-authenticate')).toContain('Chill-Dogs Admin');
      expect(response?.headers.get('cache-control')).toBe('no-store');
    }
  });

  it('rejects malformed authorization values', () => {
    const unsupported = authorizeAdminRequest(adminRequest('Bearer token'), credentials);
    const malformedBase64 = authorizeAdminRequest(adminRequest('Basic !!!'), credentials);
    const missingSeparator = authorizeAdminRequest(adminRequest(`Basic ${btoa('username-only')}`), credentials);

    expect(unsupported?.status).toBe(401);
    expect(malformedBase64?.status).toBe(401);
    expect(missingSeparator?.status).toBe(401);
  });

  it('fails closed when deployed credentials are missing', () => {
    const response = authorizeAdminRequest(adminRequest(), {});

    expect(response?.status).toBe(503);
    expect(response?.headers.get('www-authenticate')).toBeNull();
    expect(response?.headers.get('cache-control')).toBe('no-store');
  });
});
