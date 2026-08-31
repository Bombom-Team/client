# 회원 대시보드

## 현재 연결 범위

기존 `GET /dashboard/stats`와 생성된 `DashboardStatsResponse`만 사용한다.
신규 API, 생성 타입 수동 수정, 주기적 폴링, 브라우저 저장은 추가하지 않는다.

- 오늘/최근 7일/이번 달 가입을 먼저 배치하고, 하루 평균은 최근 7일 합계 ÷ 7로 계산한다.
- 전체 회원/연 가입/월 탈퇴/오늘 활동/공지 수를 유지한다.
- 조회 중·최초 오류·갱신 오류·오프라인 대기를 구분한다. 누락 값은 0이 아니다.
- 마지막 조회 시각은 QueryClient의 마지막 성공 시각이며 서버 집계 생성 시각이 아니다.
- 오늘 활동은 유효 세션 기준이다. 과거 DAU를 복원하거나 정확한 일별 누적으로 표시하지 않는다.

## BOM-1218 연동 전 미완료 항목

- 일별 가입 데이터 및 7일/30일 차트: 현재 API에 날짜별 데이터가 없으므로 연동 대기 안내만 표시한다. 합계를 분배하거나 샘플 수치를 표시하지 않는다.
- 테스트 계정 제외: 실제 권한 기준을 확정해 백엔드에서 집계한다. 프론트에서 ADMIN/ARCHIVE를 임의로 제외하거나 응답 수를 보정하지 않는다.
- 권한 정보가 없는 탈퇴 집계의 제외 가능 여부도 별도 확인이 필요하다.

이 의존성을 반영하기 전에는 기능 전체 완료가 아닌 Draft PR로 검토한다.
목표·운영 계획·과거 활동 표·추가 DB 테이블은 이번 범위가 아니다.

## 시각 기준

검토한 로컬 SEED 스타일 예시의 중립 배경, 주황 강조, 4개 지표 묶음,
보조 회원 현황 구성을 사용한다. 기존 Sidebar/Header 및 다른 관리 화면은 유지한다.
공식 `@seed-design/css@2.6.1`의 공개 토큰과 대시보드 컨테이너의
`data-seed-color-mode="light-only"`를 사용한다. 기본 CSS의 시스템 색상 모드가
다른 관리 화면의 native 폼 색상을 바꾸지 않도록 HTML 루트에도 `light-only`를 지정한다.
SEED React 컴포넌트 전체 도입은 아니다.
외부 폰트·차트 라이브러리는 추가하지 않는다.

- [SEED Typography](https://seed-design.io/llms/foundations/typography.txt)
- [SEED Spacing](https://seed-design.io/llms/foundations/spacing.txt)
- [SEED Theming](https://seed-design.io/llms/react/getting-started/styling/theming.txt)

## 검증

저장소 루트에서 `pnpm --filter @bombom/admin test:dashboard`를 실행한다.
실제 페이지와 QueryClient를 렌더링하며 API 응답과 인증/메뉴 shell만 테스트 대역으로 둔다.
라이브 API·로그인·브라우저 시각 확인과는 별개의 DOM 회귀 테스트다.
