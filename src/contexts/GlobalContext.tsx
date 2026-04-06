'use client';

import { ChildrenType } from '@/types/base';
import { UserInfoType } from '@/types/user';
import { createContext } from 'react';

type GlobalContextType = {
  isLogin: boolean;
  userInfo: UserInfoType | null;
  cartCount: number;
};
export const GlobalContext = createContext<GlobalContextType>({
  isLogin: false,
  userInfo: null,
  cartCount: 0,
});

export function GlobalProvider({
  global,
  children,
}: Readonly<{ global: GlobalContextType } & ChildrenType>) {
  return <GlobalContext value={global}>{children}</GlobalContext>;
}

/** rcc loading context */
export const LoadingContext = createContext<boolean>(false);

/** rsc loading context provider */
export function LoadingProvider({
  loading,
  children,
}: Readonly<{ loading: boolean } & ChildrenType>) {
  return <LoadingContext value={loading}>{children}</LoadingContext>;
}
