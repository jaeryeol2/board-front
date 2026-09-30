import { ACCESS_TOKEN, GUEST_ID, REFRESH_TOKEN } from '@/constants/common';
import {
  AppFetchOptions,
  appFetch as baseFetch,
  getData,
  RetryStrategyFunction,
  returnError,
} from 'app-fetch';
import { unstable_rethrow } from 'next/navigation';

const SET_COOKIE = 'Set-Cookie';
const AUTHORIZATION = 'Authorization';

// =================================================================
// 📌 1. TYPES & INTERFACES (appFetch 관련 타입 정의)
// =================================================================

/**
 * 호출부 응답 규격. 성공 여부는 status 숫자 비교 대신 ok로 판정합니다.
 * ok = HTTP 응답이 2xx이면서 본문 envelope status도 2xx (비즈니스 에러는 HTTP 200 + envelope 999로 내려옴)
 */
type ResponseApi<T> = {
  ok: boolean;
  status: number;
  message: string;
  data: T | null;
};

type ApiHeaderValues = {
  ip?: string;
  accessToken?: string;
  guestId?: string;
};

// =================================================================
// 📌 2. SERVER REQUEST CONTEXT (서버 전용 요청 컨텍스트)
// =================================================================

/**
 * 현재 요청(RSC/server action/proxy)의 쿠키·헤더를 반환합니다. 브라우저에서는 null입니다.
 * - `typeof window` 분기는 빌드 시 치환되어 클라이언트 번들에서 next/headers import가 제거됩니다.
 * - server action을 거치지 않으므로 토큰이 브라우저 JS로 노출될 경로가 없습니다.
 * - 요청 스코프 밖(빌드 타임 등)에서 호출되면 cookies()가 예외를 던지므로 null을 반환합니다.
 */
const getServerRequest = async () => {
  if (typeof window !== 'undefined') {
    return null;
  }

  try {
    const { cookies, headers } = await import('next/headers');
    const [cookieStore, headerStore] = await Promise.all([
      cookies(),
      headers(),
    ]);

    return { cookieStore, headerStore };
  } catch (error) {
    // Next 내부 제어 에러(dynamic 렌더링 전환 등)는 삼키지 않고 다시 던집니다.
    unstable_rethrow(error);
    console.warn('request context unavailable: ', returnError(error).message);
    return null;
  }
};

const getClientIp = (headers: Headers) => {
  const clientIp =
    headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    headers.get('x-real-ip') ||
    'Unknown IP';

  return clientIp === '::1' ? '127.0.0.1' : clientIp;
};

/**
 * gateway 인증/추적 헤더를 설정합니다. (서버 요청: beforeRequest, 브라우저 요청: proxy.ts에서 사용)
 * 토큰 갱신 후 재시도 시 호출부에서 넣은 새 토큰을 쿠키의 이전 토큰으로 덮어쓰지 않습니다.
 */
export const setApiHeaders = (
  headers: Headers,
  { ip, accessToken, guestId }: ApiHeaderValues,
) => {
  if (ip) {
    headers.set('X-Forwarded-For', ip);
  }
  if (accessToken && !headers.has(AUTHORIZATION)) {
    headers.set(AUTHORIZATION, `Bearer ${accessToken}`);
  }
  if (guestId) {
    headers.set('X-Guest-Id', guestId);
  }
};

// =================================================================
// 📌 3. APP-FETCH INSTANCE CONFIG (기본 인스턴스 및 설정)
// =================================================================

const RETRY_STATUS = new Set([502, 503, 504]);
const RETRY_DELAY = 1000;

/**
 * 재시도 정책: GET만, gateway/일시 장애(502/503/504)에 1회.
 * - 타임아웃·네트워크 에러는 재시도하지 않습니다. 백엔드는 이전 요청을 계속 처리하므로 재시도가 부하를 키웁니다.
 * - PUT/DELETE도 부수 효과(이미지 정리 등)가 있어 자동 재시도하지 않습니다.
 * ponytail: Retry-After는 사용하지 않음(현재 gateway/api가 보내지 않음). rate limit 도입 시 ctx.retryAfterMs 반영.
 */
