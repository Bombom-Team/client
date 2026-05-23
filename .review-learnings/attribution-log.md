# Attribution Log

AI 리뷰 제안의 수용/거절/무시 이력입니다.
이 데이터는 에이전트별 정확도를 추적하고 리뷰 품질을 개선하는 데 사용됩니다.

> Claude 기반 attribution 워크플로우를 제거하면서 자동 갱신은 중단됐습니다.
> 이 파일은 과거 리뷰 품질 분석 이력으로 보관합니다.

## 형식

```markdown
### PR #{번호} — {날짜}

| Finding | Agent   | Severity   | Confidence | Outcome                             | Method                                                  |
| ------- | ------- | ---------- | ---------- | ----------------------------------- | ------------------------------------------------------- |
| {제목}  | {agent} | {severity} | {conf}     | accepted/modified/dismissed/ignored | suggestion_applied/manual_fix/subsequent_push/no_change |
```

Outcome 정의:

- **accepted**: suggestion이 그대로 또는 거의 동일하게 적용됨
- **modified**: 해당 영역이 수정되었지만 suggestion과 다른 방식
- **dismissed**: 반박 reply 또는 false-positives.md에 기록됨
- **ignored**: 변경 없음 + reply 없음

---

## 집계 통계

<!-- 자동 업데이트 -->

| Agent                | Total | Accepted | Modified | Dismissed | Ignored | Accuracy |
| -------------------- | ----- | -------- | -------- | --------- | ------- | -------- |
| Bug & Logic          | 0     | 0        | 0        | 0         | 0       | -        |
| Convention & Pattern | 0     | 0        | 0        | 0         | 0       | -        |

---

## 이력

<!-- 아래에 PR별 이력이 자동으로 추가됩니다 -->
