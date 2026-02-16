import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { eventsQueries } from '@/apis/events/events.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { EventDetailView } from '@/pages/events/EventDetailView';
import { useUpdateEventMutation } from '@/pages/events/hooks/useUpdateEventMutation';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/types/event';

export const Route = createFileRoute('/_admin/events/$eventId')({
  component: EventDetailPage,
});

const EVENT_STATUS_OPTIONS = Object.entries(EVENT_STATUS_LABELS) as Array<
  [EventStatus, string]
>;

function EventDetailPage() {
  return (
    <Layout title="이벤트 상세">
      <ErrorBoundary fallback={<div>에러가 발생했습니다.</div>}>
        <Suspense fallback={<div>로딩 중...</div>}>
          <EventDetailContent />
        </Suspense>
      </ErrorBoundary>
    </Layout>
  );
}

function EventDetailContent() {
  const { eventId } = Route.useParams();
  const navigate = useNavigate();
  const id = Number(eventId);
  const { data: event } = useSuspenseQuery(eventsQueries.detail(id));
  const { data: schedules } = useSuspenseQuery(eventsQueries.schedules(id));
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const [statusInput, setStatusInput] = useState<EventStatus>('SCHEDULED');

  const handleBack = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    navigate({ to: '/events', search: { page: 0, size: 10 } } as any);
  };

  const { mutate: updateEvent, isPending: isUpdating } = useUpdateEventMutation(
    {
      eventId: id,
      onSuccess: () => setIsEditModalOpen(false),
    },
  );

  const formattedStartTimeForInput = useMemo(
    () => convertIsoToDatetimeLocal(event.startTime),
    [event.startTime],
  );

  const handleOpenEditModal = () => {
    setNameInput(event.name);
    setStartTimeInput(formattedStartTimeForInput);
    setStatusInput(event.status);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleUpdateEvent = () => {
    if (!nameInput.trim()) {
      alert('이벤트 이름을 입력해주세요.');
      return;
    }

    if (!startTimeInput) {
      alert('시작 시간을 입력해주세요.');
      return;
    }

    updateEvent({
      eventId: id,
      payload: {
        name: nameInput.trim(),
        startTime: convertDatetimeLocalToRequestStartTime(startTimeInput),
        status: statusInput,
      },
    });
  };

  if (!event) {
    return (
      <Container>
        <div>이벤트를 찾을 수 없습니다.</div>
        <ButtonGroup>
          <Button onClick={handleBack}>목록으로 돌아가기</Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <EventDetailView event={event} schedules={schedules}>
      <ButtonGroup>
        <Button variant="secondary" onClick={handleOpenEditModal}>
          수정
        </Button>
        <Button onClick={handleBack}>목록</Button>
      </ButtonGroup>

      {isEditModalOpen && (
        <ModalOverlay onClick={handleCloseEditModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>이벤트 수정</ModalTitle>
            <FormGroup>
              <Label htmlFor="event-name">이벤트 이름</Label>
              <Input
                id="event-name"
                type="text"
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="event-start-time">시작 시간</Label>
              <Input
                id="event-start-time"
                type="datetime-local"
                value={startTimeInput}
                onChange={(event) => setStartTimeInput(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="event-status">상태</Label>
              <Select
                id="event-status"
                value={statusInput}
                onChange={(event) =>
                  setStatusInput(event.target.value as EventStatus)
                }
              >
                {EVENT_STATUS_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            <ModalActions>
              <Button variant="secondary" onClick={handleCloseEditModal}>
                취소
              </Button>
              <Button onClick={handleUpdateEvent} disabled={isUpdating}>
                {isUpdating ? '수정 중...' : '저장'}
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}
    </EventDetailView>
  );
}

const convertIsoToDatetimeLocal = (value: string) => {
  const matched = value.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
  if (matched?.[1]) {
    return matched[1];
  }

  return '';
};

const convertDatetimeLocalToRequestStartTime = (value: string) => {
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    return `${value}:00`;
  }

  return value;
};

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const ButtonGroup = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
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

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.md};
  padding-right: 44px;
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.white};
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%234B5563' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 12px center;
  background-repeat: no-repeat;
  background-size: 18px 18px;
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.base};

  appearance: none;

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
