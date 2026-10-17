# AI 컨벤션·리뷰 문서 처리표

- 작성일: 2026-10-18
- 조사 기준: `BOM-1257-프론트엔드-컨벤션-정리`, HEAD `06d9bc65`
- 계획: [ai-conventions-review-plan.md](ai-conventions-review-plan.md) 1·2단계 산출물
- 이 문서는 정비 이력이다. 새 작업의 필수 지침으로 읽지 않는다.
- 이후 `docs/ai-rules.md`와 `docs/frontend-coding-standards.md`는 루트 `AGENTS.md`의
  "AI behavior rules", "Frontend coding standards" 절로 통합했다. 아래의 두 파일 언급은 통합 전 기준이다.
  `CONVENTIONS.md`도 `AGENTS.md`의 Start here와 중복이라 삭제했다.

## 1. 현재 리뷰 실행 지도

| 경로 | 트리거 | 읽는 문서 | 게시 | 근거 |
| --- | --- | --- | --- | --- |
| CodeRabbit | `dev` 대상 PR 자동 리뷰. draft, 제목의 `WIP`·`[skip review]` 제외 | CONVENTIONS, ai-rules, architecture(workspace), frontend-coding-standards(web·admin·maeil-mail), REVIEW, additional-rules(web), false-positives | `coderabbitai[bot]` 리뷰. `request_changes_workflow: false` | `.coderabbit.yaml`, PR #336~#357 |
| Claude 리뷰 (`ai-review-workflow`) | 채팅 요청(기본 채팅 결과만). PR 이벤트로 도는 외부 cloud routine | 정비 전: 절차상 architecture만. REVIEW는 "선택적 참조" | 게시 모드에서 `publish-codex-review.sh`. COMMENT 또는 조건부 APPROVE | SKILL.md, PR #333·#356·#357 (`sanghee01`, COMMENTED, `🤖 Claude PR Review`) |
| `codex-review-publish.yml` | `workflow_dispatch` 전용 | 없음 | publisher 실행. `REVIEWER`·`ALLOW_APPROVE`를 넘기지 않아 codex 라벨·APPROVE 허용 | 실행 이력 0회 |
| PR CI | `frontend-pr-ci`(web·shared paths), `maeil-mail-pr-ci` | — | lint·type-check. build 비활성, test 미실행, admin·app CI 없음 | `.github/workflows/*-ci-base.yml` |
| 필수 check·승인 | — | — | classic protection 없음(404). ruleset `dev`·`main`은 `include: []`라 어떤 branch에도 적용되지 않음 | `gh api .../rules/branches/{dev,main}` = `[]` |

