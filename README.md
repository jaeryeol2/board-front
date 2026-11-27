# board-front

회원, 게시글, 댓글, 공지, 이미지 업로드를 제공하는 게시판 서비스의 웹 화면입니다. Next.js App Router로 만들었고, 모든 API 요청은 board-gateway를 거쳐 board-api로 전달됩니다.

## 전체 구성

```
board-front (3000) → board-gateway (8888) → board-api (8000) → PostgreSQL / Redis / LocalStack(S3)
```

| 저장소 | 역할 |
|---|---|
| board-front (이 저장소) | 화면 (Next.js) |
| [board-gateway](https://github.com/jaeryeol2/board-gateway) | 단일 진입점, 인증 확인, CORS, 라우팅 |
| [board-api](https://github.com/jaeryeol2/board-api) | 비즈니스 로직, DB/캐시/파일 저장 |

## 화면

- `(with-gnb)`: 홈, 게시판 목록·상세·작성/수정(Tiptap 에디터), 댓글, 공지, 마이페이지(내 글/댓글, 프로필, 비밀번호 변경)
- `(no-gnb)`: 로그인, 회원가입

## app-fetch

API 호출에는 직접 만들어 npm에 배포한 HTTP 클라이언트 [app-fetch](https://github.com/jaeryeol2/app-fetch)(`~2.1.0`)를 사용합니다. 프로젝트 전용 래퍼 `src/utils/app-fetch.ts`를 두고, 화면·컴포넌트·`proxy.ts` 등 20개 파일에서 이 래퍼로 호출합니다.

래퍼가 하는 일:

- **서버/브라우저 공통 호출**: 같은 함수를 서버 컴포넌트와 브라우저에서 씁니다. 서버에서는 요청의 쿠키 값을 게이트웨이 인증 헤더(`Authorization`, `X-Guest-Id`, `X-Forwarded-For`)로 넣고, 브라우저 요청은 `proxy.ts`가 쿠키 값으로 `Authorization`, `X-Guest-Id`를 넣습니다. 토큰은 httpOnly 쿠키에만 있고 브라우저 JS는 읽지 않습니다.
- **401 처리**: 응답이 401이면 `/api/auth/access`로 토큰을 재발급받아 1회만 다시 요청합니다. 브라우저에서 동시에 여러 요청이 401을 받아도 재발급은 한 번만 합니다.
- **응답 통일**: 결과를 `{ ok, status, message, data }`로 바꿉니다. `ok`는 HTTP 상태와 본문 status가 모두 2xx일 때 true이고, 네트워크 오류와 타임아웃도 같은 형태로 반환합니다.
- **재시도와 타임아웃**: GET 요청이 502/503/504를 받으면 1초 뒤 1회 재시도합니다. 시도당 타임아웃은 2초입니다.

## 기술 스택

Next.js 16.4, React 19.3, TypeScript 6, Tailwind CSS 4.3, Zustand 5, Tiptap 3, jose 6 (JWT 검증), app-fetch 2.1

## 로컬 실행

board-gateway(8888)와 board-api(8000)가 실행 중이어야 합니다.

1. `.env.example`을 복사해 `.env.local`을 만들고 값을 채웁니다. `.env.local`은 git에서 제외됩니다.

   | 변수 | 설명 |
   |---|---|
   | `APP_ENV` | 실행 환경 (`local`) |
   | `NEXT_APP_URL` | front 주소 (`https://localhost:3000`) |
   | `NEXT_BASE_API_URL` | gateway 주소 (`http://localhost:8888`) |
   | `NEXT_IMAGE_URL` | 이미지 저장소 주소 (`http://localhost:4566`) |
   | `NEXT_JWT_KEY` | JWT 서명 키. board-api, board-gateway의 `JWT_SECRET_KEY`와 같은 값 |

2. 실행합니다. 개발 서버는 `--experimental-https`로 HTTPS를 사용합니다.

   ```bash
   npm install
   npm run dev   # https://localhost:3000
   ```
