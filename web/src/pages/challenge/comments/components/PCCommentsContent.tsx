import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import AllCommentsSection from './AllCommentsSection';
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
