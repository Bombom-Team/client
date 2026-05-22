---
name: codex-review-workflow
description: Manage the Bombom client Codex PR review GitHub Actions workflow and manual Codex-style PR reviews. Use this skill whenever the user asks to review a PR, post review comments, change Codex review behavior, review comment format, inline review style, generated-file exclusions, approve/request-changes behavior, mock-test review output, resolve/unresolved tracking, or to diagnose Codex review Action failures in this repository.
---

# Codex Review Workflow

Use this skill for changes around `.github/workflows/codex-review.yml`,
`.github/workflows/codex-resolve.yml`, `.github/codex-review-output-schema.json`,
and `.review-learnings/REVIEW.md`. Also use it when the user asks Codex to
manually review a Bombom client PR and, when requested, post GitHub review
comments in the same format as the workflow.

The goal is to keep the custom Codex review bot high signal, readable, and safe:
it should post comments only, never approve or request changes, and it should
look similar to the team's preferred Claude review format.

## Required Repo Rules

Before editing, read:

1. `CONVENTIONS.md`
2. `docs/ai-rules.md`
3. `docs/git-commit-convention.md` before committing

Keep scope tight. Do not touch frontend code while working on review workflow
formatting unless the user explicitly asks.

## Current Design

- Review is triggered manually by `/codex-review` or `workflow_dispatch`.
- The workflow checks out the PR merge commit.
- It syncs review tooling from the default branch so old PRs can use the latest
  schema and review rules.
- It prepares `codex-review-prompt.md` from PR metadata, repo instructions,
  review learnings, changed files, and unified diff.
- `openai/codex-action@v1` writes `codex-review-output.json`.
- The publish step converts Codex structured output into GitHub review body and
  inline comments.

## Hard Constraints

- Never publish `APPROVE`.
- Never publish `REQUEST_CHANGES`.
- Always use review event `COMMENT`.
- Only `critical` and `major` findings should become inline comments.
- `minor` findings should appear in the review summary `### 참고` section.
- Generated OpenAPI type declarations and lock files should not be reviewed.
- Keep `<!-- CODEX_REVIEW_COMMENT -->` in inline comments because the resolve
  workflow uses it to identify Codex review threads.
- Preserve `<!-- REVIEW_META ... -->` because follow-up workflows and future
  learning loops may parse it.

## Preferred Review Body Format

Use this structure, matching the team's preferred Claude-style summary:

```md
## 🤖 PR Review

> 📌 Force-push 후 재리뷰: 이전 리뷰의 미해결 이슈를 추적합니다.

> ⚠️ 수정이 필요한 리뷰 코멘트가 있습니다.

> Overall explanation from Codex.

🚨 **0** Critical · ⚠️ **1** Major · 📝 **2** Minor

### 이전 리뷰 이슈 추적
| ID | 상태 | 심각도 | 파일 | 이슈 |
|----|------|--------|------|------|
| f1 | ✅ 해결 | major | path/to/file.ts:10 | issue title |
| f2 | ❌ 미해결 | minor | path/to/file.ts:20 | issue title |

### 수정 필요
- **path/to/file.ts:10** — Major issue title (인라인 코멘트 참조).

### 참고
- **path/to/file.ts:20** — Minor issue title
  Minor explanation.

<details><summary>📋 검증 과정</summary>

- Codex structured review 결과 중 확신도가 있는 항목만 정리했습니다.
- Critical/Major는 inline comment로 게시하고, Minor는 참고 항목으로 summary에 포함합니다.
- 자동 생성된 OpenAPI 타입 선언 파일과 lock 파일은 리뷰 대상에서 제외합니다.

</details>

<!-- REVIEW_META
...
-->

---
<sub>🤖 Codex PR Review | `/codex-review`로 재실행</sub>
```

Omit `### 이전 리뷰 이슈 추적` when no previous issue data exists. The workflow
should tolerate `.previous_issues` being absent by using `(.previous_issues // [])`.

## Preferred Inline Comment Format

Use direct, readable inline comments rather than long agent prompts:

```md
⚠️ **[Major] Title**

Finding body.

**Codex 검증**: 변경 diff의 `path/to/file.ts:10-12` 기준으로 확인했습니다.
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
   - If there are no actionable findings, post a concise summary-only review
     only when the user explicitly asked to post to GitHub.

6. Build the review body with the Preferred Review Body Format and inline
   comments with the Preferred Inline Comment Format. Include
   `<!-- CODEX_REVIEW_COMMENT -->` in inline comments and `<!-- REVIEW_META ... -->`
   in the body.

7. Post with GitHub's review API using `COMMENT` only:

   ```bash
   jq -n \
     --rawfile body /tmp/codex-manual-review-body.md \
     --arg event COMMENT \
     --argjson comments "$(jq -s '.' /tmp/codex-manual-review-comments.jsonl)" \
     '{body:$body,event:$event,comments:$comments}' \
     > /tmp/codex-manual-review-payload.json

   gh api --method POST \
     "repos/Bombom-Team/client/pulls/$PR_NUMBER/reviews" \
     --input /tmp/codex-manual-review-payload.json
   ```

8. If inline publishing fails because of invalid positions or paths, retry once
   with `comments: []` so the summary is still posted, then tell the user which
   inline comments could not be attached.

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
  publishing.
- Unexpected reads such as webpack/babel config: these are Codex read-only
  investigation commands, not workflow prompt input. Tighten prompt instructions
  if needed, but remember the action can still inspect the repo unless the
  workspace is restricted.

## Verification

For workflow-only changes, at minimum run:

```bash
ruby -e 'require "yaml"; YAML.load_file(".github/workflows/codex-review.yml"); puts "yaml ok"'
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

- `fix: Codex 리뷰 형식 개선`
- `fix: Codex 리뷰 게시 조건 정리`
- `test: Codex 리뷰 포맷 mock 추가` for temporary format tests only

After successful staging/commit, report the commit hash and any verification
that could not be completed.
