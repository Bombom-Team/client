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
    <Container device={device} onClick={handleCardClick} isFlipped={isFlipped}>
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

const Container = styled.article<{
  device: Device;
  isFlipped: boolean;
}>`
  position: relative;
  width: 100%;
  height: 100%;

  cursor: pointer;
  perspective: 75rem;

  ${({ isFlipped }) =>
    !isFlipped &&
    `
    &:hover > div {
      transform: translateY(-0.5rem);
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
  border-radius: 0.75rem;
  box-shadow:
    0 0.0625rem 0.125rem rgb(0 0 0 / 3%),
    0 0.125rem 0.375rem rgb(0 0 0 / 5%),
    0 0.5rem 1rem rgb(0 0 0 / 8%),
    0 1rem 2rem rgb(0 0 0 / 10%);

  backface-visibility: hidden;
  transition: box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    position: absolute;
    border: 1px solid rgb(0 0 0 / 4%);
    border-radius: 0.75rem;

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
      0 0.125rem 0.25rem rgb(0 0 0 / 4%),
      0 0.25rem 0.75rem rgb(0 0 0 / 8%),
      0 0.75rem 1.5rem rgb(0 0 0 / 12%),
      0 1.5rem 3rem rgb(0 0 0 / 16%);
  }
`;

const CardBack = styled(CardBase)<{ device: Device }>`
  overflow: hidden;
  padding: ${({ device }) => (device === 'mobile' ? '0.75rem' : '2rem')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '0.5rem' : '1.5rem')};
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
  right: ${({ device }) => (device === 'mobile' ? '0.5rem' : '0.75rem')};
  bottom: ${({ device }) => (device === 'mobile' ? '0.5rem' : '0.75rem')};
  z-index: ${({ theme }) => theme.zIndex.content};
  padding: 0.375rem 0.75rem;
  border-radius: 1.5rem;
  box-shadow:
    0 0.0625rem 0.1875rem rgb(0 0 0 / 6%),
    0 0.125rem 0.5rem rgb(0 0 0 / 4%),
    inset 0 0 0 0.0625rem rgb(0 0 0 / 4%);

  background: rgb(255 255 255 / 92%);
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body2};

  backdrop-filter: blur(0.5rem);
`;

const NewsletterName = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading4};
`;

const CloseButton = styled(Button)`
  position: fixed;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0;
`;

const NewsletterDescription = styled.p<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.bodyLarge};
`;

const BackContent = styled.div<{ device: Device }>`
  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '0.25rem' : '0.75rem')};
  flex-direction: column;
  align-items: flex-start;
`;

const CategoryLabel = styled.span<{ device: Device }>`
  padding: 0.25rem 0;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.body1};

  opacity: 0.6;
`;

const SubscribeLink = styled(Button)<{ device: Device }>`
  width: 100%;
  padding: ${({ device }) => (device === 'mobile' ? '0.25rem 0' : '0.75rem 0')};
  border-top: 1px solid rgb(0 0 0 / 8%);
  border-radius: 0%;

  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ device, theme }) =>
    device === 'mobile' ? theme.fonts.body3 : theme.fonts.bodyLarge};
  text-align: left;

  transition: opacity 0.2s ease;

  &:hover {
    background: none;
    opacity: 0.7;
  }

  &:hover span {
    transform: translateX(0.25rem);
  }
`;
