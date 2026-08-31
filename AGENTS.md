# AGENTS.md

이 문서는 BomBom 저장소에서 작업하는 모든 AI agent의 진입점입니다. Codex,
Claude Code, Cursor 등 도구와 관계없이 적용합니다.

## Start here

파일을 변경하기 전에 아래 순서로 읽습니다.

1. 이 문서
2. [Conventions index](CONVENTIONS.md)
3. [AI behavior rules](docs/ai-rules.md)
4. 작업에 해당하는 문서
   - `web/`, `admin/`, `maeil-mail/` React UI 코드:
     [frontend coding standards](docs/frontend-coding-standards.md)
   - `app/` React Native UI 코드: app/AGENTS.md와 작업 대상의 인접 구현
   - Commit message: [git commit convention](docs/git-commit-convention.md)
   - Pull request review: [architecture map](docs/architecture.md)과 관련 workspace 규칙을
     읽습니다. Claude Code PR review workflow의 유지·수정·장애 확인은
     `ai-review-workflow` skill을 사용합니다.
   - Workspace 작업: 아래 표에서 대상 workspace를 찾고 해당 AGENTS.md 확인
5. 아래 '작업 범위 파악' 순서로 관련 code, configuration, test를 확인

작업에 필요한 문서만 읽고 적용합니다. Workspace별 AGENTS.md는 해당 package의
경로·명령·생성 규칙을 안내하며, 공통 AI 행동 정책은 docs/ai-rules.md를 따릅니다.

## Workspace 선택

사용자가 경로를 지정했다면 그 경로의 workspace부터 시작합니다. 경로 없이 서비스나
기능을 언급했다면 아래 표를 사용합니다.

| 작업 단서 | 먼저 읽을 문서 | 탐색 시작 경로 |
| --- | --- | --- |
| 웹 화면, 웹 client, web/의 기능·버그 | web/AGENTS.md | web/src/ |
| 모바일, Expo, React Native, app/의 기능·버그 | app/AGENTS.md | app/app/, app/components/, app/apis/ |
| 어드민, dashboard, admin/의 기능·버그 | admin/AGENTS.md | admin/src/ |
| 매일메일, maeil-mail/의 기능·버그 | maeil-mail/AGENTS.md | maeil-mail/src/ |
| 공유 UI, theme, utility, web과 app의 공통 코드 | shared/AGENTS.md | shared/src/ |
| web/admin/maeil-mail의 OpenAPI type output | 해당 workspace의 AGENTS.md | 각 workspace의 src/types/openapi.d.ts |
| shared generated API 또는 oas-gen generator 코드 | shared/oas-gen/AGENTS.md와 web/AGENTS.md | shared/src/core/apis/generated/, shared/oas-gen/src/ |
| routeTree.gen.ts 등 workspace별 generated output | 해당 workspace의 AGENTS.md | 변경된 output, webpack/vite router configuration |
| 둘 이상의 workspace에 걸친 기능 | 관련된 모든 workspace AGENTS.md와 docs/architecture.md | 요청에서 직접 언급된 workspace부터 |

어느 workspace인지 분명하지 않으면 먼저 feature 이름, route, component, API endpoint를
검색해 후보를 좁힙니다. 후보가 둘 이상이고 선택에 따라 사용자 동작이나 data contract가
달라지면 그때만 확인합니다.

## 작업 범위 파악

넓은 directory 전체를 먼저 읽지 않습니다. 다음 순서로 필요한 파일만 좁혀 갑니다.

1. 사용자가 지정한 file, error, screen, feature 이름, issue의 대상을 찾습니다.
2. 대상 workspace의 AGENTS.md와 package.json에서 실행 명령과 생성 규칙을 확인합니다.
3. 대상의 entry point와 가장 가까운 구현을 봅니다.
   - 화면·route 작업: route 또는 page와 그 component
   - 기능·bug 작업: 해당 symbol의 호출부와 직접 의존성
   - API 작업: request를 만드는 code, 사용 중인 type, 관련 generated file 또는 generator
4. 대상과 가장 가까운 test, story, mock, 또는 E2E scenario가 있으면 함께 확인합니다.
5. 수정 범위가 확인된 뒤에만 추가 의존성이나 다른 workspace로 탐색을 넓힙니다.

이 순서는 읽기 범위를 정하는 기준이며, 실제 수정은 요청된 파일과 요청 완료에 직접
필요한 파일로 제한합니다.

## Repository overview

BomBom은 pnpm monorepo입니다.

- web/ — React/TypeScript web client; web/AGENTS.md 참고
- app/ — React Native mobile client
- admin/ — Admin dashboard web client
- maeil-mail/ — Daily Mail web client
- shared/ — web/과 app/이 사용하는 theme, UI component, utility
- shared/oas-gen/ — 공유 generated API file을 위한 OpenAPI module generator

## Git workflow

Commit message를 준비하거나 검토할 때만 docs/git-commit-convention.md를 읽습니다.
모든 package의 branch와 PR에는 아래를 적용합니다.

- dev에서 branch를 만들고 PR target은 dev입니다.
- Branch 형식: {type}/{issue_key} (예: feat/BOM-5)
- PR title: [{issue_key}] {type}: {subject}
- develop에는 Squash & Merge, main에는 Create a Commit으로 merge합니다.
