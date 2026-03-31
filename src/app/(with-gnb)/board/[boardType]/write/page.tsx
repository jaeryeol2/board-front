import { ParamsType } from '@/types/base';
import { Metadata } from 'next';
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

  return <BoardWriteUI boardType={boardType} />;
}
