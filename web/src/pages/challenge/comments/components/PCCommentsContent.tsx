import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import CommentCard from './CommentCard';
import { queries } from '@/apis/queries';
import Pagination from '@/components/Pagination/Pagination';
import type { GetChallengeCommentsParams } from '@/apis/challenge/challenge.api';

interface PCCommentsContentProps {
  baseQueryParams: GetChallengeCommentsParams;
  onPageChange: (page: number) => void;
  page: number;
  resetPage: () => void;
}

export default function PCCommentsContent({
  baseQueryParams,
  onPageChange,
  page,
  resetPage,
}: PCCommentsContentProps) {
  const queryParams = {
    ...baseQueryParams,
    page: (baseQueryParams.page ?? 1) - 1,
  };

  const { data: comments, isLoading } = useQuery(queries.comments(queryParams));
  const commentList = comments?.content || [];

  useEffect(() => {
    resetPage();
  }, [baseQueryParams.start, baseQueryParams.end, resetPage]);

  return (
    <Container>
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
        {isLoading ? (
          <EmptyState>로딩 중...</EmptyState>
        ) : commentList.length > 0 ? (
          <>
            <CardList>
              {commentList.map((comment, index) => (
                <CommentCard
                  key={`comment-${comment.createdAt}-${index}`}
                  {...comment}
                />
              ))}
            </CardList>
            <Pagination
              currentPage={page}
              totalPages={comments?.totalPages ?? 1}
              onPageChange={onPageChange}
            />
          </>
        ) : (
          <EmptyState>
            아직 작성한 코멘트가 없어요. 가장 먼저 한 줄 평을 남겨보세요!
          </EmptyState>
        )}
      </Comments>
    </Container>
  );
}

const Container = styled.article`
  display: flex;
  gap: 28px;
  flex-direction: column;
`;

const Comments = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CommentTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const CardList = styled.div`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const EmptyState = styled.div`
  padding: 32px;
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.body2};
  text-align: center;
`;
