# shared workspace agent guide

이 문서는 shared/ package의 실제 경로와 package script만 정리합니다. 저장소
공통 규칙은 [root AGENTS.md](../AGENTS.md)와
[AI behavior rules](../docs/ai-rules.md)에서 확인합니다.

## Workspace

- 작업 디렉터리: shared/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter shared <script>
- source directory: shared/src/
- OpenAPI generator package: shared/oas-gen/ (별도 AGENTS.md 참고)

## Commands

| 목적 | Command |
| --- | --- |
| TypeScript 검사 | pnpm --filter shared type-check |
| 파일 format 적용 | pnpm --filter shared format |

format은 source file을 수정합니다.
