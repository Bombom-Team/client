---
name: ai-review-workflow
description: Manage the Bombom client Claude PR review workflow (채팅 요청과 PR 이벤트 cloud routine 모두 포괄). This skill is the ONLY way to invoke a Claude PR review — the old `/codex-review` slash command and Codex review workflow have been removed. CodeRabbit auto-review is configured separately in `.coderabbit.yaml`. Use this skill whenever the user asks to review a PR with the team's standard format, post review comments, change review behavior, review comment format, inline review style, generated-file exclusions, approve/request-changes behavior, mock-test review output, resolve/unresolved tracking, or to diagnose review Action failures in this repository.
---

# PR Review Workflow (skill-only)

이 스킬은 Bombom client PR 리뷰의 **유일한 invocation 경로**다. `/codex-review`
슬래시 커맨드와 `workflow_dispatch` 같은 수동 트리거는 제거되었다
(`codex-review.yml` 파일도 삭제). PR 리뷰는 Claude(수동)가 이 스킬을 통해
직접 진행하며, 게시는 `publish-codex-review.sh`를 로컬에서 실행해서 한다.

Use this skill for changes around:

- `.github/codex-review-output-schema.json` (review JSON 스키마)
- `.github/scripts/publish-codex-review.sh` (공용 publisher)
- `.ai/review/REVIEW.md` (리뷰 정책 원본, 리뷰 시 필수)
- `.ai/review/false-positives.md` (알려진 오탐)
- `.coderabbit.yaml` (CodeRabbit이 같은 리뷰 정책을 읽는 경로)

The goal is to keep the PR review bot high signal, readable, and safe.
GitHub 게시가 명시적으로 요청된 경우에만 comment/approve review를 게시한다.
일반 대화에서의 검토 요청은 채팅 안에서 결과만 전달하며, findings가 0개여도
게시용 summary를 만들지 않는다.

## Reviewer Identity

publisher(`.github/scripts/publish-codex-review.sh`)는 `REVIEWER` env로 게시 라벨을 정한다.
이 skill로 게시할 때는 `REVIEWER=claude`로 호출한다. `REVIEWER`가 바꾸는 문구와 기본값은
publisher의 `REVIEWER` 처리 부분을 직접 읽는다.

reviewer와 관계없이 바꾸지 않는 계약:

- `<!-- CODEX_REVIEW_COMMENT -->` inline marker — 이전 리뷰 이슈 추적 키
- 파일명 / 스키마 / 호출 계약 (`REVIEW_JSON`, `REPOSITORY`, `PR_NUMBER`, `HEAD_SHA`)
- review event 결정 로직 — publisher가 소유 (아래 "Review Event Decision")

## Required Repo Rules

Before editing, read:

1. `.ai/RULES.md` (AI behavior rules)
2. `.ai/CONVENTIONS.md` (코드 컨벤션 전체)
3. `docs/architecture.md` — 워크스페이스 경계·인증·API·WebView·알림 동작 지도
4. `docs/git-commit-convention.md` before committing

Keep scope tight. Do not touch frontend code while working on review workflow
formatting unless the user explicitly asks.

## Current Design

- **Invocation**: 오직 이 스킬을 통해서만 리뷰가 시작된다. 단, 요청은 두 모드로
  구분한다.
  - **채팅 검토(기본)**: `이 PR 리뷰해줘`, `리뷰 포인트 봐줘`, PR URL만 전달 같은
    요청은 diff와 컨텍스트를 분석하고 결과를 이 채팅에만 전달한다. GitHub API write,
    publisher 실행, workflow dispatch를 하지 않는다.
  - **GitHub 게시(명시적 opt-in)**: 사용자가 같은 요청에서 `PR에 리뷰 게시해줘`,
    `GitHub에 코멘트 달아줘`, `승인 리뷰 남겨줘`처럼 외부 게시를 분명히 요청할 때만
    structured review JSON과 publisher를 사용한다.
- Claude가 PR diff·메타데이터를 직접 분석해 `.github/codex-review-output-schema.json`
  스키마에 맞는 JSON을 로컬에 작성하는 것은 **GitHub 게시 모드에서만** 필요하다
  (`codex-review-output.json`).
