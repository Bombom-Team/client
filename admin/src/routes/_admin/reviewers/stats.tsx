import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';

export const Route = createFileRoute('/_admin/reviewers/stats')({
  component: ReviewerStatsPage,
});

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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="display_name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Bar dataKey="count" fill="#3b82f6" name="리뷰 수" />
      </BarChart>
    </ResponsiveContainer>
  );
}

function OpenAssignmentsList() {
  const { data: assignments } = useSuspenseQuery(
    reviewersQueries.openAssignments(),
  );

  if (!assignments || assignments.length === 0) {
    return <EmptyText>현재 배정된 PR이 없습니다.</EmptyText>;
  }

  return (
    <AssignmentList>
      {assignments.map((a) => (
        <AssignmentItem key={a.id}>
          <a href={a.pr_url} target="_blank" rel="noopener noreferrer">
            #{a.pr_number} {a.pr_title}
          </a>
          <Meta>
            작성자: {a.pr_author} | 배정일:{' '}
            {new Date(a.assigned_at).toLocaleDateString('ko-KR')}
          </Meta>
        </AssignmentItem>
      ))}
    </AssignmentList>
  );
}

function ReviewerStatsPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = [now.getFullYear() - 1, now.getFullYear()];

  return (
    <Container>
      <Header>
        <Link to="/reviewers">← 리뷰어 목록</Link>
        <h1>리뷰어 통계</h1>
      </Header>

      <Section>
        <SectionTitle>월별 리뷰 수</SectionTitle>
        <Controls>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
          <select
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {months.map((m) => (
              <option key={m} value={m}>
                {m}월
              </option>
            ))}
          </select>
        </Controls>
        <Suspense fallback={<div>차트 로딩 중...</div>}>
          <MonthlyBarChart year={year} month={month} />
        </Suspense>
      </Section>

      <Section>
        <SectionTitle>현재 배정된 PR (OPEN)</SectionTitle>
        <Suspense fallback={<div>목록 로딩 중...</div>}>
          <OpenAssignmentsList />
        </Suspense>
      </Section>
    </Container>
  );
}

const Container = styled.div`
  padding: 24px;
`;

const Header = styled.div`
  margin-bottom: 24px;

  a {
    color: #6b7280;
    text-decoration: none;
    font-size: 14px;
    &:hover {
      color: #111;
    }
  }

  h1 {
    font-size: 24px;
    font-weight: 700;
    margin-top: 8px;
  }
`;

const Section = styled.section`
  margin-bottom: 40px;
  background: white;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #e5e7eb;
`;

const SectionTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
`;

const Controls = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;

  select {
    padding: 6px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
  }
`;

const AssignmentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const AssignmentItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;
  &:last-child {
    border-bottom: none;
  }

  a {
    color: #1d4ed8;
    text-decoration: none;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Meta = styled.div`
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
`;

const EmptyText = styled.p`
  color: #9ca3af;
  text-align: center;
  padding: 24px 0;
`;
