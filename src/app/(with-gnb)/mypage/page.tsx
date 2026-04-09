import Unauthorized from '@/components/common/client/Unauthorized';
import { PersonalUserInfoType } from '@/types/user';
import { appFetch } from '@/utils/appFetch';
import { isNotEmpty } from '@/utils/isEmpty';
import { notFound } from 'next/navigation';
import MypageUI from './_components/MypageUI';

export default async function Mypage() {
  const { status, data } =
    await appFetch<PersonalUserInfoType>('/api/user/personal');

  if (status === 401) {
    return <Unauthorized />;
  }

  if (!isNotEmpty(data)) {
    return notFound();
  }

  return <MypageUI personal={data} />;
}
