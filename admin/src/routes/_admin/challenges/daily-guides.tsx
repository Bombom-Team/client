import styled from '@emotion/styled';
import {
  createFileRoute,
  useNavigate,
  useSearch,
} from '@tanstack/react-router';
import { Suspense, useCallback, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import Pagination from '@/components/Pagination';
import { ChallengesTableBody } from '@/pages/challenges/ChallengesTableBody';
import {
  CHALLENGE_STATUS_LABELS,
  type ChallengeStatus,
} from '@/types/challenge';

const STATUS_OPTIONS = ['BEFORE_START', 'ONGOING', 'COMPLETED'] as const;

export const Route = createFileRoute('/_admin/challenges/daily-guides')({
  component: ChallengeDailyGuidesPage,
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

function ChallengeDailyGuidesPage() {
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
    <Layout title="데일리 가이드 관리">
      <Container>
        <Header>
          <TitleWrapper>
            <Title>데일리 가이드 관리 ({totalChallenges}개)</Title>
            <Description>
              챌린지를 펼치면 일정 조회 API를 호출해 달력을 표시합니다.
            </Description>
          </TitleWrapper>
          <HeaderActions>
            <Filter>
              <FilterLabel htmlFor="challenge-daily-guide-status">
                상태
              </FilterLabel>
              <Select
                id="challenge-daily-guide-status"
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
            <Button
              variant="secondary"
              onClick={() =>
                navigate({
                  to: '/challenges',
                  search: {
                    page: 0,
                    size: 10,
                    status: undefined,
                  },
                })
              }
            >
              챌린지 목록
            </Button>
          </HeaderActions>
        </Header>

        <Table>
          <Thead>
            <Tr>
              <Th>일정</Th>
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
                variant="daily-guide"
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
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
  justify-content: space-between;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const HeaderActions = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
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
  min-height: 42px;
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
