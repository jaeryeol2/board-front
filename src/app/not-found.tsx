'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';

export default function NotFound() {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <main className="flex min-h-[75vh] w-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[20px] border border-[#e0e0e0] bg-white p-8 text-center md:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-[#e0e0e0] bg-[#f5f5f7] text-[#7a7a7a]">
          <svg
            className="h-8 w-8 text-[#7a7a7a]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        <span className="mb-1.5 inline-block text-[12px] font-semibold uppercase tracking-wider text-[#0066cc]">
          404 Not Found
        </span>

        <h1 className="mb-2 text-xl font-semibold tracking-tight text-[#1d1d1f] md:text-2xl">
          페이지를 찾을 수 없습니다
        </h1>

        <p className="mb-8 break-keep text-[15px] leading-relaxed text-[#7a7a7a]">
          요청하신 페이지가 삭제되었거나 주소가 변경되어 찾을 수 없습니다.
        </p>

        <div className="flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center">
          <AppLink
            href="/"
            className="rounded-full bg-[#0066cc] px-6 py-2.5 text-center text-[15px] font-medium text-white shadow-none transition-all hover:bg-[#0071e3] active:scale-95"
            replace
          >
            홈으로 돌아가기
          </AppLink>
          <Button
            onClick={handleBack}
            className="rounded-full border-none bg-[#f5f5f7] px-6 py-2.5 text-center text-[15px] font-medium text-[#1d1d1f] shadow-none transition-all hover:bg-[#e0e0e0] active:scale-95"
          >
            이전 페이지
          </Button>
        </div>
      </div>
    </main>
  );
}

