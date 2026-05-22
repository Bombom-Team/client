# Review Body Composer

이 프롬프트는 PR Review v3 워크플로우(`.github/workflows/claude-review-v3.yml`)의 `finalize` job이 사용합니다. aggregate 결과(`/tmp/aggregated.json`)와 `/tmp/skeptic-targets.json`을 받아 **Skeptic 검증을 인라인으로 수행하고**, 인라인 코멘트 + 리뷰 본문 + REVIEW_META를 작성하여 PR에 제출합니다.

## 입력 파일

- `/tmp/aggregated.json` — 집계된 finding 전체. 형식:
  ```json
  {
    "review_mode": "full" | "incremental",
    "pr_number": 1234,
    "head_sha": "abcdef0",
    "review_sha": "abcdef0",
    "previous_open_issues": [...],  // incremental일 때만
    "findings": [
      {
        "id": "f001",
        "file": "...",
        "line": 42,
        "lineEnd": 42,
        "title": "...",
        "description": "...",
        "severity": "critical" | "major" | "minor",
        "confidence": 0.0-1.0,
        "category": "...",
        "codeSnippet": "...",
        "suggestion": "...",
        "codeGraphEvidence": "...",
        "needs_skeptic": true | false,
        "is_persistent": true | false   // 이전 리뷰에서 이미 지적된 이슈인가
      }
    ],
    "summary": {
      "critical_count": 0,
      "major_count": 0,
      "minor_count": 0
    }
  }
  ```
- `/tmp/skeptic-targets.json` — Critical/Major finding 배열 (Skeptic 검증 대상). 빈 배열이면 검증 단계 스킵.
- `/tmp/context.md` — PR Intent + PR Scope (Skeptic 검증에 필요).

## 처리 절차

1. `.review-learnings/agent-prompts/skeptic.md`를 Read로 읽고 **검증 방법**을 숙지하세요.
2. `/tmp/aggregated.json` + `/tmp/skeptic-targets.json` + `/tmp/context.md` Read.

3. **Skeptic 검증 (인라인 처리)**:
   - `/tmp/skeptic-targets.json`의 각 finding에 대해 `skeptic.md`의 검증 절차(1~7단계)를 순서대로 적용하여 verdict를 결정하세요.
   - 별도 Task tool로 분리하지 마세요. 이 호출 안에서 직접 분석하세요.
   - 필요 시 `mcp__code-graph__*` 도구로 추가 검증 (호출부/구현 확인).
   - 각 finding마다 다음을 결정: `verdict: "valid" | "invalid"`, `evidence`, `confidence: 0-100`.
   - 결과는 외부 파일로 저장할 필요 없음. 메모리에 두고 다음 단계에 바로 적용.

4. **Verdict 적용**:
   - `verdict: invalid` → 해당 finding **drop** (인라인 코멘트도 본문도 노출 X).
   - `verdict: valid` + `confidence >= 80` → 인라인 코멘트 + 본문 "수정 필요" 모두 노출.
   - `verdict: valid` + `confidence < 80` → 본문 "수정 필요"에만 노출 (인라인 X).
   - Minor finding → Skeptic 검증 대상 아님. 인라인 X, 본문 "참고"에만 노출 (최대 2개).

5. **incremental 모드 분기**:
   - `review_mode == "incremental"`이고 **새 Critical/Major 0개 + previous_open_issues에서 해결되지 않은 항목 0개**면 리뷰 미제출 (early exit, 정상 종료).
   - previous_open_issues에 미해결 항목이 있으면 새 Critical/Major가 0개여도 본문에 추적 테이블 포함하여 반드시 제출.

6. **리뷰 본문 작성** (아래 형식 참조).

7. **인라인 코멘트 게시** (Critical/Major + valid + confidence ≥ 80만):
   - 각각 `mcp__github_inline_comment__create_inline_comment` 호출
   - `path = finding.file`, `line = finding.line`, `body =` 아래 인라인 코멘트 형식
   - 이 호출은 pending review에 코멘트를 쌓아둠

8. **최종 리뷰 제출**:
   - `mcp__github__create_and_submit_pull_request_review` 호출
   - `event`:
     - Critical/Major 0개면 `"APPROVE"`
     - 1개 이상이면 `"COMMENT"`
     - **`"REQUEST_CHANGES"` 사용 금지**
   - `body`: 위에서 작성한 리뷰 본문 (REVIEW_META HTML 코멘트 포함)

> **중요**: review body를 임시 파일에 쓰지 마세요. `mcp__github` 도구의 `body` 파라미터에 직접 전달하세요.

## 인라인 코멘트 형식

```
{심각도 이모지} **[{심각도}] {제목}**

{왜 문제인지 2-3문장}

**Skeptic 검증**: {Skeptic의 evidence}

**수정 제안:**
```suggestion
{수정 코드}
```
```

심각도 이모지: critical=🚨, major=⚠️

## 리뷰 본문 형식

```
## 🤖 PR Review

{REVIEW_MODE=incremental일 때}
> 📌 증분 리뷰: 새 커밋만 리뷰

> {Critical/Major 없으면 "✅ 전반적으로 양호합니다." / 있으면 "⚠️ " + 핵심 위험 요약}

🚨 **{n}** Critical · ⚠️ **{n}** Major · 📝 **{n}** Minor

{REVIEW_MODE=incremental이고 previous_open_issues가 있을 때}
### 이전 리뷰 이슈 추적
| ID | 상태 | 심각도 | 파일 | 이슈 |
|----|------|--------|------|------|
| f1 | ✅/❌ | ... | ... | ... |

{Critical/Major가 있을 때}
### 수정 필요
- **{파일}:{라인}** — {제목}: {설명 1줄}

{Minor가 있을 때 — 최대 2개}
### 참고
- **{파일}:{라인}** — {제목}

<details><summary>📋 검증 과정</summary>

**확인한 리스크** (findings와 별개로 탐색한 항목):
- {PR의 실제 변경 성격에 따라 2-4개 나열. 예: "refactor 전후 동작 동일성", "제거된 훅의 실제 미사용 여부", "bridge 호출 에러 핸들링"}
- 각 항목에 **어떻게 확인했는지** 1줄 (code-graph 쿼리명, 읽은 파일, 비교 대상 등)

| Agent | Issues |
|-------|--------|
| 🔍 Bug & Logic | {n} |
| 📏 Convention | {n} |

Skeptic 검증: {n}건 중 {통과}건 통과

</details>

**지침**: "✓ 나열식"은 사용 금지. 에이전트가 실제로 **"이 변경이 깨뜨릴 수 있는 것"**을
탐색하고 그 결과를 서술형으로 작성하세요.

<!-- REVIEW_META
{
  "version": 3,
  "pr": {PR번호},
  "review_sha": "{HEAD SHA short}",
  "findings": [...],
  "open_issues": [...]
}
-->

---
<sub>🤖 PR Review | 💡 `/claude-review`로 재실행</sub>
```

## 중요 규칙

- 모든 텍스트는 한국어로 작성
- Critical/Major만 인라인 코멘트, Minor는 본문에만 (최대 2개)
- Recommendation 사용 금지
- REQUEST_CHANGES 사용 금지. Critical/Major가 있으면 COMMENT, 없으면 APPROVE
- `review_mode=incremental`에서 새 이슈 0개 + 이전 미해결 0개면 리뷰 미제출
- `review_mode=incremental`에서 이전 미해결 이슈가 있으면 반드시 리뷰 제출
- REVIEW_META의 `findings`는 새/persistent 모두 포함, `open_issues`는 미해결 Critical/Major만
