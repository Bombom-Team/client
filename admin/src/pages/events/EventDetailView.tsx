import styled from '@emotion/styled';
import { buildNotificationMessage } from './utils/buildNotificationMessage';
import { formatEventStartTime } from './utils/formatEventStartTime';
import {
  EVENT_NOTIFICATION_SCHEDULE_TYPE_LABELS,
  EVENT_STATUS_LABELS,
  type Event,
  type EventNotificationSchedule,
} from '@/types/event';

interface EventDetailViewProps {
  event: Event;
  schedules: EventNotificationSchedule[];
  children?: React.ReactNode;
}

export const EventDetailView = ({
  event,
  schedules,
  children,
}: EventDetailViewProps) => {
  return (
    <Container>
      <Header>
        <Title>{event.name}</Title>
        <StatusBadge status={event.status}>
          {EVENT_STATUS_LABELS[event.status]}
        </StatusBadge>
      </Header>

      <InfoGrid>
        <InfoRow>
          <InfoLabel>이벤트 ID</InfoLabel>
          <InfoValue>{event.id}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel>시작 시간</InfoLabel>
          <InfoValue>{formatEventStartTime(event.startTime)}</InfoValue>
        </InfoRow>
      </InfoGrid>

      <SchedulesSection>
        <SectionTitle>알림 스케줄</SectionTitle>
        <SectionDescription>
          이벤트 시작 기준으로 사전 알림(BEFORE_MINUTES) 또는 시작 시점
          알림(AT_START)을 관리합니다.
        </SectionDescription>
        <RulesDetails>
          <RulesSummary>비즈니스 규칙 보기</RulesSummary>
          <RuleList>
            <RuleItem>
              BEFORE_MINUTES는 <strong>minutesBefore</strong> 값이 필수이며,
              이벤트 시작 N분 전에 발송됩니다.
            </RuleItem>
            <RuleItem>
              AT_START는 <strong>minutesBefore</strong>를 사용하지 않으며,
              이벤트 시작 시점에 발송됩니다.
            </RuleItem>
            <RuleItem>
              발송 완료 시 <strong>sent=true</strong>와 <strong>sentAt</strong>
              이 기록되어 중복 발송을 방지합니다.
            </RuleItem>
          </RuleList>
        </RulesDetails>
        <TableWrapper>
          <ScheduleTable>
            <Thead>
              <Tr>
                <Th>스케줄 유형</Th>
                <Th>발송 예정 시각</Th>
                <Th>메시지 템플릿</Th>
                <Th>발송 상태</Th>
                <Th>실제 발송 시각</Th>
                <Th>미리보기</Th>
              </Tr>
            </Thead>
            <Tbody>
              {schedules.length === 0 ? (
                <Tr>
                  <Td colSpan={6}>
                    <EmptyState>등록된 알림 스케줄이 없습니다.</EmptyState>
                  </Td>
                </Tr>
              ) : (
                schedules.map((schedule) => (
                  <Tr key={schedule.id}>
                    <Td>
                      <TypeBadge scheduleType={schedule.type}>
                        {EVENT_NOTIFICATION_SCHEDULE_TYPE_LABELS[
                          schedule.type
                        ] ?? schedule.type}
                      </TypeBadge>
                    </Td>
                    <Td>
                      <TimeText>
                        {formatEventStartTime(schedule.scheduledAt)}
                      </TimeText>
                    </Td>
                    <Td>
                      {schedule.type === 'BEFORE_MINUTES' &&
                      schedule.minutesBefore !== null
                        ? `시작 ${schedule.minutesBefore}분 전 리마인드`
                        : '시작 안내'}
                    </Td>
                    <Td>
                      <SentBadge sent={schedule.sent}>
                        {schedule.sent ? '발송 완료' : '미발송'}
                      </SentBadge>
                    </Td>
                    <Td>
                      {schedule.sentAt ? (
                        <TimeText>
                          {formatEventStartTime(schedule.sentAt)}
                        </TimeText>
                      ) : (
                        '발송 전'
                      )}
                    </Td>
                    <Td>
                      <MessagePreview>
                        {buildNotificationMessage({
                          schedule,
                          eventStartTime: formatEventStartTime(event.startTime),
                        })}
                      </MessagePreview>
                    </Td>
                  </Tr>
                ))
              )}
            </Tbody>
          </ScheduleTable>
        </TableWrapper>
      </SchedulesSection>

      {children}
    </Container>
  );
};

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  background-color: ${({ theme }) => theme.colors.white};
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};

  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Title = styled.h1`
  margin: 0;

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
  font-size: ${({ theme }) => theme.fontSize['2xl']};
`;

