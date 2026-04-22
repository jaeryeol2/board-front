'use client';

import AppLink from '@/components/base/AppLink';
import { usePathname, useRouter } from 'next/navigation';

export default function Unauthorized() {
  const router = useRouter();
  const path = usePathname();
  const handleLogin = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    router.replace(`/login?redirect=${path}`);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <span className="text-5xl">🚫</span>
      </div>
      <h2 className="mb-3 text-2xl font-bold text-gray-800 md:text-3xl">
        로그인이 필요한 페이지입니다
      </h2>
      <p className="mb-10 max-w-md break-keep text-gray-600 md:text-lg">
        서비스를 이용하려면 로그인을 먼저 해주세요.
      </p>
      <div className="flex flex-col gap-4 sm:flex-row">
        <AppLink
          href="/login"
          className="rounded-xl bg-blue-500 px-8 py-4 text-lg font-bold text-white transition-all hover:bg-blue-600 active:scale-[0.98]"
          onNavigate={(e) => handleLogin(e)}
          replace
        >
          로그인 페이지로
        </AppLink>
        <AppLink
          href="/"
          className="rounded-xl bg-gray-200 px-8 py-4 text-lg font-bold text-gray-800 transition-all hover:bg-gray-300 active:scale-[0.98]"
          replace
        >
          홈으로 돌아가기
        </AppLink>
      </div>
    </div>
  );
}
