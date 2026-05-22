#!/usr/bin/env bash
# Aggregate PR Review findings from multiple reviewer agents.
#
# Inputs (from environment):
#   BUG_LOGIC_FILE       — findings-bug-logic.json
#   CONVENTION_FILE      — findings-convention-pattern.json
#   PREV_META_FILE       — optional previous REVIEW_META JSON (incremental mode)
#   PR_NUMBER, HEAD_SHA, REVIEW_MODE — context
#   OUT_AGGREGATED       — output aggregated.json path
#   OUT_SKEPTIC_TARGETS  — output skeptic-targets.json path
#
# Outputs files + emits to GITHUB_OUTPUT (if set):
#   - skeptic_targets, has_critical_or_major, critical_count, major_count, minor_count

set -euo pipefail

BUG_LOGIC_FILE="${BUG_LOGIC_FILE:?BUG_LOGIC_FILE required}"
CONVENTION_FILE="${CONVENTION_FILE:?CONVENTION_FILE required}"
PREV_META_FILE="${PREV_META_FILE:-}"
PR_NUMBER="${PR_NUMBER:-0}"
HEAD_SHA="${HEAD_SHA:-unknown}"
REVIEW_MODE="${REVIEW_MODE:-full}"
OUT_AGGREGATED="${OUT_AGGREGATED:-/tmp/aggregated.json}"
OUT_SKEPTIC_TARGETS="${OUT_SKEPTIC_TARGETS:-/tmp/skeptic-targets.json}"

# Guard against missing or empty input files — replace with empty findings.
ensure_findings_json() {
  local f=$1
  local agent_name=$2
  if [ ! -s "$f" ]; then
    echo "{\"agentName\":\"$agent_name\",\"findings\":[],\"summary\":\"(missing)\"}" > "$f"
  fi
}

ensure_findings_json "$BUG_LOGIC_FILE" "Bug & Logic Agent"
ensure_findings_json "$CONVENTION_FILE" "Convention & Pattern Agent"

# Reusable severity-rank functions for inline jq programs.
SEV_DEFS='
  def sev_rank:
    if . == "critical" then 3
    elif . == "major" then 2
    elif . == "minor" then 1
    else 0
    end;
  def sev_from_rank:
    if . == 3 then "critical"
    elif . == 2 then "major"
    else "minor"
    end;
'

