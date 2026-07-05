import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { isOverdue } from '@/apis/reviewers/reviewers.api';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';
import { Layout } from '@/components/Layout';
import {
  SummaryStatCard,
  SummaryStatCardRow,
  SummaryStatCardSkeleton,
} from '@/components/reviewers/SummaryStatCard';

export const Route = createFileRoute('/_admin/reviewers/stats')({
  component: ReviewerStatsPage,
});

function StatsSummary() {
  const { data: reviewers } = useSuspenseQuery(reviewersQueries.list());
  const { data: leaderboard } = useSuspenseQuery(
    reviewersQueries.leaderboard(),
  );

  const monthlyTotal = reviewers.reduce((sum, r) => sum + r.monthlyCount, 0);
  const openTotal = reviewers.reduce(
    (sum, r) => sum + r.openAssignments.length,
    0,
  );
  const completedTotal = leaderboard.reduce(
    (sum, e) => sum + e.completedCount,
    0,
  );
  const lateTotal = leaderboard.reduce((sum, e) => sum + e.lateCount, 0);
  const lateRate =
    completedTotal > 0
      ? Math.round((lateTotal / completedTotal) * 1000) / 10
      : 0;

  return (
    <SummaryStatCardRow>
      <SummaryStatCard label="이번 달 총 리뷰" value={`${monthlyTotal}건`} />
      <SummaryStatCard
        label="인당 평균"
        value={`${
          reviewers.length > 0
            ? (monthlyTotal / reviewers.length).toFixed(1)
            : 0
        }건`}
      />
      <SummaryStatCard
        label="지각률"
        value={`${lateRate}%`}
        emphasis={lateRate > 0 ? 'error' : 'default'}
      />
      <SummaryStatCard label="OPEN PR" value={`${openTotal}건`} />
    </SummaryStatCardRow>
  );
}

function StatsSummarySkeleton() {
  return (
    <SummaryStatCardRow>
      {Array.from({ length: 4 }).map((_, i) => (
        <SummaryStatCardSkeleton key={i} />
      ))}
    </SummaryStatCardRow>
  );
}

type MonthlyStatEntry = {
  display_name: string;
  count: number;
};

function MonthlyBarChart({ year, month }: { year: number; month: number }) {
  const { data } = useSuspenseQuery(reviewersQueries.monthlyStats(year, month));

  const chartData: MonthlyStatEntry[] = Object.values(
    (data ?? []).reduce((acc: Record<string, MonthlyStatEntry>, item) => {
      const reviewArr = item.review as { display_name: string }[] | null;
      const name = reviewArr?.[0]?.display_name ?? `#${item.reviewer_id}`;
      if (!acc[name]) acc[name] = { display_name: name, count: 0 };
      acc[name].count += 1;
      return acc;
    }, {}),
  );

  if (chartData.length === 0) {
    return <EmptyText>해당 월의 리뷰 기록이 없습니다.</EmptyText>;
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="#F3F4F6"
          vertical={false}
        />
        <XAxis
          dataKey="display_name"
          tickLine={false}
          axisLine={{ stroke: '#E5E7EB' }}
          tick={{ fontSize: 12, fill: '#6B7280' }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: '#9CA3AF' }}
        />
        <Tooltip cursor={{ fill: 'rgba(79, 70, 229, 0.04)' }} />
        <Bar
          dataKey="count"
          name="리뷰 수"
          fill="#4F46E5"
          barSize={28}
          radius={[4, 4, 0, 0]}
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function Leaderboard() {
  const { data: entries } = useSuspenseQuery(reviewersQueries.leaderboard());

  if (entries.length === 0) {
    return <EmptyText>완료된 리뷰 기록이 없습니다.</EmptyText>;
  }

  return (
    <RankList>
      {entries.map((entry, index) => (
        <RankItem key={entry.reviewerId} $highlighted={index < 3}>
          <RankBadge $first={index === 0}>{index + 1}</RankBadge>
          <RankName>{entry.displayName}</RankName>
          <RankMeta>
            {entry.completedCount}건 · {entry.avgHours}h
            {entry.lateCount > 0 && (
              <LateText> · 지각 {entry.lateCount}</LateText>
            )}
          </RankMeta>
        </RankItem>
      ))}
    </RankList>
  );
}

function OpenAssignmentsList() {
  const { data: assignments } = useSuspenseQuery(
    reviewersQueries.openAssignments(),
  );

  if (assignments.length === 0) {
    return <EmptyText>현재 배정된 PR이 없습니다.</EmptyText>;
  }

  return (
    <PrCardList>
      {assignments.map((a) => {
        const overdue = isOverdue(a);
        return (
          <PrCard key={a.id} $overdue={overdue}>
            <PrTitle href={a.pr_url} target="_blank" rel="noopener noreferrer">
              #{a.pr_number} {a.pr_title}
            </PrTitle>
            <PrMeta>
              작성자 {a.pr_author} · 배정일{' '}
              {new Date(a.assigned_at).toLocaleDateString('ko-KR')}
            </PrMeta>
            <PrDeadline $overdue={overdue}>
              {overdue ? '지각 · ' : ''}마감{' '}
              {new Date(a.deadline_at).toLocaleString('ko-KR', {
                month: 'numeric',
                day: 'numeric',
                hour: 'numeric',
              })}
            </PrDeadline>
          </PrCard>
        );
      })}
    </PrCardList>
  );
}

function ReviewerStatsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  return (
    <Layout
      title="리뷰어 통계"
      rightAction={<BackLink to="/reviewers">← 리뷰어 목록</BackLink>}
    >
      <Stack>
        <ErrorBoundary
          fallback={<EmptyText>요약 정보를 불러오지 못했습니다.</EmptyText>}
        >
          <Suspense fallback={<StatsSummarySkeleton />}>
            <StatsSummary />
          </Suspense>
        </ErrorBoundary>

        <TwoColumn>
          <Panel>
            <PanelHead>
              <PanelTitle>월별 리뷰 수</PanelTitle>
              <SelectRow>
                <CompactSelect
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                >
                  {[now.getFullYear() - 1, now.getFullYear()].map((y) => (
                    <option key={y} value={y}>
                      {y}년
                    </option>
                  ))}
                </CompactSelect>
                <CompactSelect
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {m}월
                    </option>
                  ))}
                </CompactSelect>
              </SelectRow>
            </PanelHead>
            <ErrorBoundary
              fallback={<EmptyText>차트를 불러오지 못했습니다.</EmptyText>}
            >
              <Suspense fallback={<EmptyText>차트 로딩 중...</EmptyText>}>
                <MonthlyBarChart year={year} month={month} />
              </Suspense>
            </ErrorBoundary>
          </Panel>

          <Panel>
            <PanelHead>
              <PanelTitle>리뷰어 랭킹</PanelTitle>
            </PanelHead>
            <ErrorBoundary
              fallback={<EmptyText>랭킹을 불러오지 못했습니다.</EmptyText>}
            >
              <Suspense fallback={<EmptyText>랭킹 로딩 중...</EmptyText>}>
                <Leaderboard />
              </Suspense>
            </ErrorBoundary>
          </Panel>
        </TwoColumn>

        <Panel>
          <PanelHead>
            <PanelTitle>현재 배정된 PR (OPEN)</PanelTitle>
          </PanelHead>
          <ErrorBoundary
            fallback={<EmptyText>목록을 불러오지 못했습니다.</EmptyText>}
          >
            <Suspense fallback={<EmptyText>목록 로딩 중...</EmptyText>}>
              <OpenAssignmentsList />
            </Suspense>
          </ErrorBoundary>
        </Panel>
      </Stack>
    </Layout>
  );
}

