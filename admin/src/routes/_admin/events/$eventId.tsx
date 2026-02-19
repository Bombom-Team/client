import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Suspense, useMemo, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { eventsQueries } from '@/apis/events/events.query';
import { Button } from '@/components/Button';
import { Layout } from '@/components/Layout';
import { EventDetailView } from '@/pages/events/EventDetailView';
import { useCreateEventScheduleMutation } from '@/pages/events/hooks/useCreateEventScheduleMutation';
import { useDeleteEventMutation } from '@/pages/events/hooks/useDeleteEventMutation';
import { useDeleteEventScheduleMutation } from '@/pages/events/hooks/useDeleteEventScheduleMutation';
import { useUpdateEventMutation } from '@/pages/events/hooks/useUpdateEventMutation';
import { useUpdateEventScheduleMutation } from '@/pages/events/hooks/useUpdateEventScheduleMutation';
import { buildNotificationMessage } from '@/pages/events/utils/buildNotificationMessage';
import { formatEventStartTime } from '@/pages/events/utils/formatEventStartTime';
import {
  EVENT_NOTIFICATION_SCHEDULE_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  type EventNotificationSchedule,
  type EventNotificationScheduleType,
  type EventStatus,
} from '@/types/event';

export const Route = createFileRoute('/_admin/events/$eventId')({
  component: EventDetailPage,
});

const EVENT_STATUS_OPTIONS = Object.entries(EVENT_STATUS_LABELS) as Array<
  [EventStatus, string]
