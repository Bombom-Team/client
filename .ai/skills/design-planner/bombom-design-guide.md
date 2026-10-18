# 봄봄(BomBom) 디자인 가이드

> design-planner 에이전트가 신규 기능을 설계할 때 **반드시 참조하는 디자인 원칙**입니다.
> 토큰 값, 컴포넌트 props, 페이지 구조처럼 코드에 원본이 있는 정보는 이 문서에 옮겨 적지 않습니다.
> 아래 "원본" 경로를 직접 읽습니다. 원본에서 확인할 수 없는 값은 `[TODO: 확인 필요]`로 남깁니다.

---

## 1. 브랜드 톤

- 서비스명: **봄봄(BomBom)** — 뉴스레터 독서 습관 플랫폼
- 분위기: 밝고 따뜻함. 강한 원색보다는 브랜드 primary(주황) 포인트 + 깔끔한 흑백 타이포 기반
- 핵심 경험: 오늘의 뉴스레터 읽기, 챌린지, 보관함, 개인 기록(펫, 리더보드)
- 디바이스 우선순위: **모바일 우선**, PC는 확장형 레이아웃으로 지원

---

## 2. 원본 위치

| 정보 | 원본 |
| --- | --- |
| 색상·글꼴·높이·safe area·z-index 토큰 | `shared/src/core/theme.ts` (매일메일은 `maeil-mail/src/styles/theme.ts`) |
| 디바이스 breakpoint | `shared/src/ui-web/hooks/deviceBreakpoints.ts` (`useDevice`) |
| 페이지 좌우 패딩 | `web/src/components/PageLayout/PageLayout.constants.ts` |
| 공용 컴포넌트와 props·variant·radius·shadow | `web/src/components/*`, `shared/src/ui-web/*`의 각 컴포넌트 구현 |
| 메인 레이아웃(헤더·하단 네비) | `web/src/routes/_bombom/_main.tsx`, `web/src/routes/_bombom.tsx` |
| 투컬럼 페이지 | `web/src/routes/_bombom/_main/index.tsx`, `today.tsx` |
| 상세 페이지 | `web/src/routes/_bombom/articles.$articleId.tsx` |
| 구현 규칙 | `.ai/CONVENTIONS.md` |

---

## 3. 색상 원칙

- 브랜드 primary 색(theme의 `primary*` 토큰 중 해당 서비스 색)은 **한 화면에 1~2개**로 제한합니다 (CTA/선택 강조).
- 성공·에러 색은 Toast·폼 에러 메시지에서만 씁니다. 일반 텍스트 색으로 쓰지 않습니다.
- 배경은 기본 흰색입니다. 회색 배경은 disabled·hover 상태에만 씁니다.

## 4. 타이포그래피 원칙

- 글꼴은 theme의 `fonts` 토큰만 사용합니다.
- 페이지 타이틀·카드 타이틀·본문·폼 라벨처럼 같은 역할의 텍스트는 같은 유형의 기존 화면이 쓰는
  토큰을 따릅니다. 기존 화면을 인용해 근거를 남깁니다.

## 5. 간격·모양 원칙

- 간격은 4px 그리드를 따릅니다 (`.ai/CONVENTIONS.md`의 Theme 사용 규칙).
- radius·shadow는 같은 종류의 기존 컴포넌트 값을 따릅니다. 새 값을 정의하지 않습니다.

---

## 6. 공용 컴포넌트 우선

- 신규 기능은 먼저 `web/src/components/*`의 기존 컴포넌트로 조합할 수 있는지 검토합니다.
  없을 때만 새 컴포넌트를 제안합니다.
- 컴포넌트를 제안할 때는 실제 파일을 읽고 존재하는 props·variant만 사용합니다.

---

## 7. 인터랙션/상태 규칙

- **Hover**: `backgroundHover` 배경 또는 색 톤 다운
- **Focus**: 브랜드 primary 보더 + 옅은 primary shadow
- **Active/선택**: 브랜드 primary 배경 + 흰 텍스트 (Tab, Chip)
- **Disabled**: `disabledBackground` 배경 + `disabledText` 텍스트, 커서 not-allowed
- **로딩**: 버튼 → 텍스트 자리 스피너 or `Skeleton` 컴포넌트로 영역 치환
- **에러**: 폼 에러 문구 + `error` 색 보더
- **빈 상태**: 아이콘 + 안내 문구 + 선택적 CTA 버튼

---

## 8. 접근성 체크리스트

- 버튼/아이콘 버튼: `aria-label` 필수
- 모달: `role="dialog"`, `aria-modal`, 닫기 버튼 제공, ESC 닫기
- 폼: label 연결, 에러 시 `aria-invalid`
- 포커스 트랩: 모달/바텀시트 내부에서만
- 탭 순서: 시각 순서와 DOM 순서 일치

---

## 9. 신규 기능 설계 시 체크리스트 (에이전트 필수 확인)

1. **재사용 가능한가?** — 공용 컴포넌트(섹션 6)로 조합 가능한 경우 신규 컴포넌트 제안 금지
2. **색 사용** — 브랜드 primary는 한 화면 1~2개. 그 외는 흑백 + 보조 회색
3. **4px 그리드** — 패딩/마진/gap 모두 4의 배수
4. **모바일 우선** — 모바일 레이아웃 먼저 정의, 이어서 PC 확장 서술
5. **상태 나열** — 기본 / 로딩 / 성공 / 에러 / 빈 상태 / 비활성 / 비로그인 최소 5개 상태 열거
6. **플로우 관점** — 단일 화면이 아니라 진입 → 상호작용 → 피드백 → 이탈까지 서술
7. **기존 패턴 따르기** — 비슷한 기능이 이미 있다면 해당 route 경로(`web/src/routes/_bombom/...`)를 인용하고 그 패턴을 반복
8. **네비게이션** — 하단 네비 탭 안에 들어가는지, 아니면 상세 페이지/모달인지 명시. 현재 탭 구성은 메인 레이아웃 원본에서 확인
