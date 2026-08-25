'use client';

import { PersonalUserInfoType } from '@/types/user';
import { useState } from 'react';
import MyActivities from './MyActivities';
import MypageLnb, { MypageMenuType } from './MypageLnb';
import PasswordChangeForm from './PasswordChangeForm';
import PasswordConfirmView from './PasswordConfirmView';
import ProfileEditForm from './ProfileEditForm';
import ProfileSummary from './ProfileSummary';

export default function MypageUI({
  personal,
}: Readonly<{ personal: PersonalUserInfoType }>) {
  const [activeMenu, setActiveMenu] = useState<MypageMenuType>('profile');
  const [pendingMenu, setPendingMenu] = useState<MypageMenuType | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [activityTab, setActivityTab] = useState<'posts' | 'comments'>('posts');

  const contentList = personal.writedContentList ?? [];
  const commentList = personal.writedCommentList ?? [];
  const totalActivitiesCount = contentList.length + commentList.length;

  const handleSelectMenu = (
    menu: MypageMenuType,
    tab?: 'posts' | 'comments',
  ) => {
    setActivityTab(tab ?? 'posts');

    const isSecurityMenu =
      menu === 'edit-profile' || menu === 'change-password';
    if (isSecurityMenu && !isVerified) {
      setPendingMenu(menu);
      setActiveMenu(menu);
      return;
    }

    setPendingMenu(null);
    setActiveMenu(menu);
  };

  const handleVerifySuccess = () => {
    setIsVerified(true);
    setPendingMenu(null);
  };

  const handleVerifyCancel = () => {
    setPendingMenu(null);
    setActiveMenu('profile');
  };

  const handleProfileSuccess = () => {
    setActiveMenu('profile');
  };

  const handleProfileCancel = () => {
    setActiveMenu('profile');
  };

  const handlePasswordSuccess = () => {
    setActiveMenu('profile');
  };

  const handlePasswordCancel = () => {
    setActiveMenu('profile');
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 lg:py-8">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
          마이페이지
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#7a7a7a]">
          내 활동 내역과 회원 정보를 확인하고 관리하세요.
        </p>
      </div>

      {/* Main Layout: LNB + Dynamic Content */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:min-h-[560px]">
        {/* Left Navigation Bar */}
        <MypageLnb
          activeMenu={activeMenu}
          onSelectMenu={handleSelectMenu}
          totalActivitiesCount={totalActivitiesCount}
        />

        {/* Right Dynamic Content Panel */}
        <main className="flex-1 w-full min-w-0" aria-live="polite">
          {pendingMenu && (
            <PasswordConfirmView
              targetMenu={pendingMenu}
              onSuccess={handleVerifySuccess}
              onCancel={handleVerifyCancel}
            />
          )}

          {!pendingMenu && activeMenu === 'profile' && (
            <ProfileSummary
              personal={personal}
              onNavigateMenu={handleSelectMenu}
            />
          )}

          {!pendingMenu && activeMenu === 'edit-profile' && (
            <ProfileEditForm
              personal={personal}
              onSuccess={handleProfileSuccess}
              onCancel={handleProfileCancel}
            />
          )}

          {!pendingMenu && activeMenu === 'activities' && (
            <MyActivities
              contentList={contentList}
              commentList={commentList}
              activeTab={activityTab}
              onTabChange={setActivityTab}
            />
          )}

          {!pendingMenu && activeMenu === 'change-password' && (
            <PasswordChangeForm
              onSuccess={handlePasswordSuccess}
              onCancel={handlePasswordCancel}
            />
          )}
        </main>
      </div>
    </div>
  );
}
