import styled from '@emotion/styled';
import { useState } from 'react';
import { useSubmitDailyGuideCommentMutation } from '../../index/hooks/useSubmitDailyGuideComment';
import Button from '@/components/Button/Button';
import { useDevice } from '@/hooks/useDevice';

const MAX_LENGTH = 1000;

interface DailyGuideCommentSectionProps {
  challengeId: number;
}

const DailyGuideComment = ({ challengeId }: DailyGuideCommentSectionProps) => {
  const [comment, setComment] = useState('');

  const device = useDevice();
  const isMobile = device === 'mobile';

  const { mutate: submitComment } = useSubmitDailyGuideCommentMutation({
    challengeId: Number(challengeId),
  });

  return (
    <CommentSection>
      <CommentLabelWrapper>
        <CommentLabel>답변 작성</CommentLabel>
        <CharCount>
          {comment.length} / {MAX_LENGTH}
        </CharCount>
      </CommentLabelWrapper>
      <CommentInputWrapper>
        <CommentTextarea
          isMobile={isMobile}
          placeholder="데일리 가이드의 질문에 대한 답변을 입력해주세요."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={MAX_LENGTH}
          rows={4}
        />
      </CommentInputWrapper>
      <SubmitButton
        variant="filled"
        onClick={() => submitComment(comment)}
        disabled={!comment.trim()}
      >
        제출하기
      </SubmitButton>
    </CommentSection>
  );
};

export default DailyGuideComment;

const CommentSection = styled.div`
  width: 100%;
  padding-top: 8px;

  display: flex;
  gap: 12px;
  flex-direction: column;
`;

const CommentLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CommentLabel = styled.label`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme }) => theme.fonts.heading6};
`;

const CharCount = styled.span`
  color: ${({ theme }) => theme.colors.textTertiary};
  font: ${({ theme }) => theme.fonts.body3};
`;

const CommentInputWrapper = styled.div`
  width: 100%;

  display: flex;
  flex-direction: column;
`;

const CommentTextarea = styled.textarea<{ isMobile: boolean }>`
  width: 100%;
  height: 120px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.stroke};
  border-radius: 8px;

  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, isMobile }) =>
    isMobile ? theme.fonts.body2 : theme.fonts.body1};

  resize: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const SubmitButton = styled(Button)`
  padding: 12px 24px;
  border-radius: 8px;

  align-self: flex-end;

  font: ${({ theme }) => theme.fonts.body2};
`;
