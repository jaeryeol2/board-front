'use client';

import { TextProps } from '@/types/component';
import { useId } from 'react';

export default function Text({ label, ...props }: Readonly<TextProps>) {
  const generateId = useId();
  const id = props?.id ?? generateId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-semibold text-gray-500 mb-2"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        className="block w-full rounded-md border-0 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
        {...props}
      />
    </div>
  );
}
