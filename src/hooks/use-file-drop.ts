import { DragEvent, useCallback, useRef, useState } from 'react';

type UseFileDropOptions = {
  onDropFiles: (files: File[]) => void;
  accept?: string;
};

/**
 * 드래그 앤 드롭 파일 첨부 커스텀 훅
 * @param options onDropFiles(파일 전달 콜백), accept(파일 타입 필터 e.g. 'image/*')
 */
export const useFileDrop = ({ onDropFiles, accept }: UseFileDropOptions) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragCounter = useRef<number>(0);

  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;

    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;

    if (dragCounter.current <= 0) {
      setIsDragging(false);
      dragCounter.current = 0;
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const droppedFiles = Array.from(e.dataTransfer.files ?? []);
      if (droppedFiles.length === 0) return;

      const filteredFiles = accept
        ? droppedFiles.filter((file) => {
            if (accept === 'image/*' || accept.startsWith('image/')) {
              return file.type.startsWith('image/');
            }
            return true;
          })
        : droppedFiles;

      if (filteredFiles.length > 0) {
        onDropFiles(filteredFiles);
      }
    },
    [accept, onDropFiles],
  );

  return {
    isDragging,
    dropProps: {
      onDragEnter: handleDragEnter,
      onDragLeave: handleDragLeave,
      onDragOver: handleDragOver,
      onDrop: handleDrop,
    },
  };
};
