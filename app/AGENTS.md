# app workspace agent guide

이 문서는 app/ React Native workspace의 실제 경로와 package script만 정리합니다.
저장소 공통 규칙은 [root AGENTS.md](../AGENTS.md)와
[AI behavior rules](../docs/ai-rules.md)에서 확인합니다.

## App code conventions

현재 `app/`에는 별도 coding standards 문서가 없습니다. React Native code에는
`web/`용 Frontend Coding Standards를 적용하지 않으며, 저장소 공통 정책과 작업 대상에
직접 관련된 기존 구현을 참고합니다.

## Workspace

- 작업 디렉터리: app/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter app <script>
- 주요 source directory: app/, components/, apis/, contexts/, hooks/, constants/, utils/

## Commands

| 목적 | Command |
| --- | --- |
| Expo development server 실행 | pnpm --filter app start |
| Web target으로 실행 | pnpm --filter app web |
| Expo lint 실행 | pnpm --filter app lint |
| 파일 format 적용 | pnpm --filter app format |
| TypeScript 검사 | pnpm --filter app type-check |
| Starter project 초기화 | pnpm --filter app reset-project |
| Android build를 로컬에서 생성 | pnpm --filter app build:android |
| Android project를 다시 생성하고 실행 | pnpm --filter app android |
| iOS project를 다시 생성하고 실행 | pnpm --filter app ios |

android와 ios는 Expo prebuild --clean을 포함해 native project를 다시 생성합니다.
reset-project도 project file을 변경할 수 있으므로, 해당 결과가 요청 범위일 때만
실행합니다.
