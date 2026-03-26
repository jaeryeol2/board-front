'use client';

import { clearCacheAll } from '@/actions/common';
import AppLink from '@/components/base/AppLink';
import { useGlobalStore } from '@/contexts/GlobalContext';
import { appFetch } from '@/utils/appFetch';
import { useRouter } from 'next/navigation';

type ClientHeaderProps = {
  menus: Array<{ menuName: string; href: string }>;
};

export default function ClientHeader({ menus }: Readonly<ClientHeaderProps>) {
  const { push } = useRouter();
  const { isLogin, userInfo } = useGlobalStore((state) => state);

  const handleLogout = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const { data } = await appFetch<boolean>('/api/logout', {
      method: 'post',
    }).catch(() => ({
      data: false,
    }));

    if (data) {
      clearCacheAll();
      push('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
      <div className="container mx-auto max-w-7xl flex items-center justify-between px-4 h-16">
        {/* Left Section: Logo and Menu */}
        <div className="flex items-center space-x-8">
          <AppLink href="/" className="text-2xl font-bold text-gray-800">
            MyLogo
          </AppLink>
          <nav className="hidden space-x-6 md:flex">
            {menus.map((item) => (
              <AppLink
                key={item.menuName}
                href={item.href}
                className="text-gray-500 font-medium transition-colors hover:text-gray-900 hover:bg-gray-100 px-3 py-2 rounded-md"
              >
                {item.menuName}
              </AppLink>
            ))}
          </nav>
        </div>

        {/* Right Section: Auth Links */}
        <div className="flex items-center space-x-4">
          {isLogin ? (
            <>
              <span className="text-gray-700 font-medium">
                Welcome, {userInfo?.userName}!
              </span>
              <AppLink
                href="/mypage"
                className="text-gray-500 font-medium transition-colors hover:text-gray-900"
              >
                My Page
              </AppLink>
              <span> | </span>
              <AppLink
                href="/"
                className="text-gray-500 font-medium transition-colors hover:text-gray-900"
                onNavigate={(e) => handleLogout(e)}
              >
                Logout
              </AppLink>
            </>
          ) : (
            <>
              <AppLink
                href="/login"
                className="px-4 py-2 text-blue-500 bg-blue-50 rounded-md font-semibold transition-colors hover:bg-blue-100"
              >
                Login
              </AppLink>
              <AppLink
                href="/signup"
                className="px-4 py-2 bg-blue-500 text-white rounded-md font-semibold transition-colors hover:bg-blue-600"
              >
                Sign Up
              </AppLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
