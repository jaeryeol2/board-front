'use client';

import { clearCacheAll } from '@/actions/common';
import Button from '@/components/base/Button';
import Input from '@/components/base/Input';
import Password from '@/components/base/Password';
import { useValidator } from '@/hooks/useValidator';
import { appFetch } from '@/utils/appFetch';
import { isEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

export default function LoginUI() {
  const { verification } = useValidator();
  const [login, setLogin] = useState({
    loginId: '',
    password: '',
  });
  const { replace } = useRouter();
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const validator = verification(
      isEmpty(login.loginId),
      '아이디를 입력해주세요.',
    ).verification(isEmpty(login.password), '비밀번호를 입력해주세요.');

    try {
      if (validator.validate()) {
        const { data } = await appFetch<boolean>('/api/login', {
          method: 'post',
          body: login,
        });

        if (data) {
          clearCacheAll();
          replace('/');
        }
      }
    } catch (error) {
      alert((error as Error).message);
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Input
          type="text"
          label="아이디"
          placeholder="아이디를 입력하세요"
          onInput={(e) =>
            setLogin((l) => ({
              ...l,
              loginId: (e.target as HTMLInputElement).value,
            }))
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <Password
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          onInput={(e) =>
            setLogin((l) => ({
              ...l,
              password: (e.target as HTMLInputElement).value,
            }))
          }
        />
      </div>
      <Button type="submit" className="mt-4 w-full">
        로그인
      </Button>
    </form>
  );
}
