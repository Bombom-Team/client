import styled from '@emotion/styled';
import { Container, ContentWrapper, MetaInfo } from '../PostCard';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const PostCardSkeleton = () => {
  const device = useDevice();

  return (
    <SkeletonContainer as={Container}>
      <Skeleton
        width="100%"
        height={device === 'mobile' ? '11.25rem' : '13.5rem'}
        borderRadius="1rem"
      />

      <ContentWrapper>
        <Skeleton
          width="88%"
          height={device === 'mobile' ? '1.75rem' : '2rem'}
        />
        <Skeleton
          width="100%"
          height={device === 'mobile' ? '1.25rem' : '1.5rem'}
        />
        <MetaInfo>
          <Skeleton width="4.5rem" height="1rem" />
          <Skeleton width="3.5rem" height="1rem" />
        </MetaInfo>
      </ContentWrapper>
    </SkeletonContainer>
  );
};

export default PostCardSkeleton;

const SkeletonContainer = styled.div`
  pointer-events: none;
`;
