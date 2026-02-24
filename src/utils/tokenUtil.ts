import { ACCESS_TOKEN } from '@/constants/common';
import { jwtVerify } from 'jose';

let secretKey: Uint8Array | null = null;

/**
 * 환경 변수에서 HS256 Secret을 로드하여 Uint8Array로 변환합니다.
 * 성능을 위해 최초 호출 시에만 키를 생성하고 이후에는 캐시된 키를 반환합니다.
 * @returns {Uint8Array} HS256 알고리즘용 Secret Key
 */
const getSecretKey = (): Uint8Array => {
  if (secretKey) {
    return secretKey;
  }

  // 1. 환경변수에서 secret key 문자열을 가져옵니다.
  const secretString = process.env.NEXT_JWT_KEY;

  // 환경 변수가 설정되지 않은 경우 에러를 발생시켜 문제를 조기에 파악합니다.
  if (!secretString) {
    throw new Error(
      'NEXT_JWT_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.',
    );
  }

  // 2. secret key 문자열을 Uint8Array로 인코딩합니다.
  secretKey = new TextEncoder().encode(secretString);

  return secretKey;
};

export const tokenUtil = () => {
  return {
    async getAccessToken() {
      const isServer = !typeof globalThis.window;

      try {
        if (isServer) {
          const cookieStore = await (await import('next/headers')).cookies();
          return cookieStore.get(ACCESS_TOKEN)?.value;
        } else {
          return await fetch('/api/access-token').then(
            async (res) => await res.text(),
          );
        }
      } catch {
        return '';
      }
    },
    async verifyToken(token: string) {
      const key = getSecretKey();
      return await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });
    },
  };
};
