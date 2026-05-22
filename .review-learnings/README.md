# 🤖 Codex PR 리뷰 시스템 — 팀 가이드

이 레포에는 Codex 기반 자동 PR 리뷰 시스템이 있습니다. PR diff와 레포 규칙을 함께
읽고, high-signal 이슈만 structured output으로 생성해 GitHub 리뷰에 게시합니다.

기존 Claude v3 리뷰 워크플로우는 수동 롤백 경로로만 남겨두고, 기본 리뷰는
`.github/workflows/codex-review.yml`이 담당합니다.

---

## TL;DR — 팀원이 알아야 할 것

| 하고 싶은 것                    | 방법                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| **PR 리뷰 받기**                | PR 생성/업데이트 시 자동 실행 또는 PR 대화창에 `/codex-review` 코멘트 작성 |
| 리뷰 정확도 높이기              | PR 본문 `👀 Review Point`에 확인 지점을 구체적으로 작성 (봇이 우선 점검) |
| 특정 PR을 수동 리뷰             | Actions 탭 → `Codex PR Review` → Run workflow → PR 번호 입력             |
| 봇 지적이 **틀렸을 때**         | 그 인라인 코멘트에 **답글(reply)**로 반박 → 학습됨                       |
| 봇 지적을 **고쳤을 때**         | 그냥 커밋 push → 봇이 해당 코멘트를 자동 resolve                         |
| `chore/review-*` PR이 열렸을 때 | 학습 데이터 자동 갱신 PR — 내용 확인 후 머지                             |

> Codex 리뷰는 draft가 아닌 PR의 open/reopen/synchronize/ready_for_review 이벤트에서
> 자동 실행됩니다. 수동 재실행이 필요하면 `/codex-review` 코멘트를 달면 됩니다.

---

## 1. 리뷰는 어떻게 진행되나

### 트리거 (언제 도는가)

- PR 생성/업데이트/ready_for_review 이벤트
- PR 코멘트에 **`/codex-review`** 입력 (코멘트 본문에 이 문자열이 포함되면 됨)
- Actions 탭에서 **수동 실행**(`workflow_dispatch`)

### 파이프라인

```
/codex-review 코멘트 또는 PR 이벤트
      │
      ▼
┌─ codex-review.yml (GitHub Actions) ───────────────────┐
│  PR 메타데이터 확인 → AGENTS/REVIEW 규칙 주입 → diff 조립 │
│  → Codex structured review 실행                         │
└──────────────────────────────│─────────────────────────┘
                               ▼
   Codex
     ├─ AGENTS.md의 Codex Review Policy 적용
     ├─ .review-learnings/REVIEW.md / additional-rules / false-positives 반영
     ├─ exact changed line 기준 findings(JSON) 생성
     └─ PR에 리뷰 제출
          · 문제 없음        → APPROVE (본문만)
          · Critical/Major 有 → COMMENT + 인라인 코멘트
            (REQUEST_CHANGES는 안 함 — 머지를 막지 않음)
```

- **모델 설정**: 기본값은 `gpt-5.5`, 필요하면 GitHub Variable `CODEX_REVIEW_MODEL`로 변경
- **High signal only**: 확신이 낮거나 라인 근거가 부족한 항목은 코멘트하지 않음
- **심각도**: 🚨 Critical(크래시·데이터손실) / ⚠️ Major(조건부 버그) / 📝 Minor(개선,
  최대 2개)
- **PR Review Point 반영**: PR 본문에 `👀 Review Point` 섹션이 있으면, 봇이 그 항목들을
  **우선 점검 대상**으로 삼습니다. 작성자가 직접 리뷰를 요청한 지점이므로, 확인 지점을
  구체적으로 적을수록(회귀 위험·사이드이펙트·엣지 케이스 등) 리뷰가 정확해집니다.

### 리뷰 결과 다루기

- **봇 지적이 맞다** → 고쳐서 커밋 push. → `claude-resolve`가 해당 스레드를 자동으로
  닫아줍니다.
