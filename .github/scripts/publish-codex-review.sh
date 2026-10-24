#!/usr/bin/env bash
set -euo pipefail

REVIEW_JSON="${REVIEW_JSON:-codex-review-output.json}"
REPOSITORY="${REPOSITORY:?REPOSITORY is required}"
PR_NUMBER="${PR_NUMBER:?PR_NUMBER is required}"
HEAD_SHA="${HEAD_SHA:?HEAD_SHA is required}"
OUTPUT_DIR="${OUTPUT_DIR:-/tmp}"
# 자동 리뷰(cloud routine 등)에서는 ALLOW_APPROVE=false로 호출해 APPROVE 없이 항상 COMMENT로 게시한다.
ALLOW_APPROVE="${ALLOW_APPROVE:-true}"

REVIEWER="${REVIEWER:-codex}"
if [ -z "${REVIEWER_LABEL:-}" ]; then
  case "$REVIEWER" in
    codex)  REVIEWER_LABEL="Codex" ;;
    claude) REVIEWER_LABEL="Claude" ;;
    *)      REVIEWER_LABEL="$REVIEWER" ;;
  esac
fi

BODY_PATH="$OUTPUT_DIR/codex-review-body.md"
COMMENTS_PATH="$OUTPUT_DIR/codex-review-comments.jsonl"
PAYLOAD_PATH="$OUTPUT_DIR/codex-review-payload.json"
BODY_ONLY_PAYLOAD_PATH="$OUTPUT_DIR/codex-review-payload-body-only.json"

if [ ! -s "$REVIEW_JSON" ]; then
  gh pr comment "$PR_NUMBER" \
    --repo "$REPOSITORY" \
    --body "## ${REVIEWER_LABEL} PR Review\n\n${REVIEWER_LABEL} structured output was not produced. Check the workflow logs."
  exit 0
fi

jq '.' "$REVIEW_JSON" >/dev/null

NORMALIZED_REVIEW_JSON="$OUTPUT_DIR/codex-review-normalized.json"
jq --arg workspace "${GITHUB_WORKSPACE:-}" '
  def repo_path:
    . as $path
    | if ($workspace != "" and startswith($workspace + "/")) then
        ltrimstr($workspace + "/")
      elif ($workspace != "" and startswith($workspace)) then
        ltrimstr($workspace)
      else
        sub("^/home/runner/work/[^/]+/[^/]+/"; "")
      end
    | sub("^/"; "")
    | sub("^\\./"; "");

  .findings |= map(
    .code_location.relative_file_path = (
      .code_location.absolute_file_path | repo_path
    )
  )
' "$REVIEW_JSON" > "$NORMALIZED_REVIEW_JSON"
REVIEW_JSON="$NORMALIZED_REVIEW_JSON"

OVERALL="$(jq -r '.overall_correctness' "$REVIEW_JSON")"
EXPLANATION="$(jq -r '.overall_explanation' "$REVIEW_JSON")"
CRITICAL_COUNT="$(jq '[.findings[] | select(.severity == "critical")] | length' "$REVIEW_JSON")"
MAJOR_COUNT="$(jq '[.findings[] | select(.severity == "major")] | length' "$REVIEW_JSON")"
MINOR_COUNT="$(jq '[.findings[] | select(.severity == "minor")] | length' "$REVIEW_JSON")"
PREVIOUS_ISSUES_COUNT="$(jq '(.previous_issues // []) | length' "$REVIEW_JSON")"
REVIEW_POINTS_COUNT="$(jq '(.review_points // []) | length' "$REVIEW_JSON")"
VERIFICATION_COUNT="$(jq '(.verification // []) | length' "$REVIEW_JSON")"

