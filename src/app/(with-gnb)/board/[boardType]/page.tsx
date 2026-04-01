import { X_CURRENT_PATH } from '@/constants/common';
import { ParamsType, SearchParamsType } from '@/types/base';
import { Board } from '@/types/board';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isEmpty } from '@/utils/isEmpty';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import BoardListUI from './_components/BoardListUI';

type BoardFilter = {
  page: number;
  rowsPerPage: number;
};
const fetchData = cache(async (boardType: string, query: BoardFilter) => {
  return await appFetch<{ total: number; list: Array<Board> }>(
    `/api/board/${toSnakeCase(boardType).toUpperCase()}`,
    {
      query,
    },
  );
});

export const generateMetadata = async ({
  params,
}: Readonly<ParamsType<{ boardType: string }>>): Promise<Metadata> => {
  const boardType = (await params).boardType;
  console.log('>>>> ', boardType);
  return {
    title: '게시판입니다.',
    description: '임시입니다.',
  };
};

export default async function BoardPage({
  params,
  searchParams,
}: Readonly<ParamsType<{ boardType: string }> & SearchParamsType>) {
  const boardType = (await params).boardType;
  const page = Number((await searchParams).page as string);
  const rowsPerPage = 20;

  if (isEmpty(page)) {
    const path = (await headers()).get(X_CURRENT_PATH) ?? '/';
    redirect(path === '/' ? path : path.concat(`?page=1`));
  }

  const { data } = await fetchData(boardType, { page, rowsPerPage });

  return (
    <BoardListUI
      total={data?.total ?? 0}
      list={data?.list ?? []}
      page={page}
      rowsPerPage={rowsPerPage}
    />
  );
}
