import { ParamsType } from '@/types/base';

export default async function BoardWrite({
  params,
}: Readonly<ParamsType<{ boardType: string }>>) {
  const codeType = (await params).boardType;
  return <></>;
}
