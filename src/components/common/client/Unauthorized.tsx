'use client';

import AppLink from '@/components/base/AppLink';
import { usePathname, useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();
  const path = usePathname();
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.replace(`/login?redirect=${encodeURIComponent(path)}`);
  };

  return (
    <div className="w-full flex items-center justify-center min-h-[60vh] px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-[20px] border border-[#e0e0e0] p-6 sm:p-8 md:p-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f5f7] border border-[#e0e0e0]">
          <span className="text-3xl">🚫</span>
        </div>
        <h2 className="mb-2 text-xl md:text-2xl font-semibold text-[#1d1d1f] tracking-tight">
          로그인이 필요한 페이지입니다
        </h2>
        <p className="mb-8 text-[15px] text-[#7a7a7a] leading-relaxed break-keep">
          서비스를 이용하려면 로그인을 먼저 해주세요.
        </p>
        <div className="flex flex-col gap-2.5 w-full sm:flex-row sm:justify-center">
          <AppLink
            href="/login"
            className="rounded-full bg-[#0066cc] px-6 py-2.5 text-[15px] font-medium text-white transition-all hover:bg-[#0071e3] active:scale-95 shadow-none text-center"
            onNavigate={(e) => handleLogin(e)}
            replace
          >
            로그인 페이지로
          </AppLink>
          <AppLink
            href="/"
            className="rounded-full bg-[#f5f5f7] px-6 py-2.5 text-[15px] font-medium text-[#1d1d1f] transition-all hover:bg-[#e0e0e0] active:scale-95 shadow-none text-center"
            replace
          >
            홈으로 돌아가기
          </AppLink>
        </div>
      </div>
    </div>
  );
}
