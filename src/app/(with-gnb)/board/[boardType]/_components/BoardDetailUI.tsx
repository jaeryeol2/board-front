'use client';

import AppImage from '@/components/base/AppImage';
import Button from '@/components/base/Button';
import Textarea from '@/components/base/Textarea';
import { BoardDetail } from '@/types/board';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type BoardDetailProps = {
  board: BoardDetail;
};

export default function BoardDetailUI({ board }: Readonly<BoardDetailProps>) {
  const [comment, setComment] = useState<string>('');
  const router = useRouter();

  // TODO: 댓글 작성 로직 추가 필요
  const handleCommentSubmit = () => {
    console.log('댓글 작성:', comment);
    setComment(''); // 댓글 입력 필드 초기화
  };

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
              <span className="font-medium">{board.writerName}</span>
              <span className="mx-2.5 text-gray-300">·</span>
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

          <div className="mt-16">
            <div className="flex items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">댓글</h2>
              <span className="ml-3 text-lg font-medium text-blue-600">
                {board.commentList?.length || 0}
              </span>
            </div>

            <div className="space-y-6">
              {board.commentList && board.commentList.length > 0 ? (
                board.commentList.map((comment) => (
                  <div key={comment.id} className="flex space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                        {comment.writerName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-gray-900">
                          {comment.writerName}
                        </span>
                      </div>
                      <p className="text-gray-700 mt-1">{comment.content}</p>
                      <span className="text-xs text-gray-400 mt-2 block">
                        {format(
                          new Date(comment.createdAt),
                          'yyyy.MM.dd HH:mm',
                        )}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 border border-dashed rounded-lg">
                  <p className="text-gray-500">아직 댓글이 없습니다.</p>
                  <p className="text-sm text-gray-400 mt-1">
                    첫 댓글을 작성해보세요!
                  </p>
                </div>
              )}
            </div>

            <div className="mt-10">
              <div className="bg-gray-100 rounded-xl p-5">
                <Textarea
                  placeholder="따뜻한 댓글을 남겨주세요."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="w-full resize-none bg-transparent border-none p-0 focus:ring-0 text-base placeholder-gray-500"
                />
                <div className="flex justify-end mt-2 border-t border-gray-200 pt-3">
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim()}
                    className="px-6 py-2.5 text-sm font-semibold"
                  >
                    등록
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
