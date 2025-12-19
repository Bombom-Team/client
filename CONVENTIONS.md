## AI Instructions

Follow CONVENTIONS.md strictly when generating or editing code.

## Repository Layout

- Monorepo Structure MUST stay consistent  
  → pnpm 모노레포이며 admin, web, shared 워크스페이스를 기준으로 작업한다
- Shared Workspace MUST host shared code  
  → 공용 유틸/타입/API는 `shared` 워크스페이스에서 우선 관리한다
- Router Files MUST follow TanStack conventions  
  → `src/routes`의 파일 구조에 따라 자동 생성되는 `routeTree.gen.ts`는 직접 수정하지 않는다

## Development Commands

- Root Scripts SHOULD run via pnpm  
  → 설치/빌드는 루트에서 `pnpm install` 후 워크스페이스 필터링으로 실행한다
- Admin Commands USE pnpm filter  
  → 예) `pnpm --filter admin dev`, `pnpm --filter admin build`, `pnpm --filter admin test`
- Web Commands USE pnpm filter  
  → 예) `pnpm --filter web dev` 등 해당 워크스페이스에서 실행한다

## Coding Standards

- Language Stack IS TypeScript + React  
  → 모든 UI는 함수형 컴포넌트와 엄격한 타입 정의를 사용한다
- Components & Hooks USE arrow functions  
  → 모든 컴포넌트와 훅은 화살표 함수 형태로 작성한다
- Styling MUST use Emotion Theme  
  → 색상/타이포/여백은 `theme` 객체에서 가져오며 4px 단위 스케일을 따른다
- Components SHOULD remain UI-only  
  → 복잡한 비즈니스 로직은 hooks/services로 분리한다
- File Names FOLLOW casing rules  
  → 컴포넌트/페이지는 PascalCase, 훅/유틸은 camelCase, 폴더는 기존 규칙을 유지한다
- Components EXPORT default  
  → React 컴포넌트는 기본적으로 `export default`로 내보내 일관성을 유지한다
- Styled Components COME after default export  
  → 하나의 파일에서 컴포넌트와 styled 구문을 함께 작성할 때 `export default` 혹은 컴포넌트 선언부 뒤에 스타일 정의를 배치해 가독성을 유지한다

## API & Data Rules

- HTTP Client MUST be shared fetcher  
  → API 호출은 `@bombom/shared/apis`의 `fetcher`를 사용하고 요청/응답 타입을 명시한다
- Params MUST mirror backend features  
  → 서버 지원 파라미터(예: pagination, name 검색)를 query key와 함께 동일하게 전달한다
- Interfaces LIVE near API  
  → request/response 인터페이스는 관련 `src/apis/*` 파일에 함께 정의한다
- API Files GROUP by domain  
  → `src/apis/{domain}/domain.api.ts`, `domain.query.ts`처럼 도메인별 폴더를 만들고 API 선언과 Query 헬퍼를 분리 관리한다

## State & Side Effects

- Server State USES TanStack Query  
  → 목록/상세/뮤테이션은 Query/Mutation 훅으로 관리한다
- Local State ONLY for UI concerns  
  → 입력값이나 모달 상태 등 뷰 전용 데이터만 useState 등으로 다룬다
- Mutations REQUIRE user feedback  
  → 진행 중 비활성화, 성공/실패 안내 등 즉각적인 UX 대응을 구현한다
- Query Factories DEFINE options  
  → TanStack Query 사용 시 query factory로 `queryKey`, `queryFn`, `staleTime`, `gcTime`을 포함한 `QueryOptions` 객체를 만들어 재사용한다
- Cache Timing SHOULD be tuned  
  → 데이터 특성을 고려해 적절한 `staleTime`/`gcTime`을 설정하여 불필요한 refetch를 줄인다

## Testing & Quality

- Changes SHOULD include tests when risky  
  → 동작 변화가 크면 Jest/Testing Library 또는 Playwright 테스트를 추가/갱신한다
- Lint & Format MUST stay clean  
  → 주요 수정 후 `pnpm lint` 또는 워크스페이스별 스크립트를 실행해 규칙을 지킨다

## Documentation & Comments

- Markdown Docs MUST stay updated  
  → 규칙이나 작업 방식이 바뀌면 해당 문서를 갱신한다
- Comments SHOULD be concise  
  → 이해가 어려운 로직에만 짧은 설명을 남기고 자체 설명형 코드를 선호한다

## Git Workflow

- Branch Naming FOLLOWS `{type}/{issue_key}`  
  → 예) `feat/BOM-5`
- Commits FOLLOW `type: subject`  
  → 예) `feat: add notice API`
- PR Titles USE `[FE][issue] type:subject`  
  → CLAUDE.md에 정의된 형식을 따른다
- Avoid Rewriting Others' Work  
  → 예상치 못한 변경을 발견하면 되돌리지 말고 사용자와 상의한다
