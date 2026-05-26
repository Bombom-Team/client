import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import AllReviewsSection from './AllReviewsSection';
import { queries } from '@/apis/queries';
import type { getChallengeReviewsParams } from '@/apis/challenge/challenge.api';

interface MobileReviewsContentProps {
  baseQueryParams: getChallengeReviewsParams;
}

const MobileReviewsContent = ({
  baseQueryParams,
}: MobileReviewsContentProps) => {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: infiniteReviews,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery(queries.reviews.infiniteList(baseQueryParams));

  const reviewList =
    infiniteReviews?.pages.flatMap((page) => page?.content || []) || [];

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

  return (
    <Container>
      <AllReviewsSection reviews={reviewList} isLoading={isLoading}>
        <LoadMoreTrigger ref={loadMoreRef} />
        {isFetchingNextPage && <LoadingMessage>로딩 중...</LoadingMessage>}
      </AllReviewsSection>
    </Container>
  );
};

export default MobileReviewsContent;

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
  font: ${({ theme }) => theme.fonts.t5Regular};
`;
