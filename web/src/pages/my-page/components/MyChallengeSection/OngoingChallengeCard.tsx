import styled from '@emotion/styled';
import Flex from '@/components/Flex';
import ProgressBar from '@/components/ProgressBar/ProgressBar';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import type { MyOngoingChallenge } from '@/apis/members/members.api';
import type { Device } from '@/hooks/useDevice';
import ChallengeIcon from '#/assets/svg/trophy.svg';

interface OngoingChallengeCardProps {
  challenge: MyOngoingChallenge;
}

const OngoingChallengeCard = ({ challenge }: OngoingChallengeCardProps) => {
  const device = useDevice();
  const {
    title,
    startDate,
    endDate,
    remainingDays,
    progressRate,
    myTeamRank,
    teamRank,
    myAttendanceComparison,
    teamAttendanceComparison,
  } = challenge;

  const getDeltaPrefix = (value: number) => (value > 0 ? '+' : '');

  return (
    <Container>
      <Body>
        <HeaderZone>
          <TitleRow>
            <Flex align="center" gap={8}>
              <IconCircle>
                <ChallengeIcon />
              </IconCircle>
              <ChallengeName>{title}</ChallengeName>
            </Flex>
          </TitleRow>
          <Flex align="center" gap={8}>
            <Text font="t4Regular" color="textSecondary">
              {startDate} ~ {endDate}
            </Text>
            <DDayBadge>
              <Text font="t3Bold" color="primaryBomBom">
                {remainingDays <= 0 ? '오늘 종료' : `${remainingDays}일 남음`}
              </Text>
            </DDayBadge>
          </Flex>
          <ProgressRow>
            <ProgressBarWrapper>
              <ProgressBar rate={progressRate} />
            </ProgressBarWrapper>
            <Text font="t7Bold" color="primaryBomBom">
              {progressRate}%
            </Text>
          </ProgressRow>
        </HeaderZone>

        <StatsZone device={device}>
          <StatCell>
            <CellLabel>
              <Text font="t4Regular" color="textSecondary">
                팀 내 순위
              </Text>
            </CellLabel>
            <RankValue>
              {myTeamRank.rank}
              <RankUnit>위</RankUnit> / {myTeamRank.totalMembers}
              <RankUnit>명</RankUnit>
            </RankValue>
          </StatCell>

          <StatCell>
            <CellLabel>
              <Text font="t4Regular" color="textSecondary">
                전체 팀 순위
              </Text>
            </CellLabel>
            <RankValue>
              {teamRank.rank}
              <RankUnit>위</RankUnit> / {teamRank.totalTeams}
              <RankUnit>팀</RankUnit>
            </RankValue>
          </StatCell>

          <StatCell>
            <CellLabel>
              <Text font="t4Regular" color="textSecondary">
                나의 출석률
              </Text>
            </CellLabel>
            <AttendanceValue>
              {myAttendanceComparison.attendanceRate}
              <AttendanceUnit>%</AttendanceUnit>
            </AttendanceValue>
            <ComparisonRow>
              <Text font="t4Regular" color="textSecondary">
                전체 평균보다{' '}
              </Text>
              <Delta delta={myAttendanceComparison.differencePoint}>
                {getDeltaPrefix(myAttendanceComparison.differencePoint)}
                {myAttendanceComparison.differencePoint}%p
              </Delta>
            </ComparisonRow>
          </StatCell>

          <StatCell>
            <CellLabel>
              <Text font="t4Regular" color="textSecondary">
                팀 출석률
              </Text>
            </CellLabel>
            <AttendanceValue>
              {teamAttendanceComparison.teamAttendanceRate}
              <AttendanceUnit>%</AttendanceUnit>
            </AttendanceValue>
            <ComparisonRow>
              <Text font="t4Regular" color="textSecondary">
                전체 평균보다{' '}
              </Text>
              <Delta delta={teamAttendanceComparison.differencePoint}>
                {getDeltaPrefix(teamAttendanceComparison.differencePoint)}
                {teamAttendanceComparison.differencePoint}%p
              </Delta>
            </ComparisonRow>
          </StatCell>
        </StatsZone>
      </Body>
    </Container>
  );
};

export default OngoingChallengeCard;

const Container = styled.div`
  overflow: hidden;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 16px;

  display: flex;

  box-sizing: border-box;
`;

const IconCircle = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 20%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};

  svg path {
    fill: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const Body = styled.div`
  min-width: 0;

  display: flex;
  flex: 1;
  flex-direction: column;
`;

const HeaderZone = styled.div`
  padding: 16px 16px 12px;

  display: flex;
  gap: 6px;
  flex-direction: column;
`;

const TitleRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

const ChallengeName = styled.h3`
  overflow: hidden;
  margin: 0;

  flex: 1;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
  white-space: nowrap;

  text-overflow: ellipsis;
`;

const DDayBadge = styled.div`
  padding: 3px 10px;
  border-radius: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primaryInfo};
`;

const ProgressRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ProgressBarWrapper = styled.div`
  min-width: 0;

  flex: 1;
  align-self: center;
`;

const StatsZone = styled.div<{ device: Device }>`
  border-top: 1px solid ${({ theme }) => theme.colors.dividers};
  display: grid;

  ${({ device, theme }) =>
    device === 'pc'
      ? `
          grid-template-columns: repeat(4, 1fr);

          /* DOM 순서: 팀내순위, 전체팀순위, 나의출석, 팀출석
             PC 시각 순서: 팀내순위, 나의출석, 전체팀순위, 팀출석 */
          & > *:nth-child(2) { order: 3; }
          & > *:nth-child(3) { order: 2; }

          & > * {
            position: relative;
            padding: 14px 20px 18px;
          }

          & > *:not(:last-child)::after {
            content: '';
            position: absolute;
            top: 50%;
            right: 0;
            width: 1px;
            height: 48px;
            transform: translateY(-50%);
            background-color: ${theme.colors.dividers};
          }
        `
      : `
          grid-template-columns: 1fr 1fr;

          & > * {
            padding: 12px 16px 14px;
          }

          & > *:nth-child(-n+2) {
            border-bottom: 1px solid ${theme.colors.dividers};
          }
          & > *:nth-child(odd) {
            border-right: 1px solid ${theme.colors.dividers};
          }
        `}
`;

const StatCell = styled.div`
  display: flex;
  gap: 2px;
  flex-direction: column;
`;

const CellLabel = styled.div`
  display: flex;
  gap: 3px;
  align-items: center;

  svg path {
    fill: ${({ theme }) => theme.colors.icons};
  }
`;

const RankValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
  white-space: nowrap;
`;

const RankUnit = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const AttendanceValue = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
  white-space: nowrap;
`;

const AttendanceUnit = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
`;

const ComparisonRow = styled.div`
  display: flex;
  align-items: baseline;
`;

const Delta = styled.span<{ delta: number }>`
  color: ${({ delta, theme }) => {
    if (delta > 0) return theme.colors.primaryBomBom;
    if (delta < 0) return theme.colors.info;
    return theme.colors.textSecondary;
  }};
  font: ${({ theme }) => theme.fonts.t5Bold};
  white-space: nowrap;
`;
