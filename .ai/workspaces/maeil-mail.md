# maeil-mail workspace agent guide

> 원본: `.ai/workspaces/maeil-mail.md`. workspace 폴더의 `AGENTS.md`·`CLAUDE.md`·`GEMINI.md`는 이 파일로의
> symlink입니다. 아래 상대 링크는 원본 위치 기준입니다.

이 문서는 maeil-mail/ web client workspace의 경로와 생성 규칙만
정리합니다. 저장소 공통 규칙은 [`.ai/RULES.md`](../RULES.md)와
[AI behavior rules](../RULES.md#ai-behavior-rules)에서 확인합니다.

React UI code를 변경할 때는 [Frontend coding standards](../CONVENTIONS.md#frontend-coding-standards)를
함께 적용합니다.

## Workspace

- 작업 디렉터리: maeil-mail/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter maeil-mail <script>
- source directory: maeil-mail/src/

## Commands

실행 가능한 script와 그 내용은 `maeil-mail/package.json`의 `scripts`를 직접 읽습니다. 이 문서에
script 목록을 옮겨 적지 않습니다.

## Generated outputs

| Output | 생성 주체 |
| --- | --- |
| `maeil-mail/src/types/openapi.d.ts` | `maeil-mail/package.json`의 OpenAPI type 생성 script |
| `maeil-mail/src/routeTree.gen.ts` | `maeil-mail/vite.config.ts`의 TanStack Router plugin |

직접 수정하지 않고 생성 주체로만 갱신합니다. Generated output이 바뀌면 diff를 검토합니다.