README가 안내하던 `codex-review.yml`(a0e59130, #242에서 삭제), `codex-resolve.yml`
(94b13aa8, #250에서 삭제), `/codex-review` 코멘트는 모두 현재 동작하지 않는다.
README가 기본 리뷰라고 적은 Codex 내장 리뷰는 최근 40개 PR에서 관찰되지 않았다.

## 2. 파일별 처리표

처리: 유지 / 수정 / 통합 / 보관 / 삭제. "처리 결과"는 이번 정비에서 실제로 한 일이다.

### `.review-learnings/`

| 파일 | 역할·소비처 | 고유 내용 | 충돌 | 처리 | 처리 결과·근거 |
| --- | --- | --- | --- | --- | --- |
| `README.md` | 팀원 안내. 자동 소비처 없음 | 초기 규칙 출처(2025-bom-bom PR 코멘트 분석), REVIEW_META 보존 요청 | 없는 workflow·명령·secret 안내. CodeRabbit·routine 누락 | 수정 | 현재 실행 경로 기준으로 재작성 |
| `REVIEW.md` | CodeRabbit `**/*`. 리뷰 스킬 | 런타임·비즈니스 로직 체크, Review Point 처리, 스킵 목록, 심각도, 배경지식, 훅 반환값 메모화, 단일 책임 | § 번호 9곳 불일치(#313의 §6 삽입 이후 미갱신). 우선순위 문구가 CONVENTIONS를 규칙 상위로 둠. "스타일·네이밍 지적 금지"와 경로별 네이밍 규칙이 내부 충돌 | 수정 | 구현 규칙은 컨벤션 원본 링크로 대체, 리뷰 정책만 유지 |
| `additional-rules.md` | CodeRabbit `web/**/*` | queryKey 누락, `\|\|`/`??`, 파생 계산, 하드코딩 URL, msw 동기화, theme token, console, a11y | 폐기된 `agent-prompts/` 전제. 질문형 요구가 REVIEW의 약한 제안 금지와 충돌 | 통합 | 실측을 통과한 규칙은 컨벤션으로, 검출 조건은 REVIEW로 이전 후 삭제. `.coderabbit.yaml` 동반 수정 |
| `patterns.md` | 소비처 없음(CodeRabbit·스킬 모두 미포함) | 판단형 패턴 13개 | 구 § 번호. `isPC`를 props로 내리지 말라는 내용이 컨벤션 §15와 충돌. 상수화 제안이 REVIEW와 충돌 | 통합 | 유효 항목만 컨벤션·REVIEW로 이전 후 삭제 |
| `false-positives.md` | CodeRabbit `{web,admin,maeil-mail}/**/*` | flex 컨텍스트의 `width: 100%` 반례 | 폐기된 agent 이름 라벨 | 유지·수정 | 라벨 정리 |
| `archived-patterns.md` | README만 링크 | 없음(빈 양식) | — | 삭제 | 실기록 0건 |
| `attribution-log.md` | README만 링크 | Outcome 정의 accepted/modified/dismissed/ignored | 집계 0건 | 삭제 | Outcome 정의는 [평가 사례](ai-review-eval-cases.md)로 이전 |
| `agent-prompts/*` (4개) | v3 workflow용. 현재 workflow·script·skill 소비처 없음 | PR Scope 강제, Grep→Read로 실제 호출 확인, cross-file 주장 증거 게이트 | 없는 `claude-review-v3.yml`·`/claude-review`·code-graph 전제. 무조건 APPROVE | 삭제 | 유효 원칙은 REVIEW "근거 기준"으로 이전 |
| `archive/orchestrator-runbook.md` | 소비처 없음 | v2 폐기 이유: 자연어로 병렬 호출을 지시해도 100 run 중 실제 병렬 0회 | 없는 workflow 전제 | 삭제 | 결정 이력은 아래 4절에 보존. 원문은 git 이력(`06d9bc65`) |

### 스킬·agent

| 파일 | 역할·소비처 | 충돌 | 처리 | 처리 결과·근거 |
| --- | --- | --- | --- | --- |
| `.agents/skills/ai-review-workflow/SKILL.md` | Claude 자동 로딩, 외부 routine | APPROVE 3중 상충(:47 항상 COMMENT, :94 조건부, :356 Never). 없는 `codex-resolve.yml` 참조. 리뷰 절차에 REVIEW·컨벤션 로딩 없음 | 수정 | publisher 동작(조건부 APPROVE + `ALLOW_APPROVE`)을 단일 정책으로 기술, stale 참조 제거, 문서 로딩 단계 추가 |
| `.agents/skills/design-planner/bombom-design-guide.md` | design-planner agent | 없는 `shared/src/theme.ts`, `web/CLAUDE.md` 참조 | 수정 | 실제 경로로 갱신 |
| `.agents/skills/pr-body/SKILL.md` | 자동 로딩 | 없는 "AGENTS.md §12" 참조 | 수정 | 절 이름 링크로 갱신 |
| `.agents/skills/product-planner/context.md` | product-planner, update-context | 로그인·읽기·랜딩 화면을 "추후 예정"으로 표기했으나 route는 2025-07~12에 생김 | 4단계 | 출시 여부·기획 의도 확인 필요. 이번에는 변경하지 않음 |
| `.claude/skills` | `../.agents/skills` symlink | — | 유지 | 중복 파일 아님 |
| `.claude/agents/*`, `skill-creator/**`, `update-context`, `product-planner/SKILL.md`, `design-planner/SKILL.md` | 각 스킬 | — | 유지 | — |

### 진입·컨벤션 문서

| 파일 | 충돌 | 처리 | 처리 결과·근거 |
| --- | --- | --- | --- |
| `AGENTS.md` | PR review 안내에 REVIEW·컨벤션 없음. "develop에는 Squash"(원격 branch는 `dev`) | 수정 | PR review 안내 연결, branch 이름 정정 |
| `CONVENTIONS.md` | PR review 행에 REVIEW 없음 | 수정 | REVIEW 연결 |
| `docs/frontend-coding-standards.md` | import 순서 문구가 ESLint groups와 다름. "ESLint/Stylelint 만족"이나 `lint`는 ESLint만 실행 | 수정 | 3절 참고 |
| `docs/git-commit-convention.md` | type 목록에 `ci` 없음(실제 커밋은 사용) | 기록 | 팀 결정 필요. 이번에는 변경하지 않음 |
| `docs/ai-rules.md`, `docs/architecture.md`, `docs/README.md`, `docs/용어사전.md`, workspace AGENTS | 경미한 명령 누락(admin·app) | 유지 | — |
| `docs/superpowers/plans/2026-06-17-auto-reviewer-frontend.md` | AI 리뷰 정책과 무관한 기능 계획 | 보관 | 변경 없음 |

### `.github/`

| 파일 | 소비처 | 처리 | 처리 결과·근거 |
| --- | --- | --- | --- |
| `.coderabbit.yaml` | CodeRabbit | 수정 | 삭제·통합한 문서 경로를 같은 변경에서 갱신 |
| `scripts/publish-codex-review.sh` | 스킬, routine | 유지 | — |
| `workflows/codex-review-publish.yml` | 스킬 안내. 실행 0회 | 유지 | 승인 정책 입력 부재를 미해결로 기록 |
| `codex-review-output-schema.json` | 스킬 | 기록 | `previous_issues`가 없고 `additionalProperties: false`. publisher·스킬 mock은 사용. 계약 변경이라 별도 작업 |
| `scripts/aggregate-findings.sh` | 없음(runbook 텍스트만) | 삭제 | v3 workflow는 merge되지 않음. 2026-05-22 삭제된 branch에서 1회 실행·실패 |
| `scripts/render_pr_review.py` | 없음(runbook 텍스트만) | 삭제 | v2 `claude-review.yml`은 b54fd6d1(#239)에서 삭제. 최근 routine 게시 footer는 publisher 형식이며 render 형식(`/claude-review로 재실행`)이 아님 |
| `actions/setup-code-graph/` | 참조 0건 | 삭제 | composite action은 이 저장소 workflow에서만 호출 가능하며 호출 workflow 없음 |

## 3. 충돌 목록과 결론

| 충돌 | 결론 |
| --- | --- |
| APPROVE 정책 3중 상충 | publisher를 원본으로 둔다. 조건부 APPROVE, `ALLOW_APPROVE=false`면 항상 COMMENT, REQUEST_CHANGES 금지 |
| 구현 AI와 리뷰 AI의 원본 불일치 | 스킬 리뷰 절차에 REVIEW·frontend-coding-standards 로딩 추가 |
| 리뷰 문서에만 있는 구현 규칙 | web 코드 실측 결과로 컨벤션 등록 또는 폐기([Frontend coding standards](../AGENTS.md#frontend-coding-standards)) |
| 지적 기준 상충(질문형 제안 vs 약한 제안 금지) | REVIEW 기준으로 통일: 근거 있는 규칙 위반·동작 버그만 지적 |
| § 번호 복사 | 절 번호 대신 절 제목 링크로 인용 |
| `isPC` props 금지(patterns) vs §15 | §15 유지. patterns 항목 폐기 |

## 4. 결정 이력 (삭제 파일에서 보존)

- v2 오케스트레이터는 자연어로 sub-agent 병렬 호출을 지시했지만 100 run에서 실제 병렬
  호출이 0회였다. 그래서 v3는 workflow matrix로 병렬화를 옮겼고, v3도 merge되지 않은 채
  현재의 단일 스킬 + publisher 구조로 정리됐다. (`archive/orchestrator-runbook.md`)
- 초기 `additional-rules.md`·`patterns.md`·`false-positives.md`는
  `woowacourse-teams/2025-bom-bom` PR 코멘트 2,100여 개 분석으로 작성됐다. (`README.md`)

## 5. 미확인 사항

- 외부 cloud routine의 prompt, 실행 주기, `ALLOW_APPROVE` 실제 값.
- CodeRabbit 대시보드 설정이 `.coderabbit.yaml`을 덮어쓰는지.
- GitHub Actions에 파일 없이 active로 남은 workflow 등록(`PR Review Agent v3`,
  `deploy.yml`, `pr-notify.yml`, `pr-review-notify.yml`). 저장소 관리자가 비활성화 여부를 정한다.
- ruleset `dev`·`main`의 대상 branch가 빈 것이 의도인지. AI 리뷰만으로 merge하는 정책을
  정하기 전에 확인해야 한다.
- `chromatic.yml`의 trigger branch `client`가 원격에 없음(범위 밖).
- root `package.json`의 `web:generate-openapi-types`가 web에 없는 script를 호출(범위 밖).

## 6. 컨벤션 실측 결과

`web/src`의 `.ts`/`.tsx`를 대상으로 측정했다(생성 파일·`*.d.ts` 제외, 규칙에 따라 test·stories·mocks
제외). "신규"는 2026-04-18 이후 새로 만든 파일이다. 같은 기간에 font token rename(#197,
168 files) 같은 일괄 수정이 있어 "변경 파일" 기준은 전체와 거의 같으므로 신규 파일 기준을 쓴다.

판정 기준:

- 제거: 전체 준수율 50% 미만이고 신규 파일에서도 따르지 않음.
- 등록: 문서에 없고 전체·신규 모두 약 80% 이상이며 lint·prettier가 강제하지 않음.
- 경계: 70~80%이거나 추세가 엇갈림. 등록하지 않음.

측정 스크립트는 작업 세션의 임시 경로에서 실행했고 저장소에 포함하지 않았다. 재측정 방법은
항목별 기준(모집단, 판정 regex)을 따른다.

### 제거한 규칙

| 규칙 | 전체 | 신규 | 근거 |
| --- | --- | --- | --- |
| atomic design 원칙 | 측정 불가 | — | atoms/molecules/organisms 구조가 web·shared 어디에도 없음 |
| 하위 styled는 `~Wrapper`(중간)·`~Box`(작은 단위) | 19.1% (279/1459) | 10.7% | 실제는 Title·Button·Text 등 역할 suffix 174종 |
| 객체·배열 의존성은 `JSON.stringify` | 4.9% (2/41) | 0% | 사용한 2곳 모두 `exhaustive-deps`를 끔. lint와 충돌 |
| mutation 훅 어순 `use{What}{Action}` | 22.9% (8/35) | 4/9 | Action 앞 22, What 앞 8, Action 없음 5. suffix 규칙만 유지 |
| mutation에 "항상" 로딩·성공·실패 피드백 | 21% (8/38, 휴리스틱) | — | 낙관적·무음 mutation이 다수. 사용자가 결과를 기다리는 mutation으로 범위 한정 |

### 실제 코드에 맞게 고친 규칙

| 규칙 | 실측 | 수정 |
| --- | --- | --- |
| route `function` 선언 예외의 이유 | route 49개 중 41개가 Route를 위에 두고 아래에 `function X` | "프레임워크 제약" → 선언 순서에 따른 hoisting |
| route 파일 export | default export 0/49 | `export const Route`만 내보내는 예외 추가(#220) |
| 페이지 상수 위치 `pages/{page}/utils` | `pages/{page}/constants/` 12개, `src/constants/` 5개 | constants·hooks·types 폴더 반영 |
| useQuery는 `queries.*`만 | 엄격 88.9%, factory 경유 100%(inline 0건) | shared generated `*Queries`도 factory로 인정 |
| import 순서 "external → internal → relative" | 문구대로는 0/143, ESLint config대로 100% | `import/order` 설정 기준으로 서술 |
| "ESLint/Stylelint 만족" | `lint`·CI는 ESLint만 실행. Stylelint 위반 2개 파일(10월 PR) | Stylelint 실행 경로 명시 |
| 크기 4의 배수 | 원값 80.4%, 선 두께 제외 89.3% | `1px`·`2px` 선 두께 예외 명시 |
| 공용 fetcher | web 100% | admin 외부 adapter 예외를 architecture 링크로 명시 |

### 등록한 규칙 (문서에 없던 실제 관례)

| 규칙 | 전체 | 신규 |
| --- | --- | --- |
| 페이지 본체는 route 파일, `pages/{page}/`에는 하위 폴더만 | 35/38 (92%), 16/17 (94%) | 92% |
| `{domain}.query.ts`는 `{domain}Queries`를 export하고 `apis/queries.ts`에 등록 | 17/17 | 100% |
| factory 항목은 `queryOptions` 계열, 이름은 `get` 없는 명사형 | 75/75, 69/69 | 100% |
| factory 인자는 모두 `queryKey`에 포함 | 52/52 | 100% |
| cache 조작 key는 factory에서 파생 | 48/55 (87%) | 76% (위반 7건 중 5건이 `articles.cache.ts` 한 파일) |
| API 함수 접두사 = HTTP method | 84/87 (97%) | 100% |
| `{Fn}Params`/`{Fn}Response` export, fetcher generic 명시 | 92/105 (88%), 65/66 | 88%, 100% |
| mutation 훅은 `hooks/`에 두고 `return useMutation(...)` | 35/38, 34/35 | 100% |
| mutation 실패 피드백은 `toast.error` | onError가 있는 훅 21/23 (91%) | 100% |
| styled prop에 `$` 없음, inline generic 타입 | 421/423, 423/423 | 98~100% |
| `css` prop·helper 미사용, 정적 inline style 미사용 | 346/346, 340/346 | 100% |
| JSX에 raw HTML 대신 styled component | 248/272 (91%) | 97% |
| 색상은 `theme.colors`(box-shadow 예외) | 선언 1077/1157 (93%) | 98% |
| styled 안 theme은 `${({ theme }) => ...}` | 232/234 | 98% |
| `font-size` 대신 `theme.fonts`, z-index는 `theme.zIndex` | 717/750 (96%), 45/51 (88%) | 93%, 83% |
| 기능 루트 안은 상대경로, 밖은 `@/` | 1698/1835 (93%) | 96% |
| SVG는 `#/assets/svg/kebab-name.svg` | 148/150 | 97% |
| UPPER_SNAKE_CASE 상수, enum 미사용 | 91/91, 23/26, enum 0건 | 100%, 89% |
| `hooks/` 파일은 `use*.ts`, 여러 값은 객체 반환(useState 대체 훅 제외) | 104/104, 38/41 | 100%, 89% |
| 공용 컴포넌트 `src/components/{Name}/{Name}.tsx`, Skeleton은 옆에, barrel 없음 | 56/56, 17/19 | 100% |
| Modal은 `useModal()` + `Modal` | 19/21 (90%) | 100% |
| 테스트는 대상 옆 `{name}.test.ts(x)`, Jest `describe`/`it`, 한국어 서술 | 21/23 (91%) | 89% |
| props 구조분해, 컴포넌트 파일명 PascalCase | 168/175, 294/296 | 100% |
| `as any` 미사용 | 생성 파일 외 0건 | — |

### 유지한 규칙 중 기준 미달·판단 필요

| 규칙 | 실측 | 판단 |
| --- | --- | --- |
| 내부 핸들러 `handle*` | 74.5% (108/145), 2026-08-31 이후 신규 90% | 유지. 신규 코드는 따름. `react/jsx-handler-names`로 강제 가능 |
| props 콜백 `on*` | 약 71% (87/122). 비준수 37개 중 17개가 `closeModal` | 유지. `closeModal`을 예외로 둘지 결정 필요 |
| 커스텀 훅 반환 함수 메모화 (REVIEW에서 이동) | 30개 중 21개 (70%), 신규 6/8 | 기존 팀 규칙이라 유지하며 원본만 이동. 유지 여부 결정 필요 |
| 컴포넌트·훅 단일 책임 (REVIEW에서 이동) | 측정 불가 | 기존 팀 규칙이라 원본만 이동 |
| 훅 `export const` | 66.4% (77/116), 2026-08-31 이후 신규 100% | 유지. mutation 훅도 const 22 : default 12 |
| `isMobile` = `device !== 'pc'` | `isMobile` 57건 중 51건이 `=== 'mobile'` 의미 | 문서 정의와 다수 사용이 다름. 결정 필요, 이번에는 변경하지 않음 |
| Storybook은 디자인 시스템 컴포넌트에만 | web story 26개 모두 대상 밖, shared에 Storybook 설정 없음 | 2026-08-31 결정이며 이후 신규 story 0개. 유지 |

### 등록하지 않은 후보

| 후보 | 실측 | 이유 |
| --- | --- | --- |
| route `head` title `'봄봄 \| …'` | 29/38 (76%), 신규 46% | 기준 미달 |
| API 타입을 `*.api.ts` alias로만 소비 | 79%, 신규 91% | 경계(상승 추세) |
| `return await fetcher.*` | 76%, 신규 44% | 하락 |
| children을 `PropsWithChildren`로 | 14/18 | 표본 작음 |
| Props 외 타입은 `type` | 72%, 신규 48% | 하락 |
| 상수 객체 `as const` | 30% | 기준 미달 |
| 페이지 컴포넌트 `XxxPage` 이름 | 43% | 기준 미달 |
| theme import 경로 통일 | `@bombom/shared` 27 : `@bombom/shared/theme` 30 | 반반 |
| import 순서, type import 분리, CSS 속성 순서, 포맷 | — | ESLint·Stylelint·prettier가 강제 |

### 함께 발견한 사항 (이번에 변경하지 않음)

- web에서 import하는 곳이 없는 훅 6개: `src/hooks/useFocusTrap.ts`, `useKeydownEscape.ts`,
  `useMediaQuery.ts`, `useScrollLock.ts`, `useScrollVisible.ts`, `useThrottle.ts`.
- 컴포넌트에서 `useMutation`을 직접 호출하는 곳: `components/Header/ProfileDetail.tsx`,
  `components/PetCard/PetCard.tsx`, `pages/my-page/components/ProfileSection.tsx`.
- 한 page가 다른 page 내부 모듈을 import하는 경우 41건. 대부분
  `pages/challenge/landing` → `pages/landing/hooks/useScrollVisible.ts`(9건).
