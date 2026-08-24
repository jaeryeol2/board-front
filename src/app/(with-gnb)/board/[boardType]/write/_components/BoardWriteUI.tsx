'use client';

import Button from '@/components/base/Button';
import FileInput from '@/components/base/FileInput';
import Submit from '@/components/base/Submit';
import Text from '@/components/base/Text';
import { useFileDrop } from '@/hooks/use-file-drop';
import { useValidator } from '@/hooks/use-validator';
import { BoardDetail } from '@/types/board';
import { appFetch } from '@/utils/app-fetch';
import { toSnakeCase } from '@/utils/case-converter';
import { condition } from '@/utils/condition';
import { isEmpty, isNotEmpty } from '@/utils/is-empty';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useRouter } from 'next/navigation';
import {
  Activity,
  ChangeEvent,
  SubmitEvent,
  useCallback,
  useRef,
  useState,
} from 'react';
import BoardAttachmentItem from './BoardAttachmentItem';
import { CustomImage } from './custom-image';

type BoardWriteUIProps = {
  boardType: string;
  initialData?: BoardDetail | null;
  isModify?: boolean;
  postId?: string;
};

/**
 * HTML 문자열에서 img 태그의 src URL 목록 추출
 */
const extractImageUrls = (html: string): string[] => {
  if (!html) return [];
  const urls: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(html)) !== null) {
    if (match[1]) {
      urls.push(match[1]);
    }
  }
  return urls;
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
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const uploadedImagesRef = useRef<Set<string>>(new Set());
  const prevImageUrlsRef = useRef<Set<string>>(
    new Set(extractImageUrls(initialData?.content ?? '')),
  );
  const { validator } = useValidator();

  /**
   * S3 이미지 단일 업로드 헬퍼
   */
  const uploadImageFile = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        setIsUploadingImage(true);
        const form = new FormData();
        form.set('file', file);
        const { status, data } = await appFetch<string>('/api/board/image', {
          method: 'post',
          body: form,
        });

        if (status === 200 && data) {
          uploadedImagesRef.current.add(data);
          return data;
        }
      } catch (err) {
        console.error('Image upload failed:', err);
      } finally {
        setIsUploadingImage(false);
      }
      return null;
    },
    [],
  );

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      CustomImage.configure({
        allowBase64: false,
        HTMLAttributes: {
          class:
            'rounded-xl max-w-full my-4 border border-gray-100 shadow-sm object-cover',
        },
      }),
    ],
    content,
    onUpdate({ editor: currentEditor }) {
      const html = currentEditor.getHTML();
      setContent(html);

      // 에디터에서 이미지가 삭제되었는지 diff 비교 후 S3 삭제 호출
      const currentUrls = new Set(extractImageUrls(html));
      for (const prevUrl of prevImageUrlsRef.current) {
        if (
          !currentUrls.has(prevUrl) &&
          uploadedImagesRef.current.has(prevUrl)
        ) {
          appFetch<boolean>('/api/board/image', {
            method: 'delete',
            query: {
              url: prevUrl,
            },
          }).catch((e) => console.error('Delete image failed:', e));
          uploadedImagesRef.current.delete(prevUrl);
        }
      }
      prevImageUrlsRef.current = currentUrls;
    },
    editorProps: {
      attributes: {
        class:
          'w-full text-base md:text-lg text-gray-800 bg-transparent border-none focus:ring-0 placeholder-gray-300 min-h-[300px] md:min-h-[400px] resize-none leading-relaxed',
      },
      handlePaste(view, event) {
        const items = Array.from(event.clipboardData?.items ?? []);
        const imageItem = items.find((item) => item.type.startsWith('image/'));
        if (imageItem) {
          const file = imageItem.getAsFile();
          if (file) {
            uploadImageFile(file).then((url) => {
              if (url) {
                view.dispatch(
                  view.state.tr.replaceSelectionWith(
                    view.state.schema.nodes.image.create({ src: url }),
                  ),
                );
              }
            });
            return true;
          }
        }
        return false;
      },
      handleDrop(view, event) {
        const files = Array.from(event.dataTransfer?.files ?? []);
        const imageFile = files.find((f) => f.type.startsWith('image/'));
        if (imageFile) {
          event.preventDefault();
          uploadImageFile(imageFile).then((url) => {
            if (url) {
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              });
              if (coordinates) {
                view.dispatch(
                  view.state.tr.insert(
                    coordinates.pos,
                    view.state.schema.nodes.image.create({ src: url }),
                  ),
                );
              }
            }
          });
          return true;
        }
        return false;
      },
    },
    immediatelyRender: true,
  });

  /**
   * 툴바에서 이미지 추가 핸들러
   */
  const handleEditorImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editor) {
      const url = await uploadImageFile(file);
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      e.target.value = '';
    }
  };

  /**
   * 파일 목록에 새로운 파일들 추가
   * @param newFiles 추가할 파일 배열
   */
  const addFiles = useCallback((newFiles: File[]) => {
    setAttachments((prevList: FileList | null) => {
      const dataTransfer = new DataTransfer();

      if (isNotEmpty(prevList)) {
        for (const item of Array.from(prevList)) {
          dataTransfer.items.add(item);
        }
      }

      for (const file of newFiles) {
        dataTransfer.items.add(file);
      }

      return dataTransfer.files;
    });
  }, []);

  const { isDragging, dropProps } = useFileDrop({
    onDropFiles: addFiles,
  });

  /**
   * 신규 첨부파일 개별 삭제 핸들러
   * @param targetIndex 삭제할 파일의 인덱스
   */
  const handleRemoveAttachment = useCallback((targetIndex: number) => {
    setAttachments((prevList: FileList | null) => {
      if (!prevList) return null;
      const remainingFiles = Array.from(prevList).filter(
        (_, index) => index !== targetIndex,
      );
      if (remainingFiles.length === 0) return null;

      const dataTransfer = new DataTransfer();
      for (const file of remainingFiles) {
        dataTransfer.items.add(file);
      }
      return dataTransfer.files;
    });
  }, []);

  /**
   * 파일 선택 변경 핸들러
   * @param e 파일 입력 이벤트
   */
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  /**
   * 폼 제출 핸들러
   * @param e 폼 제출 이벤트
   */
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cond = condition();
    const form = new FormData();
    const valid = validator
      .verification(() => isEmpty(title), '제목을 입력해주세요.')
      .verification(() => isEmpty(content), '내용을 입력해주세요.');

    if (
      valid.validate() &&
      confirm(`${isModify ? '수정' : '등록'}하시겠습니까?`)
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

      const result = cond
        .when(
          () => (isModify ? status === 200 : status === 201) && (data ?? false),
        )
        .do(() => {
          alert(`게시글이 ${isModify ? '수정' : '작성'}되었습니다.`);

          router.replace(
            isModify
              ? `/board/${boardType}/${postId}`
              : `/board/${boardType}?page=1`,
          );
        })
        .other(() => {
          alert(message);
        });

      result.execute();
    }
  };

  /**
   * 취소 버튼 클릭 핸들러
   */
  const handleCancel = (): void => {
    // 세션 동안 업로드된 이미지 중 작성 취소 시 미사용 이미지 일괄 삭제
    for (const url of uploadedImagesRef.current) {
      appFetch<boolean>('/api/board/image', {
        method: 'delete',
        query: {
          url,
        },
      }).catch((e) => console.error('Cleanup image error:', e));
    }
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
                {/* 에디터 툴바 */}
                <div className="flex items-center justify-between pb-2 border-b border-gray-100 mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editorImageInputRef.current?.click()}
                      disabled={isUploadingImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200 cursor-pointer disabled:opacity-50"
                    >
                      <svg
                        className="w-4 h-4 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      {isUploadingImage
                        ? '이미지 업로드 중...'
                        : '본문 사진 추가'}
                    </button>
                    <input
                      ref={editorImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleEditorImageChange}
                    />
                  </div>
                  <span className="text-xs text-gray-400">
                    이미지를 에디터로 드래그하거나 붙여넣기(Ctrl+V)할 수
                    있습니다
                  </span>
                </div>

                <EditorContent editor={editor} />
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
                    {...dropProps}
                    className={`flex flex-col items-center justify-center w-full h-32 md:h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all group ${
                      isDragging
                        ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-300'
                        : 'border-gray-100 bg-gray-50/50 hover:bg-blue-50/50 hover:border-blue-200'
                    }`}
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
                        이미지 및 일반 파일 첨부 지원
                      </p>
                    </div>
                  </label>
                  <FileInput
                    id="attachments"
                    name="attachments"
                    className="hidden"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>
                <Activity
                  mode={
                    (initialData?.fileList ?? []).length > 0 ||
                    (attachments ?? []).length > 0
                      ? 'visible'
                      : 'hidden'
                  }
                >
                  <div className="mt-4 space-y-2">
                    {initialData?.fileList.map((file) => (
                      <BoardAttachmentItem
                        key={`initial-${file.id}-${file.originalFileName}`}
                        file={file}
                      />
                    ))}

                    {Array.from(attachments ?? []).map((file, index) => (
                      <BoardAttachmentItem
                        key={`new-${index}-${file.name}-${file.lastModified}`}
                        file={file}
                        onRemove={() => handleRemoveAttachment(index)}
                      />
                    ))}
                  </div>
                </Activity>
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
