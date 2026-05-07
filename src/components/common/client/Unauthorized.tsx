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
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-white px-6 text-center">
      <div className="mb-8 flex h-20 w-20 md:h-24 md:w-24 items-center justify-center rounded-full bg-blue-50 border border-blue-100 shadow-sm">
        <span className="text-4xl md:text-5xl">🚫</span>
      </div>
      <h2 className="mb-4 text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
        로그인이 필요한 페이지입니다
      </h2>
      <p className="mb-10 max-w-sm break-keep text-gray-500 text-sm md:text-lg leading-relaxed">
        서비스를 이용하려면 로그인을 먼저 해주세요.
      </p>
      <div className="flex flex-col gap-3 w-full md:w-auto md:flex-row">
        <AppLink
          href="/login"
          className="w-full md:w-auto rounded-2xl bg-blue-600 px-10 py-4 text-base md:text-lg font-bold text-white transition-all hover:bg-blue-700 shadow-lg shadow-blue-100 active:scale-[0.98]"
          onNavigate={(e) => handleLogin(e)}
          replace
        >
          로그인 페이지로
        </AppLink>
        <AppLink
          href="/"
          className="w-full md:w-auto rounded-2xl bg-gray-100 px-10 py-4 text-base md:text-lg font-bold text-gray-600 transition-all hover:bg-gray-200 active:scale-[0.98]"
          replace
        >
          홈으로 돌아가기
        </AppLink>
      </div>
    </div>
  );
}
