import { getCookie, getIp } from '@/actions/common';
import { FetchError, FetchOptions, ofetch } from 'ofetch';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'auth_token';
const GUEST_ID = 'guest_tracking_id';
const SET_COOKIE = 'Set-Cookie';
const AUTHORIZATION = 'Authorization';

// =================================================================
// 📌 1. TYPES & INTERFACES (appFetch 관련 타입 정의)
// =================================================================

interface QueryFetchOptions extends Omit<
  FetchOptions,
  'method' | 'body' | 'params'
> {
  method?: 'get' | 'delete';
}
interface BodyFetchOptions extends Omit<
  FetchOptions,
  'method' | 'query' | 'params'
> {
  method: 'post' | 'put' | 'patch';
}

type ResponseApi<T> = {
  status: number;
  message: string;
  data: T | null;
};
type AppFetchOptions = QueryFetchOptions | BodyFetchOptions;
type FetchType = {
  <R>(path: string, options?: QueryFetchOptions): Promise<ResponseApi<R>>;
  <R>(path: string, options?: BodyFetchOptions): Promise<ResponseApi<R>>;
};
type NativeType = {
  (path: string, options?: QueryFetchOptions): Promise<Response>;
  (path: string, options?: BodyFetchOptions): Promise<Response>;
};

// =================================================================
// 📌 2. OFETCH INSTANCE & BASE INTERCEPTOR CONFIG (기본 인스턴스 및 설정)
// =================================================================

const fetchInterceptor: Pick<
  FetchOptions,
  'onRequest' | 'onResponse' | 'onRequestError' | 'onResponseError'
> = {
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

    const data = response?._data as ResponseApi<null>;
    const errorMessage =
      data?.message || response?.statusText || error?.message || 'API Error';
    const err = new FetchError(errorMessage);

    err.response = response;

    if (data) {
      err.data = data;
    }

    throw err;
  },
};

/**
 * $fetch 인스턴스 설정
 * - retry/retryStatusCodes: 408, 500 등 지정된 일시적 서버 에러 발생 시 ofetch가 3회 자동 재시도합니다.
 * - 401 (Unauthorized) 에러는 ofetch의 자동 재시도 대상에서 제외되며,
 *   하단의 native 및 fetch 함수 내에서 토큰 갱신(refreshAccessToken) 후 딱 1회 수동 재시도됩니다.
 */
const $fetch = ofetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  retry: 3,
  retryDelay: 1000,
  timeout: 2000,
  retryStatusCodes: [408, 409, 425, 429, 500, 502, 503, 504],
  ...fetchInterceptor,
});

// =================================================================
// 📌 3. HELPER FUNCTIONS (쿠키, 헤더 및 에러 처리 유틸리티)
// =================================================================

