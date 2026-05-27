import styled from '@emotion/styled';
import { useQuery } from '@tanstack/react-query';
import { createFileRoute, redirect, useParams } from '@tanstack/react-router';
import { queries } from '@/apis/queries';
import { useDevice } from '@/hooks/useDevice';
import MobileReviewsContent from '@/pages/challenge/review/components/MobileReviewsContent';
import MyReviewSection from '@/pages/challenge/review/components/MyReviewSection';
import PCReviewsContent from '@/pages/challenge/review/components/PCReviewsContent';
import { useReviewsPagination } from '@/pages/challenge/review/hooks/useReviewsPagination';
import { compareDates } from '@/utils/date';

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
  beforeLoad: async ({ context, params }) => {
    const challengeInfo = await context.queryClient.fetchQuery(
      queries.challengesInfo(Number(params.challengeId)),
    );
    if (compareDates(new Date(challengeInfo.endDate), new Date()) > 0) {
      throw redirect({
        to: '/challenge/$challengeId/daily',
        params: { challengeId: params.challengeId },
      });
    }
  },
  component: ChallengeReview,
});

function ChallengeReview() {
  const { challengeId } = useParams({
    from: '/_bombom/_main/challenge/$challengeId/review',
  });

  const device = useDevice();
  const isMobile = device === 'mobile';
  const challengeIdNumber = Number(challengeId);

  const { baseQueryParams, changePage, page } = useReviewsPagination({
    challengeId: challengeIdNumber,
  });

  const { data: myReview, isLoading: isMyReviewLoading } = useQuery(
    queries.reviews.me(challengeIdNumber),
  );

  return (
    <Container>
      <ContentWrapper isMobile={isMobile}>
        {!isMyReviewLoading && (
          <MyReviewSection
            challengeId={challengeIdNumber}
            myReview={myReview}
          />
        )}
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
