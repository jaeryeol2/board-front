'use client';

import AppLink from '@/components/base/AppLink';

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-8 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-gray-50 border border-gray-100 shadow-sm">
        <span className="text-4xl md:text-5xl">🤔</span>
      </div>
      <h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
        페이지를 찾을 수 없어요
      </h2>
      <p className="mb-10 max-w-sm break-keep text-gray-500 text-sm md:text-lg leading-relaxed">
        요청하신 페이지가 사라졌거나,<br className="hidden md:block" /> 잘못된 경로를 이용하셨어요.
      </p>
      <AppLink
        href="/"
        className="w-full md:w-auto rounded-2xl bg-blue-600 px-10 py-4 text-base md:text-lg font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98]"
      >
        홈으로 돌아가기
      </AppLink>
    </div>
  );
}
