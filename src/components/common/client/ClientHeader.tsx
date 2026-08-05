'use client';

import { logoutAction } from '@/actions/user';
import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { GlobalContext } from '@/contexts/GlobalContext';
import { Menu, MenuItem } from '@/types/global';
import { appFetch } from '@/utils/app-fetch';
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

  // 모바일 메뉴 오픈 시 body 스크롤 방지
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = async () => {
    const { data } = await appFetch<boolean>('/api/user/logout', {
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
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
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
          <Button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:outline-none bg-transparent shadow-none border-none px-2 py-2"
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
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overlay & Drawer */}
      <div
        className={`fixed inset-0 z-[60] transform transition-all duration-300 lg:hidden ${
          isMobileMenuOpen ? 'visible' : 'invisible'
        }`}
      >
        {/* Backdrop */}
        <Button
          className={`absolute inset-0 w-full h-full bg-black/40 backdrop-blur-sm transition-opacity duration-300 border-none appearance-none outline-none rounded-none p-0 shadow-none ${
            isMobileMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMobileMenuOpen(false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              setIsMobileMenuOpen(false);
            }
          }}
          aria-label="Close menu"
          tabIndex={isMobileMenuOpen ? 0 : -1}
        />

        {/* Drawer Content */}
        <div
          className={`absolute inset-y-0 right-0 w-[280px] max-w-[80%] bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
            <span className="text-lg font-bold text-blue-600">Menu</span>
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 bg-transparent shadow-none border-none px-2 py-2"
            >
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
            </Button>
          </div>

          <nav className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
            {menuTree.map((menu) => (
              <div key={menu.id} className="flex flex-col">
                {menu.children && menu.children.length > 0 ? (
                  <div className="mb-2">
                    <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-gray-400">
                      {menu.menuName}
                    </div>
                    <div className="ml-2 flex flex-col space-y-1">
                      {menu.children.map((child) => (
                        <AppLink
                          key={child.id}
                          href={child.href}
                          className="rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {child.menuName}
                        </AppLink>
                      ))}
                    </div>
                  </div>
                ) : (
                  <AppLink
                    href={menu.href}
                    className="rounded-xl px-4 py-3 text-[15px] font-bold text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.menuName}
                  </AppLink>
                )}
              </div>
            ))}

            <div className="my-4 border-t border-gray-100 pt-4 px-2">
              {isLogin ? (
                <div className="flex flex-col space-y-2">
                  <div className="px-2 py-1 mb-2">
                    <p className="text-xs text-gray-400 mb-1">내 정보</p>
                    <p className="text-sm font-bold text-gray-800">
                      {userInfo?.userName ?? '회원'}님
                    </p>
                  </div>
                  <AppLink
                    href="/mypage"
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    마이페이지
                  </AppLink>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left bg-transparent shadow-none border-none w-full"
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AppLink
                    href="/login"
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-200 text-[15px] font-bold text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </AppLink>
                  <AppLink
                    href="/signup"
                    className="flex h-12 items-center justify-center rounded-xl bg-blue-600 text-[15px] font-bold text-white hover:bg-blue-700 shadow-lg shadow-blue-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    회원가입
                  </AppLink>
                </div>
              )}
            </div>
          </nav>
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
