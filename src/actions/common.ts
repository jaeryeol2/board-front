'use server';

import { revalidatePath } from 'next/cache';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies, headers } from 'next/headers';

export const clearCache = async (path: string, type: 'layout' | 'page') => {
  revalidatePath(path, type);
};

export const clearCacheAll = async () => {
  await clearCache('/', 'layout');
};

/**
 * Next.js Server Action Context에서 동작하는 쿠키 설정 함수.
 * 클라이언트(브라우저) 쿠키 저장소에 직접 접근하는 대신, Node.js 런타임 서버(엣지런타임) 측의 HTTP Response Header 버퍼(Server-side Cookie Buffer)에
 * `Set-Cookie` 메타데이터를 선언적으로 주입하는 Node.js 서버 쿠키 조작(Server-side Cookie Manipulation) 프로세스입니다.
 * 최종적으로 웹 브라우저(User Agent)가 해당 응답을 수신하는 시점에 클라이언트 측 쿠키 저장소로 동기화 및 영속화(Persistence)됩니다.
 */
export const setCookie = async (
  key: string,
  value: string,
  options?: ResponseCookie | Record<string, string | number | boolean>,
) => {
  const cookie = await cookies();
  cookie.set(key, value, { path: '/', ...options });
};

export const getCookie = async (key: string) => {
  return (await cookies()).get(key)?.value;
};

export const getHeader = async () => {
  return await headers();
};

export const getIp = async () => {
  const headersList = await getHeader();
  const xForwardedFor = headersList.get('x-forwarded-for');
  const clientIp =
    xForwardedFor?.split(',')[0].trim() ||
    headersList.get('x-real-ip') ||
    'Unknown IP';

  if (clientIp === '::1') {
    return '127.0.0.1';
  }

  return clientIp;
};

export const deleteCookie = async (key: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(key);
};
