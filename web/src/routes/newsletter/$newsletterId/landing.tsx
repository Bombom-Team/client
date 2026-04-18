import styled from '@emotion/styled';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useDevice } from '@/hooks/useDevice';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import HowSection from '@/pages/newsletter/components/NewsletterLanding/HowSection';
import NewsletterFAQ from '@/pages/newsletter/components/NewsletterLanding/NewsletterFAQ';
import NewsletterHero from '@/pages/newsletter/components/NewsletterLanding/NewsletterHero';
import { NEWSLETTER_LANDING_CONFIG } from '@/pages/newsletter/constants/newsletter';

export const Route = createFileRoute('/newsletter/$newsletterId/landing')({
  loader: ({ params }) => {
    const config = NEWSLETTER_LANDING_CONFIG[Number(params.newsletterId)];
    return { config };
  },
  head: ({ loaderData }) => {
    const name = loaderData?.config?.name;
    return {
      meta: [
        { title: name ? `봄봄 × ${name} | 사전 구독` : '봄봄 | 사전 구독' },
      ],
    };
  },
  component: NewsletterLandingPage,
});

function NewsletterLandingPage() {
  const { newsletterId } = useParams({
    from: '/newsletter/$newsletterId/landing',
  });
  const device = useDevice();
  const isMobile = device === 'mobile';

  const config = NEWSLETTER_LANDING_CONFIG[Number(newsletterId)];

  if (!config) {
    window.location.replace('/');
    return null;
  }

  return (
    <>
      <LandingHeader />
      <Container>
        <NewsletterHero config={config} newsletterId={Number(newsletterId)} />
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
