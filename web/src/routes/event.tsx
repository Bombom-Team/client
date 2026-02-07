import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
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

  return <Container device={device}></Container>;
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
