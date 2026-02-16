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
import { EventsTableBody } from '@/pages/events/EventsTableBody';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/types/event';

const STATUS_OPTIONS = [
  'SCHEDULED',
  'IN_PROGRESS',
  'COMPLETED',
  'CANCELLED',
] as const;

export const Route = createFileRoute('/_admin/events/')({
  component: EventsPage,
  validateSearch: (search: Record<string, unknown>) => {
    const rawStatus = typeof search.status === 'string' ? search.status : null;
    const status = STATUS_OPTIONS.includes(rawStatus as EventStatus)
      ? (rawStatus as EventStatus)
      : undefined;
    const keyword =
      typeof search.keyword === 'string' ? search.keyword : undefined;

    return {
      page: Number(search.page ?? 0),
      size: Number(search.size ?? 10),
      keyword: keyword?.trim() ? keyword.trim() : undefined,
      status,
    };
  },
});

function EventsPage() {
  const search = useSearch({ from: Route.id });
  const navigate = useNavigate();
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((value) => ({
        value,
        label: EVENT_STATUS_LABELS[value],
      })),
    [],
  );

  const handleKeywordChange = (keyword: string) => {
    navigate({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      search: { ...search, page: 0, keyword: keyword || undefined } as any,
    });
  };

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
      setTotalEvents(newTotalElements);
      setTotalPages(newTotalPages);
    },
    [],
  );

  return (
    <Layout title="이벤트 관리">
      <Container>
        <Header>
          <Title>이벤트 ({totalEvents}개)</Title>
          <FiltersWrapper>
            <SearchInput
              placeholder="이벤트 이름 검색"
              value={search.keyword ?? ''}
              onChange={(event) => handleKeywordChange(event.target.value)}
            />
            <Select
              value={search.status ?? 'ALL'}
              onChange={(event) => handleStatusChange(event.target.value)}
            >
              <option value="ALL">전체 상태</option>
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </FiltersWrapper>
        </Header>

        <Table>
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>이벤트명</Th>
              <Th>시작 시간</Th>
              <Th>상태</Th>
            </Tr>
          </Thead>
          <ErrorBoundary fallback={<EventsTableBody.Error />}>
            <Suspense fallback={<EventsTableBody.Loading />}>
              <EventsTableBody
                currentPage={search.page}
                pageSize={search.size}
                keyword={search.keyword}
                status={search.status}
                onDataLoaded={handleDataLoaded}
              />
            </Suspense>
          </ErrorBoundary>
        </Table>

        {totalEvents > 0 && totalPages > 0 && (
          <Pagination
            totalCount={totalEvents}
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

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.xl};
`;

const FiltersWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const SearchInput = styled.input`
  min-width: 260px;
  min-height: 42px;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const Select = styled.select`
  min-width: 160px;
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

const Tr = styled.tr`
  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Th = styled.th`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: left;
`;
