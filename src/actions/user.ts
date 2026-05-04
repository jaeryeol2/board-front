'use server';

import { redirect, RedirectType } from 'next/navigation';
import { clearCacheAll } from './common';

export const loginAction = async (path?: string) => {
  await clearCacheAll();
  redirect(path ?? '/', RedirectType.replace);
};

export const logoutAction = async () => {
  await clearCacheAll();
  redirect('/');
};