const retryIdempotentGetOnce: RetryStrategyFunction = (ctx) => ({
  shouldRetry:
    ctx.method === 'GET' &&
    RETRY_STATUS.has(ctx.response?.status ?? 0) &&
    ctx.attempt <= 1,
  delay: RETRY_DELAY,
});

/**
 * app-fetch 인스턴스 설정
 * - retryStrategy: retryIdempotentGetOnce 참고
 * - timeout: beforeRequest부터 응답 헤더 수신까지 시도당 적용됩니다.
 * - 401 (Unauthorized) 에러는 자동 재시도 대상이 아니며,
 *   하단의 native 함수에서 토큰 갱신(refreshAccessToken) 후 딱 1회 수동 재시도됩니다.
 * - 브라우저 요청은 httpOnly 쿠키가 자동 전송되고 proxy.ts가 헤더를 주입하므로 헤더를 구성하지 않습니다.
 */
const $fetch = baseFetch.create({
  baseURL: process.env.NEXT_BASE_API_URL,
  timeout: 2000,
  retryStrategy: retryIdempotentGetOnce,
  async beforeRequest(options, { path, attempt }) {
    if (attempt === 1) {
      console.log('api request path: ', path);
    }

    const server = await getServerRequest();

    if (!server) {
      return;
    }

    // 헤더는 대입하지 않고 set으로 수정합니다 (대입 시 기본 헤더·JSON Content-Type까지 교체됨).
    setApiHeaders(options.headers, {
      ip: getClientIp(server.headerStore),
      accessToken: server.cookieStore.get(ACCESS_TOKEN)?.value,
      guestId: server.cookieStore.get(GUEST_ID)?.value,
    });
  },
});

// =================================================================
// 📌 4. HELPER FUNCTIONS (쿠키, 헤더 및 응답 변환 유틸리티)
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

const isSuccessStatus = (status: number) => status >= 200 && status < 300;

/**
 * 파싱된 응답 본문을 백엔드 공통 응답 규격(ResponseApi)으로 변환합니다.
 * - app-fetch는 4xx/5xx를 예외 없이 Response로 반환하므로 response.ok로 전송 계층 에러를 판별합니다.
 * - 성공 판정은 특정 코드(200/201)가 아닌 2xx 범위로 합니다.
 * - 2xx + 빈 본문(204 등, getData가 null 반환)은 성공입니다.
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
      ok: false,
      status: response.status,
      message: api?.message ?? (response.statusText || 'API Fetch Error.'),
      data: api?.data ?? null,
    };
  }
  if (body === null) {
    return { ok: true, status: response.status, message: 'success', data: null };
  }
  if (api) {
    const status = api.status ?? response.status;

    return {
      ok: isSuccessStatus(status),
      status,
      message: api.message ?? 'success',
      data: api.data ?? null,
    };
  }

  return {
    ok: true,
    status: response.status,
    message: 'success',
    data: body as R,
  };
};

// =================================================================
// 📌 5. CORE FETCH IMPLEMENTATIONS (native & appFetch 핵심 구현)
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

  // 브라우저는 refresh token 쿠키를 자동 전송하므로, 서버 요청일 때만 Cookie 헤더를 직접 구성합니다.
  const fetchRefresh = async () => {
    const server = await getServerRequest();
    const refreshToken = server?.cookieStore.get(REFRESH_TOKEN)?.value;
    const headers = new Headers();

    if (refreshToken) {
      headers.set('Cookie', `${REFRESH_TOKEN}=${refreshToken}`);
    }

    return native('/api/auth/access', { method: 'post', headers });
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
  return $fetch(path, options).catch((error: unknown) => {
    unstable_rethrow(error);
    return Response.json(returnError(error), { status: 500 });
  });
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
    unstable_rethrow(error);
    return { ok: false, ...returnError<R>(error) };
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
