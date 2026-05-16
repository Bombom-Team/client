# PR Review Orchestrator Runbook

> 이 파일은 PR Review v2 오케스트레이터가 따라야 할 **정적 실행 절차**입니다.
> 워크플로우의 `prompt:` 인풋이 슬림해지도록, PR마다 바뀌지 않는 모든 절차/템플릿/포맷을 여기 모았습니다.
> 워크플로우에서는 `PR_INFO`와 `REVIEW_MODE`만 변수로 전달하고, 이 파일을 Read로 읽어 그대로 따르세요.

## 변수 매핑

워크플로우 prompt의 `<PR_INFO>` 블록에서 다음 값들을 받습니다. 이 runbook에서 `${변수명}`이라고 표기된 부분은 모두 `<PR_INFO>` 값을 사용하세요.

| 변수               | 의미                                                                         |
| ------------------ | ---------------------------------------------------------------------------- |
| `${PR_NUMBER}`     | 대상 PR 번호                                                                 |
| `${REVIEW_MODE}`   | `full` / `incremental` / `force_push`                                        |
| `${DIFF_LINES}`    | diff 줄 수                                                                   |
| `${CHANGED_FILES}` | 변경 파일 수                                                                 |
| `${DIFF_FILE}`     | diff 파일 경로                                                               |
| `${CHANGED_FILE}`  | 변경 파일 목록 경로                                                          |
| `${RULES_FILE}`    | **정적 규칙** 파일 경로 (REVIEW.md + 학습 파일 + 일반 PR Scope 규칙)         |
| `${CONTEXT_FILE}`  | **이번 PR 맥락** 파일 경로 (PR Intent + Changed Files + 이번 PR의 영향 범위) |
| `${TRIAGE_SCORE}`  | Triage 복잡도 점수                                                           |

---

## REVIEW_MODE 분기

- `full` — PR 전체 처음부터 리뷰. (PR opened, `/claude-review` 코멘트, force push 직후, workflow_dispatch)
- `incremental` — 새 커밋의 diff만 리뷰. 이전 리뷰의 Critical/Major 이슈 해결 여부를 추적. 새 이슈 0개 + 이전 미해결 0개면 리뷰 미제출.
- `force_push` — PR 전체 처음부터 리뷰 (이전 SHA가 새 SHA의 ancestor가 아닌 경우)

증분 리뷰일 때는 이전 봇 리뷰에서 `REVIEW_META`의 `open_issues`를 파싱하여 `previous_issues`로 보관하고, 해결 여부를 추적하세요. 새 이슈 0개이더라도 이전 미해결 이슈가 있으면 반드시 리뷰를 제출하세요.

---

## 실행 순서

### Step 0: 게이트 체크

리뷰를 건너뛸지 판단합니다:

- `mcp__github__get_pull_request_reviews`로 PR 리뷰를 조회하여, 이미 `🤖 PR Review` 마커가 있고 그 이후 새 커밋이 없으면 → 중복 리뷰 방지
- diff가 오직 자동 생성 파일(lock, generated, `*.gen.ts`, 빌드 산출물)만 포함하면 → 리뷰 불필요
- PR 설명에 `[skip review]` 또는 `[no review]`가 있으면 → 스킵

`REVIEW_MODE=incremental`일 때: 이전 봇 리뷰에서 `REVIEW_META`의 `open_issues`를 파싱하여 `previous_issues`로 보관.

### Step 1: 사전 준비

다음 파일들을 Read로 읽으세요:

1. `${DIFF_FILE}` — diff (크면 처음 300줄만, 나머지는 에이전트에게 맡기세요)
2. `${RULES_FILE}` — 정적 규칙 (REVIEW.md + 학습 파일 + 일반 PR Scope 판정 규칙)
3. `${CONTEXT_FILE}` — 이번 PR 맥락 (PR Intent + 변경 파일 + 영향 범위 인스턴스)
4. `${CHANGED_FILE}` — 변경 파일 목록

> **중요**: 정적 규칙과 PR 맥락이 **두 파일로 분리**되어 있습니다. 에이전트에게도 두 파일 모두 Read하도록 명시 전달하세요.