const StatusBadge = styled.span<{ status: Event['status'] }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.full};

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
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const InfoGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-direction: column;
`;

const InfoRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;
`;

const InfoLabel = styled.span`
  min-width: 76px;

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const InfoValue = styled.span`
  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.base};
`;

const SchedulesSection = styled.section`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.xl};
  border-top: 1px solid ${({ theme }) => theme.colors.gray200};
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray900};
  font-weight: ${({ theme }) => theme.fontWeight.semibold};
  font-size: ${({ theme }) => theme.fontSize.lg};
`;

const SectionDescription = styled.p`
  margin-bottom: ${({ theme }) => theme.spacing.md};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RuleList = styled.ul`
  margin: ${({ theme }) => theme.spacing.sm} 0
    ${({ theme }) => theme.spacing.md};
  padding-left: ${({ theme }) => theme.spacing.lg};

  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSize.sm};
`;

const RuleItem = styled.li`
  line-height: 1.6;

  & + & {
    margin-top: ${({ theme }) => theme.spacing.xs};
  }
`;

const RulesDetails = styled.details`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.gray200};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
`;

const RulesSummary = styled.summary`
  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  cursor: pointer;
  user-select: none;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
`;

const ScheduleTable = styled.table`
  width: 100%;
  min-width: 920px;

  border-collapse: collapse;
`;

const Thead = styled.thead`
  background-color: ${({ theme }) => theme.colors.gray50};
`;

const Tbody = styled.tbody``;

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

const Td = styled.td`
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray100};

  color: ${({ theme }) => theme.colors.gray700};
  font-size: ${({ theme }) => theme.fontSize.sm};

  word-break: keep-all;
`;

const MessagePreview = styled.pre`
  margin: 0;
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.md};

  background-color: ${({ theme }) => theme.colors.gray50};
  color: ${({ theme }) => theme.colors.gray800};
  font-size: ${({ theme }) => theme.fontSize.sm};
  line-height: 1.6;
  white-space: pre-line;
`;

const TypeBadge = styled.span<{
  scheduleType: EventNotificationSchedule['type'];
}>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  align-items: center;

  background-color: ${({ scheduleType }) =>
    scheduleType === 'BEFORE_MINUTES' ? '#DBEAFE' : '#EDE9FE'};
  color: ${({ scheduleType }) =>
    scheduleType === 'BEFORE_MINUTES' ? '#1D4ED8' : '#6D28D9'};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
  white-space: nowrap;
`;

const SentBadge = styled.span<{ sent: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.borderRadius.full};

  display: inline-flex;
  align-items: center;

  background-color: ${({ sent }) => (sent ? '#DCFCE7' : '#FEE2E2')};
  color: ${({ sent }) => (sent ? '#166534' : '#B91C1C')};
  font-weight: ${({ theme }) => theme.fontWeight.medium};
  font-size: ${({ theme }) => theme.fontSize.xs};
  white-space: nowrap;
`;

const EmptyState = styled.div`
  padding: ${({ theme }) => theme.spacing.lg} 0;

  color: ${({ theme }) => theme.colors.gray500};
  text-align: center;
`;

const TimeText = styled.span`
  white-space: nowrap;
`;
