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

  const handleLogout = async () => {
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

    for (const menu of menus) {
      menuMap.set(menu.id, { ...menu, children: [] });

      const menuItem = menuMap.get(menu.id);

      if (menuItem) {
        if (menu.parentId) {
          const parent = menuMap.get(menu.parentId);
          parent?.children?.push(menuItem);
        } else {
          rootMenus.push(menuItem);
        }
      }
    }

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
            The Lounge.
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
              <AppLink
                href="/mypage"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {userInfo?.userName ?? '회원'}님
              </AppLink>
              <span>|</span>
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
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // For hover delay

  const isActive =
    item.href !== '/' && pathname.startsWith(item.href)
      ? 'text-blue-600 font-semibold'
      : 'text-gray-500 font-medium';

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100); // Small delay to allow moving mouse from button to menu
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus(); // Return focus to the button
      }
    },
    [isOpen],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // 클릭이 메뉴 외부와 버튼 외부에서 발생했을 때만 메뉴를 닫습니다.
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown); // Add keydown listener

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown); // Clean up
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  if (item.menuType === 'DIRECTORY' && item.children?.length) {
    return (
      <div className="relative">
        <Button
          ref={buttonRef} // Assign ref to the button
          onClick={handleToggle}
          onMouseEnter={handleOpen} // Open on hover
          onMouseLeave={handleClose} // Close on leave (with delay)
          className={`flex items-center rounded-md px-3 py-2 text-sm transition-colors hover:bg-gray-100 hover:text-gray-900 ${isActive}`}
          aria-haspopup="menu" // Indicate that this button opens a menu
          aria-expanded={isOpen} // Indicate whether the menu is currently open
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
        </Button>
        {isOpen && (
          <div className="absolute left-0 top-full z-10 mt-2 w-48 origin-top-left rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5">
            <div // Assign menuRef to the actual dropdown div
              ref={menuRef}
              onMouseEnter={handleOpen} // Keep open if mouse enters menu
              onMouseLeave={handleClose} // Close if mouse leaves menu (with delay)
              role="menu" // Add role and orientation to the actual menu container
              aria-orientation="vertical"
              tabIndex={-1} // Make the menu focusable
              className="py-1"
            >
              {item.children.map((child, index) => (
                <Fragment key={child.id}>
                  <AppLink
                    href={child.href}
                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-100"
                    role="menuitem" // Indicate this is a menu item
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
