---
name: ai-review-workflow
description: Manage the Bombom client PR review workflow used by AI reviewers (Codex 자동·Claude 수동 모두 포괄). This skill is the ONLY way to invoke a PR review — manual triggers like `/codex-review` slash command and workflow_dispatch have been removed. Use this skill whenever the user asks to review a PR with the team's standard format, post review comments, change review behavior, review comment format, inline review style, generated-file exclusions, approve/request-changes behavior, mock-test review output, resolve/unresolved tracking, or to diagnose review Action failures in this repository.
---

# PR Review Workflow (skill-only)

이 스킬은 Bombom client PR 리뷰의 **유일한 invocation 경로**다. `/codex-review`
슬래시 커맨드와 `workflow_dispatch` 같은 수동 트리거는 제거되었다
(`codex-review.yml` 파일도 삭제). PR 리뷰는 Claude(수동)가 이 스킬을 통해
직접 진행하며, 게시는 `publish-codex-review.sh`를 로컬에서 실행하거나
`codex-review-publish.yml`(publish-only workflow)을 dispatch하는 두 경로 중 하나로 한다.

Use this skill for changes around:

- `.github/workflows/codex-review-publish.yml` (스킬이 호출하는 publish-only workflow)
- `.github/workflows/codex-resolve.yml` (resolve 워크플로우, 마커 의존)
- `.github/codex-review-output-schema.json` (review JSON 스키마)
- `.github/scripts/publish-codex-review.sh` (공용 publisher)
- `.review-learnings/REVIEW.md` (리뷰 학습 메모, 선택적 참조)

The goal is to keep the PR review bot high signal, readable, and safe:
post comments only, never approve or request changes, and always post a review
(findings 0개여도 summary는 게시).

## Reviewer Identity

The publisher (`publish-codex-review.sh`) accepts a `REVIEWER` env
(default `codex`). 현재 invocation 경로상 실질적으로는 항상 `REVIEWER=claude`로
호출된다 (스킬이 유일한 진입점이고 Claude가 수동 리뷰어). `codex` default는
publish-only workflow가 reviewer input 없이 dispatch되는 경우 + 미래 Codex
재활성화 대비로 보존된다.

`REVIEWER`는 다음을 reviewer-aware로 치환한다:

- Review body header / no-output fallback
- `📋 검증 과정` wording
- Inline comment `**<Reviewer> 검증**:` prefix
- Footer (`<sub>🤖 {REVIEWER_LABEL} PR Review</sub>`)
- `<!-- REVIEW_META -->`의 `source` 필드와 finding id prefix

These conventions stay identical regardless of reviewer (do **not** change them):

- `<!-- CODEX_REVIEW_COMMENT -->` inline marker — `codex-resolve.yml`가 의존
- 파일명 / 스키마 / 호출 계약 (`REVIEW_JSON`, `REPOSITORY`, `PR_NUMBER`, `HEAD_SHA`)
- review event는 항상 `COMMENT`

## Required Repo Rules

Before editing, read:

1. `CONVENTIONS.md`
2. `docs/ai-rules.md`
3. `docs/git-commit-convention.md` before committing

Keep scope tight. Do not touch frontend code while working on review workflow
formatting unless the user explicitly asks.

## Current Design

- **Invocation**: 오직 이 스킬을 통해서만 리뷰가 시작된다. 사용자가
  `이 PR 리뷰해줘` 같이 요청하면 Claude가 본 스킬을 실행한다.
- Claude가 PR diff·메타데이터를 직접 분석해 `.github/codex-review-output-schema.json`
  스키마에 맞는 JSON을 로컬에 작성한다 (`codex-review-output.json`).
- `.github/scripts/publish-codex-review.sh`가 그 JSON을 GitHub review body와
  inline comment로 변환해 게시한다. `REVIEWER=claude`로 호출하면 Claude 라벨로
  표시된다.
- 게시 경로는 두 가지:
  1. **로컬 publisher 직접 실행** (권장): Claude가 로컬에서 publisher를 실행하고
     publisher가 `gh api`로 직접 게시.
  2. **publish-only workflow dispatch**: `.github/workflows/codex-review-publish.yml`이
     로컬에서 만든 JSON을 GitHub Actions 환경에서 publisher로 실행해 게시.
     OpenAI 호출 없음.
- `.github/workflows/codex-review.yml`(Codex 자동 리뷰 워크플로우)은 **삭제됨**.
  과거에는 `/codex-review` 코멘트나 workflow_dispatch로 OpenAI Codex를 호출해
  리뷰를 생성했으나, 현재는 스킬 단일 진입점으로 통합되었다.

## Hard Constraints

- Never publish `APPROVE`.
- Never publish `REQUEST_CHANGES`.
- Always use review event `COMMENT`.
- Only `critical` and `major` findings should become inline comments.
- `minor` findings should appear in the review summary `### 참고` section.
- Generated OpenAPI type declarations and lock files should not be reviewed.
- Keep `<!-- CODEX_REVIEW_COMMENT -->` in inline comments — `codex-resolve.yml`
  이 마커로 review thread를 식별. reviewer가 Codex/Claude 어느 쪽이어도 동일.
