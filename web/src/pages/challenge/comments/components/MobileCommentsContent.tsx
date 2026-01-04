import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import AllCommentsSection from './AllCommentsSection';
import { queries } from '@/apis/queries';
import type { GetChallengeCommentsParams } from '@/apis/challenge/challenge.api';

interface MobileCommentsContentProps {
  baseQueryParams: GetChallengeCommentsParams;
  resetPage: () => void;
}

const MobileCommentsContent = ({
  baseQueryParams,
  resetPage,
}: MobileCommentsContentProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: infiniteComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(queries.infiniteComments(baseQueryParams));

  const commentList =
    infiniteComments?.pages.flatMap((page) => page?.content || []) || [];

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    resetPage();
  }, [baseQueryParams.start, baseQueryParams.end, resetPage]);

  return (
    <Container>
      <AllCommentsSection comments={commentList} isLoading={isLoading}>
        <LoadMoreTrigger ref={loadMoreRef} />
        {isFetchingNextPage && <LoadingMessage>로딩 중...</LoadingMessage>}
      </AllCommentsSection>
    </Container>
  );
};

export default MobileCommentsContent;

const Container = styled.section`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
`;

const LoadingMessage = styled.div`
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
