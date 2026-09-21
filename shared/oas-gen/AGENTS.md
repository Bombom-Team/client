# shared/oas-gen workspace agent guide

이 문서는 shared/oas-gen/ OpenAPI module generator의 실제 경로와 package script만
정리합니다. 저장소 공통 규칙은 [root AGENTS.md](../../AGENTS.md)와
[AI behavior rules](../../docs/ai-rules.md)에서 확인합니다.

## Workspace

- 작업 디렉터리: shared/oas-gen/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter oas-gen <script>
- source directory: shared/oas-gen/src/
- executable entry directory: shared/oas-gen/bin/

## Commands

| 목적 | Command |
| --- | --- |
| TypeScript 검사 | pnpm --filter oas-gen type-check |

## Generated outputs

| Output | 생성 주체·조건 | 실행 Command | 직접 수정 |
| --- | --- | --- | --- |
| `shared/src/core/apis/generated/` | `shared/oas-gen`; `web`의 API type 생성이 호출 | `pnpm --filter web gen:api` | 금지 |

Generated output을 바꿔야 하면 root policy와 `docs/ai-rules.md`의 Generated files
규칙을 먼저 적용하고, 생성 diff를 검토합니다.
