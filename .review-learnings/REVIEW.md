# Review Guidelines

리뷰 에이전트가 따라야 할 가이드라인입니다.
client 레포의 `CONVENTIONS.md`, `docs/frontend-coding-standards.md`, `docs/ai-rules.md`,
`CLAUDE.md` 를 기준으로 작성되었습니다.

> 규칙 우선순위: `CONVENTIONS.md` → `docs/ai-rules.md` →
> `docs/frontend-coding-standards.md` → 기존 코드베이스 패턴 → 툴 기본값.
> 규칙이 충돌하면 항상 상위 문서가 이깁니다.

> **PR 본문의 `👀 Review Point` 참고**: PR 본문(컨텍스트의 PR Intent)에
> `👀 Review Point` 섹션이 있으면, 그 체크리스트 항목은 **작성자가 직접 리뷰를 요청한
> 지점**입니다. 리뷰 시 해당 항목들을 **반드시 함께 점검**하고, 관련된 발견이 있으면
> 어떤 Review Point 항목에 대한 것인지 명시해 코멘트하세요. 항목이 "이상 없음"으로
> 확인되면 그 근거(읽은 파일·`Grep` 결과)를 리뷰 본문 "검증 과정"에 남기세요.

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

### 프로젝트 규칙 (client)

- **생성 파일 수동 수정 금지** — `*.gen.ts` (예: `routeTree.gen.ts`) 를 직접 수정한
  diff. 생성 파일은 generator 명령으로만 갱신해야 합니다 (`docs/ai-rules.md`).
- **TanStack Query — `useMutation`** (`docs/frontend-coding-standards.md` §9)
  - `useMutation` 을 컴포넌트 안에서 직접 호출. 반드시 커스텀 훅으로 분리해야 합니다.
  - mutation 커스텀 훅 네이밍 규칙 위반 — `use{What}{Action}Mutation` 형식이어야 합니다.
- **TanStack Query — `useQuery`** (§9)
  - `useQuery` 를 query factory(`queries.*`) 없이 컴포넌트 내부 inline 옵션으로 사용.
- **Mutation UX** (§8) — mutation 에 로딩/성공/실패 사용자 피드백이 누락된 경우.
- **컴포넌트 export** (§3) — 컴포넌트를 named export 로 내보냄. 컴포넌트는 반드시
  `export default`, 훅·유틸은 `export const` 여야 합니다.
- **코드 위치 배치** (§2) — 재사용 범위에 맞지 않는 위치. 여러 페이지 공용 컴포넌트가
  특정 페이지 폴더 안에 있거나, 여러 워크스페이스 공용 코드가 `shared` 에 없는 경우.
- **API 호출** (§7) — 공용 fetcher 를 쓰지 않고 직접 `fetch`/`axios` 호출, 또는
  요청/응답 타입을 OpenAPI 생성 타입 대신 손으로 정의한 경우.
- **함수 선언** (§1) — 컴포넌트/훅/유틸을 `function` 선언으로 작성 (화살표 함수여야
  함). 예외: `routes` 폴더에서 Route `component` 로 쓰이는 컴포넌트는 `function` 허용.
- **커스텀 훅 내부 메모이제이션** (팀 컨벤션) — 커스텀 훅이 **반환하는** 함수는
  `useCallback` 으로, 반환하는 객체/배열/계산값은 `useMemo` 로 감싸야 합니다. 훅의
  반환값이 메모화 없이 매 렌더 새 참조로 생성되면, 그 훅을 쓰는 쪽의 `useEffect`
  의존성·메모이제이션이 깨지므로 지적하세요. (컴포넌트 내부에서의 메모이제이션은
  필요할 때만 — 지적 대상 아님.)
- **단일 책임 — 컴포넌트/훅 분리** (팀 컨벤션) — 컴포넌트와 훅은 각각 **하나의
  역할**만 담당해야 합니다. 특히 훅이 **UI 표현 로직까지 떠안는 것은 지양**합니다 —
  예: 데이터 페칭/상태 관리용 훅이 화면에 보여줄 텍스트 가공(라벨 문자열, 표시용
  포맷)·UI 분기까지 함께 처리하는 경우. 이런 UI 로직은 컴포넌트가 담당하게
  분리하라고 지적하세요.
  - **예외**: 그 훅이 **애초에 그 역할을 위해 만들어진 경우**는 지적 대상이 아닙니다
    (예: 표시용 텍스트 포맷팅 전용 훅, `useFormattedDate` 같은 UI 포맷 전용 훅).
    훅의 이름·목적이 그 책임과 일치하면 단일 책임을 지키는 것입니다.

### 타입 안전성

