'use client';

import Email from '@/components/base/Email';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/useValidator';
import { appFetch } from '@/utils/appFetch';
import { isEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useState } from 'react';

export default function SignupUI() {
  const { validator } = useValidator();
  const { push } = useRouter();
  const [user, setUser] = useState({
    userId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    userName: '',
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator
      .verification(() => isEmpty(user.userId), '아이디를 입력해주세요.')
      .verification(() => isEmpty(user.password), '비밀번호를 입력해주세요.')
      .verification(
        () => user.password !== user.passwordConfirm,
        '비밀번호가 일치하지 않습니다.',
      )
      .verification(() => isEmpty(user.email), '이메일을 입력해주세요.')
      .verification(() => isEmpty(user.userName), '이름을 입력해주세요.');

    try {
      if (checker.validate()) {
        const { status, message, data } = await appFetch<boolean>(
          '/api/signup',
          {
            method: 'post',
            body: {
              userId: user.userId,
              password: user.password,
              email: user.email,
              userName: user.userName,
            },
          },
        );
        console.log(status);
        console.log(message);
        if (status === 201 && data) {
          // 회원가입 성공 시 201 Created가 일반적입니다.
          alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
          push('/login');
        } else {
          alert(message);
        }
      }
    } catch (error) {
      alert((error as Error).message);
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
      <div className="flex flex-col gap-2">
        <Password
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          onInput={(e) =>
            setUser((u) => ({
              ...u,
              passwordConfirm: (e.target as HTMLInputElement).value,
            }))
          }
          value={user.passwordConfirm}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Email
          label="이메일"
          placeholder="이메일을 입력하세요"
          onInput={(e) =>
            setUser((u) => ({
              ...u,
              email: (e.target as HTMLInputElement).value,
            }))
          }
          value={user.email}
        />
      </div>
      <div className="flex flex-col gap-2">
        <Text
          label="이름"
          placeholder="이름을 입력하세요"
          onInput={(e) =>
            setUser((u) => ({
              ...u,
              userName: (e.target as HTMLInputElement).value,
            }))
          }
          value={user.userName}
        />
      </div>
      <Submit className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg mt-2">
        가입하기
      </Submit>
    </form>
  );
}
