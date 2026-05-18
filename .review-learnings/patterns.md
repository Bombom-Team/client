# Review Patterns

팀에서 자주 지적하는 리뷰 패턴입니다. AI 에이전트가 리뷰 시 이 패턴들을 우선적으로
확인합니다.

> 출처: `woowacourse-teams/2025-bom-bom`(봄봄팀 전신 레포)에서 jaeyoung-kwon /
> guesung / JeLee-river 작성 PR 340건의 인라인 리뷰 코멘트 2,127개 + `Bombom-Team/client`
> 닫힌 PR 코멘트를 분석해 추출했습니다.
>
> 여기 있는 항목은 **판단·맥락이 필요한 패턴**입니다(기계적 검출이 가능한 룰은
> `additional-rules.md`). 단정하지 말고 **근거와 함께 질문형으로** 제안하세요 —
> 봄봄팀 리뷰 문화가 "~하는 건 어떨까요?" 형태입니다.

## 형식

```markdown
### [카테고리] 패턴 제목

- **빈도**: high | medium | low
- **심각도**: critical | major | minor
- **출처**: PR #번호 또는 "팀 컨벤션"

패턴 설명.
```

---

### [코드 구조] 컴포넌트·훅의 분리 적정성 (과분리/과소분리 양방향)

- **빈도**: high
- **심각도**: minor
- **출처**: 팀 컨벤션 · 2025-bom-bom PR #146, #40, #207, #19

한 컴포넌트/훅이 책임을 여러 개 가지면(예: API 요청 + UI 로직 + 도메인 계산을 한
훅에서) 관심사 분리를 제안하세요. PC/모바일 로직이 한 컴포넌트에 섞여 가독성이
나쁘면 분리를 제안. **단 양방향입니다** — 의미 없이 잘게 쪼개 응집도가 떨어진
경우도 똑같이 지적 대상. "분리하세요"를 일방적으로 말하지 말고, 재사용성·추상화
수준·응집도 trade-off를 질문으로 제기하세요. 외부 종속(API 등)은 인자로 주입받아
관심사를 분리하는 방향을 권장.

### [네이밍] 변수·함수·훅 이름은 역할(what) 중심, 축약어·낯선 단어 지양

- **빈도**: high
- **심각도**: minor
- **출처**: 팀 컨벤션 · 2025-bom-bom PR #110, #66, #146

이름이 실제 역할과 다르거나 오해를 부르면 지적하세요. 예: `useScrollTrigger`는
"스크롤을 발생시키는 훅"으로 오해 가능 → 임계점 통과를 감지하면 `useScrollThreshold`.
함수명은 how보다 what을 드러내기 (`updateArticleAsRead`). 1~2글자 축약(`h`, `TReq`)
대신 풀어쓰기(`highlight`, `TRequest`). `elapsed` 같은 낯선 단어보다 범용적인 단어.
형제 변수/컴포넌트와의 통일성도 함께 보세요(혼자만 `Left`처럼 역할이 안 드러나는 이름).

### [네이밍] styled component 위계 — Container → Wrapper → Box

- **빈도**: high
- **심각도**: minor
- **출처**: 팀 컨벤션 · 2025-bom-bom PR #31, #17 · client `frontend-coding-standards.md` §6

emotion styled component는 최상위 래퍼 = `Container`, 레이아웃용 중간 래핑 =
`~Wrapper`, 작은 단위 묶음 = `~Box`. 위계에 안 맞거나 역할이 드러나지 않는 이름을
지적. (단순 표면 위반은 `additional-rules.md` 대상이 될 수 있으나, 역할 판단이
필요하므로 기본은 패턴.)

### [네이밍] 이벤트 핸들러 prefix — `on-` / `handle-` / 일반 동사 구분

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #146, #148 · client `frontend-coding-standards.md` §11

`on-`은 "이벤트 발생 시 실행"을 의미하는, 외부에서 주입되는 콜백 prop에만.
`handle-`은 컴포넌트 내부의 실제 이벤트 핸들러에. 이벤트 핸들러가 아닌 일반
파생 함수는 동사형(`makeHighlight`). `onToggleBookmarkClick`처럼 `on`이 붙었지만
실제로는 일반 함수면 지적. `handleMemo`처럼 모호하면 `handleCommentButtonClick`로
구체화 제안. 함수의 실제 역할을 먼저 파악하고 판단하세요.

### [React] `useEffect`는 외부 시스템 동기화에만 — 파생 상태/이벤트 처리에 사용 금지

- **빈도**: high
- **심각도**: major
- **출처**: 2025-bom-bom PR #160, #136

