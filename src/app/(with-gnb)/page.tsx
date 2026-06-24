import { HomeType } from '@/types/home';
import { appFetch } from '@/utils/appFetch';
import { cache } from 'react';
import HomeUI from './_components/HomeUI';

const fetchData = cache(async () => {
  return appFetch<Array<HomeType>>('/api/home', {
    next: {
      revalidate: 3600,
    },
  });
});

export default async function HomePage() {
  const { data } = await fetchData();

  return <HomeUI menus={data ?? []} />;
}
