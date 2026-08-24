'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import Pagination from '@/components/common/client/Pagination';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Board } from '@/types/board';
import { isNotEmpty } from '@/utils/is-empty';
import { format } from 'date-fns';
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { useContext, useEffect, useMemo } from 'react';

type BoardListProps = {
  total: number;
  list: Array<Board>;
  page: number;
  rowsPerPage: number;
  boardName: string;
};

/**
 * 게시판 목록 UI 컴포넌트
 * @param list 전체 게시글 목록
 */
export default function BoardListUI({
  total,
  list,
  page,
  rowsPerPage,
  boardName,
}: Readonly<BoardListProps>) {
  const router = useRouter();
  const path = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();
  const boardType = params.boardType as string;
  // 현재 페이지에 해당하는 데이터 목록
  const paginatedList = useMemo(() => list, [list]);
  const { isLogin } = useContext(GlobalContext);
  const canWrite = isLogin && boardType !== 'board-popular';
  const isNotAnony = boardType !== 'board-anony';

  const handlePage = (page: number) => {
    router.push(`/board/${boardType}?page=${page}`);
  };

  /**
   * 글쓰기 버튼 클릭 시 글쓰기 페이지로 이동합니다.
   */
  const handleWriteClick = (): void => {
    router.push(`/board/${boardType}/write`);
  };

  useEffect(() => {
    if (!searchParams.has('page')) {
      history.replaceState(null, '', `${path}?page=1`);
    }
  }, [path, searchParams]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center gap-3 mb-4 sm:mb-6">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight truncate">
          {boardName}
        </h1>
        {canWrite && (
          <Button
            onClick={handleWriteClick}
            className="flex-shrink-0 bg-[#0066cc] hover:bg-[#0071e3] text-white px-4 sm:px-5 py-1.5 sm:py-2 rounded-full font-medium text-[13px] sm:text-[14px] transition-all shadow-none"
          >
            글쓰기
          </Button>
        )}
      </div>

      {/* PC Table View */}
      <div className="hidden md:block relative overflow-hidden bg-white border border-[#e0e0e0] rounded-[18px]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#fafafc] text-[13px] font-semibold text-[#7a7a7a] border-b border-[#e0e0e0]">
            <tr>
              <th scope="col" className="w-20 px-6 py-3.5 text-center">
                번호
              </th>
              <th scope="col" className="px-6 py-3.5">
                제목
              </th>
              {isNotAnony && (
                <th scope="col" className="w-32 px-6 py-3.5 text-center">
                  작성자
                </th>
              )}
              <th scope="col" className="w-32 px-6 py-3.5 text-center">
                작성일
              </th>
              <th scope="col" className="w-24 px-6 py-3.5 text-center">
                조회수
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {paginatedList.length > 0 ? (
              paginatedList.map((board: Board, index: number) => (
                <tr
                  key={board.id}
                  className="group bg-white hover:bg-[#fafafc] transition-colors"
                >
                  <td className="px-6 py-4 text-center text-[13px] text-[#7a7a7a]">
                    {total - (page - 1) * rowsPerPage - index}
                  </td>
                  <td className="px-6 py-4">
                    <AppLink
                      href={`/board/${boardType}/${board.id}`}
                      className="flex items-center gap-3 group/link"
                    >
                      {isNotEmpty(board.fileUrl) && (
                        <div className="w-10 h-7 flex-shrink-0 rounded-[6px] bg-[#f5f5f7] border border-[#e0e0e0] overflow-hidden">
                          <div className="w-full h-full flex items-center justify-center text-[#7a7a7a]">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <span className="font-medium text-[#1d1d1f] group-hover/link:text-[#0066cc] transition-colors truncate max-w-md text-[15px]">
                        {board.title}
                      </span>
                    </AppLink>
                  </td>
                  {isNotAnony && (
                    <td className="px-6 py-4 text-center text-[14px] text-[#1d1d1f]">
                      {board.writerName}
                    </td>
                  )}
                  <td className="px-6 py-4 text-center text-[13px] text-[#7a7a7a]">
                    {isNotEmpty(board?.createdAt)
                      ? format(new Date(board.createdAt), 'MM.dd')
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-[#7a7a7a]">
                    {board.viewCount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center text-[#7a7a7a] text-[15px]">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-2.5 sm:space-y-3">
        {paginatedList.length > 0 ? (
          paginatedList.map((board: Board) => (
            <AppLink
              key={board.id}
              href={`/board/${boardType}/${board.id}`}
              className="block bg-white p-3.5 sm:p-4 rounded-[14px] border border-[#e0e0e0] active:bg-[#fafafc] transition-colors"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2 mb-1.5 break-words">
                    {board.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-[#7a7a7a]">
                    {isNotAnony && (
                      <>
                        <span className="text-[#1d1d1f] font-medium truncate max-w-[120px]">{board.writerName}</span>
                        <span className="text-[#e0e0e0]">|</span>
                      </>
                    )}
                    <span>
                      {isNotEmpty(board?.createdAt)
                        ? format(new Date(board.createdAt), 'yyyy.MM.dd')
                        : ''}
                    </span>
                    <span className="text-[#e0e0e0]">|</span>
                    <span>조회 {board.viewCount}</span>
                  </div>
                </div>
                {isNotEmpty(board.fileUrl) && (
                  <div className="w-12 h-12 sm:w-14 sm:h-14 flex-shrink-0 rounded-[8px] bg-[#f5f5f7] border border-[#e0e0e0] overflow-hidden">
                    <div className="w-full h-full flex items-center justify-center text-[#7a7a7a]">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </AppLink>
          ))
        ) : (
          <div className="py-14 sm:py-16 text-center text-[#7a7a7a] bg-white rounded-[14px] border border-[#e0e0e0] text-[14px] sm:text-[15px]">
            게시글이 없습니다.
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="flex justify-center mt-6 sm:mt-8">
          <Pagination
            totalItems={total}
            itemsPerPage={rowsPerPage}
            page={page}
            onPageChange={handlePage}
          />
        </div>
      )}
    </div>
  );
}
