# Frontend Coding Standards

이 문서는 프론트엔드 개발자들이  
일관된 코드 스타일과 구조로 개발하기 위한 코딩 컨벤션을 정리한 문서입니다.

코드 작성 및 리뷰 시, 아래 기준을 공통으로 따릅니다.

## 적용 범위

이 문서는 `web/`, `admin/`, `maeil-mail/`의 React·Emotion UI code 규칙입니다.
`app/`의 React Native code에는 자동으로 적용하지 않습니다. `app/` 작업은
app/AGENTS.md와 가장 가까운 기존 code pattern을 먼저 따릅니다.

규칙은 `web/` 코드의 실제 준수율을 기준으로 정리했습니다(2026-10-18 측정,
[처리표](ai-conventions-inventory.md#6-컨벤션-실측-결과)). `admin/`·`maeil-mail/`에서
같은 영역의 인접 code가 이 문서와 다르면, 다른 점을 확인한 뒤 인접 code를 따릅니다.

다른 문서에서 이 문서를 인용할 때는 절 번호 대신 절 제목 링크를 사용합니다.

---

## 함수 선언 규칙

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

## 파일·폴더 배치 규칙

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
- `hooks/` 폴더의 파일은 `use*.ts`이며 JSX를 포함하지 않습니다.
- Skeleton 컴포넌트는 `{X}Skeleton.tsx`로 원본 컴포넌트 `X`와 같은 폴더에 둡니다.
- `index.ts` barrel 파일을 만들지 않습니다.

import 경로:

- 같은 기능 루트(`pages/{page}`, `components/{Name}`, `apis/{domain}`) 안에서는
  상대경로(`./`, `../`)를, 루트 밖은 `@/`를 사용합니다.
- public asset은 `#/`로 import합니다. SVG는
  `import XxxIcon from '#/assets/svg/kebab-name.svg'` 형식입니다.

---

## export 규칙

- 컴포넌트는 반드시 `export default`로 내보냅니다.
- 훅과 유틸 함수는 `export const` 형태로 내보냅니다.
- 컴포넌트를 named export로 내보내지 않습니다.
- 예외: route 파일은 `export const Route`만 내보내고 페이지 컴포넌트는 export하지
  않습니다. TanStack Router의 라우트 export 경고를 정리하면서 default export를
  제거했습니다(#220).

---

## 컴포넌트 파일 구성 순서

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

## 컴포넌트 작성 규칙

- 기본 원칙은 1파일 1컴포넌트입니다.
- 단, 항상 함께 사용되는 조합(composition) 컴포넌트는 예외로 허용합니다.
- props는 함수 시그니처에서 구조분해합니다.
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

## Component documentation / Storybook

- 디자인 시스템 공통 컴포넌트는 `shared/src/ui-web`에서 관리합니다.
- Storybook을 사용하는 workspace에서는 디자인 시스템 공통 컴포넌트에만 Storybook story를 작성합니다.
- 각 workspace의 `src/components`에 있는 페이지·기능 전용 컴포넌트와 단순 재사용 또는 분리 목적의 컴포넌트는 Storybook 관리 대상이 아닙니다.

---

## Styled Component 규칙

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

## Theme 사용 규칙

- 색상은 `theme.colors`를 사용합니다. 토큰이 없는 `box-shadow` 색상은 예외입니다.
- 글꼴은 `font: ${({ theme }) => theme.fonts.*}`로 지정하고 `font-size`를 직접 쓰지
  않습니다.
- z-index는 `theme.zIndex`를 사용합니다.
- styled template 안에서는 `${({ theme }) => ...}`로 theme에 접근합니다. import한
  `theme` 객체는 JSX prop에 값을 넘길 때만 사용합니다.
- 크기는 4의 단위로 사용합니다. 예: `4px`, `8px`, `12px`. `1px`, `2px` 같은 선 두께는
  예외입니다.

---

## API 호출 및 데이터 처리

- API 호출은 공용 fetcher를 사용합니다.
- 요청 / 응답 타입은 OpenAPI로 생성된 타입을 기준으로 합니다.
- 예외: OpenAPI spec 밖의 외부 계약(admin의 GitHub API·Lambda·Supabase adapter 등)은
  해당 adapter를 사용합니다([architecture.md](architecture.md#adminmaeil-mail-경계)).
- API 파일은 도메인 단위로 관리합니다.

```txt
src/apis/{domain}/
 ├─ domain.api.ts
 └─ domain.query.ts
```

- API 함수 이름의 접두사는 HTTP method(`get`, `post`, `put`, `patch`, `delete`)입니다.
- 요청·응답 타입은 같은 `*.api.ts`에서 `{Fn}Params`, `{Fn}Response`로 export하고,
  `fetcher` 호출에 응답 타입을 generic으로 명시합니다.

```ts
export type GetChallengeEligibilityResponse =
  components['schemas']['ChallengeEligibilityResponse'];

export const getChallengeEligibility = async (challengeId: number) => {
  return await fetcher.get<GetChallengeEligibilityResponse>({
    path: `/challenges/${challengeId}/eligibility`,
  });
};
```

---

## 상태 관리 원칙

- 서버 상태
  - 서버 상태는 TanStack Query로 관리합니다.
- 로컬 상태
  - 로컬 상태는 입력값, 토글, 모달 등 UI 전용 상태에만 사용합니다.
- Mutation UX
  - 사용자가 결과를 기다리는 mutation(제출, 생성, 삭제 등)에는 진행·실패 피드백을
    포함합니다. 실패 피드백은 `toast.error`를 사용합니다.

---

## TanStack Query 사용 규칙

### useQuery

- `useQuery`는 query factory를 통해서만 사용합니다. `queries.*`가 기본이며,
  shared generated API의 `*Queries`도 factory로 봅니다.
- 컴포넌트 내부에서 `queryKey`·`queryFn`을 inline으로 선언하지 않습니다.

### Query factory

- `{domain}.query.ts`는 `export const {domain}Queries = { ... }`를 export하고,
  `apis/queries.ts`에 `...{domain}Queries`로 등록합니다.
- 각 항목은 `name: (args) => queryOptions({ queryKey, queryFn })` 형식이며, 무한
  스크롤은 `infiniteQueryOptions`를 사용합니다. 항목 이름은 `get` 없는 명사형입니다.
- factory 인자는 모두 `queryKey`에 포함합니다.
- 하위 key를 한 번에 무효화해야 하면 `all: (id) => [...] as const`를 두고 하위 항목이
  이를 확장합니다.
- `invalidateQueries`, `setQueryData` 등에 넘기는 key는 factory에서 얻습니다
  (`queries.x(...).queryKey`, `queries.x.all(...)`). 리터럴 배열을 직접 쓰지 않습니다.

### useMutation

- `useMutation`은 반드시 커스텀 훅으로 분리하고, 훅은 `hooks/`에 둡니다.
- 훅 이름은 `use{...}Mutation` 형식입니다.
- 훅은 `return useMutation({ mutationFn, onSuccess, onError })`를 그대로 반환합니다.

---

## Effect와 참조 안정성

- `useEffect`·`useMemo`·`useCallback`의 의존성 배열에는 내부에서 사용하는 값과 함수를
  모두 포함합니다(`react-hooks/exhaustive-deps`).
- 커스텀 훅이 반환하는 함수는 `useCallback`으로, 반환하는 객체·배열·계산값은 `useMemo`로
  감쌉니다. 훅을 쓰는 쪽의 의존성 배열과 메모이제이션이 깨지지 않게 하기 위함입니다.
  컴포넌트 내부의 메모이제이션은 필요할 때만 사용합니다.

---

## 네이밍 규칙

### 이벤트 핸들러

- props로 전달되는 콜백: `on-`
  - `onClose`, `onSubmit`
- 컴포넌트 내부 이벤트 핸들러: `handle-`
  - `handleClick`, `handleModalClose`

### 타입

- 컴포넌트 props는 TypeScript interface로 선언하고, 이름에 `Props` suffix를 사용합니다.
- 함수 / 훅 파라미터 타입: `Params` suffix

```ts
interface ChallengeCardProps {}
type FetchChallengeParams = {};
```

### 상수와 훅 반환값

- 모듈 최상위 원시값 상수와 `constants/` 폴더의 export는 UPPER_SNAKE_CASE를 사용합니다.
- `enum` 대신 union literal 타입을 사용합니다.
- 여러 값을 반환하는 훅은 객체를 반환합니다. `useState`를 대체하는 훅만 튜플을
  반환합니다.

---

## 타입 안전성

- `as any`를 사용하지 않습니다.

---

## 테스트

- 테스트 파일은 대상 파일 옆에 `{name}.test.ts(x)`로 둡니다.
- Jest의 `describe`/`it`을 사용하고, 설명은 "~하면 ~한다" 형태의 한국어로 씁니다.

---

## 코드 스타일 & 품질 기준

- ESLint / Stylelint 기준을 만족하는 상태를 유지합니다.
  - `lint`와 PR CI는 ESLint만 실행합니다. Stylelint는 `lint:fix`·`format`에서만
    실행되므로 스타일을 변경했다면 Stylelint 결과도 확인합니다.
- 코드 스타일은 개인 취향이 아닌 공통 규칙을 따릅니다.
- import 순서는 `web/`의 ESLint `import/order`가 강제합니다. builtin → external →
  `@/`·상대경로 → 나머지 순이며, 그룹 안은 알파벳 순입니다. 직접 정렬하지 않고
  lint 결과를 따릅니다.

---

## Responsive UI

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

- `device !== 'pc'`(mobile + tablet)는 `isMobile`, `device === 'pc'`는 `isPC`로
  이름을 정합니다. `isCompact`처럼 다른 의미로 해석될 수 있는 이름은 사용하지
  않습니다.
