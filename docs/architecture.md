# client 아키텍처 맵 (AI 리뷰어용)

PR 리뷰 전에 읽는 코드베이스 지도다. 목표는 "아무 React/React Native 레포에나
성립하는 리뷰"가 아니라 **봄봄의 실제 계약과 워크스페이스 경계를 근거로 한 리뷰**를
가능하게 하는 것이다. 이 문서와 코드가 어긋나면 코드가 진실이다. 발견 시 문서 갱신을
제안한다. 코딩 규칙은 `CONVENTIONS.md`와 그 문서가 가리키는 `docs/` 문서가 담당한다.

## 저장소 구성

| 워크스페이스 | 역할 | 주요 기술 |
| --- | --- | --- |
| `web` | 뉴스레터·아티클·챌린지·이벤트 사용자 웹 | React 19, Webpack, TanStack Router/Query, Emotion |
| `app` | `web` WebView와 소셜 로그인·푸시·기기 기능을 제공하는 앱 | Expo 54, React Native 0.81, Firebase |
| `admin` | 회원·콘텐츠·챌린지·이벤트 운영 웹 | React 19, Vite, TanStack Router/Query, Supabase 일부 사용 |
| `maeil-mail` | 매일메일 구독·콘텐츠용 별도 웹 | React 19, Vite, TanStack Router/Query |
| `shared` | theme·웹 UI·fetcher·생성 API·WebView 메시지 타입 | TypeScript package |

`web`·`app`·`admin`·`maeil-mail`은 독립 배포 단위다. 같은 이름의 컴포넌트·훅·API가
각 워크스페이스에 따로 있을 수 있으므로 한 곳의 패턴을 다른 곳에 무조건 적용하지 않는다.
두 곳 이상이 실제로 공유하는 코드만 `shared` 영향 범위로 본다.

## 공용 API 계약

- 표준 HTTP 경로는 `shared/src/core/apis/fetcher.ts`의 `fetcher`다. 각 도메인은
  `{domain}.api.ts`와 `{domain}.query.ts`로 감싸고 OpenAPI 생성 타입을 기준으로 한다.
- 공용 fetcher는 기본 `ENV.baseUrl`, `credentials: 'include'`, JSON body를 사용한다.
  인증은 bearer token을 직접 보관하는 구조가 아니라 서버 세션 쿠키에 의존한다.
- 실패 응답은 `ApiError(status, message, rawBody)`다. 호출부가 axios 전용 shape인
  `error.response.status`를 전제하면 동작하지 않는다.
- GET query는 값의 `toString()` 결과가 truthy인 항목만 직렬화한다. 배열은 쉼표 문자열이
  되며 빈 문자열·`undefined`는 사라진다. 다른 계약이 필요하면 모든 소비 API를 확인한다.
- `shared/src/core/apis/generated/`, `openapi.d.ts`, `routeTree.gen.ts`는 생성물이다.
  직접 수정하지 않고 generator와 API spec을 통해 갱신한다.

## 서버 상태와 오류 처리

- 서버 상태는 TanStack Query가 담당한다. query factory를 사용하고 mutation은 커스텀
  훅으로 분리한다. mutation 후 관련 목록·상세·사용자 queryKey를 모두 무효화해야 한다.
- `web`은 일반 네트워크/서버 오류를 최대 3회 재시도하지만 401은 재시도하지 않는다.
  mutation은 중복 실행을 막기 위해 재시도하지 않는다.
- `web`은 일부 비로그인 정상 쿼리의 401을 무시한다. 그 외 쿼리에서 로그인 profile
  cache가 있는데 401이 나면 reload한다. queryKey나 profile cache 변경 시 새로고침 루프와
  오류 수집 누락을 함께 확인한다.
- `admin`은 query 재시도 1회와 `refetchOnWindowFocus: false`, `maeil-mail`은 401 무재시도와
  일반 오류 최대 3회 정책이다. 캐시·재시도 정책은 워크스페이스별로 다르다.

## web 라우팅·인증

- TanStack Router file-based routing을 사용한다. 루트는 QueryClient·theme·`AuthProvider`를
  제공하고 WebView 인증/라우팅 listener와 분석 도구를 초기화한다.
- `/_bombom` layout은 프로세스 전역 `isFirstVisit`에서 최초 한 번만 user profile을
  확인한다. 실패 시 `/`가 아닌 첫 진입 경로를 `/`로 돌린다. route별 상시 인증 guard가
  아니며 같은 SPA 세션의 이후 이동은 재검증하지 않는다.
- 브라우저 로그인은 서버 OAuth 엔드포인트로 이동한다. 앱 로그인은 WebView 메시지로
  native credential을 받아 `/auth/login/{provider}/native`를 호출한다.

## WebView 양방향 계약 (`web` ↔ `app`)

