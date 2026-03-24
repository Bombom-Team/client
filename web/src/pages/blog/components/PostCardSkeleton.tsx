import styled from '@emotion/styled';
import { Container, ContentWrapper, MetaInfo } from './PostCard';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const PostCardSkeleton = () => {
  const device = useDevice();

  return (
    <SkeletonContainer as={Container}>
      <Skeleton
        width="100%"
        height={device === 'mobile' ? '180px' : '216px'}
        borderRadius="16px"
      />

      <ContentWrapper>
        <Skeleton width="88%" height={device === 'mobile' ? '28px' : '32px'} />
        <Skeleton width="100%" height={device === 'mobile' ? '20px' : '24px'} />
        <MetaInfo>
          <Skeleton width="72px" height="16px" />
          <Skeleton width="56px" height="16px" />
        </MetaInfo>
      </ContentWrapper>
    </SkeletonContainer>
  );
};

export default PostCardSkeleton;

const SkeletonContainer = styled.div`
  pointer-events: none;
`;
