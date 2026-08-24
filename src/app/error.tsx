'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { useEffect } from 'react';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: Readonly<ErrorPageProps>) {
  useEffect(() => {
    // 에러 리포팅 서비스에 에러를 기록할 수 있습니다.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[75vh] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[20px] border border-[#e0e0e0] bg-white p-8 text-center md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-500">
          <svg
            className="h-8 w-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <span className="mb-1.5 inline-block text-[12px] font-semibold uppercase tracking-wider text-red-500">
          System Error
        </span>

        <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#1d1d1f] md:text-2xl">
          오류가 발생했습니다
        </h1>

        <p className="mb-8 break-keep text-[15px] leading-relaxed text-[#7a7a7a]">
          예상치 못한 문제가 발생했습니다.
          <br />
          잠시 후 다시 시도해 주세요.
        </p>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          <Button
            onClick={reset}
            className="rounded-full bg-[#0066cc] px-6 py-2.5 text-center text-[15px] font-medium text-white shadow-none transition-all hover:bg-[#0071e3] active:scale-95"
          >
            다시 시도
          </Button>
          <AppLink
            href="/"
            className="rounded-full border-none bg-[#f5f5f7] px-6 py-2.5 text-center text-[15px] font-medium text-[#1d1d1f] shadow-none transition-all hover:bg-[#e0e0e0] active:scale-95"
            replace
          >
            홈으로 돌아가기
          </AppLink>
        </div>
      </div>
    </main>
  );
}

