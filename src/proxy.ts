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

const parseCookie = (cookie: string) => {
  const parts = cookie.split(';').map((p) => p.trim());

  // 첫 번째 요소는 항상 name=value 형태
  const [name, ...valueParts] = parts[0].split('=');
  const value = valueParts.join('='); // 토큰 내부에 = 이 포함될 경우 대비

  const options: Record<string, unknown> = {};

  // 나머지 속성들 파싱
  parts.slice(1).forEach((part) => {
    const [key, val] = part.split('=');
    const lowerKey = key.toLowerCase();

    switch (lowerKey) {
      case 'path':
        options.path = val;
        break;
      case 'max-age':
        options.maxAge = Number.parseInt(val, 10);
        break;
      case 'expires':
        options.expires = new Date(val);
        break;
      case 'secure':
        options.secure = true;
        break;
      case 'httponly':
        options.httpOnly = true;
        break;
      case 'samesite':
        options.sameSite = val.toLowerCase();
        break;
      case 'domain':
        options.domain = val;
        break;
      case 'priority':
        options.priority = val.toLowerCase();
        break;
      case 'partitioned':
        options.partitioned = true;
        break;
    }
  });

  return { name, value, options };
};

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*.png$|.*.ico|.*.json).*)'],
};

export async function proxy(request: NextRequest) {
  let isLogin = false;
  let setCookie = '';
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

      setCookie = response.headers.get(SET_COOKIE) || '';

      const newAccessToken = parseCookie(setCookie);
      request.cookies.set({
        name: newAccessToken.name,
        value: newAccessToken.value,
        ...newAccessToken.options,
      });

      isLogin = true;
    } catch (error) {
      console.error('refresh token error : ', (error as { code: string }).code);
    }
  }

  return nextResponse(request, isLogin, setCookie);
}
