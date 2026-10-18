# shared/oas-gen workspace agent guide

> 원본: `.ai/workspaces/shared-oas-gen.md`. workspace 폴더의 `AGENTS.md`·`CLAUDE.md`·`GEMINI.md`는 이 파일로의
> symlink입니다. 아래 상대 링크는 원본 위치 기준입니다.

이 문서는 shared/oas-gen/ OpenAPI module generator의 경로와 생성 규칙만
정리합니다. 저장소 공통 규칙은 [`.ai/RULES.md`](../RULES.md)와
[AI behavior rules](../RULES.md#ai-behavior-rules)에서 확인합니다.

## Workspace

- 작업 디렉터리: shared/oas-gen/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter oas-gen <script>
- source directory: shared/oas-gen/src/
- executable entry directory: shared/oas-gen/bin/

## Commands

실행 가능한 script와 그 내용은 `shared/oas-gen/package.json`의 `scripts`를 직접 읽습니다. 이 문서에
script 목록을 옮겨 적지 않습니다.

## Generated outputs

| Output | 생성 주체 |
| --- | --- |
| `shared/src/core/apis/generated/` | `web/scripts/generate-openapi-types.sh`가 `shared/oas-gen`을 호출 |

Generated output을 바꿔야 하면 [`.ai/RULES.md`의 Generated files](../RULES.md#generated-files) 규칙을 먼저 적용하고,
생성 diff를 검토합니다.
