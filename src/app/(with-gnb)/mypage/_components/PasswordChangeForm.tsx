'use client';

import { logoutAction } from '@/actions/user';
import Button from '@/components/base/Button';
import Password from '@/components/base/Password';
import Submit from '@/components/base/Submit';
import { useValidator } from '@/hooks/use-validator';
import { appFetch } from '@/utils/app-fetch';
import { conditionGet } from '@/utils/condition-get';
import { isEmpty } from '@/utils/is-empty';
import { ChangeEvent, SubmitEvent, useState } from 'react';

interface PasswordChangeFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PasswordChangeForm({
  onSuccess,
  onCancel,
}: Readonly<PasswordChangeFormProps>) {
  const { validator } = useValidator();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCurrentPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
  };

  const handleNewPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
  };

  const handleNewPasswordConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setNewPasswordConfirm(e.target.value);
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator
      .verification(
        () => isEmpty(currentPassword),
        '현재 비밀번호를 입력해주세요.',
      )
      .verification(() => isEmpty(newPassword), '새 비밀번호를 입력해주세요.')
      .verification(
        () => newPassword !== newPasswordConfirm,
        '새 비밀번호가 일치하지 않습니다.',
      )
      .verification(
        () => currentPassword === newPassword,
        '현재 비밀번호와 다른 새로운 비밀번호를 입력해주세요.',
      );

    if (!checker.validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { ok, message } = await appFetch<boolean>(
        '/api/user/password',
        {
          method: 'put',
          body: {
            currentPassword,
            newPassword,
          },
          timeout: 3000,
        },
      );

      if (ok) {
        alert(message ?? '비밀번호가 변경되었습니다. 다시 로그인해 주세요.');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');

        Promise.resolve()
          .then(() => logoutAction('/login'))
          .then(() => onSuccess?.());
      } else {
        throw new Error(message ?? '비밀번호 변경에 실패했습니다.');
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitText = conditionGet<string>()
    .when(() => isSubmitting)
    .do('변경 중...')
    .other('비밀번호 변경')
    .get();

  return (
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 lg:p-10 lg:min-h-[560px]">
      <div className="mb-6 pb-4 border-b border-[#f0f0f0]">
        <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f]">
          비밀번호 변경
        </h2>
        <p className="text-[13px] text-[#7a7a7a] mt-1">
          계정 보안을 위해 주기적으로 비밀번호를 변경해 주세요.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        <div className="flex flex-col">
          <Password
            label="현재 비밀번호"
            placeholder="현재 사용 중인 비밀번호를 입력하세요"
            value={currentPassword}
            onChange={handleCurrentPasswordChange}
          />
        </div>

        <div className="flex flex-col">
          <Password
            label="새 비밀번호"
            placeholder="변경할 새 비밀번호를 입력하세요"
            value={newPassword}
            onChange={handleNewPasswordChange}
          />
        </div>

        <div className="flex flex-col">
          <Password
            label="새 비밀번호 확인"
            placeholder="새 비밀번호를 한 번 더 입력하세요"
            value={newPasswordConfirm}
            onChange={handleNewPasswordConfirmChange}
          />
        </div>

        <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[#f0f0f0]">
          <Submit
            disabled={isSubmitting}
            className="px-6 py-2.5 text-[14px] font-medium text-white bg-[#0066cc] rounded-full hover:bg-[#0071e3] transition-all shadow-none"
          >
            {submitText}
          </Submit>

          {onCancel && (
            <Button
              onClick={onCancel}
              className="px-5 py-2.5 text-[14px] font-medium text-[#7a7a7a] bg-[#f5f5f7] rounded-full hover:bg-[#e8e8ed] hover:text-[#1d1d1f] transition-all shadow-none"
            >
              취소
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
