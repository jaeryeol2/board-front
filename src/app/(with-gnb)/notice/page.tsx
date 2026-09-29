import { BoardFilter } from '@/types/board';
import { SearchParamsType } from '@/types/base';
import { Notice } from '@/types/notice';
import { appFetch } from '@/utils/app-fetch';
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
}: Readonly<SearchParamsType>) {
  const page = Number((await searchParams)?.page ?? 1);
  const rowsPerPage = 20;
  const { data } = await fetchData({
    page,
    rowsPerPage,
  });

  return (
    <NoticeListUI
      total={data?.total ?? 0}
      list={data?.list ?? []}
      page={page}
      rowsPerPage={rowsPerPage}
    />
  );
}
