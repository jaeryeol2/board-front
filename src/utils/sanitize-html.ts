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

const isDangerousUrl = (attrName: string, value: string): boolean => {
  const isUrlAttr = attrName === 'href' || attrName === 'src';
  return isUrlAttr && value.trim().toLowerCase().startsWith('javascript:');
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
 * 허용된 태그 및 속성만 남기고 위험한 스크립트, 이벤트 핸들러(onerror, onclick 등), javascript: 링크를 제거합니다.
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