# review body와 inline comment가 함께 쓰는 jq 렌더링 함수
JQ_HELPERS='
  def cell: gsub("\\|"; "\\|") | gsub("\r?\n"; " ");
  def location:
    .code_location.relative_file_path
    + ":"
    + (.code_location.line_range.start | tostring)
    + (if .code_location.line_range.start != .code_location.line_range.end then "-" + (.code_location.line_range.end | tostring) else "" end);
  def severity_emoji:
    if .severity == "critical" then "🚨" elif .severity == "major" then "⚠️" else "📝" end;
  def severity_name:
    if .severity == "critical" then "Critical" elif .severity == "major" then "Major" else "Minor" end;
  def severity_label: severity_emoji + " " + severity_name;
  def list_field($title; $items):
    if ($items | length) == 0 then []
    elif ($items | length) == 1 then ["- **" + $title + "**: " + $items[0]]
    else ["- **" + $title + "**"] + ($items | map("  - " + .))
    end;
  def detail_lines:
    (if (.condition // "") != "" then ["- **발생 조건**: " + .condition] else [] end)
    + (if (.impact // "") != "" then ["- **영향**: " + .impact] else [] end)
    + list_field("근거"; .evidence // [])
    + list_field("수정 제안"; .suggestion // []);
'

{
  printf '%s\n' '## 🤖 PR Review'
  printf '%s\n' ''
  if [ "$PREVIOUS_ISSUES_COUNT" != "0" ]; then
    printf '%s\n' '> 📌 Force-push 후 재리뷰: 이전 리뷰의 미해결 이슈를 추적합니다.'
    printf '%s\n' ''
  fi
  if [ "$OVERALL" = "patch is correct" ]; then
    printf '%s\n' '> ✅ 확실하게 수정이 필요한 항목을 찾지 못했습니다.'
  else
    printf '%s\n' '> ⚠️ 수정이 필요한 리뷰 코멘트가 있습니다.'
  fi
  printf '%s\n' '>'
  printf '> 🚨 **%s** Critical · ⚠️ **%s** Major · 📝 **%s** Minor\n' "$CRITICAL_COUNT" "$MAJOR_COUNT" "$MINOR_COUNT"
  printf '%s\n' ''
  printf '%s\n' '### 요약'
  printf '%s\n' "$EXPLANATION"
  printf '%s\n' ''

  if [ "$PREVIOUS_ISSUES_COUNT" != "0" ]; then
    printf '%s\n' '### 이전 리뷰 이슈 추적'
    printf '%s\n' '| ID | 상태 | 심각도 | 파일 | 이슈 |'
    printf '%s\n' '|----|------|--------|------|------|'
    jq -r "$JQ_HELPERS"'
      (.previous_issues // [])
      | .[]
      | "| " + .id
        + " | "
        + (if .status == "resolved" then "✅ 해결" else "❌ 미해결" end)
        + " | "
        + .severity
        + " | "
        + .file
        + ":"
        + (.line | tostring)
        + " | "
        + (.title | cell)
        + " |"
    ' "$REVIEW_JSON"
    printf '%s\n' ''
  fi

  if [ "$CRITICAL_COUNT" != "0" ] || [ "$MAJOR_COUNT" != "0" ]; then
    printf '%s\n' '### 수정 필요'
    printf '%s\n' '| 심각도 | 위치 | 내용 |'
    printf '%s\n' '|--------|------|------|'
    jq -r "$JQ_HELPERS"'
      .findings[]
      | select(.severity == "critical" or .severity == "major")
      | "| " + severity_label + " | `" + location + "` | " + (.title | cell) + " |"
    ' "$REVIEW_JSON"
    printf '%s\n' ''
    printf '%s\n' '자세한 내용은 각 인라인 코멘트를 확인해 주세요.'
    printf '%s\n' ''
  fi

  if [ "$REVIEW_POINTS_COUNT" != "0" ]; then
    printf '%s\n' '### 👀 Review Point'
    printf '%s\n' '| 항목 | 결과 | 근거 |'
    printf '%s\n' '|------|------|------|'
    jq -r "$JQ_HELPERS"'
      .review_points[]
      | "| " + (.point | cell)
        + " | "
        + (if .result == "ok" then "✅ 이상 없음"
           elif .result == "issue" then "⚠️ 지적"
           else "❔ 미확인"
           end)
        + " | "
        + (.note | cell)
        + " |"
    ' "$REVIEW_JSON"
    printf '%s\n' ''
  fi

  if [ "$MINOR_COUNT" != "0" ]; then
    printf '%s\n' '### 참고'
    jq -r "$JQ_HELPERS"'
      .findings[]
      | select(.severity == "minor")
      | (["- 📝 **" + .title + "** — `" + location + "`", "  - " + (.body | gsub("\r?\n"; " "))]
         + (detail_lines | map("  " + .)))
      | join("\n")
    ' "$REVIEW_JSON"
    printf '%s\n' ''
  fi

  printf '%s\n' '<details><summary>📋 검증 과정</summary>'
  printf '%s\n' ''
  if [ "$VERIFICATION_COUNT" != "0" ]; then
    jq -r '.verification[] | "- " + gsub("\r?\n"; " ")' "$REVIEW_JSON"
  else
    printf '%s\n' "- ${REVIEWER_LABEL} structured review 결과 중 확신도가 있는 항목만 정리했습니다."
    printf '%s\n' '- Critical/Major는 inline comment로 게시하고, Minor는 참고 항목으로 summary에 포함합니다.'
    printf '%s\n' '- 자동 생성된 OpenAPI 타입 선언 파일과 lock 파일은 리뷰 대상에서 제외합니다.'
  fi
  printf '%s\n' ''
  printf '%s\n' '</details>'
  printf '%s\n' ''

  printf '%s\n' '<!-- REVIEW_META'
  jq \
    --arg pr "$PR_NUMBER" \
    --arg sha "$HEAD_SHA" \
    --arg reviewer "$REVIEWER" \
    '
      (.findings | to_entries | map({
        id: ($reviewer + "-" + ((.key + 1) | tostring)),
        severity: .value.severity,
        file: .value.code_location.relative_file_path,
        line: .value.code_location.line_range.start,
        lineEnd: .value.code_location.line_range.end,
        title: .value.title
      })) as $meta_findings
      | {
        version: 3,
        source: $reviewer,
        pr: ($pr | tonumber),
        review_sha: $sha[0:7],
        previous_issues: (.previous_issues // []),
        findings: $meta_findings,
        open_issues: $meta_findings
      }
    ' "$REVIEW_JSON"
  printf '%s\n' '-->'
  printf '%s\n' ''
  printf '%s\n' '---'
  printf '%s\n' "<sub>🤖 ${REVIEWER_LABEL} PR Review</sub>"
} > "$BODY_PATH"

jq -c --arg commit "$HEAD_SHA" --arg reviewer_label "$REVIEWER_LABEL" "$JQ_HELPERS"'
  .findings[]
  | select(.severity == "critical" or .severity == "major")
  | {
      path: .code_location.relative_file_path,
      line: .code_location.line_range.end,
      side: "RIGHT",
      start_line: (if .code_location.line_range.start != .code_location.line_range.end then .code_location.line_range.start else null end),
      start_side: (if .code_location.line_range.start != .code_location.line_range.end then "RIGHT" else null end),
      body: (
        ([severity_emoji + " **[" + severity_name + "] " + .title + "**", "", .body]
         + (detail_lines as $details | if ($details | length) > 0 then [""] + $details else [] end)
         + (if ((.suggestion // []) | length) == 0 then
              ["", "**수정 제안**: 이 finding이 여전히 유효한지 먼저 확인한 뒤, 관련 코드만 최소 범위로 수정하고 필요한 검증을 실행해 주세요."]
            else [] end)
         + [
             "",
             "<sub>" + $reviewer_label + " 검증 · `" + location + "` 기준 · confidence "
               + (.confidence_score | tostring)
               + " · 실제 코드와 다르면 이 코멘트는 무시해 주세요.</sub>",
             "",
             "<!-- CODEX_REVIEW_COMMENT -->"
           ])
        | join("\n")
      )
    }
  | with_entries(select(.value != null))
' "$REVIEW_JSON" > "$COMMENTS_PATH"

COMMENTS_JSON="$(jq -s '.' "$COMMENTS_PATH")"

if [ "$ALLOW_APPROVE" = "true" ] && [ "$CRITICAL_COUNT" = "0" ] && [ "$MAJOR_COUNT" = "0" ] && [ "$MINOR_COUNT" = "0" ] && [ "$OVERALL" = "patch is correct" ]; then
  EVENT="APPROVE"
else
  EVENT="COMMENT"
fi

jq -n \
  --rawfile body "$BODY_PATH" \
  --arg event "$EVENT" \
  --argjson comments "$COMMENTS_JSON" \
  '{body: $body, event: $event, comments: $comments}' \
  > "$PAYLOAD_PATH"

post_review() {
  gh api --method POST "repos/$REPOSITORY/pulls/$PR_NUMBER/reviews" --input "$1"
}

if ! post_review "$PAYLOAD_PATH"; then
  echo "Inline review publishing failed. Retrying with body-only review."
  jq '.comments = []' "$PAYLOAD_PATH" > "$BODY_ONLY_PAYLOAD_PATH"
  if ! post_review "$BODY_ONLY_PAYLOAD_PATH"; then
    if [ "$EVENT" = "APPROVE" ]; then
      echo "APPROVE event rejected (likely permission). Retrying with COMMENT event."
      jq '.event = "COMMENT"' "$BODY_ONLY_PAYLOAD_PATH" > "$BODY_ONLY_PAYLOAD_PATH.tmp"
      mv "$BODY_ONLY_PAYLOAD_PATH.tmp" "$BODY_ONLY_PAYLOAD_PATH"
      post_review "$BODY_ONLY_PAYLOAD_PATH"
    else
      exit 1
    fi
  fi
fi
