/**
 * 문자열을 소문자 단어 배열로 분리하는 헬퍼 함수입니다.
 * camelCase, PascalCase, snake_case, kebab-case 및 공백이 포함된 문자열을 처리합니다.
 * @param str - 변환할 원본 문자열
 * @returns 소문자로 변환된 단어 배열
 */
const getWords = (str: string): string[] => {
  if (!str) {
    return [];
  }

  const normalizedStr = str
    // SonarQube 규칙 준수: replace 대신 replaceAll 사용
    // 주의: replaceAll에 정규식을 사용할 때는 반드시 전역 플래그(/g)가 있어야 합니다.
    .replaceAll(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll(/[^a-zA-Z0-9]+/g, ' ')
    .trim();

  if (!normalizedStr) {
    return [];
  }

  return normalizedStr.toLowerCase().split(/\s+/);
};

/**
 * 단어의 첫 글자만 대문자로 변환하는 헬퍼 함수입니다.
 * * @param word - 변환할 단어
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
 * 문자열을 kebab-case로 변환합니다.
 */
export const toKebabCase = (str: string): string => {
  return getWords(str).join('-');
};