- `.github/scripts/publish-codex-review.sh`가 그 JSON을 GitHub review body와
  inline comment로 변환해 게시한다. `REVIEWER=claude`로 호출하면 Claude 라벨로
  표시된다.
- 게시는 Claude가 로컬에서 publisher를 실행하고, publisher가 `gh api`로 직접 한다.
- `.github/workflows/codex-review.yml`(Codex 자동 리뷰 워크플로우)은 **삭제됨**.
  과거에는 `/codex-review` 코멘트나 workflow_dispatch로 OpenAI Codex를 호출해
  리뷰를 생성했으나, 현재는 스킬 단일 진입점으로 통합되었다.

## Hard Constraints

- 사용자의 현재 메시지에 GitHub 게시 의사가 명시되어 있지 않으면 절대 publisher,
  `gh api` write 요청, `gh workflow run`을 실행하지 않는다. 채팅 검토 결과만
  반환한다. 과거 대화에서의 게시 요청이나 기본 스킬 동작으로 게시 권한을 추론하지
  않는다.
- Never publish `REQUEST_CHANGES`.
- `APPROVE`는 직접 지정하지 않는다. event는 publisher가 결정한다 (아래 "Review Event
  Decision" 참조).
- Only `critical` and `major` findings should become inline comments.
- `minor` findings should appear in the review summary `### 참고` section.
- `.ai/review/REVIEW.md`의 "리뷰 제외 파일"은 리뷰하지 않는다.
- Keep `<!-- CODEX_REVIEW_COMMENT -->` in inline comments — 이전 리뷰 thread를
  식별하는 키. reviewer가 Codex/Claude 어느 쪽이어도 동일.
- Preserve `<!-- REVIEW_META ... -->` because follow-up workflows and future
  learning loops may parse it. `source` 필드는 `REVIEWER` env 값을 그대로 반영한다.
- **리뷰 산출물(`codex-review-output.json` 등)은 ephemeral이다. 절대 커밋하거나
  PR로 만들지 않는다.** 리뷰 결과는 오직 publisher가 게시하는 PR 코멘트로만
  남는다. 산출 JSON은 scratch 디렉터리(레포 밖, 예: `$TMPDIR`/`/tmp`)에 쓰고,
  레포 워킹트리에는 어떤 변경도 남기지 않는다. 이 스킬은 코드를 수정하지 않는다
  (리뷰 대상 코드 fix·리팩터 금지 — finding으로만 보고).
  - **클라우드 라우틴(schedule/cron) 컨텍스트 주의**: 라우틴 환경은 세션 종료 시
    워킹트리 변경을 자동 커밋·PR화한다. 리뷰 JSON을 레포 루트에 쓰면 이것이
    "아티팩트 보관 PR"로 쓸려 들어간다 (과거 `claude/epic-*` 브랜치의 리뷰
    아티팩트 PR이 이 경로로 생성됨). 반드시 레포 밖 경로에 산출물을 두고,
    `git status`가 clean인 상태로 세션을 마친다.

## Review Event Decision

review event(`COMMENT`·`APPROVE`)와 게시 실패 시 fallback은 publisher가 결정한다. 조건은 이
문서에 옮겨 적지 않으므로 publisher의 `EVENT` 결정 블록과 게시 retry 블록을 직접 읽는다.
정책을 바꿀 때도 publisher의 해당 블록만 수정한다.

호출하는 쪽이 지켜야 할 것:

- PR 이벤트로 도는 자동 리뷰(cloud routine)는 `ALLOW_APPROVE=false`로 호출한다. 자동 리뷰가
  routine 소유자 계정의 승인으로 집계되지 않게 하기 위함이다.
- `REQUEST_CHANGES`는 게시하지 않는다.

## Review Output Format

review body, inline comment, 심각도 라벨, `### 이전 리뷰 이슈 추적`, findings 0개일 때의
summary, `<!-- REVIEW_META -->` 형식은 publisher가 생성한다. 형식은 이 문서에 옮겨 적지 않으며,
publisher를 직접 읽거나 아래 "Mock Format Testing"으로 생성 결과를 확인한다. 리뷰어는
`.github/codex-review-output-schema.json`에 맞는 JSON만 작성한다.

## PR Review Procedure

본 스킬이 PR 리뷰의 **유일한 진입점**이다. 사용자가 다음과 같이 말하면 이 절차를 실행한다:

- `Bombom-Team/client#240 리뷰해줘`
- `이 PR에 코멘트 달아줘`
- `스킬 실행해서 리뷰 남겨줘`

공용 계약:

1. Review produces a structured review JSON (matches
   `.github/codex-review-output-schema.json`). **레포 밖 scratch 경로**에 쓴다
   (예: `"${TMPDIR:-/tmp}/codex-review-output.json"`). 레포 루트에 두지 않는다 —
   클라우드 라우틴의 auto-commit/auto-PR이 이를 쓸어 담아 불필요한 아티팩트
   PR을 만든다. `.gitignore`에도 등록돼 있지만 1차 방어는 "레포 밖에 쓰기"다.
2. `.github/scripts/publish-codex-review.sh` converts that JSON into the review
   body, inline comments, metadata, and GitHub API request.

Procedure:

0. 산출물 경로를 먼저 정한다. 이 스킬은 리뷰 게시만 하고 **워킹트리에 변경을
   남기지 않는다.**

   ```bash
   REVIEW_JSON="${TMPDIR:-/tmp}/codex-review-output.json"
   ```

1. Resolve the PR repository and number. Default to `Bombom-Team/client` when
   the user only provides a number or this repository is implied.

2. Fetch PR metadata:

   ```bash
   gh pr view <number-or-url> --repo Bombom-Team/client --json number,title,body,baseRefName,headRefName,baseRefOid,headRefOid,isDraft,url
   ```

3. Inspect only the PR-introduced diff. `.ai/review/REVIEW.md`의 "리뷰 제외 파일" 목록을
   `:(glob,exclude)<pattern>` pathspec으로 바꿔 제외한다:

   ```bash
   git diff --find-renames --diff-filter=ACMRTUXB <base>...<head> -- \
     ':(glob,exclude)<REVIEW.md의 각 패턴>'
   ```

4. **컨텍스트 수집 — diff만 보고 리뷰하지 않는다.** finding을 확정하기 전에 head 기준
   실제 코드를 읽는다:
   - 리뷰 정책 `.ai/review/REVIEW.md`와 오탐 목록 `.ai/review/false-positives.md`를
     읽는다. 무엇을 지적하고 무엇을 지적하지 않을지는 REVIEW.md가 원본이다.
   - `web/`·`admin/`·`maeil-mail/` 변경이면 `.ai/CONVENTIONS.md`의 Frontend coding standards에서 변경 유형에
     해당하는 절을 읽는다. 구현 AI와 같은 규칙 원본이다. 규칙 위반은 절 제목 링크로 인용한다.
   - `docs/architecture.md`를 읽고 관련 워크스페이스의 동작 계약을 파악한다.
   - PR body의 의도와 `👀 Review Point`를 확인한다.
   - 변경 파일은 hunk뿐 아니라 파일 전체를 읽는다: `git show <head>:<path>`.
   - 변경된 export·hook·API·공용 type의 호출처를 추적한다:
     `git grep -n '<symbol>' <head> -- web app admin maeil-mail shared`.
   - 같은 워크스페이스·도메인의 이웃 구현 1~2개와 비교한다. 다른 워크스페이스의
     우연히 같은 이름인 구현을 표준으로 오인하지 않는다.
   - 이전 AI 리뷰가 있으면 답글과 resolve 상태를 읽고 반박된 finding을 반복하지 않는다.

5. Review high-signal issues only:
   - Comment only on likely production issues, security problems, data
     corruption risks, broken user flows, or severe maintainability risks.
   - Do not comment on generated files, style nits, formatting, subjective
     naming, unchanged code, or speculative refactors.
   - Only report issues introduced by the PR diff.
   - **Repository-specific high-signal areas** (근거는 `docs/architecture.md`와 실제 코드):
     - `shared` fetcher·generated API·theme·WebView union 변경 후 소비처 누락.
     - WebView message 송수신 한쪽만 변경, 브라우저 optional guard 제거, 로그인 분기 파손.
     - cookie 인증을 bearer/local storage로 잘못 전제하거나 최초 profile probe를 상시
       route guard로 오인한 변경.
     - mutation invalidation 누락, 워크스페이스별 retry/cache 정책 혼동, 공용 `ApiError`
       대신 axios 오류 shape 전제.
     - FCM의 memberId/deviceUuid/token 연결, notificationType→route mapping, listener cleanup
       중 하나가 빠진 변경.
     - admin 외부 adapter를 공용 API로 오인하거나 Supabase lazy 초기화를 깨는 변경.
   - **제네릭 필터**: 아무 React/React Native 모노레포에도 성립하는 코멘트면 버리거나,
     실제 호출 흐름·워크스페이스 계약·file:line 근거를 붙여 서비스 특화 finding으로
     다시 쓴다. 일반론 체크리스트는 게시하지 않는다.

6. Decide comment placement:
   - `critical` and `major`: inline comments when the path and changed line are
     valid.
   - `minor`: summary only.
   - If a finding cannot be tied to a valid changed line, keep it in the
     summary instead of forcing an inline comment.
   - **채팅 검토 모드**에서는 여기서 멈추고 findings와 근거를 채팅에 반환한다.
     JSON을 쓰거나 PR 코멘트를 게시하지 않는다.
   - **GitHub 게시 모드**에서는 findings가 0개여도 publisher가
     `> ✅ 확실하게 수정이 필요한 항목을 찾지 못했습니다.` summary를 자동으로
     채우므로 step 8까지 진행한다.

7. **GitHub 게시 모드에서만** review result를 scratch `$REVIEW_JSON` (step 0,
   레포 밖)에 쓴다. `.github/codex-review-output-schema.json`을 사용한다.
   **레포 루트에 쓰지 않는다.** 본문·inline 형식과 marker는 publisher가 만든다
   ("Review Output Format").

8. **GitHub 게시 모드에서만 publisher를 실행해 PR 코멘트를 게시한다.**
   `REVIEWER=claude`로 로컬 publisher를 실행한다. 셸 변수는 다음 명령으로 이어지지 않을 수
   있으므로 `REVIEW_JSON`에 step 0과 같은 경로를 직접 지정한다:

   ```bash
   REVIEW_JSON="${TMPDIR:-/tmp}/codex-review-output.json" \
   REPOSITORY=Bombom-Team/client \
   PR_NUMBER=<pr-number> \
   HEAD_SHA=<head-sha> \
   REVIEWER=claude \
   bash .github/scripts/publish-codex-review.sh
   ```

9. If inline publishing fails because of invalid positions or paths, retry once
   with `comments: []` so the summary is still posted. The shared publisher
   already performs this fallback; tell the user which inline comments could not
   be attached if the logs reveal that detail.

10. **마무리: 워킹트리를 clean 상태로 남긴다.** 게시 후 `git status --short`가
   비어 있어야 한다. 리뷰용 산출물이 워킹트리에 남았다면 삭제한다. 이 스킬은
   커밋·브랜치·PR을 만들지 않는다 — 클라우드 라우틴에서 auto-PR로 쓸려 들어가는
   것을 막기 위함이다.

Never publish mock findings as a real PR review. Never publish `REQUEST_CHANGES`.
`APPROVE`는 직접 지정하지 않고 publisher의 조건부 결정에만 맡긴다. Avoid posting a duplicate review for the same head commit
unless the user explicitly asks.

## Architecture Learning Loop

1. finding이 사람 답글로 반박·정정되면 발생 조건과 반례를 `.ai/review/false-positives.md`에
   남긴다. 다른 리뷰어가 놓친 실제 이슈는 구현 규칙이면 `.ai/CONVENTIONS.md`의 Frontend coding standards,
   리뷰 기준이면 `.ai/review/REVIEW.md`에 재현 근거와 함께 반영한다. 반복 회귀는
   테스트로 옮기는 것을 우선한다.
2. 실제 회귀가 확인된 영역만 repository-specific high-signal 목록에 추가한다. 일반론으로
   목록을 희석하지 않는다.
3. 리뷰 중 `docs/architecture.md`와 코드가 어긋나면 코드를 기준으로 리뷰하고 사용자에게
   architecture 문서 갱신을 별도 제안한다.
4. `<!-- REVIEW_META -->` finding id와 `<!-- CODEX_REVIEW_COMMENT -->` 마커는 과거 finding
   추적 키이므로 유지한다.

## Generated File Exclusions

리뷰 제외 대상의 원본은 `.ai/review/REVIEW.md`의 "리뷰 제외 파일"이다. 목록을 바꾸면
설정 파일이라 참조가 불가능한 `.coderabbit.yaml`의 `path_filters`도 함께 수정한다.

## Mock Format Testing

포맷 변경(publisher / 스킬) 검증은 로컬에서 mock JSON으로만 수행한다.
실 PR에 mock review를 게시하지 않는다.

1. 임시 mock JSON 작성 (스키마: `.github/codex-review-output-schema.json`):
   - one `major` with `condition`, `impact`, `evidence`, `suggestion`
   - two `minor`, one of them with `body`만 있는 구 형식
   - `review_points` with `ok`, `issue`, `unverified` one each, and `verification`
   - optional `previous_issues` with one `resolved` and one `open`

2. 가짜 repo/PR/SHA로 publisher 실행. `gh api` 호출은 실패하지만 그 전에
   `$OUTPUT_DIR/codex-review-body.md`, `codex-review-comments.jsonl`이 생성되므로
   파일을 cat으로 검수한다:

   ```bash
   REVIEW_JSON=/tmp/mock.json \
   REPOSITORY=fake/repo PR_NUMBER=1 HEAD_SHA=abcdef1234567890 \
   OUTPUT_DIR=/tmp REVIEWER=claude \
   bash .github/scripts/publish-codex-review.sh || true
   cat /tmp/codex-review-body.md
   cat /tmp/codex-review-comments.jsonl
   ```

3. `REVIEWER` env를 바꿔가며 codex/claude 두 라벨이 모두 정상 치환되는지 확인.

4. findings 배열을 `[]`로 만들어도 body가 정상 생성되는지 확인 (always-post 보장).

5. 절대 실 PR을 대상으로 mock 결과를 게시하지 않는다.

## Diagnosing Failed Runs

Use:

```bash
gh run view <run-id> --repo Bombom-Team/client --json status,conclusion,event,headBranch,headSha,displayTitle,createdAt,updatedAt,jobs
gh run view <run-id> --repo Bombom-Team/client --job <job-id> --log
```

Common failures:

- `GitHub Actions is not permitted to approve pull requests`: publisher가
  조건부 APPROVE를 시도했으나 GHA가 거절. publisher가 자동으로 `COMMENT`로
  fallback해 재시도하므로 게시 자체는 성공한다. 영구 해결은 Org/Repo의
  "Allow GitHub Actions reviews to approve pull requests" 설정을 켜는 것.
- Inline review failed then body-only fallback: likely invalid `path`, line, or
  range. Ensure `absolute_file_path` is normalized to repo-relative path before
  publishing. The publisher performs this normalization automatically.

## Verification

publisher / SKILL 수정 시 최소 검증:

```bash
bash -n .github/scripts/publish-codex-review.sh
git diff --check
rg -n "REQUEST_CHANGES" .github/scripts/publish-codex-review.sh
```

`REQUEST_CHANGES`는 절대 등장하면 안 된다. `APPROVE`는 publisher의 조건부 로직과
fallback 안에서만 등장하는지 직접 확인 (`grep -n APPROVE
.github/scripts/publish-codex-review.sh`).

Publisher 회귀는 위 "Mock Format Testing" 절차로 codex/claude 두 모드와 다음
케이스를 한 번씩 돌려본다:

- findings 다수 → event `COMMENT`
- findings 0개 + `overall_correctness: "patch is correct"` → event `APPROVE`
- findings 0개 + `overall_correctness: "patch is incorrect"` → event `COMMENT`
  (가드: incorrect 판정이면 0개여도 approve 안 함)

Repository-wide frontend lint/stylelint may fail on pre-existing frontend files.
Do not fix unrelated frontend files while working on this workflow unless the
user asks.

## Commit Guidance

Use focused commits. Good examples:

- `fix: PR 리뷰 형식 개선`
- `fix: PR 리뷰 게시 조건 정리`
- `feat: PR 리뷰 publisher reviewer 라벨 분기 추가`
- `test: PR 리뷰 포맷 mock 추가` for temporary format tests only

After successful staging/commit, report the commit hash and any verification
that could not be completed.
