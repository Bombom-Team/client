---
name: codex-review-workflow
description: Manage the Bombom client PR review workflow shared by Codex (자동) and Claude (수동). Use this skill whenever the user asks to review a PR with the team's standard format, post review comments, change review behavior, review comment format, inline review style, generated-file exclusions, approve/request-changes behavior, mock-test review output, resolve/unresolved tracking, or to diagnose review Action failures in this repository.
---

# PR Review Workflow (Codex + Claude)

Use this skill for changes around `.github/workflows/codex-review.yml`,
`.github/workflows/codex-resolve.yml`, `.github/codex-review-output-schema.json`,
`.github/scripts/publish-codex-review.sh`, and `.review-learnings/REVIEW.md`.
Also use it when the user asks Codex (자동) or Claude (수동) to review a Bombom
client PR and post GitHub review comments in the same shared format.

The goal is to keep the custom PR review bot high signal, readable, and safe:
it should post comments only, never approve or request changes, and the output
should look identical between Codex 자동 워크플로우와 Claude 수동 리뷰 —
오직 reviewer 라벨과 footer 텍스트만 다르다.

## Reviewer Identity

The shared publisher (`publish-codex-review.sh`) accepts a `REVIEWER` env
(default `codex`). Set `REVIEWER=claude` when Claude is the manual reviewer.
This swaps the user-facing reviewer label in:

- Review body header / no-output fallback
- `📋 검증 과정` wording
- Inline comment `**<Reviewer> 검증**:` prefix
- Footer (codex shows `/codex-review로 재실행`, others show `수동 리뷰`)
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

- Codex 자동 워크플로우는 `/codex-review` 또는 `workflow_dispatch`로 트리거.
- The workflow checks out the PR merge commit.
- It syncs review tooling from the default branch so old PRs can use the latest
  schema and review rules.
- It prepares `codex-review-prompt.md` from PR metadata, repo instructions,
  review learnings, changed files, and unified diff.
- `openai/codex-action@v1` writes `codex-review-output.json` (Codex 자동).
  Claude 수동 리뷰는 같은 스키마로 직접 JSON을 작성한다.
- `.github/scripts/publish-codex-review.sh` converts the structured review
  output into the GitHub review body and inline comments. `REVIEWER` env
  controls reviewer 라벨 (default `codex`).
- `.github/workflows/codex-review-publish.yml` can publish a locally generated
  `codex-review-output.json` through GitHub Actions without calling OpenAI or
  `openai/codex-action`.
- The Codex 자동 워크플로우와 Claude 수동 경로 둘 다 같은 시퀀스를 따른다:
  review the PR, write structured review JSON, then call the shared publish
  script.

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
Footer 마지막 줄은 reviewer별로 분기된다 (아래 예시 참조).

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

<!-- codex: -->

<sub>🤖 Codex PR Review | `/codex-review`로 재실행</sub>

<!-- claude (or other reviewers): -->

<sub>🤖 {REVIEWER_LABEL} PR Review | 수동 리뷰</sub>
```

Omit `### 이전 리뷰 이슈 추적` when no previous issue data exists. The workflow
should tolerate `.previous_issues` being absent by using `(.previous_issues // [])`.

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

## Manual PR Review Posting

Use this path when the user says things like:

- `Bombom-Team/client#240 리뷰해줘`
- `이 PR에 코멘트 달아줘`
- `스킬 실행해서 리뷰 남겨줘`

Do not copy review-publishing logic out of the workflow YAML. The common
contract is:

1. Review produces `codex-review-output.json`.
2. `.github/scripts/publish-codex-review.sh` converts that JSON into the review
   body, inline comments, metadata, and GitHub API request.

Procedure:

1. Resolve the PR repository and number. Default to `Bombom-Team/client` when
   the user only provides a number or this repository is implied.

2. Fetch PR metadata:

   ```bash
   gh pr view <number-or-url> --repo Bombom-Team/client --json number,title,body,baseRefName,headRefName,baseRefOid,headRefOid,isDraft,url
   ```

3. Inspect only the PR-introduced diff. Exclude generated and lock files using
   the same pathspecs as the workflow:

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

7. **반드시 publisher를 실행해 PR 코멘트를 게시한다.** Claude 수동 모드에서는
   `REVIEWER=claude`로 로컬 publisher를 직접 실행하는 경로가 가장 직관적이다
   (publish-only 워크플로우는 현재 `reviewer` input이 없어 default `codex`로 게시됨):

   ```bash
   REVIEW_JSON=codex-review-output.json \
   REPOSITORY=Bombom-Team/client \
   PR_NUMBER=<pr-number> \
   HEAD_SHA=<head-sha> \
   REVIEWER=claude \
   bash .github/scripts/publish-codex-review.sh
   ```

   Codex 자동 워크플로우는 `REVIEWER`를 전달하지 않으므로 default `codex`로 게시된다.

   GitHub Actions가 게시까지 맡게 하고 싶다면 publish-only 워크플로우:

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

When the user asks to test formatting:

1. Temporarily disable the real Codex action:

   ```yaml
   - name: Run Codex structured review
     if: ${{ false }}
   ```

2. Add a temporary `Write mock Codex review output` step that writes
   `codex-review-output.json`.

3. Use changed files and changed lines from the target PR so inline comments can
   attach successfully.

4. Include mock data for:
   - one `major`
   - two `minor`
   - optional `previous_issues` with one `resolved` and one `open`

5. Commit this as a temporary test commit only when the user explicitly wants to
   run the Action.

6. After the user confirms the format, remove the mock step, restore the real
   Codex action condition, and amend or replace the test commit with a real
   workflow-format commit.

Never leave mock review output enabled in the final workflow.

## Diagnosing Failed Runs

Use:

```bash
gh run view <run-id> --repo Bombom-Team/client --json status,conclusion,event,headBranch,headSha,displayTitle,createdAt,updatedAt,jobs
gh run view <run-id> --repo Bombom-Team/client --job <job-id> --log
```

Common failures:

- Missing schema file: old PR checkout did not contain
  `.github/codex-review-output-schema.json`. Fix by syncing review tooling from
  the default branch before running Codex.
- `GitHub Actions is not permitted to approve pull requests`: workflow attempted
  `APPROVE`. Fix by forcing `EVENT="COMMENT"`.
- Inline review failed then body-only fallback: likely invalid `path`, line, or
  range. Ensure `absolute_file_path` is normalized to repo-relative path before
  publishing. The common publisher performs this normalization.
- Unexpected reads such as webpack/babel config: these are Codex read-only
  investigation commands, not workflow prompt input. Tighten prompt instructions
  if needed, but remember the action can still inspect the repo unless the
  workspace is restricted.

## Verification

For workflow-only changes, at minimum run:

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/codex-review.yml"); puts "yaml ok"'
bash -n .github/scripts/publish-codex-review.sh
git diff --check
rg -n "APPROVE|REQUEST_CHANGES|Write mock|if: \\$\\{\\{ false \\}\\}" .github/workflows/codex-review.yml
```

If mock testing was involved, confirm the final workflow has no mock step and the
real Codex action uses:

```yaml
if: steps.pr.outputs.should_skip != 'true'
```

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
