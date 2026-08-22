import type { NextConfig } from 'next';
import path from 'node:path';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  output: 'standalone',
  turbopack: {
    root: path.join(__dirname, '..'),
  },
  async rewrites() {
    // ※ 참고: Next.js에서 '라우트 검사(파일시스템 검사)'란 요청된 URL이 App Router(app/),
    // Pages Router(pages/), 또는 정적 파일(public/)에 실제로 매핑되는 파일(코드)이 존재하는지 확인하는 과정을 뜻합니다.
    return {
      // 1. [beforeFiles]
      // 실행 시점: Next.js의 정적 파일(public/), 라우트(app/, pages/의 파일)를 검사하기 "전"에 최우선 실행됩니다.
      // 용도: Next.js 내부에 실제 페이지/API 파일이 존재하는지 여부와 상관없이 무조건 먼저 우회(Rewrite)시킬 때 사용합니다.
      beforeFiles: [],

      // 2. [afterFiles]
      // 실행 시점: Next.js의 정적 파일(public/) 및 고정된 정적 라우트(예: app/api/cookie/route.ts) 매핑 검사 "후"에 실행됩니다.
      // 주의점: 동적 라우트(예: app/api/user/[id]/route.ts) 매핑 검사보다는 "앞서" 실행되므로, 여기에 와일드카드(/api/:path*)를 넣으면 동적 라우트에 도달하지 못합니다.
      afterFiles: [
        {
          source: '/api/token-expire',
          destination: '/api/token-expire',
        },
        {
          source: '/api/cookie',
          destination: '/api/cookie',
        },
        {
          source: '/api/header',
          destination: '/api/header',
        },
      ],

      // 3. [fallback]
      // 실행 시점: Next.js의 모든 라우트 검사(app/, pages/의 정적 라우트 및 [id] 같은 동적 라우트까지)를 "모두 마쳤으나 매핑되는 파일이 없을 때(404)" 최종 실행됩니다.
      // 용도: 프론트엔드 내부에 정적/동적 API 라우트가 존재하고, 처리되지 않은 남은 백엔드 요청만 안전하게 백엔드 서버로 프록시할 때 사용합니다. (가장 안전한 위치)
      fallback: [
        {
          source: '/api/:path*',
          destination: process.env.NEXT_BASE_API_URL + '/api/:path*',
        },
      ],
    };
  },
  images: {
    dangerouslyAllowLocalIP: process.env.APP_ENV === 'local',
    remotePatterns: [new URL((process.env.NEXT_IMAGE_URL ?? '').concat('/**'))],
  },
};

export default nextConfig;
