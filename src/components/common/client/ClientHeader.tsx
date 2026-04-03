'use client';

import { clearCacheAll } from '@/actions/common';
import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Menu, MenuItem } from '@/types/global';
import { appFetch } from '@/utils/appFetch';
import { usePathname, useRouter } from 'next/navigation';
import {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type ClientHeaderProps = { menus: Array<Menu> };

export default function ClientHeader({ menus }: Readonly<ClientHeaderProps>) {
  const { push } = useRouter();
  const { isLogin, userInfo } = useContext(GlobalContext);

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

  const menuTree = useMemo(() => {
    const menuMap = new Map<number, MenuItem>();
    const rootMenus: MenuItem[] = [];

    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    menus.forEach((menu) => {
      const menuItem = menuMap.get(menu.id);
      if (menuItem) {
        if (menu.parentId) {
          const parent = menuMap.get(menu.parentId);
          parent?.children?.push(menuItem);
        } else {
          rootMenus.push(menuItem);
        }
      }
    });

    return rootMenus;
  }, [menus]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Left Section: Logo and Menu */}
        <div className="flex items-center space-x-8">
          <AppLink
            href="/"
            className="text-xl font-extrabold text-gray-900 md:text-2xl"
          >
            Board
          </AppLink>
          <nav className="hidden items-center space-x-1 md:flex">
            {menuTree.map((menu) => (
              <HeaderMenuItem key={menu.id} item={menu} />
            ))}
          </nav>
        </div>

        {/* Right Section: Auth Links */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isLogin ? (
            <div className="flex items-center space-x-4">
              <span className="hidden text-sm font-medium text-gray-700 sm:block">
                {userInfo?.userName}님
              </span>
              <AppLink
                href="/mypage"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                마이페이지
              </AppLink>
              <Button
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <>
              <AppLink
                href="/login"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                로그인
              </AppLink>
              <AppLink
                href="/signup"
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                회원가입
              </AppLink>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function HeaderMenuItem({ item }: Readonly<{ item: MenuItem }>) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive =
    item.href !== '/' && pathname.startsWith(item.href)
      ? 'text-blue-600 font-semibold'
      : 'text-gray-500 font-medium';

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (item.menuType === 'DIRECTORY' && item.children?.length) {
    return (
      <div
        ref={menuRef}
        className="relative"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <button
          type="button"
          onClick={handleToggle}
          className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 ${isActive}`}
        >
          {item.menuName}
          <svg
            className={`ml-1 h-4 w-4 transform text-gray-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {isOpen && (
          <div className="absolute left-0 top-full z-10 mt-2 w-48 origin-top-left rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div className="py-1">
              {item.children.map((child, index) => (
                <Fragment key={child.id}>
                  <AppLink
                    href={child.href}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    {child.menuName}
                  </AppLink>
                  {index < item.children!.length - 1 && (
                    <hr className="mx-2 border-gray-100" />
                  )}
                </Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <AppLink
      href={item.href}
      className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 ${isActive}`}
    >
      {item.menuName}
    </AppLink>
  );
}
