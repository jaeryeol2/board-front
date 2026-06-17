import { getCookie, getIp } from '@/actions/common';
import {
  ACCESS_TOKEN,
  AUTHORIZATION,
  GUEST_ID,
  REFRESH_TOKEN,
  SET_COOKIE,
} from '@/constants/common';
import { ResponseApi } from '@/types/base';
import { FetchError, FetchOptions, ofetch } from 'ofetch';

interface QueryFetchOptions extends Omit<
  FetchOptions,
  'method' | 'body' | 'params'
> {
  method?: 'get' | 'delete';
}
interface BodyFetchOptons extends Omit<
  FetchOptions,
  'method' | 'query' | 'params'
> {
  method: 'post' | 'put' | 'patch';
}

type AppFetchOptions = QueryFetchOptions | BodyFetchOptons;

type FetchType = {
  <R>(path: string, options?: QueryFetchOptions): Promise<ResponseApi<R>>;
  <R>(path: string, options?: BodyFetchOptons): Promise<ResponseApi<R>>;
};

type NativeType = {
  (path: string, options?: QueryFetchOptions): Promise<Response>;
  (path: string, options?: BodyFetchOptons): Promise<Response>;
};

//  ofetch create
//   https://github.com/unjs/ofetch
const $fetch = ofetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  retry: 3,
  retryDelay: 1000,
  timeout: 2000,
  // 400, 401, 403 등의 클라이언트 오류나 인증 만료는 재시도하지 않도록 제한
  retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
  // onRequest({ request, options }) {}
  // onResponse({ request, options, response }) {}
  // onRequestError({ request, options, error }) {}
  // onResponseError({ request, response, options }) {}
  async onRequest({ request, options }) {
    console.log('api request path: ', request);

    const [ip, accessToken, guestId] = await Promise.all([
      getIp().catch(() => 'Unknown IP'),
      getCookie(ACCESS_TOKEN).catch(() => undefined),
      getCookie(GUEST_ID).catch(() => undefined),
    ]);

    const headers = new Headers(options.headers);
    headers.set('X-Forwarded-For', ip);

    if (accessToken) {
      headers.set(AUTHORIZATION, `Bearer ${accessToken}`);
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

    // null guard 추가
    const data = response?._data as ResponseApi<null>;
    const errorMessage =
      data?.message || response?.statusText || error?.message || 'API Error';
    const err = new FetchError(errorMessage);

    err.response = response;

    // 백엔드의 구체적인 비즈니스 오류 본문을 보존하여 전파
    if (data) {
      err.data = data;
    }

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
      // 백엔드가 제공한 비즈니스 데이터를 클라이언트단에 최종 노출
      data: error.data || null,
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

const setAccessTokenHeaders = (headers: Headers, response: Response) => {
  const optHeaders = response.headers;

  headers.delete(AUTHORIZATION);

  for (const cookie of optHeaders.getSetCookie()) {
    const cookieInfo =
      cookie
        .split(';')
        .map((str) => str.trim())
        .find(Boolean) ?? '';
    const info = cookieInfo.split('=').map((item) => item.trim());
    const key = info[0];
    const value = info[1] ?? '';

    if (key === ACCESS_TOKEN) {
      headers.set(AUTHORIZATION, `Bearer ${value}`);
      continue;
    }

    headers.set(key, value);
  }
};

const appendSetCookieHeaders = (target: Headers, source: Headers) => {
  // 토큰 재발급 응답에서 반드시 브라우저에 전달되어 영속화되어야 하는 Set-Cookie 헤더만 선별 복사합니다.
  // 전체 헤더를 무조건 append할 경우 content-type, content-length 등 본문 데이터 구조 관련 헤더들이 오염될 우려가 있습니다.
  for (const cookie of source.getSetCookie()) {
    target.append(SET_COOKIE, cookie);
  }
};

let clientRefreshPromise: Promise<Response> | null = null;
const native = (async (
  path: string,
  options?: AppFetchOptions,
): Promise<Response> => {
  let accessResponse: Response | undefined = undefined;

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

  if (
    'status' in _data &&
    _data.status === 401 &&
    path !== '/api/auth/access'
  ) {
    const isClient = globalThis?.window !== undefined;

    const fetchRefresh = async () => {
      const refreshToken = await getCookie(REFRESH_TOKEN);

      return native('/api/auth/access', {
        method: 'post',
        headers: new Headers({
          Cookie: refreshToken ? `${REFRESH_TOKEN}=${refreshToken}` : '',
        }),
      });
    };

    if (isClient) {
      // 클라이언트(브라우저) 환경:
      // 여러 병렬 API 요청이 동시에 401을 반환할 때, 중복으로 토큰 갱신 API(/api/auth/access)를
      // 호출하지 않도록 전역 Promise로 락(Lock)을 공유하여 단 한 번만 실행되도록 제어합니다.
      clientRefreshPromise =
        clientRefreshPromise ??
        fetchRefresh().finally(() => {
          clientRefreshPromise = null;
        });

      accessResponse = await clientRefreshPromise;
    } else {
      // 서버(SSR) 환경:
      // 서버 메모리는 모든 사용자의 HTTP 요청에 공유되므로, 전역 변수로 락을 공유하면
      // 다른 사용자 간의 토큰/쿠키 컨텍스트가 교차 오염되는 보안 위험(Cross-Request State Pollution)이 발생합니다.
      // 따라서 서버 사이드에서는 전역 락을 공유하지 않고 각 요청별로 독립 실행하여 안전하게 격리합니다.
      accessResponse = await fetchRefresh();
    }
    const clone = accessResponse.clone();

    if (clone.ok) {
      const opt = { ...options } as AppFetchOptions;
      const nextHeaders = new Headers(options?.headers);
      const isFetchBody =
        opt.method === 'post' || opt.method === 'put' || opt.method === 'patch';

      setAccessTokenHeaders(nextHeaders, clone);
      opt.headers = nextHeaders;

      const finalResponse = isFetchBody
        ? await native(path, opt)
        : await native(path, opt as QueryFetchOptions);

      // 재귀 호출로 받아온 최종 Response의 헤더에, 이 단계에서 획득한 refreshResponse의 Set-Cookie 헤더들을 복사/병합합니다.
      const finalHeaders = new Headers(finalResponse.headers);
      appendSetCookieHeaders(finalHeaders, clone.headers);

      return new Response(finalResponse.body, {
        status: finalResponse.status,
        statusText: finalResponse.statusText,
        headers: finalHeaders,
      });
    }
  }

  if (accessResponse) {
    appendSetCookieHeaders(responseHeaders, accessResponse.headers);
  }

  return new Response(data, {
    status,
    statusText,
    headers: responseHeaders,
  });
}) as NativeType;

const fetch = (async <R = unknown>(
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
    const errorInfo = returnError(error);

    if (errorInfo.status === 401 && path !== '/api/auth/access') {
      const response = await native('/api/auth/access', {
        method: 'post',
      });
      const clone = response.clone();
      const opt = { ...options } as AppFetchOptions;
      const isFetchBody =
        opt.method === 'post' || opt.method === 'put' || opt.method === 'patch';

      opt.headers = clone.headers;

      if (clone.ok) {
        const nextHeaders = new Headers(options?.headers);

        setAccessTokenHeaders(nextHeaders, clone);
        opt.headers = nextHeaders;

        return isFetchBody
          ? fetch<R>(path, opt)
          : fetch<R>(path, opt as QueryFetchOptions);
      }
    }

    return errorInfo;
  }
}) as FetchType;

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
