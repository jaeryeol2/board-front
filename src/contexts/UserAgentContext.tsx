'use client';

import type { ChildrenType, UserAgentType } from '@/types/base';
import { createContext } from 'react';

type UserAgentProviderProps = { userAgent: UserAgentType } & ChildrenType;
export const UserAgentContext = createContext<UserAgentType | undefined>(
  undefined,
);

export default function UserAgentProvider({
  children,
  userAgent,
}: Readonly<UserAgentProviderProps>) {
  return <UserAgentContext value={userAgent}>{children}</UserAgentContext>;
}
