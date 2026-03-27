import { ParamsType } from '@/types/base';
import { Board } from '@/types/board';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { cache } from 'react';

const fetchData = cache(async (boardType: string) => {
  return await appFetch<Array<Board>>(
    `/api/board/${toSnakeCase(boardType).toUpperCase()}`,
  );
});

export const generateMetadata = async ({
  params,
}: Readonly<ParamsType<{ boardType: string }>>) => {
  const boardType = (await params).boardType;
  const { data } = await fetchData(boardType);
};

export default async function BoardPage({
  params,
}: Readonly<ParamsType<{ boardType: string }>>) {
  const boardType = (await params).boardType;
  const { data } = await fetchData(boardType);
  return <></>;
}
