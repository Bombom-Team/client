# web workspace agent guide

> 원본: `.ai/workspaces/web.md`. workspace 폴더의 `AGENTS.md`·`CLAUDE.md`·`GEMINI.md`는 이 파일로의
> symlink입니다. 아래 상대 링크는 원본 위치 기준입니다.

AI 에이전트가 `web/` 워크스페이스에서 작업할 때 확인할 문서와 명령을 정리합니다. 세부 규칙은 아래 연결 문서에서 확인합니다.

## Read first

- [`.ai/RULES.md`](../RULES.md): 저장소 공통 규칙, [AI behavior rules](../RULES.md#ai-behavior-rules)
- [`.ai/CONVENTIONS.md`](../CONVENTIONS.md): 코드를 변경하거나 리뷰할 때 전체를 읽음
- [`docs/git-commit-convention.md`](../../docs/git-commit-convention.md): 커밋을 준비할 때만

## Workspace

- **작업 디렉터리**: `web/`
- **패키지 매니저**: pnpm
- **명령 실행 위치**: 저장소 루트
- **명령 형식**: `pnpm --filter web <script>`
- **소스 디렉터리**: `web/src/`

## Commands

실행 가능한 script와 그 내용은 `web/package.json`의 `scripts`를 직접 읽습니다. 이 문서에
script 목록을 옮겨 적지 않습니다.

## Generated outputs

| Output | 생성 주체 |
| --- | --- |
| `web/src/types/openapi.d.ts` | `web/scripts/generate-openapi-types.sh` |
| `shared/src/core/apis/generated/` | `web/scripts/generate-openapi-types.sh`가 `shared/oas-gen`을 호출 |
| `web/src/routeTree.gen.ts` | `web/webpack.config.ts`의 TanStack Router plugin |

직접 수정하지 않고 생성 주체로만 갱신합니다. 생성 script의 실행 조건(환경변수 등)은 해당
script를 읽어 확인합니다. Generated output이 바뀌면 diff를 검토합니다.