### Step 2: 2개 에이전트 병렬 실행

**반드시 2개 Task를 한 번에 동시 실행하세요** (단일 메시지의 multiple tool calls).

각 에이전트 Task에 전달할 프롬프트:

```
당신은 {에이전트 이름} 관점의 코드 리뷰어입니다.

## 작업 순서
1. `${DIFF_FILE}`을 Read로 읽어 변경사항 확인
2. `${RULES_FILE}`을 Read로 읽어 정적 규칙(REVIEW.md + 학습 데이터 + PR Scope 규칙) 숙지
3. `${CONTEXT_FILE}`을 Read로 읽어 이번 PR의 맥락(의도/변경 파일/영향 범위) 숙지
4. `.review-learnings/agent-prompts/{에이전트 파일명}`을 읽고 지침을 따르세요
5. CLAUDE.md를 Read로 읽어 프로젝트 컨벤션 숙지
6. 변경된 파일의 전체 컨텍스트가 필요하면 해당 파일을 Read로 직접 읽으세요
7. 함수 구현·호출부·유사 코드 확인이 필요하면 `Grep`/`Glob`/`Read`를 사용하세요
8. PR 의도(`${CONTEXT_FILE}`의 PR Intent)와 코드가 일치하는지 반드시 검증하세요
9. 리뷰 결과를 JSON 형식으로만 응답하세요

## 필터링 기준
다음은 **플래그하지 마세요**:
- 린터/포매터가 잡을 수 있는 이슈
- 이번 PR 이전부터 존재하던 기존 이슈
- *.gen.ts, *.generated.*, *.lock 파일
- "~를 고려해보세요" 식 약한 제안
- recommendation 심각도 (사용 금지)

## 중요
- 함수 구현·호출부는 `Read`/`Grep`으로 직접 확인하세요. 추측 금지.
- findings가 0개여도 괜찮습니다. 억지로 만들지 마세요.
- review body를 임시 파일에 쓰지 마세요. JSON으로만 응답하세요.

## 리뷰 품질 — 체크리스트 검증만으로 끝내지 마세요

REVIEW.md의 규칙은 **최소 베이스라인**입니다. "✓ 체크리스트" 식으로
나열하고 끝내지 마세요. 다음 관점도 반드시 독립적으로 수행:

1. **PR 자체의 고유 리스크 탐색** — "이 변경이 깨뜨릴 수 있는 것은?"
   - 기존 동작과 새 동작의 차이 (behavior equivalence)
   - 기존 호출 사이트가 제거된 파라미터/훅에 의존했는지 (`Grep`으로 호출부 확인)
   - 새 파일의 핵심 로직 경로 (에러/엣지/동시성)

2. **리팩토링 PR 특별 처리** (diff에 삭제·이동·rename 많으면)
   - 제거된 데이터/훅/모듈이 정말 미사용인지 `Grep`으로 확인
   - 동일 기능을 유지하는지 (원본 함수의 모든 분기가 새 함수에 있는지)
   - 인자 변경 시 호출부 전부 업데이트됐는지

3. **"✓" 찍을 때 근거 제시 의무** — 실제 파일 내용·`Grep` 결과 인용.
   "처리됨 ✓" 같은 근거 없는 체크는 Skeptic이
   invalid로 걸러냅니다. 특히 **용어의 실제 의미 확인**이 중요합니다
   (단순 에러 처리와 상태 복원은 다른 개념).
```

에이전트 매핑:

1. **Bug & Logic Agent** → `.review-learnings/agent-prompts/bug-logic-agent.md`
2. **Convention & Pattern Agent** → `.review-learnings/agent-prompts/convention-pattern-agent.md`

### Step 3: 결과 집계

2개 에이전트 결과 수집 후:

1. **JSON 파싱**: 각 에이전트 응답에서 JSON 추출
2. **이슈 그룹화**: 같은 파일 ±5 라인이고 같은 카테고리면 동일 이슈
3. **중복 제거**: 그룹 내 가장 높은 심각도와 confidence를 대표값으로
4. **심각도 결정**:
   - 2개 에이전트 모두 critical → 🚨 Critical
   - critical 1개 + major 1개 → 🚨 Critical
   - major 1개 이상 → ⚠️ Major
   - 그 외 → 📝 Minor
