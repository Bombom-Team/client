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
          width={device === 'mobile' ? '7.5rem' : '9rem'}
          height={device === 'mobile' ? '1.25rem' : '1.5rem'}
        />

        <DescriptionBox>
          <Skeleton
            width="100%"
            height={device === 'mobile' ? '2.75rem' : '3.5rem'}
          />
          <Skeleton
            width="72%"
            height={device === 'mobile' ? '1.5rem' : '1.75rem'}
          />
        </DescriptionBox>

        <Skeleton
          width={device === 'mobile' ? '6rem' : '5.5rem'}
          height={device === 'mobile' ? '1.375rem' : '1.125rem'}
        />
      </SkeletonContentWrapper>
    </Container>
  );
};

export default FeaturedPostSkeleton;

const SkeletonContentWrapper = styled(ContentWrapper)`
  gap: ${({ device }) => (device === 'mobile' ? '1rem' : '2.5rem')};
`;
