# app workspace agent guide

이 문서는 app/ React Native workspace의 경로와 작업 주의사항만 정리합니다.
저장소 공통 규칙은 [.ai/AGENTS.md](../.ai/AGENTS.md)와
[AI behavior rules](../.ai/AGENTS.md#ai-behavior-rules)에서 확인합니다.

## App code conventions

현재 `app/`에는 별도 coding standards 문서가 없습니다. React Native code에는
`web/`용 Frontend Coding Standards를 적용하지 않으며, 저장소 공통 정책과 작업 대상에
직접 관련된 기존 구현을 참고합니다.

## Expo / WebView 작업 원칙

WebView 앱의 역할, native 설정 변경 순서, prebuild 재생성 주의사항은
[CONVENTIONS.md의 app 네이티브 설정과 prebuild](../.ai/CONVENTIONS.md#app-네이티브-설정과-prebuild)를
따릅니다.

## Workspace

- 작업 디렉터리: app/
- 패키지 매니저: pnpm
- 명령 실행 위치: 저장소 루트
- 명령 형식: pnpm --filter app <script>
- 주요 source directory: app/, components/, apis/, contexts/, hooks/, constants/, utils/

## Commands

실행 가능한 script와 그 내용은 `app/package.json`의 `scripts`를 직접 읽습니다. 이 문서에
script 목록을 옮겨 적지 않습니다.

- native project를 다시 생성하는 script(`expo prebuild --clean`, `eas build` 포함)는
  [app 네이티브 설정과 prebuild](../.ai/CONVENTIONS.md#app-네이티브-설정과-prebuild)를 먼저 확인합니다.
- store 제출(`--auto-submit`)이나 production build를 실행하는 script는 사용자가 요청할 때만
  실행합니다. `reset-project`도 project file을 변경하므로 요청 범위일 때만 실행합니다.
