'use client';

import { logoutAction } from '@/actions/user';
import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Menu, MenuItem } from '@/types/global';
import { appFetch } from '@/utils/appFetch';
import { usePathname } from 'next/navigation';
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
  const { isLogin, userInfo } = useContext(GlobalContext);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    const { data } = await appFetch<boolean>('/api/logout', {
      method: 'post',
    }).catch(() => ({
      data: false,
    }));

    if (data) {
      logoutAction();
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
            className="text-xl font-extrabold text-blue-600 md:text-2xl"
          >
            The Lounge.
          </AppLink>
          <nav className="hidden items-center space-x-1 lg:flex">
            {menuTree.map((menu) => (
              <HeaderMenuItem key={menu.id} item={menu} />
            ))}
          </nav>
        </div>

        {/* Right Section: Auth Links (PC) */}
        <div className="hidden items-center space-x-2 lg:flex sm:space-x-4">
          {isLogin ? (
            <div className="flex items-center space-x-2">
              <AppLink
                href="/mypage"
                className="text-sm font-medium text-gray-500 transition-colors hover:text-gray-900"
              >
                {userInfo?.userName ?? '회원'}님
              </AppLink>
              <span className="text-gray-300">|</span>
              <Button
                className="bg-transparent text-sm font-medium text-gray-500 transition-colors hover:text-gray-900 px-0 py-0 shadow-none border-none"
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
                className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 shadow-sm"
              >
                회원가입
              </AppLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <nav className="flex flex-col p-4 space-y-1">
            {menuTree.map((menu) => (
              <div key={menu.id} className="flex flex-col">
                {menu.children && menu.children.length > 0 ? (
                  <>
                    <div className="px-3 py-2 text-sm font-semibold text-gray-900">
                      {menu.menuName}
                    </div>
                    <div className="ml-4 flex flex-col space-y-1 border-l-2 border-gray-50 pl-2">
                      {menu.children.map((child) => (
                        <AppLink
                          key={child.id}
                          href={child.href}
                          className="rounded-md px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.menuName}
                        </AppLink>
                      ))}
                    </div>
                  </>
                ) : (
                  <AppLink
                    href={menu.href}
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.menuName}
                  </AppLink>
                )}
              </div>
            ))}
            <hr className="my-2 border-gray-100" />
            {isLogin ? (
              <div className="flex flex-col space-y-1">
                <AppLink
                  href="/mypage"
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  마이페이지 ({userInfo?.userName ?? '회원'}님)
                </AppLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 p-2">
                <AppLink
                  href="/login"
                  className="flex h-10 items-center justify-center rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  로그인
                </AppLink>
                <AppLink
                  href="/signup"
                  className="flex h-10 items-center justify-center rounded-lg bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  회원가입
                </AppLink>
              </div>
            )}
          </nav>
        </div>
      )}
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
