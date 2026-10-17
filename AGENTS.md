# AGENTS.md

이 문서는 BomBom 저장소에서 작업하는 모든 AI agent의 진입점이자, AI와 코드 작업을 할 때
**반드시 적용하는 공통 규칙의 원본(SSOT)**입니다. 도구와 관계없이 적용합니다.

| 도구 | 이 문서를 읽는 방식 |
| --- | --- |
| Codex | 루트 `AGENTS.md`를 자동으로 읽음 |
| Claude Code | [CLAUDE.md](CLAUDE.md)가 `@AGENTS.md`로 import |
| Gemini CLI | [GEMINI.md](GEMINI.md)가 `@AGENTS.md`로 import |

공통 규칙은 이 파일에만 둡니다. 다른 파일에 규칙을 복제하지 말고 이 파일의 절 제목으로
링크합니다. Codex는 다른 파일을 import하지 못하므로, 모든 agent가 반드시 따라야 하는
규칙은 링크가 아니라 이 파일 본문에 둡니다. Codex는 instruction 파일을 합계 32KiB까지만
읽으므로 이 파일을 그보다 작게 유지합니다.

## Start here

파일을 변경하기 전에 아래 순서로 읽습니다.

1. 이 문서 전체. 아래 [AI behavior rules](#ai-behavior-rules)와
   [Frontend coding standards](#frontend-coding-standards)를 포함합니다.
2. 작업에 해당하는 문서
   - `app/` React Native UI 코드: app/AGENTS.md와 작업 대상의 인접 구현
   - Commit message: [git commit convention](docs/git-commit-convention.md)
   - Pull request review: [review policy](.review-learnings/REVIEW.md),
     [architecture map](docs/architecture.md), 변경 workspace의 규칙을 읽습니다.
     Claude Code의 PR review 실행과 review workflow 유지·수정·장애 확인은
     `ai-review-workflow` skill을 사용합니다.
   - Workspace 작업: 아래 표에서 대상 workspace를 찾고 해당 AGENTS.md 확인
3. 아래 '작업 범위 파악' 순서로 관련 code, configuration, test를 확인

작업에 필요한 문서만 읽고 적용합니다. Workspace별 AGENTS.md는 해당 package의
경로·명령·생성 규칙을 안내하며, 공통 AI 행동 정책은 이 문서의 AI behavior rules를 따릅니다.

## Workspace 선택

사용자가 경로를 지정했다면 그 경로의 workspace부터 시작합니다. 경로 없이 서비스나
기능을 언급했다면 아래 표를 사용합니다.

| 작업 단서 | 먼저 읽을 문서 | 탐색 시작 경로 |
| --- | --- | --- |
| 웹 화면, 웹 client, web/의 기능·버그 | web/AGENTS.md | web/src/ |
| 모바일, Expo, React Native, app/의 기능·버그 | app/AGENTS.md | app/app/, app/components/, app/apis/ |
| 어드민, dashboard, admin/의 기능·버그 | admin/AGENTS.md | admin/src/ |
| 매일메일, maeil-mail/의 기능·버그 | maeil-mail/AGENTS.md | maeil-mail/src/ |
| 공유 UI, theme, utility, web과 app의 공통 코드 | shared/AGENTS.md | shared/src/ |
| web/admin/maeil-mail의 OpenAPI type output | 해당 workspace의 AGENTS.md | 각 workspace의 src/types/openapi.d.ts |
| shared generated API 또는 oas-gen generator 코드 | shared/oas-gen/AGENTS.md와 web/AGENTS.md | shared/src/core/apis/generated/, shared/oas-gen/src/ |
| routeTree.gen.ts 등 workspace별 generated output | 해당 workspace의 AGENTS.md | 변경된 output, webpack/vite router configuration |
| 둘 이상의 workspace에 걸친 기능 | 관련된 모든 workspace AGENTS.md와 docs/architecture.md | 요청에서 직접 언급된 workspace부터 |

어느 workspace인지 분명하지 않으면 먼저 feature 이름, route, component, API endpoint를
검색해 후보를 좁힙니다. 후보가 둘 이상이고 선택에 따라 사용자 동작이나 data contract가
달라지면 그때만 확인합니다.

## 작업 범위 파악

넓은 directory 전체를 먼저 읽지 않습니다. 다음 순서로 필요한 파일만 좁혀 갑니다.

1. 사용자가 지정한 file, error, screen, feature 이름, issue의 대상을 찾습니다.
2. 대상 workspace의 AGENTS.md와 package.json에서 실행 명령과 생성 규칙을 확인합니다.
3. 대상의 entry point와 가장 가까운 구현을 봅니다.
   - 화면·route 작업: route 또는 page와 그 component
   - 기능·bug 작업: 해당 symbol의 호출부와 직접 의존성
   - API 작업: request를 만드는 code, 사용 중인 type, 관련 generated file 또는 generator
4. 대상과 가장 가까운 test, story, mock, 또는 E2E scenario가 있으면 함께 확인합니다.
5. 수정 범위가 확인된 뒤에만 추가 의존성이나 다른 workspace로 탐색을 넓힙니다.

이 순서는 읽기 범위를 정하는 기준이며, 실제 수정은 요청된 파일과 요청 완료에 직접
필요한 파일로 제한합니다.

## Repository overview

BomBom은 pnpm monorepo입니다.

- web/ — React/TypeScript web client; web/AGENTS.md 참고
- app/ — React Native mobile client
- admin/ — Admin dashboard web client
- maeil-mail/ — Daily Mail web client
- shared/ — 여러 workspace가 사용하는 theme, 웹 UI component, fetcher, generated API, utility
- shared/oas-gen/ — 공유 generated API file을 위한 OpenAPI module generator

## Git workflow

Commit message를 준비하거나 검토할 때만 docs/git-commit-convention.md를 읽습니다.
모든 package의 branch와 PR에는 아래를 적용합니다.

- dev에서 branch를 만들고 PR target은 dev입니다.
- Branch 형식: {type}/{issue_key} (예: feat/BOM-5)
- PR title: [{issue_key}] {type}: {subject}
- dev에는 Squash & Merge, main에는 Create a Commit으로 merge합니다.

## AI behavior rules

AI agent가 이 저장소에서 안전하고 효율적으로 작업하는 방법입니다.

### 작업 범위 및 확인

- 사용자 요청이 작업의 목표와 범위를 정합니다.
- 요청한 결과를 완료하는 데 직접 필요한 supporting file은 함께 수정할 수 있습니다.
- 관련 없는 refactor, rename, reformatting, dependency 변경은 한 작업에 섞지
  않습니다.
- code와 configuration으로 확인할 수 있는 구현 세부 사항은 먼저 확인하고 진행합니다.
- 제품 동작, API·data contract, authorization·security, 또는 작업 범위를 실질적으로
  바꾸는 판단이 필요할 때만 방향을 확인합니다.

### Generated files

- `.gen.ts` 파일은 직접 수정하지 않습니다.
- Generated file은 generator command로만 갱신합니다.
- Generated file을 수동으로 수정하는 것은 금지합니다.

### 검증 및 완료

변경한 workspace에 해당 command가 있을 때는 그 workspace의 command를 사용합니다.

| 변경 종류 | 필요한 검증 |
| --- | --- |
| Documentation만 변경 | `git diff --check`를 실행하고, 수정한 link·path·command·저장소 사실을 확인합니다. |
| 일반 application code 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행합니다. |
| 기존 test가 있는 기능 변경 | 변경한 workspace의 `lint`와 `type-check`, 해당 기능의 focused test를 실행합니다. |
| UI 또는 사용자 흐름 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행하고, 대상 흐름의 E2E test가 있으면 실행합니다. E2E test가 없으면 해당 흐름을 직접 확인합니다. |
| API, TanStack Query, authorization, routing 변경 | 변경한 workspace의 `lint`와 `type-check`, 관련 focused test를 실행하고 request·response type과 소비 code를 확인합니다. |
| Configuration, script, CI 변경 | configuration syntax를 확인하고, 변경한 command 또는 build를 안전한 범위에서 실행합니다. |
| Generated output 변경 | generator command를 실행하고 생성된 diff를 검토합니다. |
| 여러 workspace 변경 | 변경한 각 workspace에 적용되는 위 검증을 실행합니다. |

- Auto-fix는 사용자가 명시적으로 요청했거나, 기본 lint 검증에서 오류가 확인된 경우에만 실행합니다.
  - lint 오류가 없으면 코드 변경이 있더라도 `lint:fix`를 실행하지 않습니다.
  - lint 오류가 있으면 `lint:fix`를 실행하고, 자동으로 해결되지 않은 오류는 수동으로 수정합니다.
  - Auto-fix가 파일을 변경하면 변경 내용을 검토하고 관련 lint 검증을 다시 실행합니다.
- commit은 사용자가 요청하거나 작업에 명시된 경우에만 만듭니다.
- 필요한 검증을 실행할 수 없으면 실행하지 못한 이유와 대신 확인한 근거를 알립니다.
- 변경과 무관한 기존 failure는 별도로 알리고, 이를 고치기 위해 관련 없는 변경을 추가하지 않습니다.

### AI가 읽는 문서 작성

- AI가 읽는 문서(AGENTS.md, skill, agent, 리뷰 정책 등)의 정보는 원본을 하나만 둡니다.
- 다른 파일에 원본이 있는 내용(`package.json` script, 설정값, theme 토큰 값, 컴포넌트 props,
  route 목록, 코드 예시 등)은 복사하지 않고 원본 경로를 안내합니다.
- 문서에는 원본에서 알 수 없는 정책, 의도, 판단 기준만 적습니다.
- 설정 파일처럼 다른 파일을 참조할 수 없어 복사가 불가피하면, 원본 문서에 함께 수정할 위치를
  적습니다.

### Language

팀이 읽는 설명과 report는 한국어로 작성합니다. Command, path, code, 기존
technical identifier는 자연스러운 영어 표기를 유지합니다.

---

## 모든 workspace 공통 작업 원칙

### 공통 컴포넌트 우선 사용

UI를 새로 만들기 전에 해당 workspace의 공통 컴포넌트에서 쓸 수 있는 것을 먼저 찾습니다.
비슷한 컴포넌트를 복제하지 않고, 기존 컴포넌트로 표현할 수 없을 때만 새로 만듭니다.
새로 만들 때는 [파일·폴더 배치 규칙](#파일폴더-배치-규칙)에 따라 재사용 범위에 맞게 둡니다.

| workspace | 공통 컴포넌트 위치 | 사용 방식 |
| --- | --- | --- |
| `web/` | `web/src/components/` | `shared/src/ui-web`을 재-export하는 컴포넌트도 `@/components/{Name}/{Name}` 경로로 import합니다 |
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
[처리표](docs/ai-conventions-inventory.md#6-컨벤션-실측-결과)). `admin/`·`maeil-mail/`에서
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
- `hooks/` 폴더의 파일은 `use*.ts`이며 JSX를 포함하지 않습니다.
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
  않습니다.
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
  해당 adapter를 사용합니다([architecture.md](docs/architecture.md#adminmaeil-mail-경계)).
- API 파일은 도메인 단위로 관리합니다.

```txt
src/apis/{domain}/
 ├─ domain.api.ts
 └─ domain.query.ts
```

- API 함수 이름의 접두사는 HTTP method(`get`, `post`, `put`, `patch`, `delete`)입니다.
- 요청·응답 타입은 같은 `*.api.ts`에서 `{Fn}Params`, `{Fn}Response`로 export하고,
  `fetcher` 호출에 응답 타입을 generic으로 명시합니다.

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

#### Query factory

- `{domain}.query.ts`는 `export const {domain}Queries = { ... }`를 export하고,
  `apis/queries.ts`에 `...{domain}Queries`로 등록합니다.
- 각 항목은 `name: (args) => queryOptions({ queryKey, queryFn })` 형식이며, 무한
  스크롤은 `infiniteQueryOptions`를 사용합니다. 항목 이름은 `get` 없는 명사형입니다.
- factory 인자는 모두 `queryKey`에 포함합니다.
- 하위 key를 한 번에 무효화해야 하면 `all: (id) => [...] as const`를 두고 하위 항목이
  이를 확장합니다.
- `invalidateQueries`, `setQueryData` 등에 넘기는 key는 factory에서 얻습니다
  (`queries.x(...).queryKey`, `queries.x.all(...)`). 리터럴 배열을 직접 쓰지 않습니다.

#### useMutation

- `useMutation`은 반드시 커스텀 훅으로 분리하고, 훅은 `hooks/`에 둡니다.
- 훅 이름은 `use{...}Mutation` 형식입니다.
- 훅은 `return useMutation({ mutationFn, onSuccess, onError })`를 그대로 반환합니다.

---

### Effect와 참조 안정성

- `useEffect`·`useMemo`·`useCallback`의 의존성 배열에는 내부에서 사용하는 값과 함수를
  모두 포함합니다(`react-hooks/exhaustive-deps`).
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

#### 타입

- 컴포넌트 props는 TypeScript interface로 선언하고, 이름에 `Props` suffix를 사용합니다.
- 함수 / 훅 파라미터 타입: `Params` suffix

```ts
interface ChallengeCardProps {}
type FetchChallengeParams = {};
```

#### 상수와 훅 반환값

- 모듈 최상위 원시값 상수와 `constants/` 폴더의 export는 UPPER_SNAKE_CASE를 사용합니다.
- `enum` 대신 union literal 타입을 사용합니다.
- 여러 값을 반환하는 훅은 객체를 반환합니다. `useState`를 대체하는 훅만 튜플을
  반환합니다.

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

- `device !== 'pc'`(mobile + tablet)는 `isMobile`, `device === 'pc'`는 `isPC`로
  이름을 정합니다. `isCompact`처럼 다른 의미로 해석될 수 있는 이름은 사용하지
  않습니다.
