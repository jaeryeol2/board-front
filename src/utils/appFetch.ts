import { getCookie, getIp } from '@/actions/common';
import { ACCESS_TOKEN, GUEST_ID, REFRESH_TOKEN } from '@/constants/common';
import { ResponseApi } from '@/types/base';
import { FetchError, FetchOptions, ofetch } from 'ofetch';

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
      getIp().catch(() => ''),
      getCookie(ACCESS_TOKEN).catch(() => ''),
      getCookie(REFRESH_TOKEN).catch(() => ''),
      getCookie(GUEST_ID).catch(() => ''),
    ]);

    options.headers.set('X-Forwarded-For', ip);
    options.headers.set('Authorization', `Bearer ${accessToken ?? ''}`);
    options.headers.set('Cookie', `${REFRESH_TOKEN}=${refreshToken ?? ''}`);
    options.headers.set('X-Guest-Id', guestId ?? '');
  },
  async onResponseError({ response, error }) {
    if (error) {
      throw new FetchError(error.message, { cause: error.cause });
    }

    const data = response._data as ResponseApi<null>;
    const err = new FetchError(data.message);

    err.response = response;

    throw err;
  },
});

const returnError = (error: unknown) => {
  const returnError = {
    status: 404,
    message: 'Unknown Error',
    data: null,
  };

  if (error instanceof FetchError) {
    return {
      ...returnError,
      status: error.response?.status
        ? error.response.status
        : (error?.status ?? returnError.status),
      message: error?.message ? error.message : returnError.message,
    };
  }
  if (error instanceof Error) {
    return {
      ...returnError,
      message: error.message,
    };
  }

  return returnError;
};

const native = async (
  path: string,
  options?: FetchOptions,
): Promise<Response> => {
  const { headers, status, statusText, _data } = await $fetch.raw(
    path,
    options,
  );
  const data = typeof _data === 'object' ? JSON.stringify(_data) : _data;

  return new Response(data, {
    headers: (() => {
      const h = new Headers(headers);
      h.delete('content-length');

      return h;
    })(),
    status,
    statusText,
  });
};

const fetch = async <R = unknown>(
  path: string,
  options?: FetchOptions,
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
