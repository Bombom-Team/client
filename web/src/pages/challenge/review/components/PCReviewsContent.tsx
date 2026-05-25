import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import AllReviewsSection from './AllReviewsSection';
import { queries } from '@/apis/queries';
import Pagination from '@/components/Pagination/Pagination';
import type { GetChallengeReviewsPageParams } from '@/apis/challenge/challenge.api';

interface PCReviewsContentProps {
  baseQueryParams: GetChallengeReviewsPageParams;
  page: number;
  onPageChange: (page: number) => void;
}

const PCReviewsContent = ({
  baseQueryParams,
  page,
  onPageChange,
}: PCReviewsContentProps) => {
  const queryParams = {
    ...baseQueryParams,
    page: (baseQueryParams.page ?? 1) - 1,
  };

  const { data: reviews, isLoading } = useQuery(
    queries.reviews.pageList(queryParams),
  );
  const reviewList = reviews?.content || [];

  return (
    <Container>
      <AllReviewsSection reviews={reviewList} isLoading={isLoading}>
        <Pagination
          currentPage={page}
          totalPages={reviews?.totalPages ?? 1}
          onPageChange={onPageChange}
        />
      </AllReviewsSection>
    </Container>
  );
};

export default PCReviewsContent;

const Container = styled.section`
  display: flex;
  gap: 28px;
  flex-direction: column;
`;
