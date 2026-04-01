'use client';

import { RadioProps } from '@/types/component';
import { useId } from 'react';

export default function Radio(props: Readonly<RadioProps>) {
  const altId = useId();
  const id = props?.id ?? altId;
  return (
    <input
      type="radio"
      id={id}
      className="w-5 h-5 text-blue-500 transition-all duration-200 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2 cursor-pointer"
      {...props}
    />
  );
}