const Stack = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;
`;

const Panel = styled.section`
  padding: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  align-items: start;
`;

const PanelHead = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PanelTitle = styled.h2`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.base};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const SelectRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const CompactSelect = styled.select`
  padding: 5px 8px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const RankList = styled.ol`
  margin: 0;
  padding: 0;

  display: flex;
  gap: 6px;
  flex-direction: column;

  list-style: none;
`;

const RankItem = styled.li<{ $highlighted?: boolean }>`
  padding: 10px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: flex;
  gap: 10px;
  align-items: center;

  background: ${({ $highlighted }) =>
    $highlighted ? 'rgba(79, 70, 229, 0.06)' : 'transparent'};
`;

const RankBadge = styled.span<{ $first?: boolean }>`
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background: ${({ theme, $first }) =>
    $first ? theme.colors.primary : theme.colors.gray200};
  color: ${({ theme, $first }) =>
    $first ? theme.colors.white : theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;

const RankName = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
`;

const RankMeta = styled.span`
  margin-left: auto;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-variant-numeric: tabular-nums;
`;

const LateText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
`;

const PrCardList = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const PrCard = styled.div<{ $overdue: boolean }>`
  padding: 12px ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-left: 3px solid
    ${({ theme, $overdue }) =>
      $overdue ? theme.colors.error : theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto auto;
  column-gap: ${({ theme }) => theme.spacing.md};

  background: ${({ theme }) => theme.colors.white};
`;

const PrTitle = styled.a`
  grid-column: 1;

  color: ${({ theme }) => theme.colors.gray900};
  font-size: ${({ theme }) => theme.fontSize.sm};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const PrMeta = styled.span`
  margin-top: 2px;

  grid-column: 1;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;

const PrDeadline = styled.span<{ $overdue: boolean }>`
  grid-row: 1 / 3;
  grid-column: 2;

  align-self: center;

  color: ${({ theme, $overdue }) =>
    $overdue ? theme.colors.error : theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.xs};
  font-weight: ${({ theme, $overdue }) =>
    $overdue ? theme.fontWeight.semibold : theme.fontWeight.normal};
  font-variant-numeric: tabular-nums;
`;

const EmptyText = styled.p`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray400};
  text-align: center;
`;

const BackLink = styled(Link)`
  padding: 6px 14px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-decoration: none;

  &:hover {
    background: ${({ theme }) => theme.colors.gray50};
  }
`;
