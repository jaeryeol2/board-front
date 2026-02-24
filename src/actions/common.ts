'use server';

import { revalidatePath } from 'next/cache';

export const clearCache = async (path: string, type: 'layout' | 'page') => {
  revalidatePath(path, type);
};

export const clearCacheAll = async () => {
  await clearCache('/', 'layout');
};