>;
const EVENT_SCHEDULE_TYPE_OPTIONS = Object.entries(
  EVENT_NOTIFICATION_SCHEDULE_TYPE_LABELS,
) as Array<[EventNotificationScheduleType, string]>;

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
  const [isCreateScheduleModalOpen, setIsCreateScheduleModalOpen] =
    useState(false);
  const [isEditScheduleModalOpen, setIsEditScheduleModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState('');
  const [startTimeInput, setStartTimeInput] = useState('');
  const [statusInput, setStatusInput] = useState<EventStatus>('SCHEDULED');
  const [scheduleAtInput, setScheduleAtInput] = useState('');
  const [scheduleTypeInput, setScheduleTypeInput] =
    useState<EventNotificationScheduleType>('BEFORE_MINUTES');
  const [minutesBeforeInput, setMinutesBeforeInput] = useState('10');
  const [editingSchedule, setEditingSchedule] =
    useState<EventNotificationSchedule | null>(null);
  const [editScheduleAtInput, setEditScheduleAtInput] = useState('');
  const [editScheduleTypeInput, setEditScheduleTypeInput] =
    useState<EventNotificationScheduleType>('BEFORE_MINUTES');
  const [editMinutesBeforeInput, setEditMinutesBeforeInput] = useState('10');
  const [editingScheduleId, setEditingScheduleId] = useState<number | null>(
    null,
  );
  const [deletingScheduleId, setDeletingScheduleId] = useState<number | null>(
    null,
  );

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
  const { mutate: createSchedule, isPending: isCreatingSchedule } =
    useCreateEventScheduleMutation({
      eventId: id,
      onSuccess: () => setIsCreateScheduleModalOpen(false),
    });
  const { mutate: deleteEvent, isPending: isDeletingEvent } =
    useDeleteEventMutation({
      onSuccess: () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        navigate({ to: '/events', search: { page: 0, size: 10 } } as any);
      },
    });
  const { mutate: deleteSchedule } = useDeleteEventScheduleMutation({
    eventId: id,
    onSettled: () => setDeletingScheduleId(null),
  });
  const { mutate: updateSchedule, isPending: isUpdatingSchedule } =
    useUpdateEventScheduleMutation({
      eventId: id,
      onSuccess: () => {
        setIsEditScheduleModalOpen(false);
        setEditingSchedule(null);
      },
      onSettled: () => setEditingScheduleId(null),
    });

  const formattedStartTimeForInput = useMemo(
    () => convertIsoToDatetimeLocal(event.startTime),
    [event.startTime],
  );
  const schedulePreviewMessage = useMemo(() => {
    const parsedMinutes = Number(minutesBeforeInput);
    const previewSchedule: EventNotificationSchedule = {
      id: 0,
      eventId: id,
      scheduledAt: convertDatetimeLocalToRequestStartTime(
        scheduleAtInput || formattedStartTimeForInput,
      ),
      type: scheduleTypeInput,
      minutesBefore:
        scheduleTypeInput === 'BEFORE_MINUTES' &&
        !Number.isNaN(parsedMinutes) &&
        parsedMinutes >= 0
          ? parsedMinutes
          : null,
      sent: false,
      sentAt: null,
    };

    return buildNotificationMessage({
      schedule: previewSchedule,
      eventStartTime: formatEventStartTime(event.startTime),
    });
  }, [
    event.startTime,
    formattedStartTimeForInput,
    id,
    minutesBeforeInput,
    scheduleAtInput,
    scheduleTypeInput,
  ]);
  const editSchedulePreviewMessage = useMemo(() => {
    const parsedMinutes = Number(editMinutesBeforeInput);
    const previewSchedule: EventNotificationSchedule = {
      id: editingSchedule?.id ?? 0,
      eventId: id,
      scheduledAt: convertDatetimeLocalToRequestStartTime(
        editScheduleAtInput || formattedStartTimeForInput,
      ),
      type: editScheduleTypeInput,
      minutesBefore:
        editScheduleTypeInput === 'BEFORE_MINUTES' &&
        !Number.isNaN(parsedMinutes) &&
        parsedMinutes >= 0
          ? parsedMinutes
          : null,
      sent: false,
      sentAt: null,
    };

    return buildNotificationMessage({
      schedule: previewSchedule,
      eventStartTime: formatEventStartTime(event.startTime),
    });
  }, [
    editMinutesBeforeInput,
    editScheduleAtInput,
    editScheduleTypeInput,
    editingSchedule?.id,
    event.startTime,
    formattedStartTimeForInput,
    id,
  ]);

  const handleOpenEditModal = () => {
    setNameInput(event.name);
    setStartTimeInput(formattedStartTimeForInput);
    setStatusInput(event.status);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenCreateScheduleModal = () => {
    const defaultMinutesBefore = 10;
    setScheduleTypeInput('BEFORE_MINUTES');
    setMinutesBeforeInput(String(defaultMinutesBefore));
    setScheduleAtInput(
      calculateScheduledAtFromMinutes(
        formattedStartTimeForInput,
        defaultMinutesBefore,
      ) ?? formattedStartTimeForInput,
    );
    setIsCreateScheduleModalOpen(true);
  };

  const handleCloseCreateScheduleModal = () => {
    setIsCreateScheduleModalOpen(false);
  };

  const handleOpenEditScheduleModal = (schedule: EventNotificationSchedule) => {
    const normalizedScheduleAt =
      schedule.type === 'BEFORE_MINUTES' && schedule.minutesBefore !== null
        ? (calculateScheduledAtFromMinutes(
            formattedStartTimeForInput,
            schedule.minutesBefore,
          ) ?? convertIsoToDatetimeLocal(schedule.scheduledAt))
        : convertIsoToDatetimeLocal(schedule.scheduledAt);

    setEditingSchedule(schedule);
    setEditScheduleTypeInput(schedule.type);
    setEditScheduleAtInput(
      schedule.type === 'AT_START'
        ? formattedStartTimeForInput
        : normalizedScheduleAt,
    );
    setEditMinutesBeforeInput(
      schedule.minutesBefore !== null ? String(schedule.minutesBefore) : '10',
    );
    setIsEditScheduleModalOpen(true);
  };

  const handleCloseEditScheduleModal = () => {
    setIsEditScheduleModalOpen(false);
    setEditingSchedule(null);
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

  const handleCreateSchedule = () => {
    if (!scheduleAtInput) {
      alert('발송 예정 시각을 입력해주세요.');
      return;
    }

    if (scheduleTypeInput === 'BEFORE_MINUTES') {
      const parsedMinutes = Number(minutesBeforeInput);
      if (Number.isNaN(parsedMinutes) || parsedMinutes < 0) {
        alert('분(전)은 0 이상의 숫자로 입력해주세요.');
        return;
      }

      createSchedule({
        eventId: id,
        payload: {
          scheduledAt: convertDatetimeLocalToRequestStartTime(scheduleAtInput),
          type: scheduleTypeInput,
          minutesBefore: parsedMinutes,
        },
      });
      return;
    }

    createSchedule({
      eventId: id,
      payload: {
        scheduledAt: convertDatetimeLocalToRequestStartTime(
          scheduleTypeInput === 'AT_START'
            ? formattedStartTimeForInput
            : scheduleAtInput,
        ),
        type: scheduleTypeInput,
        minutesBefore: null,
      },
    });
  };

  const handleScheduleTypeChange = (value: EventNotificationScheduleType) => {
    setScheduleTypeInput(value);

    if (value === 'AT_START') {
      setScheduleAtInput(formattedStartTimeForInput);
      return;
    }

    const parsedMinutes = Number(minutesBeforeInput);
    if (!Number.isNaN(parsedMinutes) && parsedMinutes >= 0) {
      const syncedScheduleAt = calculateScheduledAtFromMinutes(
        formattedStartTimeForInput,
        parsedMinutes,
      );
      if (syncedScheduleAt) {
        setScheduleAtInput(syncedScheduleAt);
      }
    }
  };

  const handleEditScheduleTypeChange = (
    value: EventNotificationScheduleType,
  ) => {
    setEditScheduleTypeInput(value);

    if (value === 'AT_START') {
      setEditScheduleAtInput(formattedStartTimeForInput);
      return;
    }

    const parsedMinutes = Number(editMinutesBeforeInput);
    if (!Number.isNaN(parsedMinutes) && parsedMinutes >= 0) {
      const syncedScheduleAt = calculateScheduledAtFromMinutes(
        formattedStartTimeForInput,
        parsedMinutes,
      );
      if (syncedScheduleAt) {
        setEditScheduleAtInput(syncedScheduleAt);
      }
    }
  };

  const handleScheduleAtChange = (value: string) => {
    setScheduleAtInput(value);

    if (scheduleTypeInput !== 'BEFORE_MINUTES') {
      return;
    }

    const syncedMinutes = calculateMinutesBeforeFromScheduleAt(
      formattedStartTimeForInput,
      value,
    );
    if (syncedMinutes !== null) {
      setMinutesBeforeInput(String(syncedMinutes));
    }
  };

  const handleMinutesBeforeChange = (value: string) => {
    setMinutesBeforeInput(value);

    if (scheduleTypeInput !== 'BEFORE_MINUTES') {
      return;
    }

    const parsedMinutes = Number(value);
    if (Number.isNaN(parsedMinutes) || parsedMinutes < 0) {
      return;
    }

    const syncedScheduleAt = calculateScheduledAtFromMinutes(
      formattedStartTimeForInput,
      parsedMinutes,
    );
    if (syncedScheduleAt) {
      setScheduleAtInput(syncedScheduleAt);
    }
  };

  const handleEditScheduleAtChange = (value: string) => {
    setEditScheduleAtInput(value);

    if (editScheduleTypeInput !== 'BEFORE_MINUTES') {
      return;
    }

    const syncedMinutes = calculateMinutesBeforeFromScheduleAt(
      formattedStartTimeForInput,
      value,
    );
    if (syncedMinutes !== null) {
      setEditMinutesBeforeInput(String(syncedMinutes));
    }
  };

  const handleEditMinutesBeforeChange = (value: string) => {
    setEditMinutesBeforeInput(value);

    if (editScheduleTypeInput !== 'BEFORE_MINUTES') {
      return;
    }

    const parsedMinutes = Number(value);
    if (Number.isNaN(parsedMinutes) || parsedMinutes < 0) {
      return;
    }

    const syncedScheduleAt = calculateScheduledAtFromMinutes(
      formattedStartTimeForInput,
      parsedMinutes,
    );
    if (syncedScheduleAt) {
      setEditScheduleAtInput(syncedScheduleAt);
    }
  };

  const handleUpdateSchedule = () => {
    if (!editingSchedule) {
      return;
    }

    if (!editScheduleAtInput) {
      alert('발송 예정 시각을 입력해주세요.');
      return;
    }

    if (editScheduleTypeInput === 'BEFORE_MINUTES') {
      const parsedMinutes = Number(editMinutesBeforeInput);
      if (Number.isNaN(parsedMinutes) || parsedMinutes < 0) {
        alert('분(전)은 0 이상의 숫자로 입력해주세요.');
        return;
      }

      setEditingScheduleId(editingSchedule.id);
      updateSchedule({
        eventId: id,
        scheduleId: editingSchedule.id,
        payload: {
          scheduledAt:
            convertDatetimeLocalToRequestStartTime(editScheduleAtInput),
          type: editScheduleTypeInput,
          minutesBefore: parsedMinutes,
        },
      });
      return;
    }

    setEditingScheduleId(editingSchedule.id);
    updateSchedule({
      eventId: id,
      scheduleId: editingSchedule.id,
      payload: {
        scheduledAt: convertDatetimeLocalToRequestStartTime(
          formattedStartTimeForInput,
        ),
        type: editScheduleTypeInput,
        minutesBefore: null,
      },
    });
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    if (!confirm('정말 이 알림 스케줄을 삭제하시겠습니까?')) {
      return;
    }
    setDeletingScheduleId(scheduleId);
    deleteSchedule({ eventId: id, scheduleId });
  };

  const handleDeleteEvent = () => {
    if (!confirm('정말 이 이벤트를 삭제하시겠습니까?')) {
      return;
    }
    deleteEvent(id);
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
    <EventDetailView
      event={event}
      schedules={schedules}
      editingScheduleId={editingScheduleId}
      deletingScheduleId={deletingScheduleId}
      onEditSchedule={handleOpenEditScheduleModal}
      onDeleteSchedule={handleDeleteSchedule}
    >
      <ButtonGroup>
        <Button variant="secondary" onClick={handleOpenCreateScheduleModal}>
          알림 스케줄 생성
        </Button>
        <Button variant="secondary" onClick={handleOpenEditModal}>
          수정
        </Button>
        <Button
          variant="danger"
          onClick={handleDeleteEvent}
          disabled={isDeletingEvent}
        >
          {isDeletingEvent ? '삭제 중...' : '삭제'}
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

      {isCreateScheduleModalOpen && (
        <ModalOverlay onClick={handleCloseCreateScheduleModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>알림 스케줄 생성</ModalTitle>
            <FormGroup>
              <Label htmlFor="schedule-at">발송 예정 시각</Label>
              <Input
                id="schedule-at"
                type="datetime-local"
                value={scheduleAtInput}
                disabled={scheduleTypeInput === 'AT_START'}
                onChange={(event) => handleScheduleAtChange(event.target.value)}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="schedule-type">스케줄 유형</Label>
              <Select
                id="schedule-type"
                value={scheduleTypeInput}
                onChange={(event) =>
                  handleScheduleTypeChange(
                    event.target.value as EventNotificationScheduleType,
                  )
                }
              >
                {EVENT_SCHEDULE_TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            {scheduleTypeInput === 'BEFORE_MINUTES' && (
              <FormGroup>
                <Label htmlFor="minutes-before">분(전)</Label>
                <Input
                  id="minutes-before"
                  type="number"
                  min="0"
                  value={minutesBeforeInput}
                  onChange={(event) =>
                    handleMinutesBeforeChange(event.target.value)
                  }
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label>메시지 미리보기</Label>
              <PreviewText>{schedulePreviewMessage}</PreviewText>
            </FormGroup>
            <ModalActions>
              <Button
                variant="secondary"
                onClick={handleCloseCreateScheduleModal}
              >
                취소
              </Button>
              <Button
                onClick={handleCreateSchedule}
                disabled={isCreatingSchedule}
              >
                {isCreatingSchedule ? '생성 중...' : '저장'}
              </Button>
            </ModalActions>
          </ModalCard>
        </ModalOverlay>
      )}

      {isEditScheduleModalOpen && editingSchedule && (
        <ModalOverlay onClick={handleCloseEditScheduleModal}>
          <ModalCard onClick={(event) => event.stopPropagation()}>
            <ModalTitle>알림 스케줄 수정</ModalTitle>
            <FormGroup>
              <Label htmlFor="edit-schedule-at">발송 예정 시각</Label>
              <Input
                id="edit-schedule-at"
                type="datetime-local"
                value={editScheduleAtInput}
                disabled={editScheduleTypeInput === 'AT_START'}
                onChange={(event) =>
                  handleEditScheduleAtChange(event.target.value)
                }
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="edit-schedule-type">스케줄 유형</Label>
              <Select
                id="edit-schedule-type"
                value={editScheduleTypeInput}
                onChange={(event) =>
                  handleEditScheduleTypeChange(
                    event.target.value as EventNotificationScheduleType,
                  )
                }
              >
                {EVENT_SCHEDULE_TYPE_OPTIONS.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </FormGroup>
            {editScheduleTypeInput === 'BEFORE_MINUTES' && (
              <FormGroup>
                <Label htmlFor="edit-minutes-before">분(전)</Label>
                <Input
                  id="edit-minutes-before"
                  type="number"
                  min="0"
                  value={editMinutesBeforeInput}
                  onChange={(event) =>
                    handleEditMinutesBeforeChange(event.target.value)
                  }
                />
              </FormGroup>
            )}
            <FormGroup>
              <Label>메시지 미리보기</Label>
              <PreviewText>{editSchedulePreviewMessage}</PreviewText>
            </FormGroup>
            <ModalActions>
              <Button
                variant="secondary"
                onClick={handleCloseEditScheduleModal}
              >
                취소
              </Button>
              <Button
                onClick={handleUpdateSchedule}
                disabled={isUpdatingSchedule}
              >
                {isUpdatingSchedule ? '수정 중...' : '저장'}
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

const calculateScheduledAtFromMinutes = (
  eventStartDatetimeLocal: string,
  minutesBefore: number,
) => {
  const eventStartDate = new Date(eventStartDatetimeLocal);
  if (
    Number.isNaN(eventStartDate.getTime()) ||
    Number.isNaN(minutesBefore) ||
    minutesBefore < 0
  ) {
    return null;
  }

  const scheduledAtDate = new Date(
    eventStartDate.getTime() - minutesBefore * 60 * 1000,
  );
  const year = scheduledAtDate.getFullYear();
  const month = String(scheduledAtDate.getMonth() + 1).padStart(2, '0');
  const day = String(scheduledAtDate.getDate()).padStart(2, '0');
  const hour = String(scheduledAtDate.getHours()).padStart(2, '0');
  const minute = String(scheduledAtDate.getMinutes()).padStart(2, '0');

  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const calculateMinutesBeforeFromScheduleAt = (
  eventStartDatetimeLocal: string,
  scheduleAtDatetimeLocal: string,
) => {
  const eventStartDate = new Date(eventStartDatetimeLocal);
  const scheduleAtDate = new Date(scheduleAtDatetimeLocal);

  if (
    Number.isNaN(eventStartDate.getTime()) ||
    Number.isNaN(scheduleAtDate.getTime())
  ) {
    return null;
  }

  const diffMinutes = Math.round(
    (eventStartDate.getTime() - scheduleAtDate.getTime()) / (60 * 1000),
  );
  if (diffMinutes < 0) {
    return null;
  }

  return diffMinutes;
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

const PreviewText = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  white-space: pre-line;
`;
