'use client';

import { SelectProps } from '@/types/component';
import { useId } from '@/utils/useId';

export default function Select(props: Readonly<SelectProps>) {
  const id = useId();
  const optionArray = [];
  const attributes = { ...props, startAll: undefined, options: undefined };
  const options = props.options ? [...props.options] : [];

  if (props.startAll) {
    options.unshift({ label: '전체', value: '' });
  }

  for (const option of options) {
    optionArray.push(
      <option key={`${id}-${option.value}`} value={option.value} disabled={option.disabled}>
        {option.label}
      </option>,
    );
  }

  return (
    <select
      className="block w-full rounded-md border-0 bg-white px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 sm:text-sm sm:leading-6 transition-all"
      {...attributes}
    >
      {optionArray}
    </select>
  );
}
