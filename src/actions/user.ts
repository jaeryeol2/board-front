'use server';

import { redirect, RedirectType } from 'next/navigation';
import { clearCacheAll } from './common';

const REDIRECT_BASE = 'http://internal.invalid';

/**
 * 로그인 후 이동 경로는 같은 사이트 내부 경로만 허용합니다. (오픈 리다이렉트 방지)
 * 브라우저와 같은 URL 파서로 해석해 '//evil.com', '/\\evil.com', 제어문자 삽입 등 외부 origin이 되면 '/'로 이동합니다.
 */
const toSafeRedirectPath = (path?: string) => {
  if (!path?.startsWith('/')) {
    return '/';
  }

  try {
    const url = new URL(path, REDIRECT_BASE);
    return url.origin === REDIRECT_BASE
      ? `${url.pathname}${url.search}${url.hash}`
      : '/';
  } catch {
    return '/';
  }
};

export const loginAction = async (path?: string) => {
  await clearCacheAll();
  redirect(toSafeRedirectPath(path), RedirectType.replace);
};

export const logoutAction = async (path?: string) => {
  await clearCacheAll();
  redirect(path ?? '/', RedirectType.replace);
};
