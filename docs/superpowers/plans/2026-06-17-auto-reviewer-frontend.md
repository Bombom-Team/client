# 자동 리뷰어 배정 시스템 — 프론트엔드 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** admin 프론트엔드에 리뷰어 관리 페이지(휴가 토글)와 통계 페이지(월/주별 리뷰 수, 현재 배정 PR)를 추가

**Architecture:** Supabase JS Client로 reviewer/review_assignment 테이블에 직접 접근. TanStack Query로 캐시 관리. TanStack Router 파일 기반 라우팅 추가. 기존 admin 프론트엔드 패턴(`@emotion/styled`, `Layout` 컴포넌트, `useSuspenseQuery`) 그대로 따름.

**Tech Stack:** React 19, TanStack Router, TanStack Query, Emotion, @supabase/supabase-js, recharts (신규 추가)

**전제 조건:** 백엔드 플랜(`/Users/wonmac/code/admin/docs/superpowers/plans/2026-06-17-auto-reviewer-backend.md`)의 Task 1 (Supabase 설정)이 완료되어야 함

**Spec:** `/Users/wonmac/code/admin/docs/superpowers/specs/2026-06-17-auto-reviewer-assignment-design.md`

---

## 파일 맵

| 파일 | 역할 |
|---|---|
| `admin/package.json` | 수정: `@supabase/supabase-js`, `recharts` 의존성 추가 |
| `admin/.env.local` | 신규: Supabase 환경변수 (gitignore) |
| `admin/src/lib/supabase.ts` | 신규: Supabase 클라이언트 싱글톤 |
| `admin/src/types/reviewer.ts` | 신규: Reviewer, ReviewAssignment 타입 |
| `admin/src/apis/reviewers/reviewers.api.ts` | 신규: Supabase 직접 호출 함수 |
| `admin/src/apis/reviewers/reviewers.query.ts` | 신규: TanStack Query options |
| `admin/src/components/Sidebar.tsx` | 수정: 리뷰어 관리 네비게이션 항목 추가 |
| `admin/src/pages/reviewers/ReviewersTableBody.tsx` | 신규: 리뷰어 목록 테이블 (휴가 토글 포함) |
| `admin/src/pages/reviewers/ReviewersTableBody.Error.tsx` | 신규: 에러 폴백 |
| `admin/src/pages/reviewers/ReviewersTableBody.Loading.tsx` | 신규: 스켈레톤 로딩 |
| `admin/src/pages/reviewers/hooks/useToggleVacationMutation.ts` | 신규: 휴가 토글 mutation |
| `admin/src/pages/reviewers/stats/ReviewerStatsPage.tsx` | 신규: 통계 페이지 |
| `admin/src/routes/_admin/reviewers.tsx` | 신규: 리뷰어 목록 라우트 |
| `admin/src/routes/_admin/reviewers/` | 신규: 리뷰어 서브 라우트 디렉토리 |
| `admin/src/routes/_admin/reviewers/stats.tsx` | 신규: 통계 라우트 |

---

## Task 1: 의존성 추가 및 Supabase 클라이언트 설정

**Files:**
- Modify: `admin/package.json`
- Create: `admin/.env.local`
- Create: `admin/src/lib/supabase.ts`
- Create: `admin/src/types/reviewer.ts`

- [ ] **Step 1: 의존성 설치**

  작업 디렉토리: `/Users/wonmac/code/client`

  ```bash
  pnpm --filter @bombom/admin add @supabase/supabase-js recharts
  pnpm --filter @bombom/admin add -D @types/recharts
  ```
  Expected: `admin/package.json`에 두 패키지 추가됨

- [ ] **Step 2: .env.local 생성**

  `admin/.env.local` 생성 (이미 `.gitignore`에 포함되어 있는지 확인):

  ```
  VITE_SUPABASE_URL=https://xxxx.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGci...
  ```

  `.gitignore`에 `.env.local` 없으면 추가:
  ```bash
  echo ".env.local" >> admin/.gitignore
  ```

