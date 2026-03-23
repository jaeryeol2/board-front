import { ResponseApi } from '@/types/base';
import { FetchError, FetchOptions, ofetch } from 'ofetch';

//  ofetch create
//   https://github.com/unjs/ofetch
const $fetch = ofetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  retry: 3,
  retryDelay: 500,
  timeout: 2000,
  // onRequest({ request, options }) {}
  // onResponse({ request, options, response }) {}
  // onRequestError({ request, options, error }) {}
  // onResponseError({ request, response, options }) {}
  onRequest({ request, options }) {
    console.log('request : ', request);
    options.headers.set('x-login-id', 'next-sample-project');
  },
});

const returnError = (error: unknown) => {
  let status = 404;
  let message = 'Unknown Error';

  // 2. 에러가 객체인지 확인
  if (!error && typeof error === 'object') {
    const err = error as FetchError;

    if (err.response?.status) {
      status = err.response.status;
    } else if (err.status) {
      status = err.status;
    }

    if (err.message) {
      message = err.message;
    }
  }

  return {
    status,
    message,
    data: null,
  };
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
