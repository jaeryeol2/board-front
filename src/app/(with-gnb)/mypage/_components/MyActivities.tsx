'use client';

import AppLink from '@/components/base/AppLink';
import Button from '@/components/base/Button';
import Pagination from '@/components/common/client/Pagination';
import SectionLoading from '@/components/common/SectionLoading';
import { Board, BoardComment } from '@/types/board';
import { appFetch } from '@/utils/app-fetch';
import { conditionGet } from '@/utils/condition-get';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

type ActivityTab = 'posts' | 'comments';

interface MyActivitiesProps {
  contentList: Board[];
  commentList: BoardComment[];
  activeTab?: ActivityTab;
  onTabChange?: (tab: ActivityTab) => void;
}

const ITEMS_PER_PAGE = 10;

export default function MyActivities({
  contentList,
  commentList,
  activeTab: controlledTab,
  onTabChange,
}: Readonly<MyActivitiesProps>) {
  const [internalTab, setInternalTab] = useState<ActivityTab>('posts');
  const [postsPage, setPostsPage] = useState<number>(1);
  const [commentsPage, setCommentsPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [fetchedPosts, setFetchedPosts] = useState<{
    page: number;
    list: Board[];
    total: number;
  } | null>(null);
  const [fetchedComments, setFetchedComments] = useState<{
    page: number;
    list: BoardComment[];
    total: number;
  } | null>(null);

  const activeTab = controlledTab ?? internalTab;

  const currentPosts = useMemo(() => {
    if (fetchedPosts?.page === postsPage) {
      return fetchedPosts.list;
    }
    const startIndex = (postsPage - 1) * ITEMS_PER_PAGE;
    return contentList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [fetchedPosts, postsPage, contentList]);

  const totalPosts = fetchedPosts?.total ?? contentList.length;

  const currentComments = useMemo(() => {
    if (fetchedComments?.page === commentsPage) {
      return fetchedComments.list;
    }
    const startIndex = (commentsPage - 1) * ITEMS_PER_PAGE;
    return commentList.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [fetchedComments, commentsPage, commentList]);

  const totalComments = fetchedComments?.total ?? commentList.length;

  const handleTabSelect = (tab: ActivityTab) => {
    if (onTabChange) {
      onTabChange(tab);
    } else {
      setInternalTab(tab);
    }
  };

  const handlePostsPageChange = async (newPage: number) => {
    setPostsPage(newPage);
    const { data } = await appFetch<{ total: number; list: Board[] }>(
      `/api/user/posts?page=${newPage}&rowsPerPage=${ITEMS_PER_PAGE}`,
      {
        beforeRequest() {
          setLoading(true);
        },
        afterResponse() {
          setLoading(false);
        },
        onError() {
          setLoading(false);
        },
      },
    );

    if (data) {
      setFetchedPosts({
        page: newPage,
        list: data.list ?? [],
        total: data.total,
      });
    }
  };

  const handleCommentsPageChange = async (newPage: number) => {
    setCommentsPage(newPage);
    const { data } = await appFetch<{ total: number; list: BoardComment[] }>(
      `/api/user/comments?page=${newPage}&rowsPerPage=${ITEMS_PER_PAGE}`,
      {
        beforeRequest() {
          setLoading(true);
        },
        afterResponse() {
          setLoading(false);
        },
        onError() {
          setLoading(false);
        },
      },
    );

    if (data) {
      setFetchedComments({
        page: newPage,
        list: data.list ?? [],
        total: data.total,
      });
    }
  };

  const postsButtonClass = conditionGet<string>()
    .when(() => activeTab === 'posts')
    .do('bg-[#0066cc] text-white hover:bg-[#0071e3]')
    .other(
      'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none',
    )
    .get();

  const commentsButtonClass = conditionGet<string>()
    .when(() => activeTab === 'comments')
    .do('bg-[#0066cc] text-white hover:bg-[#0071e3]')
    .other(
      'bg-transparent text-[#7a7a7a] hover:bg-[#f5f5f7] hover:text-[#1d1d1f] border-none',
    )
    .get();

  return (
    <div className="flex flex-col gap-6">
      {/* Title & Sub-Tabs */}
      <div className="bg-white rounded-[18px] border border-[#e0e0e0] p-6 sm:p-8 lg:p-10 lg:min-h-[560px] flex flex-col justify-between">
        <div>
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
                작성한 글 ({totalPosts})
              </Button>
              <Button
                onClick={() => handleTabSelect('comments')}
                className={`px-4 py-1.5 text-[13px] sm:text-[14px] font-medium rounded-full transition-all shadow-none ${commentsButtonClass}`}
              >
                작성한 댓글 ({totalComments})
              </Button>
            </div>
          </div>

          {/* Section Loading Wrapper */}
          <SectionLoading loading={loading}>
            {/* Tab Content: Posts */}
            {activeTab === 'posts' && (
              <div>
                {currentPosts.length > 0 ? (
                  <ul className="divide-y divide-[#f0f0f0]">
                    {currentPosts.map((post) => {
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
                                  ? format(
                                      new Date(post.createdAt),
                                      'yyyy.MM.dd',
                                    )
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
                {currentComments.length > 0 ? (
                  <ul className="divide-y divide-[#f0f0f0]">
                    {currentComments.map((comment) => (
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
          </SectionLoading>
        </div>

        {/* Pagination */}
        {activeTab === 'posts' && totalPosts > ITEMS_PER_PAGE && (
          <div className="flex justify-center mt-6 pt-4 border-t border-[#f0f0f0]">
            <Pagination
              totalItems={totalPosts}
              itemsPerPage={ITEMS_PER_PAGE}
              page={postsPage}
              onPageChange={handlePostsPageChange}
            />
          </div>
        )}
        {activeTab === 'comments' && totalComments > ITEMS_PER_PAGE && (
          <div className="flex justify-center mt-6 pt-4 border-t border-[#f0f0f0]">
            <Pagination
              totalItems={totalComments}
              itemsPerPage={ITEMS_PER_PAGE}
              page={commentsPage}
              onPageChange={handleCommentsPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
