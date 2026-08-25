const checkObjectEmptiness = (data: object): boolean => {
  if (data instanceof URL || data instanceof Date || data instanceof RegExp) {
    return false;
  }

  if (Array.isArray(data)) {
    return data.length === 0;
  }

  if (
    data instanceof Map ||
    data instanceof Set ||
    data instanceof URLSearchParams
  ) {
    return data.size === 0;
  }

  if (data instanceof FormData) {
    return data.keys().next().done ?? true;
  }

  if (data instanceof Blob) {
    return data.size === 0;
  }

  if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
    return data.byteLength === 0;
  }

  return Reflect.ownKeys(data).length === 0;
};

/**
 * 빈값 체크
 *
 * true: 빈값, false: 값있음
 *
 * 조건문 블록 내에서 해당 타입의 프로퍼티를 사용하고싶으면 'isNotEmpty'를 사용하세요.
 *
 * ※ isEmpty는 typescript의 type narrowing을 해주지 않습니다.
 *
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#typeof-type-guards
 * @param data
 * @returns
 */
export const isEmpty = <T>(data: T): boolean => {
  // 1. null 또는 undefined만 정확하게 체크 (0, false 제외)
  if (data === null || data === undefined) {
    return true;
  }

  const type = typeof data;

  switch (type) {
    case 'string':
      return (data as string).trim().length === 0;
    case 'object':
      return checkObjectEmptiness(data);
    case 'number':
      return Number.isNaN(data);

    case 'bigint':
    case 'boolean':
    case 'function':
    case 'symbol':
      return false;

    default:
      return false;
  }
};

/**
 * 빈값 체크
 *
 * true: 값 있음, false: 빈값
 *
 * https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
 * @param data
 * @returns
 */
export const isNotEmpty = <T>(data: T): data is NonNullable<T> =>
  !isEmpty(data);
