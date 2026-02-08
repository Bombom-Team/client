import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import EventFooter from '@/pages/event/components/EventFooter';
import EventHero from '@/pages/event/components/EventHero';
import EventPrize from '@/pages/event/components/EventPrize';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import type { Device } from '@/hooks/useDevice';

export const Route = createFileRoute('/event')({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 선착순 커피 쿠폰 이벤트',
      },
    ],
  }),
  component: EventPage,
});

function EventPage() {
  const device = useDevice();

  return (
    <Container device={device}>
      <LandingHeader />
      <EventHero />
      <EventPrize />
      <EventFooter />
    </Container>
  );
}

const Container = styled.main<{ device: Device }>`
  width: 100%;
  min-height: 100dvh;
  max-width: 1280px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  word-break: keep-all;
`;
