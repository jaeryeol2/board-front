import { NextRequest, NextResponse } from 'next/server';
import { FetchError } from 'ofetch';
import {
  ACCESS_TOKEN,
  GUEST_ID,
  REFRESH_TOKEN,
  SET_COOKIE,
  X_CURRENT_PATH,
  X_IS_LOGIN,
} from './constants/common';
import { ResponseApi } from './types/base';
import { appFetch } from './utils/appFetch';
import { tokenUtil } from './utils/tokenUtil';

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*.png$|.*.ico|.*.json).*)'],
};

export async function proxy(request: NextRequest) {
  const header = new Headers();
  const { verifyToken } = tokenUtil();
  const accessToken = request.cookies.get(ACCESS_TOKEN)?.value || '';
  const refreshToken = request.cookies.get(REFRESH_TOKEN)?.value || '';
  const guestId = request.cookies.get(GUEST_ID)?.value || '';

  if (!guestId) {
    try {
      await verifyToken(accessToken);
      const { data, message } = await appFetch<boolean>('/api/auth/check');

      if (data) {
        return nextResponse(request, data, header);
      }

      throw new Error(message);
    } catch (error) {
      console.warn('access token error : ', returnError(error).message);
    }

    try {
      await verifyToken(refreshToken);
      const response = await appFetch.native('/api/auth/check');
      const { data, message } = (await response.json()) as ResponseApi<boolean>;

      if (response.ok && data) {
        const responseHeaders = response.headers;

        setRequestCookie(request, responseHeaders);
        return nextResponse(request, data, responseHeaders);
      }

      throw new Error(message);
    } catch (error) {
      console.warn('refresh token error : ', returnError(error).message);
      const response = await appFetch.native('/api/token-expire', {
        method: 'post',
      });

      setRequestCookie(request, response.headers);
      setResponseCookie(response.headers.getSetCookie(), header);
    }
  }

  return nextResponse(request, false, header);
}

const REDIRECT_PATH_SET = new Set(['/login', '/signup']);

/**
 * redirect check함수
 * @param request
 * @param isLogin
 * @returns
 */
const redirectValidate = (request: NextRequest, isLogin: boolean) => {
  const { nextUrl } = request;
  const path = nextUrl.pathname;
  const validator = [() => isLogin && REDIRECT_PATH_SET.has(path)];

  return request.method === 'GET' && validator.every((func) => func());
};

/**
 * request 쿠키 set
 * @param request
 * @param headers
 */
const setRequestCookie = (request: NextRequest, headers: Headers) => {
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === SET_COOKIE.toLowerCase()) {
      request.headers.append(SET_COOKIE.replaceAll('Set-', ''), value);
      continue;
    }

    request.headers.append(key, value);
  }
};

/**
 * response 쿠키 set
 * @param cookies
 * @param headers
 */
const setResponseCookie = (cookies: Array<string>, headers: Headers) => {
  if (cookies && cookies.length > 0) {
    for (const cookie of cookies) {
      headers.append(SET_COOKIE, cookie);
    }
  }
};

/**
 * Next response 함수
 * @param request
 * @param isLogin
 * @param header
 * @returns
 */
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
      [X_IS_LOGIN]: `${isLogin}`,
    },
  });

  setResponseCookie(header.getSetCookie(), nextResponse.headers);

  return nextResponse;
};

/**
 * 에러 조합함수
 * @param error
 * @returns
 */
const returnError = (error: unknown) => {
  const returnError = {
    status: 404,
    message: 'Unknown Error',
    data: null,
  };

  if (error instanceof Error) {
    return {
      ...returnError,
      message: error.message,
    };
  }
  if (error instanceof FetchError) {
    return {
      ...returnError,
      status: error.response?.status
        ? error.response.status
        : (error?.status ?? returnError.status),
      message: error?.message ? error.message : returnError.message,
    };
  }

  return returnError;
};
