'use client';

import { ChildrenType } from '@/types/base';
import { ButtonProps } from '@/types/component';

/**
 * base button component
 * @param param0
 * @returns
 */
export default function Submit(props: Readonly<ButtonProps & ChildrenType>) {
  const attributes = { ...props };

  if (attributes?.className) {
    attributes.className = attributes.className.concat(' cursor-pointer');
  }

  return (
    <button
      type="submit"
      className="px-4 py-2 text-base font-semibold text-white transition-all duration-200 bg-blue-500 rounded-md hover:bg-blue-600 active:scale-95 cursor-pointer disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
      {...attributes}
    >
      {props.children}
    </button>
  );
}
