'use client';

import Button from '@/components/base/Button';
import Textarea from '@/components/base/Textarea';
import Pagination from '@/components/common/client/Pagination';
import SectionLoading from '@/components/common/SectionLoading';
import { GlobalContext } from '@/contexts/GlobalContext';
import { BoardComment } from '@/types/board';
import { appFetch } from '@/utils/app-fetch';
import { format } from 'date-fns';
import {
  ComponentPropsWithRef,
  FocusEvent,
  useContext,
  useMemo,
  useState,
} from 'react';

interface BoardCommentSectionProps extends ComponentPropsWithRef<'div'> {
  boardId: number;
  initialComments: Array<BoardComment>;
  onFocusArea?: () => void;
}

export default function CommentSection({
  boardId,
  initialComments,
  onFocusArea,
  ref,
}: Readonly<BoardCommentSectionProps>) {
  const [loading, setLoading] = useState(false);
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

  const handleFocusArea = () => {
    if (onFocusArea) {
      onFocusArea();
    }
  };
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
        {
          onRequest() {
            setLoading(true);
          },
          onResponse() {
            setLoading(false);
          },
          onRequestError() {
            setLoading(false);
          },
        },
      );

      setCommentList(newComments ?? []);
      setPage(1);
      handleFocusArea();
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
    handleFocusArea();
  };

  return (
    <>
      {/* 댓글 섹션 */}
      <div ref={ref} className="mt-10 md:mt-16">
        {/* 댓글 헤더 */}
        <div className="flex items-center mb-4">
          <h2 className="text-lg md:text-xl font-bold text-gray-800">댓글</h2>
          <span className="ml-2 text-lg md:text-xl font-bold text-blue-600">
            {commentList?.length || 0}
          </span>
        </div>

        {/* 댓글 입력 폼 */}
        <div className="mt-4 md:mt-6 mb-6 md:mb-8">
          <div className="relative rounded-xl border border-gray-200 bg-white transition focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 shadow-sm">
            <Textarea
              placeholder="따뜻한 댓글을 남겨주세요. (100자 이내)"
              value={comment}
              onFocus={(e) => handleCheckComment(e)}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={100}
              className="w-full resize-none border-0 bg-transparent p-3 md:p-4 pb-12 text-sm md:text-base placeholder-gray-400 focus:outline-none"
            />
            <div className="absolute bottom-2 md:bottom-3 right-2 md:right-3 flex items-center">
              <span className="mr-3 text-xs md:text-sm text-gray-400">
                {comment.length}/100
              </span>
              <Button
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || !isLogin}
                className="rounded-lg px-4 md:px-5 py-1.5 md:py-2 text-xs md:text-sm font-semibold transition-all shadow-sm"
              >
                등록
              </Button>
            </div>
          </div>
        </div>

        {/* 댓글 목록 */}
        <SectionLoading loading={loading}>
          <div className="space-y-0">
            {paginatedComments && paginatedComments.length > 0 ? (
              paginatedComments.map((c, index) => (
                <div
                  key={c.id}
                  className={`py-4 md:py-5 ${index === paginatedComments.length - 1 ? '' : 'border-b border-gray-100'}`}
                >
                  <div className="flex items-start space-x-3 md:space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-full bg-blue-50 text-xs md:text-sm font-bold text-blue-600">
                        {c.writerName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[14px] md:text-[15px] text-gray-900 truncate">
                          {c.writerName}
                        </span>
                      </div>
                      <p className="mt-1 md:mt-1.5 text-[14px] md:text-base leading-relaxed text-gray-700 break-words">
                        {c.content}
                      </p>
                      <span className="mt-2 block text-xs md:text-sm text-gray-400">
                        {format(new Date(c.createdAt), 'yyyy.MM.dd HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-xl bg-gray-50 py-12 md:py-16 text-center border border-gray-100">
                <div className="mb-3 text-3xl md:text-4xl opacity-50">💬</div>
                <p className="font-semibold text-sm md:text-base text-gray-600">
                  아직 댓글이 없습니다.
                </p>
                <p className="mt-1 text-xs md:text-sm text-gray-400">
                  가장 먼저 댓글을 남겨보세요!
                </p>
              </div>
            )}
          </div>
          {/* 페이지네이션 */}
          {commentList.length > rowsPerPage && (
            <div className="flex justify-center mt-6 md:mt-8">
              <Pagination
                totalItems={commentList.length}
                itemsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onFocusArea={onFocusArea}
              />
            </div>
          )}
        </SectionLoading>
      </div>
    </>
  );
}
