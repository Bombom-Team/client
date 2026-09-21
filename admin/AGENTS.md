# admin workspace agent guide

이 문서는 admin/ dashboard workspace의 실제 경로와 package script만 정리합니다.
저장소 공통 규칙은 [root AGENTS.md](../AGENTS.md)와
[AI behavior rules](../docs/ai-rules.md)에서 확인합니다.

React UI code를 변경할 때는 [Frontend Coding Standards](../docs/frontend-coding-standards.md)를
함께 적용합니다.

## Workspace

- 작업 디렉터리: admin/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter admin <script>
- source directory: admin/src/

## Commands

| 목적 | Command |
| --- | --- |
| Development server 실행 | pnpm --filter admin start |
| Production build 생성 | pnpm --filter admin build |
| Production build 미리보기 | pnpm --filter admin preview |
| lint 실행 | pnpm --filter admin lint |
| lint와 Stylelint 자동 수정 | pnpm --filter admin lint:fix |
| 파일 format 적용 | pnpm --filter admin format |
| TypeScript 검사 | pnpm --filter admin type-check |
| OpenAPI type 생성 | pnpm --filter admin generate-openapi-types |

`lint:fix`와 `format`은 source file을 수정합니다.

## Generated outputs

| Output | 생성 주체·조건 | 실행 Command | 직접 수정 |
| --- | --- | --- | --- |
| `admin/src/types/openapi.d.ts` | environment variable의 OpenAPI document | `pnpm --filter admin generate-openapi-types` | 금지 |
| `admin/src/routeTree.gen.ts` | `admin/vite.config.ts`의 TanStack Router plugin | route 또는 router configuration 변경 후 해당 build 또는 development Command | 금지 |

Generated output이 바뀌면 diff를 검토합니다.