5. **Minor 제한**: Minor는 최대 2개만 유지 (confidence 높은 순)

`REVIEW_MODE=incremental`일 때:

- 이전 이슈 해결 여부 판정 (파일 rename → 존재 → 수정 → 라인 확인)
- 새 이슈와 이전 이슈 중복 제거
- `cumulative_open_issues` = 미해결 이전 + 새 Critical/Major

### Step 4: Skeptic Verification

**Critical 또는 Major 이슈만** 검증합니다.

각 이슈마다 별도 Task 서브에이전트를 **단일 메시지의 multiple tool calls로 동시 호출**하세요. 순차 호출 금지. 5개 이슈 = 5개 Task in one message.

각 Skeptic Task의 프롬프트:

```
당신은 코드 리뷰 Skeptic입니다.
다음 이슈가 **틀렸다는 것을 증명**하세요.

## 이슈 정보
- 파일: {파일경로}
- 라인: {라인}
- 심각도: {심각도}
- 제목: {제목}
- 설명: {설명}

## 검증 방법
1. **claim 타입 분류 (먼저 체크)**:
   - finding의 description/title이 **cross-file claim**인가? 다음 표현 중 하나라도 포함:
     - "다른 곳에서도", "여러 곳에서", "다른 워크스페이스에서", "광범위한 영향", "수많은 호출부", "시스템 전반"
     - "호출부", "caller", "사용처", "참조", "패턴 불일치 (다른 파일 비교)"
     - "데드 코드", "미사용", "unused", "no callers"
     - "기존 패턴과 다름", "관행 위반"
   - → **cross-file claim**이면 다음 2단계 (증거 게이트) 적용
   - → **single-file claim** (이 파일 안의 null check, try-catch, 타입, 로직 등)이면 게이트 스킵
2. **증거 게이트 (cross-file claim에만 적용)**:
   - cross-file claim은 finding의 description에 **구체적 증거**(실제 파일 경로 + 라인 번호, 또는 확인한 호출 위치)가 있어야 valid 후보입니다.
   - "여러 곳에서 쓰임", "광범위한 영향" 같은 **막연한 주장만 있고 구체적 위치가 없으면** → **즉시 `invalid` 처리** (`grep` false hit 위험)
   - 검증자 본인이 `Grep`으로 직접 재확인하세요 — `grep`은 코멘트·문자열도 매치하므로, 매치된 위치를 `Read`로 열어 **실제 호출인지** 확인. 실제 호출이 아니면 invalid.
   - **single-file claim은 증거 게이트 스킵** — 이 파일 안에서 직접 확인 가능하므로.
3. 해당 파일을 Read로 읽고 이슈가 지적하는 코드를 직접 확인
4. 관련 함수의 실제 구현·호출부·타입 정의를 `Grep`/`Read`로 재확인 (필요 시)
5. PR 설명의 의도를 확인하여 의도적 설계인지 판단
6. 커밋 메시지에서 작성자의 의도 확인
7. **PR Scope 검증** (모노레포 오탐 방지):
   - `${CONTEXT_FILE}`의 "PR Scope" 섹션 확인
   - 이슈가 "광범위한 영향", "많은 호출부", "시스템 전반" 같은 영향 범위 지적이면:
     - 지적된 호출부가 실제로 PR Scope에 속하는지 확인
     - 다른 워크스페이스(영향 범위 아님)의 호출부를 근거로 한 지적이면 **invalid**
     - 예: web 변경인데 "admin에서도 이 함수 쓰인다"는 영향 범위 지적 → invalid

## 판정
반드시 JSON으로 응답:
{"verdict": "valid" | "invalid", "evidence": "구체적 근거 1-2문장", "confidence": 0-100}

- valid: 반증 실패 — 이 이슈는 실제 문제 (반증을 시도했지만 실패했다는 증거 제시)
- invalid: 반증 성공 — 이 이슈는 false positive (코드/커밋/패턴 근거 필수). **cross-file claim인데 구체적 증거(실제 파일·라인)가 없고 막연한 주장만 있으면 자동 invalid** (이유: "cross-file claim without concrete evidence — grep false hit 위험")

근거 없이 valid로 판정하지 마세요. 반증을 시도한 과정을 설명하세요.
```

