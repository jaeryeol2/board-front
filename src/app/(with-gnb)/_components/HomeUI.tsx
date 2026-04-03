'use client';

import AppLink from '@/components/base/AppLink';

// NOTE: API 연동 전 사용할 임시 데이터입니다.
const mockBoards = [
  {
    id: 1,
    title: '자유 게시판',
    path: '/board/free',
    posts: [
      { id: 1, title: 'Next.js 14 버전 써보신 분 계신가요?', path: '/post/1' },
      { id: 2, title: '리액트 훅(Hook) 질문 있습니다.', path: '/post/2' },
      {
        id: 3,
        title: 'Tailwind CSS 클래스 적용이 안될 때 팁',
        path: '/post/3',
      },
      { id: 4, title: '프론트엔드 개발자 로드맵 공유합니다.', path: '/post/4' },
      { id: 5, title: '요즘 웹 개발 트렌드에 대한 생각', path: '/post/5' },
      { id: 6, title: 'Vercel 배포 시 환경변수 설정 방법', path: '/post/6' },
      {
        id: 7,
        title: 'TypeScript 제네릭, 언제 사용해야 할까요?',
        path: '/post/7',
      },
      {
        id: 8,
        title: '사이드 프로젝트 팀원 구합니다 (React/Spring)',
        path: '/post/8',
      },
      { id: 9, title: '개발자 노트북 추천 부탁드립니다.', path: '/post/9' },
      { id: 10, title: 'CS 스터디 같이 하실 분?', path: '/post/10' },
    ],
  },
  {
    id: 2,
    title: '질문 & 답변',
    path: '/board/qna',
    posts: [
      {
        id: 11,
        title: 'Java NullPointerException 해결 방법 질문',
        path: '/post/11',
      },
      {
        id: 12,
        title: 'Spring Boot에서 CORS 에러가 발생합니다.',
        path: '/post/12',
      },
      { id: 13, title: 'JPA N+1 문제에 대해 알려주세요.', path: '/post/13' },
      {
        id: 14,
        title: 'React 상태관리 라이브러리 뭐 쓰시나요?',
        path: '/post/14',
      },
      { id: 15, title: 'SQL 쿼리 성능 튜닝 질문입니다.', path: '/post/15' },
      { id: 16, title: '도커 이미지 빌드가 너무 느려요.', path: '/post/16' },
      {
        id: 17,
        title: '알고리즘 문제 풀이 도와주세요 (백준)',
        path: '/post/17',
      },
      {
        id: 18,
        title: '신입 개발자 이력서 피드백 부탁드립니다.',
        path: '/post/18',
      },
      {
        id: 19,
        title: '객체지향 설계 원칙(SOLID)이 어렵습니다.',
        path: '/post/19',
      },
      { id: 20, title: 'HTTP와 HTTPS의 차이점이 뭔가요?', path: '/post/20' },
    ],
  },
  // NOTE: 필요에 따라 게시판 데이터를 추가할 수 있습니다.
];

export default function HomeUI() {
  return (
    <main className="w-full max-w-screen-xl mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {mockBoards.map((board) => (
          // NOTE: 이 섹션은 `src/components/base/Card.tsx` 와 같은 공통 컴포넌트로 분리하여 재사용성을 높일 수 있습니다.
          <section
            key={board.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 p-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">{board.title}</h2>
              <AppLink
                href={board.path}
                className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
              >
                더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </AppLink>
            </div>
            {/* NOTE: 이 리스트는 `src/components/base/PostList.tsx` 와 같은 컴포넌트로 분리할 수 있습니다. */}
            <ul className="space-y-2">
              {board.posts.map((post) => (
                <li key={post.id}>
                  <AppLink
                    href={post.path}
                    className="text-gray-700 hover:text-blue-600 hover:font-medium hover:bg-blue-50 rounded-md py-1 px-2 transition-all duration-200 truncate block"
                  >
                    {post.title}
                  </AppLink>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
