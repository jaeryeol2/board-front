'use client';

import { BoardImageItem } from '@/app/(with-gnb)/board/[boardType]/_components/BoardImageItem';
import Button from '@/components/base/Button';
import { GlobalContext } from '@/contexts/GlobalContext';
import { BoardDetail } from '@/types/board';
import { isNotEmpty } from '@/utils/is-empty';
import { sanitizeHtml } from '@/utils/sanitize-html';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import { useContext, useRef } from 'react';
import CommentSection from './CommentSection';

type BoardDetailProps = {
  board: BoardDetail;
};

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
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Button
          onClick={handleGoBack}
          className="flex items-center rounded-full bg-white border border-[#e0e0e0] px-4 py-2 text-[14px] font-medium text-[#1d1d1f] shadow-none hover:bg-[#fafafc] transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5 text-[#7a7a7a]"
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
            className="flex items-center rounded-full bg-[#0066cc] px-5 py-2 text-[14px] font-medium text-white shadow-none hover:bg-[#0071e3] transition-all active:scale-95"
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

      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 md:p-10">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] mb-3 leading-tight tracking-tight">
            {board.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-[#7a7a7a] text-[13px]">
            {isNotEmpty(board.writerName) && (
              <>
                <span className="font-semibold text-[#1d1d1f]">
                  {board.writerName}
                </span>
                <span className="text-[#e0e0e0]">|</span>
              </>
            )}
            <span>
              {format(new Date(board.createdAt), 'yyyy.MM.dd HH:mm')}
            </span>
            <span className="text-[#e0e0e0]">|</span>
            <span>조회 {board.viewCount}</span>
          </div>
        </div>

        <hr className="my-6 border-[#f0f0f0]" />

        <div
          className="prose prose-slate max-w-none text-[#1d1d1f] min-h-[200px] leading-relaxed break-keep [&_img]:rounded-[14px] [&_img]:my-4 [&_img]:border [&_img]:border-[#e0e0e0]"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(board.content) }}
        />

        {board.fileList && board.fileList.length > 0 && (
          <div className="mt-8 md:mt-10">
            <div className="flex flex-col gap-4 max-w-3xl mx-auto">
              {board.fileList.map((file) => (
                <BoardImageItem key={file.id} file={file} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <CommentSection
            ref={commentArea}
            boardId={board.id}
            initialComments={board.commentList}
            onFocusArea={handleFocusArea}
          />
        </div>
      </div>
    </div>
  );
}
