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
          className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5"
        >
          {label}
        </label>
      )}
      <input
        type="text"
        id={id}
        className="block w-full rounded-[11px] border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all"
        {...props}
      />
    </div>
  );
}
