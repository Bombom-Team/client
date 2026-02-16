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
import { EventsTableBody } from '@/pages/events/EventsTableBody';
import { useCreateEventMutation } from '@/pages/events/hooks/useCreateEventMutation';
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const [statusInput, setStatusInput] = useState<EventStatus>('SCHEDULED');

  const statusOptions = useMemo(
    () =>
      STATUS_OPTIONS.map((value) => ({
        value,
        label: EVENT_STATUS_LABELS[value],
      })),
    [],
  );

  const { mutate: createEvent, isPending: isCreating } = useCreateEventMutation(
    {
      onSuccess: () => {
        setIsCreateModalOpen(false);
        setNameInput('');
        setStartTimeInput('');
        setStatusInput('SCHEDULED');
      },
    },
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

  const handleOpenCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCloseCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleCreateEvent = () => {
    if (!nameInput.trim()) {
      alert('이벤트 이름을 입력해주세요.');
      return;
    }

    if (!startTimeInput) {
      alert('시작 시간을 입력해주세요.');
      return;
    }

    createEvent({
      name: nameInput.trim(),
      startTime: convertDatetimeLocalToRequestStartTime(startTimeInput),
      status: statusInput,
    });
  };

  return (
    <Layout title="이벤트 관리">
      <Container>
        <Header>
          <Title>이벤트 ({totalEvents}개)</Title>
          <FiltersWrapper>
            <Button type="button" onClick={handleOpenCreateModal}>
              이벤트 생성
            </Button>
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

      {isCreateModalOpen && (
        <ModalOverlay onClick={handleCloseCreateModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>이벤트 생성</ModalTitle>
            <FormGroup>
              <Label htmlFor="event-create-name">이벤트 이름</Label>
              <Input
                id="event-create-name"
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="event-create-start-time">시작 시간</Label>
              <Input
                id="event-create-start-time"
                type="datetime-local"
                value={startTimeInput}
                onChange={(event) => setStartTimeInput(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="event-create-status">상태</Label>
              <Select
                id="event-create-status"
                value={statusInput}
                onChange={(event) =>
                  setStatusInput(event.target.value as EventStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <ModalActions>
              <Button variant="secondary" onClick={handleCloseCreateModal}>
                취소
              </Button>
              <Button onClick={handleCreateEvent} disabled={isCreating}>
                {isCreating ? '생성 중...' : '저장'}
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </Layout>
  );
}

const convertDatetimeLocalToRequestStartTime = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }

  return value;
};

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

const ModalOverlay = styled.div`
  position: fixed;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgb(15 23 42 / 45%);

  inset: 0;
`;

const ModalCard = styled.div`
  width: min(520px, 100%);
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const ModalTitle = styled.h4`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const FormGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-direction: column;
`;

const Label = styled.label`
  color: ${({ theme }) => theme.colors.gray700};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  font-size: ${({ theme }) => theme.fontSize.base};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ModalActions = styled.div`
  margin-top: ${({ theme }) => theme.spacing.sm};

  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  justify-content: flex-end;
`;
