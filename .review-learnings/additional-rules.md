# Additional Rules

기본 에이전트 프롬프트(`agent-prompts/`)와 `REVIEW.md`에 없지만, 이 프로젝트에서
추가로 확인해야 하는 규칙들입니다. 리뷰 에이전트는 이 파일의 항목을 **반드시 체크**합니다.

> 출처: `woowacourse-teams/2025-bom-bom`(봄봄팀 전신 레포) PR 코멘트 2,127개 +
> `Bombom-Team/client` 닫힌 PR 코멘트 분석. 여기 있는 항목은 **코드/diff만으로
> 기계적으로 검출 가능한 룰**입니다(판단·맥락이 필요한 패턴은 `patterns.md`).
>
> 현재는 Codex 리뷰가 직접 읽는 정적 룰 파일입니다. 반복 accepted된 지적이 있으면
> 사람이 직접 룰로 승격해도 됩니다.

## 형식

```markdown
### [카테고리] 규칙 제목

- **적용 대상**: 파일 패턴 (예: `web/src/pages/**/*.tsx`)
- **심각도**: critical | major | minor
- **추가일**: YYYY-MM-DD

규칙 설명.
```

---

### [데이터 페칭] 서버 데이터는 반드시 `useQuery` 경유 — 직접 fetch 금지

- **적용 대상**: `web/src/**/*.tsx`, `web/src/**/*.ts` (routes·components·hooks)
- **심각도**: major
- **추가일**: 2026-05-16

컴포넌트/라우트에서 서버 데이터를 `fetch`/fetcher 직접 호출로 가져오면 지적하세요.
TanStack Query(`useQuery`/`useSuspenseQuery`)를 경유해야 캐싱·로딩·에러 상태가
일관되게 처리됩니다. 출처: 2025-bom-bom PR #136 ("서버 데이터 이렇게 불러오면
안되요! `useQuery` 훅 이용해서 호출해야합니다" — p1).

### [TanStack Query] `queryFn`이 사용하는 변수는 모두 `queryKey`에 포함

- **적용 대상**: `web/src/apis/**/*.ts`, `web/src/**/use*.ts`
- **심각도**: major
- **추가일**: 2026-05-16

`useQuery`의 `queryFn` 클로저가 참조하는 변수가 `queryKey` 배열에 빠져 있으면
지적(stale 캐시 버그). 단, `new Date()` 같은 매 렌더 바뀌는 불안정 값은 키에
직접 넣지 말고 안정화(날짜 문자열 등)해서 넣어야 합니다. (`@tanstack/eslint-plugin-query`의
`exhaustive-deps` 룰이 설정돼 있으면 린터가 우선 — 그 경우 봇은 보조.)
출처: 2025-bom-bom PR #112, #147.

### [정확성] `||` vs `??` — null/undefined만 fallback할 의도면 `??`

- **적용 대상**: `web/src/**/*.{ts,tsx}`
- **심각도**: major
- **추가일**: 2026-05-16

fallback 로직(`a || b`)에서 `a`가 빈 문자열(`''`)이나 `0`일 때도 fallback이
일어나길 의도한 게 아니라면 nullish 병합(`a ?? b`)이 맞습니다. `||` 사용처를
플래그하고 의도를 질문하세요. 한 파일/도메인 안에서 `??`와 `||`를 혼용하면
일관성도 함께 지적. 출처: 2025-bom-bom PR #16, #43.

### [React] 렌더링용 `useEffect` + `setState` 대신 파생 계산

- **적용 대상**: `web/src/**/*.tsx`, `web/src/**/use*.ts`
- **심각도**: major
- **추가일**: 2026-05-16

`useEffect` 안에서 다른 state/props로부터 계산한 값을 `setState`하는 패턴, 또는
렌더 본문에서 직접 `setState`를 호출하는 패턴을 검출해 지적하세요. 렌더 중 파생
계산 또는 이벤트 핸들러로 옮겨야 합니다. 출처: 2025-bom-bom PR #160, #136.

### [설정] API URL·토큰 하드코딩 금지 — 환경변수 사용

