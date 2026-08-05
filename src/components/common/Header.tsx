import { Menu } from '@/types/global';
import { appFetch } from '@/utils/app-fetch';
import { cache } from 'react';
import ClientHeader from './client/ClientHeader';

const fetchData = cache(async () => {
  return await appFetch<Array<Menu>>('/api/menus', {
    next: { revalidate: 3600 },
  });
});

export default async function Header() {
  const { data } = await fetchData();
  return <ClientHeader menus={data ?? []} />;
}
