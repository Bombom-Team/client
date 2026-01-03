import styled from '@emotion/styled';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { ChallengesTableBody } from '@/pages/challenges/ChallengesTableBody';
import type { ChallengeStatus } from '@/types/challenge';
import { CHALLENGE_STATUS_LABELS } from '@/types/challenge';

const STATUS_OPTIONS = ['BEFORE_START', 'ONGOING', 'COMPLETED'] as const;

export const Route = createFileRoute('/_admin/challenges/')({
  component: ChallengesPage,
  validateSearch: (search: Record<string, unknown>) => {
    const rawStatus = typeof search.status === 'string' ? search.status : null;
    const status = STATUS_OPTIONS.includes(rawStatus as ChallengeStatus)
      ? (rawStatus as ChallengeStatus)
      : undefined;

    return {
      page: Number(search.page ?? 0),
      size: Number(search.size ?? 10),
      status,
    };
  },
});

function ChallengesPage() {
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();
  const [totalChallenges, setTotalChallenges] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((value) => ({
        value,
        label: CHALLENGE_STATUS_LABELS[value],
      })),
    [],
  );

  const handleStatusChange = (statusValue: string) => {
    const nextStatus = statusValue === 'ALL' ? undefined : statusValue;
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...search, page: 0, status: nextStatus } as any,
    });
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page === search.page || page >= totalPages) {
      return;
    }

    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...search, page } as any,
    });
  };

  const handleDataLoaded = useCallback(
    (newTotalElements: number, newTotalPages: number) => {
      setTotalChallenges(newTotalElements);
      setTotalPages(newTotalPages);
    },
    [],
  );

  return (
    <Layout title="챌린지">
      <Container>
        <Header>
          <Title>챌린지 ({totalChallenges}개)</Title>
          <Filter>
            <FilterLabel htmlFor="challenge-status">상태</FilterLabel>
            <Select
              id="challenge-status"
              value={search.status ?? 'ALL'}
              onChange={(event) => handleStatusChange(event.target.value)}
            >
              <option value="ALL">전체</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Filter>
        </Header>

        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>챌린지명</Th>
              <Th>기수</Th>
              <Th>시작일</Th>
              <Th>종료일</Th>
            </Tr>
          </Thead>
          <ErrorBoundary fallback={<ChallengesTableBody.Error />}>
            <Suspense fallback={<ChallengesTableBody.Loading />}>
              <ChallengesTableBody
                currentPage={search.page}
                pageSize={search.size}
                status={search.status}
                onDataLoaded={handleDataLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {totalChallenges > 0 && totalPages > 0 && (
          <Pagination
            totalCount={totalChallenges}
            totalPages={totalPages}
            currentPage={search.page}
            onPageChange={handlePageChange}
            countUnitLabel="개"
          />
        )}
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
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Filter = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const FilterLabel = styled.label`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Select = styled.select`
  min-width: 140px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
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

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;