- [ ] **Step 3: Supabase 클라이언트 싱글톤 생성**

  `admin/src/lib/supabase.ts`:

  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```

- [ ] **Step 4: Reviewer 타입 정의**

  `admin/src/types/reviewer.ts`:

  ```typescript
  export type Reviewer = {
    id: number;
    github_username: string;
    display_name: string;
    rotation_order: number;
    is_on_vacation: boolean;
    last_assigned_at: string | null;
    created_at: string;
    updated_at: string;
  };

  export type ReviewAssignment = {
    id: number;
    reviewer_id: number;
    pr_number: number;
    pr_title: string;
    pr_author: string;
    pr_url: string;
    assigned_at: string;
    status: 'OPEN' | 'CLOSED';
  };

  export type ReviewerWithStats = Reviewer & {
    monthlyCount: number;
    weeklyCount: number;
    openAssignments: ReviewAssignment[];
  };
  ```

- [ ] **Step 5: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/package.json admin/src/lib/supabase.ts admin/src/types/reviewer.ts
  git commit -m "feat: Supabase 클라이언트 및 Reviewer 타입 추가"
  ```

---

## Task 2: Supabase API 함수 및 TanStack Query 옵션

**Files:**
- Create: `admin/src/apis/reviewers/reviewers.api.ts`
- Create: `admin/src/apis/reviewers/reviewers.query.ts`

- [ ] **Step 1: reviewers.api.ts 생성**

  `admin/src/apis/reviewers/reviewers.api.ts`:

  ```typescript
  import { supabase } from '@/lib/supabase';
  import type { Reviewer, ReviewAssignment, ReviewerWithStats } from '@/types/reviewer';

  export const getReviewersWithStats = async (): Promise<ReviewerWithStats[]> => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const startOfWeek = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() - now.getDay(),
    ).toISOString();

    const { data: reviewers, error: reviewerError } = await supabase
      .from('reviewer')
      .select('*')
      .order('rotation_order', { ascending: true });

    if (reviewerError) throw reviewerError;
    if (!reviewers) return [];

    const { data: assignments, error: assignmentError } = await supabase
      .from('review_assignment')
      .select('*');

    if (assignmentError) throw assignmentError;
    const allAssignments = assignments ?? [];

    return reviewers.map((reviewer: Reviewer) => {
      const reviewerAssignments = allAssignments.filter(
        (a: ReviewAssignment) => a.reviewer_id === reviewer.id,
      );
      return {
        ...reviewer,
        monthlyCount: reviewerAssignments.filter(
          (a: ReviewAssignment) => a.assigned_at >= startOfMonth,
        ).length,
        weeklyCount: reviewerAssignments.filter(
          (a: ReviewAssignment) => a.assigned_at >= startOfWeek,
        ).length,
        openAssignments: reviewerAssignments.filter(
          (a: ReviewAssignment) => a.status === 'OPEN',
        ),
      };
    });
  };

  export const toggleVacation = async (
    reviewerId: number,
    currentValue: boolean,
  ): Promise<void> => {
    const { error } = await supabase
      .from('reviewer')
      .update({ is_on_vacation: !currentValue, updated_at: new Date().toISOString() })
      .eq('id', reviewerId);

    if (error) throw error;
  };

  export const getMonthlyStats = async (year: number, month: number) => {
    const start = new Date(year, month - 1, 1).toISOString();
    const end = new Date(year, month, 1).toISOString();

    const { data, error } = await supabase
      .from('review_assignment')
      .select('reviewer_id, review:reviewer(display_name)')
      .gte('assigned_at', start)
      .lt('assigned_at', end);

    if (error) throw error;
    return data ?? [];
  };

  export const getOpenAssignments = async (): Promise<ReviewAssignment[]> => {
    const { data, error } = await supabase
      .from('review_assignment')
      .select('*')
      .eq('status', 'OPEN')
      .order('assigned_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  };
  ```

