import styled from '@emotion/styled';
import { useDevice } from '@/hooks/useDevice';
import { useChallengeDashboardData } from '@/pages/challenge/dashboard/hooks/useChallengeDashboardData';
import { formatDate } from '@/utils/date';
import type { TeamChallengeProgressResponse } from '@/apis/challenge/challenge.api';
import ShieldSvg from '#/assets/svg/shield.svg';
import SproutSvg from '#/assets/svg/sprout.svg';

type DailyStatus = 'COMPLETE' | 'SHIELD' | 'NONE';

const getStatusIcon = (status?: DailyStatus) => {
  if (status === 'COMPLETE') {
    return <StatusIcon as={SproutSvg} aria-hidden />;
  }

  if (status === 'SHIELD') {
    return <StatusIcon as={ShieldSvg} aria-hidden />;
  }

  return null;
};

interface ChallengeDashboardProps {
  nickName?: string;
  data: TeamChallengeProgressResponse;
}

const ChallengeDashboard = ({ nickName, data }: ChallengeDashboardProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const { dateRange, memberRows } = useChallengeDashboardData(data);

  return (
    <Container>
      <TableWrapper isMobile={isMobile}>
        <Table isMobile={isMobile}>
          <thead>
            <HeaderRow>
              <HeaderCell isMobile={isMobile}>참가자</HeaderCell>
              {dateRange.map((date, index) => (
                <HeaderCell
                  key={formatDate(date, '-')}
                  isWeekDivider={(index + 1) % 5 === 0}
                  isMobile={isMobile}
                >
                  {formatDate(date).split('.').slice(1).map(Number).join('/')}
                </HeaderCell>
              ))}
              <HeaderCell isMobile={isMobile}>합계</HeaderCell>
              <HeaderCell isMobile={isMobile}>달성률</HeaderCell>
            </HeaderRow>
          </thead>
          <tbody>
            {memberRows.map(
              ({
                member,
                progressMap,
                completedCount,
                isSurvived,
                achievementRate,
              }) => {
                const isMine = !!nickName && member.nickname === nickName;

                return (
                  <BodyRow
                    key={member.memberId}
                    isMine={isMine}
                    isMobile={isMobile}
                  >
                    <NameCell isSurvived={isSurvived} isMobile={isMobile}>
                      {member.nickname}
                    </NameCell>
                    {dateRange.map((date, index) => {
                      const dateKey = formatDate(date, '-');
                      const status = progressMap.get(dateKey);
                      return (
                        <BodyCell
                          key={`${member.memberId}-${dateKey}`}
                          isSurvived={isSurvived}
                          isWeekDivider={(index + 1) % 5 === 0}
                        >
                          {getStatusIcon(status)}
                        </BodyCell>
                      );
                    })}
                    <SummaryCell isSurvived={isSurvived} isMobile={isMobile}>
                      {completedCount}
                    </SummaryCell>
                    <RateCell isSurvived={isSurvived} isMobile={isMobile}>
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

const TableWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: ${({ isMobile }) => (isMobile ? '12px' : '0')};

  background: ${({ theme }) => theme.colors.white};

  overflow-x: auto;
`;

const Table = styled.table<{ isMobile: boolean }>`
  --name-col-width: 64px;
  --date-col-width: ${({ isMobile }) => (isMobile ? '36px' : '28px')};
  --summary-col-width: 36px;
  --rate-col-width: 60px;

  width: 100%;
  min-width: ${({ isMobile }) => (isMobile ? '840px' : '720px')};

  table-layout: fixed;
`;

const HeaderRow = styled.tr``;

const HeaderCell = styled.th<{ isWeekDivider?: boolean; isMobile: boolean }>`
  width: var(--date-col-width);
  padding: 6px 4px;
  border-right: ${({ isWeekDivider, theme }) =>
    isWeekDivider
      ? `2px solid ${theme.colors.disabledText}`
      : `1px solid ${theme.colors.dividers}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: ${({ theme, isMobile }) =>
    isMobile ? theme.colors.white : 'transparent'};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.caption};
  text-align: center;
  white-space: nowrap;

  ${({ isMobile }) =>
    isMobile
      ? `
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
  `
      : `
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
  `}
`;

const BodyRow = styled.tr<{ isMine: boolean; isMobile: boolean }>`
  ${({ isMine, isMobile, theme }) =>
    isMine &&
    (isMobile
      ? `
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
  `
      : `
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
  `)}
`;

const BodyCell = styled.td<{
  isSurvived: boolean;
  isWeekDivider?: boolean;
}>`
  padding: 4px;
  border-right: ${({ theme, isWeekDivider }) =>
    isWeekDivider
      ? `2px solid ${theme.colors.disabledText}`
      : `1px solid ${theme.colors.dividers}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.dividers};

  background: ${({ theme, isSurvived }) => {
    if (!isSurvived) return theme.colors.disabledBackground;
    return theme.colors.white;
  }};
  color: ${({ theme, isSurvived }) =>
    !isSurvived ? theme.colors.disabledText : theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.fonts.body4};
  text-align: center;

  &:last-of-type {
    border-right: none;
  }
`;

const NameCell = styled(BodyCell)<{ isMobile: boolean }>`
  width: var(--name-col-width);
  padding: 6px;

  font: ${({ theme }) => theme.fonts.body2};

  ${({ isMobile }) =>
    isMobile &&
    `
    position: sticky;
    left: 0;
    z-index: 1;
  `}
`;

const SummaryCell = styled(BodyCell)<{ isMobile: boolean }>`
  width: var(--summary-col-width);
  font: ${({ theme }) => theme.fonts.caption};

  ${({ isMobile }) =>
    isMobile &&
    `
    position: sticky;
    right: var(--rate-col-width);
    z-index: 1;
  `}
`;

const RateCell = styled(BodyCell)<{ isMobile: boolean }>`
  width: var(--rate-col-width);
  font: ${({ theme }) => theme.fonts.caption};

  ${({ isMobile }) =>
    isMobile &&
    `
    position: sticky;
    right: 0;
    z-index: 1;
  `}
`;

const StatusIcon = styled.span`
  width: 20px;
  height: 14px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  & > svg {
    width: 14px;
    height: 14px;
  }
`;