- Preserve `<!-- REVIEW_META ... -->` because follow-up workflows and future
  learning loops may parse it. `source` 필드는 `REVIEWER` env 값을 그대로 반영한다.

## Preferred Review Body Format

`{REVIEWER_LABEL}`은 `REVIEWER` env에 따라 publisher가 자동 치환한다 (Codex/Claude).

```md
## 🤖 PR Review

> 📌 Force-push 후 재리뷰: 이전 리뷰의 미해결 이슈를 추적합니다.

> ⚠️ 수정이 필요한 리뷰 코멘트가 있습니다.

> Overall explanation from {REVIEWER_LABEL}.

🚨 **0** Critical · ⚠️ **1** Major · 📝 **2** Minor

### 이전 리뷰 이슈 추적

| ID  | 상태      | 심각도 | 파일               | 이슈        |
| --- | --------- | ------ | ------------------ | ----------- |
| f1  | ✅ 해결   | major  | path/to/file.ts:10 | issue title |
| f2  | ❌ 미해결 | minor  | path/to/file.ts:20 | issue title |

### 수정 필요

- **path/to/file.ts:10** — Major issue title (인라인 코멘트 참조).

### 참고

- **path/to/file.ts:20** — Minor issue title
  Minor explanation.

<details><summary>📋 검증 과정</summary>

- {REVIEWER_LABEL} structured review 결과 중 확신도가 있는 항목만 정리했습니다.
- Critical/Major는 inline comment로 게시하고, Minor는 참고 항목으로 summary에 포함합니다.
- 자동 생성된 OpenAPI 타입 선언 파일과 lock 파일은 리뷰 대상에서 제외합니다.

</details>

<!-- REVIEW_META
...
-->

---

<sub>🤖 {REVIEWER_LABEL} PR Review</sub>
```

Omit `### 이전 리뷰 이슈 추적` when no previous issue data exists. The publisher
tolerates `.previous_issues` being absent by using `(.previous_issues // [])`.

When findings are empty (no critical/major/minor), the publisher still posts a
summary with `> ✅ 확실하게 수정이 필요한 항목을 찾지 못했습니다.` — **리뷰는
무조건 게시된다.**

## Preferred Inline Comment Format

Use direct, readable inline comments rather than long agent prompts.
`{REVIEWER_LABEL}` 토큰은 publisher가 `REVIEWER` env에 따라 치환한다.

```md
⚠️ **[Major] Title**

Finding body.

**{REVIEWER_LABEL} 검증**: 변경 diff의 `path/to/file.ts:10-12` 기준으로 확인했습니다.
실제 코드와 다르면 이 코멘트는 무시해 주세요. (confidence 0.92).

**수정 제안:**
이 finding이 여전히 유효한지 먼저 확인한 뒤, 관련 코드만 최소 범위로
수정하고 필요한 검증을 실행해 주세요.

<!-- CODEX_REVIEW_COMMENT -->
```

Severity labels:

- `critical` -> `🚨 **[Critical]`
- `major` -> `⚠️ **[Major]`
- `minor` -> `📝 **[Minor]` (normally summary only)

## PR Review Procedure

본 스킬이 PR 리뷰의 **유일한 진입점**이다. 사용자가 다음과 같이 말하면 이 절차를 실행한다:

- `Bombom-Team/client#240 리뷰해줘`
- `이 PR에 코멘트 달아줘`
- `스킬 실행해서 리뷰 남겨줘`

공용 계약:

1. Review produces `codex-review-output.json` (matches
   `.github/codex-review-output-schema.json`).
2. `.github/scripts/publish-codex-review.sh` converts that JSON into the review
   body, inline comments, metadata, and GitHub API request.

Procedure:

1. Resolve the PR repository and number. Default to `Bombom-Team/client` when
   the user only provides a number or this repository is implied.

2. Fetch PR metadata:

   ```bash
   gh pr view <number-or-url> --repo Bombom-Team/client --json number,title,body,baseRefName,headRefName,baseRefOid,headRefOid,isDraft,url
   ```

3. Inspect only the PR-introduced diff. Exclude generated and lock files
   per the same pathspecs documented in "Generated File Exclusions" below:

   ```bash
   git diff --find-renames --diff-filter=ACMRTUXB <base>...<head> -- \
     ':(exclude)pnpm-lock.yaml' \
     ':(exclude)*.gen.ts' \
     ':(exclude)*.generated.*' \
     ':(glob,exclude)**/openapi.d.ts' \
     ':(glob,exclude)**/generated/**/*.d.ts'
   ```

