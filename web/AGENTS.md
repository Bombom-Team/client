# web workspace agent guide

AI 에이전트가 `web/` 워크스페이스에서 작업할 때 확인할 문서와 명령을 정리합니다. 세부 규칙은 아래 연결 문서에서 확인합니다.

## Read first

- [Repository agent rules](../AGENTS.md)
- [Conventions index](../CONVENTIONS.md)
- [AI behavior rules](../docs/ai-rules.md)
- [Frontend coding standards](../docs/frontend-coding-standards.md): 프론트엔드 코드를 변경할 때
- [Git commit convention](../docs/git-commit-convention.md): 커밋을 준비할 때만

## Workspace

- **작업 디렉터리**: `web/`
- **패키지 매니저**: pnpm
- **명령 실행 위치**: 저장소 루트
- **명령 형식**: `pnpm --filter web <script>`
- **소스 디렉터리**: `web/src/`

## Commands

| 목적 | Command |
| --- | --- |
| Development server 실행 | `pnpm --filter web start` |
| MSW를 적용한 development server 실행 | `pnpm --filter web start:msw` |
| Production build 생성 | `pnpm --filter web build` |
| lint 실행 | `pnpm --filter web lint` |
| lint 자동 수정 | `pnpm --filter web lint:fix` |
| 파일 format 적용 | `pnpm --filter web format` |
| TypeScript 검사 | `pnpm --filter web type-check` |
| Unit test 실행 | `pnpm --filter web test` |
| E2E test 실행 | `pnpm --filter web test:e2e` |
| Playwright UI로 E2E test 실행 | `pnpm --filter web test:e2e:ui` |
| 브라우저를 표시하여 E2E test 실행 | `pnpm --filter web test:e2e:headed` |
| E2E test debug | `pnpm --filter web test:e2e:debug` |
| Storybook 실행 | `pnpm --filter web storybook` |
| Storybook build 생성 | `pnpm --filter web build-storybook` |
| API type 생성 | `pnpm --filter web gen:api` |

`lint:fix`는 ESLint 후 Stylelint를 순서대로 실행합니다.

## Generated outputs

| Output | 생성 주체·조건 | 실행 Command | 직접 수정 |
| --- | --- | --- | --- |
| `web/src/types/openapi.d.ts` | `OPEN_API_DOCS`가 설정된 `web/scripts/generate-openapi-types.sh` | `pnpm --filter web gen:api` | 금지 |
| `shared/src/core/apis/generated/` | `web/scripts/generate-openapi-types.sh` → `shared/oas-gen` | `pnpm --filter web gen:api` | 금지 |
| `web/src/routeTree.gen.ts` | `web/webpack.config.ts`의 TanStack Router plugin | route 또는 router configuration 변경 후 해당 build 또는 development Command | 금지 |

Generated output이 바뀌면 diff를 검토합니다.
