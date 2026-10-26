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
> 점검**하고, 관련 발견이 있으면 어떤 항목에 대한 것인지 명시하세요. "이상 없음"으로
> 확인한 항목은 그 근거(읽은 파일·검색 결과)를 [리뷰 요약](#근거-기준)에 남기세요.

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

### UI 레이아웃·반응형

변경 파일만으로는 화면 결과를 판단할 수 없으므로, [근거 기준](#근거-기준)의 렌더링 맥락을
확인한 뒤 아래 결과가 특정 device·화면 폭에서 생길 때 Major로 지적합니다. 발생 조건
(device, 화면 폭, 함께 렌더링되는 요소)을 적습니다.

- `position: fixed`·`sticky`, `top`·`height`, `z-index`를 바꿔 같은 route에 함께 렌더링되는
  다른 고정 요소(헤더, 진행바, 플로팅 툴바, 하단 내비게이션)가 내용이나 조작 요소를 가리는 경우
- `useDevice()` 분기로 `rem` 기반 theme 토큰을 바꿨는데, 전역 root font-size를 반영한 실제
  px가 특정 device에서 PR 설명의 의도와 어긋나는 경우. 예: "입력창 16px 이상"이 목적인데
  mobile에서 16px 미만이 되어 iOS Safari가 화면을 확대하는 경우

Major에 해당하지 않는 화면 결과(가리지 않는 겹침, device별 크기 차이)는 finding으로 만들지
않고, 계산한 값과 근거를 [리뷰 요약](#근거-기준)에 적습니다.

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
- 위치·크기·`z-index`·글꼴 토큰·device 분기를 바꾼 UI 변경은 렌더링 맥락까지 확인합니다.
  - 변경된 컴포넌트를 렌더링하는 route 파일까지 올라가, 같은 화면의 다른 고정 요소가
    차지하는 영역(`top`·`bottom`·`height`, 가로로 겹칠 수 있으면 `left`·`right`·`width`)과
    `z-index`를 `파일:라인`으로 비교합니다.
  - `rem` 값은 workspace의 전역 root font-size로 device별 px를 계산해 적습니다. `web/`은
    `web/src/styles/reset.ts`의 `html` font-size를 기준으로 합니다.
  - 브라우저에서 직접 확인하지 않은 화면 결과는 리뷰 요약에 남깁니다.
- 구현을 직접 확인하지 않은 상태에서 Critical로 분류하지 않습니다.
- finding에는 발생 조건, 사용자·운영 영향, 코드 근거를 적습니다. `ai-review-workflow`의
  review JSON에서는 `condition`, `impact`, `evidence`, `suggestion`에 나눠 적고 `body`는
  1~3문장으로 줄입니다.
- 확인하지 못한 영역과 실행하지 않은 검증은 리뷰 요약에 남깁니다. finding이 0개라는
  것은 완전히 검증했다는 뜻이 아닙니다.
- 리뷰 요약은 리뷰 본문에서 리뷰어가 직접 서술하는 부분입니다. `ai-review-workflow`에서는
  review JSON에 나눠 적습니다.
  - 결론: `overall_explanation`에 1~2문장
  - Review Point별 결과와 근거: `review_points`
  - 계산한 값, 확인하지 못한 영역, 실행하지 않은 검증: `verification`. 리뷰 본문의
    "📋 리뷰하면서 확인한 내용"에 표시됩니다.

---

## 문장 작성 기준

리뷰를 읽는 사람은 주니어 개발자일 수 있습니다. 해당 코드를 처음 보는 사람도 한 번 읽고
**무엇이 문제이고, 왜 문제이고, 어떻게 고치면 되는지** 알 수 있게 씁니다.

- 결론부터 씁니다. 첫 문장에 무엇이 문제인지 적고, 이유와 근거는 그다음에 적습니다.
- 한 문장에는 한 가지 내용만 씁니다. 두 줄을 넘는 문장은 나눕니다.
- 영어 용어 대신 한국어로 씁니다. 예: finding → 지적, inline comment → 코드 줄 코멘트,
  high signal → 근거가 확실한. 코드 식별자, 파일 경로, 라이브러리 이름은 그대로 둡니다.
- 꼭 필요한 전문 용어는 처음 나올 때 괄호로 풀어 씁니다.
  예: race condition(두 요청의 응답 순서가 바뀌어 오래된 값이 화면에 남는 문제)
- 번역체를 쓰지 않습니다: "~에 대해", "~을 통해", "~하는 것으로 보입니다", "~되어집니다",
  "~를 진행합니다".
- 주어와 서술어가 맞는지, 조사가 빠지지 않았는지 확인합니다.
- "문제가 될 수 있습니다"처럼 막연하게 쓰지 않습니다. 어떤 상황에서 사용자가 무엇을 겪는지
  적습니다.

| 피할 문장 | 쓸 문장 |
| --- | --- |
| queryKey 누락으로 인한 stale cache 이슈가 발생할 가능성이 있는 것으로 보입니다. | `queryKey`에 `id`가 없습니다. 다른 글로 이동해도 이전 글 데이터가 그대로 보입니다. |
| Review Point 1에 대해 high signal 원칙과 충돌하지 않는다고 봤습니다. | Review Point 1은 문제없습니다. 근거가 확실한 경우만 지적하도록 조건을 좁혔습니다. |

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
