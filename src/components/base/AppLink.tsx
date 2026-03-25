'use client';

import { clearCache, clearCacheAll } from '@/actions/common';
import { LinkProps } from '@/types/component';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AppLink({ children, ...props }: Readonly<LinkProps>) {
  const currentPath = usePathname();
  const router = useRouter();
  const { href, onNavigate, replace } = props;
  const isSamePage = currentPath === href;
  const handleNavigate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (isSamePage) {
      if (onNavigate) {
        await Promise.resolve(onNavigate(e));
      }

      clearCache(href, 'page');
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });

      return;
    }

    if (onNavigate) {
      await Promise.resolve(onNavigate(e));
      return;
    }

    if (replace) {
      clearCacheAll();
      router.replace(href);
    } else {
      router.push(href);
    }
  };

  return (
    <Link {...props} onNavigate={(e) => handleNavigate(e)}>
      {children}
    </Link>
  );
}
