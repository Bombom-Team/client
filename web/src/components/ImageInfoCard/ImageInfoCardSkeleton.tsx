import { Container, InfoBox } from './ImageInfoCard';
import Skeleton from '../Skeleton/Skeleton';

const ImageInfoCardSkeleton = () => {
  return (
    <Container>
      <Skeleton width="4rem" height="4rem" borderRadius="1rem" />
      <InfoBox>
        <Skeleton width="60%" height="1.25rem" />
        <Skeleton width="80%" height="1rem" />
      </InfoBox>
    </Container>
  );
};

export default ImageInfoCardSkeleton;
