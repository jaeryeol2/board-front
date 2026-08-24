'use client';

import { TextareaProps } from '@/types/component';
import { useId } from 'react';

export default function Textarea({ label, ...props }: Readonly<TextareaProps>) {
  const altId = useId();
  const id = props?.id || altId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        id={id}
        rows={12}
        className="block w-full rounded-[11px] border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-[15px] text-[#1d1d1f] placeholder:text-[#86868b] focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all resize-none"
        {...props}
      />
    </div>
  );
}
