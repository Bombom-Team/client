import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import Tab from '@/components/Tab/Tab';
import Tabs from '@/components/Tabs/Tabs';
import { useDevice, type Device } from '@/hooks/useDevice';
import ChallengeDashboard from '@/pages/challenge/dashboard/components/ChallengeDashboard/ChallengeDashboard';
import { useChallengeTeamProgressTabs } from '@/pages/challenge/index/hooks/useChallengeTeamProgressTabs';
import type { TeamInfoResponse } from '@/pages/challenge/dashboard/types/challengeTeamInfo';
import type { Theme } from '@emotion/react/macro';
import type { CSSObject } from '@emotion/styled';
import InfoIcon from '#/assets/svg/info-circle.svg';

const REQUIRED_RATE = 80;

const getTeamLabel = (team: TeamInfoResponse[number]) =>
  team.isMyTeam ? '우리팀' : `${team.teamNumber}팀`;

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/dashboard',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 진행 현황판',
      },
    ],
  }),
  component: ChallengeDashboardRoute,
});

function ChallengeDashboardRoute() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/dashboard',
  });

  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  const { data: memberChallengeProgressInfo } = useQuery(
    queries.memberProgress(Number(challengeId)),
  );

  const { data: challengeTeamsInfo } = useQuery(
    queries.challengeTeams(Number(challengeId)),
  );

  const teams = challengeTeamsInfo?.teams ?? [];

  const tabs = teams.map((team) => ({
    id: team.teamId,
    label: getTeamLabel(team),
  }));

  const { activeTeamId, goToTab } = useChallengeTeamProgressTabs({
    teams,
  });

  const { data: teamChallengeProgressInfo } = useQuery({
    ...queries.challengeTeamsProgress(Number(challengeId), activeTeamId ?? 0),
    enabled: teams.length > 0,
  });

  const device = useDevice();

  return (
    <Container>
      <InfoWrapper>
        <AchievementAverage>
          팀 평균 달성률 :{' '}
          {teamChallengeProgressInfo?.teamSummary.achievementAverage}%
        </AchievementAverage>
        <TabsWrapper device={device}>
          <Tabs direction={'horizontal'}>
            {tabs.map((tab) => (
              <Tab
                key={tab.id}
                value={tab.id}
                label={tab.label}
                onTabSelect={() => goToTab(tab.id)}
                selected={activeTeamId === tab.id}
                aria-controls={`panel-${tab.id}`}
                textAlign="start"
              />
            ))}
          </Tabs>
        </TabsWrapper>
        <WarningMessage>
          🚨 챌린지 기간의 {REQUIRED_RATE}%(
          {challengeInfo?.requiredDays}일) 미만 달성 시 챌린지 탈락 처리됩니다.
        </WarningMessage>
      </InfoWrapper>
      {teamChallengeProgressInfo && (
        <ChallengeDashboard
          nickName={memberChallengeProgressInfo?.nickname}
          data={teamChallengeProgressInfo}
        />
      )}
      <NoticeMessageWrapper>
        <InfoIcon width={20} height={20} fill={theme.colors.primary} />
        <NoticeMessage>
          {' '}
          공휴일이나 뉴스레터의 임시 휴재 등으로 인해 챌린지 인증 상태에 대한
          문의가 필요하신 경우 채널톡으로 문의 부탁드립니다.
        </NoticeMessage>
      </NoticeMessageWrapper>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
`;

const InfoWrapper = styled.div`
  padding: 0 10px;

  display: flex;
  flex-flow: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const AchievementAverage = styled.p`
  font: ${({ theme }) => theme.fonts.heading6};
`;

const WarningMessage = styled.p`
  font: ${({ theme }) => theme.fonts.body2};
`;

const NoticeMessageWrapper = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const NoticeMessage = styled.p`
  font: ${({ theme }) => theme.fonts.body2};
`;

const TabsWrapper = styled.div<{ device: Device }>`
  height: 36px;

  display: flex;
  flex-direction: row;
  ${({ device, theme }) => tabsWrapperStyles[device](theme)}
`;

const tabsWrapperStyles: Record<Device, (theme: Theme) => CSSObject> = {
  pc: (theme) => ({
    flexShrink: 0,
    border: `1px solid ${theme.colors.stroke}`,
    borderRadius: '12px',
    padding: '4px 16px',
  }),
  tablet: (theme) => ({
    flexShrink: 0,
    border: `1px solid ${theme.colors.stroke}`,
    borderRadius: '12px',
  }),
  mobile: () => ({
    gap: '8px',
    overflowX: 'auto',
    '&::-webkit-scrollbar': {
      display: 'none',
    },
    scrollbarWidth: 'none',
  }),
};
