/**
 * 문자열을 소문자 단어 배열로 분리하는 헬퍼 함수입니다.
 * camelCase, PascalCase, snake_case, kebab-case, 연속 대문자 약어(XMLHttp) 및 유니코드(한글)를 지원합니다.
 * @param str - 변환할 원본 문자열
 * @returns 소문자로 변환된 단어 배열
 */
const getWords = (str: string): string[] => {
  if (!str) {
    return [];
  }

  const normalizedStr = str
    // SonarQube S5852 준수: 백트래킹 없는 단순 Lookaround로 약어 분리 (예: XMLHttp -> XML Http)
    .replaceAll(/(?<=[A-Z])(?=[A-Z][a-z])/g, ' ')
    // 소문자/숫자 뒤 대문자 경계 분리 (예: camelCase -> camel Case)
    .replaceAll(/(?<=[a-z\d])(?=[A-Z])/g, ' ')
    // 영문, 숫자, 한글/유니코드 문자 이외의 특수문자/구분자를 공백 치환
    .replaceAll(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();

  if (!normalizedStr) {
    return [];
  }

  return normalizedStr.toLowerCase().split(/\s+/);
};

/**
 * 단어의 첫 글자만 대문자로 변환하는 헬퍼 함수입니다.
 * @param word - 변환할 단어
 * @returns 첫 글자가 대문자인 단어
 */
const capitalize = (word: string): string => {
  if (!word) {
    return '';
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

/**
 * 문자열을 camelCase로 변환합니다.
 */
export const toCamelCase = (str: string): string => {
  const words = getWords(str);

  if (words.length === 0) {
    return '';
  }

  return words[0] + words.slice(1).map(capitalize).join('');
};

/**
 * 문자열을 PascalCase로 변환합니다.
 */
export const toPascalCase = (str: string): string => {
  return getWords(str).map(capitalize).join('');
};

/**
 * 문자열을 snake_case로 변환합니다.
 */
export const toSnakeCase = (str: string): string => {
  return getWords(str).join('_');
};

/**
 * 문자열을 CONSTANT_CASE (UPPER_SNAKE_CASE)로 변환합니다.
 */
export const toConstantCase = (str: string): string => {
  return toSnakeCase(str).toUpperCase();
};

/**
 * 문자열을 kebab-case로 변환합니다.
 */
export const toKebabCase = (str: string): string => {
  return getWords(str).join('-');
};
