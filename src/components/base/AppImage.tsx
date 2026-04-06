'use client';

import { ImageProps } from '@/types/component';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';

export default function AppImage({
  alt,
  src,
  onError,
  ...props
}: Readonly<ImageProps>) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const ALT_IMAGE = '/images/alt-image.png';
  const displaySrc = hasError ? ALT_IMAGE : src;

  if (src !== prevSrc) {
    setPrevSrc(src);
    setHasError(false);
  }

  const handleErrorImage = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    if (onError) {
      onError(e);
      return;
    }

    if (!hasError) {
      setHasError(true);
    }
  };

  return (
    <Image {...props} src={displaySrc} alt={alt} onError={handleErrorImage} />
  );
}
