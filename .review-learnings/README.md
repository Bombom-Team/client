# 🤖 Codex PR 리뷰 시스템 — 팀 가이드

이 레포에는 Codex 기반 자동 PR 리뷰 시스템이 있습니다. PR diff와 레포 규칙을 함께
읽고, high-signal 이슈만 structured output으로 생성해 GitHub 리뷰에 게시합니다.

기존 Claude 리뷰 워크플로우는 제거했고, 기본 리뷰는
`.github/workflows/codex-review.yml`이 담당합니다.

---

## TL;DR — 팀원이 알아야 할 것

| 하고 싶은 것                    | 방법                                                                     |
| ------------------------------- | ------------------------------------------------------------------------ |
| **PR 리뷰 받기**                | PR 생성/업데이트 시 자동 실행 또는 PR 대화창에 `/codex-review` 코멘트 작성 |
| 리뷰 정확도 높이기              | PR 본문 `👀 Review Point`에 확인 지점을 구체적으로 작성 (봇이 우선 점검) |
| 특정 PR을 수동 리뷰             | Actions 탭 → `Codex PR Review` → Run workflow → PR 번호 입력             |
| 봇 지적이 **틀렸을 때**         | 해당 PR에서 답글로 반박하고 필요하면 `false-positives.md`에 수동 반영     |
| 봇 지적을 **고쳤을 때**         | 커밋 push 후 스레드를 직접 resolve                                       |

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

- **봇 지적이 맞다** → 고쳐서 커밋 push 후 해당 리뷰 스레드를 직접 resolve합니다.
- **봇 지적이 틀렸다** → 그 인라인 코멘트에 답글로 반박하세요. 반복 오탐이면
  `.review-learnings/false-positives.md`에 수동으로 추가해 다음 리뷰에서 제외합니다.

---

## 2. 파일별 역할

### 워크플로우 (`.github/workflows/`)

| 파일                        | 역할                              | 트리거                             |
| --------------------------- | --------------------------------- | ---------------------------------- |
| `codex-review.yml`          | Codex PR 리뷰                     | PR 이벤트, `/codex-review`, 수동 실행 |

### 리뷰 규칙 (`.review-learnings/`) — **정적, 사람이 관리**

| 파일                   | 역할                                                                               |
| ---------------------- | ---------------------------------------------------------------------------------- |
| `REVIEW.md`            | 리뷰 가이드라인 — 무엇을 지적하고 무엇을 스킵할지. **컨벤션이 바뀌면 여기를 수정** |
| `additional-rules.md`  | 기계적으로 검출 가능한 추가 룰                                                     |
| `patterns.md`          | 판단·맥락이 필요한 반복 리뷰 패턴                                                  |
| `false-positives.md`   | 오탐 목록 — 여기 있는 패턴은 안 지적하거나 완화                                    |

### 보관 데이터 (`.review-learnings/`) — **과거 리뷰 시스템의 이력**

| 파일                      | 역할                                            |
| ------------------------- | ----------------------------------------------- |
| `attribution-log.md`      | 과거 리뷰 제안 처리 이력                        |
| `archived-patterns.md`    | 6개월 이상 관찰 안 된 오래된 패턴 보관소        |
| `reports/{YYYY}-W{WW}.md` | 과거 주간 리포트 보관 경로                      |

> `additional-rules.md` / `patterns.md` / `false-positives.md`의 초기 내용은
> 봄봄팀의 `woowacourse-teams/2025-bom-bom` PR 코멘트 2,100여 개를 분석해
> 채웠습니다.

---

## 3. 설정 / 동작 전제

- **GitHub Secret `OPENAI_API_KEY`** 가 등록돼 있어야 Codex 리뷰가 동작합니다.
- `/codex-review` 코멘트와 수동 실행은 GitHub 특성상 **워크플로우 파일이 기본 브랜치에
  머지된 뒤**에야 동작합니다.
- 모델은 GitHub Variable `CODEX_REVIEW_MODEL`로 바꿀 수 있습니다.

## 4. 알아두면 좋은 점

- **AI 리뷰는 보조 도구입니다.** Codex가 high-signal 기준으로 오탐을 줄이지만
  완벽하지 않아요. 헛짚는 지적도, 놓치는 버그도 있습니다. 사람 리뷰를 대체하지
  않습니다.
- 봇 지적이 틀렸으면 **답글로 반박**해 주세요. 반복 오탐은 `false-positives.md`에
  수동으로 추가하면 다음 리뷰 품질이 좋아집니다.
- 봇 리뷰 본문 끝에 `<!-- REVIEW_META ... -->` 주석이 있습니다. 향후 분석 자동화에
  다시 쓸 수 있으니 **편집·삭제하지 마세요.**
- `REVIEW_META`는 향후 리뷰 분석이나 학습 자동화를 다시 붙일 때 재사용할 수 있습니다.