- **봇 지적이 틀렸다** → 그 인라인 코멘트에 **답글로 반박**하세요 (예: "이건 의도한
  거예요", "이 경우엔 괜찮아요"). → `claude-learn-feedback`이 이 반박을
  `false-positives.md`에 기록해서, **다음 리뷰부터 같은 지적을 안 하거나 완화**합니다.
  학습되면 봇이 ✅ **학습 완료** 답글을 남깁니다.

---

## 2. claude-resolve — 코멘트 자동 정리

커밋을 push하면(`synchronize`) 별도 워크플로우가 돕니다. 봇이 단 미해결 리뷰 스레드
중 **이번에 수정한 파일**의 것을 골라, "지적이 해결됐는지"를 가벼운 모델(Haiku)로
판단해 해결된 스레드를 resolve합니다. 봇 코멘트가 없으면 LLM 호출 없이 즉시 끝나서
비용 부담이 거의 없습니다.

> resolve는 리뷰와 달리 커밋 push에 **자동**으로 돕니다.

---

## 3. 학습 루프는 어떻게 도나

리뷰가 시간이 지날수록 똑똑해지도록, 4개의 워크플로우가 리뷰 결과를 추적·학습합니다.

```
                  ┌──────────────────────────────────────────┐
   PR 머지 ──────▶│ claude-attribution                       │
                  │ 리뷰 제안이 어떻게 처리됐나 추적          │
                  │ (accepted / modified / dismissed / ignored)│
                  │ → attribution-log.md 에 기록              │
                  └───────────────────│──────────────────────┘
                                      ▼ (워크플로우 완료 시)
                  ┌──────────────────────────────────────────┐
                  │ claude-learn-patterns                    │
                  │ attribution 데이터 분석 (3건 이상 쌓이면) │
                  │ → patterns / additional-rules /          │
                  │   false-positives 자동 갱신              │
                  └──────────────────────────────────────────┘

   봇 코멘트에 ──▶ claude-learn-feedback
   반박 reply       반박을 false-positives.md 에 즉시 반영

   매주 월요일 ──▶ claude-review-report
                   주간 성과 리포트 생성 (reports/{YYYY}-W{WW}.md)
```

### 흐름 설명

1. **attribution** — PR이 머지되면, 그 PR에 달렸던 봇 리뷰 제안이 실제로 어떻게
   처리됐는지(수락/수정/반박/무시) 추적해 `attribution-log.md`에 누적합니다.
2. **learn-patterns** — attribution이 끝나면 실행. 이력이 3건 이상 쌓이면, 반복
   패턴을 분석해서:
   - 3회 이상 무시/반박된 지적 → `false-positives.md` (앞으로 안 함)
   - 3회 이상 수락된 지적 → `additional-rules.md` (룰로 승격, 더 강하게 체크)
   - 새로운 반복 패턴 → `patterns.md`
3. **learn-feedback** — 머지를 기다리지 않는 즉시 채널. 봇 코멘트에 반박 답글을 달면
   바로 `false-positives.md`에 반영.
4. **review-report** — 매주 월요일, 에이전트별 정확도·커버리지·노이즈 비율 등 주간
   리포트를 생성.

### 결과는 PR로 옵니다

학습 워크플로우는 변경한 파일을 `chore/review-*` 브랜치에 커밋하고 **PR을 자동
생성**합니다. 팀원은 이 PR 내용을 확인하고 머지하면 됩니다.

| PR 브랜치                  | 생성 워크플로우 | 내용                |
| -------------------------- | --------------- | ------------------- |
| `chore/review-attribution` | attribution     | 리뷰 제안 처리 이력 |
| `chore/review-learnings`   | learn-patterns  | 학습된 패턴·룰·오탐 |
| `chore/review-report`      | review-report   | 주간 리포트         |

> 예외: `learn-feedback`은 PR을 따로 만들지 않고, 반박이 달린 **그 PR의 브랜치에
> 직접 커밋**합니다.

---

## 4. 파일별 역할

### 워크플로우 (`.github/workflows/`)

| 파일                        | 역할                              | 트리거                             |
| --------------------------- | --------------------------------- | ---------------------------------- |
| `codex-review.yml`          | Codex PR 리뷰                     | PR 이벤트, `/codex-review`, 수동 실행 |
| `claude-review-v3.yml`      | 이전 Claude 리뷰 롤백 경로        | 수동 실행                          |
| `claude-resolve.yml`        | 수정 반영된 코멘트 자동 resolve   | 커밋 push                          |
| `claude-attribution.yml`    | 리뷰 제안 처리 결과 추적          | PR 머지                            |
| `claude-learn-patterns.yml` | attribution 분석 → 학습 파일 갱신 | attribution 완료 후                |
| `claude-learn-feedback.yml` | 반박 reply → 오탐 즉시 반영       | 봇 코멘트에 답글                   |
| `claude-review-report.yml`  | 주간 성과 리포트                  | 매주 월요일                        |

### 리뷰 규칙·절차 (`.review-learnings/`) — **정적, 사람이 관리**

| 파일                                        | 역할                                                                               |
| ------------------------------------------- | ---------------------------------------------------------------------------------- |
| `REVIEW.md`                                 | 리뷰 가이드라인 — 무엇을 지적하고 무엇을 스킵할지. **컨벤션이 바뀌면 여기를 수정** |
| `orchestrator-runbook.md`                   | 리뷰 실행 절차 (오케스트레이터가 따르는 단계별 런북)                               |
| `agent-prompts/bug-logic-agent.md`          | 🔍 Bug & Logic 에이전트 지침 (런타임 에러·로직 버그)                               |
| `agent-prompts/convention-pattern-agent.md` | 📏 Convention & Pattern 에이전트 지침 (컨벤션·일관성)                              |

### 학습 데이터 (`.review-learnings/`) — **학습 루프가 자동 갱신, 직접 편집도 가능**

| 파일                      | 역할                                            |
| ------------------------- | ----------------------------------------------- |
| `additional-rules.md`     | 기계적으로 검출 가능한 추가 룰 (반드시 체크)    |
| `patterns.md`             | 판단·맥락이 필요한 반복 리뷰 패턴               |
| `false-positives.md`      | 오탐 목록 — 여기 있는 패턴은 안 지적하거나 완화 |
| `attribution-log.md`      | 리뷰 제안 처리 이력 (정확도 추적 데이터)        |
| `archived-patterns.md`    | 6개월 이상 관찰 안 된 오래된 패턴 보관소        |
| `reports/{YYYY}-W{WW}.md` | 주간 리포트 (review-report가 생성)              |

> `additional-rules.md` / `patterns.md` / `false-positives.md`의 초기 내용은
> 봄봄팀의 `woowacourse-teams/2025-bom-bom` PR 코멘트 2,100여 개를 분석해
> 채웠습니다.

---

## 5. 설정 / 동작 전제

- **GitHub Secret `OPENAI_API_KEY`** 가 등록돼 있어야 Codex 리뷰가 동작합니다.
- `/codex-review` 코멘트와 수동 실행, 학습 루프(`attribution`/`learn-feedback` 등)는
  GitHub 특성상 **워크플로우 파일이 기본 브랜치에 머지된 뒤**에야 동작합니다.
- 모델은 GitHub Variable `CODEX_REVIEW_MODEL`로 바꿀 수 있습니다.

## 6. 알아두면 좋은 점

- **AI 리뷰는 보조 도구입니다.** Codex가 high-signal 기준으로 오탐을 줄이지만
  완벽하지 않아요. 헛짚는 지적도, 놓치는 버그도 있습니다. 사람 리뷰를 대체하지
  않습니다.
- 봇 지적이 틀렸으면 **답글로 반박**해 주세요. 그게 학습 루프의 연료입니다 — 반박할
  수록 봇이 똑똑해집니다.
- 봇 리뷰 본문 끝에 `<!-- REVIEW_META ... -->` 주석이 있습니다. 학습 루프가 이걸
  읽으니 **편집·삭제하지 마세요.**
- 학습 루프는 Codex 리뷰가 실제로 남긴 `REVIEW_META`가 있는 PR에서만 데이터가 쌓입니다.
