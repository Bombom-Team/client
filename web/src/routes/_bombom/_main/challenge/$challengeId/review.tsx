import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import MobileReviewsContent from '@/pages/challenge/review/components/MobileReviewsContent';
import PCReviewsContent from '@/pages/challenge/review/components/PCReviewsContent';
import ReviewCard from '@/pages/challenge/review/components/ReviewCard';
import ReviewWriter from '@/pages/challenge/review/components/ReviewWriter';
import { useReviewsPagination } from '@/pages/challenge/review/hooks/useReviewsPagination';

export const Route = createFileRoute(
  '/_bombom/_main/challenge/$challengeId/review',
)({
  head: () => ({
    meta: [
      {
        title: '봄봄 | 챌린지 리뷰',
      },
    ],
  }),
  component: ChallengeReview,
});

function ChallengeReview() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/review',
  });

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { baseQueryParams, changePage, page } = useReviewsPagination({
    challengeId: Number(challengeId),
  });

  const { data: myReview, isLoading: isMyReviewLoading } = useQuery(
    queries.reviews.me(Number(challengeId)),
  );

  const [isEditing, setIsEditing] = useState(false);

  const renderWriterSection = () => {
    if (isMyReviewLoading) return null;

    if (myReview && !isEditing) {
      return (
        <MyReviewSection>
          <SectionTitle>내가 남긴 리뷰</SectionTitle>
          <ReviewCard
            {...myReview}
            isMyReview={true}
            onEdit={() => setIsEditing(true)}
          />
        </MyReviewSection>
      );
    }

    if (isEditing && myReview) {
      return (
        <ReviewWriter
          challengeId={Number(challengeId)}
          mode="edit"
          reviewId={myReview.reviewId}
          initialComment={myReview.comment}
          initialIsPrivate={myReview.isPrivate}
          onSubmit={() => setIsEditing(false)}
        />
      );
    }

    return <ReviewWriter challengeId={Number(challengeId)} mode="create" />;
  };

  return (
    <Container>
      <ContentWrapper isMobile={isMobile}>
        {renderWriterSection()}
        {isMobile ? (
          <MobileReviewsContent baseQueryParams={baseQueryParams} />
        ) : (
          <PCReviewsContent
            baseQueryParams={baseQueryParams}
            page={page}
            onPageChange={changePage}
          />
        )}
      </ContentWrapper>
    </Container>
  );
}

const Container = styled.section`
  width: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ContentWrapper = styled.div<{ isMobile: boolean }>`
  width: 100%;
  padding: ${({ isMobile }) => (isMobile ? '20px 0' : '24px')};

  display: flex;
  gap: ${({ isMobile }) => (isMobile ? '32px' : '44px')};
  flex-direction: column;

  background-color: ${({ theme, isMobile }) =>
    isMobile ? 'none' : theme.colors.backgroundHover};
`;

const MyReviewSection = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const SectionTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;
