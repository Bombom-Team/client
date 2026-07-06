import Skeleton from '@/components/Skeleton/Skeleton';
import { useDevice } from '@/hooks/useDevice';

const CommentCardSkeleton = () => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Skeleton
      width="100%"
      height={isMobile ? '156px' : '172px'}
      borderRadius="12px"
    />
  );
};

export default CommentCardSkeleton;
