# CONVENTIONS.md

This document defines the ABSOLUTE conventions for this repository.
All contributors (human or AI) MUST follow these rules.

---

## Absolute Priority Rules

Priority Order (Highest → Lowest):

1. This CONVENTIONS.md
2. Existing codebase patterns
3. Tool defaults (eslint, prettier, framework conventions)

If any rule conflicts, THIS DOCUMENT WINS.

---

## Modification Scope Rules (Critical)

- Modify ONLY files explicitly mentioned by the user or REQUIRED by the approved task.
- DO NOT refactor unrelated code.
- DO NOT perform cosmetic changes unless explicitly requested.
- DO NOT rename, reorder, or reformat code without functional necessity.
- If the modification scope is unclear, STOP and ASK before editing.

---

## Generated Files (Absolute)

- Files ending with `.gen.ts` MUST NOT be edited manually.
- Generated files MUST be updated ONLY via their generating commands.
- Any manual change to generated files is STRICTLY FORBIDDEN.

---

## Repository Layout

- Monorepo structure MUST stay consistent.
  → pnpm 모노레포이며 `admin`, `web`, `shared` 워크스페이스를 기준으로 작업한다.

- Shared workspace MUST host shared code.
  → 공용 유틸, 타입, API 로직은 `shared` 워크스페이스에서 우선 관리한다.

- Router files MUST follow TanStack Router conventions.
  → `src/routes` 구조로부터 생성되는 `routeTree.gen.ts`는 직접 수정하지 않는다.

---

## Development Commands

- All commands MUST be executed via pnpm.
- Root-level installation/build MUST use `pnpm install`.

- Workspace commands MUST use pnpm filter.
  - Admin:
    - `pnpm --filter admin dev`
    - `pnpm --filter admin build`
    - `pnpm --filter admin test`

  - Web:
    - `pnpm --filter web dev`
    - `pnpm --filter web build`
    - `pnpm --filter web test`

- Admin OpenAPI types MUST be generated via script.
  → Run `pnpm admin:generate-openapi-types`
  → `admin/.env` MUST define `VITE_OPEN_API_DOCS`
  → Generated `src/types/openapi.d.ts` MUST be committed.

---

## Coding Standards

- Language stack IS TypeScript + React.
- All UI MUST use functional components with strict typing.

- Components and hooks MUST use arrow functions.
- React components MUST be exported as `default`.

- Styling MUST use Emotion Theme.
  → Colors, typography, spacing MUST come from `theme`
  → Spacing follows a 4px scale.

- Components MUST remain UI-only.
  → Business logic belongs in hooks or services.

- File naming rules:
  - Components / pages: PascalCase
  - Hooks / utils: camelCase
  - Folder names: follow existing conventions (do not invent new casing)

- Styled components MUST be declared AFTER component definition or default export.

---

## API & Data Rules

- HTTP client MUST use the shared fetcher.
  → `@bombom/shared/apis/fetcher`

- API specs MUST reference `openapi.d.ts`.
  → Always verify request/response shapes against latest generated types.

- Query parameters MUST mirror backend-supported features.
  → Pagination, filters, search params MUST align exactly with backend contracts.

- Request/response interfaces MUST live near the API implementation.
  → `src/apis/*` scope

- API files MUST be grouped by domain.
  → `src/apis/{domain}/domain.api.ts`
  → `src/apis/{domain}/domain.query.ts`

---

## State & Side Effects

- Server state MUST use TanStack Query.
- Local state MUST be limited to UI concerns only.

- Mutations MUST provide immediate user feedback.
  → Loading disabled state
  → Success / failure handling

- Query factories MUST define reusable options.
  → `queryKey`, `queryFn`, `staleTime`, `gcTime`

- Cache timing SHOULD be tuned based on data characteristics.
  → Avoid unnecessary refetching.

---

## Testing & Quality

- Changes that affect behavior MUST include tests when risk is non-trivial.
  → Jest / Testing Library / Playwright

- Lint and format MUST remain clean.
  → Run workspace-specific lint and type-check after significant changes.

---

## Documentation & Comments

- Markdown documentation MUST stay updated when rules or workflows change.
- Comments MUST be concise and intentional.
  → Prefer self-explanatory code over verbose comments.

---

## Workflow Process

- `[WORKFLOW]` prefix TRIGGERS mandatory process execution.

1. Receive request and list tasks
2. Share task list and wait for confirmation
3. Implement tasks sequentially
4. Commit per task
5. Run lint and type-check BEFORE push
6. Push and open PR

- The FINAL task in any `[WORKFLOW]` plan MUST be:
  → `lint/type-check 및 정리`

---

## Git Workflow

- Branch naming MUST follow `{issue_key}{issue_task_name}`
  → 예: `BOM-5{특정 기능 개발}`

- Commit messages MUST follow:
  → `type: 한글 설명`
  → Allowed types: `feat`, `fix`, `refactor`, `test`, `chore`

- PR titles MUST follow:
  → `[ISSUE] type: subject`
  → 예: `[BOM-199] feat: 챌린지 종류별 신청 카드 제작`

- PR template MUST be followed without omission.
  → `.github/pull_request_template.md`

- PR target branch MUST be `dev`.

- DO NOT rewrite or revert others’ work without discussion.
  → Unexpected changes MUST be reported and discussed first.

---

## AI Failure Handling

- If a rule is unclear or missing, STOP and ASK.
- NEVER guess project-specific behavior.
- NEVER invent code paths, APIs, or data contracts.
