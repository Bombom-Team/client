# 🤖 AI PR 리뷰 — 팀 가이드

이 저장소의 PR은 두 경로로 AI 리뷰를 받습니다. 두 경로 모두 이 폴더의 리뷰 정책과
[CONVENTIONS.md의 Frontend coding standards](../.ai/CONVENTIONS.md#frontend-coding-standards)를 기준으로 리뷰합니다.

AI 리뷰는 보조 도구입니다. 헛짚는 지적도, 놓치는 버그도 있습니다. 사람 리뷰를 대체하지
않습니다.

---

## TL;DR — 팀원이 알아야 할 것

| 하고 싶은 것 | 방법 |
| --- | --- |
| 자동 리뷰 받기·건너뛰기 | CodeRabbit이 PR을 자동 리뷰합니다. 대상 branch, 제외 조건(draft, 제목 키워드)은 `.coderabbit.yaml`의 `auto_review`를 확인합니다 |
| Claude 리뷰 받기 | Claude Code에서 `ai-review-workflow` skill로 PR 리뷰를 요청합니다. GitHub 게시는 명시적으로 요청할 때만 합니다 |
| 리뷰 정확도 높이기 | PR 본문 `👀 Review Point`에 확인할 지점을 구체적으로 적습니다 |
| 봇 지적이 틀렸을 때 | 해당 코멘트에 근거와 함께 답글을 답니다. 같은 오탐이 반복되면 발생 조건과 반례를 `false-positives.md`에 추가합니다 |

---

## 1. 리뷰 경로

| 경로 | 트리거 | 게시 |
| --- | --- | --- |
| CodeRabbit | PR 자동 리뷰. 조건은 `.coderabbit.yaml` | `coderabbitai[bot]` 리뷰 |
| Claude (`ai-review-workflow` skill) | 채팅 요청. PR 이벤트로 도는 cloud routine(저장소 밖 설정) | 기본은 채팅 결과만. 게시 요청 시 `.github/scripts/publish-codex-review.sh`가 게시 |

Claude 리뷰의 게시 정책(COMMENT, 조건부 APPROVE, `ALLOW_APPROVE`)은 skill의
"Review Event Decision"과 publisher가 원본입니다.

---

## 2. 리뷰 결과 다루기

- 지적이 맞다 → 고쳐서 push합니다.
- 지적이 틀렸다 → 근거와 함께 답글로 반박합니다. 반복되는 오탐만 `false-positives.md`에
  추가합니다. 답글이 없다는 이유만으로 지적을 수용된 규칙으로 보지 않습니다.
- 같은 문제가 반복된다 → 리뷰 규칙을 늘리기보다 테스트나
  [CONVENTIONS.md의 Frontend coding standards](../.ai/CONVENTIONS.md#frontend-coding-standards) 규칙으로 옮깁니다.

---

## 3. 파일별 역할

| 파일 | 역할 | 읽는 곳 |
| --- | --- | --- |
| `REVIEW.md` | 무엇을 어떤 근거로 지적할지, 심각도 기준 | CodeRabbit, Claude skill |
| `false-positives.md` | 알려진 오탐과 적용 조건 | CodeRabbit, Claude skill |

구현 규칙은 이 폴더에 두지 않습니다. 규칙을 바꾸려면
[CONVENTIONS.md의 Frontend coding standards](../.ai/CONVENTIONS.md#frontend-coding-standards)를 수정합니다.

초기 리뷰 규칙과 오탐 목록은 `woowacourse-teams/2025-bom-bom` PR 코멘트 2,100여 개를
분석해 작성했습니다.

## 4. 알아두면 좋은 점

- Claude 리뷰 본문 끝의 `<!-- REVIEW_META ... -->` 주석과 inline 코멘트의
  `<!-- CODEX_REVIEW_COMMENT -->` 마커는 이전 리뷰 이슈 추적에 쓰이므로 **편집·삭제하지
  마세요.**
