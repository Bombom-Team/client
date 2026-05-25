import styled from '@emotion/styled';
import { useState } from 'react';
import { REVIEW_VALIDATION } from '../constants/review';
import useAddReviewMutation from '../hooks/useAddReviewMutation';
import Button from '@/components/Button/Button';
import Checkbox from '@/components/Checkbox/Checkbox';
import Flex from '@/components/Flex/Flex';
import Text from '@/components/Text/Text';
import type { ChangeEvent } from 'react';

interface ReviewWriterProps {
  challengeId: number;
}

const ReviewWriter = ({ challengeId }: ReviewWriterProps) => {
  const [comment, setComment] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showError, setShowError] = useState(false);

  const { mutate: addReview } = useAddReviewMutation({
    challengeId,
    onSuccess: () => {
      setComment('');
      setIsPrivate(false);
      setShowError(false);
    },
  });

  const handleReviewChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length >= REVIEW_VALIDATION.minLength) {
      setShowError(false);
    }
    setComment(value);
  };

  const handleSubmit = () => {
    if (comment.length < REVIEW_VALIDATION.minLength) {
      setShowError(true);
      return;
    }

    addReview({ comment, isPrivate });
  };

  return (
    <Container>
      <Title>챌린지 리뷰 남기기</Title>
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
          isError={showError}
          value={comment}
          onChange={handleReviewChange}
          placeholder={`챌린지에서 좋았던 점이나 아쉬웠던 점을 자유롭게 남겨주세요. (최소 ${REVIEW_VALIDATION.minLength}자)`}
          maxLength={REVIEW_VALIDATION.maxLength}
        />
        <Flex justify="space-between" align="flex-start">
          <Text color={showError ? 'error' : 'textSecondary'} font="t4Regular">
            {comment.length}/{REVIEW_VALIDATION.maxLength}
          </Text>
          <Flex direction="column" gap={4} align="flex-end">
            <Text
              color={showError ? 'error' : 'textSecondary'}
              font="t4Regular"
            >
              {showError
                ? `최소 ${REVIEW_VALIDATION.minLength}자 이상 입력해주세요`
                : `최소 ${REVIEW_VALIDATION.minLength}자 이상`}
            </Text>
            <SubmitButton onClick={handleSubmit}>등록</SubmitButton>
          </Flex>
        </Flex>
      </Flex>
    </Container>
  );
};

export default ReviewWriter;

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

const Textarea = styled.textarea<{ isError: boolean }>`
  width: 100%;
  min-height: 120px;
  padding: 12px;
  border: 1px solid
    ${({ theme, isError }) =>
      isError ? theme.colors.error : theme.colors.stroke};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.t5Regular};

  box-sizing: border-box;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, isError }) =>
      isError ? theme.colors.error : theme.colors.primaryBomBom};
  }
`;

const SubmitButton = styled(Button)`
  padding: 10px 20px;
  font: ${({ theme }) => theme.fonts.t5Bold};
`;
