const ALLOWED_TAGS = new Set([
  'p',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'b',
  'em',
  'i',
  'u',
  's',
  'del',
  'strike',
  'a',
  'ul',
  'ol',
  'li',
  'blockquote',
  'code',
  'pre',
  'hr',
  'br',
  'img',
  'span',
  'div',
]);

const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  img: new Set(['src', 'alt', 'title', 'class', 'width', 'height', 'loading']),
  a: new Set(['href', 'target', 'rel', 'class', 'title']),
  '*': new Set(['class', 'id']),
};

// 허용 URL 스킴 (API HtmlSanitizer와 동일: href는 http/https/mailto, src는 http/https)
const ALLOWED_PROTOCOLS: Record<string, Set<string>> = {
  href: new Set(['http:', 'https:', 'mailto:']),
  src: new Set(['http:', 'https:']),
};

/**
 * URL 속성은 스킴 allowlist로 검사합니다.
 * URL 파서가 탭·개행 등 제어문자를 제거한 뒤 스킴을 판별하므로 `java&#9;script:` 같은 우회도 차단됩니다.
 * 스킴이 없는 상대 경로는 현재 origin 기준으로 해석되어 http(s)로 허용됩니다.
 */
const isDangerousUrl = (attrName: string, value: string): boolean => {
  const allowed = ALLOWED_PROTOCOLS[attrName];
  if (!allowed) {
    return false;
  }

  try {
    return !allowed.has(new URL(value, window.location.origin).protocol);
  } catch {
    return true;
  }
};

const isValidAttribute = (tagName: string, attrName: string): boolean => {
  if (attrName.startsWith('on')) {
    return false;
  }
  const tagAllowed = ALLOWED_ATTRIBUTES[tagName];
  const globalAllowed = ALLOWED_ATTRIBUTES['*'];
  return (
    (tagAllowed?.has(attrName) ?? false) ||
    (globalAllowed?.has(attrName) ?? false)
  );
};

const sanitizeAttributes = (element: HTMLElement, tagName: string): void => {
  const invalidAttrs = Array.from(element.attributes).filter((attr) => {
    const attrName = attr.name.toLowerCase();
    return (
      !isValidAttribute(tagName, attrName) ||
      isDangerousUrl(attrName, attr.value)
    );
  });

  for (const attr of invalidAttrs) {
    element.removeAttribute(attr.name);
  }
};

const sanitizeNode = (node: Node): void => {
  if (node.nodeType !== Node.ELEMENT_NODE) {
    return;
  }

  const element = node as HTMLElement;
  const tagName = element.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tagName)) {
    element.remove();
    return;
  }

  sanitizeAttributes(element, tagName);
  for (const child of Array.from(element.childNodes)) {
    sanitizeNode(child);
  }
};

/**
 * XSS 방어를 위한 HTML 살균(Sanitize) 순수 유틸리티 함수
 * 허용된 태그 및 속성만 남기고 위험한 스크립트, 이벤트 핸들러(onerror, onclick 등), 허용되지 않은 스킴의 링크를 제거합니다.
 * 서버 렌더링(SSR)에서는 DOMParser가 없어 원문을 반환하지만, API가 저장·조회 시 HtmlSanitizer(jsoup)로 정제한 본문을 내려주므로
 * 이 함수는 브라우저에서의 2차 방어선입니다.
 */
export const sanitizeHtml = (dirtyHtml: string): string => {
  if (!dirtyHtml || typeof window === 'undefined') {
    return dirtyHtml || '';
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(dirtyHtml, 'text/html');

  for (const child of Array.from(doc.body.childNodes)) {
    sanitizeNode(child);
  }
  return doc.body.innerHTML;
};