- **적용 대상**: `web/src/**/*.{ts,tsx}`, `*.config.ts`
- **심각도**: major
- **추가일**: 2026-05-16

소스 코드에 API 베이스 URL, 백엔드 서버 주소, 토큰·시크릿 문자열이 리터럴로
박혀 있으면 지적하세요. `env` 객체/`import.meta.env` 등으로 주입해야 합니다
(레포에 푸시되면 노출). `hostname` 분기보다 환경변수 분기. 출처: 2025-bom-bom
PR #134, #105, #43.

### [타입] 백엔드 API 타입은 OpenAPI 생성 타입 사용 — 수동 정의 금지

- **적용 대상**: `web/src/apis/**/*.ts`
- **심각도**: major
- **추가일**: 2026-05-16

요청/응답 등 백엔드 API 타입을 손으로 새로 정의하면 지적하세요. 생성된 OpenAPI
타입(`components['schemas'][...]`, `operations[...]`)을 직접 사용해야 합니다
(client는 `pnpm run web:generate-openapi-types`로 생성). 생성 타입과 중복되는
수동 타입 선언이 후보. 출처: client PR #109, #111.

### [정확성] API 함수 시그니처·엔드포인트 변경 시 msw 핸들러 동기화

- **적용 대상**: `web/src/apis/**/*.ts` ↔ `web/src/mocks/handlers/**`
- **심각도**: major
- **추가일**: 2026-05-16

PR이 API 함수의 엔드포인트 경로·요청/응답 payload 형태를 바꿨다면, 대응하는 msw
mock 핸들러(`mocks/handlers/**`)가 같이 갱신됐는지 확인하세요. 경로 불일치 →
인터셉트 실패, payload 형태 불일치 → 런타임/타입 에러. cross-file 검증이므로
`Grep`/`Read`로 호출 관계를 확인하세요. 출처: client PR #65 (codex bot).

### [스타일] emotion 스타일 내 색상 리터럴 → `theme.colors` 토큰

- **적용 대상**: `web/src/**/*.tsx` (emotion `styled`/`css` 블록)
- **심각도**: minor
- **추가일**: 2026-05-16

styled component / `css` 블록 안에 색상 리터럴(`#xxxxxx`, `rgb(...)`, `white`
같은 CSS named color), 하드코딩 `font-size`/`font-weight`/`line-height`,
`z-index` 숫자가 직접 박혀 있으면 `theme.colors.*` / `theme.fonts.*` /
`theme.zIndex.*` 토큰 사용을 제안하세요. theme는 import가 아니라
`${({ theme }) => theme.colors.textPrimary}` 콜백 형태로 접근. 출처:
2025-bom-bom PR #31, #40, #216 · client PR #4, #62, #70, #109.

### [정리] `console.*` 및 미사용 코드 제거

- **적용 대상**: `web/src/**/*.{ts,tsx}`
- **심각도**: minor
- **추가일**: 2026-05-16

`console.log`/`console.error` 등 디버깅 코드 잔존, 미사용 변수·타입·import,
한 스타일 블록 내 중복 CSS 속성 선언, 도달 불가능한 중복 로직을 지적하세요.
(ESLint `no-console`/`no-unused-vars`가 켜져 있으면 린터 우선 — 봇은 린터가 못
잡는 미사용 **타입**, 중복 CSS 속성을 보강.) 출처: 2025-bom-bom PR #147, #59, #66.

### [접근성] `img` alt, `ul`>`li`, 클릭 요소는 `button`/`a`

- **적용 대상**: `web/src/**/*.tsx`
- **심각도**: minor
- **추가일**: 2026-05-16

`img` 태그 `alt` 누락, `ul`/`ol`의 직계 자식이 `li`가 아닌 경우, `div`/`span`에
`onClick`을 달아 클릭 가능 요소로 쓴 경우(`button`/`a`로, 탭 포커스·스크린 리더)
를 지적하세요. (`eslint-plugin-jsx-a11y`가 설정돼 있으면 린터 우선.) 출처:
2025-bom-bom PR #30, #24, #72.
