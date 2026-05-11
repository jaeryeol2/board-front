'use client';

import AppLink from '@/components/base/AppLink';
import { HomeType } from '@/types/home';
import { toKebabCase } from '@/utils/caseConverter';
import { isEmpty } from '@/utils/isEmpty';

type HomeProps = {
  menus: Array<HomeType>;
};

export default function HomeUI({ menus }: Readonly<HomeProps>) {
  if (isEmpty(menus)) {
    return AltHomeUI();
  }

  return (
    <main className="w-full max-w-7xl mx-auto p-4 md:p-10">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-2">
          소식
        </h1>
        <p className="text-gray-500">다양한 주제의 이야기를 만나보세요.</p>
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${menus.length >= 3 ? 'lg:grid-cols-3' : ''} gap-5 md:gap-8`}
      >
        {menus.map((menu) => (
          <section
            key={menu.menuName}
            className="bg-white rounded-[24px] shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 md:p-8 flex flex-col"
          >
            <div className="flex justify-between items-center mb-6 gap-4">
              <h2 className="text-xl font-bold text-gray-900 truncate">
                {menu.menuName}
              </h2>
              <AppLink
                href={`${menu.href}?page=1`}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-50 text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all"
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
            <ul className="space-y-3 flex-1">
              {menu.boards.map((post) => (
                <li key={post.id}>
                  <AppLink
                    href={`/board/${toKebabCase(menu.basePath).toLowerCase()}/${post.id}`}
                    className="group flex items-center justify-between py-1"
                  >
                    <span className="text-gray-600 group-hover:text-blue-600 group-hover:font-medium transition-all truncate pr-4">
                      {post.title}
                    </span>
                    <span className="text-[10px] font-bold text-gray-300 group-hover:text-blue-200 transition-colors flex-shrink-0 uppercase">
                      New
                    </span>
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}

function AltHomeUI() {
  return (
    <main className="w-full max-w-screen-xl mx-auto p-4 md:p-8 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-md bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-50 flex flex-col items-center text-center transition-all duration-500 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-8 animate-pulse">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
              stroke="#3182F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 8V12"
              stroke="#3182F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 16H12.01"
              stroke="#3182F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
          아직 준비된 소식이 없어요
        </h2>
        <p className="text-gray-500 leading-relaxed mb-10 break-keep">
          보여드릴 메뉴가 아직 비어있네요.
          <br />
          새로운 게시판을 생성하거나 권한을 확인해보세요.
        </p>

        <AppLink
          href="/notice"
          className="w-full py-4 bg-[#3182F6] hover:bg-[#1b64da] text-white font-semibold rounded-2xl transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2"
        >
          공지사항 확인하기
          <svg
            width="18"
            height="18"
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
          className="mt-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
        >
          새로고침
        </AppLink>
      </div>
    </main>
  );
}
