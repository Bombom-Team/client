import styled from '@emotion/styled';
import { useEffect, useRef } from 'react';
import { useDevice } from '@/hooks/useDevice';
import type { Device } from '@/hooks/useDevice';
import type { ChangeEvent } from 'react';

interface CommentWriterProps {
  comment: string;
  onCommentChange: (value: string) => void;
  minLength: number;
  maxLength: number;
  showError: boolean;
}

const CommentWriter = ({
  comment,
  onCommentChange,
  minLength,
  maxLength,
  showError,
}: CommentWriterProps) => {
  const device = useDevice();
  const commentAreaRef = useRef<HTMLTextAreaElement>(null);

  const handleCommentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= maxLength) {
      onCommentChange(value);
    }
  };

  useEffect(() => {
    if (showError && commentAreaRef.current) {
      commentAreaRef.current.focus();
    }
  }, [showError]);

  return (
    <Container>
      <Title device={device}>코멘트 작성</Title>
      <Comment
        ref={commentAreaRef}
        device={device}
        value={comment}
        onChange={handleCommentChange}
        placeholder="느낀 점, 감상평, 인상 깊었던 내용 등을 자유롭게 적어주세요."
        maxLength={maxLength}
        isError={showError}
      />
      <MessageWrapper>
        <MinLengthMessage device={device} isError={showError}>
          {showError
            ? `최소 ${minLength}자 이상 입력해주세요`
            : `최소 ${minLength}자 이상`}
        </MinLengthMessage>
        <CharacterCount device={device} isError={showError}>
          {comment.length}/{maxLength}
        </CharacterCount>
      </MessageWrapper>
    </Container>
  );
};

export default CommentWriter;

const Container = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const Title = styled.h3<{ device: Device }>`
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.heading6 : theme.fonts.heading5};
`;

const Comment = styled.textarea<{ device: Device; isError: boolean }>`
  min-height: ${({ device }) => (device === 'mobile' ? '80px' : '120px')};
  padding: ${({ device }) => (device === 'mobile' ? '8px' : '12px')};
  border: 1px solid
    ${({ theme, isError }) =>
      isError ? theme.colors.error : theme.colors.stroke};
  border-radius: 8px;

  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.textPrimary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body2 : theme.fonts.body1};

  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme, isError }) =>
      isError ? theme.colors.error : theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textTertiary};
  }
`;

const MessageWrapper = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
`;

const MinLengthMessage = styled.p<{ device: Device; isError: boolean }>`
  color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};
`;

const CharacterCount = styled.p<{ device: Device; isError: boolean }>`
  margin-left: auto;

  color: ${({ theme, isError }) =>
    isError ? theme.colors.error : theme.colors.textSecondary};
  font: ${({ theme, device }) =>
    device === 'mobile' ? theme.fonts.body4 : theme.fonts.body3};
`;
