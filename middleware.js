export const config = {
  matcher: '/admin/:path*',
};

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

function unauthorizedResponse() {
  return new Response('Authentication required.', {
    status: 401,
    headers: {
      'Cache-Control': 'no-store',
      'Content-Type': 'text/plain; charset=utf-8',
      'WWW-Authenticate': 'Basic realm="Chill-Dogs Admin", charset="UTF-8"',
    },
  });
}

export function authorizeAdminRequest(
  request,
  environment
) {
  const expectedUsername = environment.ADMIN_USERNAME?.trim();
  const expectedPassword = environment.ADMIN_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new Response('Admin authentication is not configured.', {
      status: 503,
      headers: {
        'Cache-Control': 'no-store',
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  }

  const authorization = request.headers.get('authorization');
  if (!authorization?.startsWith('Basic ')) {
    return unauthorizedResponse();
  }

  try {
    const decoded = atob(authorization.slice('Basic '.length));
    const separatorIndex = decoded.indexOf(':');
    if (separatorIndex === -1) {
      return unauthorizedResponse();
    }

    const username = decoded.slice(0, separatorIndex);
    const password = decoded.slice(separatorIndex + 1);
    const usernameMatches = constantTimeEqual(username, expectedUsername);
    const passwordMatches = constantTimeEqual(password, expectedPassword);

    return usernameMatches && passwordMatches ? undefined : unauthorizedResponse();
  } catch {
    return unauthorizedResponse();
  }
}

export default function middleware(request) {
  const authenticationResponse = authorizeAdminRequest(request, {
    ADMIN_USERNAME: process.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  });

  return authenticationResponse ?? continueResponse();
}
