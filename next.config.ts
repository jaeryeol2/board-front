import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  output: 'standalone',

  async rewrites() {
    return {
      afterFiles: [
        {
          source: '/api/access-token',
          destination: '/api/access-token',
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
    remotePatterns: [new URL((process.env.NEXT_IMAGE_URL ?? '').concat('/**'))],
  },
};

export default nextConfig;
