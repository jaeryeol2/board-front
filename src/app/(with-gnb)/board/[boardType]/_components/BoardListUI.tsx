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
    <div className="py-6 md:py-8 px-4 md:px-0">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          {boardName}
        </h1>
        {canWrite && (
          <Button
            onClick={handleWriteClick}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full shadow-sm transition-all"
          >
            글쓰기
          </Button>
        )}
      </div>

      {/* PC Table View */}
      <div className="hidden md:block relative overflow-hidden bg-white shadow-sm border border-gray-100 rounded-2xl">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/50 text-xs uppercase text-gray-700 border-b border-gray-100">
            <tr>
              <th scope="col" className="w-20 px-6 py-4 text-center">
                번호
              </th>
              <th scope="col" className="px-6 py-4">
                제목
              </th>
              {isNotAnony && (
                <th scope="col" className="w-32 px-6 py-4 text-center">
                  작성자
                </th>
              )}
              <th scope="col" className="w-32 px-6 py-4 text-center">
                작성일
              </th>
              <th scope="col" className="w-24 px-6 py-4 text-center">
                조회수
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {paginatedList.length > 0 ? (
              paginatedList.map((board: Board, index: number) => (
                <tr
                  key={board.id}
                  className="group bg-white hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4 text-center text-gray-400">
                    {total - (page - 1) * rowsPerPage - index}
                  </td>
                  <td className="px-6 py-4">
                    <AppLink
                      href={`/board/${boardType}/${board.id}`}
                      className="flex items-center gap-3 group/link"
                    >
                      {isNotEmpty(board.fileUrl) && (
                        <div className="w-12 h-8 flex-shrink-0 rounded bg-gray-100 overflow-hidden">
                          {/* Placeholder for thumbnail */}
                          <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-blue-200"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <span className="font-medium text-gray-900 group-hover/link:text-blue-600 transition-colors truncate max-w-md">
                        {board.title}
                      </span>
                    </AppLink>
                  </td>
                  {isNotAnony && (
                    <td className="px-6 py-4 text-center text-gray-600">
                      {board.writerName}
                    </td>
                  )}
                  <td className="px-6 py-4 text-center text-gray-400">
                    {isNotEmpty(board?.createdAt)
                      ? format(new Date(board.createdAt), 'MM.dd')
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {board.viewCount}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-20 text-center text-gray-400">
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedList.length > 0 ? (
          paginatedList.map((board: Board) => (
            <AppLink
              key={board.id}
              href={`/board/${boardType}/${board.id}`}
              className="block bg-white p-4 rounded-xl border border-gray-100 shadow-sm active:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2 mb-2">
                    {board.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    {isNotAnony && (
                      <>
                        <span>{board.writerName}</span>
                        <span className="text-gray-200">|</span>
                      </>
                    )}
                    <span>
                      {isNotEmpty(board?.createdAt)
                        ? format(new Date(board.createdAt), 'yyyy.MM.dd')
                        : ''}
                    </span>
                    <span className="text-gray-200">|</span>
                    <span>조회 {board.viewCount}</span>
                  </div>
                </div>
                {isNotEmpty(board.fileUrl) && (
                  <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-50 overflow-hidden">
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-blue-100"
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
          <div className="py-20 text-center text-gray-400">
            게시글이 없습니다.
          </div>
        )}
      </div>

      {total > 0 && (
        <div className="flex justify-center mt-8">
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
