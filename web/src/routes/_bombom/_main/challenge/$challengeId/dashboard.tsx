import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import ChallengeDashboard from '@/pages/challenge/dashboard/components/ChallengeDashboard/ChallengeDashboard';
import mockChallengeData from '@/pages/challenge/dashboard/components/ChallengeDashboard/mockChallengeData.json';
import MobileChallengeDashboard from '@/pages/challenge/dashboard/components/MobileChallengeDashboard/MobileChallengeDashboard';
import UserChallengeInfo from '@/pages/challenge/dashboard/components/UserChallengeInfo/UserChallengeInfo';

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

const nickName = '메이토';

function ChallengeDashboardRoute() {
  const device = useDevice();
  const isMobile = device === 'mobile';
  return (
    <Container>
      <Content>
        <UserChallengeInfo />
        <InfoWrapper>
          <AchievementAverage>
            팀 평균 달성률 : {mockChallengeData.teamSummary.achievementAverage}%
          </AchievementAverage>
        </InfoWrapper>
        {isMobile ? (
          <MobileChallengeDashboard
            nickName={nickName}
            data={mockChallengeData}
          />
        ) : (
          <ChallengeDashboard nickName={nickName} data={mockChallengeData} />
        )}
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
`;

const Content = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.dividers};
  border-radius: 16px;

  display: flex;
  gap: 24px;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  box-sizing: border-box;
`;

const InfoWrapper = styled.div`
  padding: 0 10px;
`;

const AchievementAverage = styled.p`
  font: ${({ theme }) => theme.fonts.heading6};
`;
