import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice } from '@bombom/shared/ui-web';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import HowSection from '@/pages/newsletter/components/NewsletterLanding/HowSection';
import NewsletterFAQ from '@/pages/newsletter/components/NewsletterLanding/NewsletterFAQ';
import NewsletterHero from '@/pages/newsletter/components/NewsletterLanding/NewsletterHero';

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: '봄봄 × 매일메일 | 사전 구독' }],
  }),
  component: MaeilMailLandingPage,
});

function MaeilMailLandingPage() {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <>
      <LandingHeader />
      <Container>
        <NewsletterHero />
        <InformationSection isMobile={isMobile}>
          <HowSection />
          <NewsletterFAQ />
        </InformationSection>
      </Container>
    </>
  );
}

const Container = styled.div`
  position: relative;
  width: 100%;
  min-height: 100vh;

  background-color: oklch(98.5% 0.003 55deg);
  background-image:
    linear-gradient(rgb(0 0 0 / 3%) 1px, transparent 1px),
    linear-gradient(90deg, rgb(0 0 0 / 3%) 1px, transparent 1px);
  background-size: 40px 40px;

  overflow-x: hidden;
  word-break: keep-all;
`;

const InformationSection = styled.div<{ isMobile: boolean }>`
  max-width: 1120px;
  margin: 0 auto;
  padding-bottom: ${({ isMobile }) => (isMobile ? '40px' : '56px')};

  display: flex;
  gap: 32px;
  flex-direction: column;
`;
