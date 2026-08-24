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
      className="inline-flex items-center justify-center px-5 py-2 text-[15px] font-medium text-white transition-all duration-150 bg-[#0066cc] rounded-full hover:bg-[#0071e3] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
      {...attributes}
    >
      {props.children}
    </button>
  );
}
