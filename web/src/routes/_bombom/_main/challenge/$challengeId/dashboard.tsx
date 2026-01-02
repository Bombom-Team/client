import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import ChallengeDashboard from '@/pages/challenge/dashboard/components/ChallengeDashboard/ChallengeDashboard';
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

  const { data: teamChallengeProgressInfo } = useQuery(
    queries.teamProgress(Number(challengeId)),
  );

  return (
    <Container>
      <Content>
        {challengeInfo && memberChallengeProgressInfo && (
          <UserChallengeInfo
            challengeInfo={challengeInfo}
            memberChallengeProgressInfo={memberChallengeProgressInfo}
          />
        )}
        <InfoWrapper>
          <AchievementAverage>
            팀 평균 달성률 :{' '}
            {teamChallengeProgressInfo?.teamSummary.achievementAverage}%
          </AchievementAverage>
          <WarningMessage>
            ⚠️ 챌린지 기간의 80%(
            {challengeInfo?.requiredDays}일) 이상을 완수해야 챌린지 보상을 받을
            수 있습니다
          </WarningMessage>
        </InfoWrapper>
        {teamChallengeProgressInfo && (
          <ChallengeDashboard
            nickName={memberChallengeProgressInfo?.nickname}
            data={teamChallengeProgressInfo}
          />
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

  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const AchievementAverage = styled.p`
  font: ${({ theme }) => theme.fonts.heading6};
`;

const WarningMessage = styled.p`
  font: ${({ theme }) => theme.fonts.body2};
`;
