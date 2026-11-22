import { useDevice } from '@bombom/shared/ui-web';
import styled from '@emotion/styled';
import { Link } from '@tanstack/react-router';
import ArticleBookmarkButton from '../ArticleBookmarkButton/ArticleBookmarkButton';
import Badge from '@/components/Badge/Badge';
import ImageWithFallback from '@/components/ImageWithFallback/ImageWithFallback';
import { formatDate } from '@/utils/date';
import type { components } from '@/types/openapi';
import type { ComponentProps } from 'react';
import ClockIcon from '#/assets/svg/clock.svg';
import DeleteIcon from '#/assets/svg/delete.svg';

type ReadVariant = 'transparent' | 'badge';

interface ArticleCardProps extends ComponentProps<typeof Link> {
  data: components['schemas']['ArticleResponse'];
  readVariant?: ReadVariant;
  canBookmark?: boolean;
  onDelete?: () => void;
}

const ArticleCard = ({
  data,
  readVariant = 'transparent',
  canBookmark = true,
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
    isBookmarked,
    newsletter,
  } = data;
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container
      isRead={isRead ?? false}
      readVariant={readVariant}
      isMobile={isMobile}
    >
      <InfoWrapper isMobile={isMobile}>
        <Title isMobile={isMobile}>
          <CardLink
            isMobile={isMobile}
            to={to ?? `/articles/${articleId}`}
            {...props}
          >
            {title}
          </CardLink>
        </Title>
        <Description>{contentsSummary || title}</Description>
        <MetaBottomRow>
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
          {canBookmark && (
            <ArticleBookmarkButton
              articleId={articleId}
              isBookmarked={isBookmarked ?? false}
            />
          )}
        </MetaBottomRow>
      </InfoWrapper>
      <ThumbnailWrapper>
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

export const Container = styled.div<{
  isRead: boolean;
  readVariant: ReadVariant;
  isMobile: boolean;
}>`
  position: relative;
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '8px 0' : '20px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  align-items: center;

  background-color: ${({ theme }) => theme.colors.white};
  color: inherit;

  box-sizing: border-box;
  isolation: isolate;

  opacity: ${({ isRead, readVariant }) =>
    isRead && readVariant === 'transparent' ? 0.5 : 1};

  ${({ isMobile, isRead, theme }) =>
    !isMobile &&
    `
    border-bottom: ${isRead ? '0' : '4px'} solid ${theme.colors.primaryBomBom};
    border-radius: 20px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 10%);
  `};

  &:hover button {
    opacity: 1;
    pointer-events: auto;
  }
`;

// 링크는 제목에 두고 ::after로 카드 전체를 덮어, 카드 어디를 눌러도 상세로 이동한다.
// 북마크·삭제 버튼은 링크 밖 형제 요소라 ::after보다 위에 둔다.
const CardLink = styled(Link, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  color: inherit;
  text-decoration: none;

  &::after {
    position: absolute;
    z-index: ${({ theme }) => theme.zIndex.content};
    border-radius: ${({ isMobile }) => (isMobile ? '0' : '20px')};

    content: '';
    inset: 0;
  }

  &:focus-visible {
    outline: none;
  }

  &:focus-visible::after {
    outline: 2px solid ${({ theme }) => theme.colors.primaryBomBom};
    outline-offset: 2px;
  }
`;

export const InfoWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  min-width: 0;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
  align-items: flex-start;
`;

export const Title = styled.h2<{ isMobile: boolean }>`
  overflow: hidden;
  min-height: fit-content;

  display: -webkit-box;

  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6SemiBold : theme.fonts.t10SemiBold};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
`;

export const Description = styled.p`
  overflow: hidden;

  display: -webkit-box;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow-wrap: anywhere;
`;

const MetaBottomRow = styled.div`
  width: 100%;

  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

export const MetaInfoRow = styled.div<{ isMobile: boolean }>`
  min-width: 0;

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '6px' : '8px')};
  flex-wrap: ${({ isMobile }) => (isMobile ? 'wrap' : 'nowrap')};
  align-items: center;
`;

export const MetaInfoText = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.t3Regular};
`;

const ReadTimeBox = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

export const ThumbnailWrapper = styled.div`
  position: relative;
  flex-shrink: 0;
`;

export const Thumbnail = styled(ImageWithFallback, {
  shouldForwardProp: (prop) => prop !== 'isMobile',
})<{ isMobile: boolean }>`
  width: ${({ isMobile }) => (isMobile ? '64px' : '126px')};
  border-radius: ${({ isMobile }) => (isMobile ? '8px' : '12px')};

  flex-shrink: 0;
  align-self: stretch;

  aspect-ratio: 1 / 1;
  object-fit: cover;
`;

const ReadingBadge = styled(Badge)<{ isMobile: boolean }>`
  position: absolute;
  top: 4px;
  right: 4px;
  padding: ${({ isMobile }) => (isMobile ? '2px 4px' : '4px 8px')};

  pointer-events: none;
`;

const DeleteButton = styled.button<{ isMobile: boolean }>`
  position: absolute;
  top: ${({ isMobile }) => (isMobile ? '24px' : '36px')};
  right: ${({ isMobile }) => (isMobile ? '72px' : '154px')};
  z-index: ${({ theme }) => theme.zIndex.elevated};
  width: 28px;
  height: 28px;

  color: ${({ theme }) => theme.colors.error};

  opacity: 0;
  transform: translateY(-50%);
  transition: opacity 0.2s ease-in-out;

  &:hover {
    opacity: 0.85;
  }
`;
