import styled from '@emotion/styled';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { formatEventStartTime } from './utils/formatEventStartTime';
import { eventsQueries } from '@/apis/events/events.query';
import { EVENT_STATUS_LABELS, type EventStatus } from '@/types/event';

interface EventsTableBodyProps {
  currentPage: number;
  pageSize: number;
  keyword?: string;
  status?: EventStatus;
  onDataLoaded?: (totalElements: number, totalPages: number) => void;
}

export const EventsTableBody = ({
  currentPage,
  pageSize,
  keyword,
  status,
  onDataLoaded,
}: EventsTableBodyProps) => {
  const navigate = useNavigate();
  const { data } = useSuspenseQuery(
    eventsQueries.list({
      keyword,
      status,
      page: currentPage,
      size: pageSize,
      sort: ['startTime,DESC'],
    }),
  );

  useEffect(() => {
    if (data && onDataLoaded) {
      onDataLoaded(data.totalElements ?? 0, data.totalPages ?? 0);
    }
  }, [data, onDataLoaded]);

  if (data?.content.length === 0) {
    return (
      <Tbody>
        <Tr>
          <Td colSpan={4}>
            <EmptyState>조건에 해당하는 이벤트가 없습니다.</EmptyState>
          </Td>
        </Tr>
      </Tbody>
    );
  }

  return (
    <Tbody>
      {data.content.map((eventItem) => (
        <Tr
          key={eventItem.id}
          onClick={() =>
            navigate({
              to: '/events/$eventId',
              params: { eventId: eventItem.id.toString() },
            })
          }
        >
          <Td>{eventItem.id}</Td>
          <Td>{eventItem.name}</Td>
          <Td>{formatEventStartTime(eventItem.startTime)}</Td>
          <Td>
            <StatusBadge status={eventItem.status}>
              {EVENT_STATUS_LABELS[eventItem.status]}
            </StatusBadge>
          </Td>
        </Tr>
      ))}
    </Tbody>
  );
};

EventsTableBody.Loading = function EventsTableBodyLoading() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={4}>
          <EmptyState>이벤트 목록을 불러오는 중...</EmptyState>
        </Td>
      </Tr>
    </Tbody>
  );
};

EventsTableBody.Error = function EventsTableBodyError() {
  return (
    <Tbody>
      <Tr>
        <Td colSpan={4}>
          <ErrorMessage>이벤트 목록을 불러오는데 실패했습니다.</ErrorMessage>
        </Td>
      </Tr>
    </Tbody>
  );
};

const Tbody = styled.tbody``;

const Tr = styled.tr`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray50};
  }
`;

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const ErrorMessage = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.fontSize.sm};
  text-align: center;
`;

const StatusBadge = styled.span<{ status: EventStatus }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  align-items: center;

  background-color: ${({ status }) => {
    if (status === 'IN_PROGRESS') return '#DBEAFE';
    if (status === 'COMPLETED') return '#DCFCE7';
    if (status === 'CANCELLED') return '#FEE2E2';
    return '#E5E7EB';
  }};
  color: ${({ status, theme }) => {
    if (status === 'IN_PROGRESS') return '#1D4ED8';
    if (status === 'COMPLETED') return '#166534';
    if (status === 'CANCELLED') return '#B91C1C';
    return theme.colors.gray700;
  }};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
`;
