import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  output: 'standalone',

  async rewrites() {
    return {
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
