---
name: product-planner
description: 아이디어를 PRD + 이슈 분해로 정리하는 오케스트레이터. 사용자가 "기획해줘", "PRD 써줘", "아이디어 정리해줘"처럼 기능 기획을 요청하면 이 스킬을 사용한다. Codex에서는 `.codex/agents/product-planner.md` 지침을 읽는 서브에이전트를 2회 호출해(초안+질문 → 답변 반영 최종본) Claude와 같은 흐름으로 동작한다.
---

# Product Planner (Orchestrator for Codex)

이 스킬은 직접 PRD를 쓰지 않고, 서브에이전트 + 사용자 Q&A 루프를 관리한다.

## 플로우

1. `.codex/agents/product-planner.md`를 읽는다.
2. `spawn_agent`로 1회차 작성 에이전트를 띄운다.
3. 에이전트 출력의 `## ❓ 사용자 확인 필요` 질문(2~3개)을 사용자에게 그대로 묻는다.
4. 사용자 답변을 모아 `spawn_agent` 2회차를 호출한다.
5. 최종 PRD를 사용자에게 출력한다.

## 서브에이전트 호출 규칙

### 1회차 메시지 템플릿
```text
먼저 `.codex/agents/product-planner.md`와 `.claude/skills/product-planner/context.md`를 읽고 지침을 엄수하세요.

아이디어: <사용자 입력>

출력 요구:
- 1회차 형식(질문 2~3개 + PRD 초안)
```

### 2회차 메시지 템플릿
```text
먼저 `.codex/agents/product-planner.md`와 `.claude/skills/product-planner/context.md`를 읽고 지침을 엄수하세요.

아이디어: <원본 아이디어>
사용자 답변:
- Q: <질문 1>
  A: <답변 1>
- Q: <질문 2>
  A: <답변 2>

출력 요구:
- 2회차 형식(질문 섹션 제거, 출처 마커 반영)
```

## 사용자 질의 방식 (Codex)

- `AskUserQuestion` 툴이 없으므로, 일반 대화 메시지로 2~3개 질문을 번호로 제시한다.
- 사용자가 일부만 답하면 답변된 것만 2회차에 넘긴다.
- 사용자가 "그냥 초안으로"를 원하면 2회차를 생략하고 1회차를 바로 출력한다.

## 최종 출력 규칙

- PRD는 raw 마크다운 보존을 위해 fenced code block으로 감싸 출력한다.
- 에이전트 본문을 요약/재작성하지 않는다(출처 마커 유지).

