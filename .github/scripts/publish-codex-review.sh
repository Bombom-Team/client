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
    --body "$(printf '## %s PR Review\n\n리뷰 결과(JSON)가 만들어지지 않았습니다. 실행 로그를 확인해 주세요.' "$REVIEWER_LABEL")"
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
    elif ($items | length) == 1 then ["- **" + $title + "**" + (if ($title | endswith("?")) then " " else ": " end) + $items[0]]
    else ["- **" + $title + "**"] + ($items | map("  - " + .))
    end;
  def detail_lines:
    (if (.condition // "") != "" then ["- **언제 생기나요?** " + .condition] else [] end)
    + (if (.impact // "") != "" then ["- **무슨 문제가 생기나요?** " + .impact] else [] end)
    + list_field("근거"; .evidence // [])
    + list_field("어떻게 고치나요?"; .suggestion // []);
'

{
  printf '%s\n' '## 🤖 PR Review'
  printf '%s\n' ''
  if [ "$PREVIOUS_ISSUES_COUNT" != "0" ]; then
    printf '%s\n' '> 📌 다시 리뷰했습니다. 지난 리뷰에서 나온 문제가 고쳐졌는지도 함께 확인했습니다.'
    printf '%s\n' ''
  fi
  if [ "$OVERALL" = "patch is correct" ]; then
    printf '%s\n' '> ✅ 꼭 고쳐야 할 문제는 찾지 못했습니다.'
  else
    printf '%s\n' '> ⚠️ 고쳐야 할 문제가 있습니다. 아래 표와 코드 줄에 단 코멘트를 확인해 주세요.'
  fi
  printf '%s\n' '>'
  printf '> 🚨 **%s** Critical · ⚠️ **%s** Major · 📝 **%s** Minor\n' "$CRITICAL_COUNT" "$MAJOR_COUNT" "$MINOR_COUNT"
  printf '%s\n' '>'
  printf '%s\n' '> <sub>Critical: 장애·데이터 손실·보안 문제 · Major: 특정 상황에서 생기는 버그 · Minor: 동작은 하지만 고치면 좋은 것</sub>'
  printf '%s\n' ''
  printf '%s\n' '### 요약'
  printf '%s\n' "$EXPLANATION"
  printf '%s\n' ''

  if [ "$PREVIOUS_ISSUES_COUNT" != "0" ]; then
    printf '%s\n' '### 지난 리뷰에서 나온 문제'
    printf '%s\n' '| ID | 상태 | 심각도 | 위치 | 내용 |'
    printf '%s\n' '|----|------|--------|------|------|'
    jq -r "$JQ_HELPERS"'
      (.previous_issues // [])
      | .[]
      | "| " + .id
        + " | "
        + (if .status == "resolved" then "✅ 고쳐짐" else "❌ 아직 남음" end)
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
    printf '%s\n' '### 꼭 고쳐야 할 것'
    printf '%s\n' '| 심각도 | 위치 | 내용 |'
    printf '%s\n' '|--------|------|------|'
    jq -r "$JQ_HELPERS"'
      .findings[]
      | select(.severity == "critical" or .severity == "major")
      | "| " + severity_label + " | `" + location + "` | " + (.title | cell) + " |"
    ' "$REVIEW_JSON"
    printf '%s\n' ''
    printf '%s\n' '자세한 설명은 해당 코드 줄에 단 코멘트에 있습니다.'
    printf '%s\n' ''
  fi

  if [ "$REVIEW_POINTS_COUNT" != "0" ]; then
    printf '%s\n' '### 👀 Review Point 확인 결과'
    printf '%s\n' '| 항목 | 결과 | 근거 |'
    printf '%s\n' '|------|------|------|'
    jq -r "$JQ_HELPERS"'
      .review_points[]
      | "| " + (.point | cell)
        + " | "
        + (if .result == "ok" then "✅ 문제 없음"
           elif .result == "issue" then "⚠️ 문제 있음"
           else "❔ 확인 못 함"
           end)
        + " | "
        + (.note | cell)
        + " |"
    ' "$REVIEW_JSON"
    printf '%s\n' ''
  fi

  if [ "$MINOR_COUNT" != "0" ]; then
    printf '%s\n' '### 참고 (고치면 좋은 것)'
    jq -r "$JQ_HELPERS"'
      .findings[]
      | select(.severity == "minor")
      | (["- 📝 **" + .title + "** — `" + location + "`", "  - " + (.body | gsub("\r?\n"; " "))]
         + (detail_lines | map("  " + .)))
      | join("\n")
    ' "$REVIEW_JSON"
    printf '%s\n' ''
  fi

  printf '%s\n' '<details><summary>📋 리뷰하면서 확인한 내용</summary>'
  printf '%s\n' ''
  if [ "$VERIFICATION_COUNT" != "0" ]; then
    jq -r '.verification[] | "- " + gsub("\r?\n"; " ")' "$REVIEW_JSON"
  else
    printf '%s\n' '- 근거가 확실한 문제만 남겼습니다.'
    printf '%s\n' "- 꼭 고쳐야 할 것(Critical·Major)은 해당 코드 줄에 코멘트로 달고, 고치면 좋은 것(Minor)은 이 글의 '참고'에 적었습니다."
    printf '%s\n' '- 자동으로 만들어지는 파일(OpenAPI 타입 등)과 lock 파일은 보지 않았습니다.'
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
              ["", "**어떻게 고치나요?** 이 지적이 지금 코드에도 맞는지 먼저 확인하고, 관련된 부분만 고친 뒤 테스트해 주세요."]
            else [] end)
         + [
             "",
             "<sub>" + $reviewer_label + " 리뷰 · `" + location + "` 기준 · 확신도 "
               + (.confidence_score | tostring)
               + " · 실제 코드와 다르면 이 코멘트는 무시해도 됩니다.</sub>",
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
