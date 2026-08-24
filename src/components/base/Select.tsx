'use client';

import { SelectProps } from '@/types/component';
import { useId } from 'react';

export default function Select(props: Readonly<SelectProps>) {
  const altId = useId();
  const id = props?.id ?? altId;
  const optionArray = [];
  const attributes = { ...props, startAll: undefined, options: undefined };
  const options = props.options ? [...props.options] : [];

  if (props.startAll) {
    options.unshift({ label: '전체', value: '' });
  }

  for (const option of options) {
    optionArray.push(
      <option
        key={`${id}-${option.value}`}
        value={option.value}
        disabled={option.disabled}
      >
        {option.label}
      </option>,
    );
  }

  return (
    <select
      className="block w-full rounded-[11px] border border-[#e0e0e0] bg-white px-3.5 py-2.5 text-[15px] text-[#1d1d1f] focus:border-[#0066cc] focus:outline-none focus:ring-2 focus:ring-[#0066cc]/20 transition-all"
      {...attributes}
    >
      {optionArray}
    </select>
  );
}
