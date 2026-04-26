---
name: pr-body
description: PR 본문을 프로젝트 템플릿에 맞춰 작성한다. 사용자가 PR 설명 작성을 요청하면 브랜치 diff/커밋을 분석해 What/Why/How/Review Point를 채운 마크다운 본문을 출력한다.
---

# PR Body Writer

현재 브랜치 변경사항을 바탕으로 리뷰어 친화적인 PR 본문을 만든다.

## 핵심 원칙

- 추측 금지: 코드/커밋/이슈에서 확인되지 않으면 사용자에게 묻는다.
- What(결과)와 How(접근)를 분리한다.
- 템플릿 주석(`<!-- ... -->`)은 최종 출력에서 제거한다.
- `gh pr create` 실행 없이 본문 텍스트만 제공한다.

## 작업 순서

1. PR 템플릿 탐색:
   - `.github/pull_request_template.md`
   - `.github/PULL_REQUEST_TEMPLATE.md`
   - `docs/pull_request_template.md`
2. 변경사항 수집:
   - `git branch --show-current`
   - `git log $(git merge-base HEAD main)..HEAD --oneline`
   - `git log $(git merge-base HEAD main)..HEAD`
   - `git diff $(git merge-base HEAD main)...HEAD --stat`
   - `git diff $(git merge-base HEAD main)...HEAD`
3. Why가 비어 있으면 사용자에게 1~2개 질문으로 확인.
4. 최종 PR 본문 생성:
   - `## 📌 What`
   - `## ❓ Why`
   - `## 🔧 How`
   - `## 👀 Review Point`

## 출력 규칙

- 본문은 마크다운 텍스트 그대로 출력한다.
- fenced code block으로 감싸지 않는다.
- 마지막에 짧게 "필요 시 수정해서 사용하세요." 문구를 덧붙인다.

