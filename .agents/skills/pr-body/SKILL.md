---
name: pr-body
description: PR 본문(description/body)을 프로젝트 템플릿에 맞춰 작성하고, 사용자 확인 후 `gh pr create`로 실제 PR까지 올립니다. 사용자가 "PR 올려줘", "PR 만들어줘", "PR 본문 써줘", "PR 설명 작성", "PR description 만들어줘" 같은 요청을 하면 반드시 이 스킬을 사용하세요. 현재 브랜치와 main의 diff·커밋을 분석해 What/How/Review Point를 채우고, Why가 코드만으로 불명확하면 사용자에게 질문해 맥락을 받아 작성합니다. 본문 초안과 제목을 사용자에게 보여주고 승인받은 뒤 PR을 생성합니다.
---

# PR Creator

프로젝트의 PR 템플릿에 맞춰 PR 본문을 작성하고, 사용자 확인을 거쳐 `gh pr create`로 PR을 올립니다.

## 핵심 원칙

1. **추측 금지**: diff·커밋에 없는 내용은 적지 않는다. Why는 대부분 코드에 드러나지 않으므로 **모르면 물어본다**.
2. **간결함**: 리뷰어가 30초 안에 파악할 수 있게 bullet로 핵심만.
3. **What ≠ How**: What은 "무엇을 해결했나(결과/변화)", How는 "어떻게 했나(기술적 접근)". 섞지 않는다.
4. **프로젝트 관례 존중**: 한국어, bullet point(`-`), 템플릿의 `<!-- 주석 -->`은 최종 본문에서 제거.

## 작업 흐름

### 1. PR 템플릿 읽기

다음 경로를 순서대로 찾아서 읽는다:
- `.github/pull_request_template.md`
- `.github/PULL_REQUEST_TEMPLATE.md`
- `docs/pull_request_template.md`

템플릿이 없다면 기본 섹션(What / Why / How / Review Point)으로 진행하고 사용자에게 알린다.

### 2. 변경사항 수집 (병렬 실행)

현재 브랜치가 main에서 갈라진 이후의 변경을 본다:

```bash
git branch --show-current                                     # 브랜치명 (이슈 키 추출용)
git log $(git merge-base HEAD main)..HEAD --oneline           # 커밋 목록
git log $(git merge-base HEAD main)..HEAD                      # 커밋 메시지 본문
git diff $(git merge-base HEAD main)...HEAD --stat            # 파일별 변경량
git diff $(git merge-base HEAD main)...HEAD                   # 실제 diff
```

기준 브랜치가 `main`이 아니면(예: `develop`) `git log --all --oneline -20`로 확인하거나 사용자에게 묻는다.

diff가 너무 크면 `--stat`으로 개요만 본 뒤, 중요해 보이는 파일만 Read로 확인한다.

### 3. 맥락 파악

각 섹션별로 어디서 내용을 끌어낼지:

| 섹션 | 주 출처 |
|------|---------|
| 📌 What | 커밋 메시지의 주어, 변경된 파일·컴포넌트명, PR 제목 |
| ❓ Why | **코드에 없음** → 이슈 트래커 or 사용자 질문 |
| 🔧 How | diff의 핵심 변경사항 |
| 👀 Review Point | 사이드이펙트 가능 영역, 디자인 확인, 회귀 테스트 포인트 |

**이슈 키 추출**: 브랜치명(`feat/BOM-123`, `BOM-1085-...`)이나 커밋 메시지(`[BOM-123] ...`)에서 `BOM-\d+` 패턴을 찾는다. Linear MCP(`mcp__claude_ai_Linear__get_issue`)가 있으면 이슈 본문을 조회해 Why의 단서로 활용한다.

### 4. Why·What이 불명확하면 질문하기

이 스킬의 핵심. 코드·커밋·이슈만으로 채울 수 없는 부분은 **반드시 사용자에게 묻는다**. 추측으로 채우지 말 것.

#### 언제 물어봐야 하나

- **Why**: 이슈가 없거나, 이슈에도 배경이 없거나, 여러 해석이 가능할 때 → 거의 항상 물어봐야 함
- **What**: 여러 종류의 변경이 섞여 있어 하나의 문장으로 요약이 어려울 때
- **접근 방식의 이유(How의 보조)**: 대안이 있었는데 왜 이 방식을 골랐는지가 중요해 보일 때

#### 어떻게 물어보나

`AskUserQuestion` 툴로 한 번에 1~2개만 묻는다. 질문은 짧고 구체적으로:

- ✅ "이 작업을 하게 된 배경이 궁금해요. 버그 제보, 지표 이슈, 기획 요청 중 어디에 가까운가요?"
- ✅ "여러 변경이 섞여 있는데, 이 PR의 주된 목적을 한 줄로 알려주실래요?"
- ❌ "이 PR에 대해 설명해주세요" (너무 열려 있음)
- ❌ 질문 3개 이상 연달아 (사용자 피로)

이미 이슈 본문에 Why가 있으면 질문하지 말고 그대로 활용한다.

### 5. 초안 작성

#### 섹션별 작성 가이드

**📌 What** — 해결한 문제/작업 (1~3 bullet)
- 결과·변화 중심, 구현 디테일은 빼기
- 예: `- 로그인 실패 시 에러 메시지가 출력되지 않던 문제 수정`

**❓ Why** — 이 작업이 필요한 배경 (1~2 bullet)
- 사용자 피드백, 지표, 기획 요청, 기술부채, 접근성 등
- 예: `- 사용자 피드백으로 오류 원인 파악이 어렵다는 의견이 있었음`

