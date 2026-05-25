import styled from '@emotion/styled';
import { useState } from 'react';
import { REVIEW_VALIDATION } from '../constants/review';
import useAddReviewMutation from '../hooks/useAddReviewMutation';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import { useDevice } from '@/hooks/useDevice';
import type { ChangeEvent } from 'react';

interface ReviewWriterProps {
  challengeId: number;
}

const ReviewWriter = ({ challengeId }: ReviewWriterProps) => {
  const [comment, setComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { mutate: addReview, isPending } = useAddReviewMutation({
    challengeId,
    onSuccess: () => {
      setComment('');
      setIsPrivate(false);
    },
  });

  const handleReviewChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= REVIEW_VALIDATION.maxLength) {
      setComment(value);
    }
  };

  const handleSubmit = () => {
    if (comment.length >= REVIEW_VALIDATION.minLength) {
      addReview({ comment, isPrivate });
    }
  };

  return (
    <Container isMobile={isMobile}>
      <Title isMobile={isMobile}>챌린지 리뷰 남기기</Title>
      <Checkbox
        id="private-review"
        checked={isPrivate}
        onChange={() => setIsPrivate((prev) => !prev)}
      >
        <Text color="textTertiary" font="t5Regular">
          비밀글
        </Text>
      </Checkbox>
      <Flex gap={8} direction="column">
        <Textarea
          isMobile={isMobile}
          value={comment}
          onChange={handleReviewChange}
          placeholder={`챌린지에서 좋았던 점이나 아쉬웠던 점을 자유롭게 남겨주세요. (최소 ${REVIEW_VALIDATION.minLength}자)`}
          maxLength={REVIEW_VALIDATION.maxLength}
        />
        <Flex justify="space-between" align="flex-start">
          <Text
            color="textTertiary"
            font={isMobile ? 't3Regular' : 't4Regular'}
          >
            {comment.length}/{REVIEW_VALIDATION.maxLength}
          </Text>
          <SubmitButton
            onClick={handleSubmit}
            disabled={comment.length < REVIEW_VALIDATION.minLength || isPending}
            isMobile={isMobile}
          >
            등록
          </SubmitButton>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ReviewWriter;

const Container = styled.article<{ isMobile: boolean }>`
  width: 100%;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const Title = styled.h3<{ isMobile: boolean }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t6Bold : theme.fonts.t7Bold};
`;

const Textarea = styled.textarea<{ isMobile: boolean }>`
  width: 100%;
  min-height: ${({ isMobile }) => (isMobile ? '100px' : '120px')};
  padding: 12px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t4Regular : theme.fonts.t5Regular};

  box-sizing: border-box;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primaryBomBom};
  }
`;

const SubmitButton = styled(Button)<{ isMobile: boolean }>`
  padding: ${({ isMobile }) => (isMobile ? '8px 16px' : '10px 20px')};
  font: ${({ isMobile, theme }) =>
    isMobile ? theme.fonts.t4Bold : theme.fonts.t5Bold};

  &:disabled {
    background-color: ${({ theme }) => theme.colors.stroke};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;
