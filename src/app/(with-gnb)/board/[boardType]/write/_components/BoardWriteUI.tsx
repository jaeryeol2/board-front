'use client';

import Button from '@/components/base/Button';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isNotEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { ChangeEvent, SubmitEvent, useState } from 'react';

type BoardWriteUIProps = {
  boardType: string;
};

/**
 * 게시글 작성 UI 컴포넌트
 * @param boardType 현재 게시판 타입
 */
export default function BoardWriteUI({
  boardType,
}: Readonly<BoardWriteUIProps>) {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [attachments, setAttachments] = useState<FileList | null>(null);

  /**
   * 파일 선택 변경 핸들러
   * @param e 파일 입력 이벤트
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(e.target.files);
    }
  };

  /**
   * 폼 제출 핸들러
   * @param e 폼 제출 이벤트
   */
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData();

    console.log('게시글 작성:', { boardType, title, content, attachments });
    form.set('title', title);
    form.set('content', content);

    if (isNotEmpty(attachments)) {
      for (const [_, file] of Array.from(attachments).entries()) {
        form.append(`attachments`, file);
      }
    }

    const { status, data } = await appFetch<boolean>(
      `/api/board/${toSnakeCase(boardType).toUpperCase()}`,
      {
        method: 'post',
        body: form,
      },
    );

    if (status === 201 && data) {
      alert('게시글이 작성되었습니다.');
      router.push(`/board/${boardType}?page=1`);
    }
  };

  /**
   * 취소 버튼 클릭 핸들러
   */
  const handleCancel = (): void => {
    router.back(); // 이전 페이지로 돌아가기
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 sm:p-10 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">게시글 작성</h1>
        <p className="text-gray-500 mb-10">
          새로운 소식을 공유하고 다른 사람들과 소통해보세요.
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 제목 입력란 */}
          <div className="border-b border-gray-200 focus-within:border-blue-500 transition-colors">
            <Text
              label="제목"
              id="title"
              className="w-full pt-2 pb-3 text-lg bg-transparent border-none focus:ring-0 placeholder-gray-400"
              placeholder="제목을 입력해 주세요"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          {/* 내용 입력란 */}
          <div className="border-b border-gray-200 focus-within:border-blue-500 transition-colors">
            <label
              htmlFor="content"
              className="text-sm font-medium text-gray-500"
            >
              내용
            </label>
            <textarea
              id="content"
              rows={12}
              className="w-full pt-2 pb-3 text-base bg-transparent border-none focus:ring-0 resize-none placeholder-gray-400"
              placeholder="내용을 입력해 주세요"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>

          {/* 첨부파일 입력란 */}
          <div>
            <label
              htmlFor="attachments"
              className="text-sm font-medium text-gray-500"
            >
              첨부파일
            </label>
            <div className="mt-2 flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    className="w-8 h-8 mb-4 text-gray-500"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                    />
                  </svg>
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">클릭하여 업로드</span> 또는
                    파일을 드래그하세요.
                  </p>
                </div>
                <input
                  id="attachments"
                  name="attachments"
                  type="file"
                  className="hidden"
                  multiple
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {attachments && attachments.length > 0 && (
              <div className="mt-3 text-sm text-gray-600">
                <span className="font-semibold">선택된 파일: </span>
                {Array.from(attachments)
                  .map((file) => file.name)
                  .join(', ')}
              </div>
            )}
          </div>

          {/* 버튼 영역 */}
          <div className="flex justify-end gap-4 pt-6">
            <Button
              onClick={handleCancel}
              className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
            >
              취소
            </Button>
            <Submit className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              작성 완료
            </Submit>
          </div>
        </form>
      </div>
    </div>
  );
}