**🔧 How** — 기술적 접근과 주요 변경 (2~5 bullet)
- "무엇을 바꿨는지" 중심 (파일 나열 X, 동작·로직 O)
- 선택한 방식의 이유가 중요하면 짧게 첨언
- 예:
  - `- LoginForm에 react-hook-form의 errors 객체를 에러 UI에 연결`
  - `- 에러 메시지 i18n 키를 errors.login.* 네임스페이스로 정리`

**👀 Review Point** — 리뷰어 확인 포인트 (체크박스)
- 회귀 가능성 있는 영역, 디자인 QA, 엣지 케이스
- 예:
  - `- [ ] 로그인 실패 시 에러 메시지 노출 확인`
  - `- [ ] 기존 성공 플로우 회귀 없는지 확인`

#### 섹션에 쓸 내용이 없을 때

- 섹션 헤더는 유지하고 비워둔다 (템플릿 주석은 제거)
- 예: 단순 변경이라 Review Point가 특별히 없다면 섹션을 비우거나 `- [ ] 특이사항 없음` 정도

### 6. PR 제목 생성

프로젝트 컨벤션(`web/CLAUDE.md`)에 따라 제목은 다음 형식:

```
[FE][{issue_key}] {type}:{subject}
```

- `issue_key`: 브랜치명·커밋 메시지에서 추출한 `BOM-\d+` (없으면 `[FE]`만)
- `type`: 커밋의 주된 type (`feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`)
- `subject`: 한국어로 간결하게 (70자 이내)

예: `[FE][BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가`

여러 종류의 커밋이 섞여 있으면 가장 핵심적인 type 하나를 고르고, 애매하면 사용자에게 묻는다.

### 7. 사용자 확인 → PR 생성

PR 생성은 외부에 노출되는 비가역 작업이므로, **본문과 제목을 보여주고 반드시 사용자 승인을 받은 뒤** 실행한다.

#### 7-1. 초안 보여주기

다음 형식으로 출력:

```
**제목**: [FE][BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가

**본문**:

## 📌 What
...

이대로 PR을 올릴까요?
```

본문은 fenced code block으로 감싸지 않는다 (사용자가 가독성 있게 검토할 수 있도록).

#### 7-2. 사용자 승인 받기

`AskUserQuestion`으로 묻는다:
- "이대로 PR 생성할까요?" — 옵션: `네, 올려주세요` / `수정하고 싶어요`

수정 요청이 오면 반영 후 다시 7-1부터 반복.

#### 7-3. 푸시 & PR 생성

승인되면 다음 순서로 실행:

```bash
# 1) 원격 추적 브랜치가 없으면 푸시
git rev-parse --abbrev-ref --symbolic-full-name @{u} 2>/dev/null || \
  git push -u origin "$(git branch --show-current)"

# 2) HEREDOC으로 본문 전달해서 PR 생성
gh pr create --title "[FE][BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가" --body "$(cat <<'EOF'
## 📌 What
...
EOF
)"
```

`--base` 옵션은 기본값(`main`)을 따른다. develop 같은 다른 base가 필요하면 사용자에게 물어본다.

#### 7-4. 결과 보고

생성된 PR URL을 한 줄로 알려준다.

## 예시

**Input 맥락**:
- 브랜치: `feat/BOM-942`
- 커밋: `[BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가`
- diff: `ChallengeLanding.tsx`에 `FloatingButton` 컴포넌트 추가, 스크롤 위치에 따른 show/hide 로직
- 사용자 답변(Why): "랜딩에서 챌린지 참여 전환율이 낮아서 CTA 노출을 늘리려고"

**1) 사용자에게 보여주는 초안**:

**제목**: `[FE][BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가`

**본문**:

## 📌 What

- 챌린지 랜딩 페이지에 참여 CTA 플로팅 버튼 추가

## ❓ Why

- 랜딩에서 챌린지 참여 전환율이 낮아 CTA 노출 기회를 늘리기 위함

## 🔧 How

- `ChallengeLanding`에 `FloatingButton` 컴포넌트 추가
- 스크롤 위치에 따라 show/hide 처리 (hero 영역 지나면 노출)
- 기존 인라인 CTA와 동일한 액션 핸들러 공유

## 👀 Review Point

- [ ] 스크롤 show/hide 전환이 자연스러운지 확인
- [ ] 모바일/PC 둘 다 레이아웃 확인
- [ ] 기존 인라인 CTA와 동작 일치 여부

이대로 PR을 올릴까요?

**2) 승인 후 실행**:

```bash
git push -u origin feat/BOM-942
gh pr create --title "[FE][BOM-942] feat: 챌린지 랜딩 플로팅 버튼 추가" --body "$(cat <<'EOF'
## 📌 What

- 챌린지 랜딩 페이지에 참여 CTA 플로팅 버튼 추가

...
EOF
)"
```

**3) 결과**: 생성된 PR URL 한 줄 출력.

## 안티패턴

- ❌ 사용자 확인 없이 곧바로 `gh pr create` 실행
- ❌ 커밋 메시지를 그대로 복붙해서 bullet로 나열 (스토리가 안 묶임)
- ❌ "전반적으로 개선했습니다" 같은 추상적 문장
- ❌ 파일 경로만 나열 (`- src/pages/foo.tsx 수정`) — 무엇을 왜 고쳤는지가 없음
- ❌ What에 How를 섞기 (`- react-hook-form으로 로그인 에러 처리` → What이 아니라 How)
- ❌ Why에 "해결을 위해" 같은 순환 논리 (`- 버그를 고치기 위해 버그를 고쳤다`)
- ❌ `gh pr create` 본문을 HEREDOC 없이 `-b "..."`로 전달 (개행·따옴표 깨짐)
- ❌ `--no-verify` 등으로 훅 우회 (사용자가 명시 요청한 경우만)
