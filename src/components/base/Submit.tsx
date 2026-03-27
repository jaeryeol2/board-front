'use client';

import { ButtonProps } from '@/types/component';

/**
 * base button component
 * @param param0
 * @returns
 */
export default function Submit(props: Readonly<ButtonProps>) {
  const attributes = { ...props, label: undefined };
  return (
    <button
      type="submit"
      className="px-4 py-2 text-base font-semibold text-white transition-all duration-200 bg-blue-500 rounded-md hover:bg-blue-600 active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      {...attributes}
    >
      {props.children}
    </button>
  );
}
