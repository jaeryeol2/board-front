'use client';

import AppImage from '@/components/base/AppImage';
import Button from '@/components/base/Button';
import { GlobalContext } from '@/contexts/GlobalContext';
import { BoardDetail, BoardFile } from '@/types/board';
import { isNotEmpty } from '@/utils/isEmpty';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { SyntheticEvent, useContext, useRef, useState } from 'react';
import CommentSection from './CommentSection';

type BoardDetailProps = {
  board: BoardDetail;
};

/**
 * 개별 이미지 반응형 렌더링 아이템 컴포넌트
 * 기본 높이(h-[300px] md:h-[500px])를 확보하되, 이미지 로딩 시 원본 비율로 높이를 동적으로 조정함
 */
function DetailImageItem({ file }: Readonly<{ file: BoardFile }>) {
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);

  const handleImageLoad = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.currentTarget;
    if (img.naturalWidth && img.naturalHeight) {
      setAspectRatio(img.naturalWidth / img.naturalHeight);
    }
  };

  return (
    <div
      className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden group border border-gray-100 shadow-sm bg-gray-50/50"
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
        className="transition-transform duration-500 group-hover:scale-105"
      />
    </div>
  );
}

export default function BoardDetailUI({ board }: Readonly<BoardDetailProps>) {
  const router = useRouter();
  const params = useParams();
  const { userInfo } = useContext(GlobalContext);
  const commentArea = useRef<HTMLDivElement>(null);
  const isAuthor = userInfo?.userId === board.writerId;

  const handleGoBack = () => {
    router.back();
  };

  const handleModify = () => {
    router.push(`/board/${params.boardType}/write/${board.id}`);
  };

  const handleFocusArea = () => {
    commentArea.current?.scrollIntoView({
      behavior: 'smooth', // 부드러운 이동 (instant, smooth)
      block: 'start', // 수직 정렬 (start, center, end, nearest)
      inline: 'nearest', // 수평 정렬
    });
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="py-6 md:py-12 px-4 md:px-0 max-w-4xl mx-auto">
        <div className="mb-6 md:mb-8 flex justify-between items-center">
          <Button
            onClick={handleGoBack}
            className="flex items-center rounded-lg bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1.5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            목록으로
          </Button>

          {isAuthor && (
            <Button
              onClick={handleModify}
              className="flex items-center rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              수정하기
            </Button>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 md:p-10">
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {board.title}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-gray-500 text-sm">
              {isNotEmpty(board.writerName) && (
                <>
                  <span className="font-semibold text-gray-900">
                    {board.writerName}
                  </span>
                  <span className="text-gray-200">|</span>
                </>
              )}
              <span>
                {format(new Date(board.createdAt), 'yyyy.MM.dd HH:mm')}
              </span>
              <span className="text-gray-200">|</span>
              <span>조회 {board.viewCount}</span>
            </div>
          </div>

          <hr className="my-6 md:my-8 border-gray-50" />

          <div className="prose prose-blue max-w-none text-gray-800 min-h-[200px] leading-relaxed break-keep">
            <p className="whitespace-pre-wrap text-base md:text-lg">
              {board.content}
            </p>
          </div>

          {board.fileList && board.fileList.length > 0 && (
            <div className="mt-10 md:mt-12">
              <div className="flex flex-col gap-4 max-w-3xl mx-auto">
                {board.fileList.map((file) => (
                  <DetailImageItem key={file.id} file={file} />
                ))}
              </div>
            </div>
          )}

          <div className="mt-12">
            <CommentSection
              ref={commentArea}
              boardId={board.id}
              initialComments={board.commentList}
              onFocusArea={handleFocusArea}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
