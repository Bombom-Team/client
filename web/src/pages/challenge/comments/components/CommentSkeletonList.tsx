import styled from '@emotion/styled';
import CommentCardSkeleton from './CommentCardSkeleton';
import { useDevice } from '@/hooks/useDevice';

interface CommentSkeletonListProps {
  count: number;
}

const CommentSkeletonList = ({ count }: CommentSkeletonListProps) => {
  const device = useDevice();
  const isMobile = device === 'mobile';

  return (
    <Container isMobile={isMobile}>
      {Array.from({ length: count }).map((_, index) => (
        <CommentCardSkeleton key={`comment-card-skeleton-${index}`} />
      ))}
    </Container>
  );
};

export default CommentSkeletonList;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
`;
