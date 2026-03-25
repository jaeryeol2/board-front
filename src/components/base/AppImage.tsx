import { ImageProps } from '@/types/component';
import Image from 'next/image';

export default function AppImage({ alt, ...props }: Readonly<ImageProps>) {
  return <Image {...props} alt={alt} />;
}
