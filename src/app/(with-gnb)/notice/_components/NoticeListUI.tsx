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
    <div className="w-full">
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#1d1d1f] tracking-tight">
          공지사항
        </h1>
      </div>

      {/* PC Table View */}
      <div className="hidden md:block relative overflow-hidden bg-white border border-[#e0e0e0] rounded-[18px]">
        <table className="w-full text-sm text-left">
          <thead className="bg-[#fafafc] text-[13px] font-semibold text-[#7a7a7a] border-b border-[#e0e0e0]">
            <tr>
              <th scope="col" className="px-6 py-3.5">
                제목
              </th>
              <th scope="col" className="w-36 px-6 py-3.5 text-center">
                게시일
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f0f0f0]">
            {list.length > 0 ? (
              list.map((notice) => (
                <tr
                  key={notice.id}
                  className="group bg-white hover:bg-[#fafafc] transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors text-[15px]">
                      {notice.title}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-[13px] text-[#7a7a7a]">
                    {isNotEmpty(notice?.createdAt)
                      ? format(new Date(notice.createdAt), 'yyyy.MM.dd')
                      : ''}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="py-20 text-center text-[#7a7a7a] text-[15px]">
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
              className="bg-white p-4 rounded-[14px] border border-[#e0e0e0] transition-colors"
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="text-[15px] font-semibold text-[#1d1d1f] leading-snug line-clamp-2">
                  {notice.title}
                </h3>
                <div className="text-xs text-[#7a7a7a]">
                  {isNotEmpty(notice?.createdAt)
                    ? format(new Date(notice.createdAt), 'yyyy.MM.dd')
                    : ''}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center text-[#7a7a7a] border border-[#e0e0e0] rounded-[14px] bg-white text-[15px]">
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
