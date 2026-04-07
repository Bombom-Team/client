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
        <Skeleton width="128px" height="18px" />

        <Flex direction="column" gap={12}>
          <Skeleton
            width="100%"
            height={device === 'mobile' ? '40px' : '56px'}
          />
          <Skeleton
            width="72%"
            height={device === 'mobile' ? '40px' : '56px'}
          />
        </Flex>

        <Flex gap={12} align="center">
          <Skeleton width="88px" height="28px" borderRadius="12px" />
          <Skeleton width="96px" height="18px" />
          <Skeleton width="56px" height="18px" />
        </Flex>

        <ThumbnailBox device={device}>
          <Skeleton width="100%" height="100%" />
        </ThumbnailBox>

        <Flex direction="column" gap={16}>
          <Skeleton width="100%" height="24px" />
          <Skeleton width="92%" height="24px" />
          <Skeleton width="96%" height="24px" />
          <Skeleton width="88%" height="24px" />
          <Skeleton width="100%" height="24px" />
          <Skeleton width="78%" height="24px" />
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
  padding: ${({ device }) => (device === 'mobile' ? '0' : '0 24px')};
  padding-bottom: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};

  display: flex;
  gap: ${({ device }) => (device === 'pc' ? '40px' : '0')};
  align-items: flex-start;
`;

const ArticleSkeleton = styled.div<{ device: Device }>`
  width: 100%;
  margin-top: ${({ device }) => (device === 'mobile' ? '0' : '60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
`;

const ActionRail = styled.div`
  width: 56px;
  flex-shrink: 0;
`;
