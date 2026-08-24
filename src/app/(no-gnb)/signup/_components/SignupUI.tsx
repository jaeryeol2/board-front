'use client';

import Email from '@/components/base/Email';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/use-validator';
import { ReducerActionType } from '@/types/base';
import { appFetch } from '@/utils/app-fetch';
import { isEmpty } from '@/utils/is-empty';
import { useRouter } from 'next/navigation';
import { SubmitEvent, useEffect, useReducer } from 'react';

type SignupType = {
  userId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  userName: string;
};

type ActionType = { type: 'reset' };

const reducer = (
  state: SignupType,
  action: ReducerActionType<SignupType> | ActionType,
) => {
  if (action.type === 'reset') {
    return {
      userId: '',
      password: '',
      passwordConfirm: '',
      email: '',
      userName: '',
    };
  } else {
    return {
      ...state,
      [action.type]: action.payload,
    };
  }
};

export default function SignupUI() {
  const { validator } = useValidator();
  const { push } = useRouter();
  const [state, dispatch] = useReducer(reducer, {
    userId: '',
    password: '',
    passwordConfirm: '',
    email: '',
    userName: '',
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator
      .verification(() => isEmpty(state.userId), '아이디를 입력해주세요.')
      .verification(() => isEmpty(state.password), '비밀번호를 입력해주세요.')
      .verification(
        () => state.password !== state.passwordConfirm,
        '비밀번호가 일치하지 않습니다.',
      )
      .verification(() => isEmpty(state.email), '이메일을 입력해주세요.')
      .verification(() => isEmpty(state.userName), '이름을 입력해주세요.');

    try {
      if (checker.validate()) {
        const { status, message, data } = await appFetch<boolean>(
          '/api/user/signup',
          {
            method: 'post',
            body: {
              userId: state.userId,
              password: state.password,
              email: state.email,
              userName: state.userName,
            },
          },
        );

        if (status === 201 && data) {
          // 회원가입 성공 시 201 Created가 일반적입니다.
          alert(`${message} 로그인 페이지로 이동합니다.`);
          push('/login');
        } else {
          alert(message);
        }
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  useEffect(() => {
    return () => {
      dispatch({ type: 'reset' });
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col">
        <Text
          label="아이디"
          placeholder="아이디를 입력하세요"
          onInput={(e) => {
            dispatch({
              type: 'userId',
              payload: (e.target as HTMLInputElement).value,
            });
          }}
          value={state.userId}
        />
      </div>
      <div className="flex flex-col">
        <Password
          label="비밀번호"
          placeholder="비밀번호를 입력하세요"
          onInput={(e) => {
            dispatch({
              type: 'password',
              payload: (e.target as HTMLInputElement).value,
            });
          }}
          value={state.password}
        />
      </div>
      <div className="flex flex-col">
        <Password
          label="비밀번호 확인"
          placeholder="비밀번호를 다시 입력하세요"
          onInput={(e) => {
            dispatch({
              type: 'passwordConfirm',
              payload: (e.target as HTMLInputElement).value,
            });
          }}
          value={state.passwordConfirm}
        />
      </div>
      <div className="flex flex-col">
        <Email
          label="이메일"
          placeholder="이메일을 입력하세요"
          onInput={(e) => {
            dispatch({
              type: 'email',
              payload: (e.target as HTMLInputElement).value,
            });
          }}
          value={state.email}
        />
      </div>
      <div className="flex flex-col">
        <Text
          label="이름"
          placeholder="이름을 입력하세요"
          onInput={(e) => {
            dispatch({
              type: 'userName',
              payload: (e.target as HTMLInputElement).value,
            });
          }}
          value={state.userName}
        />
      </div>
      <Submit className="w-full bg-[#0066cc] hover:bg-[#0071e3] text-white font-medium py-2.5 px-4 rounded-full active:scale-95 transition-all text-[15px] shadow-none mt-4">
        가입하기
      </Submit>
    </form>
  );
}
