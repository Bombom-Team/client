import styled from '@emotion/styled';
import { createFileRoute, Link } from '@tanstack/react-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from '@/components/Layout';
import { reviewersQueries } from '@/apis/reviewers/reviewers.query';
import {
  ReviewersTableBody,
  ReviewersTableBodyLoading,
  ReviewersTableBodyError,
} from '@/components/reviewers/ReviewersTableBody';

export const Route = createFileRoute('/_admin/reviewers')({
  component: ReviewersPage,
});

function ReviewersTable() {
  const { data: reviewers } = useSuspenseQuery(reviewersQueries.list());

  return <ReviewersTableBody reviewers={reviewers} />;
}

function ReviewersPage() {
  return (
    <Layout title="리뷰어 관리">
      <Container>
        <Header>
          <Title>리뷰어 관리</Title>
          <Link to={'/reviewers/stats' as any}>통계 보기 →</Link>
        </Header>
        <Table>
          <Thead>
            <Tr>
              <Th>이름</Th>
              <Th>GitHub</Th>
              <Th>이번 달</Th>
              <Th>이번 주</Th>
              <Th>현재 배정 PR</Th>
              <Th>상태</Th>
              <Th>휴가 설정</Th>
            </Tr>
          </Thead>
          <ErrorBoundary
            fallback={<ReviewersTableBodyError message="리뷰어 목록을 불러오는 중 오류가 발생했습니다." />}
          >
            <Suspense fallback={<ReviewersTableBodyLoading />}>
              <ReviewersTable />
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

  display: flex;
  align-items: center;
  justify-content: space-between;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-size: ${({ theme }) => theme.fontSize.sm};

    &:hover {
      text-decoration: underline;
    }
  }
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
