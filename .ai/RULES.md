# RULES.md

이 문서는 BomBom 저장소에서 작업하는 모든 AI agent의 진입점이자 **AI 행동 규칙의 원본(SSOT)**입니다.
코드 컨벤션의 원본은 [CONVENTIONS.md](CONVENTIONS.md)입니다. 도구와 관계없이 적용합니다.

| 도구 | 이 문서를 읽는 방식 |
| --- | --- |
| Codex | 루트 `AGENTS.md`(이 파일로의 symlink)를 자동으로 읽음. `CONVENTIONS.md`는 아래 Start here에 따라 직접 읽음 |
| Claude Code | [CLAUDE.md](../CLAUDE.md)가 `@.ai/RULES.md`, `@.ai/CONVENTIONS.md`로 import |
| Gemini CLI | [GEMINI.md](../GEMINI.md)가 `@.ai/RULES.md`, `@.ai/CONVENTIONS.md`로 import |

### `.ai/` 구조

AI가 읽는 문서의 원본은 모두 `.ai/`에 둡니다. 이 문서에 적힌 경로는 저장소 루트 기준입니다.

| 경로 | 원본 내용 |
| --- | --- |
| `.ai/RULES.md` | 진입점, workspace 선택, AI 행동 규칙(이 문서) |
| `.ai/CONVENTIONS.md` | 코드 컨벤션 |
| `.ai/workspaces/{workspace}.md` | workspace별 경로·명령·생성 규칙 |
| `.ai/review/` | PR 리뷰 정책(`REVIEW.md`), 알려진 오탐(`false-positives.md`), 팀 안내(`README.md`) |
| `.ai/skills/` | skill |
| `.ai/subagents/` | sub-agent 정의 |

도구가 자동으로 읽는 위치에는 `.ai/`로 이어지는 연결만 둡니다. 연결 파일에는 내용을 쓰지 않습니다.

