'use client';

import { loginAction } from '@/actions/user';
import Checkbox from '@/components/base/Checkbox';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/useValidator';
import { FetchErrorType, ReducerActionType } from '@/types/base';
import { appFetch } from '@/utils/app-fetch';
import { isEmpty, isNotEmpty } from '@/utils/is-empty';
import { useSearchParams } from 'next/navigation';
import { SubmitEvent, useEffect, useReducer, useState } from 'react';

type LoginType = {
  userId: string;
  password: string;
};
type ActionType = { type: 'reset' };

const reducer = (
  state: LoginType,
  actions: ReducerActionType<LoginType> | ActionType,
) => {
  if (actions.type === 'reset') {
    return { userId: '', password: '' };
  } else {
    return {
      ...state,
      [actions.type]: actions.payload,
    };
  }
};

export default function LoginUI() {
  const query = useSearchParams();
  const { validator } = useValidator();
  const [rememberId, setRememberId] = useState(() => false);

  const [state, dispatch] = useReducer(reducer, {
    userId: '',
    password: '',
  });

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator
      .verification(() => isEmpty(state.userId), '아이디를 입력해주세요.')
      .verification(() => isEmpty(state.password), '비밀번호를 입력해주세요.');

    try {
      if (checker.validate()) {
        const { status, data, message } = await appFetch<
          boolean | FetchErrorType
        >('/api/user/login', {
          method: 'post',
          body: state,
        });

        if (status === 200 && typeof data === 'boolean' && data) {
          // 아이디 저장 체크박스 상태에 따라 localStorage에 아이디를 저장하거나 삭제합니다.
          if (rememberId) {
            localStorage.setItem('savedUserId', state.userId);
          } else {
            localStorage.removeItem('savedUserId');
          }
        } else {
          alert(data && typeof data !== 'boolean' ? data.message : message);
          return;
        }
      }
    } catch (error) {
      alert((error as Error).message);
      return;
    }

    loginAction(decodeURIComponent(query.get('redirect') ?? '/'));
  };

  useEffect(() => {
    const initLoginPage = () => {
      const userId = localStorage.getItem('savedUserId');
      const hasUserId = isNotEmpty(userId);

      if (hasUserId) {
        dispatch({ type: 'userId', payload: userId });
      }

      setRememberId(() => hasUserId);
    };

    initLoginPage();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
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
      <div className="flex flex-col gap-2">
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
