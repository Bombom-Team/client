# Frontend Coding Standards

이 문서는 프론트엔드 개발자들이  
일관된 코드 스타일과 구조로 개발하기 위한 코딩 컨벤션을 정리한 문서입니다.

코드 작성 및 리뷰 시, 아래 기준을 공통으로 따릅니다.

## 적용 범위

이 문서는 `web/`, `admin/`, `maeil-mail/`의 React·Emotion UI code 규칙입니다.
`app/`의 React Native code에는 자동으로 적용하지 않습니다. `app/` 작업은
app/AGENTS.md와 가장 가까운 기존 code pattern을 먼저 따릅니다.

---

## 1. 함수 선언 규칙

### 기본 원칙

- 컴포넌트, 훅, 유틸 함수는 **모두 화살표 함수로 작성**합니다.

### 예외

- `routes` 폴더 내부에서 Route의 `component`로 사용되는 컴포넌트는  
  프레임워크 제약으로 인해 `function` 선언을 허용합니다.

```tsx
// 권장
const ChallengeCard = () => {};

// 허용 (routes 내부)
export function Component() {
  return <Page />;
}
```

---

## 2. 코드 위치 배치 규칙 (컴포넌트 / 유틸 / 상수)

컴포넌트, 유틸 함수, 상수는 **재사용 범위를 기준으로 가장 가까운 위치에 배치**합니다.

- 컴포넌트 전용
  - 유틸 / 상수: 한 컴포넌트에서만 사용한다면 해당 파일 상단에 선언합니다.
- 페이지 전용
  - 컴포넌트: `pages/{page}/components`
  - 유틸 / 상수: `pages/{page}/utils`
- 여러 페이지에서 공용
  - 컴포넌트: `src/components`
  - 유틸 / 상수: `src/utils`
- 여러 워크스페이스에서 공용
  - `shared` 워크스페이스에 배치합니다.
- 재사용 범위가 불분명한 경우, 우선 페이지 내부에 배치합니다.

---

## 3. export 규칙

- 컴포넌트는 반드시 `export default`로 내보냅니다.
- 훅과 유틸 함수는 `export const` 형태로 내보냅니다.
- 컴포넌트를 named export로 내보내지 않습니다.

---

## 4. 컴포넌트 파일 구성 순서

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

## 5. 컴포넌트 파일 단위 규칙

- 기본 원칙은 1파일 1컴포넌트입니다.
- 단, 항상 함께 사용되는 조합(composition) 컴포넌트는 예외로 허용합니다.
- 컴포넌트는 atomic design 원칙을 따릅니다.

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

## 6. Component documentation / Storybook

- 디자인 시스템 공통 컴포넌트는 `shared/src/ui-web`에서 관리합니다.
- Storybook을 사용하는 workspace에서는 디자인 시스템 공통 컴포넌트에만 Storybook story를 작성합니다.
- 각 workspace의 `src/components`에 있는 페이지·기능 전용 컴포넌트와 단순 재사용 또는 분리 목적의 컴포넌트는 Storybook 관리 대상이 아닙니다.

---

## 7. Styled Component 네이밍 규칙

### 최상위 Wrapper

- 컴포넌트를 감싸는 최상위 styled component는 항상 `Container`로 네이밍합니다.

### 하위 Styled Component

- 중간 레벨 레이아웃: `~Wrapper`
- 작은 단위 요소: `~Box`

```tsx
const Container = styled.div``;
const ContentWrapper = styled.div``;
const ButtonBox = styled.div``;
```

---

## 8. API 호출 및 데이터 처리

- API 호출은 공용 fetcher를 사용합니다.
- 요청 / 응답 타입은 OpenAPI로 생성된 타입을 기준으로 합니다.
- API 파일은 도메인 단위로 관리합니다.

```txt
src/apis/{domain}/
 ├─ domain.api.ts
 └─ domain.query.ts
```

---

## 9. 상태 관리 원칙

- 서버 상태
  - 서버 상태는 TanStack Query로 관리합니다.
- 로컬 상태
  - 로컬 상태는 입력값, 토글, 모달 등 UI 전용 상태에만 사용합니다.
- Mutation UX
  - mutation에는 항상 로딩, 성공, 실패에 대한 사용자 피드백을 포함합니다.

---

## 10. TanStack Query 사용 규칙

### useQuery

- `useQuery`는 query factory (`queries.*`)를 통해서만 사용합니다.
- 컴포넌트 내부에서 inline 옵션 선언은 지양합니다.

### useMutation

- `useMutation`은 반드시 커스텀 훅으로 분리합니다.
- 네이밍 규칙: `use{What}{Action}Mutation`

---

## 11. useEffect 의존성 배열 규칙

- 내부에서 사용되는 값과 함수는 모두 의존성 배열에 포함합니다.
- 객체 / 배열을 의존성으로 사용할 경우, `JSON.stringify`로 직렬화한 값을 의존성으로 사용합니다.

---

## 12. 이벤트 핸들러 네이밍 규칙

- props로 전달되는 콜백: `on-`
  - `onClose`, `onSubmit`
- 컴포넌트 내부 이벤트 핸들러: `handle-`
  - `handleClick`, `handleModalClose`

---

## 13. 타입 네이밍 규칙

- 컴포넌트 props는 TypeScript interface로 선언하고, 이름에 `Props` suffix를 사용합니다.
- 함수 / 훅 파라미터 타입: `Params` suffix

```ts
interface ChallengeCardProps {}
type FetchChallengeParams = {};
```

---

## 14. 코드 스타일 & 품질 기준

- ESLint / Stylelint 기준을 만족하는 상태를 유지합니다.
- 코드 스타일은 개인 취향이 아닌 공통 규칙을 따릅니다.
- 크기는 4의 단위로 사용합니다. 예: `4px`, `8px`, `12px`
- import는 external libraries, internal modules, relative imports 순서로 작성합니다.

---

## 15. Responsive UI

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
