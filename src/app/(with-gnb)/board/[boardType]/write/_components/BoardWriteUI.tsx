'use client';

import Button from '@/components/base/Button';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import Textarea from '@/components/base/Textarea';
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
    <div className="bg-white min-h-screen">
      <div className="py-20">
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              게시글 작성
            </h1>
            <p className="text-gray-600 mb-12">
              새로운 소식을 공유하고 다른 사람들과 소통해보세요.
            </p>

            <form onSubmit={handleSubmit} className="space-y-10">
              {/* 제목 입력란 */}
              <div className="border-b-2 border-gray-200 focus-within:border-gray-900 transition-colors duration-200">
                <Text
                  id="title"
                  className="w-full pt-2 pb-3 text-3xl font-semibold bg-transparent border-none focus:ring-0 placeholder-gray-400"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* 내용 입력란 */}
              <div className="mt-8">
                <Textarea
                  placeholder="내용을 입력하세요"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-400 min-h-[400px] resize-none"
                  required
                />
              </div>

              {/* 첨부파일 입력란 */}
              <div className="border-t border-gray-200 pt-8">
                <label
                  htmlFor="attachments"
                  className="text-lg font-semibold text-gray-800"
                >
                  파일 첨부
                </label>
                <div className="mt-4 flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-500">
                      <svg
                        className="w-10 h-10 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h1.586a1 1 0 01.707.293l1.414 1.414a1 1 0 00.707.293h4.586a4 4 0 014 4v5a4 4 0 01-4 4H7z"
                        ></path>
                      </svg>
                      <p className="mb-2 text-base">
                        <span className="font-semibold">클릭 또는 드래그</span>
                      </p>
                      <p className="text-xs">이미지 파일을 업로드하세요.</p>
                    </div>
                    <input
                      id="attachments"
                      name="attachments"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                  </label>
                </div>
                {attachments && attachments.length > 0 && (
                  <div className="mt-4 text-sm text-gray-600">
                    <ul className="space-y-2">
                      {Array.from(attachments).map((file, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-2 px-3 bg-gray-100 rounded-md"
                        >
                          <span className="font-medium truncate pr-4">
                            {file.name}
                          </span>
                          <span className="text-gray-500 text-xs flex-shrink-0">
                            {(file.size / 1024).toFixed(2)} KB
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* 버튼 영역 */}
              <div className="flex justify-end gap-4 pt-8 border-t border-gray-200 mt-12">
                <Button
                  onClick={handleCancel}
                  className="px-8 py-3 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                >
                  취소
                </Button>
                <Submit className="px-8 py-3 rounded-lg font-semibold">
                  작성 완료
                </Submit>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
