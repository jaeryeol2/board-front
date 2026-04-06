import { BASE_SEO_TITLE } from '@/constants/common';
import { ParamsType, SearchParamsType } from '@/types/base';
import { Board } from '@/types/board';
import { Menu } from '@/types/global';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isNotEmpty } from '@/utils/isEmpty';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import BoardListUI from './_components/BoardListUI';

type BoardFilter = {
  page: number;
  rowsPerPage: number;
};
const fetchBoardInfoData = cache(async (boardType: string) => {
  return await appFetch<Menu>(
    `/api/menus/${toSnakeCase(boardType).toUpperCase()}`,
    { next: { revalidate: 3600 } },
  );
});
const fetchBoardListData = cache(
  async (boardType: string, query: BoardFilter) => {
    return await appFetch<{ total: number; list: Array<Board> }>(
      `/api/board/${toSnakeCase(boardType).toUpperCase()}`,
      {
        query,
      },
    );
  },
);

export const generateMetadata = async ({
  params,
}: Readonly<ParamsType<{ boardType: string }>>): Promise<Metadata> => {
  const boardType = (await params).boardType;
  const { data } = await fetchBoardInfoData(boardType);

  if (isNotEmpty(data)) {
    return {
      title: `${BASE_SEO_TITLE} | ${data.menuName}`,
      description: data.href,
    };
  }

  return {
    title: `${BASE_SEO_TITLE} | 게시판`,
    description: 'The Board.',
  };
};

export default async function BoardPage({
  params,
  searchParams,
}: Readonly<ParamsType<{ boardType: string }> & SearchParamsType>) {
  const boardType = (await params).boardType;
  const hasPage = isNotEmpty((await searchParams)?.page);
  const page = Number((await searchParams)?.page ?? 1);
  const rowsPerPage = 20;
  const { data } = await fetchBoardListData(boardType, {
    page,
    rowsPerPage,
  });

  if (!isNotEmpty(boardType)) {
    return notFound();
  }

  return (
    <BoardListUI
      total={data?.total ?? 0}
      list={data?.list ?? []}
      page={page}
      rowsPerPage={rowsPerPage}
      redefinePage={!hasPage}
    />
  );
}
