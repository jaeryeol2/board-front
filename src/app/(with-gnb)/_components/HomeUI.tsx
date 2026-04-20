'use client';

import AppLink from '@/components/base/AppLink';
import { HomeType } from '@/types/home';
import { toKebabCase } from '@/utils/caseConverter';

type HomeProps = {
  menus: Array<HomeType>;
};

export default function HomeUI({ menus }: Readonly<HomeProps>) {
  return (
    <main className="w-full max-w-screen-xl mx-auto p-4 md:p-8">
      <div
        className={`grid grid-cols-1 md:grid-cols-2 ${menus.length >= 3 ? 'lg:grid-cols-3' : ''} gap-6 md:gap-8`}
      >
        {menus.map((menu) => (
          // NOTE: 이 섹션은 `src/components/base/Card.tsx` 와 같은 공통 컴포넌트로 분리하여 재사용성을 높일 수 있습니다.
          <section
            key={menu.menuName}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex justify-between items-center mb-4 gap-4">
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {menu.menuName}
              </h2>
              <AppLink
                href={`${menu.href}?page=1`}
                className="flex-shrink-0 flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
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
            {/* NOTE: 이 리스트는 `src/components/base/PostList.tsx` 와 같은 컴포넌트로 분리할 수 있습니다. */}
            <ul className="space-y-2">
              {menu.boards.map((post) => (
                <li key={post.id}>
                  <AppLink
                    href={`/board/${toKebabCase(menu.basePath).toLowerCase()}/${post.id}`}
                    className="text-gray-700 hover:text-blue-600 hover:font-medium hover:bg-blue-50 rounded-md py-1 px-2 transition-all duration-200 truncate block"
                  >
                    {post.title}
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
