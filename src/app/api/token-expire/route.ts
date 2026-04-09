import { ACCESS_TOKEN, REFRESH_TOKEN } from '@/constants/common';
import { NextResponse } from 'next/server';

export const DELETE = async () => {
  const response = NextResponse.json({
    status: 200,
    message: 'deleted',
    data: true,
  });

  response.cookies.delete(ACCESS_TOKEN);
  response.cookies.delete(REFRESH_TOKEN);

  return response;
};
