import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import HowSection from './HowSection';
import NewsletterFaqNote from './NewsletterFaqNote';
import NewsletterHero from './NewsletterHero';
import { toast } from '@/components/Toast/utils/toastActions';
import { useAuth } from '@/contexts/AuthContext';
import { useDevice } from '@/hooks/useDevice';
import type { NewsletterLandingConfig } from '../../constants/newsletter';

interface Props {
  config: NewsletterLandingConfig;
}

const NewsletterLanding = ({ config }: Props) => {
  const { isLoggedIn, userProfile } = useAuth();
  const navigate = useNavigate();
  const device = useDevice();
  const isMobile = device === 'mobile';
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = () => {
    // TODO: API 연동 - 사전 구독자 등록 엔드포인트 호출
    setIsSubscribed(true);
    toast.success('사전 구독이 완료되었습니다!');
  };

  const handleLoginRedirect = () => {
    navigate({ to: '/login' });
  };

  return (
    <Container>
      <NewsletterHero
        config={config}
        device={device}
        isLoggedIn={isLoggedIn}
        userEmail={userProfile?.email}
        isSubscribed={isSubscribed}
        onSubscribe={handleSubscribe}
        onLoginRedirect={handleLoginRedirect}
      />

      <Sections isMobile={isMobile}>
        <HowSection isMobile={isMobile} />
        <NewsletterFaqNote />
      </Sections>
    </Container>
  );
};

export default NewsletterLanding;

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

const Sections = styled.div<{ isMobile: boolean }>`
  position: relative;
  z-index: 1;
  max-width: 1120px;
  margin: 0 auto;
  padding: ${({ isMobile }) => (isMobile ? '0 24px 64px' : '0 40px 80px')};

  display: flex;
  gap: 32px;
  flex-direction: column;
`;
