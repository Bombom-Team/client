import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import NewsletterCard from './NewsletterCard';
import { newslettersQueries } from '@/apis/newsletters/newsletters.query';
import { useDevice, type Device } from '@/hooks/useDevice';
import { useScrollVisible } from '@/pages/landing/hooks/useScrollVisible';

const NEWSLETTER_RECOMMENDATIONS = [
  '뉴닉',
  'Daily Byte',
  "NYT's THE Morning",
  '어피티',
  '점선면',
  '머니네버슬립',
  'H:730',
];

const RecommendNewsletters = () => {
  const device = useDevice();
  const { visibleRef, isVisible } = useScrollVisible(0.3);
  const [selectedNewsletterId, setSelectedNewsletterId] = useState<
    number | null
  >(null);

  const { data } = useQuery(newslettersQueries.newsletters());

  const recommendNewsletters = data?.newsletters.filter((newsletter) =>
    NEWSLETTER_RECOMMENDATIONS.some(
      (newsletterName) => newsletterName === newsletter.name,
    ),
  );

  const selectNewsletter = (newsletterId: number) => {
    setSelectedNewsletterId(newsletterId);
  };

  const closeCard = () => {
    setSelectedNewsletterId(null);
  };

  const selectedNewsletter = recommendNewsletters?.find(
    (newsletter) => newsletter.newsletterId === selectedNewsletterId,
  );

  return (
    <Container ref={visibleRef} device={device}>
      <ContentWrapper device={device}>
        <Title device={device}>챌린지 추천 뉴스레터</Title>
        <NewslettersGrid device={device}>
          {recommendNewsletters?.map((newsletter, index) => (
            <NewsletterCardBox
              key={newsletter?.newsletterId}
              device={device}
              isVisible={isVisible}
              index={index}
              isSelected={selectedNewsletterId === newsletter.newsletterId}
            >
              <NewsletterCard
                newsletter={newsletter}
                onSelect={selectNewsletter}
                isFlipped={selectedNewsletterId === newsletter.newsletterId}
              />
            </NewsletterCardBox>
          ))}
        </NewslettersGrid>
      </ContentWrapper>
      {selectedNewsletterId !== null && selectedNewsletter && (
        <>
          <Overlay />
          <ModalCardWrapper device={device}>
            <NewsletterCard
              key={selectedNewsletterId}
              newsletter={selectedNewsletter}
              onSelect={selectNewsletter}
              onCloseCard={closeCard}
              isFlipped={true}
            />
          </ModalCardWrapper>
        </>
      )}
    </Container>
  );
};

export default RecommendNewsletters;

const Container = styled.section<{ device: Device }>`
  position: relative;
  width: 100%;
  max-width: ${({ device }) => {
    if (device === 'mobile') return '400px';
    return device === 'tablet' ? '760px' : '1084px';
  }};

  display: flex;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0 20px' : '0 60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading2};
  text-align: center;
`;

const NewslettersGrid = styled.div<{ device: Device }>`
  position: relative;
  width: 100%;

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '24px')};
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
`;

const NewsletterCardBox = styled.div<{
  device: Device;
  isVisible: boolean;
  index: number;
  isSelected: boolean;
}>`
  visibility: ${({ isSelected }) => (isSelected ? 'hidden' : 'visible')};
  width: ${({ device }) => {
    if (device === 'mobile') return 'calc((100% - 16px) / 2)';
    if (device === 'tablet') return 'calc((100% - 48px) / 3)';
    return '200px';
  }};

  flex: 0 0 auto;

  aspect-ratio: 1;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  transition-delay: ${({ index }) => `${index * 100}ms`};
`;

const Overlay = styled.div`
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.overlay};

  backdrop-filter: blur(8px);
  cursor: pointer;

  inset: 0;
`;

const modalPopIn = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.92);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const ModalCardWrapper = styled.div<{ device: Device }>`
  position: fixed;
  top: 50%;
  left: 50%;
  z-index: ${({ theme }) => theme.zIndex.overlay + 1};
  width: ${({ device }) => {
    if (device === 'mobile') return 'min(80vw, 320px)';
    if (device === 'tablet') return 'min(60vw, 360px)';
    return 'min(40vw, 420px)';
  }};

  display: flex;
  align-items: center;
  justify-content: center;

  animation: ${modalPopIn} 0.35s ease-out;

  aspect-ratio: 1;
  transform: translate(-50%, -50%);
`;
