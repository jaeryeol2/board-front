import Unauthorized from '@/components/common/client/Unauthorized';
import { X_IS_LOGIN } from '@/constants/common';
import { ParamsType } from '@/types/base';
import { Metadata } from 'next';
import { headers } from 'next/headers';
import BoardWriteUI from './_components/BoardWriteUI';

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: '게시글 작성',
    description: '새로운 게시글을 작성하는 페이지입니다.',
  };
};

export default async function BoardWrite({
  params,
}: Readonly<ParamsType<{ boardType: string }>>) {
  const boardType = (await params).boardType;
  const isLogin = JSON.parse((await headers()).get(X_IS_LOGIN) ?? 'false');

  if (!isLogin) {
    return <Unauthorized />;
  }

  return <BoardWriteUI boardType={boardType} />;
}
