# app workspace agent guide

이 문서는 app/ React Native workspace의 실제 경로와 package script만 정리합니다.
저장소 공통 규칙은 [root AGENTS.md](../AGENTS.md)와
[AI behavior rules](../docs/ai-rules.md)에서 확인합니다.

## App code conventions

현재 `app/`에는 별도 coding standards 문서가 없습니다. React Native code에는
`web/`용 Frontend Coding Standards를 적용하지 않으며, 저장소 공통 정책과 작업 대상에
직접 관련된 기존 구현을 참고합니다.

## Expo / WebView 작업 원칙

- `app/`은 Expo 기반의 WebView 앱입니다. 웹 화면과 대부분의 사용자 기능은 WebView로
  제공하고, React Native code는 WebView와 OS 기능을 연결하는 데 필요한 최소한의 역할만
  담당합니다.
- Expo 앱 설정과 native build 설정은 `app/app.config.ts`를 기준으로 관리합니다. 앱 이름,
  bundle identifier, 권한, plugin, 플랫폼별 build 설정 등은 먼저 `app.config.ts`와 Expo
  config plugin으로 해결할 수 있는지 확인합니다.
- `android/`와 `ios/`는 Expo prebuild로 생성되는 native project이며 `.gitignore` 대상입니다.
  직접 수정한 내용은 `expo prebuild --clean` 또는 Expo build 과정에서 재생성될 때 사라질 수
  있으므로, 일반 작업에서는 두 디렉터리를 직접 수정하지 않습니다.
- WebView 또는 `app.config.ts`, Expo module, config plugin으로 해결할 수 없는 OS 연동
  기능만 React Native 또는 native code를 추가로 수정합니다. 예를 들어 WebView의 기본
  시스템 메뉴 동작(복사 등)이나 이미지 저장처럼 OS 기능과 직접 연결되는 경우가 이에
  해당합니다.
- native code 수정이 정말 필요한 경우에도 먼저 `app.config.ts` 또는 config plugin으로
  재현 가능하게 관리할 수 있는지 확인하고, 직접 수정한 이유와 재생성 시 보존 방법을
  함께 확인합니다.

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
따라서 생성된 native project의 직접 수정은 지속되지 않을 수 있습니다. `reset-project`도
project file을 변경할 수 있으므로, 해당 결과가 요청 범위일 때만 실행합니다.
