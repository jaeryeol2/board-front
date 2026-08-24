'use client';

import Button from '@/components/base/Button';
import { PersonalUserInfoType } from '@/types/user';
import { format } from 'date-fns';
import { useState } from 'react';

type TabType = 'posts' | 'comments';

export default function MypageUI({
  personal,
}: Readonly<{ personal: PersonalUserInfoType }>) {
  const [activeTab, setActiveTab] = useState<TabType>('posts');

  const contentList = personal.writedContentList ?? [];
  const commentList = personal.writedCommentList ?? [];

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Page Header */}
      <div className="mb-6 sm:mb-8 text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#1d1d1f] tracking-tight mb-2">
          마이페이지
        </h1>
        <p className="text-[15px] sm:text-[17px] text-[#7a7a7a]">
          내 활동 내역과 회원 정보를 확인하세요.
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-5 sm:p-6 md:p-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] flex items-center justify-center text-2xl sm:text-3xl font-semibold text-[#0066cc] flex-shrink-0">
            {personal.userName?.charAt(0) ?? 'U'}
          </div>

          <div className="flex-1 text-center sm:text-left min-w-0">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1d1d1f] tracking-tight mb-1 truncate">
              {personal.userName}
            </h2>
            <p className="text-[14px] text-[#7a7a7a] mb-4">
              @{personal.userId}
            </p>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-4 text-[13px] text-[#7a7a7a]">
              {personal.userGender && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f]">
                  {personal.userGender === 'M' ? '남성' : '여성'}
                </span>
              )}
              {personal.userAddr && (
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f] truncate max-w-xs">
                  {personal.userAddr}
                </span>
              )}
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f]">
                작성 글 {contentList.length}건
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-[#f5f5f7] border border-[#e0e0e0] text-[#1d1d1f]">
                작성 댓글 {commentList.length}건
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 sm:mb-6 border-b border-[#e0e0e0] pb-3">
        <Button
          onClick={() => setActiveTab('posts')}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[14px] sm:text-[15px] font-medium rounded-full transition-all shadow-none ${
            activeTab === 'posts'
              ? 'bg-[#0066cc] text-white hover:bg-[#0071e3]'
              : 'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none'
          }`}
        >
          작성한 글 ({contentList.length})
        </Button>
        <Button
          onClick={() => setActiveTab('comments')}
          className={`px-4 sm:px-5 py-1.5 sm:py-2 text-[14px] sm:text-[15px] font-medium rounded-full transition-all shadow-none ${
            activeTab === 'comments'
              ? 'bg-[#0066cc] text-white hover:bg-[#0071e3]'
              : 'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none'
          }`}
        >
          작성한 댓글 ({commentList.length})
        </Button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'posts' && (
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
          {contentList.length > 0 ? (
            <ul className="divide-y divide-[#f0f0f0]">
              {contentList.map((post) => (
                <li key={post.id} className="p-4 sm:p-5 hover:bg-[#fafafc] transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-medium text-[15px] text-[#1d1d1f] truncate flex-1">
                      {post.title}
                    </span>
                    <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-[#7a7a7a] flex-shrink-0">
                      <span>조회 {post.viewCount}</span>
                      <span className="text-[#e0e0e0]">|</span>
                      <span>
                        {post.createdAt ? format(new Date(post.createdAt), 'yyyy.MM.dd') : ''}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-14 sm:py-16 text-center text-[#7a7a7a] text-[14px] sm:text-[15px]">
              작성한 게시글이 없습니다.
            </div>
          )}
        </div>
      )}

      {activeTab === 'comments' && (
        <div className="bg-white rounded-[18px] border border-[#e0e0e0] overflow-hidden">
          {commentList.length > 0 ? (
            <ul className="divide-y divide-[#f0f0f0]">
              {commentList.map((comment) => (
                <li key={comment.id} className="p-4 sm:p-5 hover:bg-[#fafafc] transition-colors">
                  <div className="flex flex-col gap-1.5">
                    <p className="text-[14px] sm:text-[15px] text-[#1d1d1f] leading-relaxed break-words">
                      {comment.content}
                    </p>
                    <div className="text-[11px] sm:text-xs text-[#7a7a7a]">
                      {comment.createdAt ? format(new Date(comment.createdAt), 'yyyy.MM.dd HH:mm') : ''}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-14 sm:py-16 text-center text-[#7a7a7a] text-[14px] sm:text-[15px]">
              작성한 댓글이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
}

