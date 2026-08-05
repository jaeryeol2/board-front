import { BoardFilter } from '@/types/board';
import { Notice } from '@/types/notice';
import { appFetch } from '@/utils/app-fetch';
import { SearchParameters } from 'ofetch';
import { cache } from 'react';
import NoticeListUI from './_components/NoticeListUI';

const fetchData = cache(async (query: BoardFilter) => {
  return appFetch<{ total: number; list: Array<Notice> }>('/api/notice', {
    method: 'get',
    query,
  });
});
export default async function NoticePage({
  searchParams,
}: Readonly<SearchParameters>) {
  const page = Number((await searchParams)?.page ?? 1);
  const rowsPerPage = 20;
  const { data } = await fetchData({
    page,
    rowsPerPage,
  });

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">공지사항</h1>
      <p className="text-gray-600 mb-8">서비스 관련 최신 소식을 확인하세요.</p>

      <NoticeListUI
        total={data?.total ?? 0}
        list={data?.list ?? []}
        page={page}
        rowsPerPage={rowsPerPage}
      />
    </div>
  );
}
