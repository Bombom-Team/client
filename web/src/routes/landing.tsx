import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import LandingAppDownload from '@/pages/landing/components/LandingAppDownload';
import LandingHero from '@/pages/landing/components/LandingHero';
import PainPoint from '@/pages/landing/components/PainPoint';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/landing')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 뉴스레터로 시작하는 새로운 읽기 습관',
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const device = useDevice();

  return (
    <Container device={device}>
      <ContentWrapper device={device}>
        <LandingHero />
        <PainPoint />
        <LandingAppDownload />
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;

  display: flex;
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
`;

const ContentWrapper = styled.div<{ device: Device }>`
  max-width: ${({ device }) => (device === 'mobile' ? '360px' : '720px')};
`;