4. Review high-signal issues only:
   - Comment only on likely production issues, security problems, data
     corruption risks, broken user flows, or severe maintainability risks.
   - Do not comment on generated files, style nits, formatting, subjective
     naming, unchanged code, or speculative refactors.
   - Only report issues introduced by the PR diff.

5. Decide comment placement:
   - `critical` and `major`: inline comments when the path and changed line are
     valid.
   - `minor`: summary only.
   - If a finding cannot be tied to a valid changed line, keep it in the
     summary instead of forcing an inline comment.
   - **항상 PR 코멘트(리뷰)를 게시한다.** Findings가 0개여도 publisher가
     `> ✅ 확실하게 수정이 필요한 항목을 찾지 못했습니다.` summary를 자동으로
     채우므로, 스킬이 발동되면 무조건 step 7의 publisher 실행까지 진행한다.
     "찾은 게 없으니 안 올리고 끝"은 금지.

6. Write the review result to `codex-review-output.json` using
   `.github/codex-review-output-schema.json`. The shared publisher owns the
   Preferred Review Body Format, Preferred Inline Comment Format,
   `<!-- CODEX_REVIEW_COMMENT -->`, and `<!-- REVIEW_META ... -->`.

7. **반드시 publisher를 실행해 PR 코멘트를 게시한다.** 권장 경로는 `REVIEWER=claude`로
   로컬 publisher를 직접 실행하는 것이다:

   ```bash
   REVIEW_JSON=codex-review-output.json \
   REPOSITORY=Bombom-Team/client \
   PR_NUMBER=<pr-number> \
   HEAD_SHA=<head-sha> \
   REVIEWER=claude \
   bash .github/scripts/publish-codex-review.sh
   ```

   GitHub Actions가 게시까지 맡게 하고 싶다면 publish-only 워크플로우를
   dispatch한다 (현재 `reviewer` input이 없어 default `codex` 라벨로 게시됨):

   ```bash
   REVIEW_JSON_BASE64="$(base64 < codex-review-output.json | tr -d '\n')"
   gh workflow run codex-review-publish.yml \
     --repo Bombom-Team/client \
     --ref <default-branch> \
     -f pr_number=<pr-number> \
     -f head_sha=<head-sha> \
     -f review_json_base64="$REVIEW_JSON_BASE64" \
     -f source_workspace="$PWD"
   ```

   The publish-only workflow must not call OpenAI, must not use
   `OPENAI_API_KEY`, and must only decode the local structured review result
   and run `.github/scripts/publish-codex-review.sh`.

8. If inline publishing fails because of invalid positions or paths, retry once
   with `comments: []` so the summary is still posted. The shared publisher
   already performs this fallback; tell the user which inline comments could not
   be attached if the logs reveal that detail.

Never publish mock findings as a real PR review. Never publish `APPROVE` or
`REQUEST_CHANGES`. Avoid posting a duplicate review for the same head commit
unless the user explicitly asks.

## Generated File Exclusions

Keep both prompt diff exclusions and review policy aligned:

```bash
':(exclude)pnpm-lock.yaml'
':(exclude)*.gen.ts'
':(exclude)*.generated.*'
':(glob,exclude)**/openapi.d.ts'
':(glob,exclude)**/generated/**/*.d.ts'
```

Also mention generated OpenAPI type declarations in `.review-learnings/REVIEW.md`
under files that should not be reviewed.

## Mock Format Testing

포맷 변경(publisher / 스킬) 검증은 로컬에서 mock JSON으로만 수행한다.
실 PR에 mock review를 게시하지 않는다.

1. 임시 mock JSON 작성 (스키마: `.github/codex-review-output-schema.json`):
   - one `major`
   - two `minor`
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

- `GitHub Actions is not permitted to approve pull requests`: publisher attempted
  `APPROVE`. Fix by forcing `EVENT="COMMENT"` (already wired in script).
- Inline review failed then body-only fallback: likely invalid `path`, line, or
  range. Ensure `absolute_file_path` is normalized to repo-relative path before
  publishing. The publisher performs this normalization automatically.
- publish-only workflow가 reviewer 라벨을 codex로 표시: 의도된 동작.
  현재 `codex-review-publish.yml`은 `reviewer` input이 없어 default `codex`로 게시된다.
  Claude 라벨로 게시하려면 로컬 publisher (`REVIEWER=claude`) 경로를 사용한다.

## Verification

publisher / publish-only workflow / SKILL 수정 시 최소 검증:

```bash
bash -n .github/scripts/publish-codex-review.sh
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/codex-review-publish.yml"); puts "yaml ok"'
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/codex-resolve.yml"); puts "yaml ok"'
git diff --check
rg -n "APPROVE|REQUEST_CHANGES" .github/scripts/publish-codex-review.sh \
  .github/workflows/codex-review-publish.yml .github/workflows/codex-resolve.yml
```

Publisher 회귀는 위 "Mock Format Testing" 절차로 codex/claude 두 모드와 findings 0개
케이스를 한 번씩 돌려본다.

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
