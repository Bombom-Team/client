# CONVENTIONS.md

BomBom 저장소에서 AI와 사람이 코드를 작성·리뷰할 때 따르는 **코드 컨벤션의 원본(SSOT)**입니다.
코드를 변경하거나 리뷰하기 전에 이 문서 전체를 읽습니다.

| 도구 | 이 문서를 읽는 방식 |
| --- | --- |
| Claude Code | [CLAUDE.md](../CLAUDE.md)가 `@.ai/CONVENTIONS.md`로 import |
| Gemini CLI | [GEMINI.md](../GEMINI.md)가 `@.ai/CONVENTIONS.md`로 import |
| Codex | [AGENTS.md](AGENTS.md)의 Start here 지시에 따라 직접 읽음 |
| CodeRabbit | `.coderabbit.yaml`의 `knowledge_base` |

AI 행동 규칙(작업 범위, 검증, 생성 파일)은 [AGENTS.md](AGENTS.md)에 있습니다.

---

## 모든 workspace 공통 작업 원칙

### 공통 컴포넌트 우선 사용

UI를 새로 만들기 전에 해당 workspace의 공통 컴포넌트에서 쓸 수 있는 것을 먼저 찾습니다.
비슷한 컴포넌트를 복제하지 않고, 기존 컴포넌트로 표현할 수 없을 때만 새로 만듭니다.
새로 만들 때는 [파일·폴더 배치 규칙](#파일폴더-배치-규칙)에 따라 재사용 범위에 맞게 둡니다.

| workspace | 공통 컴포넌트 위치 | 사용 방식 |
| --- | --- | --- |
| `web/` | `web/src/components/` | `shared/src/ui-web`을 재-export하는 컴포넌트·훅·유틸도 web의 재-export 경로(`@/components/...`, `@/hooks/...`, `@/utils/...`)로 import합니다 |
| `maeil-mail/` | `@bombom/shared/ui-web`, `maeil-mail/src/components/` | shared 컴포넌트를 직접 import합니다 |
| `admin/` | `admin/src/components/` | `@bombom/shared/ui-web`을 사용하지 않는 별도 구성입니다 |
| `app/` | `app/components/` | `@bombom/shared/ui-web`은 웹 전용이라 lint가 import를 막습니다 |

여러 웹 workspace에서 함께 쓰는 UI는 `shared/src/ui-web`에 둡니다. shared 컴포넌트를
바꾸면 이를 import하는 모든 workspace를 함께 확인합니다.

### 디자인 토큰 사용

theme에 토큰이 정의된 값은 직접 쓰지 않고 토큰을 사용합니다. 어떤 토큰이 있는지는 아래 theme
원본을 직접 읽습니다.

| workspace | theme 원본 |
| --- | --- |
| `web/`, `app/` | `shared/src/core/theme.ts` (`@bombom/shared/theme`) |
| `maeil-mail/` | `maeil-mail/src/styles/theme.ts` (shared theme에 매일메일 색상을 확장) |
| `admin/` | `admin/src/styles/theme.ts` (별도 theme) |

- 토큰이 없는 값(예: `box-shadow` 색상, `1px` 선 두께)만 직접 값을 사용합니다. 기존 토큰과
  같거나 거의 같은 값을 새로 하드코딩하지 않습니다.
- workspace 전용 색상이 필요하면 하드코딩하지 않고 해당 workspace theme에 추가합니다.
  `shared/src/core/theme.ts`를 바꾸면 web·app·maeil-mail 모두에 영향을 줍니다.
- 웹 styled component에서의 접근 방식은 [Theme 사용 규칙](#theme-사용-규칙)을 따릅니다.

### app 네이티브 설정과 prebuild

`app/`은 Expo 기반의 WebView 앱입니다. 웹 화면과 대부분의 사용자 기능은 WebView로
제공하고, React Native code는 WebView와 OS 기능을 연결하는 최소한의 역할만 맡습니다.

`app/ios/`와 `app/android/`는 커밋하지 않는 생성물입니다(`.gitignore`). `app/package.json`의
script 중 `expo prebuild --clean`이나 `eas build`를 포함하는 명령, 그리고 native 폴더가 없을 때의
`expo run:*`이 `app.config.ts`와 config plugin을 기준으로 두 폴더를 다시 생성합니다. 두 폴더를
직접 수정한 내용은 이때 사라집니다.

따라서 native 설정은 다음 순서로 변경합니다.

1. `app/app.config.ts`로 표현합니다. 같은 종류의 설정이 이미 있는 위치를 먼저 찾고, 라이브러리의
   native 설정은 해당 Expo config plugin의 옵션으로 지정합니다.
2. `app.config.ts`로 표현할 수 없으면 `app/plugins/`에 config plugin을 작성하고
   `app.config.ts`의 `plugins` 배열에 등록합니다. `app/plugins/`에 파일이 있어도 `plugins`
   배열에 없으면 적용되지 않으므로, 기존 plugin의 적용 여부는 `plugins` 배열로 확인합니다.
3. 이 두 방법으로 해결할 수 없는 OS 연동만 React Native 또는 native code를 추가로
   수정합니다. 이 경우에도 재생성 후 보존할 방법을 함께 확인합니다.

`app.config.ts`, config plugin, native module 의존성을 바꾸면 JS reload로는 반영되지 않습니다.
prebuild와 native build(development client 포함)를 다시 해야 합니다. plugin이 적용된 config는
`pnpm --filter app exec expo config --type prebuild`로 확인할 수 있습니다. 이 명령은 native
파일을 생성하지 않으므로, 실제 생성 결과는 prebuild 후 `ios/`·`android/`에서 확인합니다.
React Native JS code(`app/app/`, `app/components/` 등)는 prebuild의 영향을 받지 않습니다.

---

## Frontend coding standards

프론트엔드 코드를 일관된 스타일과 구조로 작성하기 위한 코딩 컨벤션입니다.
코드 작성 및 리뷰 시, 아래 기준을 공통으로 따릅니다.

### 적용 범위

이 절은 `web/`, `admin/`, `maeil-mail/`의 React·Emotion UI code 규칙입니다.
`app/`의 React Native code에는 자동으로 적용하지 않습니다. `app/` 작업은
app/AGENTS.md와 가장 가까운 기존 code pattern을 먼저 따릅니다.

규칙은 `web/` 코드의 실제 준수율을 기준으로 정리했습니다(2026-10-18 측정,
[처리표](../docs/ai-conventions-inventory.md#6-컨벤션-실측-결과)). `admin/`·`maeil-mail/`에서
같은 영역의 인접 code가 이 절과 다르면, 다른 점을 확인한 뒤 인접 code를 따릅니다.

다른 문서에서 이 규칙을 인용할 때는 절 번호 대신 절 제목 링크를 사용합니다.

---

### 함수 선언 규칙

- 컴포넌트, 훅, 유틸 함수는 **모두 화살표 함수로 작성**합니다.
- 예외: route 파일은 `export const Route = createFileRoute(...)({ component: X })`를
  파일 상단에 두고 그 아래에 컴포넌트를 선언합니다. 선언보다 먼저 참조하므로
  hoisting되는 `function X()` 선언을 사용합니다. TanStack Router의 제약이 아니라
  선언 순서에 따른 선택입니다.

```tsx
// 권장
const ChallengeCard = () => {};

// routes 파일
export const Route = createFileRoute('/_bombom/_main/memo')({
  component: MemoPage,
});

function MemoPage() {
  return <Container />;
}
```

---

### 파일·폴더 배치 규칙

컴포넌트, 훅, 유틸 함수, 상수는 **재사용 범위를 기준으로 가장 가까운 위치에 배치**합니다.

- 컴포넌트 전용
  - 유틸 / 상수: 한 컴포넌트에서만 사용한다면 해당 파일 상단에 선언합니다.
- 페이지 전용
  - 페이지 본체는 route 파일(`src/routes/**`)에 작성합니다.
  - 페이지 전용 부품은 `pages/{page}/` 아래의 `components/`, `hooks/`, `constants/`,
    `types/`, `utils/`에 둡니다. `pages/{page}/` 바로 아래에는 파일을 두지 않습니다.
- 여러 페이지에서 공용
  - 컴포넌트: `src/components/{Name}/{Name}.tsx`
  - 훅: `src/hooks/`
  - 유틸 / 상수: `src/utils/`, `src/constants/`
- 여러 워크스페이스에서 공용
  - `shared` 워크스페이스에 배치합니다.
- 재사용 범위가 불분명한 경우, 우선 페이지 내부에 배치합니다.

파일 이름:

- 컴포넌트 파일은 PascalCase이며, 파일 이름과 `export default` 이름을 같게 합니다.
- `hooks/` 폴더의 파일은 `use*.ts`이며 JSX를 포함하지 않습니다. 파일 하나에 훅 하나만 두고,
  파일 이름과 훅 이름을 같게 합니다.
- 폴더 이름은 `components/` 아래는 PascalCase, `pages/` 아래는 kebab-case, `apis/{domain}`은
  camelCase입니다. `utils/`·`constants/`·`types/` 아래 파일 이름은 camelCase입니다.
- Skeleton 컴포넌트는 `{X}Skeleton.tsx`로 원본 컴포넌트 `X`와 같은 폴더에 둡니다.
- `index.ts` barrel 파일을 만들지 않습니다.

import 경로:

- 같은 기능 루트(`pages/{page}`, `components/{Name}`, `apis/{domain}`) 안에서는
  상대경로(`./`, `../`)를, 루트 밖은 `@/`를 사용합니다.
- public asset은 `#/`로 import합니다. SVG는
  `import XxxIcon from '#/assets/svg/kebab-name.svg'` 형식입니다.

---

### export 규칙

- 컴포넌트는 반드시 `export default`로 내보냅니다.
- 훅과 유틸 함수는 `export const` 형태로 내보냅니다.
- 컴포넌트를 named export로 내보내지 않습니다.
- 예외: route 파일은 `export const Route`만 내보내고 페이지 컴포넌트는 export하지
  않습니다. TanStack Router의 라우트 export 경고를 정리하면서 default export를
  제거했습니다(#220).

---

### 컴포넌트 파일 구성 순서

컴포넌트 파일은 아래 순서를 반드시 따릅니다.

1. 컴포넌트 선언
2. `export default`
3. emotion styled component 정의

```tsx
const ChallengeCard = () => {
  return <Container />;
};

export default ChallengeCard;

const Container = styled.div``;
```

---

### 컴포넌트 작성 규칙

- 기본 원칙은 1파일 1컴포넌트입니다.
- 단, 항상 함께 사용되는 조합(composition) 컴포넌트는 예외로 허용합니다.
- props는 함수 시그니처에서 구조분해합니다.
- props interface는 컴포넌트 선언 위에 두고 export하지 않습니다.
- children을 받는 컴포넌트는 `PropsWithChildren<{Component}Props>`로 타입을 지정합니다.
- 한쪽만 렌더링하는 조건은 `cond && <X />`로 씁니다. `cond ? <X /> : null`은 쓰지 않습니다.
- 컴포넌트와 훅은 각각 하나의 역할만 담당합니다. 데이터 조회·상태 관리용 훅이
  화면 표시용 문자열 가공이나 UI 분기까지 맡지 않게 합니다. 표시 포맷 전용 훅처럼
  그 역할을 위해 만든 훅은 예외입니다.
- Modal은 부모가 `useModal()`로 `modalRef`, `isOpen`, `openModal`, `closeModal`을
  만들고 `@/components/Modal/Modal`에 전달합니다. `XxxModal` 래퍼는 이 값을 props로
  받습니다.

```tsx
// 허용
const Card = () => {};
const CardHeader = () => {};
const CardBody = () => {};

// 지양
const UserCard = () => {};
const ProductCard = () => {};
```

---

### Component documentation / Storybook

- 디자인 시스템 공통 컴포넌트는 `shared/src/ui-web`에서 관리합니다.
- Storybook을 사용하는 workspace에서는 디자인 시스템 공통 컴포넌트에만 Storybook story를 작성합니다.
- 각 workspace의 `src/components`에 있는 페이지·기능 전용 컴포넌트와 단순 재사용 또는 분리 목적의 컴포넌트는 Storybook 관리 대상이 아닙니다.

---

### Styled Component 규칙

- 컴포넌트를 감싸는 최상위 styled component는 항상 `Container`로 네이밍합니다.
- 하위 styled component는 역할을 나타내는 이름을 사용합니다. 예: `ContentWrapper`,
  `Title`, `ActionButton`.
- JSX에는 raw HTML 태그 대신 styled component를 사용합니다. `br`, `strong` 같은 inline
  요소는 예외입니다.
- styled prop 이름에 `$` 접두사를 붙이지 않고, prop 타입은 inline generic으로 선언합니다.
- `css` prop과 `css` helper를 사용하지 않습니다. 정적 스타일을 inline `style`로 지정하지
  않습니다.

```tsx
const Container = styled.div<{ isPC: boolean }>`
  padding: ${({ isPC }) => (isPC ? '20px' : '12px')};
`;
```

---

### Theme 사용 규칙

- 색상은 `theme.colors`를 사용합니다. 토큰이 없는 `box-shadow` 색상은 예외입니다.
- 글꼴은 `font: ${({ theme }) => theme.fonts.*}`로 지정하고 `font-size`를 직접 쓰지
  않습니다. 같은 선언 블록에서 `font-weight`·`line-height`를 다시 지정하지 않고, 필요한 굵기는
  theme의 굵기별 토큰으로 고릅니다.
- z-index는 `theme.zIndex`를 사용합니다.
- styled template 안에서는 `${({ theme }) => ...}`로 theme에 접근합니다. import한
  `theme` 객체는 JSX prop에 값을 넘길 때만 사용합니다.
- 크기는 4의 단위로 사용합니다. 예: `4px`, `8px`, `12px`. `1px`, `2px` 같은 선 두께는
  예외입니다.

---

### API 호출 및 데이터 처리

- API 호출은 공용 fetcher를 사용합니다.
- 요청 / 응답 타입은 OpenAPI로 생성된 타입을 기준으로 합니다.
- 예외: OpenAPI spec 밖의 외부 계약(admin의 GitHub API·Lambda·Supabase adapter 등)은
  해당 adapter를 사용합니다([architecture.md](../docs/architecture.md#adminmaeil-mail-경계)).
- API 파일은 도메인 단위로 관리합니다.

```txt
src/apis/{domain}/
 ├─ domain.api.ts
 └─ domain.query.ts
```

- API 함수 이름의 접두사는 HTTP method(`get`, `post`, `put`, `patch`, `delete`)입니다.
- 요청·응답 타입은 같은 `*.api.ts`에서 `{Fn}Params`, `{Fn}Response`로 export하고,
  `fetcher` 호출에 응답 타입을 generic으로 명시합니다.
- `apis/` 밖에서는 `@/types/openapi`를 직접 import하지 않고 `*.api.ts`가 export한 타입을
  사용합니다. 스키마 단위 타입이 필요하면 해당 페이지의 `types/`에 alias를 둡니다.

- 참고 구현: `web/src/apis/challenge/challenge.api.ts`, `challenge.query.ts`,
  `web/src/pages/challenge/review/hooks/useAddReviewMutation.ts`. 예시 코드를 문서에 복사하지 않고
  참고 구현을 직접 읽습니다.

---

### 상태 관리 원칙

- 서버 상태
  - 서버 상태는 TanStack Query로 관리합니다.
- 로컬 상태
  - 로컬 상태는 입력값, 토글, 모달 등 UI 전용 상태에만 사용합니다.
- Mutation UX
  - 사용자가 결과를 기다리는 mutation(제출, 생성, 삭제 등)에는 진행·실패 피드백을
    포함합니다. 실패 피드백은 `toast.error`를 사용합니다.

---

### TanStack Query 사용 규칙

#### useQuery

- `useQuery`는 query factory를 통해서만 사용합니다. `queries.*`가 기본이며,
  shared generated API의 `*Queries`도 factory로 봅니다.
- 컴포넌트 내부에서 `queryKey`·`queryFn`을 inline으로 선언하지 않습니다.
- 조회는 `useQuery`(`useInfiniteQuery`)가 기본입니다. `useSuspenseQuery` 계열은 상위에
  `Suspense` 경계(fallback으로 Skeleton 등)를 둘 때만 사용합니다.

#### Query factory

- `{domain}.query.ts`는 `export const {domain}Queries = { ... }`를 export하고,
  `apis/queries.ts`에 `...{domain}Queries`로 등록합니다.
- 각 항목은 `name: (args) => queryOptions({ queryKey, queryFn })` 형식이며, 무한
  스크롤은 `infiniteQueryOptions`를 사용합니다. 항목 이름은 `get` 없는 명사형입니다.
- factory 인자는 모두 `queryKey`에 포함합니다.
- `queryKey`의 첫 요소는 해당 API path의 첫 segment입니다. 예: `/challenges/...` → `'challenges'`.
- 하위 key를 한 번에 무효화해야 하면 `all: (id) => [...] as const`를 두고 하위 항목이
  이를 확장합니다.
- `invalidateQueries`, `setQueryData` 등에 넘기는 key는 factory에서 얻습니다
  (`queries.x(...).queryKey`, `queries.x.all(...)`). 리터럴 배열을 직접 쓰지 않습니다.

#### useMutation

- `useMutation`은 반드시 커스텀 훅으로 분리하고, 훅은 `hooks/`에 둡니다.
- 훅 이름은 `use{...}Mutation` 형식입니다.
- 훅은 `return useMutation({ mutationFn, onSuccess, onError })`를 그대로 반환합니다.
- mutation은 `mutate`로 실행합니다. `mutateAsync`를 try/catch로 감싸지 않고 결과 처리는
  `onSuccess`·`onError`에 둡니다.
- mutation 성공 후 캐시 갱신(`invalidateQueries`, `setQueryData` 등)은 mutation 훅의 콜백이나
  `apis/{domain}/{domain}.cache.ts` helper에서 합니다. 컴포넌트에서 직접 하지 않습니다.

---

### Effect와 참조 안정성

- `useEffect`·`useMemo`·`useCallback`의 의존성 배열에는 내부에서 사용하는 값과 함수를
  모두 포함합니다(`react-hooks/exhaustive-deps`).
- effect에서 event listener, timer, observer를 만들면 정리하는 cleanup 함수를 반환합니다.
- 커스텀 훅이 반환하는 함수는 `useCallback`으로, 반환하는 객체·배열·계산값은 `useMemo`로
  감쌉니다. 훅을 쓰는 쪽의 의존성 배열과 메모이제이션이 깨지지 않게 하기 위함입니다.
  컴포넌트 내부의 메모이제이션은 필요할 때만 사용합니다.

---

### 네이밍 규칙

#### 이벤트 핸들러

- props로 전달되는 콜백: `on-`
  - `onClose`, `onSubmit`
- 컴포넌트 내부 이벤트 핸들러: `handle-`
  - `handleClick`, `handleModalClose`

#### 변수와 함수

- 컴포넌트·훅이 아닌 함수는 동사로 시작합니다. 예: `getX`, `formatX`, `createX`, `isX`.
- boolean 지역 변수와 boolean을 반환하는 판별 함수는 `is`·`has`·`can`·`should`로 시작합니다.
- `useRef` 변수 이름은 `xxxRef`입니다.
- 배열 변수 이름은 복수형이거나 `List` suffix를 붙입니다.

#### 타입

- 직접 작성하는 객체 타입은 `interface`로 선언합니다. OpenAPI 생성 타입에서 파생하거나
  union·intersection처럼 `interface`로 표현할 수 없을 때만 `type`을 씁니다.
- 컴포넌트 props 타입 이름은 `{Component}Props`입니다.
- 함수 / 훅 파라미터 타입: `Params` suffix. 훅 파라미터 타입은 `Use{Hook}Params`이고, 그 안의
  콜백 이름은 `on*`입니다.
- 타입 이름에 `Type` suffix를 붙이지 않습니다.

```ts
interface ChallengeCardProps {}
interface UseChallengeListParams {}
type GetChallengesParams = operations['getChallenges']['parameters']['query'];
```

#### 상수와 훅 반환값

- 모듈 최상위 상수(원시값·객체·배열)와 `constants/` 폴더의 export는 UPPER_SNAKE_CASE를
  사용합니다. styled component에 넘기는 device·variant별 style map은 예외입니다.
- `enum` 대신 union literal 타입을 사용합니다.
- 여러 값을 반환하는 훅은 객체를 반환합니다. `useState`를 대체하는 훅만 튜플을
  반환합니다.

#### 분석 이벤트

- `trackEvent`의 `category`는 PascalCase 영문 도메인 이름(`'Newsletter'`, `'Memo'`),
  `action`은 한국어 동작 설명(`'구독하기 버튼 클릭'`)입니다.

---

### Route 규칙

- 화면을 렌더링하는 route는 자신 또는 상위 layout route의 `head`에서
  `title: '봄봄 | {화면명}'`을 지정합니다.
- 로그인이 필요한 화면은 `head`에 robots `noindex` meta를 둡니다.

---

### 공통 유틸 사용

- localStorage·sessionStorage는 `@/utils/localStorage`의 `createStorage`,
  `@/utils/sessionStorage`의 `createSessionStorage`, 또는 `useLocalStorageState`·
  `useSessionStorageState`로만 접근합니다.
- 날짜를 표시 문자열로 바꿀 때는 `@/utils/date`의 함수를 사용합니다. 날짜 라이브러리를
  새로 도입하지 않습니다.
- 코드에서 외부 URL을 열 때는 `openExternalLink`를 사용하고 `window.open`을 직접 호출하지
  않습니다.
- Promise는 `async`/`await`로 처리하고 `.then` 체인을 쓰지 않습니다.
- 문자열을 숫자로 바꿀 때는 `Number()`를 사용합니다. CSS 값 파싱은 예외입니다.

---

### 타입 안전성

- `as any`를 사용하지 않습니다.

---

### 테스트

- 테스트 파일은 대상 파일 옆에 `{name}.test.ts(x)`로 둡니다.
- Jest의 `describe`/`it`을 사용하고, 설명은 "~하면 ~한다" 형태의 한국어로 씁니다.

---

### 코드 스타일 & 품질 기준

- ESLint / Stylelint 기준을 만족하는 상태를 유지합니다.
  - `lint` script와 PR CI가 Stylelint를 실행하는지는 workspace `package.json`의 `scripts`와
    `.github/workflows/`를 읽어 확인합니다. Stylelint가 포함되지 않았다면 스타일 변경 시
    Stylelint 결과를 따로 확인합니다.
- 코드 스타일은 개인 취향이 아닌 공통 규칙을 따릅니다.
- import 순서는 workspace ESLint 설정(`web/.eslintrc.cjs` 등)의 `import/order`를 따릅니다.
  순서를 직접 판단하지 않고 lint 결과를 따릅니다.

---

### Responsive UI

- mobile·tablet·pc에 따라 기능 또는 UI를 다르게 처리할 때는 `useDevice()`의
  `device` 값을 기준으로 분기합니다. JavaScript logic과 styled component 모두에
  적용합니다.
- JavaScript device 판단이 필요한 UI를 CSS `@media`로 직접 분기하지 않습니다.
  JavaScript와 CSS의 breakpoint가 달라질 수 있으므로, styled component에는
  `device` 또는 파생 boolean을 prop으로 전달합니다.
- 단순한 외부 container hide처럼 prop 전달이 불필요하게 복잡해지는 경우에는
  `@media`를 사용할 수 있습니다.

  ```tsx
  // ❌ @media 직접 분기
  const Box = styled.div`
    padding: 20px;
    @media (max-width: 1024px) {
      padding: 12px;
    }
  `;

  // ✅ useDevice + styled prop
  const Component = () => {
    const device = useDevice();
    const isMobile = device !== 'pc';
    return <Box isMobile={isMobile} />;
  };
  const Box = styled.div<{ isMobile: boolean }>`
    padding: ${({ isMobile }) => (isMobile ? '12px' : '20px')};
  `;
  ```

- device 분기가 필요한 컴포넌트는 `useDevice()`를 직접 호출합니다. `device`나 파생 boolean을
  React 컴포넌트의 props로 내려보내지 않습니다. styled component prop으로 넘기는 것은 허용합니다.
- `device !== 'pc'`(mobile + tablet)는 `isMobile`, `device === 'pc'`는 `isPC`로
  이름을 정합니다. `isCompact`처럼 다른 의미로 해석될 수 있는 이름은 사용하지
  않습니다.
