import styled from '@emotion/styled';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';
import CommentCard from './CommentCard';
import { queries } from '@/apis/queries';
import type { GetChallengeCommentsParams } from '@/apis/challenge/challenge.api';

interface MobileCommentsContentProps {
  baseQueryParams: GetChallengeCommentsParams;
  resetPage: () => void;
}

export default function MobileCommentsContent({
  baseQueryParams,
  resetPage,
}: MobileCommentsContentProps) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data: infiniteComments,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isInfiniteLoading,
  } = useInfiniteQuery(queries.infiniteComments(baseQueryParams));

  const infiniteCommentsPages = infiniteComments?.pages || [];
  const commentList = infiniteCommentsPages.flatMap(
    (page) => page?.content || [],
  );

  const isContentsEmpty = !isInfiniteLoading && commentList.length === 0;

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
    <CommentSection>
      <Comments>
        <CommentTitle>내 코멘트</CommentTitle>
        {commentList.length > 0 && (
          <CardList>
            <CommentCard {...commentList[0]!} />
          </CardList>
        )}
      </Comments>

      <Comments>
        <CommentTitle>전체 코멘트</CommentTitle>
        {isInfiniteLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : isContentsEmpty ? (
          <EmptyState>
            아직 작성한 코멘트가 없어요. 가장 먼저 한 줄 평을 남겨보세요!
          </EmptyState>
        ) : (
          <>
            <CardList>
              {commentList.map((comment, index) => (
                <CommentCard
                  key={`comment-${comment.createdAt}-${index}`}
                  {...comment}
                />
              ))}
            </CardList>
            <LoadMoreTrigger ref={loadMoreRef} />
            {isFetchingNextPage && <LoadingSpinner>로딩 중...</LoadingSpinner>}
          </>
        )}
      </Comments>
    </CommentSection>
  );
}

const CommentSection = styled.article`
  display: flex;
  gap: 20px;
  flex-direction: column;
`;

const Comments = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CommentTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.body1};
`;

const CardList = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const EmptyState = styled.div`
  padding: 24px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body3};
  text-align: center;
`;

const LoadMoreTrigger = styled.div`
  width: 100%;
  height: 20px;
`;

const LoadingSpinner = styled.div`
  padding: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
`;
