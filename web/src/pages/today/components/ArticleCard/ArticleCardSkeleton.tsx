import styled from '@emotion/styled';
import {
  Container,
  InfoWrapper,
  MetaInfoRow,
  ThumbnailWrapper,
} from './ArticleCard';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const ArticleCardSkeleton = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <SkeletonContainer isMobile={isMobile} as={Container}>
      <SkeletonInfoWrapper as={InfoWrapper}>
        <Skeleton width="85%" height={isMobile ? '1.25rem' : '1.75rem'} />
        <Skeleton width="100%" height="1rem" />
        <SkeletonMetaInfoRow as={MetaInfoRow}>
          <Skeleton width="3.75rem" height="0.75rem" />
          <Skeleton width="3.75rem" height="0.75rem" />
          <Skeleton width="3.75rem" height="0.75rem" />
        </SkeletonMetaInfoRow>
      </SkeletonInfoWrapper>
      <SkeletonThumbnailWrapper as={ThumbnailWrapper}>
        <Skeleton
          width={isMobile ? '4rem' : '7.875rem'}
          height={isMobile ? '4rem' : '7.875rem'}
          borderRadius="0.75rem"
        />
      </SkeletonThumbnailWrapper>
    </SkeletonContainer>
  );
};

export default ArticleCardSkeleton;

const SkeletonContainer = styled.div<{ isMobile: boolean }>`
  border-bottom: none;

  ${({ isMobile }) => isMobile && `box-shadow: none`}
`;

const SkeletonInfoWrapper = styled.div``;

const SkeletonMetaInfoRow = styled.div``;

const SkeletonThumbnailWrapper = styled.div``;