- [ ] **Step 2: reviewers.query.ts 생성**

  `admin/src/apis/reviewers/reviewers.query.ts`:

  ```typescript
  import { queryOptions } from '@tanstack/react-query';
  import {
    getMonthlyStats,
    getOpenAssignments,
    getReviewersWithStats,
  } from './reviewers.api';

  const REVIEWERS_STALE_TIME = 1000 * 30;

  export const reviewersQueries = {
    all: ['reviewers'] as const,

    list: () =>
      queryOptions({
        queryKey: ['reviewers', 'list'] as const,
        queryFn: getReviewersWithStats,
        staleTime: REVIEWERS_STALE_TIME,
      }),

    monthlyStats: (year: number, month: number) =>
      queryOptions({
        queryKey: ['reviewers', 'stats', 'monthly', year, month] as const,
        queryFn: () => getMonthlyStats(year, month),
        staleTime: REVIEWERS_STALE_TIME,
      }),

    openAssignments: () =>
      queryOptions({
        queryKey: ['reviewers', 'assignments', 'open'] as const,
        queryFn: getOpenAssignments,
        staleTime: REVIEWERS_STALE_TIME,
      }),
  };
  ```

- [ ] **Step 3: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/apis/reviewers/
  git commit -m "feat: 리뷰어 Supabase API 및 TanStack Query 옵션 추가"
  ```

---

## Task 3: 사이드바에 리뷰어 관리 메뉴 추가

**Files:**
- Modify: `admin/src/components/Sidebar.tsx`

- [ ] **Step 1: Sidebar에 리뷰어 관리 링크 추가**

  `admin/src/components/Sidebar.tsx`를 열어 `FiUsers` import 바로 뒤에 `FiGitPullRequest` 추가 및 NavItem 삽입:

  ```typescript
  // 기존 import에 추가
  import {
    FiBell,
    FiCalendar,
    FiCode,
    FiEdit,
    FiFlag,
    FiGitPullRequest,  // 추가
    FiHome,
    FiMail,
    FiUsers,
  } from 'react-icons/fi';
  ```

  Nav 안에 멤버 관리 NavItem 바로 아래에 추가:

  ```tsx
  <NavItem
    to="/reviewers"
    $isActive={currentPath.startsWith('/reviewers')}
  >
    <FiGitPullRequest />
    <span>리뷰어 관리</span>
  </NavItem>
  ```

- [ ] **Step 2: 빌드 확인**

  ```bash
  cd /Users/wonmac/code/client
  pnpm admin:type-check
  ```
  Expected: 타입 오류 없음

- [ ] **Step 3: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/components/Sidebar.tsx
  git commit -m "feat: 사이드바에 리뷰어 관리 메뉴 추가"
  ```

---

## Task 4: 휴가 토글 mutation 및 리뷰어 테이블 컴포넌트

**Files:**
- Create: `admin/src/pages/reviewers/hooks/useToggleVacationMutation.ts`
- Create: `admin/src/pages/reviewers/ReviewersTableBody.tsx`

- [ ] **Step 1: useToggleVacationMutation 생성**

  `admin/src/pages/reviewers/hooks/useToggleVacationMutation.ts`:

  ```typescript
  import { useMutation, useQueryClient } from '@tanstack/react-query';
  import { toggleVacation } from '@/apis/reviewers/reviewers.api';

  export const useToggleVacationMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        reviewerId,
        currentValue,
      }: {
        reviewerId: number;
        currentValue: boolean;
      }) => toggleVacation(reviewerId, currentValue),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['reviewers'] });
      },
      onError: () => {
        alert('휴가 상태 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
      },
    });
  };
  ```

