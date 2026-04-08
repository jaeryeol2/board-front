import { NextRequest, NextResponse } from 'next/server';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  SET_COOKIE,
  X_CURRENT_PATH,
  X_IS_LOGIN,
} from './constants/common';
import { ResponseApi } from './types/base';
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
  header: Headers,
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

  const setCookies = header.getSetCookie();

  if (setCookies && setCookies.length > 0) {
    for (const cookie of setCookies) {
      nextResponse.headers.append(SET_COOKIE, cookie);
    }
  }

  return nextResponse;
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*.png$|.*.ico|.*.json).*)'],
};

export async function proxy(request: NextRequest) {
  const header = new Headers();
  const { verifyToken } = tokenUtil();
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value || '';
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value || '';

  if (accessToken || refreshToken) {
    try {
      await verifyToken(accessToken);
      return nextResponse(request, true, header);
    } catch (error) {
      console.error('access token error : ', (error as { code: string }).code);
    }

    try {
      await verifyToken(refreshToken);

      const response = await appFetch.native('/api/auth/access', {
        method: 'post',
      });
      const result = (await response.json()) as ResponseApi<boolean>;

      for (const [key, value] of response.headers.entries()) {
        if (key.toLowerCase() === SET_COOKIE.toLowerCase()) {
          request.headers.append(SET_COOKIE.replaceAll('Set-', ''), value);
          continue;
        }

        request.headers.append(key, value);
      }

      return nextResponse(request, result.data ?? false, response.headers);
    } catch (error) {
      console.error('refresh token error : ', (error as { code: string }).code);
    }
  }

  return nextResponse(request, false, header);
}
