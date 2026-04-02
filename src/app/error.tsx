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
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <span className="text-5xl">😥</span>
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
        이런, 에러가 발생했어요
      </h2>
      <p className="mb-10 max-w-md break-keep text-gray-600 md:text-lg">
        예상치 못한 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          onClick={reset}
          className="rounded-xl bg-blue-500 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 active:scale-[0.98]"
        >
          다시 시도
        </Button>
        <AppLink
          href="/"
          className="rounded-xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-800 transition-all hover:bg-gray-300 active:scale-[0.98]"
        >
          홈으로 돌아가기
        </AppLink>
      </div>
    </div>
  );
}
