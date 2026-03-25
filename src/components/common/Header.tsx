import { appFetch } from '@/utils/appFetch';
import { cache } from 'react';
import ClientHeader from './client/ClientHeader';

const fetchData = cache(async () => {
  return await appFetch<Array<{ menuName: string; href: string }>>(
    '/api/menus',
  );
});

export default async function Header() {
  const { data } = await fetchData();
  return <ClientHeader menus={data ?? []} />;
}
