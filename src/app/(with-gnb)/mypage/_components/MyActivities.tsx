'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import { Board, BoardComment } from '@/types/board';
import { conditionGet } from '@/utils/condition-get';
import { format } from 'date-fns';
import { useState } from 'react';

type ActivityTab = 'posts' | 'comments';

interface MyActivitiesProps {
  contentList: Board[];
  commentList: BoardComment[];
  activeTab?: ActivityTab;
  onTabChange?: (tab: ActivityTab) => void;
}

export default function MyActivities({
  contentList,
  commentList,
  activeTab: controlledTab,
  onTabChange,
}: Readonly<MyActivitiesProps>) {
  const [internalTab, setInternalTab] = useState<ActivityTab>('posts');
  const activeTab = controlledTab ?? internalTab;

  const handleTabSelect = (tab: ActivityTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const postsButtonClass = conditionGet<string>()
    .when(() => activeTab === 'posts')
    .do(() => 'bg-[#0066cc] text-white hover:bg-[#0071e3]')
    .other(
      () =>
        'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none',
    )
    .get();

  const commentsButtonClass = conditionGet<string>()
    .when(() => activeTab === 'comments')
    .do(() => 'bg-[#0066cc] text-white hover:bg-[#0071e3]')
    .other(
      () =>
        'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none',
    )
    .get();

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Sub-Tabs */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 lg:p-10 lg:min-h-[560px] flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#f0f0f0]">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-[#1d1d1f]">
              나의 활동
            </h2>
            <p className="text-[13px] text-[#7a7a7a] mt-1">
              내가 작성한 게시글과 댓글을 확인하고 관리할 수 있습니다.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => handleTabSelect('posts')}
              className={`px-4 py-1.5 text-[13px] sm:text-[14px] font-medium rounded-full transition-all shadow-none ${postsButtonClass}`}
            >
              작성한 글 ({contentList.length})
            </Button>
            <Button
              onClick={() => handleTabSelect('comments')}
              className={`px-4 py-1.5 text-[13px] sm:text-[14px] font-medium rounded-full transition-all shadow-none ${commentsButtonClass}`}
            >
              작성한 댓글 ({commentList.length})
            </Button>
          </div>
        </div>

        {/* Tab Content: Posts */}
        {activeTab === 'posts' && (
          <div>
            {contentList.length > 0 ? (
              <ul className="divide-y divide-[#f0f0f0]">
                {contentList.map((post) => {
                  const href = `/board/free/${post.id}`;
                  return (
                    <li
                      key={post.id}
                      className="py-4 hover:bg-[#fafafc] px-3 rounded-[10px] transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <AppLink
                          href={href}
                          className="font-medium text-[15px] text-[#1d1d1f] hover:text-[#0066cc] truncate flex-1 transition-colors"
                        >
                          {post.title}
                        </AppLink>
                        <div className="flex items-center gap-3 text-[12px] sm:text-[13px] text-[#7a7a7a] flex-shrink-0">
                          <span>조회 {post.viewCount}</span>
                          <span className="text-[#e0e0e0]">|</span>
                          <span>
                            {post.createdAt
                              ? format(new Date(post.createdAt), 'yyyy.MM.dd')
                              : ''}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="py-16 text-center text-[#7a7a7a] text-[14px]">
                작성한 게시글이 없습니다.
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Comments */}
        {activeTab === 'comments' && (
          <div>
            {commentList.length > 0 ? (
              <ul className="divide-y divide-[#f0f0f0]">
                {commentList.map((comment) => (
                  <li
                    key={comment.id}
                    className="py-4 hover:bg-[#fafafc] px-3 rounded-[10px] transition-colors"
                  >
                    <div className="flex flex-col gap-1.5">
                      <p className="text-[14px] sm:text-[15px] text-[#1d1d1f] leading-relaxed break-words">
                        {comment.content}
                      </p>
                      <div className="text-[11px] sm:text-xs text-[#7a7a7a]">
                        {comment.createdAt
                          ? format(
                              new Date(comment.createdAt),
                              'yyyy.MM.dd HH:mm',
                            )
                          : ''}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="py-16 text-center text-[#7a7a7a] text-[14px]">
                작성한 댓글이 없습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
