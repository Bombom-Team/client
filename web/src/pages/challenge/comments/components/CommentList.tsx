import styled from '@emotion/styled';
import CommentCard from './CommentCard';
import CommentEmptyState from './CommentEmptyState';
import CommentSkeletonList from './CommentSkeletonList';
import { useInfiniteComments } from '../hooks/useInfiniteComments';
import { useDevice } from '@/hooks/useDevice';

const NEXT_PAGE_SKELETON_COUNT = 1;

interface CommentListProps {
  challengeId: number;
  date: string;
  isToday: boolean;
}

const CommentList = ({ challengeId, date, isToday }: CommentListProps) => {
  const { comments, isEmpty, hasNextPage, isFetchingNextPage, loadMoreRef } =
    useInfiniteComments({ challengeId, date });

  const device = useDevice();
  const isMobile = device === 'mobile';

  if (isEmpty) {
    return (
      <CommentEmptyState>
        {isToday
          ? '아직 작성한 코멘트가 없어요. 가장 먼저 한 줄 코멘트를 남겨보세요!'
          : '작성된 코멘트가 없어요.'}
      </CommentEmptyState>
    );
  }

  return (
    <>
      <Container isMobile={isMobile}>
        {comments.map((comment) => (
          <CommentCard
            key={comment.commentId}
            {...comment}
            challengeId={challengeId}
          />
        ))}
      </Container>
      {isFetchingNextPage && (
        <CommentSkeletonList count={NEXT_PAGE_SKELETON_COUNT} />
      )}
      {hasNextPage && <LoadMoreTrigger ref={loadMoreRef} />}
    </>
  );
};

export default CommentList;

const Container = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 1px;
`;
