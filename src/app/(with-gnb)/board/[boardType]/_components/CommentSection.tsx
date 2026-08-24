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
      <div ref={ref} className="mt-6 sm:mt-8 md:mt-12">
        {/* 댓글 헤더 */}
        <div className="flex items-center mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight">댓글</h2>
          <span className="ml-2 text-base sm:text-lg font-semibold text-[#0066cc]">
            {commentList?.length || 0}
          </span>
        </div>

        {/* 댓글 입력 폼 */}
        <div className="mt-3 sm:mt-4 mb-6 sm:mb-8">
          <div className="relative rounded-[14px] border border-[#e0e0e0] bg-white focus-within:border-[#0066cc] focus-within:ring-2 focus-within:ring-[#0066cc]/20 transition-all">
            <Textarea
              placeholder="따뜻한 댓글을 남겨주세요. (100자 이내)"
              value={comment}
              onFocus={(e) => handleCheckComment(e)}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              maxLength={100}
              className="w-full resize-none border-0 bg-transparent p-3 sm:p-3.5 pb-12 text-[14px] sm:text-[15px] placeholder:text-[#86868b] focus:outline-none focus:ring-0"
            />
            <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2 sm:gap-3">
              <span className="text-[11px] sm:text-xs text-[#7a7a7a]">
                {comment.length}/100
              </span>
              <Button
                onClick={handleCommentSubmit}
                disabled={!comment.trim() || !isLogin}
                className="rounded-full px-3.5 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-[13px] font-medium bg-[#0066cc] text-white hover:bg-[#0071e3] transition-all shadow-none"
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
                  className={`py-3.5 sm:py-4 ${index === paginatedComments.length - 1 ? '' : 'border-b border-[#f0f0f0]'}`}
                >
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[#f5f5f7] text-[12px] sm:text-[13px] font-semibold text-[#0066cc]">
                        {c.writerName.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-semibold text-[13px] sm:text-[14px] text-[#1d1d1f] truncate">
                          {c.writerName}
                        </span>
                      </div>
                      <p className="mt-1 text-[14px] sm:text-[15px] leading-relaxed text-[#1d1d1f] break-words">
                        {c.content}
                      </p>
                      <span className="mt-1.5 block text-[11px] sm:text-[12px] text-[#7a7a7a]">
                        {format(new Date(c.createdAt), 'yyyy.MM.dd HH:mm')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[14px] bg-[#fafafc] py-10 sm:py-12 text-center border border-[#e0e0e0]">
                <div className="mb-2 text-2xl opacity-40">💬</div>
                <p className="font-medium text-[13px] sm:text-[14px] text-[#1d1d1f]">
                  아직 댓글이 없습니다.
                </p>
                <p className="mt-1 text-[11px] sm:text-[12px] text-[#7a7a7a]">
                  가장 먼저 댓글을 남겨보세요!
                </p>
              </div>
            )}
          </div>
          {/* 페이지네이션 */}
          {commentList.length > rowsPerPage && (
            <div className="flex justify-center mt-5 sm:mt-6">
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
