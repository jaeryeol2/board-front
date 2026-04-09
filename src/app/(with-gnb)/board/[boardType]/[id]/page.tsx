import Unauthorized from '@/components/common/client/Unauthorized';
import { ParamsType } from '@/types/base';
import { BoardDetail } from '@/types/board';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isNotEmpty } from '@/utils/isEmpty';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import BoardDetailUI from '../_components/BoardDetailUI';

type BoardDetailParam = {
  boardType: string;
  id: number;
};
const fetchData = cache(async (boardType: string, id: number) => {
  return await appFetch<BoardDetail>(
    `/api/board/${toSnakeCase(boardType).toUpperCase()}/${id}`,
  );
});

export const generateMetadata = async ({
  params,
}: Readonly<ParamsType<BoardDetailParam>>): Promise<Metadata> => {
  const { boardType, id } = await params;
  const { data } = await fetchData(boardType, id);

  return {
    title: data?.title,
    description: data?.content,
  };
};
export default async function BoardDetailPage({
  params,
}: Readonly<ParamsType<BoardDetailParam>>) {
  const { boardType, id } = await params;
  const { status, data } = await fetchData(boardType, id);

  if (status === 401) {
    return <Unauthorized />;
  }

  if (!isNotEmpty(data)) {
    return notFound();
  }

  return <BoardDetailUI board={data} />;
}
