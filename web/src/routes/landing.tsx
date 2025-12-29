import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useDevice } from '@/hooks/useDevice';
import LandingAppDownload from '@/pages/landing/components/LandingAppDownload';
import LandingFeatures from '@/pages/landing/components/LandingFeatures';
import LandingGetStartedCTA from '@/pages/landing/components/LandingGetStartedCTA';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import LandingHero from '@/pages/landing/components/LandingHero';
import LandingPopularNewsletters from '@/pages/landing/components/LandingPopularNewsletters';
import PainPoint from '@/pages/landing/components/PainPoint';
import { LANDING_VISITED_KEY } from '@/pages/landing/constants/localStorage';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/landing')({
  head: () => ({
    meta: [
      {
        name: 'robots',
        content: 'noindex, follow',
      },
      {
        title: '봄봄 | 뉴스레터로 시작하는 새로운 읽기 습관',
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const device = useDevice();

  useEffect(() => {
    localStorage.setItem(LANDING_VISITED_KEY, 'true');
  }, []);

  return (
    <Container device={device}>
      <LandingHeader />
      <LandingHero />
      <PainPoint />
      <LandingAppDownload />
      <LandingFeatures />
      <LandingPopularNewsletters />
      <LandingGetStartedCTA />
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
  padding: ${({ device }) =>
    device === 'mobile' ? '0 20px 80px 20px' : '0 60px 240px 60px'};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    180deg,
    #f9f8f8 0%,
    #f9f8f8 34%,
    rgb(212 79 19 / 25%) 80%,
    #f9f8f8 100%
  );

  word-break: keep-all;
`;
