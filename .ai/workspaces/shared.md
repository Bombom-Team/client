# shared workspace agent guide

> 원본: `.ai/workspaces/shared.md`. workspace 폴더의 `AGENTS.md`·`CLAUDE.md`·`GEMINI.md`는 이 파일로의
> symlink입니다. 아래 상대 링크는 원본 위치 기준입니다.

이 문서는 shared/ package의 경로만 정리합니다. 저장소
공통 규칙은 [`.ai/RULES.md`](../RULES.md)와
[AI behavior rules](../RULES.md#ai-behavior-rules)에서 확인합니다.

## Workspace

- 작업 디렉터리: shared/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter shared <script>
- source directory: shared/src/
- OpenAPI generator package: shared/oas-gen/ (`.ai/workspaces/shared-oas-gen.md` 참고)

## Commands

실행 가능한 script와 그 내용은 `shared/package.json`의 `scripts`를 직접 읽습니다. 이 문서에
script 목록을 옮겨 적지 않습니다.
