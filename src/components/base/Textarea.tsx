'use client';

import { TextareaProps } from '@/types/component';
import { useId } from 'react';

export default function Textarea({ label, ...props }: Readonly<TextareaProps>) {
  const altId = useId();
  const id = props?.id || altId;

  return (
    <>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-500">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={12}
        className="block w-full rounded-md border-0 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all resize-none"
        {...props}
      />
    </>
  );
}
