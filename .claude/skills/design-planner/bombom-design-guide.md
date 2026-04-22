# 봄봄(BomBom) 디자인 가이드 & 토큰

> design-planner 에이전트가 신규 기능을 설계할 때 **반드시 참조하는 단일 소스**.
> 코드베이스 분석(`shared/src/theme.ts`, `web/src/components/*`, `web/src/routes/_bombom/*`, `docs/frontend-coding-standards.md`, `web/CLAUDE.md`) 기반.
> 값이 불확실하거나 가이드에 없는 경우는 에이전트가 `[TODO: 확인 필요]`로 남깁니다.

---

## 1. 브랜드 톤

- 서비스명: **봄봄(BomBom)** — 뉴스레터 독서 습관 플랫폼
- 분위기: 밝고 따뜻함. 강한 원색보다는 주황(#FE5E04) 포인트 + 깔끔한 흑백 타이포 기반
- 핵심 경험: 오늘의 뉴스레터 읽기, 챌린지, 보관함, 개인 기록(펫, 리더보드)
- 디바이스 우선순위: **모바일 우선**, PC는 확장형 레이아웃으로 지원

---

## 2. 색상 토큰 (`shared/src/theme.ts`)

### Primary
| 토큰 | 값 | 용도 |
|---|---|---|
| `primary` | `#FE5E04` | 주요 액션 버튼, 선택/활성 상태, 강조 |
| `primaryDark` | `#E35400` | primary hover |
| `primaryLight` | `#FFD6C2` | 프로그레스바 배경, 약한 강조 |
| `primaryInfo` | `#ffebe0` | 가장 옅은 배경 하이라이트 |

### Text
| 토큰 | 값 | 용도 |
|---|---|---|
| `textPrimary` | `#181818` | 본문 기본 텍스트 |
| `textSecondary` | `#5C5C5C` | 부제/설명 |
| `textTertiary` | `#747474` | placeholder, 보조 |
| `disabledText` | `#8A8A8A` | 비활성 텍스트 |

### Semantic
| 토큰 | 값 | 용도 |
|---|---|---|
| `success` | `#198754` | 성공 피드백 |
| `error` | `#FF4D4F` | 에러/경고 |
| `info` | `#0D6EFD` | 정보성 |

### UI
| 토큰 | 값 | 용도 |
|---|---|---|
| `white` | `#FFFFFF` | 배경 기본 |
| `icons` | `#7C7B7B` | 아이콘 |
| `stroke` | `#D7D7D7` | 보더/구분선 |
| `dividers` | `#EDEDED` | 구획 분할선 |
| `disabledBackground` | `#EFEFEF` | 비활성 배경 |
| `backgroundHover` | `#F9F9F9` | hover 배경 |

**원칙**
- Primary 주황은 **한 화면에 1~2개**로 제한 (CTA/선택 강조)
- 성공/에러는 Toast·폼 에러 메시지에서만. 일반 텍스트 색으로 쓰지 않음
- 배경은 기본 흰색. 회색 배경은 disabled·hover 상태에만

---

## 3. 타이포그래피

- 폰트 패밀리: `NanumGothic`, 시스템 폰트 fallback
- 숫자·영문은 기본 폰트에 포함. 별도 영문 폰트 안 씀

### Heading (weight 700)
| 토큰 | 크기 | line-height | 용도 |
|---|---|---|---|
| `heading1` | 3rem | 3.75rem | 랜딩/히어로 |
| `heading2` | 2.125rem | 3.125rem | 큰 섹션 타이틀 |
| `heading3` | 1.75rem | 2.375rem | 페이지 타이틀 (PC) |
| `heading4` | 1.5rem | 2rem | 섹션 타이틀 (모바일) |
| `heading5` | 1.125rem | 1.75rem | 카드 타이틀 |
| `heading6` | 1rem | 1.5rem | 작은 타이틀 |

### Body (weight 400)
| 토큰 | 크기 | line-height | 용도 |
|---|---|---|---|
| `bodyLarge` | 1.125rem | 1.75rem | 강조 본문 |
| `body1` | 1rem | 1.5rem | 기본 본문 |
| `body2` | 0.875rem | 1.375rem | 폼 입력/보조 본문 |
| `body3` | 0.75rem | 1.25rem | 메타 정보 |
| `body4` | 0.625rem | 1.125rem | 최소 텍스트 |
| `caption` | 0.75rem | 1.125rem | 버튼 라벨, 태그 |

**원칙**
- 페이지 타이틀: PC `heading3`, 모바일 `heading4`
- 카드 타이틀: `heading5`
- 본문: `body1`
- 폼 라벨: `body2`, 입력값: `body1`, 에러: `caption`
- 버튼 라벨: `caption`

---

## 4. 간격(Spacing)

- **4px 그리드 필수**: 사용 가능한 값 `4 / 8 / 12 / 16 / 20 / 24 / 32 / 36 / 40 / 48 / 52`
- 페이지 좌우 패딩: **모바일 12px / PC 24px** (`PageLayout.constants.ts`)
- 컴포넌트 내부 패딩 표준:
  - Button: `8px 16px`
  - InputField: `12px 14px` (높이 48px)
  - Chip: `8px 16px`
  - Tab: `10px 12px`
  - Badge: `4px 8px`
  - Modal 콘텐츠: 모바일 `24px 12px` / PC `36px 52px`

---

## 5. 모양(Radius) / 그림자 / z-index

### Border Radius
| 값 | 어디에 |
|---|---|
| 6px | Select toggle |
| 8px | Pagination 버튼 |
| 12px | InputField, Tab, Modal, Toast |
| 14px | SearchInput |
| 16px | Button, Chip |
| 4px | Checkbox |

### Shadow
- Modal dropdown: `0 4px 12px rgba(0,0,0,0.15)`
- FloatingActionButton: `0 4px 12px rgba(0,0,0,0.15)` → hover `0 6px 16px rgba(0,0,0,0.2)`
- Toast: `0 10px 30px rgba(0,0,0,0.25)`
- Select menu: `0 4px 6px 0 rgba(0,0,0,0.09)`
- SearchInput focus: `0 1px 3px 0 rgba(0,0,0,0.1), 0 1px 2px -1px rgba(0,0,0,0.1)`

### Z-index (`theme.zIndex`)
| 토큰 | 값 | 용도 |
|---|---|---|
| `behind` | -1 | 배경 요소 |
| `base` | 0 | 기본 |
| `content` | 1 | 일반 콘텐츠 |
| `elevated` | 10 | 드롭다운/툴팁 |
| `panel` | 50 | 패널, 사이드바 |
| `header` | 100 | 상단 헤더 |
| `floating` | 800 | 플로팅 메뉴 |
| `overlay` | 1000 | 모달, FAB |
| `toast` | 9000 | 토스트 |

---

## 6. 레이아웃 토큰

- 모바일 헤더 높이: `56px + safe-area-inset-top` (`theme.heights.headerMobile`)
- PC 헤더 높이: `72px` (`theme.heights.headerPC`)
- 하단 네비: `64px + safe-area-inset-bottom` (`theme.heights.bottomNav`)
- 컨텐츠 최대 너비: `1280px` (컨테이너 레벨)
- 본문 컬럼 최대: `840px` (메인), 사이드 `400px (PC) / 360px (Tablet)`

### 디바이스 브레이크포인트 (`useDevice`)
- mobile: ≤ 768px
- tablet: 769 ~ 1024px
- pc: ≥ 1025px

### Safe Area
- `theme.safeArea.top` / `theme.safeArea.bottom` 사용
- webview에서는 0으로 치환됨

---

## 7. 공용 컴포넌트 카탈로그 (`web/src/components/*`)

> **원칙: 신규 기능은 먼저 이 목록에서 조합 가능한지 검토. 없을 때만 새 컴포넌트 제안.**

### 입력
- **Button** — `variant: 'filled' | 'outlined' | 'transparent'`. 고정 패딩 `8px 16px`, radius 16px
- **InputField** — label + suffix + errorString. 높이 48px, radius 12px
- **SearchInput** — 돋보기 아이콘 내장, 높이 32px, radius 14px
- **Checkbox** — 20×20, 체크마크 문자
- **Select** — option[] + placeholder. 드롭다운 메뉴

### 표시
- **Text** — color/font 토큰 prop. `as`로 시맨틱 태그 지정
- **Badge** — `variant: default | outlinePrimary | outlineDefault`
- **Chip** — selected 상태 있음. 선택 시 검정 배경 + 흰 글씨
- **Tab** — selected 시 주황 배경 + 흰 글씨 + 주황 보더
- **ProgressBar** — `variant: rounded | rectangular`, primaryLight 배경 + primary 게이지
- **Pagination** — 기본 페이지네이션
- **Divider** — 1px `dividers` 색
- **Skeleton** — shimmer 로딩

### 레이아웃
- **Flex** — direction/justify/align/gap/wrap/as
- **Spacing** — size(px) 만큼 수직 간격
- **BomBomPageLayout** — 봄봄 모든 페이지의 공통 레이아웃 (헤더·하단 네비·safe area·반응형 패딩)
- **Header (MobileMainHeader / PCHeader)** — 로고 + 알림 + 프로필/로그인

### 피드백 / 오버레이
- **Modal** — `position: center | bottom | fullscreen | dropdown`. 닫기 버튼/배경 어둡힘 제어
- **Toast** — `variant: error | success | info`. 자동 사라짐 + 진행바. position 기본 `bottom-right`
- **FloatingActionButton** — 우측 하단 고정. primary 배경, 56×56 원형

### 봄봄 전용 (페이지 내부)
- **PetCard** — 사용자 반려동물(읽기 습관) 표시
- **ArticleCardList** — 뉴스레터 아티클 목록
- **ReadingStatusCard** — 오늘 읽기 통계
- **RequireLoginCard** — 로그인 필요 안내

---

## 8. 페이지 레이아웃 패턴

### 봄봄 메인 레이아웃 (`_bombom/_main.tsx`)
- 모바일: `MobileMainHeader` (상단 고정) + 본문 + `BottomNav` (하단 고정, 5개 탭: 홈/오늘/북마크/저장소/내정보)
- PC: `PCHeader` + 본문만 (하단 네비 없음)
- 모든 페이지는 `BomBomPageLayout`으로 감쌈

### 투컬럼 패턴 (index, today)
- Mobile: 세로 스택
- Tablet: 세로 스택 (gap 24px)
- PC: 가로 2컬럼 (본문 최대 840px + 사이드 400px, gap 32px)

### 상세 페이지 패턴 (`articles.$articleId.tsx`)
- 상단 헤더(뒤로가기)
- 본문 (리딩 중심, 좌우 여백 충분히)
- 하단 고정 액션 바 또는 인라인 CTA

---

## 9. 인터랙션/상태 규칙

- **Hover**: 배경 `backgroundHover` (#F9F9F9) 또는 색 톤 다운
- **Focus**: 2px primary 보더 + 20% opacity primary shadow
- **Active/선택**: primary 배경 + 흰 텍스트 (Tab, Chip)
- **Disabled**: `disabledBackground` 배경 + `disabledText` 텍스트, 커서 not-allowed, opacity 0.5
- **Transition**: `0.2s ease-in-out` 표준
- **로딩**: 버튼 → 텍스트 자리 스피너 or `Skeleton` 컴포넌트로 영역 치환
- **에러**: 폼 `errorString` + `caption` 크기 에러 텍스트, 보더 `error` 색
- **빈 상태**: 아이콘 + `body2` 안내 문구 + 선택적 CTA 버튼

---

## 10. 접근성 체크리스트

- 버튼/아이콘 버튼: `aria-label` 필수
- 모달: `role="dialog"`, `aria-modal`, 닫기 버튼 제공, ESC 닫기
- 폼: label 연결, 에러 시 `aria-invalid`
- 포커스 트랩: 모달/바텀시트 내부에서만
- 탭 순서: 시각 순서와 DOM 순서 일치

---

## 11. 구현 관례 (`docs/frontend-coding-standards.md`, `web/CLAUDE.md`)

- 스타일링: **Emotion styled-components + 중앙 `theme`**
- 컴포넌트 파일 구조: 컴포넌트 함수 → default export → styled components (아래에 선언)
- Styled 이름: 최상위 `Container`, 중간 `~Wrapper`, 작은 것 `~Box`
- 컴포넌트: PascalCase, props camelCase
- 모든 공용 컴포넌트는 Storybook 스토리 파일 함께
- 서버 상태는 TanStack Query, UI 상태는 로컬
- 반응형은 `useDevice()` 훅 분기

---

## 12. 신규 기능 설계 시 체크리스트 (에이전트 필수 확인)

1. **재사용 가능한가?** — 공용 컴포넌트 목록(섹션 7)에서 조합 가능한 경우 신규 컴포넌트 제안 금지
2. **색 사용** — Primary 주황은 한 화면 1~2개. 그 외는 흑백 + 보조 회색
3. **4px 그리드** — 패딩/마진/gap 모두 4의 배수
4. **모바일 우선** — 모바일 레이아웃 먼저 정의, 이어서 PC 확장 서술
5. **상태 나열** — 기본 / 로딩 / 성공 / 에러 / 빈 상태 / 비활성 / 비로그인 최소 5개 상태 열거
6. **플로우 관점** — 단일 화면이 아니라 진입 → 상호작용 → 피드백 → 이탈까지 서술
7. **기존 패턴 따르기** — 비슷한 기능이 이미 있다면 해당 페이지 경로(`_bombom/_main/...`) 인용하고 그 패턴을 반복
8. **네비게이션** — 하단 네비 5개 탭 안에 들어가는지, 아니면 상세 페이지/모달인지 명시
