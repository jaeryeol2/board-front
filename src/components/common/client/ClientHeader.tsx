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
    <header className="sticky top-0 z-50 border-b border-[#e0e0e0] bg-white md:bg-white/90 md:backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left Section: Logo and Menu */}
        <div className="flex items-center space-x-8">
          <AppLink
            href="/"
            className="text-lg font-semibold text-[#1d1d1f] tracking-tight hover:text-[#0066cc] transition-colors"
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
        <div className="hidden items-center space-x-2 lg:flex sm:space-x-3">
          {isLogin ? (
            <div className="flex items-center space-x-3 text-[14px]">
              <AppLink
                href="/mypage"
                className="font-medium text-[#7a7a7a] transition-colors hover:text-[#1d1d1f]"
              >
                {userInfo?.userName ?? '회원'}님
              </AppLink>
              <span className="text-[#e0e0e0]">|</span>
              <Button
                className="bg-transparent text-[14px] font-medium text-[#7a7a7a] transition-colors hover:text-[#1d1d1f] px-0 py-0 shadow-none border-none"
                onClick={handleLogout}
              >
                로그아웃
              </Button>
            </div>
          ) : (
            <>
              <AppLink
                href="/login"
                className="rounded-full px-4 py-1.5 text-[14px] font-medium text-[#1d1d1f] transition-colors hover:bg-black/5"
              >
                로그인
              </AppLink>
              <AppLink
                href="/signup"
                className="rounded-full bg-[#0066cc] px-4 py-1.5 text-[14px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95 shadow-none"
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
            className="rounded-full p-2 text-[#1d1d1f] hover:bg-black/5 focus:outline-none bg-transparent shadow-none border-none"
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
          className={`absolute inset-0 w-full h-full bg-black/60 backdrop-blur-sm transition-opacity duration-300 border-none appearance-none outline-none rounded-none p-0 shadow-none ${
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
          className={`absolute inset-y-0 right-0 w-[290px] max-w-[85%] bg-white border-l border-[#e0e0e0] shadow-2xl transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex h-14 items-center justify-between border-b border-[#e0e0e0] px-6 bg-white">
            <span className="text-base font-semibold text-[#1d1d1f]">메뉴</span>
            <Button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-full p-2 text-[#7a7a7a] hover:bg-black/5 bg-transparent shadow-none border-none"
            >
              <svg
                className="h-5 w-5"
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

          <nav className="flex flex-col p-4 space-y-1 overflow-y-auto max-h-[calc(100dvh-3.5rem)] bg-white">
            {menuTree.map((menu) => (
              <div key={menu.id} className="flex flex-col">
                {menu.children && menu.children.length > 0 ? (
                  <div className="mb-2">
                    <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#7a7a7a]">
                      {menu.menuName}
                    </div>
                    <div className="ml-1 flex flex-col space-y-0.5">
                      {menu.children.map((child) => (
                        <AppLink
                          key={child.id}
                          href={child.href}
                          className="rounded-[11px] px-3.5 py-2.5 text-[14px] font-normal text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0066cc] transition-colors"
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
                    className="rounded-[11px] px-3.5 py-2.5 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7] hover:text-[#0066cc] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {menu.menuName}
                  </AppLink>
                )}
              </div>
            ))}

            <div className="my-3 border-t border-[#e0e0e0] pt-3 px-1">
              {isLogin ? (
                <div className="flex flex-col space-y-1.5">
                  <div className="px-3 py-1.5 mb-1 rounded-[11px] bg-[#f5f5f7]">
                    <p className="text-[11px] text-[#7a7a7a]">내 정보</p>
                    <p className="text-[14px] font-semibold text-[#1d1d1f]">
                      {userInfo?.userName ?? '회원'}님
                    </p>
                  </div>
                  <AppLink
                    href="/mypage"
                    className="flex items-center gap-3 rounded-[11px] px-3.5 py-2.5 text-[14px] font-medium text-[#1d1d1f] hover:bg-[#f5f5f7]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    마이페이지
                  </AppLink>
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 rounded-[11px] px-3.5 py-2.5 text-[14px] font-medium text-red-600 hover:bg-red-50 transition-colors text-left bg-transparent shadow-none border-none w-full"
                  >
                    로그아웃
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-2 pt-1">
                  <AppLink
                    href="/login"
                    className="flex h-10 items-center justify-center rounded-full border border-[#e0e0e0] bg-[#f5f5f7] text-[14px] font-medium text-[#1d1d1f] hover:bg-gray-200 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    로그인
                  </AppLink>
                  <AppLink
                    href="/signup"
                    className="flex h-10 items-center justify-center rounded-full bg-[#0066cc] text-[14px] font-medium text-white hover:bg-[#0071e3] transition-colors"
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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const isActive =
    item.href !== '/' && pathname.startsWith(item.href)
      ? 'text-[#0066cc] font-semibold'
      : 'text-[#1d1d1f]/80 font-normal';

  const handleOpen = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 100);
  }, []);

  const handleToggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    },
    [isOpen],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleKeyDown]);

  if (item.menuType === 'DIRECTORY' && item.children?.length) {
    return (
      <div className="relative">
        <Button
          ref={buttonRef}
          onClick={handleToggle}
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          className={`flex items-center rounded-full px-3.5 py-1.5 text-[14px] transition-colors hover:bg-black/5 hover:text-[#0066cc] bg-transparent shadow-none border-none ${isActive}`}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          {item.menuName}
          <svg
            className={`ml-1 h-3.5 w-3.5 transform text-[#7a7a7a] transition-transform duration-200 ${
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
          <div className="absolute left-0 top-full z-10 mt-1.5 w-48 origin-top-left rounded-[14px] border border-[#e0e0e0] bg-white/95 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
            <div
              ref={menuRef}
              onMouseEnter={handleOpen}
              onMouseLeave={handleClose}
              role="menu"
              aria-orientation="vertical"
              tabIndex={-1}
              className="p-1.5"
            >
              {item.children.map((child, index) => (
                <Fragment key={child.id}>
                  <AppLink
                    href={child.href}
                    className="block w-full rounded-[8px] px-3.5 py-2 text-left text-[13px] text-[#1d1d1f] transition-colors hover:bg-black/5 hover:text-[#0066cc]"
                    role="menuitem"
                  >
                    {child.menuName}
                  </AppLink>
                  {index < item.children!.length - 1 && (
                    <hr className="my-1 border-[#f0f0f0]" />
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
      className={`rounded-full px-3.5 py-1.5 text-[14px] transition-colors hover:bg-black/5 hover:text-[#0066cc] ${isActive}`}
    >
      {item.menuName}
    </AppLink>
  );
}
