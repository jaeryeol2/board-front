import { ParamsType } from '@/types/base';
import { BoardDetail } from '@/types/board';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isNotEmpty } from '@/utils/isEmpty';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import BoardWriteUI from '../_components/BoardWriteUI';

type BoardDetailParam = {
  boardType: string;
  id: string;
};

const fetchData = cache(async ({ boardType, id }: BoardDetailParam) => {
  return await appFetch<BoardDetail>(
    `/api/board/${toSnakeCase(boardType).toUpperCase()}/${id}`,
    {
      method: 'get',
      cache: 'no-store', // 수정 화면이므로 캐싱되지 않도록 처리
    },
  );
});

export const generateMetadata = async ({
  params,
}: ParamsType<BoardDetailParam>): Promise<Metadata> => {
  const { boardType, id } = await params;
  const { data } = await fetchData({ boardType, id });

  if (!isNotEmpty(data)) {
    return {
      title: '수정',
    };
  }

  return {
    title: data.title,
    description: data.content,
  };
};

export default async function ModifyPage({
  params,
}: Readonly<ParamsType<BoardDetailParam>>) {
  const { boardType, id } = await params;

  if (!isNotEmpty(boardType) || !isNotEmpty(id)) {
    return notFound();
  }

  const { status, data } = await fetchData({ boardType, id });

  if (status !== 200 || !data) {
    return notFound();
  }

  return (
    <BoardWriteUI
      boardType={boardType}
      initialData={data}
      isModify={true}
      postId={id}
    />
  );
}
