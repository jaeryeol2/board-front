'use client';

import AppLink from '@/components/base/AppLink';
import { HomeType } from '@/types/home';
import { toKebabCase } from '@/utils/case-converter';
import { isEmpty } from '@/utils/is-empty';

type HomeProps = {
  menus: Array<HomeType>;
};

export default function HomeUI({ menus }: Readonly<HomeProps>) {
  if (isEmpty(menus)) {
    return AltHomeUI();
  }

  return (
    <div className="w-full">
      <div className="mb-6 sm:mb-8 md:mb-10 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
          소식
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#7a7a7a]">다양한 주제의 이야기를 만나보세요.</p>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${menus.length >= 3 ? 'lg:grid-cols-3' : ''} gap-4 sm:gap-6 md:gap-8`}
      >
        {menus.map((menu) => (
          <section
            key={menu.menuName}
            className="bg-white rounded-[18px] border border-[#e0e0e0] p-5 sm:p-6 md:p-8 flex flex-col hover:border-[#0066cc]/40 transition-colors"
          >
            <div className="flex justify-between items-center mb-4 sm:mb-6 gap-3">
              <h2 className="text-base sm:text-lg font-semibold text-[#1d1d1f] tracking-tight truncate">
                {menu.menuName}
              </h2>
              <AppLink
                href={`${menu.href}?page=1`}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-[#f5f5f7] text-[#0066cc] rounded-full hover:bg-[#0066cc] hover:text-white transition-all shadow-none"
                aria-label={`${menu.menuName} 더보기`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </AppLink>
            </div>
            <ul className="space-y-2.5 sm:space-y-3 flex-1">
              {menu.boards.map((post) => (
                <li key={post.id}>
                  <AppLink
                    href={`/board/${toKebabCase(menu.basePath).toLowerCase()}/${post.id}`}
                    className="group flex items-center justify-between py-1 gap-2 min-w-0"
                  >
                    <span className="text-[14px] sm:text-[15px] text-[#1d1d1f] group-hover:text-[#0066cc] transition-colors truncate flex-1">
                      {post.title}
                    </span>
                    <span className="text-[10px] font-semibold text-[#0066cc] bg-[#f5f5f7] px-2 py-0.5 rounded-full flex-shrink-0">
                      NEW
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function AltHomeUI() {
  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[50vh] py-8 sm:py-12">
      <div className="w-full max-w-md bg-white rounded-[18px] p-6 sm:p-8 md:p-10 border border-[#e0e0e0] flex flex-col items-center text-center">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#f5f5f7] text-[#0066cc] rounded-full flex items-center justify-center mb-5 sm:mb-6">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#0066cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V12"
              stroke="#0066cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16H12.01"
              stroke="#0066cc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-[#1d1d1f] mb-2 sm:mb-3 tracking-tight">
          아직 준비된 소식이 없어요
        </h2>
        <p className="text-[13px] sm:text-[14px] text-[#7a7a7a] leading-relaxed mb-6 sm:mb-8 break-keep">
          보여드릴 메뉴가 아직 비어있네요.
          <br />
          새로운 게시판을 생성하거나 권한을 확인해보세요.
        </p>

        <AppLink
          href="/notice"
          className="w-full py-2.5 sm:py-3 bg-[#0066cc] hover:bg-[#0071e3] text-white font-medium text-[14px] sm:text-[15px] rounded-full transition-all active:scale-95 flex items-center justify-center gap-2 shadow-none"
        >
          공지사항 확인하기
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </AppLink>

        <AppLink
          href="/"
          className="mt-3 text-[13px] font-medium text-[#7a7a7a] hover:text-[#1d1d1f] transition-colors"
        >
          새로고침
        </AppLink>
      </div>
    </div>
  );
}
