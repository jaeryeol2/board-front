import { PersonalUserInfoType } from '@/types/user';
import { appFetch } from '@/utils/appFetch';
import { isNotEmpty } from '@/utils/isEmpty';
import { redirect } from 'next/navigation';
import MypageUI from './_components/MypageUI';

export default async function Mypage() {
  const { data } = await appFetch<PersonalUserInfoType>('/api/user/personal');

  if (!isNotEmpty(data)) {
    return redirect('/', 'replace');
  }

  return <MypageUI personal={data} />;
}
