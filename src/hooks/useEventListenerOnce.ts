'use client';

import {
  Dispatch,
  RefObject,
  SetStateAction,
  useCallback,
  useEffect,
} from 'react';

/**
 * 특정 DOM 요소에 하나의 이벤트만 발생하는 훅.
 * React의 ref를 사용하여 DOM 요소에 직접 접근하며,
 * 이벤트 리스너는 한 번 실행된 후 자동으로 제거됩니다.
 *
 * ※ callback함수 "첫번째" 줄에 반드시 key props에 바인딩 할 state훅의 setter함수를 추가해야 합니다.
 * (그렇지 않으면 리랜더링이 대상이 되지않아 최초 한번만 실행.)
 * @template T - 이벤트 리스너를 등록할 HTML 요소의 타입 (e.g., HTMLButtonElement)
 * @param {RefObject<T>} ref - 이벤트를 등록할 DOM 요소를 가리키는 React ref 객체
 * @param {keyof DocumentEventMap} type - 등록할 이벤트 타입 (e.g., 'click')
 * @param {[number, Dispatch<SetStateAction<number>>]}  bundleState - state훅 (e.g. [key, setKey])
 * @param {(event: Event) => void} callback - 이벤트 발생 시 한 번만 실행될 콜백 함수
 */
export const useEventOnceListener = <T extends HTMLElement | null>(
  ref: RefObject<T>,
  type: keyof DocumentEventMap,
  bundleState: [number, Dispatch<SetStateAction<number>>],
  callback: (event: Event) => void,
) => {
  const [key, setKey] = bundleState;
  const callbackFunc = useCallback(
    (event: Event) => {
      event.preventDefault();
      setKey((k) => (k || 0) + 1);
      callback(event);
    },
    [setKey, callback],
  );

  useEffect(() => {
    const element = ref.current;

    if (element) {
      element.addEventListener(type, callbackFunc, { once: true });
    }

    return () => {
      if (element) {
        element.removeEventListener(type, callbackFunc);
      }
    };
  }, [ref, type, key, callbackFunc]);
};
