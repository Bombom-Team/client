import styled from '@emotion/styled';
import { formatDate } from '@/utils/date';

type DailyStatus = 'COMPLETE' | 'SHIELD';

const getStatusIcon = (status?: DailyStatus) => {
  if (status === 'COMPLETE') {
    return '🌱';
  }

  if (status === 'SHIELD') {
    return '🛡️';
  }

  return '';
};

const isSuccessStatus = (status?: DailyStatus) =>
  status === 'COMPLETE' || status === 'SHIELD';

interface ChallengeDashboardData {
  challenge: {
    startDate: string;
    endDate: string;
    totalDays?: number;
  };
  teamSummary?: {
    achievementAverage: number;
  };
  members: {
    memberId: number;
    nickname: string;
    is_survived: boolean;
    dailyProgress: {
      date: string;
      status: string;
    }[];
  }[];
}

interface ChallengeDashboardProps {
  nickName?: string;
  data: ChallengeDashboardData;
}

const normalizeStatus = (status: string): DailyStatus | undefined =>
  status === 'COMPLETE' || status === 'SHIELD' ? status : undefined;

const ChallengeDashboard = ({ nickName, data }: ChallengeDashboardProps) => {
  const { challenge, members } = data;
  const startDate = new Date(challenge.startDate);
  const endDate = new Date(challenge.endDate);
  const dateRange: Date[] = [];

  for (let current = new Date(startDate); current <= endDate; ) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      dateRange.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }

  const memberRows = members.map((member) => {
    const progressMap = new Map(
      member.dailyProgress.map((progress) => [
        progress.date,
        normalizeStatus(progress.status),
      ]),
    );
    const completedCount = dateRange.filter((date) => {
      const dateKey = formatDate(date, '-');
      const status = progressMap.get(dateKey);
      return isSuccessStatus(status);
    }).length;
    const achievementRate =
      dateRange.length === 0 ? 0 : (completedCount / dateRange.length) * 100;

    return {
      member,
      progressMap,
      completedCount,
      achievementRate,
      isFailed: achievementRate < 80,
    };
  });

  return (
    <Container>
      <TableWrapper>
        <Table>
          <thead>
            <HeaderRow>
              <HeaderCell>참가자</HeaderCell>
              {dateRange.map((date, index) => (
                <HeaderCell
                  key={formatDate(date, '-')}
                  isWeekDivider={(index + 1) % 5 === 0}
                >
                  {formatDate(date).split('.').slice(1).map(Number).join('/')}
                </HeaderCell>
              ))}
              <HeaderCell>합계</HeaderCell>
              <HeaderCell>달성률</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {memberRows.map(
              ({
                member,
                progressMap,
                completedCount,
                isFailed,
                achievementRate,
              }) => {
                const isMine = !!nickName && member.nickname === nickName;

                return (
                  <BodyRow key={member.memberId} isMine={isMine}>
                    <NameCell isFailed={isFailed}>{member.nickname}</NameCell>
                    {dateRange.map((date, index) => {
                      const dateKey = formatDate(date, '-');
                      const status = progressMap.get(dateKey);
                      return (
                        <BodyCell
                          key={`${member.memberId}-${dateKey}`}
                          isFailed={isFailed}
                          isWeekDivider={(index + 1) % 5 === 0}
                        >
                          {getStatusIcon(status)}
                        </BodyCell>
                      );
                    })}
                    <SummaryCell isFailed={isFailed}>
                      {completedCount}
                    </SummaryCell>
                    <RateCell isFailed={isFailed}>
                      {achievementRate.toFixed(1)}%
                    </RateCell>
                  </BodyRow>
                );
              },
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Container>
  );
};

export default ChallengeDashboard;

const Container = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const TableWrapper = styled.div`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 12px;

  background: ${({ theme }) => theme.colors.white};

  overflow-x: auto;
`;

const Table = styled.table`
  --name-col-width: 64px;
  --date-col-width: 28px;
  --summary-col-width: 36px;
  --rate-col-width: 60px;

  width: 100%;
  min-width: 720px;

  table-layout: fixed;
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th<{ isWeekDivider?: boolean }>`
  width: var(--date-col-width);
  padding: 6px 4px;
  border-right: ${({ isWeekDivider, theme }) =>
    isWeekDivider
      ? `2px solid ${theme.colors.disabledText}`
      : `1px solid ${theme.colors.dividers}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
  text-align: center;
  white-space: nowrap;

  &:first-of-type {
    width: var(--name-col-width);
  }

  &:nth-last-of-type(2) {
    width: var(--summary-col-width);
  }

  &:last-of-type {
    width: var(--rate-col-width);
    border-right: none;
  }
`;

const BodyRow = styled.tr<{ isMine: boolean }>`
  ${({ isMine, theme }) =>
    isMine &&
    `
    & > td {
      border-top: 2px solid ${theme.colors.primary};
      border-bottom: 2px solid ${theme.colors.primary};
    }

    & > td:first-of-type {
      border-left: 2px solid ${theme.colors.primary};
    }

    & > td:last-of-type {
      border-right: 2px solid ${theme.colors.primary};
    }
  `}
`;

const BodyCell = styled.td<{
  isFailed: boolean;
  isWeekDivider?: boolean;
}>`
  padding: 4px;
  border-right: ${({ theme, isWeekDivider }) =>
    isWeekDivider
      ? `2px solid ${theme.colors.disabledText}`
      : `1px solid ${theme.colors.dividers}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: ${({ theme, isFailed: isEliminated }) => {
    if (isEliminated) return theme.colors.disabledBackground;
    return theme.colors.white;
  }};
  color: ${({ theme, isFailed: isEliminated }) =>
    isEliminated ? theme.colors.disabledText : theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fonts.body4};
  text-align: center;

  &:last-of-type {
    border-right: none;
  }
`;

const NameCell = styled(BodyCell)`
  width: var(--name-col-width);
  padding: 6px;

  font: ${({ theme }) => theme.fonts.body2};
`;

const SummaryCell = styled(BodyCell)`
  width: var(--summary-col-width);
  font: ${({ theme }) => theme.fonts.caption};
`;

const RateCell = styled(BodyCell)`
  width: var(--rate-col-width);
  font: ${({ theme }) => theme.fonts.caption};
`;
