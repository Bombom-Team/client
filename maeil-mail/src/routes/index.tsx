import styled from '@emotion/styled';
import { createFileRoute } from '@tanstack/react-router';
import { useDevice, useScrollVisible } from '@bombom/shared/ui-web';
import LandingAboutSection from '@/pages/landing/components/LandingAboutSection';
import HowSection from '@/pages/landing/components/HowSection';
import LandingHeader from '@/pages/landing/components/LandingHeader';
import LandingFAQSection from '@/pages/landing/components/LandingFaqSection';
import { FAQ_ITEMS } from '@/pages/landing/constants/faq';
import LandingHero from '@/pages/landing/components/LandingHero';

const SITE_URL = 'https://maeilmail.bombom.news';
const TITLE = '봄봄 × 매일메일 | 매일 받는 기술 면접 질문을 간편하게';
const DESCRIPTION =
  '매일 기술 면접 질문을 봄봄에서 받아보세요. 개발자를 위한 기술 면접 준비 뉴스레터, 매일메일로 매일 성장해요.';

const FAQ_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: { '@type': 'Answer', text: answer },
  })),
};

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: 'description', content: DESCRIPTION },
      { property: 'og:url', content: SITE_URL },
      { property: 'og:title', content: TITLE },
      { property: 'og:description', content: DESCRIPTION },
      { name: 'twitter:title', content: TITLE },
      { name: 'twitter:description', content: DESCRIPTION },
    ],
    links: [{ rel: 'canonical', href: SITE_URL }],
    scripts: [
      { type: 'application/ld+json', children: JSON.stringify(FAQ_SCHEMA) },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  const device = useDevice();
  const isMobile = device === 'mobile';

  const { visibleRef: aboutRef, isVisible: isAboutVisible } =
    useScrollVisible(0.15);

  return (
    <>
      <LandingHeader />
      <Container>
        <LandingHero />
        <LandingAboutSection visible={isAboutVisible} sectionRef={aboutRef} />
        <InformationSection isMobile={isMobile}>
          <HowSection />
          <LandingFAQSection />
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
