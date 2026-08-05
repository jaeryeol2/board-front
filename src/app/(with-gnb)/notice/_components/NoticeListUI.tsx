'use client';

import Pagination from '@/components/common/client/Pagination';
import { Notice } from '@/types/notice';
import { isNotEmpty } from '@/utils/is-empty';
import { format } from 'date-fns';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

type NoticeProps = {
  total: number;
  list: Array<Notice>;
  page: number;
  rowsPerPage: number;
};

export default function NoticeListUI({
  total,
  list,
  page,
  rowsPerPage,
}: Readonly<NoticeProps>) {
  const router = useRouter();
  const path = usePathname();
  const searchParams = useSearchParams();

  const handlePage = (nextPage: number) => {
    router.push(`${path}?page=${nextPage}`);
  };

  useEffect(() => {
    if (!searchParams.has('page')) {
      history.replaceState(null, '', `${path}?page=1`);
    }
  }, [path, searchParams]);

  return (
    <div className="py-6 md:py-8 px-4 md:px-0">
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          공지사항
        </h1>
      </div>

      {/* PC Table View */}
      <div className="hidden md:block relative overflow-hidden bg-white shadow-sm border border-gray-100 rounded-2xl">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="bg-gray-50/50 text-xs uppercase text-gray-700 border-b border-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4">
                제목
              </th>
              <th scope="col" className="w-32 px-6 py-4 text-center">
                게시일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {list.length > 0 ? (
              list.map((notice) => (
                <tr
                  key={notice.id}
                  className="group bg-white hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {notice.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-400">
                    {isNotEmpty(notice?.createdAt)
                      ? format(new Date(notice.createdAt), 'yyyy.MM.dd')
                      : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-20 text-center text-gray-400">
                  등록된 공지사항이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {list.length > 0 ? (
          list.map((notice) => (
            <div
              key={notice.id}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm transition-colors"
            >
              <div className="flex flex-col gap-2">
                <h3 className="text-[15px] font-semibold text-gray-900 leading-snug line-clamp-2">
                  {notice.title}
                </h3>
                <div className="text-xs text-gray-500">
                  {isNotEmpty(notice?.createdAt)
                    ? format(new Date(notice.createdAt), 'yyyy.MM.dd')
                    : ''}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center text-gray-400 border border-gray-100 rounded-xl bg-white">
            등록된 공지사항이 없습니다.
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
