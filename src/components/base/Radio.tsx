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
      className="w-4 h-4 text-[#0066cc] transition-all duration-150 bg-white border-[#e0e0e0] focus:ring-[#0066cc] focus:ring-2 cursor-pointer"
      {...props}
    />
  );
}