메시지 계약은 `shared/src/core/webview.ts`의 `WebToRNMessage`와 `RNToWebMessage`다.
메시지 type·payload 변경 시 송신자와 수신자를 함께 본다. 한쪽만 바꾸면 런타임에서
메시지가 조용히 무시될 수 있다.

- `web → app`: 로그인 화면/결과, 외부 브라우저, device UUID, 알림 권한/설정, FCM 등록,
  이미지 저장 요청.
- `app → web`: Google/Apple credential, 알림 목적지 URL, device UUID, 알림 권한 결과.
- 웹은 브라우저 단독 실행도 지원한다. `window.ReactNativeWebView?.postMessage` optional
  접근과 `isWebView()` guard를 제거하면 일반 브라우저에서 오류가 난다.
- 앱 `MainScreen`은 `ENV.webUrl`을 로드하고 message switch를 실행한다. 공유 cookie와 DOM
  storage도 로그인·탐색 계약의 일부다.
- 로그인 성공 후 웹은 미가입 사용자를 `/signup`으로 보내고 가입 사용자는 reload한다.
  app은 overlay를 닫을 뿐 별도 인증 상태를 저장하지 않는다.

## app 기기·푸시 계약

- device UUID는 SecureStore에, FCM 등록용 memberId는 AsyncStorage에 저장한다. web의
  `REGISTER_FCM_TOKEN` 메시지가 memberId/deviceUuid/token을 연결한다.
- FCM 등록은 동시 중복을 막고 권한·세 값이 모두 있을 때만 서버에 올린다. token refresh도
  같은 경로를 사용한다.
- 알림 클릭은 cold start/background/foreground 세 경로 모두 `NOTIFICATION_ROUTING`으로
  합쳐진다. 현재 `ARTICLE`(`/articles/{articleId}`)과 `EVENT`(`/event`)만 지원한다.
- listener는 WebView `onLoadEnd` 후 등록되고 다음 load/unmount에서 해제된다. listener 추가
  시 cleanup 누락과 WebView 준비 전 메시지 유실을 확인한다.
- 강제 업데이트 판정이 끝날 때까지 WebView를 렌더하지 않는다. 이 경로의 실패는 앱 진입
  전체를 막을 수 있다.

## admin·maeil-mail 경계

- admin의 `/_admin` layout은 회원 목록 API를 probe해 403일 때만 `/403`으로 보낸다.
  이를 완전한 로그인 guard로 과대 해석하지 않는다.
- admin 일부 도구는 GitHub API·Lambda·Supabase 같은 별도 외부 계약을 쓴다. 직접 `fetch`가
  보여도 기존 adapter와 base URL을 먼저 확인한다.
- Supabase는 reviewer 화면의 첫 사용 시 lazy 초기화한다. 환경변수 누락이 admin 전체
  장애가 되지 않도록 한 계약이므로 eager 초기화로 바꾸지 않는다.
- `maeil-mail`은 `web` route가 아니라 별도 앱이다. route tree·QueryClient·환경변수·MSW를
  자체 소유한다. API shape 변경 시 `web`의 매일메일 소비처도 함께 검색한다.

## AI 리뷰 시 고신호 확인 지점

- `shared` 계약 변경 뒤 각 워크스페이스 소비처 누락.
- WebView 메시지 송수신 한쪽만 변경하거나 일반 브라우저 guard 제거.
- cookie 인증, 최초 방문 profile probe, 401 처리의 실제 전제를 깨는 변경.
- mutation invalidation 누락, 워크스페이스별 캐시 정책 혼동, axios 오류 shape 전제.
- FCM identity 연결, 알림 type→web route mapping, listener cleanup 누락.
- 신규 route의 layout/guard 위치와 생성 route tree 수동 수정.
- admin 외부 연동을 공용 API로 오인하거나 optional 의존성을 admin 전체 장애로 확대.

## 리뷰어가 자주 확인할 파일

| 파일 | 확인 이유 |
| --- | --- |
| `shared/src/core/apis/fetcher.ts` | cookie·오류·query 직렬화 공용 계약 |
| `shared/src/core/webview.ts` | web/app 양방향 메시지 타입 |
| `web/src/main.tsx` | QueryClient 재시도·401·오류 수집 정책 |
| `web/src/routes/_bombom.tsx` | 최초 방문 profile 확인과 redirect |
| `web/src/libs/webview/` | WebView 인증·routing·device/FCM 송신 |
| `app/components/main/MainScreen.tsx` | WebView message 수신과 앱 진입 gate |
| `app/hooks/useNotification.ts` | FCM 등록·수신·listener lifecycle |
| `admin/src/routes/_admin.tsx` | admin 접근 probe |
| `admin/src/lib/supabase.ts` | reviewer 기능의 optional 외부 의존성 |
