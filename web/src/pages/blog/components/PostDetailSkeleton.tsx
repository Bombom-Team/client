import styled from '@emotion/styled';
import {
  ActionRail,
  ContentLayoutWrapper,
  ContentWrapper,
  ThumbnailBox,
} from './PostDetail';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';

const PostDetailSkeleton = () => {
  const device = useDevice();

  return (
    <ContentWrapper device={device}>
      <ContentLayoutWrapper device={device}>
        {device === 'pc' && <ActionRail />}

        <ArticleLayout device={device}>
          <Skeleton width="128px" height="18px" />

          <TitleWrapper>
            <Skeleton
              width="100%"
              height={device === 'mobile' ? '40px' : '56px'}
            />
            <Skeleton
              width="72%"
              height={device === 'mobile' ? '40px' : '56px'}
            />
          </TitleWrapper>

          <MetaWrapper>
            <Skeleton width="88px" height="28px" borderRadius="12px" />
            <Skeleton width="96px" height="18px" />
            <Skeleton width="56px" height="18px" />
          </MetaWrapper>

          <ThumbnailBox device={device}>
            <Skeleton width="100%" height="100%" />
          </ThumbnailBox>

          <BodyWrapper>
            <Skeleton width="100%" height="24px" />
            <Skeleton width="92%" height="24px" />
            <Skeleton width="96%" height="24px" />
            <Skeleton width="88%" height="24px" />
            <Skeleton width="100%" height="24px" />
            <Skeleton width="78%" height="24px" />
          </BodyWrapper>
        </ArticleLayout>
      </ContentLayoutWrapper>
    </ContentWrapper>
  );
};

export default PostDetailSkeleton;

const ArticleLayout = styled.div<{ device: Device }>`
  width: 100%;
  margin-top: ${({ device }) => (device === 'mobile' ? '0' : '60px')};

  display: flex;
  gap: ${({ device }) => (device === 'mobile' ? '24px' : '32px')};
  flex-direction: column;
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const MetaWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const BodyWrapper = styled.div`
  display: flex;
  gap: 16px;
  flex-direction: column;
`;
