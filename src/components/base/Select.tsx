'use client';

import { SelectProps } from '@/types/component';
import { useId } from 'react';

export default function Select({
  startAll,
  options: propOptions = [],
  id: propId,
  className,
  ...attributes
}: Readonly<SelectProps>) {
  const altId = useId();
  const id = propId ?? altId;
  const options = [...propOptions];

  if (startAll) {
    options.unshift({ label: '전체', value: '' });
  }

  const baseClassName =
    'block w-full rounded-[11px] border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-[15px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all';
  const combinedClassName = className
    ? `${baseClassName} ${className}`
    : baseClassName;

  return (
    <select id={id} className={combinedClassName} {...attributes}>
      {options.map((option) => (
        <option
          key={`${id}-${option.value}`}
          value={option.value}
          disabled={option.disabled}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
