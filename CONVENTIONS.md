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
- Admin OpenAPI Types GENERATE via script  
  → `pnpm admin:generate-openapi-types` 실행 전 `admin/.env`에 `VITE_OPEN_API_DOCS`를 설정하고, 최신 스펙으로 생성된 `src/types/openapi.d.ts`를 커밋한다
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
- API Specs REFER TO openapi.d.ts  
  → API 명세가 필요할 땐 각 워크스페이스의 `src/types/openapi.d.ts`를 참조해 최신 스펙과 타입을 확인한다
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

## Workflow Process

- User Command `[WORKFLOW]` TRIGGERS process  
  → 사용자가 CLI 명령이나 지시문 앞에 `[WORKFLOW]` prefix를 붙이면 아래 프로세스를 반드시 실행해 기능 개발을 진행한다
- Receive Request & List Tasks  
  → 작업 요청을 받으면 필요한 하위 작업을 항목별로 리스트업하고, 각 항목은 독립적으로 수행 가능한 단위로 분리한다
- Share & Confirm Plan  
  → 정리한 작업 리스트를 사용자에게 공유해 컨펌을 받은 뒤에만 구현을 진행한다
- Implement Per Item  
  → 승인된 리스트를 순서대로 개발/테스트하며, 다른 항목에 영향이 없도록 범위를 관리한다
- Commit Per Item  
  → 각 항목을 완료할 때마다 해당 변경만 포함된 커밋을 만든다(커밋 메시지는 `feat|refactor|chore: 한글 설명` 형식을 따른다)
- Push & Open PR  
  → 모든 항목을 마친 후 원격에 push하고, PR을 작성한다(템플릿 규칙과 제목 형식을 아래 Git Workflow를 따른다)

## Git Workflow

- Branch Naming FOLLOWS `{issue_key}{issue_task_name}`  
  → 예) `BOM-5{특정 기능 개발}`
- Commits USE `type: 한글설명`  
  → `type`은 `feat`, `refactor`, `fix`, `test`, `chore`만 사용하며 나머지 메시지는 한글로 작성한다 (예: `feat: 챌린지 완료 카드 추가`)
- PR Titles START WITH `[issue] type:subject`  
  → 브랜치명에 포함된 이슈 키를 `[BOM-199]` 형식으로 앞에 붙이고, 이후 `feat|fix` 등 이슈 유형과 브랜치 내용을 기입한다 (예: `[BOM-199] feat: BOM-793-챌린지-종류별-신청-카드-제작`)
- PR Template REVIEW POINTS USE CHECKBOXES  
  → `.github/pull_request_template.md`의 Review Point 섹션에 구현한 작업 리스트를 체크박스로 정리해 리뷰 범위를 명확히 한다
- Avoid Rewriting Others' Work  
  → 예상치 못한 변경을 발견하면 되돌리지 말고 사용자와 상의한다
