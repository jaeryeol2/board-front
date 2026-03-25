'use client';

import AppLink from '@/components/base/AppLink';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <span className="text-5xl">🤔</span>
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
        페이지를 찾을 수 없어요
      </h2>
      <p className="mb-10 max-w-md break-keep text-gray-600 md:text-lg">
        요청하신 페이지가 사라졌거나, 잘못된 경로를 이용하셨어요.
      </p>
      <AppLink
        href="/"
        className="rounded-xl bg-blue-500 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 active:scale-[0.98]"
      >
        홈으로 돌아가기
      </AppLink>
    </div>
  );
}
