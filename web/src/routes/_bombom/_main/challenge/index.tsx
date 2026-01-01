import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import ChallengeCard from '@/pages/challenge/index/components/ChallengeCard/ChallengeCard';
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

      <ContentWrapper>
        <ChallengeGrid isMobile={isMobile}>
          {challenges?.map((challenge) => (
            <ChallengeCard key={challenge.id} {...challenge} />
          ))}
        </ChallengeGrid>
      </ContentWrapper>
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

const ChallengeGrid = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: grid;
  gap: ${({ isMobile }) => (isMobile ? '16px' : '24px')};

  grid-template-columns: ${({ isMobile }) =>
    isMobile ? '1fr' : 'repeat(auto-fit, minmax(360px, 1fr))'};
`;
