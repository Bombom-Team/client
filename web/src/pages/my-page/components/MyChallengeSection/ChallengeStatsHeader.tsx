import styled from '@emotion/styled';
import { MEDAL_COLORS, MEDAL_LABEL } from './constants';
import MedalDonutChart from './MedalDonutChart';
import Flex from '@/components/Flex';
import Text from '@/components/Text';
import { useDevice } from '@/hooks/useDevice';
import type { GetMyChallengeSummaryResponse } from '@/apis/members/members.api';
import type { Device } from '@/hooks/useDevice';
import CrownIcon from '#/assets/svg/crown.svg';
import MedalIcon from '#/assets/svg/medal.svg';
import TrophyColoredIcon from '#/assets/svg/trophy-colored.svg';

interface ChallengeStatsHeaderProps {
  summary: GetMyChallengeSummaryResponse;
}

const ChallengeStatsHeader = ({ summary }: ChallengeStatsHeaderProps) => {
  const device = useDevice();
  const {
    completedChallengeCount,
    completionRank,
    attendanceRank,
    medalRatio,
  } = summary;

  return (
    <Container device={device}>
      <StatCell gap={12} align="center">
        <IconCircle device={device}>
          <TrophyColoredIcon width="100%" height="100%" />
        </IconCircle>
        <StatContent direction="column" gap={4}>
          <Text font="t4Regular" color="textSecondary">
            완료한 챌린지
          </Text>
          <Text font="t8Bold" color="primaryBomBom">
            {completedChallengeCount}{' '}
            <Text font="t5Regular" color="primaryBomBom">
              개
            </Text>
          </Text>
        </StatContent>
      </StatCell>

      <Divider device={device} />

      <StatCell gap={12} align="center">
        <IconCircle device={device}>
          <MedalIcon width="100%" height="100%" />
        </IconCircle>
        <StatContent direction="column" gap={4}>
          <Text font="t4Regular" color="textSecondary">
            수료율 순위
          </Text>
          <Text font="t7Bold" color="primaryBomBom">
            상위 {completionRank.topPercent}%
          </Text>
          <Text font="t3Regular" color="textSecondary">
            내 수료율
            <HighLight>{completionRank.completionRate}%</HighLight>
          </Text>
        </StatContent>
      </StatCell>

      <Divider device={device} />

      <StatCell gap={12} align="center">
        <IconCircle device={device}>
          <CrownIcon width="100%" height="100%" />
        </IconCircle>
        <StatContent direction="column" gap={4}>
          <Text font="t4Regular" color="textSecondary">
            출석률 순위
          </Text>
          <Text font="t7Bold" color="primaryBomBom">
            상위 {attendanceRank.topPercent}%
          </Text>
          <Text font="t3Regular" color="textSecondary">
            평균 출석률
            <HighLight>{attendanceRank.averageAttendanceRate}%</HighLight>
          </Text>
        </StatContent>
      </StatCell>

      <Divider device={device} />

      <StatCell gap={12} align="center">
        <MedalDonutChart ratio={medalRatio} size={device === 'pc' ? 72 : 52} />
        <Flex direction="column" gap={4}>
          {(Object.keys(MEDAL_LABEL) as (keyof typeof MEDAL_LABEL)[]).map(
            (key) => (
              <Flex key={key} gap={8} align="center">
                <LegendDot color={MEDAL_COLORS[key]} />
                <NoWrapText font="t3Regular" color="textSecondary">
                  {MEDAL_LABEL[key]} {medalRatio[key]}%
                </NoWrapText>
              </Flex>
            ),
          )}
        </Flex>
      </StatCell>
    </Container>
  );
};

export default ChallengeStatsHeader;

const Container = styled.div<{ device: Device }>`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 12px;

  box-sizing: border-box;

  ${({ device, theme }) =>
    device === 'pc'
      ? `
          display: flex;
          gap: 16px;
          align-items: center;
        `
      : `
          display: grid;
          grid-template-columns: repeat(2, 1fr);

          & > *:nth-child(1),
          & > *:nth-child(5) {
            padding-right: 16px;
            border-right: 1px solid ${theme.colors.dividers};
          }
          & > *:nth-child(3),
          & > *:nth-child(7) {
            padding-left: 16px;
          }
          & > *:nth-child(1),
          & > *:nth-child(3) {
            padding-bottom: 16px;
            border-bottom: 1px solid ${theme.colors.dividers};
          }
          & > *:nth-child(5),
          & > *:nth-child(7) {
            padding-top: 16px;
          }
        `}
`;

const ICON_SIZE: Record<Device, string> = {
  mobile: '48px',
  tablet: '48px',
  pc: '64px',
};

const IconCircle = styled.div<{ device: Device }>`
  width: ${({ device }) => ICON_SIZE[device]};
  height: ${({ device }) => ICON_SIZE[device]};
  border-radius: 50%;

  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const Divider = styled.div<{ device: Device }>`
  width: 1px;
  height: 48px;

  display: ${({ device }) => (device === 'pc' ? 'block' : 'none')};
  flex-shrink: 0;

  background-color: ${({ theme }) => theme.colors.dividers};
`;

const LegendDot = styled.div<{ color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;

  flex-shrink: 0;

  background-color: ${({ color }) => color};
`;

const StatCell = styled(Flex)`
  min-width: 0;
  flex: 1;
`;

const StatContent = styled(Flex)`
  min-width: 0;
`;

const NoWrapText = styled(Text)`
  white-space: nowrap;
`;

const HighLight = styled.span`
  margin-left: 4px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;
