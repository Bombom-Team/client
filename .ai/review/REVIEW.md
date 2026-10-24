# Review Guidelines

리뷰 에이전트가 **무엇을 어떤 근거로 지적할지** 정하는 리뷰 정책 원본입니다.
CodeRabbit과 `ai-review-workflow` skill이 이 문서를 읽습니다.

구현 규칙의 원본은 이 문서가 아닙니다. 규칙 위반을 지적할 때는 아래 원본의 해당 절을
제목 링크로 인용하고, 규칙 본문을 이 문서에 복제하지 않습니다.

| 규칙 | 원본 |
| --- | --- |
| React UI code 규칙(`web/`, `admin/`, `maeil-mail/`) | [CONVENTIONS.md의 Frontend coding standards](../CONVENTIONS.md#frontend-coding-standards) |
| 생성 파일·검증 정책 | [RULES.md의 AI behavior rules](../RULES.md#ai-behavior-rules) |
| workspace 경계·인증·API·WebView 계약 | [architecture.md](../../docs/architecture.md) |
| 알려진 오탐과 적용 조건 | [false-positives.md](false-positives.md) |

> **PR 본문의 `👀 Review Point` 참고**: PR 본문에 `👀 Review Point` 섹션이 있으면,
> 그 항목은 **작성자가 직접 리뷰를 요청한 지점**입니다. 해당 항목을 **반드시 함께
> 점검**하고, 관련 발견이 있으면 어떤 항목에 대한 것인지 명시하세요. 항목별 결과와
> 근거(읽은 파일·검색 결과)는 리뷰 JSON의 `review_points`에 남기세요.

---

## 반드시 지적할 것

### 런타임 에러

- null/undefined 접근 가능성 (optional chaining 누락, 타입 가드 부재)
- 빈 배열에 대한 인덱스 접근 (`array[0]` without length check)
- Promise rejection 미처리 (try-catch 누락, `.catch` 없음)
- 렌더링 중 setState 호출 (무한 루프)

### 비즈니스 로직

- PR 설명의 의도와 코드 동작이 불일치
- 데드 코드 경로 (도달 불가능한 분기, 아무것도 안 하는 버튼)
- 하드코딩된 더미 데이터가 프로덕션에 나갈 수 있는 경우
- 새 플로우에 analytics/추적 이벤트 누락 (기존 유사 플로우에 이벤트가 있는 경우)

### 데이터·상태

- `queryFn`이 사용하는 변수가 `queryKey`에 빠져 stale 캐시가 생기는 경우
- mutation 성공 후 영향을 받는 query의 무효화·갱신이 빠진 경우
- 서버 데이터를 TanStack Query 밖에서 직접 호출하거나 로컬 state로 복제해 동기화가
  깨지는 경우
- 다른 state·props에서 계산할 수 있는 값을 `useEffect` + `setState`로 동기화해 한 박자
  늦은 렌더나 불일치가 생기는 경우
- `''`이나 `0`이 유효한 값인데 `||`로 fallback해 값이 바뀌는 경우
- API 경로·payload를 바꿨는데 `mocks/handlers/**`가 갱신되지 않은 경우

### 보안·설정

- API base URL, 토큰, secret을 소스에 리터럴로 넣은 경우. 외부 링크 URL은 해당하지 않습니다.

### 프로젝트 규칙 위반

- [리뷰 제외 파일](#리뷰-제외-파일) 중 생성 파일을 수동으로 수정한 diff
  ([Generated files](../RULES.md#generated-files))
- [Frontend coding standards](../CONVENTIONS.md#frontend-coding-standards) 규칙 중 lint로
  검사되지 않는 규칙의 위반. 동작에 영향이 없으면 Minor로 분류합니다.

### 타입 안전성

- `as any` 타입 단언
- exhaustive switch 에서 `never` 타입 미사용 (분기 누락 시 컴파일 통과)

---

## 지적하지 말 것

- lint가 검사하는 항목: import 순서, type import 분리, 미사용 변수·import, CSS 속성 순서,
  포맷, `web/`의 jsx-a11y 규칙
- 원본 규칙에 근거하지 않은 스타일·네이밍 취향
- 컴포넌트 내부의 `useCallback`/`useMemo` 최적화 제안. 커스텀 훅이 반환하는 값의
  메모화 누락은 [Effect와 참조 안정성](../CONVENTIONS.md#effect와-참조-안정성)
  위반으로 지적할 수 있습니다.
- 상수화 제안 (매직 넘버 제외)
- "~를 고려해보세요", "~는 어떨까요?" 식의 약한 제안이나 질문형 제안
- [리뷰 제외 파일](#리뷰-제외-파일)의 내용
- 이번 PR 이전부터 존재하던 기존 이슈 (pre-existing)
- [false-positives.md](false-positives.md)의 조건에 해당하는 지적

---

## 리뷰 제외 파일

자동 생성 파일과 lock 파일은 내용을 리뷰하지 않습니다. 이 목록이 리뷰 제외 대상의 원본입니다.

- `*.gen.ts`
- `*.generated.*`
- `**/openapi.d.ts`
- `**/generated/**`
- `pnpm-lock.yaml`, `*.lock`

`.coderabbit.yaml`의 `path_filters`는 설정 파일이라 이 문서를 참조할 수 없으므로, 목록을 바꿀 때
함께 수정합니다.

---

## 근거 기준

- diff에서 시작하되, head 기준 변경 파일 전체와 직접 의존성·소비처를 확인합니다.
- 호출부 수, 미사용 여부, "기존 패턴과 다름" 같은 cross-file 주장은 검색 결과를 열어
  실제 호출인지 확인하고 `파일:라인`을 적습니다. 구체 위치가 없으면 게시하지 않습니다.
- 영향 범위는 PR이 변경한 workspace 안에서만 셉니다. 같은 이름의 훅·컴포넌트가 다른
  workspace에 있어도 같은 구현으로 보지 않습니다. `shared`를 변경했다면 이를 import하는
  workspace까지 확인합니다.
- 구현을 직접 확인하지 않은 상태에서 Critical로 분류하지 않습니다.
- finding에는 발생 조건, 사용자·운영 영향, 코드 근거를 적습니다. 리뷰 JSON에서는
  `condition`, `impact`, `evidence`, `suggestion`에 나눠 적고 `body`는 1~3문장으로 줄입니다.
- 확인하지 못한 영역과 실행하지 않은 검증은 리뷰 JSON의 `verification`에 남깁니다.
  finding이 0개라는 것은 완전히 검증했다는 뜻이 아닙니다.

---

## 심각도 기준

| 심각도             | 기준                                      | 조건                           |
| ------------------ | ----------------------------------------- | ------------------------------ |
| 🚨 Critical        | 프로덕션 크래시, 데이터 손실, 보안 취약점 | 재현 시나리오 필수             |
| ⚠️ Major           | 특정 조건에서 버그 발생                   | 조건 명시 필수                 |
| 📝 Minor           | 동작하지만 개선 필요. 동작 영향이 없는 규칙 위반 | PR당 최대 2개, 원본 규칙 링크 필수 |
| ~~Recommendation~~ | **사용 금지**                             | Minor로 올리거나 지적하지 않기 |

findings가 0개여도 괜찮습니다. 진짜 이슈가 없으면 억지로 만들지 마세요.
"high signal only" 원칙을 따르며, 확신이 낮은 항목은 코멘트하지 않습니다.
