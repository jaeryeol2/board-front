'use client';

import Button from '@/components/base/Button';
import Pagination from '@/components/common/client/Pagination';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Board } from '@/types/board';
import { isNotEmpty } from '@/utils/isEmpty';
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

  /**
   * 행 클릭 시 상세 페이지로 이동합니다.
   * @param boardId 게시글 ID
   */
  const handleRowClick = (boardId: number) => {
    router.push(`/board/${boardType}/${boardId}`);
  };
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
    <div className="py-8">
      {canWrite && (
        <div className="flex justify-end mb-4">
          <Button onClick={handleWriteClick}>글쓰기</Button>
        </div>
      )}
      <div
        className="relative overflow-x-auto shadow-md sm:rounded-lg"
        style={{ minHeight: '640px' }}
      >
        <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="w-24 px-6 py-3 text-center">
                번호
              </th>
              <th scope="col" className="px-6 py-3 cols-2">
                제목
              </th>
              {isNotAnony && (
                <th scope="col" className="w-40 px-6 py-3 text-center">
                  작성자
                </th>
              )}
              <th scope="col" className="w-40 px-6 py-3 text-center">
                작성일
              </th>
              <th scope="col" className="w-40 px-6 py-3 text-center">
                조회수
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedList.length > 0 ? (
              paginatedList.map((board: Board, index: number) => (
                <tr
                  key={board.id}
                  className="cursor-pointer border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600"
                  onClick={() => handleRowClick(board.id)}
                >
                  <td className="px-6 py-4 text-center">
                    {total - (page - 1) * rowsPerPage - index}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    <div className="flex items-center gap-3">
                      {/* NOTE: 섬네일 이미지 영역. board.thumbnailUrl과 같은 데이터가 있다면 AppImage 컴포넌트로 교체할 수 있습니다. */}
                      {isNotEmpty(board.fileUrl) ? (
                        <div className="w-16 h-10 flex-shrink-0 rounded-md bg-gray-100 dark:bg-gray-700" />
                      ) : (
                        <span className="w-16 h-10"></span>
                      )}
                      {/* NOTE: 섬네일 이미지 영역. board.thumbnailUrl과 같은 데이터가 있다면 AppImage 컴포넌트로 교체할 수 있습니다. */}
                      <span className="whitespace-nowrap overflow-hidden text-ellipsis">
                        {board.title}
                      </span>
                    </div>
                  </td>
                  {isNotAnony && (
                    <td className="px-6 py-4 text-center">
                      {board.writerName}
                    </td>
                  )}
                  <td className="px-6 py-4 text-center">
                    {isNotEmpty(board?.createdAt)
                      ? format(new Date(board.createdAt), 'yyyy.MM.dd')
                      : ''}
                  </td>
                  <td className="px-6 py-4 text-center">{board.viewCount}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="h-[590px] text-center align-middle text-gray-500"
                >
                  게시글이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {total > 0 && (
        <div className="flex justify-center mt-4">
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
