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

export const setCookie = async (
  key: string,
  value: string,
  options?: ResponseCookie,
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
