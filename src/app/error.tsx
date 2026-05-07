'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error;
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorPageProps>) {
  useEffect(() => {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-8 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-red-50 border border-red-100 shadow-sm">
        <span className="text-4xl md:text-5xl">😥</span>
      </div>
      <h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
        이런, 에러가 발생했어요
      </h2>
      <p className="mb-10 max-w-sm break-keep text-gray-500 text-sm md:text-lg leading-relaxed">
        예상치 못한 문제가 발생했습니다.<br className="hidden md:block" /> 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row">
        <Button
          onClick={reset}
          className="w-full md:w-auto rounded-2xl bg-blue-600 px-10 py-4 text-base md:text-lg font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98]"
        >
          다시 시도
        </Button>
        <AppLink
          href="/"
          className="w-full md:w-auto rounded-2xl bg-gray-100 px-10 py-4 text-base md:text-lg font-bold text-gray-600 transition-all hover:bg-gray-200 active:scale-[0.98]"
        >
          홈으로 돌아가기
        </AppLink>
      </div>
    </div>
  );
}
