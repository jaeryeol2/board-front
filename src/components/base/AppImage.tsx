'use client';

import { ImageProps } from '@/types/component';
import Image from 'next/image';
import { SyntheticEvent, useState } from 'react';

export default function AppImage({
  alt,
  src,
  onError,
  loading,
  ...props
}: Readonly<ImageProps>) {
  const [hasError, setHasError] = useState(false);
  const [prevSrc, setPrevSrc] = useState(src);
  const ALT_IMAGE = '/images/alt-image.png';
  const displaySrc = hasError ? ALT_IMAGE : src;
  const imageLoading = loading ?? 'eager';

  // prevSrc에 초기값인 src는 최초 랜더링일때에만 값이 바인딩되고
  // 이후 부모 컴포넌트에서 props로 내려준 데이터의 상태가 변경되더라도 prevSrc의 초기값은 변하지 않는다
  // result : 그래서 이전 데이터와 현재 데이터를 비교할 수 있음
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
    <Image
      loading={imageLoading}
      src={displaySrc}
      alt={alt}
      onError={handleErrorImage}
      {...props}
    />
  );
}
