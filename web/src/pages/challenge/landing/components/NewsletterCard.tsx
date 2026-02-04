import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { useState, type MouseEvent } from 'react';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { components } from '@/types/openapi';

interface NewsletterCardProps {
  newsletter: components['schemas']['NewsletterResponse'];
}

const NewsletterCard = ({ newsletter }: NewsletterCardProps) => {
  const device = useDevice();
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const handleNavigateDetail = (e: MouseEvent) => {
    e.stopPropagation();
    navigate({
      to: '/',
      search: {
        newsletterDetail: newsletter.newsletterId,
      },
    });
  };

  if (!newsletter) {
    return null;
  }

  return (
    <Container device={device} onClick={handleClick}>
      <CardInner isFlipped={isFlipped}>
        <CardFront>
          <ThumbnailBackground>
            <Thumbnail
              src={newsletter.imageUrl}
              alt={`${newsletter.name} 로고`}
            />
            <CategoryBadge device={device} text={newsletter.category} />
          </ThumbnailBackground>
        </CardFront>
        <CardBack>
          <NewsletterName device={device}>{newsletter.name}</NewsletterName>
          <NewsletterDescription device={device}>
            {newsletter.description}
          </NewsletterDescription>
          <Button onClick={handleNavigateDetail}>구독하러 가기</Button>
        </CardBack>
      </CardInner>
    </Container>
  );
};

export default NewsletterCard;

const Container = styled.article<{
  device: Device;
}>`
  position: relative;
  width: 100%;
  height: 100%;

  cursor: pointer;
  perspective: 1200px;
`;

const CardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;

  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transform-style: preserve-3d;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

const CardBase = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow:
    0 1px 2px rgb(0 0 0 / 3%),
    0 2px 6px rgb(0 0 0 / 5%),
    0 8px 16px rgb(0 0 0 / 8%),
    0 16px 32px rgb(0 0 0 / 10%);

  backface-visibility: hidden;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    position: absolute;
    border: 1px solid rgb(0 0 0 / 4%);
    border-radius: 12px;

    content: '';
    inset: 0;
    pointer-events: none;
  }
`;

const CardFront = styled(CardBase)`
  overflow: hidden;

  display: flex;
  flex-direction: column;

  background-color: ${({ theme }) => theme.colors.white};
`;

const CardBack = styled(CardBase)`
  padding: 24px;

  display: flex;
  gap: 16px;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  background: linear-gradient(
    145deg,
    #fafafa 0%,
    ${({ theme }) => theme.colors.white} 100%
  );
  text-align: center;

  transform: rotateY(180deg);
`;

const ThumbnailBackground = styled.div`
  position: relative;
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${({ theme }) => theme.colors.white};
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;

  object-fit: contain;
  object-position: center;
`;

const CategoryBadge = styled(Badge)<{ device: Device }>`
  position: absolute;
  right: 12px;
  bottom: 12px;
  z-index: 2;
  padding: 6px 12px;
  border-radius: 24px;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 6%),
    0 2px 8px rgb(0 0 0 / 4%),
    inset 0 0 0 1px rgb(0 0 0 / 4%);

  background: rgb(255 255 255 / 92%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body2};

  backdrop-filter: blur(8px);
`;

const NewsletterName = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const NewsletterDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};

  opacity: 0.85;
`;