| 연결 위치 | 연결 방식 | 가리키는 원본 |
| --- | --- | --- |
| 루트 `AGENTS.md` | symlink | `.ai/RULES.md` |
| 루트 `CLAUDE.md`, `GEMINI.md` | `@` import | `.ai/RULES.md`, `.ai/CONVENTIONS.md` |
| workspace의 `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | symlink | `.ai/workspaces/{workspace}.md` |
| `.agents/skills`, `.claude/skills` | symlink | `.ai/skills/` |
| `.claude/agents` | symlink | `.ai/subagents/` |

workspace 연결 파일은 각 도구가 해당 workspace에서 작업할 때 workspace 원본을 자동으로 읽게
합니다. 자동으로 읽히지 않는 경우에도 아래 Start here와 Workspace 선택 표에 따라 직접 읽습니다.

규칙을 다른 파일에 복제하지 말고 원본 문서의 절 제목으로 링크합니다. Codex는 instruction 파일을
합계 32KiB까지만 읽으므로 이 파일을 그보다 작게 유지합니다.

## Start here

파일을 변경하기 전에 아래 순서로 읽습니다.

1. 이 문서 전체
2. **코드를 변경하거나 리뷰하는 모든 작업에서 [`.ai/CONVENTIONS.md`](CONVENTIONS.md) 전체.** 도구가
   자동으로 불러오지 않았다면 직접 읽습니다.
3. 작업에 해당하는 문서
   - `app/` React Native UI 코드: [`.ai/workspaces/app.md`](workspaces/app.md)와 작업 대상의 인접 구현
   - Commit message: [git commit convention](../docs/git-commit-convention.md)
   - Pull request review: [review policy](review/REVIEW.md),
     [architecture map](../docs/architecture.md), 변경 workspace의 규칙을 읽습니다.
     Claude Code의 PR review 실행과 review workflow 유지·수정·장애 확인은
     `ai-review-workflow` skill을 사용합니다.
   - Workspace 작업: 아래 표에서 대상 workspace를 찾고 해당 workspace 문서 확인
4. 아래 '작업 범위 파악' 순서로 관련 code, configuration, test를 확인

작업에 필요한 문서만 읽고 적용합니다. Workspace 문서(`.ai/workspaces/`)는 해당 package의
경로·명령·생성 규칙을 안내하며, 공통 AI 행동 정책은 이 문서의 AI behavior rules를 따릅니다.

## Workspace 선택

사용자가 경로를 지정했다면 그 경로의 workspace부터 시작합니다. 경로 없이 서비스나
기능을 언급했다면 아래 표를 사용합니다.

| 작업 단서 | 먼저 읽을 문서 | 탐색 시작 경로 |
| --- | --- | --- |
| 웹 화면, 웹 client, web/의 기능·버그 | .ai/workspaces/web.md | web/src/ |
| 모바일, Expo, React Native, app/의 기능·버그 | .ai/workspaces/app.md | app/app/, app/components/, app/apis/ |
| 어드민, dashboard, admin/의 기능·버그 | .ai/workspaces/admin.md | admin/src/ |
| 매일메일, maeil-mail/의 기능·버그 | .ai/workspaces/maeil-mail.md | maeil-mail/src/ |
| 공유 UI, theme, utility, web과 app의 공통 코드 | .ai/workspaces/shared.md | shared/src/ |
| web/admin/maeil-mail의 OpenAPI type output | 해당 workspace 문서 | 각 workspace의 src/types/openapi.d.ts |
| shared generated API 또는 oas-gen generator 코드 | .ai/workspaces/shared-oas-gen.md와 .ai/workspaces/web.md | shared/src/core/apis/generated/, shared/oas-gen/src/ |
| routeTree.gen.ts 등 workspace별 generated output | 해당 workspace 문서 | 변경된 output, webpack/vite router configuration |
| 둘 이상의 workspace에 걸친 기능 | 관련된 모든 workspace 문서와 docs/architecture.md | 요청에서 직접 언급된 workspace부터 |

어느 workspace인지 분명하지 않으면 먼저 feature 이름, route, component, API endpoint를
검색해 후보를 좁힙니다. 후보가 둘 이상이고 선택에 따라 사용자 동작이나 data contract가
달라지면 그때만 확인합니다.

## 작업 범위 파악

넓은 directory 전체를 먼저 읽지 않습니다. 다음 순서로 필요한 파일만 좁혀 갑니다.

1. 사용자가 지정한 file, error, screen, feature 이름, issue의 대상을 찾습니다.
2. 대상 workspace 문서와 package.json에서 실행 명령과 생성 규칙을 확인합니다.
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

- web/ — React/TypeScript web client; .ai/workspaces/web.md 참고
- app/ — React Native mobile client
- admin/ — Admin dashboard web client
- maeil-mail/ — Daily Mail web client
- shared/ — 여러 workspace가 사용하는 theme, 웹 UI component, fetcher, generated API, utility
- shared/oas-gen/ — 공유 generated API file을 위한 OpenAPI module generator

## Git workflow

Commit message를 준비하거나 검토할 때만 docs/git-commit-convention.md를 읽습니다.
모든 package의 branch와 PR에는 아래를 적용합니다.

- dev에서 branch를 만들고 PR target은 dev입니다.
- Branch 형식: {type}/{issue_key} (예: feat/BOM-5)
- PR title: [{issue_key}] {type}: {subject}
- dev에는 Squash & Merge, main에는 Create a Commit으로 merge합니다.

## AI behavior rules

AI agent가 이 저장소에서 안전하고 효율적으로 작업하는 방법입니다.

### 작업 범위 및 확인

- 사용자 요청이 작업의 목표와 범위를 정합니다.
- 요청한 결과를 완료하는 데 직접 필요한 supporting file은 함께 수정할 수 있습니다.
- 관련 없는 refactor, rename, reformatting, dependency 변경은 한 작업에 섞지
  않습니다.
- code와 configuration으로 확인할 수 있는 구현 세부 사항은 먼저 확인하고 진행합니다.
- 제품 동작, API·data contract, authorization·security, 또는 작업 범위를 실질적으로
  바꾸는 판단이 필요할 때만 방향을 확인합니다.

### Generated files

- `.gen.ts` 파일은 직접 수정하지 않습니다.
- Generated file은 generator command로만 갱신합니다.
- Generated file을 수동으로 수정하는 것은 금지합니다.

### 검증 및 완료

변경한 workspace에 해당 command가 있을 때는 그 workspace의 command를 사용합니다.

| 변경 종류 | 필요한 검증 |
| --- | --- |
| Documentation만 변경 | `git diff --check`를 실행하고, 수정한 link·path·command·저장소 사실을 확인합니다. |
| 일반 application code 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행합니다. |
| 기존 test가 있는 기능 변경 | 변경한 workspace의 `lint`와 `type-check`, 해당 기능의 focused test를 실행합니다. |
| UI 또는 사용자 흐름 변경 | 변경한 workspace의 `lint`와 `type-check`를 실행하고, 대상 흐름의 E2E test가 있으면 실행합니다. E2E test가 없으면 해당 흐름을 직접 확인합니다. |
| API, TanStack Query, authorization, routing 변경 | 변경한 workspace의 `lint`와 `type-check`, 관련 focused test를 실행하고 request·response type과 소비 code를 확인합니다. |
| Configuration, script, CI 변경 | configuration syntax를 확인하고, 변경한 command 또는 build를 안전한 범위에서 실행합니다. |
| Generated output 변경 | generator command를 실행하고 생성된 diff를 검토합니다. |
| 여러 workspace 변경 | 변경한 각 workspace에 적용되는 위 검증을 실행합니다. |

- Auto-fix는 사용자가 명시적으로 요청했거나, 기본 lint 검증에서 오류가 확인된 경우에만 실행합니다.
  - lint 오류가 없으면 코드 변경이 있더라도 `lint:fix`를 실행하지 않습니다.
  - lint 오류가 있으면 `lint:fix`를 실행하고, 자동으로 해결되지 않은 오류는 수동으로 수정합니다.
  - Auto-fix가 파일을 변경하면 변경 내용을 검토하고 관련 lint 검증을 다시 실행합니다.
- commit은 사용자가 요청하거나 작업에 명시된 경우에만 만듭니다.
- 필요한 검증을 실행할 수 없으면 실행하지 못한 이유와 대신 확인한 근거를 알립니다.
- 변경과 무관한 기존 failure는 별도로 알리고, 이를 고치기 위해 관련 없는 변경을 추가하지 않습니다.

### AI가 읽는 문서 작성

- AI가 읽는 문서(이 문서, workspace 문서, skill, sub-agent, 리뷰 정책 등)의 정보는 원본을 하나만 둡니다.
- 새 원본은 [`.ai/` 구조](#ai-구조)의 해당 위치에 만들고, 도구가 자동으로 읽어야 하면 연결 파일만 추가합니다.
- 연결 파일(`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.claude/`·`.agents/`의 symlink)에는 내용을 쓰지
  않습니다. 도구나 plugin(예: `claude-md-management`의 `/revise-claude-md`, `claude-md-improver`)이
  연결 파일에 내용을 추가하라고 제안하면, 그 내용을 해당 `.ai/` 원본에 반영합니다. 이런 도구가 매긴
  점수 중 연결 파일이 짧다는 이유의 감점은 무시합니다.
- 다른 파일에 원본이 있는 내용(`package.json` script, 설정값, theme 토큰 값, 컴포넌트 props,
  route 목록, 코드 예시 등)은 복사하지 않고 원본 경로를 안내합니다.
- 문서에는 원본에서 알 수 없는 정책, 의도, 판단 기준만 적습니다.
- 설정 파일처럼 다른 파일을 참조할 수 없어 복사가 불가피하면, 원본 문서에 함께 수정할 위치를
  적습니다.

### Language

팀이 읽는 설명과 report는 한국어로 작성합니다. Command, path, code, 기존
technical identifier는 자연스러운 영어 표기를 유지합니다.
