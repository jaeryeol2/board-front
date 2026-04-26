'use client';

import Pagination from '@/components/common/client/Pagination';
import { Notice } from '@/types/notice';
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
    <div className="py-8">
      <div
        className="relative overflow-x-auto shadow-md sm:rounded-lg"
        style={{ minHeight: '640px' }}
      >
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                제목
              </th>
              <th scope="col" className="px-6 py-3">
                게시일
              </th>
            </tr>
          </thead>
          <tbody>
            {list.length > 0 ? (
              list.map((notice) => (
                <tr
                  key={notice.id}
                  className="bg-white border-b hover:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {notice.title}
                  </th>
                  <td className="px-6 py-4">{notice.createdAt}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={2}
                  className="h-[590px] text-center align-middle text-gray-500"
                >
                  데이터가 없습니다.
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
