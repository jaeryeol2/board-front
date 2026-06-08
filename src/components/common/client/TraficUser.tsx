'use client';

import { appFetch } from '@/utils/appFetch';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function TraficUser({ userCount }: Readonly<{ userCount: number }>) {
  const [count, setCount] = useState(() => userCount);
  const isMounted = useRef(false);
  const path = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await appFetch<number>('/api/user/user-count');
      setCount(data ?? 0);
    };
    // const handleRemoveTraficUser = async () => {
    //   appFetch<boolean>('/api/user/user-count', {
    //     method: 'delete',
    //   });
    // };

    if (isMounted.current) {
      fetchData();
    } else {
      isMounted.current = true;
    }

    // window.addEventListener('beforeunload', handleRemoveTraficUser);
  }, [path]);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 border border-[#e5e8eb] bg-white rounded-full text-[12px] font-medium text-[#4e5968]">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
      </span>{' '}
      동시접속자 <strong className="text-[#333d4b]">{count}</strong>명
    </div>
  );
}
