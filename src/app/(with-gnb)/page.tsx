import { Menu } from '@/types/global';
import { appFetch } from '@/utils/appFetch';
import HomeUI from './_components/HomeUI';

export default async function HomePage() {
  const { data: MenuList } = await appFetch<Array<Menu>>('/api/menus');
  return <HomeUI />;
}
