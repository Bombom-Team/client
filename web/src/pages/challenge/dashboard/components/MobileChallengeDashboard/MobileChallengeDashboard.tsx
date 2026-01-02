import styled from '@emotion/styled';
import { useChallengeDashboardData } from '@/pages/challenge/dashboard/hooks/useChallengeDashboardData';
import { formatDate } from '@/utils/date';
import type { TeamChallengeProgressResponse } from '@/apis/challenge/challenge.api';

type DailyStatus = 'COMPLETE' | 'SHIELD' | 'NONE';

const getStatusIcon = (status?: DailyStatus) => {
  if (status === 'COMPLETE') {
    return '🌱';
  }

  if (status === 'SHIELD') {
    return '🛡️';
  }

  return '';
};

interface ChallengeDashboardProps {
  nickName?: string;
  data: TeamChallengeProgressResponse;
}

const MobileChallengeDashboard = ({
  nickName,
  data,
}: ChallengeDashboardProps) => {
  const { dateRange, memberRows } = useChallengeDashboardData(data);

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

export default MobileChallengeDashboard;

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
  --date-col-width: 36px;
  --summary-col-width: 36px;
  --rate-col-width: 60px;

  width: 100%;
  min-width: 840px;

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

  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
  text-align: center;
  white-space: nowrap;

  &:first-of-type {
    position: sticky;
    left: 0;
    z-index: 2;
    width: var(--name-col-width);
  }

  &:nth-last-of-type(2) {
    position: sticky;
    right: var(--rate-col-width);
    z-index: 2;
    width: var(--summary-col-width);
  }

  &:last-of-type {
    position: sticky;
    right: 0;
    z-index: 2;
    width: var(--rate-col-width);
    border-right: none;
  }
`;

const BodyRow = styled.tr<{ isMine: boolean }>`
  ${({ isMine, theme }) =>
    isMine &&
    `
    & > td {
      box-shadow: inset 0 2px 0 ${theme.colors.primary},
        inset 0 -2px 0 ${theme.colors.primary};
    }

    & > td:first-of-type {
      box-shadow: inset 2px 0 0 ${theme.colors.primary},
        inset 0 2px 0 ${theme.colors.primary},
        inset 0 -2px 0 ${theme.colors.primary};
    }

    & > td:last-of-type {
      box-shadow: inset -2px 0 0 ${theme.colors.primary},
        inset 0 2px 0 ${theme.colors.primary},
        inset 0 -2px 0 ${theme.colors.primary};
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
  position: sticky;
  left: 0;
  z-index: 1;
  width: var(--name-col-width);
  padding: 6px;

  font: ${({ theme }) => theme.fonts.body2};
`;

const SummaryCell = styled(BodyCell)`
  position: sticky;
  right: var(--rate-col-width);
  z-index: 1;
  width: var(--summary-col-width);

  font: ${({ theme }) => theme.fonts.caption};
`;

const RateCell = styled(BodyCell)`
  position: sticky;
  right: 0;
  z-index: 1;
  width: var(--rate-col-width);

  font: ${({ theme }) => theme.fonts.caption};
`;