렌더링을 위한 값은 `useEffect` + `setState` 대신 **렌더링 중 파생 계산**으로
(`const activeId = selectedId ?? defaultId`). props 동기화용 effect, 이벤트로
처리할 수 있는 로직을 effect에 넣는 것 모두 지적. 참고:
react.dev `you-might-not-need-an-effect`. (렌더 본문에서의 직접 setState 호출 등
명백한 패턴은 `additional-rules.md`로도 검출.)

### [상태관리·성능] 불필요한 state·메모이제이션 제거, 커스텀 훅 반환 함수는 메모화

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #128, #62, #207

상태로 관리할 필요 없는 값(예: 이미지 로드 에러 — `src` 분기로 충분)을 state로
두면 불필요한 리렌더를 지적. `useState` updater 안의 함수는 첫 렌더에 한 번만
실행되므로 `useCallback` 불필요. **반대로**, 커스텀 훅이 반환하는 함수/값은
`useCallback`/`useMemo`로 감싸기를 권장(React 공식 문서 근거). 컴포넌트 내부에서는
정말 필요할 때만 메모이제이션 — 사용처 의존이므로 맥락을 보세요.

### [코드 구조] 매직값·복잡한 조건식을 의미 있는 상수·변수로 추출

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #160, #201, #163

반복되는 리터럴(임계값, 빈 문자열 등)은 명명된 상수로. 한 번 해석이 필요한
복잡한 조건식/계산식은 의미를 담은 변수로 분리(`const isNewHighlight = ...`).
여러 파일에서 쓰이는 상수는 별도 파일로. "이 표현식이 충분히 복잡한가"를 판단해
과하지 않게 제안하세요.

### [코드 구조] early return(가드절)으로 중첩 줄이기

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #152, #184

`if (!isVisible) return;` 같은 가드절로 들여쓰기와 맥락을 줄일 수 있으면 제안.
중첩 깊이가 충분히 깊을 때만.

### [props 설계] 환경값·상태는 props drilling 대신 내부 취득, 의미 단위 prop

- **빈도**: medium
- **심각도**: minor
- **출처**: client PR #33, #109 · 2025-bom-bom PR #19, #146

`isPC`/`device` 같은 환경 값은 props로 내려주지 말고 컴포넌트 내부에서
`useDevice` 등으로 직접 취득. `title`/`description`/`buttonText`를 각각 나열해
받기보다 `actionType` 같은 의미 단위 prop을 받아 내부에서 분기. 데이터 객체를
통째로 넘길지 flat하게 넘길지, children 조합형으로 갈지도 검토 대상.

### [타입] `any` 대신 `unknown`/제네릭, 넓은 타입은 의도에 맞게 좁히기

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #73, #33, #43

`any` + `eslint-disable` 조합은 `unknown`이나 제네릭으로 대체 제안. `Record<string,
string>`처럼 과하게 넓은 타입은 의도에 맞게 좁히기(`T extends string | number`).
어디까지 좁힐지는 확장성(OCP) trade-off가 있으니 맥락을 보세요.

### [API·TanStack Query] queryKey 컨벤션, query factory 중앙 관리, SSOT

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #155, #112 · client PR #100, #101

queryKey는 API path 기반으로(`['articles', id]`), query factory에서 중앙 관리해
`invalidateQueries`에 활용. 서버 데이터를 로컬 state로 복제하지 말고(SSOT 위반)
mutation 후 `invalidate`로 동기화. 데이터 가공은 별도 훅보다 `select` 함수,
조건부 패칭은 `enabled` 사용을 검토.

### [접근성·시맨틱] 시맨틱 태그·heading 레벨

- **빈도**: medium
- **심각도**: minor
- **출처**: 2025-bom-bom PR #30, #40, #79

역할에 맞는 시맨틱 태그(`section`, `article`), 적절한 heading 레벨(타이틀이면
`h2` 등), 같은 역할의 컨테이너는 페이지 간 태그 통일. (`img` alt 누락, `ul` 직계
비-`li`, `div`+`onClick` 같은 명백한 위반은 `additional-rules.md`로 검출.)

### [데이터 패칭] Suspense/ErrorBoundary 경계를 패칭 컴포넌트 바깥에 배치

- **빈도**: low
- **심각도**: minor
- **출처**: client PR #43, #90

데이터 패칭을 별도 자식 컴포넌트로 분리하고 Suspense/ErrorBoundary 경계를 그
바깥에 두면, 옵셔널 타입·undefined 방어 로직 없이 "데이터가 무조건 있는" 상태를
만들 수 있습니다. 패칭 컴포넌트와 같은 레벨/안쪽에 경계가 있으면 동작하지 않으니
검토.