const returnError = (error: unknown) => {
  const defaultError = {
    status: 500,
    message: 'Internal Server Error',
    data: null,
  };

  if (error instanceof FetchError) {
    return {
      status: error.response?.status ?? error.status ?? 500,
      message: error.response?._data?.message ?? error.message ?? 'Fetch Error',
      data: error.data,
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
  for (const cookie of source.getSetCookie()) {
    if (cookie) {
      target.append(SET_COOKIE, cookie);
    }
  }
};

// =================================================================
// 📌 4. INTERCEPTOR COMPOSER (기본 & 커스텀 인터셉터 병합)
// =================================================================

/**
 * 기본 공통 인터셉터(fetchInterceptor)와 API 요청 시 전달된 커스텀 인터셉터(fetchOptions)를 병합하는 함수입니다.
 * ofetch는 인터셉터에 단일 함수뿐만 아니라 함수 배열(MaybeArray)도 지원하므로,
 * 두 종류의 인터셉터가 모두 존재할 경우 배열로 합쳐 순차적으로 동작하도록 제어합니다.
 *
 * @param fetchOptions - 병합할 대상이 되는 개별 API 요청의 fetch 옵션 객체
 */
const mergeFetchInterceptor = (fetchOptions: AppFetchOptions) => {
  /**
   * 단일 값 혹은 배열로 전달된 인터셉터를 하나의 안전한 배열로 결합하는 제네릭 헬퍼 함수입니다.
   * 린트 규칙 준수를 위해 중첩 삼항 연산자를 사용하지 않고 명시적인 분기로 배열화합니다.
   */
  const composeInterceptors = <T>(
    base: T | T[] | undefined,
    custom: T | T[] | undefined,
  ): T[] | undefined => {
    let baseArr: T[] = [];
    let customArr: T[] = [];
    if (base) {
      baseArr = Array.isArray(base) ? base : [base];
    }
    if (custom) {
      customArr = Array.isArray(custom) ? custom : [custom];
    }

    return [...baseArr, ...customArr];
  };

  // [onRequest] 공통 요청 전처리 인터셉터(IP, 토큰 설정 등)와 커스텀 요청 인터셉터를 병합합니다.
  if (fetchInterceptor.onRequest || fetchOptions.onRequest) {
    fetchOptions.onRequest = composeInterceptors(
      fetchInterceptor.onRequest,
      fetchOptions.onRequest,
    );
  }

  // [onRequestError] 요청 에러 인터셉터를 병합합니다.
  if (fetchInterceptor.onRequestError || fetchOptions.onRequestError) {
    fetchOptions.onRequestError = composeInterceptors(
      fetchInterceptor.onRequestError,
      fetchOptions.onRequestError,
    );
  }

  // [onResponse] 응답 성공 시 동작하는 인터셉터를 병합합니다.
  if (fetchInterceptor.onResponse || fetchOptions.onResponse) {
    fetchOptions.onResponse = composeInterceptors(
      fetchInterceptor.onResponse,
      fetchOptions.onResponse,
    );
  }

  // [onResponseError] 공통 응답 에러 처리 로직과 커스텀 응답 에러 인터셉터를 병합합니다.
  if (fetchInterceptor.onResponseError || fetchOptions.onResponseError) {
    fetchOptions.onResponseError = composeInterceptors(
      fetchInterceptor.onResponseError,
      fetchOptions.onResponseError,
    );
  }
};

// =================================================================
// 📌 5. CORE FETCH IMPLEMENTATIONS (native & appFetch 핵심 구현)
// =================================================================

let clientRefreshPromise: Promise<Response> | null = null;

/**
 * 401 에러 발생 시 토큰을 갱신하는 공통 헬퍼 함수
 */
const refreshAccessToken = async (native: NativeType): Promise<Response> => {
  const isClient = globalThis?.window !== undefined;

  const fetchRefresh = async () => {
    const refreshToken = await getCookie(REFRESH_TOKEN).catch(() => undefined);

    return native('/api/auth/access', {
      method: 'post',
      headers: new Headers({
        Cookie: refreshToken ? `${REFRESH_TOKEN}=${refreshToken}` : '',
      }),
    });
  };

  if (isClient) {
    clientRefreshPromise =
      clientRefreshPromise ??
      fetchRefresh().finally(() => {
        clientRefreshPromise = null;
      });

    return clientRefreshPromise;
  }

  return fetchRefresh();
};

const native = (async (
  path: string,
  options?: AppFetchOptions,
): Promise<Response> => {
  let accessResponse: Response | undefined = undefined;

  const result = await $fetch.raw(path, options).catch((error) => ({
    headers: error.response?.headers || {},
    status: error.response?.status || 500,
    statusText: error.response?.statusText || '',
    _data: returnError(error),
  }));

  const { headers, status, statusText, _data } = result;
  const data = typeof _data === 'object' ? JSON.stringify(_data) : _data;
  const responseHeaders = new Headers(headers);
  const errorData = _data as { status?: number } | null;

  responseHeaders.delete('content-length');

  if (
    errorData &&
    'status' in errorData &&
    errorData.status === 401 &&
    path !== '/api/auth/access'
  ) {
    accessResponse = await refreshAccessToken(native);
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
    const mergeOptions = { ...options } as AppFetchOptions;
    mergeFetchInterceptor(mergeOptions);
    const response = await $fetch(path, mergeOptions);

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
      const response = await refreshAccessToken(native);
      const clone = response.clone();

      if (clone.ok) {
        const opt = { ...options } as AppFetchOptions;
        const nextHeaders = new Headers(options?.headers);
        const isFetchBody =
          opt.method === 'post' ||
          opt.method === 'put' ||
          opt.method === 'patch';

        opt.headers = clone.headers;

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
