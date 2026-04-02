import { ImageProps } from '@/types/component';
import Image from 'next/image';
import { SyntheticEvent } from 'react';

export default function AppImage({ alt, ...props }: Readonly<ImageProps>) {
  const ALT_IMAGE = '/images/alt-image.png';
  const handleErrorImage = (e: SyntheticEvent) => {
    (e.target as HTMLImageElement).src = ALT_IMAGE;
  };

  return <Image onError={(e) => handleErrorImage(e)} {...props} alt={alt} />;
}
