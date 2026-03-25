'use client';

import { RadioProps } from '@/types/component';

export default function Radio(props: Readonly<RadioProps>) {
  return (
    <input
      type="radio"
      className="w-5 h-5 text-blue-500 transition-all duration-200 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
      {...props}
    />
  );
}
