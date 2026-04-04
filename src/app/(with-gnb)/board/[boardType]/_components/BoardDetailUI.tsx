'use client';

import AppImage from '@/components/base/AppImage';
import Button from '@/components/base/Button';
import { BoardDetail } from '@/types/board';
import { isNotEmpty } from '@/utils/isEmpty';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import CommentSection from './CommentSection';

type BoardDetailProps = {
  board: BoardDetail;
};

export default function BoardDetailUI({ board }: Readonly<BoardDetailProps>) {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };
  return (
    <div className="bg-white min-h-screen">
      <div className="py-20">
        <div className="mb-8">
          <Button
            onClick={handleGoBack}
            className="flex items-center rounded-md bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-100"
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
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8 sm:p-12">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-5">
              {board.title}
            </h1>
            <div className="flex items-center text-gray-500 text-sm">
              {isNotEmpty(board.writerName) && (
                <>
                  <span className="font-medium">{board.writerName}</span>
                  <span className="mx-2.5 text-gray-300">·</span>
                </>
              )}
              <span>
                {format(new Date(board.createdAt), 'yyyy.MM.dd HH:mm')}
              </span>
              <span className="mx-2.5 text-gray-300">·</span>
              <span>조회수 {board.viewCount}</span>
            </div>
          </div>

          <hr className="my-8 border-gray-100" />

          <div className="prose prose-lg max-w-none text-gray-800 min-h-[200px]">
            <p>{board.content}</p>
          </div>

          {board.fileList && board.fileList.length > 0 && (
            <div className="mt-12">
              <div className="flex flex-col gap-4">
                {board.fileList.map((file) => (
                  <div
                    key={file.id}
                    className="relative w-full aspect-video rounded-lg overflow-hidden group"
                  >
                    <AppImage
                      src={file.fileUrl}
                      alt={file.originalFileName}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <CommentSection
            boardId={board.id}
            initialComments={board.commentList}
          />
        </div>
      </div>
    </div>
  );
}
