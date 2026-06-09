import { getCookie, getIp } from '@/actions/common';
import { ACCESS_TOKEN, GUEST_ID, REFRESH_TOKEN } from '@/constants/common';
import { ResponseApi } from '@/types/base';
import { FetchError, FetchOptions, ofetch } from 'ofetch';

interface AppFetchOptions extends FetchOptions {
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
}

//  ofetch create
//   https://github.com/unjs/ofetch
const $fetch = ofetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  retry: 3,
  retryDelay: 1000,
  timeout: 2000,
  // onRequest({ request, options }) {}
  // onResponse({ request, options, response }) {}
  // onRequestError({ request, options, error }) {}
  // onResponseError({ request, response, options }) {}
  async onRequest({ request, options }) {
    console.log('api request path: ', request);

    const [ip, accessToken, refreshToken, guestId] = await Promise.all([
      getIp().catch(() => 'Unknown IP'),
      getCookie(ACCESS_TOKEN).catch(() => undefined),
      getCookie(REFRESH_TOKEN).catch(() => undefined),
      getCookie(GUEST_ID).catch(() => undefined),
    ]);

    const headers = new Headers(options.headers);
    headers.set('X-Forwarded-For', ip);

    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    if (refreshToken) {
      // Refresh Token은 전용 헤더나 쿠키 포맷에 맞춰 설정
      headers.set('Cookie', `${REFRESH_TOKEN}=${refreshToken}`);
    }
    if (guestId) {
      headers.set('X-Guest-Id', guestId);
    }

    options.headers = headers;
  },
  async onResponseError({ response, error }) {
    if (error && !(error instanceof FetchError)) {
      throw new FetchError(error.message, { cause: error.cause });
    }

    const data = response._data as ResponseApi<null>;
    const errorMessage = data?.message || response.statusText || 'API Error';
    const err = new FetchError(errorMessage);

    err.response = response;

    throw err;
  },
});

const returnError = (error: unknown) => {
  const defaultError = {
    status: 500,
    message: 'Internal Server Error',
    data: null,
  };

  if (error instanceof FetchError) {
    return {
      status: error.response?.status || error.status || 500,
      message: error.message || 'Fetch Error',
      data: null,
    };
  }

  if (error instanceof Error) {
    return {
      ...defaultError,
      message: error.message,
    };
  }

  return defaultError;
};

const native = async (
  path: string,
  options?: AppFetchOptions,
): Promise<Response> => {
  const result = await $fetch.raw(path, options).catch((error) => ({
    headers: error.response?.headers || {},
    status: error.response?.status || 500,
    statusText: error.message,
    _data: returnError(error),
  }));

  const { headers, status, statusText, _data } = result;
  const data = typeof _data === 'object' ? JSON.stringify(_data) : _data;

  const responseHeaders = new Headers(headers);
  responseHeaders.delete('content-length');

  return new Response(data, {
    status,
    statusText,
    headers: responseHeaders,
  });
};

const fetch = async <R = unknown>(
  path: string,
  options?: AppFetchOptions,
): Promise<ResponseApi<R>> => {
  try {
    const response = await $fetch(path, options);

    if (!response) {
      throw new Error('do not get response data.');
    }
    if (typeof response === 'object' && 'data' in response) {
      return response as ResponseApi<R>;
    }

    return {
      status: 200,
      message: 'success',
      data: response as R,
    };
  } catch (error) {
    return returnError(error);
  }
};

/**
 * app fetch
 * data fetching function base ofetch
 * @param path
 * @param options
 * @returns
 */
export const appFetch = Object.assign(fetch, {
  native,
});
