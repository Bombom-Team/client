import styled from '@emotion/styled';
import ReviewCard from './ReviewCard';
import { useDevice } from '@/hooks/useDevice';
import type { Review } from '../types/review';
import type { PropsWithChildren } from 'react';

interface AllReviewsSectionProps {
  reviews: Review[];
  isLoading: boolean;
}

const AllReviewsSection = ({
  reviews,
  isLoading,
  children,
}: PropsWithChildren<AllReviewsSectionProps>) => {
  const device = useDevice();
  const isMobile = device === 'mobile';
  const isEmpty = !isLoading && reviews.length === 0;

  return (
    <Container>
      <Title>리뷰 목록</Title>

      {isLoading ? (
        <EmptyState isMobile={isMobile}>로딩 중...</EmptyState>
      ) : isEmpty ? (
        <EmptyState isMobile={isMobile}>
          아직 작성된 리뷰가 없어요. 첫 번째 리뷰를 남겨보세요!
        </EmptyState>
      ) : (
        <>
          <CardList isMobile={isMobile}>
            {reviews.map((review) => (
              <ReviewCard key={review.reviewId} {...review} />
            ))}
          </CardList>
          {children}
        </>
      )}
    </Container>
  );
};

export default AllReviewsSection;

const Container = styled.section`
  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t6Bold};
`;

const CardList = styled.div<{ isMobile: boolean }>`
  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '8px' : '12px')};
  flex-direction: column;
`;

const EmptyState = styled.div<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '24px' : '32px')};
  border-radius: 12px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textSecondary};
  font: ${({ theme }) => theme.fonts.t5Regular};
  text-align: center;
`;
