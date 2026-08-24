'use client';

import AppImage from '@/components/base/AppImage';
import { BoardFile } from '@/types/board';
import { SyntheticEvent, useState } from 'react';

/**
 * 개별 이미지 반응형 렌더링 아이템 컴포넌트
 * 기본 높이(h-[300px] md:h-[500px])를 확보하되, 이미지 로딩 시 원본 비율로 높이를 동적으로 조정함
 */
export function BoardImageItem({ file }: Readonly<{ file: BoardFile }>) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] rounded-[14px] overflow-hidden group border border-[#e0e0e0] bg-[#f5f5f7]"
      style={{
        aspectRatio: aspectRatio ? `${aspectRatio}` : undefined,
        height: aspectRatio ? 'auto' : undefined,
      }}
    >
      <AppImage
        src={file.fileUrl}
        alt={file.originalFileName}
        fill
        style={{ objectFit: 'cover' }}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        onLoad={handleImageLoad}
        className="transition-transform duration-300 group-hover:scale-102"
      />
    </div>
  );
}
