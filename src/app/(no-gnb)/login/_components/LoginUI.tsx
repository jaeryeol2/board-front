'use client';

import { loginAction } from '@/actions/user';
import Checkbox from '@/components/base/Checkbox';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/use-validator';
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
        const { ok, data, message } = await appFetch<
          boolean | FetchErrorType
        >('/api/user/login', {
          method: 'post',
          body: state,
        });

        if (ok && typeof data === 'boolean' && data) {
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
      <div className="flex items-center justify-between pt-1">
        <label
          htmlFor="remember-id"
          className="flex items-center gap-2 text-[13px] text-[#7a7a7a] cursor-pointer select-none"
        >
          <div className="relative">
            <Checkbox
              id="remember-id"
              className="sr-only peer"
              checked={rememberId}
              onChange={(e) => setRememberId(e.target.checked)}
            />
            <div className="block w-9 h-5 bg-[#e0e0e0] rounded-full peer-checked:bg-[#0066cc] transition-colors"></div>
            <div className="absolute block w-4 h-4 transition-transform bg-white rounded-full left-0.5 top-0.5 peer-checked:translate-x-4 shadow-sm"></div>
          </div>
          아이디 저장
        </label>
      </div>
      <Submit className="w-full bg-[#0066cc] hover:bg-[#0071e3] text-white font-medium py-2.5 px-4 rounded-full active:scale-95 transition-all text-[15px] shadow-none mt-2">
        로그인
      </Submit>
    </form>
  );
}
