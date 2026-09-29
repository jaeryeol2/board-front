import { getCookie, getIp } from '@/actions/common';
import {
  AppFetchOptions,
  appFetch as baseFetch,
  getData,
  returnError,
} from 'app-fetch';

const ACCESS_TOKEN = 'access_token';
const REFRESH_TOKEN = 'auth_token';
const GUEST_ID = 'guest_tracking_id';
const SET_COOKIE = 'Set-Cookie';
const AUTHORIZATION = 'Authorization';

// =================================================================
// 📌 1. TYPES & INTERFACES (appFetch 관련 타입 정의)
// =================================================================

type ResponseApi<T> = {
  status: number;
  message: string;
  data: T | null;
};

// =================================================================
// 📌 2. APP-FETCH INSTANCE CONFIG (기본 인스턴스 및 설정)
// =================================================================

/**
 * app-fetch 인스턴스 설정
 * - retry: 408, 429, 5xx 및 네트워크 에러 발생 시 app-fetch가 3회 자동 재시도합니다.
 *   멱등하지 않은 post/patch는 중복 처리 방지를 위해 app-fetch가 재시도하지 않습니다.
 * - timeout: beforeRequest(server action 호출 포함)부터 응답 헤더 수신까지 시도당 적용됩니다.
 *   브라우저에서는 server action이 네트워크 왕복이므로 서버보다 길게 잡습니다.
 * - 401 (Unauthorized) 에러는 자동 재시도 대상이 아니며,
 *   하단의 native 함수에서 토큰 갱신(refreshAccessToken) 후 딱 1회 수동 재시도됩니다.
 */
const $fetch = baseFetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  retry: 3,
  delay: 1000,
  timeout: globalThis?.window === undefined ? 2000 : 5000,
  async beforeRequest(options) {
    const [ip, accessToken, guestId] = await Promise.all([
      getIp().catch(() => 'Unknown IP'),
      getCookie(ACCESS_TOKEN).catch(() => undefined),
      getCookie(GUEST_ID).catch(() => undefined),
    ]);

    const headers = new Headers(options.headers);
    headers.set('X-Forwarded-For', ip);

    // 토큰 갱신 후 재시도 시 호출부에서 넣은 새 토큰을 쿠키의 이전 토큰으로 덮어쓰지 않습니다.
    if (accessToken && !headers.has(AUTHORIZATION)) {
      headers.set(AUTHORIZATION, `Bearer ${accessToken}`);
    }
    if (guestId) {
      headers.set('X-Guest-Id', guestId);
    }

    options.headers = headers;
  },
});

// =================================================================
// 📌 3. HELPER FUNCTIONS (쿠키, 헤더 및 응답 변환 유틸리티)
// =================================================================

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

/**
 * 토큰 갱신 응답의 Set-Cookie를 대상 응답 헤더에 추가한 새 Response를 반환합니다.
 */
const withRefreshCookies = (response: Response, refresh: Response) => {
  const headers = new Headers(response.headers);

  appendSetCookieHeaders(headers, refresh.headers);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

/**
 * 파싱된 응답 본문을 백엔드 공통 응답 규격(ResponseApi)으로 변환합니다.
 * app-fetch는 4xx/5xx를 예외 없이 Response로 반환하므로 response.ok로 에러를 판별합니다.
 */
const toResponseApi = <R>(
  response: Response,
  body: unknown,
): ResponseApi<R> => {
  const api =
    typeof body === 'object' && body !== null
      ? (body as Partial<ResponseApi<R>>)
      : null;

  if (!response.ok) {
    return {
      status: response.status,
      message: api?.message ?? (response.statusText || 'API Fetch Error.'),
      data: api?.data ?? null,
    };
  }
  if (!body) {
    return { status: 500, message: 'do not get response data.', data: null };
  }
  if (api) {
    return {
      status: api.status ?? response.status,
      message: api.message ?? 'success',
      data: api.data ?? null,
    };
  }

  return { status: 200, message: 'success', data: body as R };
};

// =================================================================
// 📌 4. CORE FETCH IMPLEMENTATIONS (native & appFetch 핵심 구현)
// =================================================================

let clientRefreshPromise: Promise<Response> | null = null;

/**
 * 401 에러 발생 시 토큰을 갱신하는 공통 헬퍼 함수
 */
const refreshAccessToken = async (
  native: (
    path: string,
    options?: AppFetchOptions | undefined,
  ) => Promise<Response>,
): Promise<Response> => {
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

/**
 * 공통 인스턴스로 요청합니다.
 * HTTP 에러(4xx/5xx)는 그대로 Response로 반환되고, 네트워크 에러·타임아웃만 500 Response로 변환합니다.
 */
const request = (path: string, options?: AppFetchOptions): Promise<Response> => {
  console.log('api request path: ', path);

  return $fetch(path, options).catch((error: unknown) =>
    Response.json(returnError(error), { status: 500 }),
  );
};

const native = async (
  path: string,
  options?: AppFetchOptions,
): Promise<Response> => {
  const response = await request(path, options);

  if (response.status !== 401 || path === '/api/auth/access') {
    return response;
  }

  const clone = (await refreshAccessToken(native)).clone();

  if (!clone.ok) {
    return withRefreshCookies(response, clone);
  }

  const headers = new Headers(options?.headers);

  setAccessTokenHeaders(headers, clone);

  // 갱신된 토큰으로 1회만 재시도합니다 (재시도 응답이 401이어도 다시 갱신하지 않음).
  return withRefreshCookies(await request(path, { ...options, headers }), clone);
};

const fetchData = async <R = unknown>(
  path: string,
  options?: AppFetchOptions,
): Promise<ResponseApi<R>> => {
  try {
    const response = await native(path, options);

    return toResponseApi<R>(response, await getData(response));
  } catch (error) {
    return returnError<R>(error);
  }
};

/**
 * app fetch
 * data fetching function base app-fetch
 * @param path
 * @param options
 * @returns
 */
export const appFetch = Object.assign(fetchData, {
  native,
});
