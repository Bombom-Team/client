import styled from '@emotion/styled';
import { useState } from 'react';
import ReviewCard from './ReviewCard';
import ReviewWriter from './ReviewWriter';
import type { ChallengeReview } from '@/apis/challenge/challenge.api';

interface MyReviewSectionProps {
  challengeId: number;
  myReview?: ChallengeReview | null;
}

const MyReviewSection = ({ challengeId, myReview }: MyReviewSectionProps) => {
  const [isEditing, setIsEditing] = useState(false);

  if (myReview && !isEditing) {
    return (
      <Container>
        <Title>내가 남긴 리뷰</Title>
        <ReviewCard
          {...myReview}
          isMyReview={true}
          onEdit={() => setIsEditing(true)}
        />
      </Container>
    );
  }

  return (
    <ReviewWriter
      challengeId={challengeId}
      mode={myReview ? 'edit' : 'create'}
      reviewId={myReview?.reviewId}
      initialComment={myReview?.comment}
      initialIsPrivate={myReview?.isPrivate}
      onSubmit={() => setIsEditing(false)}
    />
  );
};

export default MyReviewSection;

const Container = styled.article`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.h3`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t7Bold};
`;
