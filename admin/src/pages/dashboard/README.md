# 회원 대시보드

## 현재 연결 범위

기존 `GET /dashboard/stats`의 확장 응답과 DTO에서 생성된 `DashboardStatsResponse`를 사용한다.
신규 API, 생성 타입 수동 수정, 주기적 폴링, 브라우저 저장은 추가하지 않는다.

- 오늘/최근 7일/이번 달 가입을 먼저 배치하고, 하루 평균은 최근 7일 합계 ÷ 7로 계산한다.
- 전체 회원/연 가입/월 탈퇴/오늘 활동/공지 수를 유지한다.
- 조회 중·최초 오류·갱신 오류·오프라인 대기를 구분한다. 누락 값은 0이 아니다.
- 마지막 조회 시각은 QueryClient의 마지막 성공 시각이며 서버 집계 생성 시각이 아니다.
- 서버 집계 시각은 별도 `aggregatedAt`으로 표시한다. 서버 캐시는 DB·서울 날짜별 최대 5분이다.
- `dailyJoinedTrend` 30개를 받아 7일/30일 가입 추이를 전환한다. 기간 버튼은 추가 요청을 보내지 않는다.
- 날짜가 연속된 30개 수치일 때만 그래프를 표시한다. 누락 응답을 0이나 샘플 데이터로 대체하지 않는다.
- 전체 회원·기간별 가입·일별 가입은 백엔드에서 `member.role_id = 4`만 제외한다.
- 오늘 활동은 유효 세션 기준이다. 과거 DAU를 복원하거나 정확한 일별 누적으로 표시하지 않는다.

## 남은 제한과 배포 순서

- 오늘 활동: 세션 `PRINCIPAL_NAME`이 로그인 경로에 따라 OAuth 이름일 수 있어 회원과 안전하게 연결할 수 없다. 테스트 계정 제외는 인증 서버의 식별 방식 변경 범위 승인 전까지 미완료이며 화면에 테스트 계정 포함으로 표시한다.
- 월 탈퇴: 탈퇴 데이터에 권한이 없어 테스트 계정을 제외하지 않는다. 화면에 포함 기준을 표시한다.
- BOM-1218 백엔드를 먼저 배포해야 가입 추이와 테스트 계정 제외 집계를 사용할 수 있다. 이전 API 응답이면 그래프 연동 대기 안내를 표시한다.

회원·가입 구현과 오늘 활동 집계의 남은 제한을 구분해 검토한다. 기능 전체 완료로 표시하지 않는다.
목표·운영 계획·과거 활동 표·추가 DB 테이블은 이번 범위가 아니다.

## 응답 타입 재생성

배포 전 계약은 admin 백엔드의 실제 응답 DTO에서 생성한다. 전체 API 타입 파일은 수동 수정하지 않는다.

1. 백엔드에서 `./gradlew test --tests '*DashboardSchemaTest' -x installGitHooks -x spotlessApply`를 실행한다.
2. 생성된 `build/openapi/dashboard.json`을 client의 `admin/openapi/dashboard.json`으로 복사한다.
3. client 루트에서 `pnpm --filter @bombom/admin generate-dashboard-types`를 실행한다.

`admin/src/types/dashboard.gen.ts`와 계약 JSON은 생성 결과를 함께 커밋한다.

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
