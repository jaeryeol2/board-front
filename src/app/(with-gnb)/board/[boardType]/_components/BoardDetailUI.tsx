'use client';

import AppImage from '@/components/base/AppImage';
import Button from '@/components/base/Button';
import Textarea from '@/components/base/Textarea';
import { GlobalContext } from '@/contexts/GlobalContext';
import { BoardDetail } from '@/types/board';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { FocusEvent, useContext, useState } from 'react';

type BoardDetailProps = {
  board: BoardDetail;
};

export default function BoardDetailUI({ board }: Readonly<BoardDetailProps>) {
  const [comment, setComment] = useState<string>('');
  const [commentList, setCommentList] = useState(board.commentList);
  const router = useRouter();
  const { isLogin } = useContext(GlobalContext);

  // TODO: 댓글 작성 로직 추가 필요
  const handleCommentSubmit = () => {
    console.log('댓글 작성:', comment);
    setComment(''); // 댓글 입력 필드 초기화
    setCommentList(() => []);
  };

  const handleGoBack = () => {
    router.back();
  };
  const handleCheckComment = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    if (!isLogin) {
      alert('로그인이 필요합니다.');
      e.target.blur();
    }
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

          {/* 댓글 섹션 */}
          <div className="mt-16">
            {/* 댓글 헤더 */}
            <div className="flex items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">댓글</h2>
              <span className="ml-2 text-xl font-bold text-blue-600">
                {commentList?.length || 0}
              </span>
            </div>

            {/* 댓글 입력 폼 */}
            <div className="mt-6 mb-8">
              <div className="relative rounded-lg border border-gray-200 bg-white transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <Textarea
                  placeholder="따뜻한 댓글을 남겨주세요. (100자 이내)"
                  value={comment}
                  onFocus={(e) => handleCheckComment(e)}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  maxLength={100}
                  className="w-full resize-none border-0 bg-transparent p-4 pb-12 text-base placeholder-gray-400 focus:outline-none"
                />
                <div className="absolute bottom-3 right-3 flex items-center">
                  <span className="mr-3 text-sm text-gray-400">
                    {comment.length}/100
                  </span>
                  <Button
                    onClick={handleCommentSubmit}
                    disabled={!comment.trim() || !isLogin}
                    className="rounded-md px-5 py-2 text-sm font-semibold"
                  >
                    등록
                  </Button>
                </div>
              </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
              {commentList && commentList.length > 0 ? (
                commentList.map((c, index) => (
                  <div
                    key={c.id}
                    className={`py-5 ${index === commentList.length - 1 ? '' : 'border-b border-gray-100'}`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-500">
                          {c.writerName.charAt(0)}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-800">
                            {c.writerName}
                          </span>
                        </div>
                        <p className="mt-1.5 text-base leading-relaxed text-gray-700">
                          {c.content}
                        </p>
                        <span className="mt-2.5 block text-sm text-gray-500">
                          {format(new Date(c.createdAt), 'yyyy.MM.dd HH:mm')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg bg-gray-50 py-16 text-center">
                  <div className="mb-2 text-4xl">💬</div>
                  <p className="font-semibold text-gray-600">
                    아직 댓글이 없습니다.
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    가장 먼저 댓글을 남겨보세요!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
