import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import AllCommentsSection from './AllCommentsSection';
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

const PCCommentsContent = ({
  baseQueryParams,
  onPageChange,
  page,
  resetPage,
}: PCCommentsContentProps) => {
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

      <AllCommentsSection comments={commentList} isLoading={isLoading}>
        <Pagination
          currentPage={page}
          totalPages={comments?.totalPages ?? 1}
          onPageChange={onPageChange}
        />
      </AllCommentsSection>
    </Container>
  );
};

export default PCCommentsContent;

const Container = styled.section`
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
