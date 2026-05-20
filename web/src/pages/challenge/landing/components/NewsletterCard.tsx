import { theme } from '@bombom/shared';
import styled from '@emotion/styled';
import { useNavigate } from '@tanstack/react-router';
import { type MouseEvent } from 'react';
import Badge from '@/components/Badge/Badge';
import Button from '@/components/Button/Button';
import Flex from '@/components/Flex';
import { useDevice, type Device } from '@/hooks/useDevice';
import type { components } from '@/types/openapi';
import CloseIcon from '#/assets/svg/close.svg';

interface NewsletterCardProps {
  newsletter: components['schemas']['NewsletterResponse'];
  onSelect: (newsletterId: number) => void;
  onCloseCard?: () => void;
  isFlipped?: boolean;
}

const NewsletterCard = ({
  newsletter,
  onSelect,
  onCloseCard,
  isFlipped = false,
}: NewsletterCardProps) => {
  const device = useDevice();
  const navigate = useNavigate();

  const handleCardClick = () => {
    onSelect(newsletter.newsletterId);
  };

  const handleCloseClick = (e: MouseEvent) => {
    e.stopPropagation();

    if (onCloseCard) {
      onCloseCard();
    }
  };

  const handleNavigateDetail = (e: MouseEvent) => {
    e.stopPropagation();
    navigate({
      to: '/newsletters/$newsletterId',
      params: { newsletterId: String(newsletter.newsletterId) },
    });
  };

  if (!newsletter) {
    return null;
  }

  return (
    <Container onClick={handleCardClick} isFlipped={isFlipped}>
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
        <CardBack device={device}>
          <BackContent device={device}>
            <Flex justify="space-between">
              <Flex direction="column" gap={8} justify="flex-start">
                <CategoryLabel device={device}>
                  {newsletter.category}
                </CategoryLabel>
                <NewsletterName device={device}>
                  {newsletter.name}
                </NewsletterName>
              </Flex>
              <CloseButton variant="transparent" onClick={handleCloseClick}>
                <CloseIcon
                  width={device === 'mobile' ? 32 : 44}
                  height={device === 'mobile' ? 32 : 44}
                  fill={theme.colors.black}
                />
              </CloseButton>
            </Flex>
            <NewsletterDescription device={device}>
              {newsletter.description}
            </NewsletterDescription>
          </BackContent>
          <SubscribeLink
            device={device}
            variant="transparent"
            onClick={handleNavigateDetail}
          >
            구독하러 가기 →
          </SubscribeLink>
        </CardBack>
      </CardInner>
    </Container>
  );
};

export default NewsletterCard;

const Container = styled.article<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;

  cursor: pointer;
  perspective: 1200px;

  ${({ isFlipped }) =>
    !isFlipped &&
    `
    &:hover > div {
      transform: translateY(-8px);
    }
  `}
`;

const CardInner = styled.div<{ isFlipped: boolean }>`
  position: relative;
  width: 100%;
  height: 100%;

  transform: ${({ isFlipped }) =>
    isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'};
  transform-style: preserve-3d;
  transition:
    transform 0.6s cubic-bezier(0.4, 0, 0.2, 1),
    translate 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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

  article:hover & {
    box-shadow:
      0 2px 4px rgb(0 0 0 / 4%),
      0 4px 12px rgb(0 0 0 / 8%),
      0 12px 24px rgb(0 0 0 / 12%),
      0 24px 48px rgb(0 0 0 / 16%);
  }
`;

const CardBack = styled(CardBase)<{ device: Device }>`
  overflow: hidden;
  padding: ${({ device }) => (device === 'mobile' ? '12px' : '32px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '8px' : '24px')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;

  background-color: ${({ theme }) => theme.colors.white};

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
  right: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  bottom: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  z-index: ${({ theme }) => theme.zIndex.content};
  padding: 6px 12px;
  border-radius: 24px;
  box-shadow:
    0 1px 3px rgb(0 0 0 / 6%),
    0 2px 8px rgb(0 0 0 / 4%),
    inset 0 0 0 1px rgb(0 0 0 / 4%);

  background: rgb(255 255 255 / 92%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t3Regular : theme.fonts.t5Regular};

  backdrop-filter: blur(8px);
`;

const NewsletterName = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t7Bold : theme.fonts.t10Bold};
`;

const CloseButton = styled(Button)`
  position: fixed;
  top: 8px;
  right: 8px;
  padding: 0;
`;

const NewsletterDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t6Regular : theme.fonts.t7Regular};
`;

const BackContent = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '4px' : '12px')};
  flex-direction: column;
  align-items: flex-start;
`;

const CategoryLabel = styled.span<{ device: Device }>`
  padding: 4px 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t5Regular : theme.fonts.t6Regular};

  opacity: 0.6;
`;

const SubscribeLink = styled(Button)<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '4px 0' : '12px 0')};
  border-top: 1px solid rgb(0 0 0 / 8%);
  border-radius: 0%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.t6Regular : theme.fonts.t7Regular};
  text-align: left;

  transition: opacity 0.2s ease;

  &:hover {
    background: none;
    opacity: 0.7;
  }

  &:hover span {
    transform: translateX(4px);
  }
`;
