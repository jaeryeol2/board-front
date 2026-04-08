import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/common';
import { NextResponse } from 'next/server';

export const POST = async () => {
  const response = NextResponse.json('ok');

  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REFRESH_TOKEN);

  return response;
};
