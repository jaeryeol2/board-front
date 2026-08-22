'use client';

import { BoardFile } from '@/types/board';
import { formatFileSize } from '@/utils/format-file-size';
import { useEffect, useState } from 'react';

type BoardAttachmentItemProps = {
  file: File | BoardFile;
  onRemove?: () => void;
};

/**
 * 첨부파일 개별 아이템 컴포넌트
 * 이미지인 경우 썸네일 미리보기, 일반 파일인 경우 파일명과 파일 크기 표시
 */
export default function BoardAttachmentItem({
  file,
  onRemove,
}: Readonly<BoardAttachmentItemProps>) {
  const [localDataUrl, setLocalDataUrl] = useState<string | null>(null);
  const [hasImageError, setHasImageError] = useState<boolean>(false);

  const isNewFile = file instanceof File;
  const fileName = isNewFile ? file.name : file.originalFileName;
  const fileSize = isNewFile ? file.size : null;

  const isImage = isNewFile
    ? file.type.startsWith('image/')
    : /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.originalFileName);

  const getPreviewUrl = (): string | null => {
    if (isNewFile) {
      return localDataUrl;
    }
    if (isImage) {
      return file.fileUrl;
    }
    return null;
  };

  const previewUrl = getPreviewUrl();

  useEffect(() => {
    let isMounted = true;

    if (isNewFile && isImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (isMounted && typeof e.target?.result === 'string') {
          setLocalDataUrl(e.target.result);
        }
      };
      reader.readAsDataURL(file);
    }

    return () => {
      isMounted = false;
    };
  }, [file, isImage, isNewFile]);

  const showThumbnail = isImage && previewUrl && !hasImageError;

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50/80 hover:bg-blue-50/30 rounded-xl border border-gray-100 transition-colors group">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {showThumbnail ? (
          <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt={fileName}
              className="w-full h-full object-cover"
              onError={() => setHasImageError(true)}
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-lg flex-shrink-0 bg-blue-100/60 text-blue-600 flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-gray-800 truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">
            {isImage ? '이미지 파일' : '일반 첨부파일'}
            {fileSize !== null && ` • ${formatFileSize(fileSize)}`}
          </p>
        </div>
      </div>

      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          aria-label={`${fileName} 삭제`}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
