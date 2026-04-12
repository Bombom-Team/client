import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import Badge from '@/components/Badge/Badge';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { useDevice } from '@/hooks/useDevice';
import { formatDate } from '@/utils/date';
import type { components } from '@/types/openapi';
import type { ComponentProps } from 'react';
import ClockIcon from '#/assets/svg/clock.svg';
import DeleteIcon from '#/assets/svg/delete.svg';

type ReadVariant = 'transparent' | 'badge';

interface ArticleCardProps extends ComponentProps<typeof Link> {
  data: components['schemas']['ArticleResponse'];
  readVariant?: ReadVariant;
  onDelete?: () => void;
}

const ArticleCard = ({
  data,
  readVariant = 'transparent',
  to,
  onDelete,
  ...props
}: ArticleCardProps) => {
  const {
    articleId,
    title,
    contentsSummary,
    arrivedDateTime,
    thumbnailUrl,
    expectedReadTime,
    isRead,
    newsletter,
  } = data;
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container
      isRead={isRead ?? false}
      readVariant={readVariant}
      isMobile={isMobile}
      to={to ?? `/articles/${articleId}`}
      {...props}
    >
      <InfoWrapper isMobile={isMobile}>
        <Title isMobile={isMobile}>{title}</Title>
        <Description isMobile={isMobile}>
          {contentsSummary || title}
        </Description>
        <MetaInfoRow isMobile={isMobile}>
          <MetaInfoText>from {newsletter?.name ?? ''}</MetaInfoText>
          <MetaInfoText>
            {formatDate(new Date(arrivedDateTime ?? ''))}
          </MetaInfoText>
          <ReadTimeBox>
            <ClockIcon width={16} height={16} />
            <MetaInfoText>{`${expectedReadTime}분`}</MetaInfoText>
          </ReadTimeBox>
        </MetaInfoRow>
      </InfoWrapper>
      <ThumbnailWrapper isMobile={isMobile}>
        <Thumbnail
          isMobile={isMobile}
          src={thumbnailUrl ?? newsletter?.imageUrl ?? ''}
          alt="아티클 썸네일"
        />
        {isRead && readVariant === 'badge' && (
          <ReadingBadge
            text="읽음"
            variant="outlinePrimary"
            isMobile={isMobile}
          />
        )}
      </ThumbnailWrapper>
      {!isMobile && (
        <DeleteButton
          onClick={(e) => {
            e.preventDefault();
            onDelete?.();
          }}
          isMobile={isMobile}
        >
          <DeleteIcon width={20} height={20} />
        </DeleteButton>
      )}
    </Container>
  );
};

export default ArticleCard;

export const Container = styled(Link, {
  shouldForwardProp: (prop) =>
    prop !== 'isRead' && prop !== 'readVariant' && prop !== 'isMobile',
})<{
  isRead: boolean;
  readVariant: ReadVariant;
  isMobile: boolean;
}>`
  position: relative;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '0.5rem 0' : '1.25rem')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0.5rem' : '0.75rem')};
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: inherit;

  box-sizing: border-box;

  opacity: ${({ isRead, readVariant }) =>
    isRead && readVariant === 'transparent' ? 0.5 : 1};

  text-decoration: none;

  ${({ isMobile, isRead, theme }) =>
    !isMobile &&
    `
    border-bottom: ${isRead ? '0' : '0.25rem'} solid ${theme.colors.primary};
    border-radius: 1.25rem;
    box-shadow: 0 1.25rem 1.5625rem -0.3125rem rgb(0 0 0 / 10%);
  `};

  &:hover button {
    opacity: 1;
    pointer-events: auto;
  }
`;

export const InfoWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0.5rem' : '0.75rem')};
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.h2<{ isMobile: boolean }>`
  overflow: hidden;
  min-height: fit-content;

  display: -webkit-box;

  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body1 : theme.fonts.heading4};
  font-weight: 600;

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const Description = styled.p<{ isMobile: boolean }>`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
`;

export const MetaInfoRow = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '0.375rem' : '0.5rem')};
  flex-wrap: ${({ isMobile }) => (isMobile ? 'wrap' : 'nowrap')};
  align-items: center;
`;

export const MetaInfoText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.caption};
`;

const ReadTimeBox = styled.div`
  display: flex;
  gap: 0.25rem;
  align-items: center;
`;

export const ThumbnailWrapper = styled.div<{ isMobile: boolean }>`
  position: relative;
  flex-shrink: 0;
`;

export const Thumbnail = styled(ImageWithFallback, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '4rem' : '7.875rem')};
  border-radius: ${({ isMobile }) => (isMobile ? '0.5rem' : '0.75rem')};

  flex-shrink: 0;
  align-self: stretch;

  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const ReadingBadge = styled(Badge)<{ isMobile: boolean }>`
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  padding: ${({ isMobile }) =>
    isMobile ? '0.125rem 0.25rem' : '0.25rem 0.5rem'};
`;

const DeleteButton = styled.button<{ isMobile: boolean }>`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? '1.5rem' : '2.25rem')};
  right: ${({ isMobile }) => (isMobile ? '4.5rem' : '9.625rem')};
  width: 1.75rem;
  height: 1.75rem;

  color: ${({ theme }) => theme.colors.error};

  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.85;
  }
`;
