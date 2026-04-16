import styled from '@emotion/styled';
import {
  Container,
  ContentWrapper,
  DescriptionBox,
  Thumbnail,
} from '../FeaturedPost';
import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const FeaturedPostSkeleton = () => {
  const device = useDevice();

  return (
    <Container device={device}>
      <Thumbnail device={device}>
        <Skeleton width="100%" height="100%" />
      </Thumbnail>

      <SkeletonContentWrapper device={device}>
        <Skeleton
          width={device === 'mobile' ? '120px' : '144px'}
          height={device === 'mobile' ? '20px' : '24px'}
        />

        <DescriptionBox>
          <Skeleton
            width="100%"
            height={device === 'mobile' ? '44px' : '56px'}
          />
          <Skeleton
            width="72%"
            height={device === 'mobile' ? '24px' : '28px'}
          />
        </DescriptionBox>

        <Skeleton
          width={device === 'mobile' ? '96px' : '88px'}
          height={device === 'mobile' ? '22px' : '18px'}
        />
      </SkeletonContentWrapper>
    </Container>
  );
};

export default FeaturedPostSkeleton;

const SkeletonContentWrapper = styled(ContentWrapper)`
  gap: ${({ device }) => (device === 'mobile' ? '16px' : '40px')};
`;
