import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

export const GET = async (request: NextRequest) => {
  const key = request.nextUrl.searchParams.get('key');
  const cookie = await cookies();

  return new Response(cookie.get(key ?? '')?.value, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
    },
  });
};

export const POST = async (request: NextRequest) => {
  const json = (await request.json()) as {
    key: string;
    value: string;
  };
  const cookie = await cookies();

  cookie.set(json.key, json.value);

  return new Response('ok');
};