검증 결과:

- `verdict: invalid` → 제거
- `verdict: valid` + `confidence >= 80` → 인라인 코멘트 대상
- `verdict: valid` + `confidence < 80` → 본문에만 표시

Critical/Major 이슈가 없으면 이 단계를 건너뛰세요.

### Step 5: PR Review 제출

심각도에 따라 경로를 하나 선택:

**A. Critical/Major 없음** (findings 0개 또는 Minor만)

→ `mcp__github__create_and_submit_pull_request_review` 한 번에 제출

- `event`: `"APPROVE"`
- `body`: 아래 "리뷰 본문 형식" 그대로 (Minor는 본문 "참고" 섹션에 표시)

**B. Critical/Major 있음**

1. 각 Critical/Major 이슈마다 `mcp__github_inline_comment__create_inline_comment` 호출 (buffer에 자동 쌓임)
   - `path`, `line`, `body` 전달
2. 마지막에 `mcp__github__create_and_submit_pull_request_review`로 본문 제출
   - `event`: `"COMMENT"` (**REQUEST_CHANGES 사용 금지**)
   - `body`: 리뷰 본문 (findings 요약)

> **중요**: review body를 임시 파일에 쓰지 마세요. `mcp__github` 도구의 `body` 파라미터에 직접 전달하세요.

---

## 인라인 코멘트 형식

````
{심각도 이모지} **[{심각도}] {제목}**

{왜 문제인지 2-3문장}

**Skeptic 검증**: {Skeptic의 evidence}

**수정 제안:**
```suggestion
{수정 코드}
````

```

## 리뷰 본문 형식

```

## 🤖 PR Review

{REVIEW_MODE=incremental일 때}

> 📌 증분 리뷰: 새 커밋만 리뷰

> {Critical/Major 없으면 "✅ 전반적으로 양호합니다." / 있으면 "⚠️ " + 핵심 위험 요약}

🚨 **{n}** Critical · ⚠️ **{n}** Major · 📝 **{n}** Minor

{REVIEW_MODE=incremental이고 previous_issues가 있을 때}

### 이전 리뷰 이슈 추적

| ID  | 상태  | 심각도 | 파일 | 이슈 |
| --- | ----- | ------ | ---- | ---- |
| f1  | ✅/❌ | ...    | ...  | ...  |

{Critical/Major가 있을 때}

### 수정 필요

- **{파일}:{라인}** — {제목}: {설명 1줄}

{Minor가 있을 때 — 최대 2개}

### 참고

- **{파일}:{라인}** — {제목}

<details><summary>📋 검증 과정</summary>

**확인한 리스크** (findings와 별개로 탐색한 항목):

- {PR의 실제 변경 성격에 따라 2-4개 나열. 예: "refactor 전후 동작 동일성", "제거된 훅의 실제 미사용 여부", "mutation 에러 핸들링"}
- 각 항목에 **어떻게 확인했는지** 1줄 (읽은 파일, `Grep` 패턴, 비교 대상 등)

| Agent          | Issues |
| -------------- | ------ |
| 🔍 Bug & Logic | {n}    |
| 📏 Convention  | {n}    |

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

---

## 중요 규칙 (모든 단계 공통)

- 모든 텍스트는 한국어로 작성
- Critical/Major만 인라인 코멘트, Minor는 본문에만 (최대 2개)
- Recommendation 사용 금지
- REQUEST_CHANGES 사용 금지. Critical/Major가 있으면 COMMENT, 없으면 APPROVE
- `REVIEW_MODE=incremental`에서 새 이슈 0개 + 이전 미해결 0개면 리뷰 미제출
- `REVIEW_MODE=incremental`에서 이전 미해결 이슈가 있으면 반드시 리뷰 제출
- 정적 규칙은 `${RULES_FILE}`에, PR 맥락은 `${CONTEXT_FILE}`에 분리되어 있음 — 에이전트에게 두 파일 모두 Read 명시
```
