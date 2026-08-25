'use client';

import Button from '@/components/base/Button';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import { useValidator } from '@/hooks/use-validator';
import { appFetch } from '@/utils/app-fetch';
import { conditionGet } from '@/utils/condition-get';
import { isEmpty } from '@/utils/is-empty';
import { ChangeEvent, SubmitEvent, useState } from 'react';
import { MypageMenuType } from './MypageLnb';

interface PasswordConfirmViewProps {
  targetMenu: MypageMenuType;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PasswordConfirmView({
  targetMenu,
  onSuccess,
  onCancel,
}: Readonly<PasswordConfirmViewProps>) {
  const { validator } = useValidator();
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetTitle = conditionGet<string>()
    .when(targetMenu === 'edit-profile')
    .do('회원정보 수정')
    .when(targetMenu === 'change-password')
    .do('비밀번호 변경')
    .other('보안 메뉴')
    .get();

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator.verification(
      () => isEmpty(password),
      '비밀번호를 입력해주세요.',
    );

    if (!checker.validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { status, message, data } = await appFetch<boolean>(
        '/api/user/verify-password',
        {
          method: 'post',
          body: { password },
        },
      );

      if (status === 200 && data) {
        setPassword('');
        onSuccess();
      } else {
        alert(message ?? '비밀번호가 일치하지 않습니다.');
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonText = conditionGet<string>()
    .when(isSubmitting)
    .do('확인 중...')
    .other('확인')
    .get();

  return (
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8">
      <div className="max-w-md mx-auto py-4 sm:py-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-xl text-[#0066cc]">
            🔒
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight mb-2">
            비밀번호 재확인
          </h2>
          <p className="text-[14px] text-[#7a7a7a] leading-relaxed">
            <span className="font-semibold text-[#1d1d1f]">{targetTitle}</span>{' '}
            진입을 위해 현재 비밀번호를 한 번 더 입력해 주세요.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Password
              label="비밀번호"
              placeholder="현재 비밀번호를 입력하세요"
              value={password}
              onChange={handlePasswordChange}
              autoFocus
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <Submit
              disabled={isSubmitting}
              className="flex-1 py-2.5 text-[14px] font-medium text-white bg-[#0066cc] rounded-full hover:bg-[#0071e3] transition-all shadow-none"
            >
              {submitButtonText}
            </Submit>
            <Button
              onClick={onCancel}
              className="px-5 py-2.5 text-[14px] font-medium text-[#7a7a7a] bg-[#f5f5f7] rounded-full hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all shadow-none"
            >
              취소
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
