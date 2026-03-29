import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN,
  RERESH_TOKEN,
  SET_COOKIE,
  X_CURRENT_PATH,
  X_IS_LOGIN,
} from './constants/common';
import { appFetch } from './utils/appFetch';
import { tokenUtil } from './utils/tokenUtil';

const REDIRECT_PATH_SET = new Set(['/login', '/signup']);

const redirectValidate = (request: NextRequest, isLogin: boolean) => {
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  const validate = [() => isLogin && REDIRECT_PATH_SET.has(path)];

  return validate.every((func) => func());
};
const nextResponse = (
  request: NextRequest,
  isLogin: boolean,
  cookie: string,
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
      [SET_COOKIE]: cookie,
    },
  });

  return nextResponse;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*.png$|.*.ico|.*.json).*)'],
};

export async function proxy(request: NextRequest) {
  let isLogin = false;
  let cookie = request.cookies.toString();
  const { verifyToken } = tokenUtil();
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value || '';
  const refreshToken = request.cookies.get(RERESH_TOKEN)?.value || '';

  try {
    await verifyToken(accessToken);
    isLogin = true;
  } catch (error) {
    console.error('auth token error : ', (error as { code: string }).code);
  }

  if (!isLogin) {
    try {
      await verifyToken(refreshToken);

      const response = await appFetch.native('/api/auth/access', {
        method: 'post',
      });

      cookie = response.headers.get(SET_COOKIE) || '';
      const accessToken = cookie
        .split(';')[0]
        .replaceAll(`${ACCESS_TOKEN}=`, '');

      request.cookies.set(ACCESS_TOKEN, accessToken);
      isLogin = true;
    } catch (error) {
      console.error('refresh token error : ', (error as { code: string }).code);
    }
  }

  return nextResponse(request, isLogin, cookie);
}
