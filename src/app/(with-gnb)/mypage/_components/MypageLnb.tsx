'use client';

import Button from '@/components/base/Button';
import { conditionGet } from '@/utils/condition-get';

export type MypageMenuType =
  | 'profile'
  | 'edit-profile'
  | 'activities'
  | 'change-password';

interface MypageLnbProps {
  activeMenu: MypageMenuType;
  onSelectMenu: (menu: MypageMenuType) => void;
  totalActivitiesCount?: number;
}

interface MenuItem {
  id: MypageMenuType;
  label: string;
  badge?: number;
}

export default function MypageLnb({
  activeMenu,
  onSelectMenu,
  totalActivitiesCount = 0,
}: Readonly<MypageLnbProps>) {
  const menuItems: MenuItem[] = [
    {
      id: 'profile',
      label: '프로필 요약',
    },
    {
      id: 'edit-profile',
      label: '회원정보 수정',
    },
    {
      id: 'activities',
      label: '나의 활동',
      badge: totalActivitiesCount,
    },
    {
      id: 'change-password',
      label: '비밀번호 변경',
    },
  ];

  return (
    <nav className="w-full lg:w-64 flex-shrink-0" aria-label="마이페이지 메뉴">
      {/* Desktop / Tablet Vertical Menu */}
      <div className="hidden lg:flex flex-col gap-1.5 bg-white rounded-[18px] border border-[#e0e0e0] p-3">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          const buttonClass = conditionGet<string>()
            .when(isActive)
            .do(
              'w-full flex items-center justify-between px-4 py-3 text-[14px] font-semibold text-white bg-[#0066cc] rounded-[12px] shadow-none hover:bg-[#0071e3] transition-all',
            )
            .other(
              'w-full flex items-center justify-between px-4 py-3 text-[14px] font-medium text-[#1d1d1f] bg-transparent rounded-[12px] shadow-none hover:bg-[#f5f5f7] transition-all',
            )
            .get();

          const badgeClass = conditionGet<string>()
            .when(isActive)
            .do('text-[12px] px-2 py-0.5 rounded-full bg-white/20 text-white')
            .other(
              'text-[12px] px-2 py-0.5 rounded-full bg-[#f5f5f7] text-[#7a7a7a]',
            )
            .get();

          return (
            <Button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className={buttonClass}
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && (
                <span className={badgeClass}>{item.badge}</span>
              )}
            </Button>
          );
        })}
      </div>

      {/* Mobile Horizontal Scrollable Tab Menu */}
      <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-[#e0e0e0] mb-4">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.id;
          const mobileButtonClass = conditionGet<string>()
            .when(isActive)
            .do(
              'flex-shrink-0 px-4 py-2 text-[13px] font-semibold text-white bg-[#0066cc] rounded-full shadow-none hover:bg-[#0071e3]',
            )
            .other(
              'flex-shrink-0 px-4 py-2 text-[13px] font-medium text-[#7a7a7a] bg-[#f5f5f7] rounded-full shadow-none hover:bg-[#e8e8ed] hover:text-[#1d1d1f]',
            )
            .get();

          return (
            <Button
              key={item.id}
              onClick={() => onSelectMenu(item.id)}
              className={mobileButtonClass}
            >
              <span>{item.label}</span>
              {typeof item.badge === 'number' && item.badge > 0 && (
                <span className="ml-1.5 text-[11px] opacity-80">
                  ({item.badge})
                </span>
              )}
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
