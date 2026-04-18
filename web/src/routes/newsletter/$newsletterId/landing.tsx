import { createFileRoute, useParams } from '@tanstack/react-router';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import NewsletterLanding from '@/pages/newsletter/components/NewsletterLanding/NewsletterLanding';
import { NEWSLETTER_LANDING_CONFIG } from '@/pages/newsletter/constants/newsletter';

export const Route = createFileRoute('/newsletter/$newsletterId/landing')({
  head: () => ({
    meta: [{ title: '봄봄 × 매일메일 | 사전 구독' }],
  }),
  component: NewsletterLandingRoute,
});

function NewsletterLandingRoute() {
  const { newsletterId } = useParams({
    from: '/newsletter/$newsletterId/landing',
  });

  const config = NEWSLETTER_LANDING_CONFIG[Number(newsletterId)];

  if (!config) {
    window.location.replace('/');
    return null;
  }

  return (
    <>
      <LandingHeader />
      <NewsletterLanding config={config} />
    </>
  );
}