# Step 1+2: merge findings from both agents, tag sourceAgent, coerce numeric fields.
ALL_FINDINGS=$(jq -s --arg bl_name "Bug & Logic Agent" --arg cv_name "Convention & Pattern Agent" '
  ((.[0].findings // []) | map(. + {sourceAgent: $bl_name})) +
  ((.[1].findings // []) | map(. + {sourceAgent: $cv_name}))
  | map(
      .line = (.line | tonumber? // 0) |
      .lineEnd = (.lineEnd | tonumber? // .line) |
      .confidence = (.confidence | tonumber? // 0) |
      .category = (.category // "uncategorized") |
      .codeGraphEvidence = (.codeGraphEvidence // "")
    )
' "$BUG_LOGIC_FILE" "$CONVENTION_FILE")

# Step 3+4: group by (file, line/5 floor, category), then pick representative.
GROUPED=$(echo "$ALL_FINDINGS" | jq "$SEV_DEFS"'
  group_by([.file, ((.line / 5) | floor), .category])
  | map(
      (max_by(.suggestedSeverity | sev_rank)) as $rep
      | (map(.suggestedSeverity | sev_rank) | max) as $top_rank
      | $rep + {
          suggestedSeverity: ($top_rank | sev_from_rank),
          confidence: (map(.confidence) | max),
          agents: (map(.sourceAgent) | unique),
          codeGraphEvidence: (
            [.[].codeGraphEvidence | select(. != null and . != "")] | join(" | ")
          )
        }
    )
')

# Step 5: Minor cap to 2 (top confidence) + sequential IDs.
CAPPED=$(echo "$GROUPED" | jq '
  (map(select(.suggestedSeverity == "critical" or .suggestedSeverity == "major"))) as $cm
  | (map(select(.suggestedSeverity == "minor")) | sort_by(-.confidence) | .[0:2]) as $mi
  | ($cm + $mi)
  | to_entries
  | map(.value + {id: ("f" + ((.key + 1) | tostring))})
')

# Step 6: incremental mode — match prev open_issues to mark is_persistent.
PREV_OPEN='[]'
if [ -n "$PREV_META_FILE" ] && [ -s "$PREV_META_FILE" ]; then
  PREV_OPEN=$(jq -c '.open_issues // []' "$PREV_META_FILE" 2>/dev/null || echo '[]')
fi

WITH_PERSIST=$(echo "$CAPPED" | jq --argjson prev "$PREV_OPEN" '
  map(
    . as $f |
    ($prev | any(.[];
      .file == $f.file
      and ((((.line // 0) - $f.line)) | if . < 0 then -. else . end) <= 5
      and (.category // "") == ($f.category // "")
    )) as $persist |
    . + {is_persistent: $persist}
  )
')

# Step 7: summary counts.
SUMMARY=$(echo "$WITH_PERSIST" | jq '
  {
    critical_count: (map(select(.suggestedSeverity == "critical")) | length),
    major_count:    (map(select(.suggestedSeverity == "major"))    | length),
    minor_count:    (map(select(.suggestedSeverity == "minor"))    | length)
  }
')

# Step 8: aggregated.json (rename suggestedSeverity → severity for downstream clarity).
FINDINGS=$(echo "$WITH_PERSIST" | jq '
  map(
    . + {severity: .suggestedSeverity}
    | del(.suggestedSeverity)
    | . + {needs_skeptic: (.severity == "critical" or .severity == "major")}
  )
')

jq -n \
  --arg review_mode "$REVIEW_MODE" \
  --arg pr "$PR_NUMBER" \
  --arg head_sha "$HEAD_SHA" \
  --argjson findings "$FINDINGS" \
  --argjson summary "$SUMMARY" \
  --argjson prev_open "$PREV_OPEN" \
  '{
    review_mode: $review_mode,
    pr_number: ($pr | tonumber? // 0),
    head_sha: $head_sha,
    review_sha: $head_sha,
    previous_open_issues: $prev_open,
    findings: $findings,
    summary: $summary
  }' > "$OUT_AGGREGATED"

# Step 9: skeptic-targets.json (Critical/Major only, slim payload for matrix).
SKEPTIC_TARGETS=$(echo "$FINDINGS" | jq -c '
  map(select(.severity == "critical" or .severity == "major"))
  | map({
      id,
      file,
      line,
      severity,
      title,
      description,
      codeGraphEvidence
    })
')

echo "$SKEPTIC_TARGETS" > "$OUT_SKEPTIC_TARGETS"

# Step 10: write GitHub Actions outputs if running in CI.
if [ -n "${GITHUB_OUTPUT:-}" ]; then
  {
    echo "skeptic_targets=$SKEPTIC_TARGETS"
    CM=$(echo "$SUMMARY" | jq '.critical_count + .major_count')
    if [ "$CM" -gt 0 ]; then
      echo "has_critical_or_major=true"
    else
      echo "has_critical_or_major=false"
    fi
    echo "critical_count=$(echo "$SUMMARY" | jq '.critical_count')"
    echo "major_count=$(echo "$SUMMARY" | jq '.major_count')"
    echo "minor_count=$(echo "$SUMMARY" | jq '.minor_count')"
  } >> "$GITHUB_OUTPUT"
fi

echo "✅ Aggregated: $(echo "$SUMMARY" | jq -c .)"
echo "📄 $OUT_AGGREGATED"
echo "🎯 $OUT_SKEPTIC_TARGETS — $(echo "$SKEPTIC_TARGETS" | jq 'length') skeptic target(s)"
