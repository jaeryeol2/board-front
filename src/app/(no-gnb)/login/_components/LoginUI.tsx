'use client';

import { clearCacheAll } from '@/actions/common';
import Checkbox from '@/components/base/Checkbox';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/useValidator';
import { appFetch } from '@/utils/appFetch';
import { isEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useEffect, useState } from 'react';

export default function LoginUI() {
  const { validator } = useValidator();
  const [user, setUser] = useState({
    userId: '',
    password: '',
  });
  const [rememberId, setRememberId] = useState(false);
  const { push } = useRouter();

  // 컴포넌트 마운트 시 localStorage에서 저장된 아이디를 확인합니다.
  useEffect(() => {
    const savedUserId = localStorage.getItem('savedUserId');
    if (savedUserId) {
      setUser((prev) => ({ ...prev, userId: savedUserId }));
      setRememberId(true);
    }
  }, []); // 의존성 배열이 비어 있으므로 마운트 시에만 실행됩니다.

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator
      .verification(() => isEmpty(user.userId), '아이디를 입력해주세요.')
      .verification(() => isEmpty(user.password), '비밀번호를 입력해주세요.');

    try {
      if (checker.validate()) {
        const { status, data, message } = await appFetch<boolean>(
          '/api/login',
          {
            method: 'post',
            body: user,
          },
        );

        if (status === 200 && data) {
          // 아이디 저장 체크박스 상태에 따라 localStorage에 아이디를 저장하거나 삭제합니다.
          if (rememberId) {
            localStorage.setItem('savedUserId', user.userId);
          } else {
            localStorage.removeItem('savedUserId');
          }
          clearCacheAll();
          push('/');
        } else {
          alert(message);
          return;
        }
      }
    } catch (error) {
      alert((error as Error).message);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Text
          label="아이디"
          placeholder="아이디를 입력하세요"
          onInput={(e) =>
            setUser((u) => ({
              ...u,
              userId: (e.target as HTMLInputElement).value,
            }))
          }
          value={user.userId}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Password
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          onInput={(e) =>
            setUser((u) => ({
              ...u,
              password: (e.target as HTMLInputElement).value,
            }))
          }
          value={user.password}
        />
      </div>
      <div className="flex items-center justify-end">
        <label
          htmlFor="remember-id"
          className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none"
        >
          아이디 저장
          <div className="relative">
            <Checkbox
              id="remember-id"
              className="sr-only peer"
              checked={rememberId}
              onChange={(e) => setRememberId(e.target.checked)}
            />
            <div className="block w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-blue-500"></div>
            <div className="absolute block w-5 h-5 transition-transform bg-white rounded-full dot left-0.5 top-0.5 peer-checked:translate-x-full"></div>
          </div>
        </label>
      </div>
      <Submit className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg">
        로그인
      </Submit>
    </form>
  );
}
