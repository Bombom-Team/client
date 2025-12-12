import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import LandingHero from '@/pages/landing/components/LandingHero';

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
  return (
    <Container>
      <LandingHero />
    </Container>
  );
}

const Container = styled.main`
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
