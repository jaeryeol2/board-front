'use client';

import Button from '@/components/base/Button';
import FileInput from '@/components/base/FileInput';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import Textarea from '@/components/base/Textarea';
import { useValidator } from '@/hooks/useValidator';
import { appFetch } from '@/utils/appFetch';
import { toSnakeCase } from '@/utils/caseConverter';
import { isEmpty, isNotEmpty } from '@/utils/isEmpty';
import { useRouter } from 'next/navigation';
import { ChangeEvent, SubmitEvent, useState } from 'react';

type BoardWriteUIProps = {
  boardType: string;
  initialData?: {
    title: string;
    content: string;
  } | null;
  isModify?: boolean;
  postId?: string;
};

/**
 * 게시글 작성/수정 UI 컴포넌트
 * @param boardType 현재 게시판 타입
 */
export default function BoardWriteUI({
  boardType,
  initialData,
  isModify = false,
  postId,
}: Readonly<BoardWriteUIProps>) {
  const router = useRouter();
  const [title, setTitle] = useState<string>(initialData?.title ?? '');
  const [content, setContent] = useState<string>(initialData?.content ?? '');
  const [attachments, setAttachments] = useState<FileList | null>(null);
  const { validator } = useValidator();

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
    const valid = validator
      .verification(() => isEmpty(title), '제목을 입력해주세요.')
      .verification(() => isEmpty(content), '내용을 입력해주세요.');

    if (
      valid.validate() &&
      confirm(isModify ? '수정하시겠습니까?' : '등록하시겠습니까?')
    ) {
      form.set('title', title);
      form.set('content', content);

      if (isNotEmpty(attachments)) {
        for (const file of Array.from(attachments)) {
          form.append(`attachments`, file);
        }
      }

      const url = isModify
        ? `/api/board/${toSnakeCase(boardType).toUpperCase()}/${postId}`
        : `/api/board/${toSnakeCase(boardType).toUpperCase()}`;

      const method = isModify ? 'put' : 'post';

      const { status, data, message } = await appFetch<boolean>(url, {
        method,
        body: form,
      });

      if ((isModify ? status === 200 : status === 201) && data) {
        alert(
          isModify ? '게시글이 수정되었습니다.' : '게시글이 작성되었습니다.',
        );
        router.push(
          isModify
            ? `/board/${boardType}/${postId}`
            : `/board/${boardType}?page=1`,
        );
      } else {
        alert(message);
        return;
      }
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
      <div className="py-6 md:py-12 px-4 md:px-0">
        <div className="bg-white p-5 md:p-10 rounded-2xl border border-gray-100 shadow-sm max-w-4xl mx-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-4">
              {isModify ? '게시글 수정' : '게시글 작성'}
            </h1>
            <p className="text-sm md:text-base text-gray-500 mb-8 md:mb-12">
              {isModify
                ? '게시글의 내용을 수정해보세요.'
                : '새로운 소식을 공유하고 다른 사람들과 소통해보세요.'}
            </p>

            <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
              {/* 제목 입력란 */}
              <div className="border-b-2 border-gray-100 focus-within:border-blue-600 transition-colors duration-300">
                <Text
                  id="title"
                  className="w-full pt-2 pb-3 text-xl md:text-3xl font-bold bg-transparent border-none focus:ring-0 placeholder-gray-300"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              {/* 내용 입력란 */}
              <div className="mt-6 md:mt-8">
                <Textarea
                  placeholder="당신의 이야기를 들려주세요..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full text-base md:text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-300 min-h-[300px] md:min-h-[400px] resize-none leading-relaxed"
                  required
                />
              </div>

              {/* 첨부파일 입력란 */}
              <div className="border-t border-gray-50 pt-8">
                <div className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                    />
                  </svg>
                  파일 첨부
                </div>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="attachments"
                    aria-label="파일 첨부"
                    className="flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-gray-100 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200 transition-all group"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-blue-500">
                      <svg
                        className="w-8 h-8 md:w-10 md:h-10 mb-3 transition-transform group-hover:-translate-y-1"
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
                      <p className="mb-1 text-sm md:text-base">
                        <span className="font-bold">파일 선택</span> 또는 드래그
                      </p>
                      <p className="text-xs text-gray-400">
                        이미지 파일 (JPG, PNG, GIF)
                      </p>
                    </div>
                  </label>
                  <FileInput
                    id="attachments"
                    name="attachments"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                {attachments && attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {Array.from(attachments).map((file, index) => (
                      <div
                        key={`${index}-${file.name}`}
                        className="flex items-center justify-between p-3 bg-blue-50/50 rounded-xl border border-blue-100"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <svg
                            className="w-4 h-4 text-blue-400 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="text-sm font-medium text-gray-700 truncate">
                            {file.name}
                          </span>
                        </div>
                        <span className="text-blue-400 text-xs font-bold flex-shrink-0">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 버튼 영역 */}
              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-8 border-t border-gray-100 mt-8 md:mt-12">
                <Button
                  className="w-full md:w-auto px-8 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                  onClick={handleCancel}
                >
                  취소
                </Button>
                <Submit className="w-full md:w-auto px-10 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all active:scale-95">
                  {isModify ? '수정 완료' : '작성 완료'}
                </Submit>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
