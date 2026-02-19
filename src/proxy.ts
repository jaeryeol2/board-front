import { NextRequest, NextResponse } from 'next/server';
import { SET_COOKIE, X_CURRENT_PATH, X_IS_LOGIN } from './constants/common';
import { appFetch } from './utils/appFetch';
import { tokenUtil } from './utils/tokenUtil';

const REDIRECT_PATH_SET = new Set(['/login', '/signup']);

const redirectValidate = (request: NextRequest, isLogin: boolean) => {
  const { nextUrl } = request;
  const path = nextUrl.pathname;

  const validate = [
    () => {
      return isLogin && REDIRECT_PATH_SET.has(path);
    },
  ];

  return validate.every((func) => func());
};
const nextResponse = (
  request: NextRequest,
  isLogin: boolean,
  cookie: string | null,
) => {
  const { nextUrl, headers } = request;
  const path = nextUrl.pathname;

  if (redirectValidate(request, isLogin)) {
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  const nextResponse = NextResponse.next({
    request: {
      headers,
    },
    headers: {
      [X_CURRENT_PATH]: path,
      [X_IS_LOGIN]: `${isLogin ?? false}`,
    },
  });

  if (cookie) {
    nextResponse.headers.set(SET_COOKIE, cookie);
  }

  return nextResponse;
};

export const config = {
  matcher: [
    String.raw`/((?!api|_next/static|_next/image|.*\\.png$|.*\\.ico|.*\\.json).*)`,
  ],
};
export async function proxy(request: NextRequest) {
  let isLogin = false;
  let cookie = null;
  const { verifyToken } = tokenUtil();
  const authToken = request.headers.get('auth_token') || '';

  try {
    await verifyToken(authToken);
    isLogin = true;
  } catch {
    const refreshToken = request.headers.get('refresh_token') || '';
    await verifyToken(refreshToken);
    // auth token get
    const response = await appFetch('/api/auth', { useNative: true });
    cookie = response.headers.get(SET_COOKIE);
    isLogin = true;
  } finally {
    isLogin = false;
  }

  return nextResponse(request, isLogin, cookie);
}
