import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import ChallengeDashboard from '@/pages/challenge/dashboard/components/ChallengeDashboard/ChallengeDashboard';
import UserChallengeInfo from '@/pages/challenge/dashboard/components/UserChallengeInfo/UserChallengeInfo';
import InfoIcon from '#/assets/svg/info-circle.svg';

const REQUIRED_RATE = 80;

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
            🚨 챌린지 기간의 {REQUIRED_RATE}%(
            {challengeInfo?.requiredDays}일) 미만 달성 시 챌린지 탈락
            처리됩니다.
          </WarningMessage>
        </InfoWrapper>
        {teamChallengeProgressInfo && (
          <ChallengeDashboard
            nickName={memberChallengeProgressInfo?.nickname}
            data={teamChallengeProgressInfo}
          />
        )}
        <NoticeMessage>
          <InfoIcon width={12} height={12} fill={theme.colors.primary} />
          공휴일이나 뉴스레터의 임시 휴재 등으로 인해 챌린지 인증 상태에 대한
          문의가 필요하신 경우 채널톡으로 문의 부탁드립니다.
        </NoticeMessage>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  padding: 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
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
  flex-flow: row;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const AchievementAverage = styled.p`
  font: ${({ theme }) => theme.fonts.heading6};
`;

const WarningMessage = styled.p`
  font: ${({ theme }) => theme.fonts.body2};
`;

const NoticeMessage = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;

  font: ${({ theme }) => theme.fonts.body2};
`;
