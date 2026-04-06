'use client';

import Button from '@/components/base/Button';
import Textarea from '@/components/base/Textarea';
import Pagination from '@/components/common/client/Pagination';
import { GlobalContext } from '@/contexts/GlobalContext';
import { BoardComment } from '@/types/board';
import { appFetch } from '@/utils/appFetch';
import { format } from 'date-fns';
import { FocusEvent, useContext, useMemo, useState } from 'react';

type BoardCommentSectionProps = {
  boardId: number;
  initialComments: Array<BoardComment>;
};

export default function CommentSection({
  boardId,
  initialComments,
}: Readonly<BoardCommentSectionProps>) {
  const [comment, setComment] = useState<string>('');
  const [commentList, setCommentList] = useState(initialComments);
  const [page, setPage] = useState(1);
  const rowsPerPage = 15; // 페이지 당 댓글 수

  // 현재 페이지에 보여질 댓글 목록
  const paginatedComments = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return commentList.slice(startIndex, endIndex);
  }, [commentList, page]);

  const { isLogin } = useContext(GlobalContext);

  const handleCommentSubmit = async () => {
    const { status, data } = await appFetch<boolean>(
      `/api/board/comment/${boardId}`,
      {
        method: 'post',
        body: {
          content: comment,
        },
      },
    );

    if (status === 201 && data) {
      setComment(''); // 댓글 입력 필드 초기화

      const { data: newComments } = await appFetch<Array<BoardComment>>(
        `/api/board/comment/${boardId}`,
      );
      setCommentList(newComments ?? []);
      setPage(1); // 새 댓글 등록 후 1페이지로 이동
    }
  };

  const handleCheckComment = (e: FocusEvent<HTMLTextAreaElement>) => {
    e.preventDefault();

    if (!isLogin) {
      alert('로그인이 필요합니다.');
      e.target.blur();
    }
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <>
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
          {paginatedComments && paginatedComments.length > 0 ? (
            paginatedComments.map((c, index) => (
              <div
                key={c.id}
                className={`py-5 ${index === paginatedComments.length - 1 ? '' : 'border-b border-gray-100'}`}
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
        {/* 페이지네이션 */}
        {commentList.length > rowsPerPage && (
          <div className="flex justify-center mt-8">
            <Pagination
              totalItems={commentList.length}
              itemsPerPage={rowsPerPage}
              page={page}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </>
  );
}
