'use client';

import { clearCacheAll } from '@/actions/common';
import Button from '@/components/base/Button';
import Email from '@/components/base/Email';
import Select from '@/components/base/Select';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useValidator } from '@/hooks/use-validator';
import { PersonalUserInfoType, UserProfileUpdatePayload } from '@/types/user';
import { appFetch } from '@/utils/app-fetch';
import { conditionGet } from '@/utils/condition-get';
import { isEmpty } from '@/utils/is-empty';
import { ChangeEvent, SubmitEvent, useState } from 'react';

interface ProfileEditFormProps {
  personal: PersonalUserInfoType;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ProfileEditForm({
  personal,
  onSuccess,
  onCancel,
}: Readonly<ProfileEditFormProps>) {
  const { validator } = useValidator();
  const [formData, setFormData] = useState<UserProfileUpdatePayload>({
    userName: personal.userName ?? '',
    email: personal.email ?? '',
    userAddr: personal.userAddr ?? '',
    userGender: personal.userGender ?? '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, userName: e.target.value }));
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, email: e.target.value }));
  };

  const handleGenderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      userGender: (e.target.value as 'M' | 'W' | '') || '',
    }));
  };

  const handleAddrChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, userAddr: e.target.value }));
  };

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();

    const checker = validator.verification(
      () => isEmpty(formData.userName),
      '이름을 입력해주세요.',
    );

    if (!checker.validate()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const { ok, message } = await appFetch<boolean>('/api/user/profile', {
        method: 'put',
        body: formData,
        timeout: 3000,
      });

      if (ok) {
        alert(message ?? '회원정보가 수정되었습니다.');
        clearCacheAll();
        onSuccess?.();
      } else {
        alert(message ?? '회원정보 수정에 실패했습니다.');
      }
    } catch (error) {
      alert((error as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitText = conditionGet<string>()
    .when(() => isSubmitting)
    .do('저장 중...')
    .other('변경사항 저장')
    .get();

  return (
    <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 lg:p-10 lg:min-h-[560px]">
      <div className="mb-6 pb-4 border-b border-[#f0f0f0]">
        <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f]">
          회원정보 수정
        </h2>
        <p className="text-[13px] text-[#7a7a7a] mt-1">
          기본 회원 정보를 변경할 수 있습니다.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 max-w-xl">
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="profile-user-id"
              className="block text-[13px] font-semibold text-[#1d1d1f]"
            >
              아이디
            </label>
            <span className="text-[11px] font-medium text-[#86868b]">
              변경 불가
            </span>
          </div>
          <div
            id="profile-user-id"
            className="w-full rounded-[11px] border border-[#e0e0e0] bg-[#f5f5f7] px-3.5 py-2.5 text-[15px] font-medium text-[#555558] select-none"
          >
            @{personal.userId}
          </div>
        </div>

        <div className="flex flex-col">
          <Text
            label="이름"
            placeholder="이름을 입력하세요"
            value={formData.userName}
            onChange={handleNameChange}
          />
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="profile-user-gender"
            className="block text-[13px] font-semibold text-[#1d1d1f] mb-1.5"
          >
            성별
          </label>
          <Select
            id="profile-user-gender"
            value={formData.userGender ?? ''}
            onChange={handleGenderChange}
            options={[
              { label: '선택 안 함', value: '' },
              { label: '남성', value: 'M' },
              { label: '여성', value: 'W' },
            ]}
          />
        </div>

        <div className="flex flex-col">
          <Email
            label="이메일"
            placeholder="이메일을 입력하세요"
            value={formData.email ?? ''}
            onChange={handleEmailChange}
          />
        </div>

        <div className="flex flex-col">
          <Text
            label="주소"
            placeholder="주소를 입력하세요"
            value={formData.userAddr ?? ''}
            onChange={handleAddrChange}
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
