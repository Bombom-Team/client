---
name: design-planner
description: 봄봄 디자인 가이드 기반 화면/컴포넌트 설계 오케스트레이터. 사용자가 "디자인해줘", "화면 설계", "UI 구성 잡아줘"처럼 시각/인터랙션 설계를 요청하면 이 스킬을 사용한다. Codex에서는 `.codex/agents/design-planner.md` 지침을 읽는 서브에이전트를 2회 호출해(초안+질문 → 답변 반영 최종본) Claude와 동일한 루프로 동작한다.
---

# Design Planner (Orchestrator for Codex)

이 스킬은 화면 설계를 직접 만들기보다, 서브에이전트와 사용자 질의응답을 연결한다.

## 플로우

1. `.codex/agents/design-planner.md`를 읽는다.
2. `spawn_agent`로 1회차 초안을 생성한다.
3. 응답의 `## ❓ 사용자 확인 필요` 질문을 사용자에게 전달한다.
4. 답변을 수집해 `spawn_agent` 2회차를 실행한다.
5. 최종 디자인 설계를 사용자에게 출력한다.

## 서브에이전트 호출 규칙

### 1회차 메시지 템플릿
```text
먼저 `.codex/agents/design-planner.md`와 `.claude/skills/design-planner/bombom-design-guide.md`를 읽고 지침을 엄수하세요.

아이디어: <사용자 입력 또는 PRD 요약>

출력 요구:
- 1회차 형식(질문 2~3개 + 디자인 초안)
```

### 2회차 메시지 템플릿
```text
먼저 `.codex/agents/design-planner.md`와 `.claude/skills/design-planner/bombom-design-guide.md`를 읽고 지침을 엄수하세요.

아이디어: <원본 입력>
사용자 답변:
- Q: <질문 1>
  A: <답변 1>
- Q: <질문 2>
  A: <답변 2>

출력 요구:
- 2회차 형식(질문 섹션 제거, 출처 마커 반영)
```

## 사용자 질의 방식 (Codex)

- 일반 대화로 질문한다(번호 목록 2~3개).
- 답변이 일부만 오면 받은 답변만 반영해 2회차를 호출한다.
- 사용자가 추가 질문 없이 진행을 원하면 1회차 초안을 최종안으로 전달한다.

## 최종 출력 규칙

- 에이전트가 작성한 본문을 그대로 전달한다.
- 불필요한 재요약/재서식으로 출처 마커를 제거하지 않는다.

