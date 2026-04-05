import { X_CURRENT_PATH } from '@/constants/common';
import { ParamsType, SearchParamsType } from '@/types/base';
import { Board } from '@/types/board';
import { Menu } from '@/types/global';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isEmpty, isNotEmpty } from '@/utils/isEmpty';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
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
      title: `The Lounge. | ${data.menuName}`,
      description: data.href,
    };
  }

  return {
    title: 'The Lounge. | 게시판',
    description: 'The Board.',
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

  const { data } = await fetchBoardListData(boardType, { page, rowsPerPage });

  return (
    <BoardListUI
      total={data?.total ?? 0}
      list={data?.list ?? []}
      page={page}
      rowsPerPage={rowsPerPage}
    />
  );
}
