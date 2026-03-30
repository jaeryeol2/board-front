interface CookieOptions {
  path?: string;
  maxAge?: number;
  expires?: Date;
  secure?: boolean;
  httpOnly?: boolean;
  sameSite?: string;
  domain?: string;
  priority?: string;
  partitioned?: boolean;
}

interface ParsedCookie {
  name: string;
  value: string;
  options: CookieOptions;
}

const KNOWN_ATTRIBUTES = new Set([
  'path',
  'max-age',
  'expires',
  'secure',
  'httponly',
  'samesite',
  'domain',
  'priority',
  'partitioned',
]);

/**
 * 헬퍼 함수: 분리된 switch 문을 통해 단일 쿠키 객체에 옵션을 안전하게 할당합니다.
 * (복잡도 감소의 핵심)
 */
const applyCookieAttribute = (
  cookie: ParsedCookie,
  key: string,
  val: string,
): void => {
  switch (key) {
    case 'path':
      cookie.options.path = val;
      break;
    case 'max-age': {
      const parsedMaxAge = Number.parseInt(val, 10);
      if (!Number.isNaN(parsedMaxAge)) {
        cookie.options.maxAge = parsedMaxAge;
      }
      break;
    }
    case 'expires': {
      const parsedDate = new Date(val);
      if (!Number.isNaN(parsedDate.getTime())) {
        cookie.options.expires = parsedDate;
      }
      break;
    }
    case 'secure':
      cookie.options.secure = true;
      break;
    case 'httponly':
      cookie.options.httpOnly = true;
      break;
    case 'samesite':
      cookie.options.sameSite = val.toLowerCase();
      break;
    case 'domain':
      cookie.options.domain = val;
      break;
    case 'priority':
      cookie.options.priority = val.toLowerCase();
      break;
    case 'partitioned':
      cookie.options.partitioned = true;
      break;
    default:
      break;
  }
};

/**
 * 메인 함수: 여러 쿠키가 병합된 단일 문자열을 파싱합니다.
 */
export const parseCookiesFromString = (
  cookieString: string,
): Record<string, ParsedCookie> => {
  const result: Record<string, ParsedCookie> = {};

  if (!cookieString || cookieString.trim() === '') {
    return result;
  }

  // 1. 빈 문자열 필터링: 루프 내부의 `if (!part) continue` 블록을 제거합니다.
  const parts = cookieString
    .split(';')
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  let currentCookie: ParsedCookie | null = null;

  for (const part of parts) {
    const [key, ...valParts] = part.split('=');
    const val = valParts.join('=');
    const lowerKey = key ? key.toLowerCase() : '';

    // 2. Early Continue: 알려진 옵션인 경우 처리 후 바로 다음 루프로 넘겨 else 블록 중첩을 완전히 없앱니다.
    if (KNOWN_ATTRIBUTES.has(lowerKey) && currentCookie) {
      applyCookieAttribute(currentCookie, lowerKey, val);
      continue;
    }

    // 3. 위에서 continue 되지 않았다면 무조건 '새로운 쿠키'입니다. 기존 쿠키를 먼저 저장합니다.
    if (currentCookie) {
      result[currentCookie.name] = currentCookie;
    }

    // 4. if (key) 중첩 대신 삼항 연산자를 활용해 새 쿠키 객체를 할당합니다.
    currentCookie = key ? { name: key, value: val, options: {} } : null;
  }

  // 마지막 쿠키 저장
  if (currentCookie) {
    result[currentCookie.name] = currentCookie;
  }

  return result;
};
