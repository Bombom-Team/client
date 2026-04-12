import { Container, ProgressCaption, ProgressGauge } from './ProgressBar';
import SkeletonBox from '../Skeleton/Skeleton';

interface ProgressBarSkeletonProps {
  hasCaption?: boolean;
}

const ProgressBarSkeleton = ({ hasCaption }: ProgressBarSkeletonProps) => {
  return (
    <Container>
      <SkeletonBox
        width="100%"
        height="100%"
        borderRadius="0.625rem"
        as={ProgressGauge}
      />
      {hasCaption && (
        <SkeletonBox
          width="1.5rem"
          height="0.75rem"
          justifySelf="flex-end"
          marginTop="0.125rem"
          as={ProgressCaption}
        />
      )}
    </Container>
  );
};

export default ProgressBarSkeleton;
