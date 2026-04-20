import { HomeType } from '@/types/home';
import { appFetch } from '@/utils/appFetch';
import HomeUI from './_components/HomeUI';

export default async function HomePage() {
  const { data } = await appFetch<Array<HomeType>>('/api/home');
  console.log(data);
  return <HomeUI menus={data ?? []} />;
}
