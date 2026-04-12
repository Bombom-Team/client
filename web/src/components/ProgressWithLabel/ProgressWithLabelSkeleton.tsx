import { Container, ProgressInfo } from './ProgressWithLabel';
import ProgressBarSkeleton from '../ProgressBar/ProgressBarSkeleton';
import Skeleton from '../Skeleton/Skeleton';

interface ProgressWithLabelSkeletonProps {
  hasShowGraph?: boolean;
  hasShowDescription?: boolean;
}

const ProgressWithLabelSkeleton = ({
  hasShowGraph = true,
  hasShowDescription = true,
}: ProgressWithLabelSkeletonProps) => {
  return (
    <Container>
      <ProgressInfo>
        <Skeleton width="5rem" height="1rem" />
        <Skeleton width="1.5rem" height="1rem" marginLeft="auto" />
      </ProgressInfo>
      {hasShowGraph && <ProgressBarSkeleton />}
      {hasShowDescription && <Skeleton width="6.25rem" height="0.875rem" />}
    </Container>
  );
};

export default ProgressWithLabelSkeleton;
