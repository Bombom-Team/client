import styled from '@emotion/styled';
import { ThumbnailBox } from './PostDetail';
import Flex from '@/components/Flex';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const PostDetailSkeleton = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      {device === 'pc' && <ActionRail />}

      <ArticleSkeleton device={device}>
        <Skeleton width="8rem" height="1.125rem" />

        <Flex direction="column" gap={12}>
          <Skeleton
            width="100%"
            height={device === 'mobile' ? '2.5rem' : '3.5rem'}
          />
          <Skeleton
            width="72%"
            height={device === 'mobile' ? '2.5rem' : '3.5rem'}
          />
        </Flex>

        <Flex gap={12} align="center">
          <Skeleton width="5.5rem" height="1.75rem" borderRadius="0.75rem" />
          <Skeleton width="6rem" height="1.125rem" />
          <Skeleton width="3.5rem" height="1.125rem" />
        </Flex>

        <ThumbnailBox device={device}>
          <Skeleton width="100%" height="100%" />
        </ThumbnailBox>

        <Flex direction="column" gap={16}>
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="92%" height="1.5rem" />
          <Skeleton width="96%" height="1.5rem" />
          <Skeleton width="88%" height="1.5rem" />
          <Skeleton width="100%" height="1.5rem" />
          <Skeleton width="78%" height="1.5rem" />
        </Flex>
      </ArticleSkeleton>
    </Container>
  );
};

export default PostDetailSkeleton;

const Container = styled.div<{ device: Device }>`
  width: 100%;
  max-width: ${({ device }) => (device === 'pc' ? '920px' : '100%')};
  margin: 0 auto;
  padding: ${({ device }) => (device === 'mobile' ? '0' : '0 1.5rem')};
  padding-bottom: ${({ device }) => (device === 'mobile' ? '5rem' : '7.5rem')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '2.5rem' : '0')};
  align-items: flex-start;
`;

const ArticleSkeleton = styled.div<{ device: Device }>`
  width: 100%;
  margin-top: ${({ device }) => (device === 'mobile' ? '0' : '3.75rem')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '1.5rem' : '2rem')};
  flex-direction: column;
`;

const ActionRail = styled.div`
  width: 3.5rem;
  flex-shrink: 0;
`;
