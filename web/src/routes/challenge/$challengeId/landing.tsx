import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import Hero from '@/pages/challenge/landing/components/Hero';
import Introduction from '@/pages/challenge/landing/components/Introduction';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/challenge/$challengeId/landing')({
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
  const device = useDevice();
  const { challengeId } = useParams({
    from: '/challenge/$challengeId/landing',
  });

  const { data: challengeInfo } = useQuery(
    queries.challengesInfo(Number(challengeId)),
  );

  if (!challengeInfo) {
    return null;
  }

  return (
    <Container device={device}>
      <LandingHeader />
      <Hero
        challengeName={challengeInfo.name}
        generation={challengeInfo.generation}
      />
      <Content device={device}>
        <Introduction
          startDate={challengeInfo.startDate}
          endDate={challengeInfo.endDate}
        />
      </Content>
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
`;

const Content = styled.div<{ device: Device }>`
  padding: ${({ device }) =>
    device === 'mobile' ? '0 20px 80px 20px' : '0 60px 240px 60px'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};

  word-break: keep-all;
`;