- [ ] **Step 2: ReviewersTableBody 생성**

  `admin/src/pages/reviewers/ReviewersTableBody.tsx`:

  ```tsx
  import styled from '@emotion/styled';
  import { useSuspenseQuery } from '@tanstack/react-query';
  import { FiGitPullRequest } from 'react-icons/fi';
  import { useToggleVacationMutation } from './hooks/useToggleVacationMutation';
  import { reviewersQueries } from '@/apis/reviewers/reviewers.query';

  export function ReviewersTableBody() {
    const { data: reviewers } = useSuspenseQuery(reviewersQueries.list());
    const { mutate: toggleVacation, isPending } = useToggleVacationMutation();

    return (
      <Tbody>
        {reviewers.map((reviewer) => (
          <Tr key={reviewer.id}>
            <Td>{reviewer.display_name}</Td>
            <Td>
              <GithubLink
                href={`https://github.com/${reviewer.github_username}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                @{reviewer.github_username}
              </GithubLink>
            </Td>
            <Td>{reviewer.monthlyCount}회</Td>
            <Td>{reviewer.weeklyCount}회</Td>
            <Td>
              {reviewer.openAssignments.length > 0 ? (
                <AssignmentList>
                  {reviewer.openAssignments.map((a) => (
                    <AssignmentLink
                      key={a.id}
                      href={a.pr_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FiGitPullRequest size={12} />
                      #{a.pr_number}
                    </AssignmentLink>
                  ))}
                </AssignmentList>
              ) : (
                <NoAssignment>없음</NoAssignment>
              )}
            </Td>
            <Td>
              <VacationToggle
                $isOnVacation={reviewer.is_on_vacation}
                disabled={isPending}
                onClick={() =>
                  toggleVacation({
                    reviewerId: reviewer.id,
                    currentValue: reviewer.is_on_vacation,
                  })
                }
              >
                {reviewer.is_on_vacation ? '휴가 중' : '활성'}
              </VacationToggle>
            </Td>
          </Tr>
        ))}
      </Tbody>
    );
  }

  ReviewersTableBody.Loading = function Loading() {
    return (
      <Tbody>
        {Array.from({ length: 5 }).map((_, i) => (
          <Tr key={i}>
            {Array.from({ length: 6 }).map((_, j) => (
              <Td key={j}>
                <Skeleton />
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    );
  };

  ReviewersTableBody.Error = function Error() {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={6}>리뷰어 목록을 불러오는 데 실패했습니다.</Td>
        </Tr>
      </Tbody>
    );
  };

  const Tbody = styled.tbody``;

  const Tr = styled.tr`
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray50};
    }
  `;

  const Td = styled.td`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `;

  const GithubLink = styled.a`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  `;

  const AssignmentList = styled.div`
    display: flex;
    gap: ${({ theme }) => theme.spacing.xs};
    flex-wrap: wrap;
  `;

  const AssignmentLink = styled.a`
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 2px ${({ theme }) => theme.spacing.xs};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background-color: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.gray700};
    font-size: ${({ theme }) => theme.fontSize.xs};
    text-decoration: none;
    &:hover { background-color: ${({ theme }) => theme.colors.gray200}; }
  `;

  const NoAssignment = styled.span`
    color: ${({ theme }) => theme.colors.gray400};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `;

  const VacationToggle = styled.button<{ $isOnVacation: boolean }>`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    border: none;
    border-radius: ${({ theme }) => theme.borderRadius.full};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.xs};
    font-weight: ${({ theme }) => theme.fontWeight.medium};
    background-color: ${({ theme, $isOnVacation }) =>
      $isOnVacation ? theme.colors.warning : theme.colors.success};
    color: ${({ theme }) => theme.colors.white};
    &:disabled { opacity: 0.6; cursor: not-allowed; }
    &:hover:not(:disabled) { opacity: 0.85; }
  `;

  const Skeleton = styled.div`
    height: 16px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background-color: ${({ theme }) => theme.colors.gray200};
    animation: pulse 1.5s ease-in-out infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;
  ```

- [ ] **Step 3: 타입 체크**

  ```bash
  cd /Users/wonmac/code/client
  pnpm admin:type-check
  ```
  Expected: 오류 없음

- [ ] **Step 4: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/pages/reviewers/
  git commit -m "feat: 리뷰어 테이블 컴포넌트 및 휴가 토글 추가"
  ```

---

## Task 5: 리뷰어 목록 라우트 페이지

**Files:**
- Create: `admin/src/routes/_admin/reviewers.tsx`

- [ ] **Step 1: reviewers.tsx 라우트 생성**

  `admin/src/routes/_admin/reviewers.tsx`:

  ```tsx
  import styled from '@emotion/styled';
  import { createFileRoute } from '@tanstack/react-router';
  import { Suspense } from 'react';
  import { ErrorBoundary } from 'react-error-boundary';
  import { Layout } from '@/components/Layout';
  import { ReviewersTableBody } from '@/pages/reviewers/ReviewersTableBody';

  export const Route = createFileRoute('/_admin/reviewers')({
    component: ReviewersPage,
  });

  function ReviewersPage() {
    return (
      <Layout title="리뷰어 관리">
        <Container>
          <Header>
            <Title>리뷰어 목록</Title>
          </Header>

          <Table>
            <Thead>
              <Tr>
                <Th>이름</Th>
                <Th>GitHub</Th>
                <Th>이번 달 리뷰</Th>
                <Th>이번 주 리뷰</Th>
                <Th>현재 배정 PR</Th>
                <Th>상태</Th>
              </Tr>
            </Thead>
            <ErrorBoundary fallback={<ReviewersTableBody.Error />}>
              <Suspense fallback={<ReviewersTableBody.Loading />}>
                <ReviewersTableBody />
              </Suspense>
            </ErrorBoundary>
          </Table>
        </Container>
      </Layout>
    );
  }

  const Container = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    background-color: ${({ theme }) => theme.colors.white};
  `;

  const Header = styled.div`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding-bottom: ${({ theme }) => theme.spacing.lg};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
  `;

  const Title = styled.h3`
    color: ${({ theme }) => theme.colors.gray900};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    font-size: ${({ theme }) => theme.fontSize.xl};
  `;

  const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
  `;

  const Thead = styled.thead`
    background-color: ${({ theme }) => theme.colors.gray50};
  `;

  const Th = styled.th`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    color: ${({ theme }) => theme.colors.gray700};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    font-size: ${({ theme }) => theme.fontSize.sm};
    text-align: left;
  `;

  const Tr = styled.tr``;
  ```

- [ ] **Step 2: 개발 서버 실행 후 UI 확인**

  ```bash
  cd /Users/wonmac/code/client
  pnpm admin:start
  ```

  브라우저에서 `http://localhost:5173/reviewers` 접속:
  - 사이드바에 "리뷰어 관리" 메뉴가 보이는지 확인
  - 리뷰어 목록 테이블이 렌더링되는지 확인 (Supabase에 데이터 없으면 빈 테이블)
  - 휴가 토글 버튼 클릭 시 상태 변경 확인

- [ ] **Step 3: 타입 체크**

  ```bash
  pnpm admin:type-check
  ```
  Expected: 오류 없음

- [ ] **Step 4: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/routes/_admin/reviewers.tsx
  git commit -m "feat: 리뷰어 목록 라우트 페이지 추가"
  ```

---

## Task 6: 통계 페이지

**Files:**
- Create: `admin/src/routes/_admin/reviewers/`
- Create: `admin/src/routes/_admin/reviewers/stats.tsx`
- Create: `admin/src/pages/reviewers/stats/ReviewerStatsPage.tsx`

- [ ] **Step 1: 통계 라우트 파일 생성**

  `admin/src/routes/_admin/reviewers/stats.tsx`:

  ```tsx
  import { createFileRoute } from '@tanstack/react-router';
  import { z } from 'zod';
  import { ReviewerStatsPage } from '@/pages/reviewers/stats/ReviewerStatsPage';

  const statsSearchSchema = z.object({
    year: z.number().optional(),
    month: z.number().optional(),
  });

  export const Route = createFileRoute('/_admin/reviewers/stats')({
    validateSearch: (search) => {
      const now = new Date();
      const parsed = statsSearchSchema.safeParse(search);
      return {
        year: parsed.success && parsed.data.year ? parsed.data.year : now.getFullYear(),
        month: parsed.success && parsed.data.month ? parsed.data.month : now.getMonth() + 1,
      };
    },
    component: ReviewerStatsPage,
  });
  ```

  > 참고: `zod`는 `@tanstack/react-router`에서 내부적으로 이미 사용 중이므로 별도 설치 불필요.

- [ ] **Step 2: ReviewerStatsPage 생성**

  `admin/src/pages/reviewers/stats/ReviewerStatsPage.tsx`:

  ```tsx
  import styled from '@emotion/styled';
  import { useSuspenseQuery } from '@tanstack/react-query';
  import { Suspense } from 'react';
  import { ErrorBoundary } from 'react-error-boundary';
  import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
  } from 'recharts';
  import { reviewersQueries } from '@/apis/reviewers/reviewers.query';
  import { Layout } from '@/components/Layout';
  import type { Route } from '@/routes/_admin/reviewers/stats';

  export function ReviewerStatsPage() {
    const { year, month } = Route.useSearch();
    const navigate = Route.useNavigate();
    const now = new Date();

    const handleMonthChange = (delta: number) => {
      const d = new Date(year, month - 1 + delta, 1);
      navigate({
        search: { year: d.getFullYear(), month: d.getMonth() + 1 },
      });
    };

    return (
      <Layout title="리뷰어 통계">
        <Container>
          <MonthNav>
            <NavButton onClick={() => handleMonthChange(-1)}>← 이전 달</NavButton>
            <MonthLabel>
              {year}년 {month}월
            </MonthLabel>
            <NavButton
              onClick={() => handleMonthChange(1)}
              disabled={year === now.getFullYear() && month === now.getMonth() + 1}
            >
              다음 달 →
            </NavButton>
          </MonthNav>

          <Section>
            <SectionTitle>월별 리뷰 현황</SectionTitle>
            <ErrorBoundary fallback={<div>차트 로딩 실패</div>}>
              <Suspense fallback={<ChartSkeleton />}>
                <MonthlyChart year={year} month={month} />
              </Suspense>
            </ErrorBoundary>
          </Section>

          <Section>
            <SectionTitle>현재 배정된 PR 목록</SectionTitle>
            <ErrorBoundary fallback={<div>로딩 실패</div>}>
              <Suspense fallback={<div>로딩 중...</div>}>
                <OpenAssignmentsList />
              </Suspense>
            </ErrorBoundary>
          </Section>
        </Container>
      </Layout>
    );
  }

  function MonthlyChart({ year, month }: { year: number; month: number }) {
    const { data: rawData } = useSuspenseQuery(
      reviewersQueries.monthlyStats(year, month),
    );

    const countByName = rawData.reduce(
      (acc: Record<string, number>, item: any) => {
        const name = item.review?.display_name ?? '알 수 없음';
        acc[name] = (acc[name] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const chartData = Object.entries(countByName).map(([name, count]) => ({
      name,
      count,
    }));

    if (chartData.length === 0) {
      return <Empty>이번 달 리뷰 데이터가 없습니다.</Empty>;
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" tick={{ fontSize: 13 }} />
          <YAxis allowDecimals={false} tick={{ fontSize: 13 }} />
          <Tooltip />
          <Bar dataKey="count" name="리뷰 수" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell key={index} fill="#4F46E5" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  function OpenAssignmentsList() {
    const { data: assignments } = useSuspenseQuery(reviewersQueries.openAssignments());

    if (assignments.length === 0) {
      return <Empty>현재 배정된 PR이 없습니다.</Empty>;
    }

    return (
      <AssignmentTable>
        <thead>
          <AssignmentTr>
            <AssignmentTh>PR 번호</AssignmentTh>
            <AssignmentTh>제목</AssignmentTh>
            <AssignmentTh>작성자</AssignmentTh>
            <AssignmentTh>배정일</AssignmentTh>
          </AssignmentTr>
        </thead>
        <tbody>
          {assignments.map((a) => (
            <AssignmentTr key={a.id}>
              <AssignmentTd>
                <PRLink href={a.pr_url} target="_blank" rel="noopener noreferrer">
                  #{a.pr_number}
                </PRLink>
              </AssignmentTd>
              <AssignmentTd>
                <PRLink href={a.pr_url} target="_blank" rel="noopener noreferrer">
                  {a.pr_title}
                </PRLink>
              </AssignmentTd>
              <AssignmentTd>@{a.pr_author}</AssignmentTd>
              <AssignmentTd>
                {new Date(a.assigned_at).toLocaleDateString('ko-KR')}
              </AssignmentTd>
            </AssignmentTr>
          ))}
        </tbody>
      </AssignmentTable>
    );
  }

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xl};
  `;

  const MonthNav = styled.div`
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
  `;

  const NavButton = styled.button`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.gray300};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background: ${({ theme }) => theme.colors.white};
    cursor: pointer;
    font-size: ${({ theme }) => theme.fontSize.sm};
    &:hover:not(:disabled) {
      background-color: ${({ theme }) => theme.colors.gray50};
    }
    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `;

  const MonthLabel = styled.span`
    font-size: ${({ theme }) => theme.fontSize.lg};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray900};
  `;

  const Section = styled.div`
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    box-shadow: ${({ theme }) => theme.shadows.sm};
    background-color: ${({ theme }) => theme.colors.white};
  `;

  const SectionTitle = styled.h3`
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.gray900};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    font-size: ${({ theme }) => theme.fontSize.lg};
  `;

  const Empty = styled.p`
    padding: ${({ theme }) => theme.spacing.xl};
    text-align: center;
    color: ${({ theme }) => theme.colors.gray400};
    font-size: ${({ theme }) => theme.fontSize.sm};
  `;

  const ChartSkeleton = styled.div`
    height: 300px;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    background-color: ${({ theme }) => theme.colors.gray100};
    animation: pulse 1.5s ease-in-out infinite;
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
  `;

  const AssignmentTable = styled.table`
    width: 100%;
    border-collapse: collapse;
  `;

  const AssignmentTr = styled.tr`
    &:hover { background-color: ${({ theme }) => theme.colors.gray50}; }
  `;

  const AssignmentTh = styled.th`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray200};
    text-align: left;
    font-size: ${({ theme }) => theme.fontSize.sm};
    font-weight: ${({ theme }) => theme.fontWeight.semibold};
    color: ${({ theme }) => theme.colors.gray700};
    background-color: ${({ theme }) => theme.colors.gray50};
  `;

  const AssignmentTd = styled.td`
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    font-size: ${({ theme }) => theme.fontSize.sm};
    color: ${({ theme }) => theme.colors.gray700};
  `;

  const PRLink = styled.a`
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  `;
  ```

- [ ] **Step 3: 통계 링크를 리뷰어 목록 페이지에 추가**

  `admin/src/routes/_admin/reviewers.tsx`의 Header에 통계 버튼 추가:

  ```tsx
  // 상단 import에 추가
  import { Link } from '@tanstack/react-router';

  // Header 내부에 추가
  <Header>
    <Title>리뷰어 목록</Title>
    <StatsLink to="/reviewers/stats">통계 보기 →</StatsLink>
  </Header>
  ```

  하단에 styled component 추가:

  ```tsx
  const StatsLink = styled(Link)`
    padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.md}`};
    border: 1px solid ${({ theme }) => theme.colors.primary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSize.sm};
    text-decoration: none;
    &:hover { background-color: ${({ theme }) => theme.colors.gray50}; }
  `;
  ```

- [ ] **Step 4: 개발 서버에서 통계 페이지 확인**

  ```bash
  pnpm admin:start
  ```

  `http://localhost:5173/reviewers/stats` 접속:
  - 월 네비게이션 동작 확인 (이전 달/다음 달 버튼)
  - 바 차트 렌더링 확인 (데이터 없으면 "데이터 없음" 메시지)
  - 현재 배정 PR 목록 확인

- [ ] **Step 5: 타입 체크 및 린트**

  ```bash
  pnpm admin:type-check && pnpm admin:lint
  ```
  Expected: 오류 없음

- [ ] **Step 6: 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/routes/_admin/reviewers/ \
          admin/src/pages/reviewers/stats/ \
          admin/src/routes/_admin/reviewers.tsx
  git commit -m "feat: 리뷰어 통계 페이지 추가 (월별 차트 + 현재 배정 PR)"
  ```

---

## Task 7: TanStack Router 라우트 트리 재생성

TanStack Router는 파일 기반 라우팅이므로 새 라우트 파일을 추가한 뒤 라우트 트리를 재생성해야 합니다.

- [ ] **Step 1: 라우트 트리 재생성 확인**

  개발 서버가 실행 중이면 자동 재생성됨. 수동으로 트리거:

  ```bash
  cd /Users/wonmac/code/client
  pnpm admin:build
  ```
  Expected: `admin/src/routeTree.gen.ts` 파일에 새 라우트가 포함됨

- [ ] **Step 2: 최종 타입 체크**

  ```bash
  pnpm admin:type-check
  ```
  Expected: 오류 없음

- [ ] **Step 3: 최종 커밋**

  ```bash
  cd /Users/wonmac/code/client
  git add admin/src/routeTree.gen.ts
  git commit -m "chore: TanStack Router 라우트 트리 재생성"
  ```
