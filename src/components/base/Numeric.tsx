'use client';

import { NumericProps } from '@/types/component';

export default function Numeric(props: Readonly<NumericProps>) {
  return (
    <input
      type="number"
      className="block w-full rounded-md border-0 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
      {...props}
    />
  );
}
