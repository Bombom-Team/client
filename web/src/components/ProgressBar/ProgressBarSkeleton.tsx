import { Container, ProgressCaption, ProgressGauge } from './ProgressBar';
import SkeletonBox from '../Skeleton/Skeleton';

interface ProgressBarSkeletonProps {
  hasCaption?: boolean;
}

const ProgressBarSkeleton = ({ hasCaption }: ProgressBarSkeletonProps) => {
  return (
    <Container hasCaption={Boolean(hasCaption)}>
      <SkeletonBox
        width="100%"
        height={hasCaption ? '10px' : '100%'}
        borderRadius="10px"
        as={ProgressGauge}
      />
      {hasCaption && (
        <SkeletonBox
          width="24px"
          height="12px"
          justifySelf="flex-end"
          marginTop="2px"
          as={ProgressCaption}
        />
      )}
    </Container>
  );
};

export default ProgressBarSkeleton;