- `as any` 타입 단언
- exhaustive switch 에서 `never` 타입 미사용 (분기 누락 시 컴파일 통과)

---

## 절대 지적하지 말 것

- 스타일/네이밍 (ESLint/Stylelint 가 처리)
- import 순서, 미사용 변수/import (린터가 처리)
- 컴포넌트 내부의 `useCallback`/`useMemo` 최적화 제안 (단, **커스텀 훅이 반환하는**
  함수/값의 메모화 누락은 프로젝트 규칙이므로 지적 대상 — 위 "프로젝트 규칙" 참조)
- 상수화 제안 (매직 넘버 제외)
- "~를 고려해보세요" 식 약한 제안
- `*.gen.ts` 파일 자체의 내용 (자동 생성 — 단, 수동 수정 diff 는 위에서 지적)
- `pnpm-lock.yaml` 등 lock 파일
- 이번 PR 이전부터 존재하던 기존 이슈 (pre-existing)

---

## 심각도 기준

| 심각도             | 기준                                      | 조건                           |
| ------------------ | ----------------------------------------- | ------------------------------ |
| 🚨 Critical        | 프로덕션 크래시, 데이터 손실, 보안 취약점 | 재현 시나리오 필수             |
| ⚠️ Major           | 특정 조건에서 버그 발생                   | 조건 명시 필수                 |
| 📝 Minor           | 동작하지만 개선 필요                      | PR당 최대 2개                  |
| ~~Recommendation~~ | **사용 금지**                             | Minor로 올리거나 지적하지 않기 |

findings가 0개여도 괜찮습니다. 진짜 이슈가 없으면 억지로 만들지 마세요.

---

## 경로별 추가 규칙

### routes/

- TanStack Router 라우트 정의. Route `component` 로 쓰이는 컴포넌트는 프레임워크
  제약상 `function` 선언이 허용됩니다 (`docs/frontend-coding-standards.md` §1).
- `routeTree.gen.ts` 는 생성 파일 — 수동 수정 금지.

### src/apis/{domain}/

- API 파일은 도메인 단위로 관리: `{domain}.api.ts` + `{domain}.query.ts`.
- 공용 fetcher 사용, 요청/응답 타입은 OpenAPI 생성 타입 기준 (§7).

### components / styled component

- 컴포넌트 파일 구성 순서 (§4): ① 컴포넌트 선언 → ② `export default` →
  ③ emotion styled component 정의.
- styled component 네이밍 (§6): 최상위 wrapper 는 `Container`, 중간 레이아웃은
  `~Wrapper`, 작은 단위 요소는 `~Box`.
- 1파일 1컴포넌트 원칙 (§5). 예외: 항상 함께 쓰이는 composition 컴포넌트
  (`Card`/`CardHeader`/`CardBody`).

### hooks / event handler / 타입

- 이벤트 핸들러 네이밍 (§11): props 콜백은 `on-` (`onClose`), 내부 핸들러는
  `handle-` (`handleClick`).
- 타입 네이밍 (§12): 컴포넌트 props 타입은 `Props` suffix, 함수/훅 파라미터 타입은
  `Params` suffix.
- `useEffect` 의존성 (§10): 내부에서 쓰는 값/함수는 모두 의존성 배열에 포함.
  객체/배열 의존성은 `JSON.stringify` 직렬화 값 사용.

### 리뷰 스킵 파일

- `*.gen.ts`, `pnpm-lock.yaml`

---

## 주의할 점 (배경 지식)

**이 섹션은 프로젝트별 배경 지식입니다. 리뷰 체크리스트가 아닙니다.**
각 항목은 **관련 코드가 PR에 실제로 포함되었을 때만** 참고하세요. PR과 무관한 항목을
끌어와 "확인 ✓" 식으로 나열하지 마세요. **관련 없으면 언급 안 하는 게 정답**입니다.

- **client는 pnpm 모노레포** — 워크스페이스: `app` / `web` / `admin` / `shared` /
  `maeil-mail`. `app`·`web`·`admin`·`maeil-mail` 은 독립 배포 단위, `shared` 는 공유
  패키지. 같은 이름의 훅/컴포넌트가 워크스페이스마다 다른 구현일 수 있으므로, 영향
  범위 지적 시 PR이 변경한 워크스페이스 내부만 카운트하세요.
- **서버 상태는 TanStack Query, 로컬 상태는 UI 전용** — 입력값/토글/모달 같은 UI
  상태만 로컬 state. 서버에서 온 데이터를 로컬 state 로 복제하는 패턴은 검토 대상.
- **스타일은 emotion `styled`** — vanilla-extract(`*.css.ts`) 아님.
