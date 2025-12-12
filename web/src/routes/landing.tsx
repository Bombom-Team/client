import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
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
      <LandingHero />
      <PainPoint />
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;

  background: linear-gradient(
    180deg,
    #f9f8f8 0%,
    #f9f8f8 34%,
    rgb(212 79 19 / 25%) 80%,
    #f9f8f8 100%
  );
`;
