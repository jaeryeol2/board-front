'use client';

import { FileInputProps } from '@/types/component';

/**
 * base file input component
 * @param props
 * @returns
 */
export default function FileInput(props: Readonly<FileInputProps>) {
  return <input type="file" {...props} />;
}
