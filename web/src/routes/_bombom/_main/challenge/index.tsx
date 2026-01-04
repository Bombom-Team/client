import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import ChallengeListSection from '@/pages/challenge/index/components/ChallengeListSection';
import TrophyIcon from '#/assets/svg/trophy.svg';

export const Route = createFileRoute('/_bombom/_main/challenge/')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지',
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const device = useDevice();
  const { data: challenges } = useQuery(queries.challenges());

  const isMobile = device === 'mobile';

  const joinedChallenges = challenges?.filter(
    (challenge) =>
      (challenge.detail?.isJoined && challenge.status === 'BEFORE_START') ||
      challenge.status === 'ONGOING',
  );
  const availableChallenges = challenges?.filter(
    (challenge) =>
      !challenge.detail?.isJoined && challenge.status === 'BEFORE_START',
  );
  const completedChallenges = challenges?.filter(
    (challenge) => challenge.status === 'COMPLETED',
  );

  const hasChallenges = challenges && challenges.length > 0;

  return (
    <Container>
      {!isMobile && (
        <TitleWrapper>
          <TitleIconBox>
            <TrophyIcon width={20} height={20} color={theme.colors.white} />
          </TitleIconBox>
          <Title>챌린지</Title>
        </TitleWrapper>
      )}

      {!hasChallenges ? (
        <EmptyStateWrapper>
          <EmptyStateTitle>현재 진행중인 챌린지가 없네요</EmptyStateTitle>
          <EmptyStateDescription>
            곧 새로운 챌린지가 시작될 예정이에요
          </EmptyStateDescription>
        </EmptyStateWrapper>
      ) : (
        <ContentWrapper>
          <ChallengeListSection
            title="도전 중인 챌린지"
            challenges={joinedChallenges}
          />
          <ChallengeListSection
            title="새롭게 도전할 챌린지"
            challenges={availableChallenges}
          />
          <ChallengeListSection
            title="완료한 챌린지"
            challenges={completedChallenges}
          />
        </ContentWrapper>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: flex-start;

  box-sizing: border-box;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
`;

const TitleIconBox = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 50%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.primary};
`;

const Title = styled.h1`
  font: ${({ theme }) => theme.fonts.heading3};
`;

const ContentWrapper = styled.div`
  width: 100%;

  display: flex;
  gap: 24px;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  justify-content: center;
`;

const EmptyStateWrapper = styled.div`
  width: 100%;
  min-height: 400px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const EmptyStateTitle = styled.h2`
  margin: 0;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading4};
  text-align: center;
`;

const EmptyStateDescription = styled.p`
  margin: 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body1};
  text-align: center;
`;
