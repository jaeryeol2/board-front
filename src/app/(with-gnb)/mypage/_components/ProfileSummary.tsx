'use client';

import Button from '@/components/base/Button';
import { PersonalUserInfoType } from '@/types/user';
import { conditionGet } from '@/utils/condition-get';
import { MypageMenuType } from './MypageLnb';

interface ProfileSummaryProps {
  personal: PersonalUserInfoType;
  onNavigateMenu: (menu: MypageMenuType, tab?: 'posts' | 'comments') => void;
}

export default function ProfileSummary({
  personal,
  onNavigateMenu,
}: Readonly<ProfileSummaryProps>) {
  const contentList = personal.writedContentList ?? [];
  const commentList = personal.writedCommentList ?? [];

  const genderText = conditionGet<string>()
    .when(personal.userGender === 'M')
    .do('남성')
    .when(personal.userGender === 'W')
    .do('여성')
    .other('-')
    .get();

  const handleEditClick = () => {
    onNavigateMenu('edit-profile');
  };

  const handlePostsClick = () => {
    onNavigateMenu('activities', 'posts');
  };

  const handleCommentsClick = () => {
    onNavigateMenu('activities', 'comments');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Profile Overview Card */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-3xl font-semibold text-[#0066cc] flex-shrink-0">
            {personal.userName?.charAt(0) ?? 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1d1d1f] tracking-tight truncate">
                  {personal.userName}
                </h2>
                <p className="text-[14px] text-[#7a7a7a]">@{personal.userId}</p>
              </div>

              <Button
                onClick={handleEditClick}
                className="self-center sm:self-auto px-4 py-1.5 text-[13px] font-medium text-[#0066cc] bg-[#f5f5f7] rounded-full hover:bg-[#e8e8ed] transition-all shadow-none"
              >
                회원정보 수정
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 pt-5 border-t border-[#f0f0f0] text-[14px] sm:text-[15px]">
              <div className="flex items-center gap-2 text-[#7a7a7a]">
                <span className="font-medium text-[#1d1d1f] w-16">이메일</span>
                <span className="truncate">{personal.email || '-'}</span>
              </div>
              <div className="flex items-center gap-2 text-[#7a7a7a]">
                <span className="font-medium text-[#1d1d1f] w-16">성별</span>
                <span>{genderText}</span>
              </div>
              <div className="flex items-center gap-2 text-[#7a7a7a] sm:col-span-2">
                <span className="font-medium text-[#1d1d1f] w-16">주소</span>
                <span className="truncate">{personal.userAddr || '-'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Statistics Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 flex flex-col justify-between lg:min-h-[190px]">
          <div>
            <p className="text-[14px] sm:text-[15px] font-medium text-[#7a7a7a] mb-1.5">
              작성한 게시글
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-[#1d1d1f]">
              {contentList.length}
              <span className="text-[15px] font-normal text-[#7a7a7a] ml-1">
                건
              </span>
            </p>
          </div>
          <Button
            onClick={handlePostsClick}
            className="mt-6 w-full py-2.5 text-[13px] sm:text-[14px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-[10px] hover:bg-[#e8e8ed] transition-all shadow-none"
          >
            게시글 목록 보기
          </Button>
        </div>

        <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 flex flex-col justify-between lg:min-h-[190px]">
          <div>
            <p className="text-[14px] sm:text-[15px] font-medium text-[#7a7a7a] mb-1.5">
              작성한 댓글
            </p>
            <p className="text-3xl sm:text-4xl font-bold text-[#1d1d1f]">
              {commentList.length}
              <span className="text-[15px] font-normal text-[#7a7a7a] ml-1">
                건
              </span>
            </p>
          </div>
          <Button
            onClick={handleCommentsClick}
            className="mt-6 w-full py-2.5 text-[13px] sm:text-[14px] font-medium text-[#1d1d1f] bg-[#f5f5f7] rounded-[10px] hover:bg-[#e8e8ed] transition-all shadow-none"
          >
            댓글 목록 보기
          </Button>
        </div>
      </div>
    </div>
  );
}
