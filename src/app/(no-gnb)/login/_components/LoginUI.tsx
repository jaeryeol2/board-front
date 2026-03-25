'use client';

import { clearCacheAll } from '@/actions/common';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/useValidator';
import { appFetch } from '@/utils/appFetch';
import { isEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

export default function LoginUI() {
  const { verification } = useValidator();
  const [user, setUser] = useState({
    userId: '',
    password: '',
  });
  const { replace } = useRouter();
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const validator = verification(
      isEmpty(user.userId),
      '아이디를 입력해주세요.',
    ).verification(isEmpty(user.password), '비밀번호를 입력해주세요.');

    try {
      if (validator.validate()) {
        const { data, message } = await appFetch<boolean>('/api/login', {
          method: 'post',
          body: user,
        });

        if (data) {
          clearCacheAll();
          replace('/');
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
      <Submit
        label="로그인"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg"
      />
    </form>
  );
}
