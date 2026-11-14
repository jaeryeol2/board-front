import { BASE_SEO_TITLE } from '@/constants/common';
import { ParamsType, SearchParamsType } from '@/types/base';
import { Board, BoardFilter } from '@/types/board';
import { Menu } from '@/types/global';
import { appFetch } from '@/utils/app-fetch';
import { toSnakeCase } from '@/utils/case-converter';
import { isNotEmpty } from '@/utils/is-empty';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import BoardListUI from './_components/BoardListUI';

const fetchBoardInfoData = cache(async (boardType: string) => {
  return appFetch<Menu>(`/api/menus/${toSnakeCase(boardType).toUpperCase()}`, {
    next: { revalidate: 3600 },
  });
});
const fetchBoardListData = cache(
  async (boardType: string, query: BoardFilter) => {
    return appFetch<{ total: number; list: Array<Board> }>(
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
  const page = Number((await searchParams)?.page ?? 1);
  const rowsPerPage = 20;
  const { data: info, status: infoStatus } =
    await fetchBoardInfoData(boardType);

  // 존재하지 않는 게시판 타입이면 API가 404를 내려줍니다.
  if (!isNotEmpty(boardType) || infoStatus === 404) {
    return notFound();
  }

  const { data } = await fetchBoardListData(boardType, {
    page,
    rowsPerPage,
  });

  return (
    <BoardListUI
      total={data?.total ?? 0}
      list={data?.list ?? []}
      page={page}
      rowsPerPage={rowsPerPage}
      boardName={info?.menuName ?? ''}
    />
  );
}
