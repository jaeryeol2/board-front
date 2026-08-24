'use client';

import { CheckboxProps } from '@/types/component';

export default function Checkbox(props: Readonly<CheckboxProps>) {
  return (
    <input
      type="checkbox"
      className="w-4 h-4 text-[#0066cc] transition-all duration-150 bg-white border-[#e0e0e0] rounded-[4px] focus:ring-[#0066cc] focus:ring-2 cursor-pointer"
      {...props}
    />
  );
}
