import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import Hero from '@/pages/challenge/landing/components/Hero';
import Introduction from '@/pages/challenge/landing/components/Introduction';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/landing',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 뉴스레터 읽기 챌린지',
      },
    ],
  }),
  component: ChallengeLanding,
});

function ChallengeLanding() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/landing',
  });

  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  if (!challengeInfo) {
    return null;
  }

  return (
    <Container>
      <Hero
        challengeName={challengeInfo.name}
        generation={challengeInfo.generation}
      />
      <Introduction
        startDate={challengeInfo.startDate}
        endDate={challengeInfo.endDate}
      />
    </Container>
  );
}

const Container = styled.main`
  width: 100%;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};

  word-break: keep-all;
`;
